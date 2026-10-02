const officialDeveloperPortal = 'https://www.bb.com.br/site/developers/';

export async function GET() {
  return Response.json(
    {
      ok: true,
      provider: 'Banco do Brasil',
      mode: 'demo',
      configured: false,
      liveApiEnabled: false,
      supportedProducts: [],
      message: 'Nenhum produto ou endpoint BB foi confirmado e configurado para este projeto. A demonstração não faz chamadas bancárias.',
      documentation: officialDeveloperPortal,
      checkedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, private',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  );
}
