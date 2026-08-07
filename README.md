# Diario do Dev

Blog técnico do **Diário do Dev** com interface inspirada em feed social, focado em publicar experiências reais do desenvolvedor, bugs resolvidos e decisões de arquitetura.

## O que este repositório faz

Este repositório contém o frontend da aplicação, construído com React + Vite + TypeScript + TailwindCSS.

Toda a parte de dados e "backend" está hospedada no **Firebase**:

- **Firestore** — persistência de posts, comentários e likes
- **Firebase Auth** — login com conta Google
- **Firebase Hosting** — publicação do frontend

## Regras de publicação

- **Admin (dono do site):** é o **único** desenvolvedor que publica posts — somente ele pode criar, editar e deletar posts. Nenhum outro usuário tem essa permissão.
- **Demais desenvolvedores:** fazem login com as próprias contas Google e podem apenas **comentar** e curtir as experiências publicadas pelo admin.
- **Visitantes (não autenticados):** podem ler todo o conteúdo, mas não podem comentar nem curtir.
- A autenticação é feita com **conta Google** e a identificação do admin é controlada por uma lista de e-mails (`ADMIN_EMAILS`) validada no frontend e reforçada pelas regras de segurança do Firestore (`firestore.rules`).

## Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Firebase (Auth, Firestore, Hosting)
- React Router
- Lucide React

## Estrutura principal

```text
.
├── docs/adr/             # Architecture Decision Records
├── firestore.rules       # Regras de segurança do Firestore
├── src/
│   ├── components/       # common, posts, comments, stats
│   ├── context/          # AuthContext global
│   ├── data/             # categorias
│   ├── hooks/            # usePosts, useComments
│   ├── lib/              # inicialização do Firebase
│   ├── pages/            # Home (feed) e PostPage (post individual)
│   ├── services/         # CRUD Firestore (posts e comentários)
│   ├── types/            # interfaces Post e Comment
│   └── utils/            # formatters e árvore de comentários
├── index.html
├── package.json
└── vite.config.ts
```

## Funcionalidades atuais

- feed de posts em tempo real (Firestore `onSnapshot`)
- ordenação por recentes e discutidos
- cards com resumo, tags, tempo de leitura, dificuldade e autor
- sistema de likes (um voto por usuário)
- páginas individuais de post (React Router)
- comentários aninhados com resposta, like, edição, exclusão, marcação de pergunta/respondida e blocos de código
- painel admin com criação, edição inline e exclusão de posts
- layout responsivo (desktop + mobile)

## Dados

Os dados não são locais: estão hospedados no **Firebase Firestore**, com as coleções:

- `posts` — publicações do admin
- `posts/{postId}/comments` — comentários de cada post

As regras de segurança (`firestore.rules`) garantem leitura pública e restringem escrita por papel (admin/autor).

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

### Deploy

```bash
npm run build
firebase deploy
```

## Estado atual

Implementado:

- feed em tempo real com dados do Firebase
- autenticação com conta Google
- criação/edição/exclusão de posts restrita ao admin
- comentários aninhados com interações
- páginas individuais de post
- layout responsivo
- regras de segurança do Firestore

Ainda não implementado:

- busca funcional (input visual sem lógica)
- criação de posts por usuários não-admin (propositalmente restrita ao admin)
- migração das credenciais do Firebase para variáveis de ambiente

## Licença

ISC
