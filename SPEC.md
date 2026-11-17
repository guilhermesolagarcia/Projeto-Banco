# Spec: Âmbar · MVP

> Fonte da verdade do **o quê** construir. O **porquê** (conceito, visual, logo e motor de insights) está em [`docs/superpowers/specs/2026-11-16-ambar-concept-design.md`](docs/superpowers/specs/2026-11-16-ambar-concept-design.md). Este spec é vivo: se uma decisão mudar, atualize aqui antes de mudar o código.

## Objetivo

Construir o site e o Internet Banking do **Âmbar**, um banco digital **fictício** que "explica, avisa e não julga". É uma peça de portfólio de frontend: o objetivo é mostrar processo e qualidade de nível sênior (estado, formulários, acessibilidade, testes e polimento), não só uma landing page.

**Quem usa:**

- **Recrutador ou entrevistador:** precisa entender o produto em 90 segundos e encontrar raciocínio de engenharia (o motor de insights) e cuidado de UX (calma, acessibilidade).
- **Persona da demo:** Marina, 27 anos, salário no dia 5, com aluguel, streaming e delivery.

**Como saber que deu certo:** uma pessoa sem contexto abre o site, entende a proposta, entra com a conta demo e vê os insights **calculados** a partir das transações, com tudo funcionando bem no celular e no teclado.

## Mapa de módulos

| Módulo       | Responsabilidade                                        | Depende de         | Fase |
| ------------ | ------------------------------------------------------- | ------------------ | ---- |
| `foundation` | Scaffold, design tokens, fontes, layout base, logo      | —                  | 1    |
| `landing`    | Página institucional em 4 capítulos                     | `foundation`       | 1    |
| `auth`       | Login com conta demo, validação, área protegida         | `foundation`       | 2    |
| `insights`   | Dataset de 90 dias e as 3 regras como funções puras     | —                  | 3    |
| `banking`    | Dashboard e extrato, com dados via MSW e TanStack Query | `auth`, `insights` | 3    |

**Ordem:** `foundation` → `landing` → `auth` → `insights` → `banking`.
Os módulos `auth`, `insights` e `banking` estão **resumidos** aqui. Cada um será detalhado quando a sua fase começar.

## Tech stack

Cada ferramenta entra **só na sua fase** (regra do README).

| Fase | Ferramentas                                                                                                  |
| ---- | ------------------------------------------------------------------------------------------------------------ |
| 1    | Next.js (App Router, versão estável no dia do scaffold), TypeScript `strict`, Tailwind CSS, ESLint, Prettier |
| 2    | React Hook Form + Zod                                                                                        |
| 3    | MSW, TanStack Query, Motion (`motion/react`)                                                                 |
| 4    | Vitest + Testing Library, Playwright, GitHub Actions                                                         |
| 5    | React Three Fiber + drei (fora do MVP)                                                                       |

- Gerenciador de pacotes: `npm`. Node 24.
- Deploy: Vercel.
- Fonte: Host Grotesk via `next/font/google`.

## Comandos

```bash
npm run dev          # servidor local (http://localhost:3000)
npm run build        # build de produção
npm run start        # serve o build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run format       # Prettier --write
npm test             # Vitest (a partir da Fase 4)
npm run test:e2e     # Playwright (a partir da Fase 4)
```

## Estrutura do projeto

```
src/
  app/                      → rotas (App Router)
    page.tsx                → landing
    login/page.tsx          → login (Fase 1: "em breve"; Fase 2: formulário)
    (banking)/dashboard/    → dashboard (Fase 3)
    (banking)/extrato/      → extrato (Fase 3)
    layout.tsx, globals.css → layout raiz e design tokens
  components/               → componentes compartilhados (Logo, Button...)
  features/
    landing/                → seções da landing (Hero, Clarity, Card, Closing)
    auth/                   → formulário e sessão demo (Fase 2)
    banking/                → telas do Internet Banking (Fase 3)
  insights/                 → regras puras + tipos (Fase 3, sem React)
  mocks/                    → MSW e dataset (Fase 3)
docs/                       → design, marca e decisões
```

