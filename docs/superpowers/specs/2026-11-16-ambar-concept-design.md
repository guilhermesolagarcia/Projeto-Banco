# Âmbar: conceito e direção visual

> Saída do brainstorming da Fase 0 (16/11/2026). Base para o PRD do MVP e para os design tokens.

## 1. Conceito

**Âmbar** é um banco digital fictício **para todo mundo**. Não é um banco de nicho (nem "banco de jovem", nem "banco de casal").

O diferencial é a **postura**: a maioria dos bancos trata o cliente como número e lucra com o que ele não sabe. O Âmbar faz o contrário: **explica, avisa e não julga**.

Na prática, isso significa:

- **Clareza no lugar do jargão.** "Você gastou R$ 340 a mais que no mês passado, a maior parte em delivery."
- **Avisos que protegem.** "Sua assinatura renova amanhã. Você não usa há 2 meses."
- **Tom humano.** Saldo baixo vira um próximo passo, não um alerta vermelho gritando.
- **Aprender usando.** A educação financeira acontece no momento em que é útil. Não existe aba de "cursos".

**O nome:** âmbar é uma luz quente e translúcida. Dá para ver através dele (transparência, clareza) e ele acolhe (calma). O laranja da marca representa **luz**, não grito.

**A frase-guia:** "Sem susto no fim do mês."

### Origem da dor (por que isso importa)
O dono do projeto pesquisou sites de bancos e não gostou de nenhum: *"elementos demais numa tela só, dá ansiedade só de olhar"*. Uma interface calma faz parte do produto, não é só gosto pessoal.

## 2. Objetivos, não-objetivos e anti-objetivos

**Objetivos**
- A pessoa precisa sentir, nos primeiros 5 segundos da landing, que o banco é **calmo, fácil de entender, moderno, comprometido e profissional**.
- O conceito tem que aparecer nas telas do MVP (landing, login, dashboard e extrato), mostrado e não apenas dito.

**Não-objetivos (por enquanto)**
- Gestão financeira a dois ou em família (contas compartilhadas e permissões). É praticamente outro produto.
- Conteúdo de educação financeira em formato de curso, blog ou trilha.

**Anti-objetivos (falha mesmo que funcione)**
- Parecer app de delivery ou de varejo. Isso acontece quando o laranja ocupa áreas grandes como fundo.
- Parecer o "visual genérico de IA": sans pesada padrão do sistema, gradiente laranja de startup, hero com texto à esquerda e mockup de celular à direita.
- Encher a tela. Cada elemento precisa justificar a sua presença.
- Texto âmbar sem contraste suficiente (veja a seção 4).

## 3. Direção visual (decidida)

**Estrutura:** a landing é **uma página só, em capítulos**. Ela começa clara, escurece onde fala de dinheiro e volta ao claro no fechamento. É o mesmo banco com a luz acesa e apagada: mesma fonte, mesmas cores e mesmas regras do início ao fim.

| Seção | Fundo | Conteúdo | Papel |
|---|---|---|---|
| 1. Primeira dobra | Claro (papel) | Menu curto, eyebrow "Conta digital", título "Sem susto no fim do mês.", texto de apoio, botão "Abrir conta" e, ao lado, um **cartão de saldo escuro** com um recado âmbar | Primeira impressão calma |
| 2. Clareza | Escuro (grafite) | "Saiba quanto do mês o seu dinheiro aguenta.", **saldo gigante** em números tabulares e uma **linha de progresso âmbar** ("Dá para chegar até dia 30 com folga.") | Mostrar o conceito com dinheiro de verdade |
| 3. Cartão | Escuro (resina) | "Um cartão que parece luz." e o **cartão de resina âmbar** inclinado, com brilho | Objeto de marca; prepara a Fase 5 (cartão 3D) |
| 4. Fechamento | Claro (papel) | "Abra sua conta em 5 minutos.", a linha de confiança e o botão | Conversão |

**Regras de composição**
- O laranja é **luz e sinal, nunca fundo de seção**. Ele aparece em: brilhos radiais, o ponto do logo (`Âmbar.`), o ponto das eyebrows, a linha de progresso, o cartão de resina e o marcador dos recados.
- O escuro aparece **em faixas** (seções 2 e 3) e em objetos (o cartão de saldo). Ele dá peso de banco sem deixar o site pesado.
- **Uma ação principal por seção.** O menu do topo fica em 2 itens + "Entrar": Conta e Cartão (veja a seção 6).
- **Botões em pílula.** O botão principal é preto quente sobre fundo claro.
- O recado de exemplo ("Streaming renova amanhã...") é **ilustrativo**: na landing, ele não tem botões que parecem clicáveis.
- Tudo é pensado para o celular: na primeira dobra, o cartão de saldo fica logo **abaixo do texto de apoio e acima do botão**, para o conceito ser visto antes da ação.

