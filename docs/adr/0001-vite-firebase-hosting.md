# ADR 0001: Frontend Vite com Firebase Hosting

- Status: Aceito
- Data: 2026-06-28

## Contexto

O projeto `diario-do-dev_frontend` é uma aplicação frontend em React com dados mockados localmente, já estruturada para build estático com Vite.

Também foi configurado o Firebase no cliente e o objetivo imediato do deploy é publicar o frontend como uma SPA estática.

## Decisão

Adotar:

- Vite como build tool e servidor de desenvolvimento
- Firebase Hosting como plataforma de publicação do frontend
- Rewrites para `index.html` para suportar rotas de SPA
- Inicialização do Firebase no entrypoint do aplicativo

## Consequências

Positivas:

- Deploy simples e rápido
- Integração direta com Firebase Auth, Firestore e Analytics
- Pipeline de publicação compatível com o build estático atual

Negativas:

- O frontend continua dependente de build estático
- Qualquer necessidade de backend de renderização dinâmica exigirá outra estratégia
- O uso do Firebase tende a acoplar parte da infraestrutura ao ecossistema Google

## Alternativas consideradas

- Hospedar em Nginx dentro de um container
- Publicar em Vercel ou Netlify
- Aguardar backend próprio antes do deploy

## Observações

Esta decisão está alinhada com o estado atual do projeto, que já possui:

- build com `npm run build`
- `firebase.json` apontando para `dist`
- SPA rewrite configurado

