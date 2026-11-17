# Âmbar: expansão para um banco completo (Fases 5 a 14)

> Saída do brainstorming de 17/11/2026. Base para os planos de cada fase. As Fases 0 a 4 estão prontas (veja o README e `docs/diario/2026-11-17.md`).

## 1. Intenção

Transformar o Âmbar de uma demo (landing + painel + extrato) num **banco completo e incrível**, que um recrutador abra e pense "isso parece um produto de verdade". O diferencial continua o mesmo: **explica, avisa e não julga**, e **todo número na tela vem de uma regra calculada e testada**.

As parcerias usam o **universo de marcas fictícias do próprio autor** (repositórios no GitHub dele), o que resolve o problema de marcas reais e vira um diferencial de portfólio: um ecossistema de marcas que conversam entre si.

| Parceiro                                    | O que é (projeto do autor)   | Papel no Âmbar                                                                       |
| ------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------ |
| **Mango** (MangoBook, Mangophone, Mangopad) | a "Apple" do universo        | parceiro principal: parcelamento, "MangoCare" no plano, a compra do "Posso comprar?" |
| **ZOD**                                     | energético                   | cashback em consumo do dia a dia                                                     |
| **Nexo**                                    | loja de periféricos e setups | cashback e desconto no Pix                                                           |
| **Drago's Tattoo**                          | estúdio de tatuagem          | parcelamento e benefício local                                                       |

## 2. Objetivos, não-objetivos e anti-objetivos

**Objetivos**

- Cobrir o que um banco digital faz no dia a dia: mover dinheiro, cartão, planejar, benefícios.
- Cada função nova carrega o conceito (explica, avisa, não julga) e pelo menos uma regra testada.
- Continuar 100% demonstrável sem servidor real: tudo roda na conta da Marina, via MSW.
- Manter a qualidade da Fase 4: testes de lógica, componentes e ponta a ponta, CI verde.

**Não-objetivos**

- Integração real com Pix, Banco Central, bandeiras de cartão ou qualquer dado de pessoa real.
- Abertura de conta com documentos reais (selfie, RG). Se houver "abrir conta", é uma demo.
- Investimentos complexos (bolsa, renda fixa detalhada). Fica fora deste roteiro.
- Integração com os sites das marcas parceiras (o checkout da Nexo, por exemplo). As parcerias vivem dentro do Âmbar.

**Anti-objetivos (falha mesmo que funcione)**

- Virar um app de banco lotado de botões, que dá ansiedade só de olhar (a dor original do projeto).
- Benefícios em tom de "oferta imperdível" ou vitrine de varejo.
- Qualquer número exibido que não venha de uma regra testada.
- Usar marcas reais (Apple, Amazon, Netflix…) como parceiras ou em anúncios.
- Perder acessibilidade (teclado, leitor de tela, contraste AA, movimento reduzido) ou a garantia de 320 px sem rolagem lateral.

## 3. Restrições

- **Stack atual:** Next.js 16 (Cache Components), TypeScript strict, Tailwind 4, Motion, MSW 3, TanStack Query 5, React Hook Form + Zod, Vitest, Testing Library, Playwright, GitHub Actions. Ferramenta nova só entra quando o problema dela aparece.
- **Dados:** a conta da Marina (`src/mocks/marina.ts`), "hoje" congelado em 23/11/2026, salário dia 5, dinheiro em centavos inteiros.
- **Sessão falsa** no `localStorage`; ações que "mudam" a conta (mandar Pix, criar caixinha) vivem em memória e no `localStorage` do navegador, nunca num servidor.
- **Movimento:** as molas de `src/components/motion/presets.ts`; tudo respeita `prefers-reduced-motion`.
- **Processo:** cada fase começa com o visual aprovado pelo dono do projeto antes do código.

## 4. Abordagens consideradas

| Abordagem                                | Como seria                                                             | Troca                                                                | Decisão       |
| ---------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------- |
| **Fase por fase, com fundação primeiro** | uma fase de base (navegação, dados), depois uma área do banco por fase | mais lento no começo, mas cada fase fica pronta de verdade e testada | **escolhida** |
| Um pouco de cada área em paralelo        | várias áreas abertas ao mesmo tempo                                    | sensação de progresso, nada termina, difícil de testar               | descartada    |
| Todas as telas primeiro, lógica depois   | visual completo cedo                                                   | o motor de cálculo, que é o diferencial, ficaria para o fim          | descartada    |

## 5. Decisões já tomadas

