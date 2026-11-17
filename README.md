# Âmbar

**Sem susto no fim do mês.** Site e Internet Banking de um banco digital **fictício** que explica, avisa e não julga. É um projeto de portfólio de frontend, feito com processo e qualidade de nível sênior.

> ⚠️ **O Âmbar não é um banco real.** Nenhum dado é coletado, e todos os valores são de demonstração.

> **Status:** Fase 1 em andamento. A fundação está pronta e a landing está sendo construída seção por seção. Veja o [diário de bordo](docs/diario/2026-11-16.md).

---

## A ideia

Os bancos lucram com o que o cliente não sabe, e as páginas deles provam isso: a página inicial do C6 tem **129 links**, a do Itaú **141** e a do Santander **117**. Duas delas abrem oferecendo renegociação de dívida ou limite da conta ([pesquisa](docs/research/2026-11-16-landing-bancos.md)). A landing do Âmbar tem **6 links**.

O Âmbar faz o contrário, em três pilares:

| Pilar         | Na prática                                                             |
| ------------- | ---------------------------------------------------------------------- |
| **Explica**   | Gastos em português claro, e todo número mostra **como foi calculado** |
| **Avisa**     | Contas, renovações e aperto no fim do mês, **antes** de acontecerem    |
| **Não julga** | Saldo baixo vira um próximo passo, nunca uma bronca em vermelho        |

### O diferencial técnico: o motor de insights

Os avisos não são frases fixas. São **calculados a partir das transações** por funções TypeScript puras, separadas da interface e testáveis, em [`src/insights/`](src/insights):

1. **Projeção até o salário:** saldo − contas agendadas − gasto médio diário × dias restantes.
2. **Comparação por categoria:** o **mesmo período** do mês anterior, para a comparação ser justa.
3. **Cobrança recorrente perto de renovar:** detecta assinaturas e avisa quando o preço subiu.

A regra 1 já roda na landing: o simulador da seção "Clareza" usa a mesma função que o dashboard vai usar.

## Rodando localmente

Requisitos: Node 24+.

```bash
npm install
npm run dev              # http://localhost:3000
```

| Comando                  | O que faz                                                             |
| ------------------------ | --------------------------------------------------------------------- |
| `npm run build`          | Build de produção                                                     |
| `npm run lint`           | ESLint                                                                |
| `npm run typecheck`      | Gera os tipos de rota e roda o `tsc`                                  |
| `npm run format`         | Prettier                                                              |
| `npm run check:insights` | Testa as regras do motor de insights (Node puro, até o Vitest chegar) |

## Stack

Cada ferramenta entra **só quando o problema dela aparece**.

| Camada            | Tecnologia                              | Fase |
| ----------------- | --------------------------------------- | ---- |
| Framework         | Next.js 16 (App Router)                 | 1 ✅ |
| Linguagem         | TypeScript em modo `strict`, sem `any`  | 1 ✅ |
| Estilo            | Tailwind CSS 4 + design tokens próprios | 1 ✅ |
| Qualidade         | ESLint + Prettier, Conventional Commits | 1 ✅ |
| Formulários       | React Hook Form + Zod                   | 2    |
| API simulada      | MSW (Mock Service Worker)               | 3    |
| Dados do servidor | TanStack Query                          | 3    |
| Animação          | Motion (`motion/react`)                 | 3    |
| Testes            | Vitest + Testing Library, Playwright    | 4    |
| CI                | GitHub Actions                          | 4    |
| 3D                | React Three Fiber + drei                | 5    |

Na landing, o movimento é **CSS puro**: animações de entrada e animações guiadas pela rolagem, nativas do navegador. São zero kilobytes de JavaScript, e tudo para com `prefers-reduced-motion`.

## Fases

- [x] **Fase 0 · Planejamento:** conceito, nome, identidade visual, logo, validação com conselho de IAs, spec
- [ ] **Fase 1 · Fundação e landing:** ✅ fundação · 🔄 landing (hero, clareza, avisos e cartão prontos)
- [ ] **Fase 2 · Login:** conta demo, formulário acessível
- [ ] **Fase 3 · Dashboard e extrato:** MSW, TanStack Query, motor de insights completo
- [ ] **Fase 4 · Qualidade:** testes de componente, E2E e CI
- [ ] **Fase 5 · Cartão 3D:** personalização com versão 2D de reserva

**MVP:** landing, login, dashboard e extrato. **Depois:** Pix, cartões, cartão 3D e modo escuro.

## Acessibilidade

- Todos os pares de cor com contraste **calculado** (WCAG AA), registrados no [documento de design](docs/superpowers/specs/2026-11-16-ambar-concept-design.md) (seção 4).
- Foco visível em âmbar, link "Pular para o conteúdo" e navegação completa por teclado.
- Avisos nunca dependem só da cor (sempre ícone + texto) e são anunciados por leitor de tela (`aria-live`).
- `prefers-reduced-motion` respeitado em toda animação.
- Mobile-first, a partir de 320 px, sem rolagem lateral.

## Estrutura

```
src/
  app/            → rotas, layout, tokens (globals.css), imagem de compartilhamento, 404
  components/     → compartilhados: Logo, Money, ResinCard
  features/       → um módulo por pasta (landing, e depois auth e banking)
  insights/       → regras puras do motor de insights (sem React)
docs/
  superpowers/specs/  → conceito e direção visual
  brand/              → página do logo (abra no navegador)
  research/           → pesquisa de páginas de bancos
  diario/             → diário de bordo
  processo.md         → como o projeto é construído (skills e princípios)
SPEC.md           → o que construir, módulo por módulo
```

## Documentos

| Documento                                                                              | Para quê                                            |
| -------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [`SPEC.md`](SPEC.md)                                                                   | O que construir, critérios de pronto e limites      |
| [Conceito e direção visual](docs/superpowers/specs/2026-11-16-ambar-concept-design.md) | O porquê: conceito, tokens, logo, motor de insights |
| [Logo](docs/brand/ambar-logo.html)                                                     | Marca completa, versão reduzida e regras de uso     |
| [Pesquisa](docs/research/2026-11-16-landing-bancos.md)                                 | O que os bancos fazem, e o que o Âmbar não faz      |
| [Diário de bordo](docs/diario/2026-11-16.md)                                           | Decisões, erros e lições de cada dia                |
| [Processo](docs/processo.md)                                                           | Princípios e kit de skills do Claude Code           |
