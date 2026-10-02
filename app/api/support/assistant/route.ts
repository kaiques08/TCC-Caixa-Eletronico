const noStoreHeaders = {
  'Cache-Control': 'no-store, private',
  'X-Content-Type-Options': 'nosniff',
};

function answerFor(question: string, role: string, balance: number) {
  const text = question.toLocaleLowerCase('pt-BR');

  if (/pix|transfer|pagamento/.test(text)) {
    return 'Esta tela exibe apenas movimentações fictícias para demonstração. Não envia Pix, não consulta saldo e não acessa uma conta bancária.';
  }
  if (/banco do brasil|\bbb\b|integra[cç][aã]o|api/.test(text)) {
    return 'A conexão com o Banco do Brasil ainda não está implementada. Consulte o Portal Developers oficial para identificar um produto aprovado e seus requisitos. Nenhum endpoint ou credencial está configurado neste protótipo.';
  }
  if (/saldo|conta/.test(text)) {
    return `O saldo exibido é fictício e serve somente para a apresentação acadêmica. Perfil atual: ${role}. Créditos/saldo demonstrativo: ${balance}.`;
  }
  return 'Sou o assistente demonstrativo do FinBank. Posso explicar o saldo fictício, as movimentações de exemplo e o estado da integração com o Banco do Brasil; não realizo operações financeiras.';
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: 'Envie uma solicitação JSON válida.' }, { status: 400, headers: noStoreHeaders });
  }

  if (!payload || typeof payload !== 'object') {
    return Response.json({ message: 'Informe uma pergunta válida.' }, { status: 400, headers: noStoreHeaders });
  }

  const { question, role, negotiationBalance } = payload as Record<string, unknown>;
  if (typeof question !== 'string' || question.trim().length < 2 || question.trim().length > 300) {
    return Response.json({ message: 'A pergunta deve ter entre 2 e 300 caracteres.' }, { status: 400, headers: noStoreHeaders });
  }
  if (!['aluno', 'professor', 'adm', 'desenvolvedor'].includes(String(role))) {
    return Response.json({ message: 'Perfil demonstrativo inválido.' }, { status: 400, headers: noStoreHeaders });
  }
  if (typeof negotiationBalance !== 'number' || !Number.isFinite(negotiationBalance) || negotiationBalance < 0) {
    return Response.json({ message: 'Saldo demonstrativo inválido.' }, { status: 400, headers: noStoreHeaders });
  }

  return Response.json(
    {
      answer: answerFor(question.trim(), String(role), negotiationBalance),
      mode: 'demo',
      liveBanking: false,
    },
    { headers: noStoreHeaders },
  );
}