- **Ordem das fases:** a da seção 6, aprovada em 17/11/2026.
- **Parceiros:** Mango, ZOD, Nexo e Drago's Tattoo. Nenhuma marca real.
- **Planos:** caixinhas e metas (planejamento) na Fase 8; planos de conta ("Âmbar Mais") junto com os benefícios, na Fase 9.
- **Assistente:** primeiro responde só com as regras (Fase 10). IA de verdade (API do Claude) é uma etapa opcional depois.
- **Cartão 3D:** depois das funções de banco (Fase 12), para aparecer nos vídeos.
- **Vercel:** só no lançamento (Fase 14).

## 6. As fases

Cada fase tem um plano próprio (skill `writing-plans`) antes do código. "Regras novas" são funções puras em `src/insights/`, com testes e cobertura mínima de 90%.

### Fase 5 · Fundação do banco

- **Navegação de app:** barra inferior no celular e barra lateral no desktop, com 5 destinos: Início, Extrato, Pix, Cartão, Planejar; "Mais" agrupa benefícios, assistente e configurações. A pílula que desliza continua.
- **Dados ampliados** da Marina: cartão de crédito com fatura (ciclo, vencimento, compras parceladas), contatos Pix, chaves Pix, caixinhas iniciais, parceiros e cashback.
- **API falsa ampliada:** novas rotas no MSW, e ações que mudam o estado (POST), com "desfazer" onde fizer sentido.
- **PWA:** manifesto, ícones, tela de abertura e funcionamento offline básico das telas já visitadas.
- **Pronto quando:** as 2 telas atuais funcionam dentro da navegação nova, no celular e no desktop; o app pode ser instalado; os testes atuais continuam verdes.

### Fase 6 · Pix e transferências

- Enviar por chave ou contato; revisão antes de confirmar; **"Depois desse Pix, sobram R$ X até dia 5"** (Regra 1 reaproveitada).
- Agendar e Pix automático (recorrente), com a projeção recalculada.
- Receber: minhas chaves, QR Code com valor opcional, copia e cola.
- **Rachar a conta:** dividir um gasto entre amigos e gerar uma cobrança Pix para cada um.
- Pagar boleto (código digitado ou colado; leitura pela câmera é opcional).
- Comprovante para compartilhar.
- **Regras novas:** projeção depois de uma saída hipotética; divisão justa em centavos (sem perder nem sobrar centavo).
- **Avisa / não julga:** "Esse Pix aperta o mês" quando a sobra fica no limite; o aviso nunca bloqueia.

### Fase 7 · Cartão

- **Fatura explicada em 3 frases**, geradas pelas regras (maior categoria, o que mudou, se dá para pagar sem apertar o mês).
- **Um cartão virtual por assinatura:** cada assinatura detectada (Regra 3) pode ganhar um cartão; cancelar é apagar o cartão.
- **Parcelamento com custo real:** comparar "12x sem juros" e "à vista com desconto", com o valor no tempo à mostra.
- Bloquear e desbloquear, ajustar limite.
- **Regras novas:** resumo da fatura; comparação parcelado × à vista.

### Fase 8 · Planejar

- **Caixinhas e metas:** criar, guardar, resgatar; "guarde R$ X por mês para chegar lá".
- **"Posso comprar?":** simular uma compra (o MangoBook, por exemplo) e ver o impacto nos próximos 12 meses.
- **Calendário do mês:** salário, contas, renovações e parcelas numa linha do tempo.
- **Painel de assinaturas:** todas juntas, com o total por mês e por ano.
- **Regras novas:** aporte mensal para uma meta; projeção de 12 meses com uma compra; agenda do mês.
- A projeção do painel passa a considerar o que vai para as caixinhas.

### Fase 9 · Benefícios e Âmbar Mais

- Página de parceiros: Mango, ZOD, Nexo e Drago's, cada um com a identidade visual que o autor já criou.
- **Cashback calculado sobre os gastos:** "no último mês, R$ X teriam voltado".
- **Ofertas que respeitam:** só aparece parceiro de uma categoria em que a pessoa já gasta.
- **Plano Âmbar Mais:** comparação clara de custo e retorno, calculada com os gastos da pessoa; inclui "MangoCare".
- **Regras novas:** cashback por parceiro; "o plano se paga?".

### Fase 10 · Assistente e glossário

- Conversa com perguntas reconhecidas por intenção, respondidas pelas regras, sempre com "Como calculamos isso?".
- Pelo menos 8 tipos de pergunta; quando não sabe, diz que não sabe e sugere o que perguntar.
- **Glossário vivo:** termos como "rotativo", "CET" e "parcelado" explicados onde aparecem.
- Etapa opcional: API do Claude chamando as regras como ferramentas (precisa de servidor e chave; custo por uso).

### Fase 11 · Retrospectiva e confiança

