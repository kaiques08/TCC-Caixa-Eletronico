# FinBank — arquitetura e escopo técnico

## Objetivo e estado

Projeto acadêmico de interface bancária para demonstração. Não é uma instituição financeira nem está conectado a uma conta real. Os valores e transações do painel são dados ilustrativos. Recursos de exibição local não autorizam ou realizam operações financeiras.

O repositório também mantém a experiência independente FinUp/Caixa SENAI, com seus perfis acadêmicos. Ela não deve ser confundida com o painel FinBank nem com uma integração do Banco do Brasil.

## Componentes

- **Interface FinBank (`app/page.tsx`, `app/layout.tsx`)**: página React client-side com saldo demonstrativo ocultável, filtro local do extrato, status de integração, navegação por âncoras e navegação móvel. Paleta azul/amarela existente, layout responsivo e foco visível. A fonte usa a pilha do sistema para evitar download obrigatório de fonte remota.
- **Estilos (`app/globals.css`)**: tokens de cor, superfícies sem blur e movimento reduzido conforme preferência do sistema.
- **Status BB (`GET /api/bb/status`)**: responde o estado local da integração (`configured: false`, `liveApiEnabled: false`). É health/configuration status somente; não autentica, não consulta endpoint do banco, não valida credencial e não prova disponibilidade do BB.
- **Assistente (`POST /api/support/assistant`)**: FAQ determinístico demonstrativo, com validação do formato, perfil e tamanho de pergunta. Não é um serviço de IA e não faz chamada bancária.
- **Chat (`GET/POST /api/chat`)**: exige sessão válida de demonstração, usa o banco D1 da hospedagem e limita o histórico retornado. O perfil e a identidade são lidos da sessão do servidor, não dos campos de identidade enviados pelo navegador.
- **Demonstração FinUp (`public/`)**: interface acadêmica separada, aberta por `public/index.html`, com dados locais, quatro perfis com escopo distinto e integrações institucionais SENAI independentes.
- **Runtime e persistência**: Next App Router executado pelo fluxo Vite/vinext/Cloudflare descrito em `vite.config.ts` e `worker/index.ts`. `db/schema.ts` e `drizzle/` mantêm modelos/migrações do protótipo; não implicam sincronização com sistemas bancários.

## Banco do Brasil: verificação, fronteira e próximos passos

Fonte oficial consultada: [Portal Developers BB](https://www.bb.com.br/site/developers/), acessado em 2 de outubro de 2026. A página pública confirma que o portal documenta como conectar negócios às APIs BB, mas não expõe ali especificação de produto, endpoint, escopo ou autenticação para esta aplicação. Sem cadastro/aprovação da aplicação e credenciais neste ambiente, não é possível selecionar e homologar legitimamente um produto. Portanto, não se presume OAuth `client_credentials`, API Pix, Open Finance ou qualquer rota.

Não há credenciais, cadastro de aplicação ou aprovação BB neste ambiente. A única URL implementada relacionada à integração é `GET /api/bb/status`, que retorna metadados locais de demonstração e um link para o portal. Seu sucesso HTTP **não** significa que uma API BB foi alcançada. Não há proxy de negócio ou rota Pix implementada.

Antes de integrar:

1. Cadastrar a aplicação e solicitar aprovação para um produto específico no portal oficial.
2. Confirmar documentação, endpoints de sandbox/produção, método de autenticação, escopos, certificados, consentimento, limites e obrigações de segurança desse produto.
3. Implementar o acesso exclusivamente no servidor, restrito a endpoints documentados e com segredos em variáveis protegidas do ambiente de hospedagem. Nunca expor segredo no JavaScript, HTML público, `NEXT_PUBLIC_*` ou repositório.
4. Homologar com credenciais aprovadas e manter todos os indicadores e dados de demonstração identificados até a aprovação de produção.

## Segurança e privacidade

- Não solicitar nem persistir credenciais bancárias, CPF ou tokens BB.
- O assistente retorna FAQ determinístico, não interpreta instruções como chamadas bancárias.
- As telas de demonstração identificam valores como fictícios.
- Segredos institucionais SENAI/ngrok são uma integração separada e devem permanecer no ambiente do servidor conforme `.env.example` e os documentos de `integrations/`.

## Perfis FinUp/Caixa SENAI

O fluxo de demonstração disponibiliza **Aluno**, **Docente**, **ADM** e **Desenvolvedor**. Aluno e Docente mantêm os fluxos de negociação e acompanhamento pedagógico. ADM reúne visão institucional, registro geral demonstrativo e auditoria. Desenvolvedor acessa verificações técnicas e o estado das integrações, mas não o registro acadêmico nem a auditoria institucional. As rotas de registro autorizam consulta de dados apenas ao ADM; consulta de configuração é permitida ao ADM e ao Desenvolvedor. A verificação ngrok mantém a allowlist de e-mails autorizados no servidor.

O perfil legado Diretor/Admin é normalizado para ADM nas sessões de teste já persistidas e em identificações institucionais que tragam esses nomes. Desenvolvedor é perfil exclusivo da demonstração e não é atribuído por uma identidade institucional. A interface standalone carrega `public/assets/js/script.js` como fonte para evitar que o bundle `app.min.js` fique desatualizado quando não há runtime de build; a rotina de build segue gerando o bundle para futura distribuição. Tema claro/escuro e Alto contraste podem ser alternados desde a tela de entrada, o cabeçalho e Meu perfil; os controles e atributos `aria-pressed` permanecem sincronizados e as preferências são salvas no navegador. A entrada ocupa a janela em desktop, com apresentação e seleção de perfil em colunas; em telas menores, o layout se empilha. Painel, cartão, tipografia, cartões de perfil e controles de acessibilidade têm superfícies e cores de texto específicas para cada tema. Menus de perfil e acessibilidade usam superfícies discretamente realçadas no hover/foco, sem clarões brancos no tema escuro. As tabelas de turmas e grupos usam uma única coluna fluida, preenchendo toda a área de conteúdo sem deixar a segunda coluna vazia; tabela e células podem encolher e quebrar texto no espaço disponível. O selo “Perfil ativo” mantém o texto centralizado em uma linha, inclusive em telas estreitas. Botões primários, secundários, negociações e ações da carteira recebem cores de texto/fundo explícitas por tema; hover/foco altera borda, fundo e sombra sem apagar o destaque dos demais controles. Linhas de tabela recebem apenas uma superfície de destaque suave e contorno interno no hover/foco, sem o fundo branco contrastante no tema escuro. Cartões mantêm a cor de superfície do tema, com elevação discreta, e transições são desativadas quando o usuário prefere movimento reduzido. O tema escuro transforma o cartão de créditos do grupo em vinho (#681413); no tema claro ele usa o vermelho SENAI (#e30613). O atalho para suporte e a página de perfil também respeitam a paleta ativa em todos os perfis.

Os painéis iniciais dos quatro perfis usam uma hierarquia comum à tela do Aluno, composta por destaque principal e cartões de resumo fluidos, com métricas e ações próprias preservadas para cada papel. Docente mantém turmas, validações, avaliações e créditos; ADM mantém registro, indicadores, auditoria e integrações; Desenvolvedor mantém verificações técnicas e explicita que não existe conexão bancária live. Os textos e ações continuam específicos às permissões de cada papel.

## Desenvolvimento e verificação

Requer Node.js `>=22.13.0`. Com as dependências do lockfile instaladas:

```bash
npm run dev
npm test
npm run lint
```

`npm test` executa a construção e `tests/rendered-html.test.mjs`. A configuração atual espera Node.js e ferramentas instaladas do projeto para essas rotinas.
