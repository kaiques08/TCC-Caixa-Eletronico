# Validador SAML 2.0 do SENAI FinUp

Serviço Node.js separado do site, responsável por iniciar o SAML, validar a resposta assinada do SENAI e emitir uma sessão opaca para o FinUp. Ele não coleta nem armazena CPF ou senha da Conta SENAI.

## Instalação

```bash
npm install
cp .env.example .env
npm run metadata:sp
npm run saml:check
npm start
```

Coloque a metadata oficial recebida do SENAI em `config/senai-idp-metadata.xml` ou configure `SENAI_IDP_METADATA_URL` com um host HTTPS incluído em `SENAI_METADATA_ALLOWED_HOSTS`. Não use o XML de exemplo em produção.

## Endpoints

| Endpoint | Uso |
|---|---|
| `GET /saml/metadata` | Metadata pública do Service Provider |
| `GET /auth/senai/start` | Inicia a AuthnRequest SAML |
| `POST /auth/senai/callback` | ACS que valida a SAMLResponse e conclui o login |
| `GET /api/saml/status` | Checklist sem segredos, protegido pelo token técnico |
| `GET /api/bridge/session` | Valida o token opaco usado pelo site |
| `POST /api/bridge/logout` | Revoga o token opaco |
| `POST /api/bridge/validate` | Compatibilidade com o callback intermediário do site |

O `SAML_BRIDGE_TOKEN` deve ser igual ao `SENAI_SAML_VALIDATOR_TOKEN` configurado no site. No site, use:

```dotenv
SENAI_SSO_START_URL=https://auth.seudominio.com/auth/senai/start
SENAI_SAML_ENTITY_ID=https://auth.seudominio.com/saml/metadata
SENAI_SAML_ACS_URL=https://auth.seudominio.com/auth/senai/callback
SENAI_SAML_VALIDATOR_URL=https://auth.seudominio.com/api/bridge/validate
SENAI_SAML_STATUS_URL=https://auth.seudominio.com/api/saml/status
SENAI_SAML_SESSION_URL=https://auth.seudominio.com/api/bridge/session
SENAI_SAML_LOGOUT_URL=https://auth.seudominio.com/api/bridge/logout
SENAI_SAML_VALIDATOR_TOKEN=mesmo-valor-longo-de-SAML_BRIDGE_TOKEN
SENAI_SSO_ALLOWED_HOSTS=auth.seudominio.com,identidade.senai.br
```

## Segurança aplicada

- certificado(s) X.509 obtidos da metadata oficial do IdP;
- assinatura obrigatória da Response e da Assertion;
- audiência igual ao Entity ID do FinUp;
- `validateInResponseTo: "always"` com cache de Request ID;
- limite de idade da Assertion e tolerância de relógio reduzida;
- SHA-256 para assinatura e digest;
- regeneração da sessão após autenticação válida;
- cookie de produção `__Host-finup.sid`, `Secure`, `HttpOnly`, `SameSite=None`, `Path=/`;
- token opaco de 384 bits para a ponte com o site;
- allowlist de atributos, sem persistir a resposta SAML bruta ou a senha SENAI.

O armazenamento em arquivos é adequado ao protótipo em uma única instância. Em múltiplas instâncias, substitua o cache de Request IDs e as sessões por Redis ou banco compartilhado, mantendo expiração e consumo único.
