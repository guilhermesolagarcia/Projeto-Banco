# Fase 5 · Fundação do banco: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar ao Âmbar a base de um banco completo: navegação de app, dados ampliados da Marina, uma API falsa que muda de estado (com desfazer e "recomeçar a demo") e o Âmbar instalável como app.

**Architecture:** A navegação vira um "app shell" no layout de `(banking)`: barra inferior no celular, barra lateral no desktop, as duas lidas de uma lista única de destinos. Os dados novos ficam em arquivos próprios em `src/mocks/` e **não** mexem nos números da landing. O painel e o extrato deixam de ser calculados uma vez só: viram funções que recebem as transações, para a API falsa somar as ações da demo (guardadas no `localStorage`) antes de responder.

**Tech Stack:** Next.js 16 (App Router, Cache Components), TypeScript strict, Tailwind 4, Motion 14, MSW 3, TanStack Query 5, Vitest 5, Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-17-ambar-expansion-design.md` (Fase 5 e seção 8).

## Global Constraints

- Dinheiro em centavos inteiros; datas `"YYYY-MM-DD"`; "hoje" congelado em `2026-11-23`, salário dia 5.
- **Os números da landing não mudam:** saldo R$ 4.218,90, contas agendadas R$ 2.958,90, R$ 54,00/dia, sobra R$ 612,00, delivery R$ 260 → R$ 380, StreamFlix renova 24/11 com +R$ 5.
- A barra inferior do celular tem **exatamente 5 lugares:** Início, Pix, Cartão, Planejar, Mais. O Extrato vira atalho no Início e item do Mais; no desktop, a lateral mostra todos os destinos.
- Fatura do cartão vence no **dia 10**; compras no crédito só saem da conta quando a fatura é paga.
- Números de negócio num arquivo só: Âmbar Mais R$ 14,90/mês; cashback Mango 3%, Nexo 5% (Pix), ZOD 10%, Drago's 5%; juros de referência 1% ao mês.
- Parceiros: Mango, ZOD, Nexo, Drago's. Nenhuma marca real.
- Offline = telas já visitadas pelo cache do navegador; **nenhum** service worker além do `mockServiceWorker.js` do MSW.
- Acessibilidade: teclado, leitor de tela, AA, `prefers-reduced-motion`, 320 px sem rolagem lateral.
- Movimento: molas de `src/components/motion/presets.ts`.
- Textos de interface em português; código em inglês; Conventional Commits.
- **Nenhum código antes da aprovação do visual (Task 1).**

## Review Focus

1. **Recarregar a página depois de uma ação da demo:** o saldo continua alterado (veio do `localStorage`), e "Recomeçar a demo" volta a R$ 4.218,90. Teste na Task 4.
2. **`localStorage` bloqueado ou com conteúdo corrompido** (aba anônima, JSON inválido): a demo abre no estado inicial, sem tela de erro. Teste na Task 4.
3. **Destino ativo numa sub-rota** (por exemplo, `/pix/enviar` no futuro): o item "Pix" da barra continua marcado. Teste na Task 2.
4. **Barra inferior cobrindo conteúdo:** o último item da página e o rodapé ficam acima da barra, inclusive com a área segura do iPhone (`env(safe-area-inset-bottom)`). Verificação por print na Task 2.
5. **Os números da landing mudando por causa dos dados novos:** o teste da história (`src/mocks/marina.test.ts`) continua passando sem alteração. Task 3.

---

### Task 1: Visual da navegação para aprovação (sem código no app)

**Files:**

- Create: `docs/planejamento/fase-5-navegacao.html` (protótipo estático, fora de `src/`)

- [ ] **Step 1: Montar o protótipo** com as cores e a fonte do Âmbar: (a) celular 390 px com barra inferior de 5 itens (ícone + rótulo; ativo com a pílula âmbar suave) sobre o Início, mostrando o atalho "Ver extrato"; (b) desktop 1440 px com barra lateral (logo no topo; Início, Extrato, Pix, Cartão, Planejar; um separador; Benefícios, Assistente, Configurações; "Sair" no pé); (c) a tela "Mais" no celular.
- [ ] **Step 2: Fotografar com o Playwright** (mesmo método de `e2e/screenshots.spec.ts`) e conferir: 5 itens cabem a 320 px; rótulos legíveis; contraste AA.
- [ ] **Step 3: Mostrar ao dono do projeto e esperar a aprovação.** Ajustes pedidos voltam para o Step 1. Só com "aprovado" segue para a Task 2.
- [ ] **Step 4: Commit**

```bash
git add docs/planejamento/fase-5-navegacao.html
git commit -m "docs: navigation mockup for phase 5"
```

### Task 2: Navegação de app (barra inferior e lateral)

**Files:**

- Create: `src/features/banking/nav-items.ts`, `src/features/banking/bottom-bar.tsx`, `src/features/banking/sidebar.tsx`, `src/features/banking/nav-icons.tsx`
- Create: `src/app/(banking)/pix/page.tsx`, `src/app/(banking)/cartao/page.tsx`, `src/app/(banking)/planejar/page.tsx`, `src/app/(banking)/mais/page.tsx`
- Modify: `src/app/(banking)/layout.tsx` (troca o `BankingHeader` pelo shell), `src/features/banking/dashboard.tsx` (atalho "Ver extrato")
- Delete: `src/features/banking/banking-header.tsx`
- Test: `src/features/banking/nav-items.test.ts`, `src/features/banking/bottom-bar.test.tsx`, `e2e/demo-flow.spec.ts`

**Interfaces:**

- Produces: `type NavItem = { href: string; label: string; icon: NavIconName; inBottomBar: boolean; group: "main" | "more" }`; `NAV_ITEMS: readonly NavItem[]`; `isActive(pathname: string, href: string): boolean`; `<BottomBar />`, `<Sidebar />` (clientes, leem `usePathname()`).

- [ ] **Step 1: Testes que falham**

```ts
// nav-items.test.ts
expect(NAV_ITEMS.filter((i) => i.inBottomBar).map((i) => i.label)).toEqual([
  "Início",
  "Pix",
  "Cartão",
  "Planejar",
  "Mais",
]);
expect(isActive("/pix/enviar", "/pix")).toBe(true);
expect(isActive("/pixel", "/pix")).toBe(false);
expect(isActive("/inicio", "/inicio")).toBe(true);
```

```tsx
// bottom-bar.test.tsx — mock de next/navigation com pathname "/pix"
expect(screen.getByRole("navigation", { name: "Principal" })).toBeInTheDocument();
expect(screen.getAllByRole("link")).toHaveLength(5);
expect(screen.getByRole("link", { name: "Pix" })).toHaveAttribute("aria-current", "page");
```

- [ ] **Step 2: Rodar** `npx vitest run src/features/banking/nav-items src/features/banking/bottom-bar` → FAIL (módulos inexistentes).
- [ ] **Step 3: Implementar** `nav-items.ts` (destinos: Início `/inicio`, Extrato `/extrato`, Pix `/pix`, Cartão `/cartao`, Planejar `/planejar`, Mais `/mais`; Extrato com `inBottomBar: false`), `nav-icons.tsx` (SVG de traço 1.6 como o `BellIcon`, `aria-hidden`), `bottom-bar.tsx` (fixa no rodapé, `md:hidden`, vidro fosco `bg-paper/85 backdrop-blur-xl`, `pb-[env(safe-area-inset-bottom)]`, pílula ativa com `layoutId="bottom-pill"` e `SNAP`), `sidebar.tsx` (`hidden md:flex`, mesma pílula com `layoutId="side-pill"`, "Sair" no pé reaproveitando `SignOutButton`). No layout, o `<main>` ganha `pb-28 md:pb-24 md:pl-64` para nada ficar sob as barras. As 4 páginas novas mostram um estado vazio calmo: título + "Chega na Fase N." (Pix 6, Cartão 7, Planejar 8) e a página Mais lista Extrato, Benefícios (Fase 9), Assistente (Fase 10) e "Recomeçar a demo" (ligado na Task 4).
- [ ] **Step 4: Rodar** os testes do Step 2 → PASS. Rodar `npx vitest run` → tudo verde.
- [ ] **Step 5: Atualizar o e2e:** em `e2e/demo-flow.spec.ts`, o fluxo completo navega Início → "Ver extrato" (atalho) no lugar do link do cabeçalho; o teste de 320 px inclui `/pix`, `/cartao`, `/planejar`, `/mais`. Novo teste: no celular, a barra mostra 5 links e "Pix" fica `aria-current="page"` em `/pix`. Rodar `npx playwright test` → todos passam.
- [ ] **Step 6: Print de conferência** (Review Focus 4): `SCREENSHOTS=1` gera `mobile-painel.png`; o fim da página fica acima da barra.
- [ ] **Step 7: Commit**

```bash
git add src e2e
git commit -m "feat: app navigation with bottom bar and sidebar"
```

### Task 3: Dados ampliados da Marina

**Files:**

- Create: `src/mocks/card.ts`, `src/mocks/pix.ts`, `src/mocks/boxes.ts`, `src/mocks/partners.ts`, `src/mocks/business.ts`
- Test: `src/mocks/card.test.ts`, `src/mocks/boxes.test.ts` (o `src/mocks/marina.test.ts` existente **não muda**)

**Interfaces:**

- Produces:
  - `CARD: { last4: string; limit: number; closingDay: number; dueDay: 10; purchases: CardPurchase[] }` com `type CardPurchase = { id: string; date: string; merchant: string; category: Category; amount: number; installment?: { current: number; total: number } }`
  - `billTotal(card: typeof CARD, cycleEnd: string): number`
  - `PIX_CONTACTS: { id: string; name: string; key: string; keyType: "email" | "telefone" | "cpf" | "aleatoria" }[]`, `PIX_KEYS: { key: string; keyType: ... }[]`
  - `BOXES: { id: string; name: string; saved: number; goal: number; goalDate: string }[]`
  - `PARTNERS: { id: "mango" | "zod" | "nexo" | "dragos"; name: string; accent: string; category: Category; tagline: string }[]`
  - `BUSINESS = { plusMonthlyPrice: 1490, cashback: { mango: 0.03, nexo: 0.05, zod: 0.1, dragos: 0.05 }, referenceMonthlyInterest: 0.01 }`

- [ ] **Step 1: Testes que falham**

```ts
// card.test.ts
expect(CARD.dueDay).toBe(10);
expect(CARD.purchases.every((p) => p.amount > 0)).toBe(true);
// the bill is due after payday, so the dashboard projection (until Dec 5) stays R$ 612,00
expect(`2026-12-${String(CARD.dueDay).padStart(2, "0")}` > PAYDAY).toBe(true);
// cycle closes on day 30: the November bill is every purchase dated Nov 1–30
// (an installment counts only its installment value, which is what `amount` holds)
const november = CARD.purchases.filter((p) => p.date >= "2026-11-01" && p.date <= "2026-11-30");
expect(CARD.closingDay).toBe(30);
expect(billTotal(CARD, "2026-11-30")).toBe(november.reduce((sum, p) => sum + p.amount, 0));
// boxes.test.ts
expect(BOXES.every((b) => b.saved <= b.goal && b.goalDate > TODAY)).toBe(true);
```

- [ ] **Step 2: Rodar** `npx vitest run src/mocks` → FAIL.
- [ ] **Step 3: Montar os dados**, coerentes com a Marina: compras no cartão incluem uma parcela Nexo (headset, 3x) e uma compra na Drago's; nenhuma compra no MangoBook ainda (ele é a compra-exemplo da Fase 8). Os `accent` dos parceiros vêm dos repositórios do autor (`Mangobook-Repo`, `Projeto-UX-Zod`, `Projeto-Nexo`, `Dragos-Tattoo`); se não der para ler o repo, use a cor do PDF de planejamento e anote no arquivo.
- [ ] **Step 4: Rodar** `npx vitest run` → tudo verde, incluindo `marina.test.ts` **sem alteração** (Review Focus 5).
- [ ] **Step 5: Commit**

```bash
git add src/mocks
git commit -m "feat: card, pix contacts, boxes, partners and business numbers for Marina"
```

### Task 4: API falsa com estado, desfazer e "recomeçar a demo"

**Files:**

- Create: `src/mocks/demo-state.ts`
- Modify: `src/features/banking/dashboard-data.ts` (`buildDashboard`), `src/features/banking/statement-data.ts` (`buildStatement`), `src/mocks/handlers.ts`, `src/app/(banking)/mais/page.tsx` (botão "Recomeçar a demo")
- Test: `src/mocks/demo-state.test.ts`, `src/mocks/handlers.test.ts`

**Interfaces:**

- Consumes: `TRANSACTIONS` (marina), `PIX_CONTACTS` (Task 3).
- Produces:
  - `type DemoAction = { id: string; type: "pix-out"; date: string; contactId: string; amount: number }`
  - `type DemoState = { version: 1; actions: DemoAction[] }`
  - `loadDemoState(): DemoState`, `saveDemoState(state: DemoState): void`, `applyAction(state, action): DemoState`, `undoLast(state): DemoState`, `resetDemo(): DemoState`, `transactionsFor(state): Transaction[]` (Marina + ações, mais recente primeiro)
  - `buildDashboard(transactions: readonly Transaction[]): DashboardData` e `buildStatement(transactions: readonly Transaction[]): StatementData`; `DASHBOARD` e `STATEMENT_DATA` continuam exportados como `buildX(TRANSACTIONS)` (a landing não muda)
  - Rotas: `GET /api/painel`, `GET /api/extrato` (agora a partir de `transactionsFor(loadDemoState())`), `POST /api/demo/acoes` (corpo: `DemoAction` sem `id`), `POST /api/demo/desfazer`, `POST /api/demo/recomecar`

- [ ] **Step 1: Testes que falham**

```ts
// demo-state.test.ts (environment jsdom, for localStorage)
const s1 = applyAction(resetDemo(), {
  id: "a1",
  type: "pix-out",
  date: "2026-11-23",
  contactId: "c1",
  amount: 5000,
});
expect(transactionsFor(s1)[0]).toMatchObject({ amount: -5000, date: "2026-11-23" });
expect(undoLast(s1).actions).toHaveLength(0);
localStorage.setItem("ambar.demo", "{not json");
expect(loadDemoState()).toEqual({ version: 1, actions: [] }); // Review Focus 2
saveDemoState(s1);
expect(loadDemoState()).toEqual(s1); // Review Focus 1
```

```ts
// handlers.test.ts — msw/node setupServer(...handlers), jsdom
// POST a R$ 50 pix-out, then GET /api/painel → balance 421890 - 5000;
// POST /api/demo/recomecar, then GET /api/painel → balance 421890
```

- [ ] **Step 2: Rodar** `npx vitest run src/mocks/demo-state src/mocks/handlers` → FAIL.
- [ ] **Step 3: Implementar.** `demo-state.ts` guarda em `localStorage["ambar.demo"]`, com `try/catch` (armazenamento bloqueado = estado inicial) e validação da forma (versão diferente ou JSON inválido = estado inicial). `buildDashboard`/`buildStatement` são os cálculos atuais com as transações como parâmetro. Os handlers leem o estado a cada requisição. Depois de uma ação, o cliente invalida as queries `["painel"]` e `["extrato"]` (TanStack Query). "Recomeçar a demo" na página Mais chama `POST /api/demo/recomecar`, invalida as queries e mostra "A demo voltou ao começo."
- [ ] **Step 4: Rodar** `npx vitest run` → tudo verde; `npm run coverage` → regras ≥ 90%.
- [ ] **Step 5: e2e:** novo teste em `e2e/demo-flow.spec.ts`: em `/mais`, "Recomeçar a demo" mostra a confirmação e o Início volta a R$ 4.218,90. Rodar `npx playwright test` → todos passam.
- [ ] **Step 6: Commit**

```bash
git add src e2e
git commit -m "feat: stateful demo API with undo and reset"
```

### Task 5: O Âmbar instalável como app (PWA)

**Files:**

- Create: `src/app/manifest.ts`, `src/app/apple-icon.tsx`, `src/app/icon-512/route.tsx` (ou `icon.tsx` com `generateImageMetadata` para 192 e 512)
- Modify: `src/app/layout.tsx` (`appleWebApp` no `metadata`, `viewport.viewportFit = "cover"`)
- Test: `e2e/demo-flow.spec.ts`

**Interfaces:**

- Produces: `/manifest.webmanifest` com `name: "Âmbar"`, `short_name: "Âmbar"`, `start_url: "/inicio"`, `display: "standalone"`, `background_color: "#f4f0ea"`, `theme_color: "#f4f0ea"`, ícones 192 e 512 (sol âmbar sobre fundo `ink`, `purpose: "any maskable"`).

- [ ] **Step 1: Teste que falha** (Playwright): `GET /manifest.webmanifest` responde 200 com `display: "standalone"` e `start_url: "/inicio"`; os dois ícones do manifesto respondem 200 com `content-type: image/png`.
- [ ] **Step 2: Rodar** `npx playwright test -g manifest` → FAIL.
- [ ] **Step 3: Implementar** com as rotas de metadados do Next (`manifest.ts`, ícones gerados com `ImageResponse`, como o `opengraph-image.tsx` já faz). Nenhum service worker novo (constraint).
- [ ] **Step 4: Rodar** `npx playwright test` → todos passam.
- [ ] **Step 5: Verificação manual pelo dono do projeto:** no Chrome, DevTools → Application → Manifest sem erros e o botão "Instalar" aparecendo; no celular, "Adicionar à tela inicial" abre em tela cheia no Início.
- [ ] **Step 6: Commit**

```bash
git add src e2e
git commit -m "feat: installable app manifest and icons"
```

### Task 6: Fechamento da fase

**Files:**

- Modify: `README.md` (selo de status "Fase 5 · fundação", seção Telas com a navegação nova), `docs/diario/<data>.md`, `docs/readme/*.png` (regerados)

- [ ] **Step 1:** `SCREENSHOTS=1 npx playwright test screenshots --project=desktop` e conferir os prints novos.
- [ ] **Step 2:** `npm run lint && npx prettier --check . && npm run typecheck && npm run coverage && npm run e2e` → tudo verde.
- [ ] **Step 3:** Diário com decisões e lições da fase; README atualizado.
- [ ] **Step 4: Commit** e, com o ok do dono, push (o CI precisa ficar verde para fechar a fase).

```bash
git add README.md docs
git commit -m "docs: close phase 5"
```
