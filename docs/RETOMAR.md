# Como retomar o Âmbar

> Atualizado em 22/11/2026. Leia isto primeiro em qualquer sessão nova.

## Onde paramos

- **Fases 0 a 5 prontas:** landing, login demo, painel, extrato, motor de insights (3 regras), API falsa (MSW) com estado (um Pix da demo sobrevive ao F5; "Recomeçar a demo" no Mais), navegação de app (barra inferior no celular, lateral no desktop), dados do cartão, Pix, caixinhas e parceiros, app instalável. 68 testes Vitest (100% nas regras) + 22 Playwright, CI no GitHub Actions.
- **Planejamento aprovado** para as Fases 5 a 14 (banco completo):
  - Visão geral para ler: `docs/planejamento/ambar-planejamento.pdf`
  - O "contrato" de todas as fases: `docs/superpowers/specs/2026-11-17-ambar-expansion-design.md`
  - O que aconteceu na Fase 5: `docs/diario/2026-11-22.md`
- **Parceiros:** Mango (a "Apple" do universo), ZOD, Nexo e Drago's Tattoo, marcas fictícias do próprio autor. Nenhuma marca real.

## Próximo passo exato

1. **Push da `main`** (11 commits da Fase 5 ainda só locais) e conferir o CI verde.
2. **Conferência manual do app instalável:** DevTools → Application → Manifest sem erros; "Adicionar à tela inicial" no celular abre no Início.
3. **Fase 6 · Pix e transferências:** escrever o plano (`superpowers:writing-plans`) a partir da seção Fase 6 da spec. Ele já tem a base: `POST /api/demo/acoes` (tipo `pix-out`), `PIX_CONTACTS` e `PIX_KEYS` em `src/mocks/pix.ts`, categoria `transferencias`. Começar pelo visual para aprovação, como na Fase 5.

Execução escolhida: o próprio Claude, tarefa por tarefa, na conversa, com revisão no fim.

## Texto para colar numa sessão nova

> Vamos continuar o Âmbar. Leia `docs/RETOMAR.md` e a seção Fase 6 da spec `docs/superpowers/specs/2026-11-17-ambar-expansion-design.md`. Escreva o plano da Fase 6 e comece pelo visual do Pix para eu aprovar. Execução: você mesmo, tarefa por tarefa.

## Como trabalhamos (combinado)

- **Modo mentor:** explicar o problema e o porquê antes de cada mudança relevante.
- **Ver antes de aprovar:** o dono decide vendo. Monte o visual no site (ou em protótipo) e mostre antes de codar.
- **Uma fase de cada vez:** visual aprovado → código → testes → CI verde.
- **Todo número na tela vem de uma regra testada.** Os números da landing não mudam (R$ 4.218,90 · R$ 612,00 · delivery R$ 260 → R$ 380 · StreamFlix +R$ 5).

## Armadilhas que já custaram tempo

| Sintoma                                             | Causa                                                                                                           | O que fazer                                                        |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Mudou o `globals.css` e a tela não mudou            | cache do servidor de desenvolvimento                                                                            | parar o servidor, apagar `.next`, `npm run dev`                    |
| Painel "não carrega" depois de recarregar           | **Ctrl + Shift + R** desliga o service worker do MSW                                                            | usar **F5** comum                                                  |
| Porta 3000/3100/3200 ocupada                        | no Windows, parar a tarefa não mata o processo filho do Next                                                    | encerrar o processo pela porta (PowerShell `Get-NetTCPConnection`) |
| Regex quebrada depois de editar                     | o `sed` engole a barra invertida (`\s`, `\d`)                                                                   | editar código com símbolos no editor, nunca com `sed`              |
| Página mais larga que o celular                     | `<fieldset>` tem largura mínima de conteúdo; `sr-only` escapa de pai não posicionado; item de grade não encolhe | `min-w-0`, `relative` no pai, e o teste de 320 px pega             |
| Componente some no servidor                         | com Cache Components, um componente que devolve `null` pode fazer a página inteira sumir                        | desenhar sempre e esconder com `hidden`                            |
| Bibliotecas mais novas que o conhecimento do Claude | Motion 14, MSW 3, Vitest 5                                                                                      | ler a tipagem em `node_modules` antes de usar                      |

## Comandos

```bash
npm run dev          # http://localhost:3000
npm test             # Vitest
npm run coverage     # Vitest + cobertura (regras ≥ 90%)
npm run e2e          # Playwright (sobe um build de produção na porta 3200)
SCREENSHOTS=1 npx playwright test screenshots --project=desktop   # prints do README
node docs/planejamento/gerar-pdf.mjs                               # regera o PDF de planejamento
```

## Pendências fora das fases

- Lighthouse no celular e `impeccable audit` (Fase 1).
- **Talvez:** revisitar o resumo do mês no extrato.
- Extrato ocupa só metade da largura no desktop: manter, centralizar ou alargar (decisão do dono).
- Vão em branco dentro do cartão da projeção no desktop.
- Sair da conta não apaga as ações da demo ("Recomeçar a demo" apaga).
