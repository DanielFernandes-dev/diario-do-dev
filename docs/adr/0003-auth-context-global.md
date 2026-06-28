# ADR 0003: AuthContext Global para Centralização do Estado de Autenticação

- Status: Aceito
- Data: 2026-06-28

## Contexto

Após a adoção do Firebase Auth (ADR 0002), o estado de autenticação estava sendo gerenciado de forma descentralizada: cada componente (`Home`, `CommentContext`) criava seu próprio listener `onAuthStateChanged` e seu próprio `useState<User | null>`.

Esse padrão causava os seguintes problemas:

- O contexto de autenticação não propagava entre componentes após o login — a UI não refletia o usuário logado em todos os pontos simultaneamente
- O `CommentContext` usava `auth.currentUser ?? currentUser` como fallback porque o estado local poderia estar desatualizado em relação ao Firebase SDK
- A lógica de `isAdmin`, `handleGoogleLogin` e `handleLogout` estava duplicada ou ausente em vários componentes
- O `CommentInput` não bloqueava comentários de usuários anônimos
- A `Navbar` não tinha botão de logout funcional conectado ao estado real

## Decisão

Criar um `AuthContext` global em `src/context/AuthContext.tsx` com um único `onAuthStateChanged` que alimenta toda a árvore de componentes via React Context.

O `AuthProvider` é montado na raiz da aplicação (`App.tsx`) e expõe:

- `currentUser: User | null` — usuário autenticado no Firebase
- `isAdmin: boolean` — derivado de `ADMIN_EMAILS`
- `isLoading: boolean` — controle do estado de inicialização do auth
- `handleGoogleLogin()` — trigger do popup Google
- `handleLogout()` — signOut do Firebase

## Consequências

Positivas:

- fonte única de verdade para autenticação em toda a aplicação
- login reflete imediatamente em todos os componentes: `Navbar`, `Home`, `CommentSection`, `CommentInput`
- elimina múltiplos listeners `onAuthStateChanged` desnecessários
- lógica de `isAdmin` centralizada e sem risco de divergência
- `CommentInput` agora exibe prompt de login para usuários anônimos
- `Navbar` tem botão Login/Logout funcional

Negativas:

- adiciona uma camada de contexto que deve ser considerada em futuras refatorações
- componentes dentro do `AuthProvider` ficam acoplados ao contexto — precisam ser testados com um provider mockado

## Arquivos impactados

| Arquivo | Tipo de mudança |
|---|---|
| `src/context/AuthContext.tsx` | **Criado** |
| `src/App.tsx` | Envolvido com `<AuthProvider>` |
| `src/pages/Home.tsx` | Removido listener local, consome `useAuth()` |
| `src/components/comments/CommentContext.tsx` | Removido listener local, consome `useAuth()` |
| `src/components/comments/CommentInput.tsx` | Adicionado gate de autenticação com prompt de login |
| `src/components/Navbar.tsx` | Adicionado botão Login/Logout via `useAuth()` |

## Alternativas consideradas

- **Manter o padrão atual** — descartado, pois causava bugs de sincronização de estado
- **Redux / Zustand para estado global** — descartado por ser over-engineering para um estado simples de auth
- **Passar `currentUser` via props (prop drilling)** — descartado, poluiria todas as interfaces de componentes intermediários
