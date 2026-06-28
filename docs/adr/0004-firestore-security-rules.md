# ADR 0004: Regras de Segurança do Firestore para Posts e Comentários

- Status: Aceito
- Data: 2026-06-28

## Contexto

Com a integração do Cloud Firestore para persistência de posts e comentários, precisávamos garantir que:
1. Os posts criados pelo administrador fossem visíveis para todos os usuários (autenticados ou não).
2. Apenas o administrador pudesse criar, atualizar ou deletar posts.
3. Comentários pudessem ser lidos publicamente, mas criados ou curtidos apenas por usuários autenticados.

Até então, o Firestore não possuía regras declaradas no repositório, dependendo exclusivamente das configurações manuais ou regras padrão do Firebase Console.

## Decisão

Adicionar controle declarativo de acesso via regras de segurança do Firestore:
1. Criar o arquivo `firestore.rules` na raiz do projeto contendo as regras de segurança e acesso.
2. Definir a função auxiliar `isAdmin()` que valida se o usuário está autenticado e se o seu e-mail corresponde ao do administrador do diário (`danielfernandesdeoliveira459@gmail.com`).
3. Permitir leitura pública (`allow read: if true;`) nos documentos e subcoleções de `/posts`.
4. Restringir escrita de posts apenas ao administrador.
5. Permitir que qualquer usuário autenticado crie ou atualize (para likes) comentários em `/posts/{postId}/comments/{commentId}`.
6. Atualizar o `firebase.json` para incluir a seção `"firestore"` apontando para o arquivo de regras criado, garantindo que elas sejam versionadas e publicadas automaticamente a cada deploy.

## Consequências

Positivas:
- **Segurança Declarativa e Automatizada:** As regras de segurança passam a fazer parte do código-fonte do projeto, sendo implantadas automaticamente com o CLI do Firebase.
- **Visibilidade Pública:** Todos os visitantes conseguem visualizar os posts do administrador sem a necessidade de estarem logados.
- **Segurança de Escrita:** Apenas contas autorizadas (o administrador) podem publicar novos posts.
- **Interação Controlada:** Comentários e likes requerem autenticação para evitar spam, mas a leitura deles é pública.

Negativas:
- O e-mail do administrador fica explícito nas regras de segurança do repositório público (embora seja uma informação já conhecida por ser o autor do blog).

## Arquivos impactados

| Arquivo | Tipo de mudança |
|---|---|
| `firestore.rules` | **Criado** com as regras de leitura pública e escrita restrita |
| `firebase.json` | **Modificado** para incluir a configuração do Firestore |