Uma regra só: **o código de um módulo fica na pasta do módulo**. Algo vai para `components/` apenas quando é usado por dois módulos ou mais.

## Estilo de código

- TypeScript `strict`, **sem `any`**. Componentes são funções com props tipadas.
- Nomes de código em inglês; textos de interface em português.
- Server Components por padrão. Use `"use client"` só quando houver interação ou estado.
- Estilo com classes do Tailwind usando os **tokens** (`bg-paper`, `text-ink`). Nunca hex solto no componente.
- Dinheiro é sempre **centavos inteiros** (`number`), formatado num único lugar.
- Commits seguem Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`...).

```tsx
// src/components/money.tsx
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type MoneyProps = { cents: number; className?: string };

export function Money({ cents, className }: MoneyProps) {
  return <span className={`tabular-nums ${className ?? ""}`}>{brl.format(cents / 100)}</span>;
}
```

## Estratégia de testes

- **Fases 1–3:** verificação manual guiada por checklist (abaixo), mais `lint`, `typecheck` e `build` sem erros.
- **Fase 4:**
  - **Vitest** nas regras de `insights/` (cobertura alta, porque é lógica pura e o coração do produto) e nos componentes com estado.
  - **Playwright** nos fluxos landing → login demo → dashboard → extrato.
  - O **CI** roda lint, typecheck e todos os testes.
- **Exceção planejada:** as funções de `insights/` podem ganhar testes já na Fase 3, se a ferramenta de teste for aprovada antes. Isso é uma decisão para tomar quando chegarmos lá.

## Limites

**Sempre:**

- Seguir os tokens e o documento de design.
- Garantir contraste AA, foco visível, navegação por teclado e respeito a `prefers-reduced-motion`.
- Rodar `lint`, `typecheck` e `build` antes de cada commit.
- Explicar o porquê de cada mudança relevante (modo mentor).

**Perguntar antes:**

- Adicionar qualquer dependência.
- Mudar o design aprovado, os tokens ou a estrutura de pastas.
- Antecipar ferramentas de fases futuras.

**Nunca:**

- Commitar segredos ou chaves.
- Dizer que o banco é real (nada de "Banco Central" ou "FGC").
- Usar `any`.
- Usar âmbar como cor de texto sobre fundo claro.
- Adicionar elementos de interface que a tela não precisa.

---

## Módulo `foundation` (Fase 1)

**Entregas**

1. Scaffold do Next.js, com TypeScript strict, Tailwind, ESLint e Prettier, e os scripts `typecheck` e `format`.
2. **Design tokens** em `globals.css`:
   - as cores do documento de design;
   - **mais uma cor semântica de aviso**, separada do âmbar da marca;
   - espaçamentos, raios e sombras.
   - **Todos os pares de texto e fundo com o contraste verificado por cálculo**, e o resultado registrado no doc de design.
3. Host Grotesk configurada com `next/font`.
4. Componente `Logo`, a partir do SVG de `docs/brand/ambar-logo.html`:
   - versões completa e reduzida;
   - cor por `currentColor`;
   - `aria-label` ou `aria-hidden`, conforme o uso.
5. Favicon com a versão reduzida.
6. Metadados (título, descrição e idioma `pt-BR`).

**Pronto quando:** `npm run build` passa sem avisos, a página vazia carrega a fonte e os tokens, e a tabela de contrastes está no documento de design.

## Módulo `landing` (Fase 1)

Construída **seção por seção**. Cada seção é uma tarefa revisada por você antes da próxima. É a peça mais caprichada do site, mas com o timebox definido no plano.

Ordem atualizada em 16/11/2026, a partir da pesquisa em [`docs/research/2026-11-16-landing-bancos.md`](docs/research/2026-11-16-landing-bancos.md). Cada seção nova precisa provar um pilar do conceito que a página ainda não mostra.

| Seção                  | Conteúdo                                                                                                                                                                                                     | Status |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Menu                   | Logo, âncoras "Conta" e "Cartão", botão "Entrar"                                                                                                                                                             | ✅     |
| 1 · Hero (claro)       | Título, texto de apoio, botão da conta demo, cartão de saldo + cartão de projeção, órbitas, os 3 pilares                                                                                                     | ✅     |
| 2 · Clareza (grafite)  | **Simulador interativo:** a pessoa edita saldo, contas, gasto por dia e dias até o salário, e vê a projeção e o "Como calculamos isso?" ao vivo. Usa a função pura da Regra 1 (`src/insights/projection.ts`) | ✅     |
| 3 · Avisos (claro)     | Os 3 tipos de aviso do motor de insights, como cartões de exemplo                                                                                                                                            | ✅     |
| 4 · Não julga          | Antes e depois: o banco comum ("SALDO INSUFICIENTE") vs. o Âmbar (calmo, com o próximo passo)                                                                                                                | ✅     |
| 5 · Cartão (resina)    | Cartão de resina em CSS e a etiqueta "Em breve: personalize o seu em 3D"                                                                                                                                     | ✅     |
| 6 · Perguntas (claro)  | "É um banco de verdade?", "Como funciona a conta demo?", "O que vocês fazem com meus dados?", com `<details>` nativo                                                                                         | ✅     |
| 7 · Fechamento (claro) | "Veja o Âmbar funcionando com uma conta demo.", linha de confiança, botão                                                                                                                                    | ✅     |
| Rodapé                 | "Âmbar é um banco fictício, projeto de portfólio."                                                                                                                                                           | ✅     |

**Fora da landing, de propósito:** depoimentos, números de clientes e selos de segurança. Num banco fictício, seriam inventados.

**Regras:** os números exibidos na landing são **ilustrativos**, exceto os do simulador, que são calculados. O recado não tem botões que parecem clicáveis. Os botões levam para `/login`, que na Fase 1 mostra "em breve".

**Pronto quando:**

- [ ] Bate com o mockup aprovado no computador e no celular (a partir de 320 px, sem rolagem horizontal).
- [ ] No celular, o cartão de saldo aparece **antes** do botão.
- [ ] Toda a página é navegável por teclado, com foco visível e ordem lógica; as âncoras do menu funcionam.
- [ ] Os contrastes passam AA; os avisos não dependem só da cor.
- [ ] Com `prefers-reduced-motion`, nada se move.
- [ ] Lighthouse no celular: acessibilidade = 100, performance ≥ 90, LCP < 2,5 s, CLS < 0,1.
- [ ] A auditoria do `impeccable` não aponta problemas P0 nem P1.

## Módulo `auth` (Fase 2), resumo

Login com conta demo **já preenchida**. Validação com React Hook Form + Zod. Mensagens de erro que não culpam o usuário. Sessão falsa guardada no navegador, e as rotas de `(banking)` redirecionam para o login quando não há sessão. **Não há segurança real**, porque não existe servidor. Será detalhado quando a Fase 2 começar.

## Módulo `insights` (Fase 3), resumo

Dataset de 90 dias da Marina (centavos inteiros, "hoje" congelado em 23/11/2026 como na landing, fuso de São Paulo) e as 3 regras do doc de design, seção 2.1: projeção, comparação por categoria e recorrência perto de renovar. Cada regra devolve também o texto de "Como calculamos isso?". Não usa React. Será detalhado quando a Fase 3 começar.

## Módulo `banking` (Fase 3), resumo

- **Dashboard:** projeção em destaque e aviso de renovação.
- **Extrato:** nomes legíveis e a comparação no meio da lista.
- Dados via MSW e TanStack Query, com estados de carregando, erro e vazio.
- Só tema claro no MVP.

Será detalhado quando a Fase 3 começar.

## Critérios de sucesso do MVP

- Os 5 módulos estão "prontos", segundo os critérios de cada um.
- Todo insight exibido vem de uma regra calculada; nenhum é texto fixo.
- O fluxo completo (landing → conta demo → dashboard → extrato) funciona no celular e no teclado.
- O site está publicado na Vercel, e o README explica o projeto em 90 segundos.

## Perguntas em aberto

- O timebox exato da landing (definido no plano).
- Testes das regras de `insights/` na Fase 3 ou só na 4.
- Modo escuro do Internet Banking (depois do MVP).