- **Retrospectiva do mês** ("Wrapped" do dinheiro): telas animadas com Motion, com os destaques calculados.
- **Modo discreto:** esconde valores com um toque.
- **Central de notificações calma**, com os avisos das regras.
- **Bloquear tudo num toque** (cartões e Pix), com desfazer.

### Fase 12 · Cartão 3D

- React Three Fiber + drei; cor da resina e nome gravado; o cartão em CSS vira a versão de reserva.
- 60 quadros por segundo num celular médio; parado com movimento reduzido; reserva em CSS sem WebGL.

### Fase 13 · Vídeos com Remotion

- 4 anúncios (Sem susto, Não julga, Avisa antes, O Âmbar), feitos com os componentes e tokens do site.
- **Retrospectiva em vídeo** personalizada, renderizada com os dados da Marina.
- Legendas, música livre de direitos, os vídeos dizem que o Âmbar é fictício.

### Fase 14 · Lançamento

- Vercel; Lighthouse no celular (acessibilidade 100, desempenho 90 ou mais); `impeccable audit` sem P0 nem P1; README atualizado com os vídeos.

## 7. Transversal a todas as fases

- **Acessibilidade:** teclado, leitor de tela, contraste AA, `prefers-reduced-motion`, 320 px sem rolagem lateral (o teste do Playwright cobre cada tela nova).
- **Estados:** carregando, erro e vazio em toda tela que busca dados.
- **Testes:** cada regra nova com testes e cobertura ≥ 90%; cada fluxo novo no Playwright; CI verde para fechar a fase.
- **Interface enxuta:** cada botão novo precisa justificar a sua presença; a navegação tem no máximo 5 destinos principais.
- **Honestidade:** os textos deixam claro que é uma demo; nenhum dado real.

## 8. Decisões do construtor (revisão de 17/11/2026)

Um revisor leu este documento como quem vai construir a partir dele. Estas foram as lacunas, e a decisão tomada para cada uma. O dono do projeto pode mudar qualquer uma.

1. **Os números da landing não mudam.** Os dados novos entram sem alterar o saldo de R$ 4.218,90, a projeção de R$ 612,00, a comparação nem a renovação. A fatura do cartão vence no **dia 10** (depois do salário), as compras no crédito só saem da conta quando a fatura é paga, e as caixinhas começam com valores que já estão fora do "saldo disponível". Um teste garante que a história da landing continua igual.
2. **A barra inferior do celular tem 5 lugares, contando o "Mais":** Início, Pix, Cartão, Planejar e Mais. O **Extrato** sai da barra e vira um atalho grande no Início (e também fica no Mais). No desktop, a barra lateral mostra todos os destinos. Isso será mostrado no visual da Fase 5, para aprovação.
3. **O relógio da demo não anda.** "Hoje" continua 23/11/2026; Pix agendado aparece como agendado e nunca "acontece". A retrospectiva mostra **outubro**, o último mês completo. Sem mecanismo de "avançar o tempo".
4. **Identidade dos parceiros:** vem dos repositórios do autor (`Mangobook-Repo`, `Projeto-UX-Zod`, `Projeto-Nexo`, `Dragos-Tattoo`). A cor de cada marca aparece só como **acento** (logo, borda, detalhe); a tipografia, os contrastes calculados e o tom continuam os do Âmbar. Nenhuma fonte extra por marca.
5. **Os números de negócio são inventados e ficam num arquivo só**, para serem fáceis de mudar: Âmbar Mais a **R$ 14,90/mês**; cashback de **3% na Mango**, **5% na Nexo** (pagando com Pix), **10% na ZOD** e **5% na Drago's**; juros de referência para comparar "parcelado × à vista" a **1% ao mês**. A ideia é que a resposta de "o plano se paga?" para a Marina seja **"depende do mês"**: é quando o "não julga" brilha.
6. **"Funcionar offline" significa mostrar as telas já visitadas** a partir do cache do navegador. Sem um segundo service worker brigando com o do MSW. O MSW continua rodando em produção (os testes de ponta a ponta já usam o build de produção).
7. **Um plano detalhado por fase, uma de cada vez.** Agora, só o da Fase 5. Todo plano começa com o passo "visual para aprovação" antes de qualquer código.

## 9. O que fica para quem construir

- A estrutura exata dos dados novos (cartão, fatura, contatos, caixinhas), desde que mantenha centavos inteiros e o "hoje" congelado.
- Como persistir as ações da demo entre recarregamentos (por exemplo, `localStorage` com um botão "recomeçar a demo").
- O desenho de cada tela, sempre aprovado pelo dono antes do código.
- Bibliotecas pequenas quando necessárias (QR Code, por exemplo), com versão exata e justificativa.