## 4. Tokens iniciais (provisórios, a validar na etapa de design tokens)

**Cores (papéis)**

| Token | Valor | Uso |
|---|---|---|
| `paper` | `#F4F0EA` | Fundo claro |
| `ink` | `#16120E` | Texto principal, botão principal, cartão de saldo |
| `ink-muted` | `#4F473F` | Texto secundário no claro |
| `graphite` | `#191817` | Fundo da seção Clareza |
| `resin` | `#15100B` | Fundo da seção Cartão |
| `on-dark-muted` | `#A8A49F` | Texto secundário no escuro |
| `amber` | `#F28C28` | Luz, progresso, cartão. **Nunca como cor de texto sobre claro** |
| `amber-signal` | `#E07A12` | Pontos (logo, eyebrow) |
| `amber-on-dark` | `#F2A04B` | Marcador de recado sobre escuro |

**Regra de contraste (WCAG AA):** texto ≥ 4.5:1 e texto grande ≥ 3:1. O âmbar sobre branco dá cerca de 3.8:1 e **reprova como texto**. Sobre o âmbar, o texto é sempre **escuro** (`ink`). Todos os pares precisam ser verificados com uma ferramenta quando os tokens forem definidos.

**Tipografia**
- **Host Grotesk** (Google Fonts) para tudo: títulos em 600, com espaçamento negativo (cerca de -1.8px a 54px), e texto em 400/500.
- **Números de dinheiro sempre com `font-variant-numeric: tabular-nums`.** É o sinal silencioso de precisão.
- Os centavos do saldo gigante ficam em tom mais apagado (`R$ 4.218` + `,90`).

## 5. Restrições
- Stack, fases e regras do `README.md` e do `CLAUDE.md`: Next.js + TS strict + Tailwind, e nenhuma ferramenta antes da fase dela.
- Acessibilidade obrigatória: contraste, foco visível, teclado e `prefers-reduced-motion` (os brilhos e a inclinação do cartão não dependem de animação).
- Código em inglês e textos de interface em português.

## 6. Decisões tomadas na revisão (chamadas do Claude, revisáveis)
- **Menu:** **Conta** e **Cartão** são âncoras para as seções 2 (`#clareza`) e 3 (`#cartao`). **Segurança sai do menu**, porque não existe uma seção para ela e adicionar conteúdo só para justificar o link contraria a regra de "menos é mais".
- **"Entrar" e "Abrir conta"** levam para `/login`. Como o MVP não tem fluxo de cadastro, "abrir conta" significa experimentar o Internet Banking com uma **conta demo**. Na Fase 1, `/login` é uma página simples de "em breve", para nenhum link ficar sem destino (o que seria ruim para teclado e leitor de tela). O login de verdade chega na Fase 2.
- **Sem modo escuro automático do sistema na landing.** A página já alterna claro e escuro por capítulo, por design. Os tokens têm um valor por papel. O modo escuro será decidido separadamente para o Internet Banking.
- **Linha de confiança:** "Conta gratuita · Sem tarifa de manutenção". **Nunca** "regulado pelo Banco Central" nem "FGC": o banco é fictício. O rodapé diz explicitamente "Âmbar é um banco fictício, projeto de portfólio".
- **O cartão de resina é feito em código** (CSS: gradiente, brilho e sombra), não em imagem. Ele vira um componente reutilizado na versão 2D de reserva e serve de base para o cartão 3D da Fase 5.

## 7. Fica a cargo de quem construir
- Espaçamentos exatos, raios e sombras, desde que respeitem a sensação de calma e de muito respiro.
- Os textos das seções 2 a 4 podem ser refinados, mantendo o tom: claro, humano, sem jargão e sem exclamação.
- O desenho exato do logo. Por ora, a palavra "Âmbar" seguida de um ponto âmbar.
- Rodapé: simples, escuro ou claro, com o aviso de banco fictício (veja a seção 6).

## 8. Próximos passos da Fase 0
1. PRD do MVP (`agent-skills` `/spec` → `/plan`).
2. Design tokens definitivos, com os contrastes validados.
