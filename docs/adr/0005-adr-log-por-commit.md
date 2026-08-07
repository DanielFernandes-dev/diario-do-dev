# ADR 0005: Log de Decisões por Commit (Rastreabilidade)

- Status: Aceito
- Data: 2026-08-07

## Contexto

O projeto possui um histórico de 21 commits com decisões técnicas, porém apenas os ADRs
0001 a 0004 documentam formalmente as decisões arquiteturais. Não existia um mapeamento
entre o histórico de commits e as decisões registradas, dificultando a auditoria do "porquê"
de cada mudança.

## Decisão

Manter um log de rastreabilidade que associa **cada commit** do histórico ao ADR que
documenta a decisão implementada. Quando o commit não implementa nenhuma decisão
arquitetural relevante (chores, correções pontuais, ajustes de estilo) ou não possui ADR
associado, o campo é marcado com `—`.

O log fica versionado em `docs/adr/` e o índice em `README.md` passa a listar este ADR.

## Consequências

Positivas:
- **Auditoria completa:** qualquer pessoa consegue, a partir de um commit, encontrar a decisão arquitetural que o originou.
- **Histórico uniforme:** todos os commits têm entrada no log, inclusive os que não geraram ADR.
- **Padrão de manutenção:** novos commits significativos devem atualizar este log (ou criar um novo ADR).

Negativas:
- O log precisa ser mantido manualmente a cada commit relevante.

## Log por Commit

| Commit | Data | Descrição | ADR relacionado |
|---|---|---|---|
| `d43ac24` | 2026-04-24 | Criação do blog técnico para autor único | — |
| `1221a03` | 2026-04-30 | Seção de comentários com respostas encadeadas, ordenação e estado | — |
| `fdd1783` | 2026-04-30 | Sistema de comentários modular (context, input, list, item) | — |
| `8a161eb` | 2026-04-30 | Sincronização de dependências `node_modules` | — |
| `b80f598` | 2026-04-30 | Integração do frontend React com build Flask | — |
| `9bbcade` | 2026-05-06 | Migração do app de `apps/react` para `packages/frontend` | — |
| `ab112de` | 2026-06-28 | Suporte a Docker e achatamento da raiz do frontend | — |
| `6f8f40b` | 2026-06-28 | Remoção de symlinks venv quebrados para build de páginas | — |
| `de969a7` | 2026-06-28 | Redesign do frontend com tema Obsidian Flux | — |
| `a7c1377` | 2026-06-28 | Configuração do Firebase Hosting e inicialização do app | [0001](./0001-vite-firebase-hosting.md) |
| `8918914` | 2026-06-28 | Substituição de mock data pelo conteúdo do Firebase | [0002](./0002-firebase-auth-firestore-analytics.md) |
| `a407bba` | 2026-06-28 | Deploy no Firebase Hosting | [0001](./0001-vite-firebase-hosting.md) |
| `e8c8226` | 2026-06-28 | Centralização da autenticação no AuthContext global | [0003](./0003-auth-context-global.md) |
| `69a7513` | 2026-06-28 | Documentação do ADR 0003 | [0003](./0003-auth-context-global.md) |
| `7622c49` | 2026-06-28 | Tratamento de erros no login Google com fallback e feedback | [0003](./0003-auth-context-global.md) |
| `3f91cd4` | 2026-06-28 | Regras do Firestore e leitura pública de posts | [0004](./0004-firestore-security-rules.md) |
| `ca77aae` | 2026-06-28 | Documentação do ADR 0004 | [0004](./0004-firestore-security-rules.md) |
| `2f88a35` | 2026-06-28 | Atualização de dependências (Vite 6, React Plugin 4, esbuild override) | — |
| `f7e40f7` | 2026-06-28 | Responsividade mobile (sidebar, filtros e compositor) | — |
| `803207f` | 2026-08-05 | Editar/deletar comentários e layout de respostas centralizado | — |
| `96c8a17` | 2026-08-07 | Refatoração: lógica de negócios separada da apresentação (services, hooks, componentes) | — |

## Arquivos impactados

| Arquivo | Tipo de mudança |
|---|---|
| `docs/adr/0005-adr-log-por-commit.md` | **Criado** com o log de rastreabilidade |
| `docs/adr/README.md` | **Modificado** para incluir o ADR 0005 no índice |
