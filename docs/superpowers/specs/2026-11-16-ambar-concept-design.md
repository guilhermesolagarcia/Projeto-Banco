# Âmbar: conceito e direção visual

> Saída do brainstorming da Fase 0 (16/11/2026). Base para o PRD do MVP e para os design tokens.

## 1. Conceito

**Âmbar** é um banco digital fictício **para todo mundo**. Não é um banco de nicho (nem "banco de jovem", nem "banco de casal").

O diferencial é a **postura**: a maioria dos bancos trata o cliente como número e lucra com o que ele não sabe. O Âmbar faz o contrário: **explica, avisa e não julga**.

Na prática, isso significa:

- **Clareza no lugar do jargão.** "Você gastou R$ 340 a mais que no mês passado, a maior parte em delivery."
- **Avisos que protegem.** "Streaming renova amanhã: R$ 39,90 (subiu R$ 5)." O banco só usa dados que realmente tem; ele não sabe se você assiste à Netflix.
- **Tom humano.** Saldo baixo vira um próximo passo, não um alerta vermelho gritando.
- **Aprender usando.** Todo insight mostra **como foi calculado** ("Como calculamos isso?"). A pessoa aprende finanças vendo a própria conta. Não existe aba de "cursos".

**A postura não é só texto, é lógica:** todo insight é **calculado a partir das transações** por funções puras e testáveis (veja a seção 2.1). Nenhum insight é uma frase fixa.

**O nome:** âmbar é uma luz quente e translúcida. Dá para ver através dele (transparência, clareza) e ele acolhe (calma). O laranja da marca representa **luz**, não grito.

**A frase-guia:** "Sem susto no fim do mês."

### Origem da dor (por que isso importa)

O dono do projeto pesquisou sites de bancos e não gostou de nenhum: _"elementos demais numa tela só, dá ansiedade só de olhar"_. Uma interface calma faz parte do produto, não é só gosto pessoal.

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

## 2.1 Motor de insights (o coração do MVP)

> Adicionado após a validação com o `llm-council` (16/11/2026). O conselho concluiu que, sem cálculo, o conceito vira "strings bonitas no mock". Com cálculo, ele vira o diferencial técnico do portfólio.

Cada regra segue a frase "**o Âmbar calcula X a partir de Y e comunica Z**". Todas são funções TypeScript puras, separadas da interface e testáveis.

**Regra 1 · Projeção até o próximo salário** _(a prova de "Sem susto no fim do mês")_

- Calcula quanto vai sobrar até o próximo salário, a partir do saldo, das contas agendadas e do gasto médio diário.
- Comunica "Dá para chegar até dia 30 com folga", "no limite" ou "Vai faltar R$ X", sempre com um próximo passo.

```
sobra = saldo − contas agendadas até o salário − (gasto médio diário × dias restantes)
gasto médio diário = gastos variáveis dos últimos 60 dias ÷ 60
sobra ≥ 10% do gasto do mês  → com folga
0 ≤ sobra < 10%              → no limite
sobra < 0                    → vai faltar R$ |sobra|  (tom calmo + próximo passo)
```

**Regra 2 · Comparação por categoria**

- Calcula a diferença de gasto em cada categoria entre o mês atual e **o mesmo período** do mês anterior.
- Comunica só a maior variação: "Você gastou R$ 120 a mais com delivery que no mesmo ponto do mês passado."

```
diferença = gasto(categoria, dia 1 até hoje, mês atual) − gasto(categoria, dia 1 até hoje, mês anterior)
mostra se: diferença ≥ R$ 50 e ≥ 20%
```

**Regra 3 · Cobrança recorrente perto de renovar**

- Detecta cobranças que se repetem no extrato e avisa as que vencem em até 2 dias.
- Destaca quando o preço subiu: "Streaming renova amanhã: R$ 39,90 (subiu R$ 5)."

```
recorrente = 3 ou mais cobranças do mesmo estabelecimento, intervalo de 28 a 31 dias, valor com variação de até 10%
próxima cobrança = última + intervalo médio
avisa se: próxima − hoje ≤ 2 dias
```

