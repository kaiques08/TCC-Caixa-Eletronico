# Dados para aprovação da Identidade SENAI

Preencha este documento com o responsável de TI/SENAI antes de alterar as três confirmações `SENAI_*_APPROVED` para `true`.

## 1. Aplicação — Entity ID aprovado

- Nome: SENAI FinUp / Caixa Eletrônico SENAI
- Entity ID proposto: `https://SEU-HOST-SAML/saml/metadata`
- Metadata do SP: `https://SEU-HOST-SAML/saml/metadata`
- Confirmação formal do SENAI: pendente

## 2. Retorno — ACS / callback HTTPS

- Binding: HTTP-POST
- ACS: `https://SEU-HOST-SAML/auth/senai/callback`
- Callback interno do FinUp: `https://SEU-HOST-FINUP/api/auth/senai/callback`
- Confirmação de cadastro do ACS: pendente

## 3. Provedor — SSO URL e metadata

Solicitar ao SENAI:

- metadata XML oficial do IdP;
- Entity ID do IdP;
- SSO URL e Binding autorizado;
- ambiente de homologação, se disponível;
- política de renovação/rotação da metadata e certificados.

## 4. Segurança — Certificado e backend validador

O backend está configurado para validar:

- certificado(s) X.509 oficial(is) do IdP;
- assinatura da SAML Response e da Assertion;
- audiência do Service Provider;
- `InResponseTo` obrigatório e Request ID com expiração;
- validade temporal e idade máxima da Assertion;
- tolerância de relógio limitada;
- assinatura e digest SHA-256.

Não inserir certificados fictícios. Depois de receber a metadata, executar `npm run saml:check` e registrar os fingerprints SHA-256 em canal seguro com o responsável do SENAI.

## 5. Sessão — Cookie seguro após validação

Em produção, a sessão só é criada depois da validação SAML e usa:

- `__Host-finup.sid`;
- `Secure`;
- `HttpOnly`;
- `SameSite=None`;
- `Path=/`;
- regeneração do identificador de sessão;
- token opaco e revogável entre validador e FinUp.

## 6. Dados — Atributos autorizados

Solicitar os nomes/URIs exatos dos atributos autorizados:

- identificador único;
- nome;
- e-mail;
- perfil (`aluno`, `professor/docente` ou `diretor/direção`);
- matrícula, somente se necessária e autorizada.

CPF permanece desativado. O FinUp não recebe nem armazena a senha da Conta SENAI e não persiste a SAMLResponse bruta.

## Entrega ao SENAI

Enviar somente depois de definir os hosts HTTPS reais:

- arquivo `dist/finup-sp-metadata.xml`, gerado por `npm run metadata:sp`;
- Entity ID e ACS acima;
- contatos técnico e responsável pelo tratamento de dados;
- lista mínima de atributos;
- URLs de homologação e produção;
- política de logout, sessão e resposta a incidentes.
