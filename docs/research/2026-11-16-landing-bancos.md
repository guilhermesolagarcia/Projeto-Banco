# Pesquisa: páginas iniciais de bancos (16/11/2026)

Objetivo: decidir quais seções a landing do Âmbar deve ter, e quais **não** deve ter.

## Densidade medida (desktop, 1366 px)

Contagem feita no navegador, com `querySelectorAll`, na página inicial de cada banco.

| Banco                               | Links | Botões | Títulos (h1–h3) | Altura da página |
| ----------------------------------- | ----- | ------ | --------------- | ---------------- |
| C6 Bank                             | 129   | 78     | 45+             | 9.619 px         |
| Itaú                                | 141   | 59     | 30              | 5.964 px         |
| Santander                           | 117   | 1      | 45+             | 5.927 px         |
| **Âmbar** (hero + Clareza + Cartão) | **6** | **0**  | **3**           | 2.270 px         |

Isso transforma em número a dor que originou o projeto: _"elementos demais numa tela só, dá ansiedade só de olhar"_.

## O que aparece nas páginas

- **Vitrine de produtos:** C6, Itaú e Santander listam de 15 a 30 produtos na página inicial (cartões, consignado, consórcio, seguros...).
- **Crédito em destaque:** o Itaú abre com "Renegocie com condição especial"; o Santander, com "A geladeira pifou? Tenha 10 dias sem juros no Limite da Conta". A página inicial empurra dívida. É o oposto da postura do Âmbar.
- **Ferramenta interativa:** a Wise tem uma calculadora ao vivo (valor → taxa, prazo e total) e uma comparação de custos com nota de metodologia. **Foi adotada:** a seção Clareza vira um simulador.
- **Segurança:** presente no Nubank, na Wise e na Mercury. **Não adotada:** um banco fictício não tem como provar nada.
- **Números e depoimentos** ("130 milhões", avaliações das lojas). **Não adotados:** seriam inventados.
- **Perguntas, ajuda e links de transparência:** no Nubank e na Mercury. **Adotados:** viram a seção Perguntas e o rodapé.

## Fontes

- Nubank, Wise, Mercury: lidos com WebFetch.
- C6 Bank, Itaú, Santander: bloquearam a leitura automática (403); lidos com um navegador de testes (Playwright).
- Monzo: só retornou o aviso de cookies.
