# Processo: como este projeto é construído

O Âmbar é construído com o Claude Code, num **modo mentor**: cada mudança relevante vem com o problema que ela resolve e o porquê da solução. O objetivo é saber defender cada decisão numa entrevista.

## Princípios de trabalho

1. **Planejar antes de codar.** Conceito, validação e spec primeiro; scaffold depois.
2. **Uma ferramenta por fase**, introduzida quando o problema aparece.
3. **Entender antes de aceitar.** Toda sugestão de skill ou agente vem com o "porquê".
4. **Acessibilidade não é opcional.** Contraste, foco visível, navegação por teclado e `prefers-reduced-motion`.
5. **Menos é mais na interface.** Cada botão e cada elemento precisa justificar a sua presença.

## Kit de skills (Claude Code)

As skills ficam em escopo global (`~/.claude`). Backup e documentação em `mango/Projeto-Hardware/.ferramentas`.

**Princípio: uma ferramenta por trabalho.** Skills que cobrem o mesmo assunto podem dar instruções conflitantes.

| Etapa                | Skill                                                                                             | Papel                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Ideação              | `superpowers/brainstorming`                                                                       | Gerar e refinar o conceito do banco                                             |
| Validação da ideia   | `llm-council`                                                                                     | Testar o conceito contra pontos de vista diferentes                             |
| PRD e planejamento   | `agent-skills` (`/spec` → `/plan`)                                                                | Spec e quebra em tarefas                                                        |
| Identidade visual    | `ui-ux-pro-max` (`design-system`) + `awesome-design-md` (refs: Revolut, Wise, Stripe, Mastercard) | Tokens com justificativa                                                        |
| Anti-visual genérico | `taste-skill`                                                                                     | Filtro contra o visual "genérico de IA"                                         |
| Estrutura de UI      | `apple-hig` (dickwu/apple-design-skill, renomeada para não colidir com `apple-design` do Emil)    | Revisão pela HIG da Apple: hierarquia, controles, **sem botões desnecessários** |
| Movimento            | `emil-skills/apple-design` + Motion AI Kit (`/motion`)                                            | Springs, gestos, transições interrompíveis, animações leves                     |
| Código React/Next    | `vercel-react-best-practices`                                                                     | Padrões e performance da stack                                                  |
| Simplicidade         | `ponytail`                                                                                        | Evitar superengenharia                                                          |
| Auditoria de UI/a11y | `impeccable` (`critique`, `audit`)                                                                | Um único auditor                                                                |
| 3D (Fase 5)          | `threejs-skills`                                                                                  | Cartão 3D                                                                       |
| Testes E2E (Fase 4)  | Chrome DevTools MCP + `webapp-testing`                                                            | Fluxos e verificação visual                                                     |

**Fora deste projeto:** GSAP pesado, genjutsu e img2threejs. Um banco precisa transmitir confiança, não espetáculo.

## Sobre o MiroFish

Aplicação de simulação multiagente (não é skill). Exige Python 3.11–3.12, `uv`, Node 18+, chave de API de LLM e chave do Zep Cloud.

**Decisão de 16/11/2026: não usar neste projeto.** O banco é fictício, então a simulação não decide nada e só custaria tempo e tokens. O `llm-council` cobriu a validação. O clone fica em `mango/MiroFish`, sem chaves configuradas.