**"Como calculamos isso?"** Todo insight tem esse link discreto, que mostra a conta em português simples. Exemplo: "Saldo de R$ 1.240 − R$ 380 de contas agendadas − R$ 32 por dia × 12 dias". É o pilar "aprender usando" virando regra, e conversa com o nome: âmbar é translúcido, dá para ver através.

**Requisitos de dados**

- **Dataset fictício:** 1 persona e 90 dias de transações em JSON, com categoria, estabelecimento e recorrências. Tem padrões plantados: um pico de delivery e uma assinatura que subiu de preço. Esse JSON vira os dados do MSW.
- **Dinheiro em centavos inteiros** (`number`), formatado com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`. Números decimais erram nas contas com dinheiro.
- **"Hoje" congelado** na demo. Sem isso, "renova amanhã" deixa de funcionar uma semana depois do deploy.

**Mapa de telas (regra de corte: regra sem tela sai, tela de insight sem regra também)**

| Tela      | Regras                                                                            |
| --------- | --------------------------------------------------------------------------------- |
| Dashboard | Projeção (1) em destaque + aviso de renovação (3) em card                         |
| Extrato   | Nomes de estabelecimento legíveis + comparação (2) no meio da lista               |
| Login     | Não carrega o conceito: conta demo já preenchida e erros que não culpam o usuário |

**Avisos acessíveis** (num banco que "avisa", o aviso acessível é o próprio conceito)

- Nunca só pela cor: sempre **ícone + texto**.
- `role="status"` / `aria-live="polite"`, com texto que o leitor de tela anuncia sem alarmar.
- **Cor semântica de aviso separada do âmbar da marca.** Se tudo é âmbar, o aviso perde destaque. Ela será definida na etapa de design tokens.

**"Não julga" na prática:** o PRD vai trazer os textos dos casos difíceis (vai faltar dinheiro, saldo negativo, gasto alto). Calma não pode virar omissão: o problema é sempre dito com clareza, junto com o próximo passo.

**Resposta para a entrevista sobre concorrência:** Nubank, Inter e C6 já categorizam gastos. O diferencial do Âmbar não é a categorização. É **a projeção, o tom e a transparência do cálculo**.

## 3. Direção visual (decidida)

**Estrutura:** a landing é **uma página só, em capítulos**. Ela começa clara, escurece onde fala de dinheiro e volta ao claro no fechamento. É o mesmo banco com a luz acesa e apagada: mesma fonte, mesmas cores e mesmas regras do início ao fim.

| Seção             | Fundo            | Conteúdo                                                                                                                                                                                  | Papel                                         |
| ----------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1. Primeira dobra | Claro (papel)    | Menu curto, eyebrow "Conta digital", título "Sem susto no fim do mês.", texto de apoio, botão "Experimentar com conta demo" e, ao lado, um **cartão de saldo escuro** com um recado âmbar | Primeira impressão calma                      |
| 2. Clareza        | Escuro (grafite) | "Saiba quanto do mês o seu dinheiro aguenta.", **saldo gigante** em números tabulares e uma **linha de progresso âmbar** ("Dá para chegar até dia 30 com folga.")                         | Mostrar o conceito com dinheiro de verdade    |
| 3. Cartão         | Escuro (resina)  | "Um cartão que parece luz." e o **cartão de resina âmbar** inclinado, com brilho                                                                                                          | Objeto de marca; prepara a Fase 5 (cartão 3D) |
| 4. Fechamento     | Claro (papel)    | "Veja o Âmbar funcionando com uma conta demo.", a linha de confiança e o botão                                                                                                            | Conversão                                     |

**Timebox da landing:** a landing é a porta de entrada, não o produto. Ela tem um prazo máximo definido no plano. O brilho e o polimento extra ficam para depois do MVP.

**Regras de composição**

- O laranja é **luz e sinal, nunca fundo de seção**. Ele aparece em: brilhos radiais, o sol do logo, o ponto das eyebrows, a linha de progresso, o cartão de resina e o marcador dos recados.
- O escuro aparece **em faixas** (seções 2 e 3) e em objetos (o cartão de saldo). Ele dá peso de banco sem deixar o site pesado.
- **Uma ação principal por seção.** O menu do topo fica em 2 itens + "Entrar": Conta e Cartão (veja a seção 6).
- **Botões em pílula.** O botão principal é preto quente sobre fundo claro.
- O recado de exemplo ("Streaming renova amanhã...") é **ilustrativo**: na landing, ele não tem botões que parecem clicáveis.
- Tudo é pensado para o celular: na primeira dobra, o cartão de saldo fica logo **abaixo do texto de apoio e acima do botão**, para o conceito ser visto antes da ação.

## 4. Tokens (definidos no código em `src/app/globals.css`)

**Cores (papéis)**

| Token               | Valor     | Uso                                                             |
| ------------------- | --------- | --------------------------------------------------------------- |
| `paper`             | `#F4F0EA` | Fundo claro                                                     |
| `ink`               | `#16120E` | Texto principal, botão principal, cartão de saldo               |
| `ink-muted`         | `#4F473F` | Texto secundário no claro                                       |
| `graphite`          | `#191817` | Fundo da seção Clareza                                          |
| `resin`             | `#15100B` | Fundo da seção Cartão                                           |
| `on-dark`           | `#F2F0ED` | Texto principal no escuro                                       |
| `on-dark-muted`     | `#A8A49F` | Texto secundário no escuro                                      |
| `amber`             | `#F28C28` | Luz, progresso, cartão. **Nunca como cor de texto sobre claro** |
| `amber-signal`      | `#D06E0E` | Pontos (logo, eyebrow) e anel de foco                           |
| `amber-on-dark`     | `#F2A04B` | Marcador de recado sobre escuro                                 |
| `attention`         | `#B3402A` | **Aviso** no claro (separado do âmbar da marca)                 |
| `attention-on-dark` | `#F4977F` | Aviso no escuro                                                 |
| `positive`          | `#2A7347` | Entradas de dinheiro no claro                                   |
| `positive-on-dark`  | `#8FD3A8` | Entradas de dinheiro no escuro                                  |

