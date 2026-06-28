# ADR 0002: Firebase para Auth, Firestore e Analytics

- Status: Aceito
- Data: 2026-06-28

## Contexto

O frontend do projeto já está publicado no Firebase Hosting e utiliza o SDK do Firebase no browser.

A próxima evolução natural da aplicação exige:

- autenticação de usuários
- persistência de conteúdo e interações
- métricas de uso e comportamento

## Decisão

Usar Firebase como backend gerenciado para:

- `Firebase Auth` para login e identidade de usuários
- `Cloud Firestore` para posts, comentários e metadados
- `Firebase Analytics` para métricas de navegação e engajamento

## Consequências

Positivas:

- reduz a necessidade de backend customizado no curto prazo
- acelera a entrega de autenticação e persistência
- mantém o stack consistente com o Hosting já adotado
- facilita instrumentação de métricas desde o início

Negativas:

- o modelo de dados precisa ser pensado para Firestore
- regras de segurança passam a ser parte central da aplicação
- consultas complexas podem exigir modelagem específica
- existe dependência forte do ecossistema Firebase

## Alternativas consideradas

- Backend próprio com API REST ou GraphQL
- Supabase como backend gerenciado
- Manter tudo apenas em dados mockados locais

## Observações

Esta decisão está alinhada com a base atual do código, que já possui:

- `src/lib/firebase.ts`
- `firebase.json`
- deploy no Firebase Hosting funcionando

