import { getTestSessionUser, type TestSessionUser } from "../test/session-store";

export type SenaiSessionUser = TestSessionUser;

// Mantém o contrato interno das APIs existentes enquanto o frontend opera
// exclusivamente no modo de demonstração. Nenhuma Conta SENAI é consultada.
export async function getSenaiSessionUser(request: Request) {
  return getTestSessionUser(request);
}