**Contrastes verificados por cálculo (WCAG 2.x, 16/11/2026)**

| Par                                  | Contraste | Mínimo | Resultado |
| ------------------------------------ | --------- | ------ | --------- |
| `ink` sobre `paper`                  | 16.41:1   | 4.5    | ✅        |
| `ink-muted` sobre `paper`            | 8.02:1    | 4.5    | ✅        |
| `on-dark` sobre `graphite`           | 15.59:1   | 4.5    | ✅        |
| `on-dark-muted` sobre `graphite`     | 7.16:1    | 4.5    | ✅        |
| `on-dark` sobre `resin`              | 16.62:1   | 4.5    | ✅        |
| `on-dark-muted` sobre `resin`        | 7.63:1    | 4.5    | ✅        |
| `on-dark-muted` sobre `ink` (cartão) | 7.52:1    | 4.5    | ✅        |
| `ink` sobre `amber` (botão âmbar)    | 7.59:1    | 4.5    | ✅        |
| `amber-signal` sobre `paper` (ponto) | 3.13:1    | 3      | ✅        |
| `amber` sobre `graphite` (barra)     | 7.23:1    | 3      | ✅        |
| `amber-on-dark` sobre `ink`          | 8.79:1    | 3      | ✅        |
| `attention` sobre `paper`            | 5.02:1    | 4.5    | ✅        |
| `attention-on-dark` sobre `graphite` | 8.09:1    | 4.5    | ✅        |
| `positive` sobre `paper`             | 5.08:1    | 4.5    | ✅        |
| `positive-on-dark` sobre `graphite`  | 10.18:1   | 4.5    | ✅        |

Dois tokens foram escurecidos porque reprovaram: `amber-signal` (`#E07A12` dava 2.66:1) e `positive` (`#2E7D4F` dava 4.44:1). O âmbar da marca continua **proibido como texto sobre claro**. Sobre o âmbar, o texto é sempre `ink`.

