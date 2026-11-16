# Projeto Banco

Site e Internet Banking de um **banco fictício**, construído como projeto de portfólio para praticar frontend com processo e qualidade de nível sênior.

> **Status:** Fase 0 (planejamento). Nenhum código ainda. Próximo passo: definir a identidade do banco (nome, conceito e público-alvo) e escrever o PRD.

---

## Objetivo

- Fortalecer criatividade e experiência como desenvolvedor frontend com olhar de UX.
- Programar "como um sênior": **decidir antes de codar**, adotar cada ferramenta só quando ela resolve um problema real e saber justificar cada escolha.
- Ter uma peça de portfólio que mostre mais do que uma landing page: estado, formulários, acessibilidade, testes e polimento de interação.

## Escopo do produto

O projeto tem dois produtos, tratados separadamente:

| Produto | Foco | Peso |
|---|---|---|
| **Site institucional** (landing, produtos, cartões, "abra sua conta") | Marketing, SEO, performance | Enxuto, é a porta de entrada |
| **Internet Banking** (login, dashboard, extrato, Pix, cartões) | Estado, formulários, segurança de UI, acessibilidade | **Principal**, é o que impressiona |

### MVP (v1)
1. Landing page
2. Login
3. Dashboard (saldo, atalhos, resumo)
4. Extrato

### Depois do MVP
- Pix / transferências
- Cartões
- **Personalização do cartão em 3D** (Fase 5)

O backend é **simulado**: a API é mockada no navegador com MSW. O projeto é 100% frontend.

## Stack

| Camada | Tecnologia | Entra na fase |
|---|---|---|
| Framework | Next.js (App Router) | 1 |
| Linguagem | TypeScript em modo `strict` | 1 |
| Estilo | Tailwind CSS + design tokens próprios | 1 |
| Qualidade de código | ESLint + Prettier, Conventional Commits | 1 |
| Formulários | React Hook Form + Zod | 2 |
| API simulada | MSW (Mock Service Worker) | 3 |
| Dados do servidor | TanStack Query | 3 |
| Animação | Motion (`motion/react`) | 3+ |
| Testes de componente | Vitest + Testing Library | 4 |
| Testes E2E | Playwright | 4 |
| CI | GitHub Actions | 4 |
| 3D | React Three Fiber + drei | 5 |

**Regra:** nenhuma ferramenta entra antes da fase dela. Primeiro sentimos o problema, depois a ferramenta chega como solução.

## Fases

### Fase 0: Planejamento ← *estamos aqui*
- Brainstorming do conceito do banco (nome, proposta, público-alvo, tom visual).
- Validação do conceito (llm-council; MiroFish opcional como teste de estresse).
- PRD do MVP.
- Identidade visual e design tokens (paleta, tipografia, espaçamento, raios, sombras).

### Fase 1: Fundação
- Scaffold do Next.js + TS strict + Tailwind + ESLint/Prettier.
- Design tokens no código.
- Landing page.

### Fase 2: Login
- Formulário com React Hook Form + Zod.
- Estados de erro, loading e acessibilidade de formulário.

### Fase 3: Dashboard e extrato
- MSW simulando a API (contas, saldo, transações).
- TanStack Query para cache, loading e erro.
- Microinterações com Motion.

### Fase 4: Qualidade
- Vitest + Testing Library nos componentes reais.
- Playwright para os fluxos principais.
- CI no GitHub Actions (lint, typecheck, testes).

### Fase 5: Cartão 3D
- Personalização do cartão com React Three Fiber.
- Arrastar para girar, com física de mola (spring).
- Carregado sob demanda (`next/dynamic`), com versão 2D de reserva e respeito a `prefers-reduced-motion`.

## Kit de skills (Claude Code)

As skills ficam em escopo global (`~/.claude`). Backup e documentação em `mango/Projeto-Hardware/.ferramentas`.

**Princípio: uma ferramenta por trabalho.** Skills que cobrem o mesmo assunto podem dar instruções conflitantes.

| Etapa | Skill | Papel |
|---|---|---|
| Ideação | `superpowers/brainstorming` | Gerar e refinar o conceito do banco |
| Validação da ideia | `llm-council` (+ `MiroFish`, opcional) | Testar o conceito contra pontos de vista diferentes |
| PRD e planejamento | `agent-skills` (`/spec` → `/plan`) | Spec e quebra em tarefas |
| Identidade visual | `ui-ux-pro-max` (`design-system`) + `awesome-design-md` (refs: Revolut, Wise, Stripe) | Tokens com justificativa |
| Anti-visual genérico | `taste-skill` | Filtro contra o visual "genérico de IA" |
| Estrutura de UI | `apple-hig` (dickwu/apple-design-skill, renomeada para não colidir com `apple-design` do Emil) | Revisão pela HIG da Apple: hierarquia, controles, **sem botões desnecessários** |
| Movimento | `emil-skills/apple-design` + Motion AI Kit (`/motion`) | Springs, gestos, transições interrompíveis, animações leves |
| Código React/Next | `vercel-react-best-practices` | Padrões e performance da stack |
| Simplicidade | `ponytail` | Evitar superengenharia |
| Auditoria de UI/a11y | `impeccable` (`audit`) | Um único auditor |
| 3D (Fase 5) | `threejs-skills` | Cartão 3D |
| Testes E2E (Fase 4) | Chrome DevTools MCP + `webapp-testing` | Fluxos e verificação visual |

**Fora deste projeto:** GSAP pesado, genjutsu, img2threejs. Um banco precisa transmitir confiança, não espetáculo.

### Sobre o MiroFish
Aplicação de simulação multiagente (não é skill). Exige Python 3.11–3.12, `uv`, Node 18+, chave de API de LLM e chave do Zep Cloud. Consome muitos tokens e não tem precisão comprovada: o resultado serve para **provocar ideias**, não como evidência. Uso planejado: depois do brainstorming, como teste de estresse do conceito.

## Princípios de trabalho

1. **Planejar antes de codar.** PRD primeiro, scaffold depois.
2. **Uma ferramenta por fase**, introduzida quando o problema aparece.
3. **Entender antes de aceitar.** Toda sugestão de skill ou agente vem com o "porquê". O objetivo é saber defender cada decisão numa entrevista.
4. **Acessibilidade não é opcional.** Contraste, foco visível, navegação por teclado, `prefers-reduced-motion`.
5. **Menos é mais na interface.** Cada botão e cada elemento precisa justificar a sua presença.

## Decisões pendentes

- [ ] Nome do banco
- [ ] Conceito e proposta de valor
- [ ] Público-alvo
- [ ] Direção visual (paleta, tipografia)
