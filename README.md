# FinBank — protótipo acadêmico

Painel demonstrativo responsivo para apresentar uma experiência bancária com acessibilidade e uma fronteira de integração documentada para o Banco do Brasil. **Não é um aplicativo bancário:** saldos, contas e movimentações são fictícios; não há acesso a contas, transferências, cobranças Pix ou pagamentos reais.

## Executar

Requer Node.js `>=22.13.0` e npm. Instale as dependências já registradas no `package-lock.json` e use os scripts do projeto:

```bash
npm ci
npm run dev
```

Para verificar e gerar a versão de produção:

```bash
npm test
npm run lint
```

`npm test` executa a construção e os testes do HTML distribuído. O painel App Router também oferece uma demonstração com saldo ocultável, filtro de movimentações e navegação adaptada para telas pequenas.

## Interfaces e arquitetura

- `app/`: interface FinBank em React/Next App Router, rotas HTTP e layout responsivo.
- `public/`: demonstração FinUp/Caixa SENAI mantida para compatibilidade com o fluxo acadêmico existente; pode ser aberta por `public/index.html`.
- `worker/`, `vite.config.ts` e `build/`: runtime de hospedagem Vite/vinext com integração Cloudflare.
- `db/`, `drizzle/`: modelos e migrações do protótipo; não representam uma conta bancária real.
- `integrations/`: validador institucional SENAI opcional, independente da integração BB.
- `tests/` e `scripts/`: testes de artefatos e rotinas de desenvolvimento/build.

O painel FinBank usa a paleta azul e amarela já presente no projeto, superfícies sem desfoque custoso, navegação por âncoras com atalhos móveis, foco visível, mensagens de status anunciáveis e controles com alvos de toque. O movimento respeita `prefers-reduced-motion`.

### Perfis da demonstração FinUp

A tela inicial oferece quatro perfis com áreas e permissões distintas: **Aluno** (negocia serviços, acompanha créditos e trilhas), **Docente** (acompanha turmas, valida entregas e concede créditos), **ADM** (consulta registros e indicadores institucionais demonstrativos e acompanha auditoria) e **Desenvolvedor** (consulta estado técnico e integrações sem acessar registros acadêmicos). Todos os dados são fictícios; o perfil Desenvolvedor não recebe privilégios administrativos de registro. Sessões antigas marcadas como Diretor/Admin são migradas para ADM, que substitui esse papel no fluxo atual.

A página standalone carrega `public/assets/js/script.js` diretamente para que os recursos atuais funcionem também ao abrir o HTML localmente, sem depender de um bundle eventualmente desatualizado. O script de build continua gerando `app.min.js` para distribuição futura. No Caixa, o tema claro/escuro e o Alto contraste estão disponíveis na entrada, no cabeçalho e em Meu perfil, com preferências locais sincronizadas. A tela de entrada foi reorganizada para preencher a janela em desktop, com identidade visual e cartão de seleção de perfil lado a lado; no celular, as áreas se empilham. Fundo, cartão, textos, perfis de acesso, assistente e controles acompanham o tema claro/escuro com contraste legível. Os menus de perfil e acessibilidade usam realces discretos no hover/foco, sem blocos brancos fortes no tema escuro. As tabelas de turmas e grupos ocupam toda a largura disponível em vez de reservar uma coluna vazia, e se ajustam ao espaço do conteúdo. O cartão de créditos do aluno usa vermelho SENAI (#e30613) no tema claro e vinho (#681413) no tema escuro; o atalho “Abrir suporte” também acompanha o tema. Botões primários e secundários têm estados legíveis nos dois temas; cartões e atalhos usam realce sutil sem clarear o fundo inteiro, incluindo linhas de tabelas, e as transições respeitam `prefers-reduced-motion`. A tela Meu perfil apresenta identidade, unidade/setor, escopo de permissões e preferências de forma consistente para os quatro perfis; o indicador “Perfil ativo” fica centralizado e não quebra em telas estreitas.

Os painéis iniciais dos quatro perfis agora compartilham a hierarquia visual do Aluno — destaque principal e cartões de resumo responsivos — com métricas e ações próprias preservadas para Docente, ADM e Desenvolvedor. O painel técnico mantém explícito que o status é demonstrativo e que nenhuma API bancária live está conectada.

## Integração com o Banco do Brasil

O Portal Developers oficial é a fonte de documentação: [bb.com.br/site/developers](https://www.bb.com.br/site/developers/). A página pública consultada confirma que o portal documenta como conectar negócios às APIs do BB, mas não expõe nessa página um produto, endpoint, escopo ou fluxo de autenticação específico aprovado para este projeto. Como também não há credenciais nem aprovação de aplicação disponíveis, **nenhuma rota de negócio, chamada OAuth, Pix, consulta de saldo ou operação financeira foi implementada**.

`GET /api/bb/status` é somente um **health/configuration status da demonstração**. Responde `mode: "demo"`, `configured: false`, `liveApiEnabled: false`, lista vazia de produtos e o link oficial. Não autentica no BB, não testa credenciais, não indica disponibilidade do banco e não acessa dados ou contas. O status HTTP 200 significa apenas que essa resposta local está disponível.

Não há credenciais ou aprovação BB disponíveis neste repositório. Nenhuma variável BB é necessária para executar o demo; não inclua segredos em código, arquivos `public/`, variáveis `NEXT_PUBLIC_*` ou no controle de versão. Para uma integração posterior:

1. Cadastrar a aplicação e obter aprovação para o produto desejado no portal oficial.
2. Confirmar na documentação do produto seus endpoints, ambientes, escopos, autenticação, certificados, consentimento e requisitos de segurança.
3. Implementar apenas o contrato confirmado em rota de servidor, usando secrets do ambiente de hospedagem e validando autenticação, autorização, entradas, limites e erros.
4. Manter o demo com dados claramente fictícios até concluir homologação e aprovação de produção.

## Limites atuais

- O saldo e o extrato do painel App Router são exemplos estáticos locais; ocultar saldo e filtrar categorias funcionam apenas na interface.
- O assistente da rota `/api/support/assistant` é um FAQ determinístico de demonstração; não usa IA externa nem consulta bancos.
- A aplicação FinUp/Caixa SENAI preserva os recursos acadêmicos com quatro perfis demonstrativos (Aluno, Docente, ADM e Desenvolvedor); integrações SENAI/ngrok continuam independentes e protegidas por autorização no servidor.
- Não são solicitados CPF, senha bancária ou consentimento Open Finance neste protótipo.
