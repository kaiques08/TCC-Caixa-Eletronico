import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("build emits the worker and lightweight static files", async () => {
  const worker = await readFile(new URL("../dist/server/index.js", import.meta.url), "utf8");
  const index = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");

  assert.match(worker, /cloudflare:workers/);
  assert.match(index, /FinUp — Banco Digital SENAI/);
  assert.match(index, /assets\/css\/lite\.css/);
  assert.match(index, /assets\/js\/script\.js/);
});

test("ships the lightweight standalone interface", async () => {
  const index = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  const liteCss = await readFile(new URL("../public/assets/css/lite.css", import.meta.url), "utf8");
  const edition = await readFile(new URL("../public/assets/js/edition.js", import.meta.url), "utf8");
  const app = await readFile(new URL("../public/assets/js/app.min.js", import.meta.url), "utf8");

  assert.match(index, /assets\/css\/lite\.css/);
  assert.match(liteCss, /html\[data-performance="lite"\]\s+\.login-brand\s*\{[^}]*align-items:\s*flex-start;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\s+\.page-head p\s*\{\s*display:\s*block;/);
  assert.match(index, /assets\/js\/legacy\.js/);
  assert.match(index, /assets\/js\/script\.js/);
  assert.doesNotMatch(index, /fonts\.googleapis\.com/);
  assert.doesNotMatch(index, /vlibras-plugin\.js/);
  assert.match(edition, /FINUP_LITE\s*=\s*window\.location\.protocol\s*===\s*"file:"\s*\|\| offline/);
  assert.match(edition, /dataset\.performance\s*=\s*"lite"/);
  assert.ok(app.length > 1000);
});

test("exposes four scoped FinUp demo profiles in the standalone UI and server", async () => {
  const index = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../public/assets/js/script.js", import.meta.url), "utf8");
  const sessions = await readFile(new URL("../app/api/auth/test/session-store.ts", import.meta.url), "utf8");
  const registry = await readFile(new URL("../app/api/senai/registro/route.ts", import.meta.url), "utf8");
  const ngrok = await readFile(new URL("../app/api/ngrok/status/route.ts", import.meta.url), "utf8");
  const chat = await readFile(new URL("../app/api/chat/route.ts", import.meta.url), "utf8");
  const assistant = await readFile(new URL("../app/api/support/assistant/route.ts", import.meta.url), "utf8");
  const saml = await readFile(new URL("../app/api/auth/senai/callback/route.ts", import.meta.url), "utf8");

  for (const role of ["aluno", "professor", "adm", "desenvolvedor"]) {
    assert.match(index, new RegExp(`data-role="${role}"`));
    assert.match(script, new RegExp(`${role}: \\[`));
    assert.match(sessions, new RegExp(`${role}: \\{`));
  }
  assert.match(index, /<strong>ADM<\/strong>/);
  assert.match(index, /<strong>Desenvolvedor<\/strong>/);
  assert.match(script, /user\?\.role === "diretor" \|\| user\?\.role === "admin" \? "adm"/);
  assert.match(sessions, /value === "diretor" \|\| value === "admin"\) return "adm"/);
  assert.match(registry, /session\.user\.role !== "adm"/);
  assert.match(ngrok, /!?\["adm", "desenvolvedor"\]\.includes\(user\.role\)/);
  assert.match(chat, /type ChatRole = 'aluno' \| 'professor' \| 'adm' \| 'desenvolvedor'/);
  assert.match(assistant, /'aluno', 'professor', 'adm', 'desenvolvedor'/);
  assert.match(saml, /role === "diretor"[\s\S]*?return "adm"/);
  assert.doesNotMatch(saml, /return "desenvolvedor"/);
  assert.match(script, /Dados demonstrativos/);
  assert.match(script, /state\.role === "desenvolvedor" \? developerEvents/);
});

