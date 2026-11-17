# CLAUDE.md

Contexto completo do projeto (objetivo, escopo, stack, fases): @README.md

Processo, princípios e kit de skills: @docs/processo.md

## Kit de skills

O catálogo completo das skills disponíveis (o que cada uma faz, origem e sobreposições) está em:
`C:\Users\Pichau\Desktop\mango\Projeto-Hardware\.ferramentas\README.md`

Leia esse arquivo quando precisar escolher uma skill que não esteja na tabela de `docs/processo.md`.

## Setup do ambiente (primeira sessão)

Na primeira sessão, verifique se as skills abaixo estão instaladas em `~/.claude/skills` (ou como plugin). Liste o que falta e **peça confirmação antes de instalar**, porque a instalação é global.

```bash
npx skills add emilkowalski/skills --skill apple-design -a claude-code -g
npx motion-ai
```

**`apple-hig` (dickwu/apple-design-skill)** não usa `npx skills add`: o `name` dela também é `apple-design` e colidiria com a do Emil. Instale manualmente com outro nome:

```bash
git clone --depth 1 https://github.com/dickwu/apple-design-skill /tmp/apple-hig
mkdir -p ~/.claude/skills/apple-hig
cp -r /tmp/apple-hig/{SKILL.md,README.md,references,scripts} ~/.claude/skills/apple-hig/
sed -i '0,/^name: apple-design$/s//name: apple-hig/' ~/.claude/skills/apple-hig/SKILL.md
```

Depois de `npx motion-ai`, confirme que o MCP `motion` aparece em `/mcp` e ative-o se necessário.

**MiroFish** não é skill, é uma aplicação separada. Clone-o fora deste repositório, e só quando chegarmos na validação do conceito (Fase 0):

```bash
git clone https://github.com/666ghj/MiroFish.git C:\Users\Pichau\Desktop\mango\MiroFish
```

Ele exige Python 3.11–3.12, `uv`, Node 18+, `LLM_API_KEY` e `ZEP_API_KEY` no `.env`. Nunca commite chaves.

## Como trabalhar neste repositório

- **Modo mentor.** O dono do projeto está aprendendo. Antes de aplicar uma mudança relevante, explique o problema que ela resolve e o porquê da solução. Não aplique sugestões de skills em silêncio.
- **Respeite a fase atual** (veja "Status" no README). Não instale bibliotecas de fases futuras.
- **Uma skill por trabalho.** Use a skill indicada na tabela "Kit de skills" de `docs/processo.md`. Não combine skills que se sobrepõem.
- **Simplicidade primeiro.** Prefira a solução mais simples que resolve o problema; nada de abstração antecipada.
- **Interface enxuta.** Não adicione botões, ícones ou elementos que a tela não precisa.
- **Qualidade mínima:** TypeScript `strict`, sem `any`; componentes acessíveis (rótulos, foco visível, teclado); respeitar `prefers-reduced-motion`.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`...).
- **Idioma:** código e nomes em inglês; textos de interface e documentação em português.
