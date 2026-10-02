'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type ApiStatus = {
  liveApiEnabled: boolean;
  message: string;
};

const transactions = [
  { id: 'demo-001', title: 'Pix recebido', detail: 'Mariana Costa · Hoje, 14:32', amount: 1500, kind: 'pix' },
  { id: 'demo-002', title: 'Pagamento de fatura', detail: 'Cartão demonstrativo · Ontem, 09:15', amount: -340.5, kind: 'cartao' },
  { id: 'demo-003', title: 'Transferência enviada', detail: 'Reserva de emergência · 28 set, 16:08', amount: -250, kind: 'transferencia' },
];

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Home() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [filter, setFilter] = useState('todas');
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    liveApiEnabled: false,
    message: 'Verificando a configuração demonstrativa…',
  });
  const [checkingStatus, setCheckingStatus] = useState(false);

  const refreshApiStatus = useCallback(async () => {
    setCheckingStatus(true);
    try {
      const response = await fetch('/api/bb/status', { cache: 'no-store' });
      if (!response.ok) throw new Error('Não foi possível consultar o status.');
      const status = (await response.json()) as ApiStatus;
      setApiStatus(status);
    } catch {
      setApiStatus({
        liveApiEnabled: false,
        message: 'Status temporariamente indisponível. Nenhuma operação bancária foi executada.',
      });
    } finally {
      setCheckingStatus(false);
    }
  }, []);

  useEffect(() => {
    void refreshApiStatus();
  }, [refreshApiStatus]);

  const visibleTransactions = useMemo(
    () => transactions.filter((item) => filter === 'todas' || item.kind === filter),
    [filter],
  );

  return (
    <main id="inicio" className="mx-auto w-full max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:pb-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0038A8]">Visão geral</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">Olá, Bruna</h1>
          <p className="mt-2 text-sm text-gray-600">Um resumo simples da sua conta demonstrativa.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950">
          <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
          AMBIENTE DE DEMONSTRAÇÃO
        </span>
      </div>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]" aria-label="Resumo da conta">
        <article className="overflow-hidden rounded-3xl bg-[#0038A8] p-6 text-white shadow-lg shadow-blue-950/10 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-blue-100">Saldo disponível <span className="text-blue-200">(fictício)</span></p>
            <button
              type="button"
              className="min-h-11 rounded-xl border border-white/30 px-3 text-sm font-medium hover:bg-white/10"
              aria-label={balanceVisible ? 'Ocultar saldo demonstrativo' : 'Mostrar saldo demonstrativo'}
              aria-pressed={!balanceVisible}
              onClick={() => setBalanceVisible((visible) => !visible)}
            >
              {balanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
            </button>
          </div>
          <p className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl" aria-live="polite">
            {balanceVisible ? money.format(8450.7) : '••••••'}
          </p>
          <p className="mt-3 max-w-lg text-sm leading-6 text-blue-100">
            Valor ilustrativo para apresentação acadêmica. Esta tela não consulta uma conta bancária.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="inline-flex min-h-11 items-center rounded-xl bg-[#F8D117] px-4 text-sm font-bold text-gray-950 hover:bg-yellow-300" href="#movimentacoes">
              Ver movimentações
            </a>
            <a className="inline-flex min-h-11 items-center rounded-xl border border-white/35 px-4 text-sm font-semibold text-white hover:bg-white/10" href="#integracao">
              Status da integração
            </a>
          </div>
        </article>

        <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <p className="text-sm font-semibold text-gray-600">Conta de demonstração</p>
          <p className="mt-2 text-xl font-bold text-gray-950">Conta corrente</p>
          <dl className="mt-6 divide-y divide-gray-100 text-sm">
            <div className="flex justify-between gap-3 py-3"><dt className="text-gray-600">Agência</dt><dd className="font-semibold text-gray-950">0001 (fictícia)</dd></div>
            <div className="flex justify-between gap-3 py-3"><dt className="text-gray-600">Conta</dt><dd className="font-semibold text-gray-950">12345-6 (fictícia)</dd></div>
            <div className="flex justify-between gap-3 py-3"><dt className="text-gray-600">Última atualização</dt><dd className="font-semibold text-gray-950">Dados estáticos</dd></div>
          </dl>
        </article>
      </section>

      <section id="movimentacoes" className="mt-8 scroll-mt-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="transactions-title">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Exemplos fictícios</p>
            <h2 id="transactions-title" className="mt-1 text-xl font-bold text-gray-950">Movimentações recentes</h2>
          </div>
          <label className="flex min-h-11 items-center gap-2 text-sm font-medium text-gray-700">
            <span>Filtrar</span>
            <select
              className="min-h-11 rounded-xl border border-gray-300 bg-white px-3 text-gray-900 focus:border-[#0038A8]"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="pix">Pix</option>
              <option value="cartao">Cartão</option>
              <option value="transferencia">Transferências</option>
            </select>
          </label>
        </div>
        <ul className="divide-y divide-gray-100" aria-live="polite">
          {visibleTransactions.map((transaction) => (
            <li key={transaction.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-bold text-[#0038A8]" aria-hidden="true">
                  {transaction.amount > 0 ? '+' : '−'}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-950">{transaction.title}</p>
                  <p className="text-sm text-gray-600">{transaction.detail}</p>
                </div>
              </div>
              <span className={`font-bold tabular-nums ${transaction.amount > 0 ? 'text-emerald-800' : 'text-gray-900'}`}>
                {transaction.amount > 0 ? '+' : '−'} {money.format(Math.abs(transaction.amount))}
              </span>
            </li>
          ))}
          {visibleTransactions.length === 0 && (
            <li className="py-8 text-center text-sm text-gray-600">Nenhuma movimentação nesta categoria.</li>
          )}
        </ul>
      </section>

      <section id="integracao" className="mt-8 scroll-mt-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="integration-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0038A8]">Conexão bancária</p>
            <h2 id="integration-title" className="mt-1 text-xl font-bold text-gray-950">Banco do Brasil</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600" role="status" aria-live="polite">
              {apiStatus.message}
            </p>
          </div>
          <span className={`rounded-full px-3 py-2 text-xs font-bold ${apiStatus.liveApiEnabled ? 'bg-emerald-100 text-emerald-900' : 'bg-gray-100 text-gray-800'}`}>
            {apiStatus.liveApiEnabled ? 'API ATIVA' : 'SEM CONEXÃO REAL'}
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="min-h-11 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-60"
            onClick={() => void refreshApiStatus()}
            disabled={checkingStatus}
          >
            {checkingStatus ? 'Verificando…' : 'Verificar status'}
          </button>
          <a
            className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold text-[#0038A8] underline decoration-[#F8D117] decoration-2 underline-offset-4 hover:text-[#00287A]"
            href="https://www.bb.com.br/site/developers/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portal oficial Developers BB
          </a>
        </div>
        <p className="mt-4 text-xs leading-5 text-gray-600">
          Nenhum produto, endpoint, credencial ou fluxo OAuth do BB está configurado. Não são enviados dados nem feitas operações bancárias.
        </p>
      </section>
    </main>
  );
}
