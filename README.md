# Diario do Dev Frontend

Frontend da aplicação **Diario do Dev**, um blog técnico com interface inspirada em feed social.

## O que este repositório faz

Este repositório contém somente o frontend da aplicação.

Ele mostra:

- feed de posts técnicos
- filtros por categoria
- ordenação por recentes, populares e discutidos
- cards com resumo, tags, tempo de leitura e dificuldade
- comentários aninhados com interações locais
- modal "Sobre"

O backend foi separado para o repositório [`diario-do-dev_backend`](https://github.com/DanielFernandes-dev/diario-do-dev_backend).

## Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide React

## Estrutura principal

```text
.
├── src/
│   ├── components/
│   ├── data/
│   └── pages/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Funcionalidades atuais

- feed principal com posts mockados
- sidebar com categorias técnicas
- cards de post com votos, tags e indicadores de leitura
- comentários com resposta, like e marcação de pergunta/respondida
- responsividade para desktop e mobile

## Dados

Os dados são locais e mockados em:

- `src/data/posts.ts`
- `src/data/categories.ts`

Não há API conectada neste repositório no momento.

## Como executar

### Instalar dependências

```bash
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

O Vite sobe em `http://localhost:3000`.

### Gerar build

```bash
npm run build
```

### Pré-visualizar build

```bash
npm run preview
```

### Rodar com Docker

```bash
docker build -t diario-do-dev-frontend .
docker run -p 8080:80 diario-do-dev-frontend
```

Depois abra `http://localhost:8080`.

## Estado atual

Implementado:

- layout do feed
- navegação lateral
- ordenação e filtro
- comentários locais
- seção de post com expansão de discussão

Ainda não implementado:

- persistência em API
- autenticação
- criação real de posts
- busca funcional
- páginas individuais de post

## Licença

ISC
