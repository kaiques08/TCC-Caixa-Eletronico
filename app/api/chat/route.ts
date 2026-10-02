import { env } from 'cloudflare:workers';
import { getTestSessionUser, type TestSessionUser } from '@/app/api/auth/test/session-store';

type ChatRole = 'aluno' | 'professor' | 'adm' | 'desenvolvedor';
type ChatRow = {
  id: number;
  author_name: string;
  role: string;
  turma: string;
  content: string;
  created_at: number;
};
type Statement = {
  bind: (...values: unknown[]) => Statement;
  all: <T>() => Promise<{ results: T[] }>;
  run: () => Promise<unknown>;
};
type Database = {
  prepare: (query: string) => Statement;
  batch: (statements: Statement[]) => Promise<unknown>;
};
type Authorization =
  | { user: TestSessionUser; response?: never }
  | { user: null; response: Response };

const responseHeaders = {
  'Cache-Control': 'no-store, private',
  'X-Content-Type-Options': 'nosniff',
};

const roleLabels: Record<ChatRole, string> = {
  aluno: 'Aluno',
  professor: 'Docente',
  adm: 'ADM',
  desenvolvedor: 'Desenvolvedor',
};

const turmaByRole: Record<ChatRole, string> = {
  aluno: 'DS2',
  professor: 'Docência',
  adm: 'Administração',
  desenvolvedor: 'Tecnologia',
};

function database() {
  return (env as unknown as { DB?: Database }).DB;
}

async function ensureSchema(db: Database) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      author_email TEXT NOT NULL,
      author_name TEXT NOT NULL,
      role TEXT NOT NULL,
      turma TEXT NOT NULL,
      channel TEXT DEFAULT 'geral' NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`),
    db.prepare('CREATE INDEX IF NOT EXISTS chat_messages_channel_created_at_idx ON chat_messages (channel, created_at)'),
  ]);
}

async function authorizedUser(request: Request): Promise<Authorization> {
  const session = await getTestSessionUser(request);
  if (!session.user) {
    return {
      user: null,
      response: Response.json(
        { message: session.status === 503 ? 'O serviço de sessão está indisponível.' : 'Entre no perfil de demonstração para usar o chat.' },
        { status: session.status, headers: responseHeaders },
      ),
    };
  }
  return { user: session.user };
}

export async function GET(request: Request) {
  const auth = await authorizedUser(request);
  if (!auth.user) return auth.response;

  const db = database();
  if (!db) return Response.json({ message: 'O armazenamento do chat está indisponível.' }, { status: 503, headers: responseHeaders });

  try {
    await ensureSchema(db);
    const result = await db.prepare(`SELECT id, author_name, role, turma, content, created_at
      FROM chat_messages WHERE channel = ? ORDER BY created_at DESC LIMIT 100`)
      .bind('geral')
      .all<ChatRow>();
    const messages = result.results.reverse().map((row) => ({
      id: row.id,
      authorName: row.author_name,
      role: row.role === 'diretor' || row.role === 'admin' ? 'adm' : row.role,
      turma: row.turma,
      content: row.content,
      createdAt: new Date(row.created_at).toISOString(),
    }));
    return Response.json({ messages }, { headers: responseHeaders });
  } catch {
    return Response.json({ message: 'Não foi possível carregar as mensagens agora.' }, { status: 503, headers: responseHeaders });
  }
}

export async function POST(request: Request) {
  const auth = await authorizedUser(request);
  if (!auth.user) return auth.response;

  const db = database();
  if (!db) return Response.json({ message: 'O armazenamento do chat está indisponível.' }, { status: 503, headers: responseHeaders });
  if (request.headers.get('content-type')?.split(';', 1)[0].trim() !== 'application/json') {
    return Response.json({ message: 'Envie a mensagem como JSON.' }, { status: 415, headers: responseHeaders });
  }
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 8_192) {
    return Response.json({ message: 'A solicitação excede o tamanho permitido.' }, { status: 413, headers: responseHeaders });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: 'Envie um JSON válido.' }, { status: 400, headers: responseHeaders });
  }
  if (!payload || typeof payload !== 'object') {
    return Response.json({ message: 'Informe o conteúdo da mensagem.' }, { status: 400, headers: responseHeaders });
  }

  const content = (payload as Record<string, unknown>).content;
  if (typeof content !== 'string' || content.trim().length < 2 || content.trim().length > 500) {
    return Response.json({ message: 'A mensagem deve ter entre 2 e 500 caracteres.' }, { status: 400, headers: responseHeaders });
  }

  try {
    await ensureSchema(db);
    const { user } = auth;
    await db.prepare(`INSERT INTO chat_messages
      (author_email, author_name, role, turma, channel, content, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(user.email, user.name, user.role, turmaByRole[user.role], 'geral', content.trim(), Date.now())
      .run();
    return Response.json({ ok: true, roleLabel: roleLabels[user.role] }, { status: 201, headers: responseHeaders });
  } catch {
    return Response.json({ message: 'Não foi possível enviar a mensagem agora.' }, { status: 503, headers: responseHeaders });
  }
}
