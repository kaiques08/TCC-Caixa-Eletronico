import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinBank | Demonstração acadêmica',
  description: 'Protótipo acadêmico de uma experiência bancária. Saldos e movimentações são fictícios; não há conexão com contas reais.',
  themeColor: '#0038A8',
};

const navigation = [
  { href: '#inicio', label: 'Visão geral', icon: '⌂' },
  { href: '#movimentacoes', label: 'Movimentações', icon: '↕' },
  { href: '#integracao', label: 'Banco do Brasil', icon: '◎' },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#F4F7F9] font-sans text-gray-950 antialiased selection:bg-[#F8D117] selection:text-gray-950">
        <a href="#inicio" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-[#0038A8]">
          Ir para o conteúdo
        </a>
        <div className="min-h-screen sm:grid sm:grid-cols-[76px_minmax(0,1fr)] md:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden border-r border-gray-200 bg-white sm:sticky sm:top-0 sm:flex sm:h-screen sm:flex-col sm:px-3 sm:py-6 md:px-5">
            <a href="#inicio" className="mb-9 flex items-center justify-center gap-3 rounded-xl text-[#0038A8] md:justify-start" aria-label="FinBank, início">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0038A8] text-lg font-bold text-white">F</span>
              <span className="hidden text-xl font-bold tracking-tight md:block">FinBank</span>
            </a>
            <nav aria-label="Navegação principal" className="flex flex-col gap-2">
              {navigation.map(({ href, label, icon }) => (
                <a key={href} href={href} className="flex min-h-12 items-center justify-center gap-3 rounded-xl px-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0038A8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0038A8] md:justify-start">
                  <span className="w-5 text-center text-lg" aria-hidden="true">{icon}</span>
                  <span className="hidden md:block">{label}</span>
                </a>
              ))}
            </nav>
            <p className="mt-auto hidden rounded-xl bg-gray-50 p-3 text-xs leading-5 text-gray-600 md:block">
              Protótipo acadêmico.<br />Sem dinheiro real ou acesso bancário.
            </p>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
        <nav aria-label="Navegação móvel" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-gray-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_24px_rgba(17,24,39,.08)] backdrop-blur sm:hidden">
          {navigation.map(({ href, label, icon }) => (
            <a key={href} href={href} className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0038A8] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0038A8]">
              <span className="text-lg leading-5" aria-hidden="true">{icon}</span>
              {label}
            </a>
          ))}
        </nav>
      </body>
    </html>
  );
}