test("provides usable dark theme and high-contrast controls in the standalone UI", async () => {
  const index = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../public/assets/js/script.js", import.meta.url), "utf8");
  const liteCss = await readFile(new URL("../public/assets/css/lite.css", import.meta.url), "utf8");

  assert.match(index, /data-action="toggle-theme"[^>]*aria-pressed="false"/);
  assert.match(index, /id="loginThemeLabel">Modo escuro<\/span>/);
  assert.match(index, /data-action="high-contrast"[^>]*aria-pressed="false"[^>]*>[\s\S]*?Alto contraste/);
  assert.match(script, /document\.documentElement\.dataset\.theme = state\.theme/);
  assert.match(script, /document\.querySelectorAll\('\[data-action="toggle-theme"\]'\)/);
  assert.match(script, /document\.documentElement\.dataset\.contrast = state\.highContrast \? "high" : "normal"/);
  assert.match(script, /document\.querySelectorAll\('\[data-action="high-contrast"\]'\)/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-theme="dark"\]\s*\{[\s\S]*?--canvas:\s*#141518;[\s\S]*?color-scheme:\s*dark;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-contrast="high"\]\s*\{[\s\S]*?--line:\s*#111;[\s\S]*?color-scheme:\s*light;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-theme="dark"\]\[data-contrast="high"\]/);
  assert.match(liteCss, /html\[data-performance="lite"\] \.topbar \[data-action="toggle-theme"\]\s*\{\s*display:\s*inline-grid;/);
  assert.doesNotMatch(script, /student-balance-mark/);
});

test("uses the student home layout consistently while preserving role-specific information", async () => {
  const script = await readFile(new URL("../public/assets/js/script.js", import.meta.url), "utf8");
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
  const technicalDocs = await readFile(new URL("../docs/DETALHES-TECNICOS.md", import.meta.url), "utf8");

  for (const renderer of ["renderStudentHome", "renderProfessorHome", "renderAdmHome", "renderDeveloperHome"]) {
    const start = script.indexOf(`function ${renderer}()`);
    const end = script.indexOf("\nfunction ", start + 1);
    assert.notEqual(start, -1, `${renderer} must exist`);
    const source = script.slice(start, end === -1 ? undefined : end);
    assert.match(source, /renderHomeHero\(/);
    assert.match(source, /renderHomeSummary\(/);
    assert.doesNotMatch(source, /stat-strip|roleBanner\(/);
  }

  assert.match(script, /function renderHomeHero\([\s\S]*?student-balance-card/);
  assert.match(script, /function renderHomeSummary\([\s\S]*?home-lite-summary-grid[\s\S]*?home-lite-stat/);
  assert.match(script, /renderProfessorHome\(\)[\s\S]*?grant-credits[\s\S]*?open-activities[\s\S]*?open-wallet/);
  assert.match(script, /renderAdmHome\(\)[\s\S]*?open-registry[\s\S]*?open-management[\s\S]*?open-audit[\s\S]*?open-integration/);
  assert.match(script, /renderDeveloperHome\(\)[\s\S]*?Nenhuma API bancária live está conectada[\s\S]*?open-integration[\s\S]*?open-audit/);
  assert.match(script, /renderDeveloperHome\(\)[\s\S]*?refresh-platform/);
  assert.match(readme, /painéis iniciais dos quatro perfis[\s\S]*?métricas e ações próprias/);
  assert.match(technicalDocs, /painéis iniciais dos quatro perfis[\s\S]*?métricas e ações próprias/);
});

test("keeps summary headings padded and readable across profile themes", async () => {
  const liteCss = await readFile(new URL("../public/assets/css/lite.css", import.meta.url), "utf8");

  assert.match(liteCss, /html\[data-performance="lite"\] \.home-lite-summary\s*\{[^}]*box-sizing:\s*border-box;[^}]*padding:\s*18px;/);
  assert.match(liteCss, /html\[data-performance="lite"\] \.home-lite-summary-head \.eyebrow\s*\{[^}]*display:\s*block;[^}]*margin-bottom:\s*5px;[^}]*color:\s*#9d151d;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-theme="dark"\] \.home-lite-summary-head \.eyebrow\s*\{\s*color:\s*#ff9298;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-contrast="high"\] \.home-lite-summary-head \.eyebrow\s*\{\s*color:\s*#000;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-theme="dark"\]\[data-contrast="high"\] \.home-lite-summary-head \.eyebrow\s*\{\s*color:\s*#fff;/);
  assert.match(liteCss, /@media \(max-width: 520px\)\s*\{\s*html\[data-performance="lite"\] \.home-lite-summary\s*\{\s*padding:\s*14px;/);
});

test("keeps support, credit card and every profile consistent across themes", async () => {
  const script = await readFile(new URL("../public/assets/js/script.js", import.meta.url), "utf8");
  const liteCss = await readFile(new URL("../public/assets/css/lite.css", import.meta.url), "utf8");
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
  const technicalDocs = await readFile(new URL("../docs/DETALHES-TECNICOS.md", import.meta.url), "utf8");

  assert.match(script, /function renderProfile\(\)[\s\S]*?const summaries = \{[\s\S]*?desenvolvedor:/);
  assert.match(script, /profile-preference-grid/);
  assert.match(script, /profile-permissions-panel/);
  assert.match(script, /profile-unit-chip/);
  assert.match(script, /document\.querySelectorAll\("\.profile-preference-grid \[data-action='high-contrast'\]"\)/);
  assert.match(liteCss, /html\[data-performance="lite"\] \.student-balance-card\s*\{[\s\S]*?background:\s*#e30613;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-theme="dark"\] \.student-balance-card\s*\{[\s\S]*?background:\s*#681413;/);
  assert.match(liteCss, /html\[data-performance="lite"\] \.sidebar-support button\s*\{[\s\S]*?background:\s*#e30613;[\s\S]*?color:\s*#fff;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-theme="dark"\] \.sidebar-support button\s*\{[\s\S]*?background:\s*#9a1915;[\s\S]*?color:\s*#fff;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-theme="dark"\] :is\(\s*\.secondary-button, \.compact-text-button, \.ghost-button\s*\)\s*\{[\s\S]*?background:\s*var\(--surface-soft\);[\s\S]*?color:\s*var\(--ink\);/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-theme="dark"\] :is\(\s*\.secondary-button, \.compact-text-button, \.ghost-button\s*\):is\(:hover, :focus-visible\)\s*\{[\s\S]*?background:\s*var\(--surface-red\);[\s\S]*?color:\s*#ff9298;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-theme="dark"\] :focus-visible\s*\{\s*outline:\s*3px solid #ff9298;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-theme="dark"\] \.service-card:is\(:hover, :focus-within\)\s*\{[\s\S]*?background:\s*var\(--surface\);[\s\S]*?color:\s*var\(--ink\);/);
  assert.match(liteCss, /html\[data-performance="lite"\] \.data-table tbody tr:is\(:hover, :focus-within\) > td\s*\{[\s\S]*?background:\s*var\(--surface-red\);[\s\S]*?box-shadow:\s*inset 0 1px 0 var\(--line\), inset 0 -1px 0 var\(--line\);/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-theme="dark"\] \.data-table tbody tr:is\(:hover, :focus-within\) > td\s*\{[\s\S]*?background:\s*#292125;[\s\S]*?box-shadow:\s*inset 0 1px 0 #453238, inset 0 -1px 0 #453238;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\[data-theme="dark"\] \.wallet-balance-actions button:first-child:is\(:hover, :focus-visible\)\s*\{[\s\S]*?background:\s*#9a1915;[\s\S]*?color:\s*#fff;/);
  assert.match(liteCss, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transition:\s*none !important;/);
  assert.match(liteCss, /html\[data-performance="lite"\] \.profile-active-badge\s*\{[^}]*justify-content:\s*center;[^}]*min-width:\s*104px;[^}]*white-space:\s*nowrap;/);
  assert.match(liteCss, /@media \(max-width: 900px\)[\s\S]*?\.profile-screen\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(readme, /#e30613/);
  assert.match(technicalDocs, /#681413/);
});

test("provides a persistent desktop sidebar and responsive login layout", async () => {
  const liteCss = await readFile(new URL("../public/assets/css/lite.css", import.meta.url), "utf8");

  assert.match(liteCss, /@media\s*\(min-width:\s*981px\)\s*\{[\s\S]*?\.app-shell\s*\{[\s\S]*?grid-template-columns:\s*264px\s+minmax\(0,\s*1fr\)/);
  assert.match(liteCss, /html\[data-performance="lite"\]\s+\.sidebar,\s*html\[data-performance="lite"\]\s+\.sidebar\.open\s*\{[\s\S]*?position:\s*sticky;[\s\S]*?transform:\s*none;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\s+\.nav-list\s*\{[\s\S]*?flex:\s*1\s+1\s+auto;[\s\S]*?overflow-y:\s*auto;[\s\S]*?overscroll-behavior:\s*contain;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\s+\.sidebar\s*\{[\s\S]*?height:\s*100vh;[\s\S]*?display:\s*flex;[\s\S]*?flex-direction:\s*column;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\s+\.nav-list:focus-visible\s*\{[\s\S]*?outline:\s*3px\s+solid/);
  assert.match(liteCss, /html\[data-performance="lite"\]\s+\.mobile-overlay,\s*html\[data-performance="lite"\]\s+\.mobile-bottom-nav\s*\{[\s\S]*?display:\s*none\s*!important;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\s+\.login-screen\s*\{[\s\S]*?width:\s*calc\(100% - 32px\);[\s\S]*?overflow:\s*hidden;[\s\S]*?border-radius:\s*24px;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\s+\.login-brand\s*\{[\s\S]*?display:\s*flex;[\s\S]*?align-items:\s*center;[\s\S]*?min-height:\s*480px;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\s+\.login-brand-copy\s*\{[\s\S]*?position:\s*relative;[\s\S]*?inset:\s*auto;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\s+\.login-brand\s+\.eyebrow\.light\s*\{[\s\S]*?color:\s*#fff;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\s+\.login-panel\s*\{[\s\S]*?margin:\s*0;[\s\S]*?padding:\s*0;/);
  assert.match(liteCss, /html\[data-performance="lite"\]\s+\.login-card\s*\{[\s\S]*?width:\s*100%;[\s\S]*?max-width:\s*none;[\s\S]*?min-height:\s*0;[\s\S]*?border-radius:\s*0;/);
  assert.match(await readFile(new URL("../public/assets/js/script.js", import.meta.url), "utf8"), /querySelector\("#primaryNav \[aria-current='page'\]"\)\?\.scrollIntoView/);
});

test("fills the profile entry screen and adapts every login surface to both themes", async () => {
  const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  const css = await readFile(new URL("../public/assets/css/lite.css", import.meta.url), "utf8");

  assert.doesNotMatch(html, /body\s*\{[^}]*background:[^}]*!important/);
  assert.doesNotMatch(html, /\.login-brand\s*\{[^}]*background:[^}]*!important/);
  assert.match(css, /html\[data-performance="lite"\] \.login-screen:not\(\.is-hidden\)\s*\{[\s\S]*?width:\s*100%;[\s\S]*?min-height:\s*100svh;[\s\S]*?grid-template-columns:\s*minmax\(300px,\s*\.78fr\)\s+minmax\(0,\s*1\.22fr\)/);
  assert.match(css, /html\[data-performance="lite"\] \.login-panel\s*\{[\s\S]*?min-height:\s*100svh;[\s\S]*?background:\s*transparent;/);
  assert.match(css, /html\[data-performance="lite"\] \.login-card\s*\{[\s\S]*?max-width:\s*none;[\s\S]*?background:\s*var\(--surface\);[\s\S]*?color:\s*var\(--ink\);/);
  assert.match(css, /html\[data-performance="lite"\]\[data-theme="dark"\] \.login-brand\s*\{[\s\S]*?linear-gradient\(145deg,\s*#71131a 0%,\s*#541217 52%,\s*#32151a 100%\)/);
  assert.match(css, /html\[data-performance="lite"\]\[data-theme="dark"\] \.login-card\s*\{[\s\S]*?background:\s*var\(--surface\);[\s\S]*?color:\s*var\(--ink\);/);
  assert.match(css, /html\[data-performance="lite"\]\[data-theme="dark"\] \.test-profile-button\s*\{[\s\S]*?background:\s*#202228;[\s\S]*?color:\s*var\(--ink\);/);
  assert.match(css, /@media \(max-width: 980px\)[\s\S]*?\.login-screen:not\(\.is-hidden\)\s*\{[\s\S]*?display:\s*block;/);
});

test("keeps profile and accessibility menu hover surfaces subtle in both themes", async () => {
  const css = await readFile(new URL("../public/assets/css/lite.css", import.meta.url), "utf8");

  assert.match(css, /html\[data-performance="lite"\] \.profile-menu button:is\(:hover, :focus-visible\)\s*\{[\s\S]*?background:\s*var\(--surface-red\);[\s\S]*?box-shadow:\s*inset 0 0 0 1px rgba\(227, 6, 19, \.08\);/);
  assert.match(css, /html\[data-performance="lite"\]\[data-theme="dark"\] \.profile-menu button:is\(:hover, :focus-visible\),[\s\S]*?\.accessibility-menu button:is\(:hover, :focus-visible\)\s*\{[\s\S]*?background:\s*#302329;[\s\S]*?color:\s*#ff9298;/);
  assert.doesNotMatch(css, /html\[data-performance="lite"\]\[data-theme="dark"\] \.profile-menu button:is\(:hover, :focus-visible\)\s*\{[^}]*background:\s*#f8f9fa/);
});

test("expands single-column management tables to the available page width", async () => {
  const css = await readFile(new URL("../public/assets/css/lite.css", import.meta.url), "utf8");
  const script = await readFile(new URL("../public/assets/js/script.js", import.meta.url), "utf8");

  assert.match(script, /<section class="management-layout"><div class="table-wrap">/);
  assert.match(css, /html\[data-performance="lite"\] \.management-layout\s*\{[^}]*width:\s*100%;[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\);/);
  assert.match(css, /html\[data-performance="lite"\] \.management-layout > \.table-wrap\s*\{[^}]*width:\s*100%;[^}]*min-width:\s*0;/);
  assert.match(css, /html\[data-performance="lite"\] \.management-layout \.data-table\s*\{[^}]*width:\s*100%;[^}]*min-width:\s*0;/);
});

test("validates forms with accessible messages and valid numeric and date values", async () => {
  const script = await readFile(new URL("../public/assets/js/script.js", import.meta.url), "utf8");
  const index = await readFile(new URL("../public/index.html", import.meta.url), "utf8");

  assert.match(index, /id="primaryNav"[^>]*tabindex="0"/);
  assert.match(script, /function validateForm\(form\)/);
  assert.match(script, /addEventListener\("invalid"[\s\S]*?event\.preventDefault\(\)[\s\S]*?showFieldValidation/);
  assert.match(script, /instanceof HTMLInputElement \|\| field instanceof HTMLSelectElement \|\| field instanceof HTMLTextAreaElement/);
  assert.match(script, /showFieldValidation\(field,\s*fieldValidationMessage\(field\)\)/);
  assert.match(script, /role",\s*"alert"/);
  assert.match(script, /aria-invalid",\s*"true"/);
  assert.match(script, /field\.focus\(\);\s*\},\s*true\)/);
  assert.match(script, /function isValidFutureDate\(value\)/);
  assert.match(script, /function rejectField\(form,\s*name,\s*message\)/);
  assert.match(script, /Number\.isInteger\(value\).*state\.negotiationBalance/);
  assert.match(script, /Informe uma quantidade inteira entre 1 e 500 créditos/);
  assert.match(script, /A mensagem deve ter entre 2 e 500 caracteres/);
  assert.match(script, /scrollIntoView\(\{\s*block:\s*"nearest"\s*\}\)/);
});

test("ships every professional assistant in all tutorial stages", async () => {
  const assistants = ["kaique", "arthur", "gabriel", "diosman", "gustavo"];
  const stages = [
    "01-o-que-e-o-caixa",
    "02-negocie-servicos",
    "03-formalize-contrato",
    "04-receba-creditos",
  ];

  for (const assistant of assistants) {
    for (const stage of stages) {
      const root = new URL(`../public/assets/images/tutorial-caixa/assistants/${assistant}/${stage}`, import.meta.url);
      const gif = await readFile(new URL(`${root.href}.gif`));
      const png = await readFile(new URL(`${root.href}.png`));

      assert.equal(gif.subarray(0, 3).toString(), "GIF");
      assert.equal(png.subarray(1, 4).toString(), "PNG");
    }
  }
});

test("keeps the FinBank dashboard and Banco do Brasil boundary demo-safe", async () => {
  const dashboard = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const statusRoute = await readFile(new URL("../app/api/bb/status/route.ts", import.meta.url), "utf8");
  const assistantRoute = await readFile(new URL("../app/api/support/assistant/route.ts", import.meta.url), "utf8");
  const chatRoute = await readFile(new URL("../app/api/chat/route.ts", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

  assert.match(dashboard, /saldo disponível[\s\S]*?fictício/i);
  assert.match(dashboard, /setBalanceVisible/);
  assert.match(dashboard, /setFilter/);
  assert.match(dashboard, /href="#movimentacoes"/);
  assert.match(dashboard, /liveApiEnabled/);
  assert.match(statusRoute, /liveApiEnabled: false/);
  assert.match(statusRoute, /configured: false/);
  assert.match(statusRoute, /supportedProducts: \[\]/);
  assert.match(statusRoute, /developers/);
  assert.doesNotMatch(statusRoute, /fetch\(/);
  assert.doesNotMatch(statusRoute, /oauth\.sandbox|api\.sandbox/);
  assert.match(assistantRoute, /export async function POST/);
  assert.match(assistantRoute, /question\.trim\(\)\.length > 300/);
  assert.doesNotMatch(assistantRoute, /oauth\.sandbox|api\.sandbox/);
  assert.match(chatRoute, /export async function GET/);
  assert.match(chatRoute, /export async function POST/);
  assert.match(chatRoute, /getTestSessionUser/);
  assert.match(layout, /Navegação móvel/);
  assert.doesNotMatch(layout, /next\/font\/google/);
});