**Tipografia**

- **Host Grotesk** (Google Fonts) para tudo: títulos em 600, com espaçamento negativo (cerca de -1.8px a 54px), e texto em 400/500.
- **Números de dinheiro sempre com `font-variant-numeric: tabular-nums`.** É o sinal silencioso de precisão.
- Os centavos do saldo gigante ficam em tom mais apagado (`R$ 4.218` + `,90`).

## 4.1 Logo (decidido)

Um **sol de realeza**: um núcleo, um **anel fino** (lembra moeda e selo de garantia), um respiro e **raios ondulados longos e curtos se alternando**, todos ondulados e em simetria total. Ao lado dele, a palavra "Âmbar" em Host Grotesk 600.

- **Marca completa** acima de 32 px: núcleo, anel, 8 raios longos e 8 curtos.
- **Versão reduzida** em 32 px ou menos (favicon): o mesmo sol **sem os raios curtos**, com o anel e os 8 raios longos levemente mais encorpados. É o mesmo desenho simplificado, nunca um desenho novo.
- O círculo nunca encosta nos raios.
- Nunca alternar raios retos e ondulados, para não lembrar o Sol de Mayo, da bandeira argentina.
- O SVG usa `currentColor`.

Referência visual e SVG-fonte: [`docs/brand/ambar-logo.html`](../../brand/ambar-logo.html). Abra no navegador para ver.

## 5. Restrições

- Stack, fases e regras do `README.md` e do `CLAUDE.md`: Next.js + TS strict + Tailwind, e nenhuma ferramenta antes da fase dela.
- Acessibilidade obrigatória: contraste, foco visível, teclado e `prefers-reduced-motion` (os brilhos e a inclinação do cartão não dependem de animação).
- Código em inglês e textos de interface em português.

## 6. Decisões tomadas na revisão (chamadas do Claude, revisáveis)

- **Menu:** **Conta** e **Cartão** são âncoras para as seções 2 (`#clareza`) e 3 (`#cartao`). **Segurança sai do menu**, porque não existe uma seção para ela e adicionar conteúdo só para justificar o link contraria a regra de "menos é mais".
- **O botão principal é "Experimentar com conta demo"**, não "Abrir conta". O council apontou que "Abrir conta" promete um cadastro e entrega uma tela de senha. Esse botão e o "Entrar" levam para `/login`, com a conta demo já preenchida. Na Fase 1, `/login` é uma página simples de "em breve", para nenhum link ficar sem destino (o que seria ruim para teclado e leitor de tela). O login de verdade chega na Fase 2.
- **Sem modo escuro automático do sistema na landing.** A página já alterna claro e escuro por capítulo, por design. Os tokens têm um valor por papel. O modo escuro será decidido separadamente para o Internet Banking.
- **Linha de confiança:** "Conta gratuita · Sem tarifa de manutenção". **Nunca** "regulado pelo Banco Central" nem "FGC": o banco é fictício. O rodapé diz explicitamente "Âmbar é um banco fictício, projeto de portfólio".
- **O cartão de resina é feito em código** (CSS: gradiente, brilho e sombra), não em imagem. Ele vira um componente reutilizado na versão 2D de reserva e serve de base para o cartão 3D da Fase 5.

## 7. Fica a cargo de quem construir

- Espaçamentos exatos, raios e sombras, desde que respeitem a sensação de calma e de muito respiro.
- Os textos das seções 2 a 4 podem ser refinados, mantendo o tom: claro, humano, sem jargão e sem exclamação.
- Rodapé: simples, escuro ou claro, com o aviso de banco fictício (veja a seção 6).

## 8. Próximos passos da Fase 0

1. ~~Validação do conceito (`llm-council`)~~: feita em 16/11/2026, e o resultado está na seção 2.1.
2. PRD do MVP (`agent-skills` `/spec` → `/plan`), com o motor de insights como requisito central.
3. Design tokens definitivos, com os contrastes validados e a cor semântica de aviso.
