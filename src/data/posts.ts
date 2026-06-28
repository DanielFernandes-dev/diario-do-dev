export interface Post {
  id: string;
  title: string;
  content: string;
  summary: string;
  categoryId: string;
  author: {
    name: string;
    avatar?: string;
    isAnonymous: boolean;
  };
  createdAt: Date;
  readingTime: number;
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  tags: string[];
}

export interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    isAnonymous: boolean;
  };
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  likes?: number;
  isAuthor?: boolean;
  replies: Comment[];
  parentId?: string;
  isQuestion?: boolean;
  isAnswered?: boolean;
}

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Como resolvi um memory leak em React que consumia 2GB de RAM',
    content: `## Contexto do Problema

Estava trabalhando em uma aplicação React com múltiplos componentes que faziam requisições a uma API de dados em tempo real. Após algumas horas de uso, a aplicação começava a travar e o navegador consumia mais de 2GB de RAM.

## Investigação

Usei as React DevTools para analisar os componentes e percebi que vários componentes não estavam sendo desmontados corretamente. O problema principal estava em useEffect que não tinham cleanup functions.

## Código Problemático

\`\`\`javascript
// ANTES - Com memory leak
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 1000);
  
  // Faltava o cleanup!
}, []);

// DEPOIS - Corrigido
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 1000);
  
  return () => clearInterval(interval); // Cleanup function
}, [fetchData]);
\`\`\`

## Solução Implementada

1. Adicionei cleanup functions em todos useEffect
2. Implementei abort controllers para requisições fetch
3. Usei useCallback para memoizar funções
4. Adicionei React.memo em componentes pesados

## Aprendizado

Memory leaks em React geralmente ocorrem quando:
- Event listeners não são removidos
- Timers não são limpos
- Requisições não são canceladas
- Referências circulares entre componentes

## O que faria diferente hoje

Usaria React Query ou SWR para gerenciar requisições, pois já tratam desses problemas de forma automática.`,
    summary: 'Investigação e solução para um memory leak crítico em aplicação React que consumia 2GB de RAM...',
    categoryId: 'bugs',
    author: {
      name: 'João Developer',
      isAnonymous: false
    },
    createdAt: new Date('2024-01-15T10:30:00'),
    readingTime: 8,
    difficulty: 'intermediario',
    upvotes: 342,
    downvotes: 12,
    comments: [
      {
        id: 'c1',
        content: 'Como você identificou que era 2GB especificamente? Usou alguma ferramenta de profiling?',
        author: {
          name: 'Maria Dev',
          isAnonymous: false
        },
        createdAt: new Date('2024-01-15T11:00:00'),
        upvotes: 45,
        downvotes: 2,
        replies: [
          {
            id: 'c1-reply',
            content: 'Usei o Chrome DevTools na aba Memory e fiz heap snapshots comparativos. Também usei o React DevTools para ver componentes montados.',
            author: {
              name: 'João Developer',
              isAnonymous: false
            },
            createdAt: new Date('2024-01-15T11:30:00'),
            upvotes: 23,
            downvotes: 1,
            replies: [],
            parentId: 'c1',
            isAnswered: true
          }
        ],
        isQuestion: true,
        isAnswered: true
      },
      {
        id: 'c2',
        content: 'Já tive problema similar! React Query realmente é a melhor solução.',
        author: {
          name: 'Carlos Front',
          isAnonymous: false
        },
        createdAt: new Date('2024-01-15T12:00:00'),
        upvotes: 18,
        downvotes: 0,
        replies: []
      }
    ],
    tags: ['React', 'Memory Leak', 'Performance', 'useEffect']
  },
  {
    id: '2',
    title: 'Migração de monólito para microserviços: o que aprendi',
    content: `## O Desafio

Tínhamos uma aplicação monolítica com 500k+ linhas de código, difícil de manter e escalar. A decisão foi migrar para microserviços, mas o processo foi mais complexo do que imaginávamos.

## Estratégia Adotada

1. **Strangler Fig Pattern**: Começamos envolvendo partes do monólito com APIs
2. **Database per Service**: Cada microserviço com seu próprio banco
3. **Event-Driven Communication**: Usamos RabbitMQ para comunicação assíncrona

## Problemas Encontrados

### 1. Distributed Transactions
\`\`\`sql
-- Problema: Como manter consistência entre serviços?
-- Solução: Saga Pattern com compensating transactions
\`\`\`

### 2. Logging Centralizado
Implementamos ELK Stack (Elasticsearch, Logstash, Kibana) para agregar logs de todos os serviços.

### 3. Service Discovery
Usamos Consul para descoberta dinâmica de serviços.

## Arquitetura Final

\`\`\`
API Gateway
├── Auth Service
├── User Service  
├── Product Service
├── Order Service
└── Notification Service
\`\`\`

## Lições Aprendidas

- Comece pequeno: migre um domínio de cada vez
- Invista em observabilidade desde o início
- Testes de integração são cruciais
- Documentação é ainda mais importante

## O que faria diferente

Teria investido mais em automação de CI/CD desde o início e usado Kubernetes desde o primeiro dia.`,
    summary: 'Relato completo da migração de um monólito de 500k linhas para arquitetura de microserviços...',
    categoryId: 'arquitetura',
    author: {
      name: 'João Developer',
      isAnonymous: false
    },
    createdAt: new Date('2024-01-14T15:45:00'),
    readingTime: 12,
    difficulty: 'avancado',
    upvotes: 567,
    downvotes: 23,
    comments: [
      {
        id: 'c3',
        content: 'Qual foi o maior desafio técnico durante a migração?',
        author: {
          name: 'Ana Backend',
          isAnonymous: false
        },
        createdAt: new Date('2024-01-14T16:20:00'),
        upvotes: 89,
        downvotes: 5,
        replies: [],
        isQuestion: true,
        isAnswered: false
      }
    ],
    tags: ['Microserviços', 'Arquitetura', 'DevOps', 'Saga Pattern']
  },
  {
    id: '3',
    title: 'Optimização de queries: de 30s para 200ms',
    content: `## O Problema

Uma query de relatório estava demorando 30 segundos para executar, impactando a experiência do usuário e causando timeouts.

## Análise Inicial

\`\`\`sql
-- Query original (30s)
SELECT u.name, p.title, c.content, 
       COUNT(o.id) as order_count,
       AVG(o.value) as avg_order
FROM users u
JOIN posts p ON u.id = p.user_id
JOIN comments c ON p.id = c.post_id  
JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, p.id
ORDER BY order_count DESC;
\`\`\`

## Problemas Identificados

1. **Missing Indexes**: Nenhum índice nas colunas de JOIN
2. **N+1 Problem**: Subqueries executadas para cada linha
3. **Full Table Scans**: WHERE sem índice em created_at

## Soluções Aplicadas

### 1. Índices Estratégicos
\`\`\`sql
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
\`\`\`

### 2. Query Rewriting
\`\`\`sql
-- Query otimizada (200ms)
WITH user_stats AS (
  SELECT 
    u.id,
    u.name,
    COUNT(o.id) as order_count,
    AVG(o.value) as avg_order
  FROM users u
  LEFT JOIN orders o ON u.id = o.user_id
  WHERE u.created_at > '2024-01-01'
  GROUP BY u.id, u.name
)
SELECT 
  us.name,
  p.title,
  COUNT(c.id) as comment_count,
  us.order_count,
  us.avg_order
FROM user_stats us
JOIN posts p ON us.id = p.user_id
LEFT JOIN comments c ON p.id = c.post_id
ORDER BY us.order_count DESC;
\`\`\`

### 3. Materialized Views
Para relatórios frequentes, criamos views materializadas que atualizam a cada hora.

## Resultados

- **30s → 200ms** (99.3% de melhoria)
- CPU usage reduziu 80%
- Memory usage reduziu 60%

## Tools Usadas

- **pg_stat_statements**: Para identificar queries lentas
- **EXPLAIN ANALYZE**: Para plano de execução
- **pgBadger**: Para análise de logs

## Aprendizado

Performance tuning é um processo iterativo:
1. Meça antes de otimizar
2. Entenda o plano de execução  
3. Otimize uma coisa de cada vez
4. Meça novamente

## O que faria diferente

Teria implementado monitoring desde o início e usado query caching para resultados frequentes.`,
    summary: 'Como otimizei uma query SQL de 30 segundos para 200ms usando índices e reescrita de query...',
    categoryId: 'performance',
    author: {
      name: 'João Developer',
      isAnonymous: false
    },
    createdAt: new Date('2024-01-13T09:15:00'),
    readingTime: 10,
    difficulty: 'intermediario',
    upvotes: 892,
    downvotes: 45,
    comments: [
      {
        id: 'c4',
        content: 'Como você decidiu quais índices criar? Usou alguma ferramenta específica?',
        author: {
          name: 'Pedro DBA',
          isAnonymous: false
        },
        createdAt: new Date('2024-01-13T10:00:00'),
        upvotes: 67,
        downvotes: 3,
        replies: [],
        isQuestion: true,
        isAnswered: false
      }
    ],
    tags: ['SQL', 'Performance', 'PostgreSQL', 'Indexing']
  },
  {
    id: '4',
    title: 'Implementando CI/CD do zero com GitHub Actions',
    content: `## O Contexto

Time pequeno, deployments manuais, frequentes erros em produção. Precisávamos automação urgente.

## Setup Inicial

### 1. Estrutura de Pastas
\`\`\`
.github/
├── workflows/
│   ├── ci.yml
│   ├── deploy-staging.yml
│   └── deploy-production.yml
└── scripts/
    ├── test.sh
    └── deploy.sh
\`\`\`

### 2. CI Pipeline
\`\`\`yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
\`\`\`

## Deploy Automatizado

### Staging (a cada push)
\`\`\`yaml
name: Deploy Staging
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: |
          docker build -t app:staging .
          docker push registry/app:staging
          kubectl set image deployment/app app=registry/app:staging
\`\`\`

### Production (manual approval)
\`\`\`yaml
name: Deploy Production
on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        run: ./scripts/deploy.sh production
\`\`\`

## Segredos e Variáveis

\`\`\`bash
# Secrets no GitHub
DATABASE_URL=\${{ secrets.DATABASE_URL }}
API_KEY=\${{ secrets.API_KEY }}
DOCKER_REGISTRY_TOKEN=\${{ secrets.DOCKER_REGISTRY_TOKEN }}
\`\`\`

## Monitoramento

Integramos com Slack para notificações:
\`\`\`yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: \${{ job.status }}
    channel: '#deployments'
\`\`\`

## Problemas e Soluções

### 1. Secrets Management
- **Problema**: Hardcoded secrets
- **Solução**: GitHub Secrets com environment-specific

### 2. Rollback Automático
\`\`\`yaml
- name: Health Check
  run: curl -f https://app.com/health || kubectl rollout undo deployment/app
\`\`\`

### 3. Cache de Dependências
\`\`\`yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
\`\`\`

## Métricas Após Implementação

- **Deployment time**: 2h → 10min
- **Human errors**: 90% reduction
- **Deployment frequency**: 1x/semana → 3x/day
- **Recovery time**: 4h → 15min

## Lições Aprendidas

1. Comece simples, evolua gradualmente
2. Automatize o rollback antes de automatizar o deploy
3. Monitore tudo o que for automatizado
4. Documente o pipeline

## O que faria diferente

Teria usado Infrastructure as Code (Terraform) desde o início e implementado feature flags para deployments mais seguros.`,
    summary: 'Guia completo de como implementei CI/CD do zero usando GitHub Actions...',
    categoryId: 'devops',
    author: {
      name: 'João Developer',
      isAnonymous: false
    },
    createdAt: new Date('2024-01-12T14:30:00'),
    readingTime: 15,
    difficulty: 'iniciante',
    upvotes: 445,
    downvotes: 18,
    comments: [
      {
        id: 'c5',
        content: 'Qual foi o maior desafio na implementação do CI/CD?',
        author: {
          name: 'Lucas DevOps',
          isAnonymous: false
        },
        createdAt: new Date('2024-01-12T15:00:00'),
        upvotes: 34,
        downvotes: 2,
        replies: [],
        isQuestion: true,
        isAnswered: false
      }
    ],
    tags: ['CI/CD', 'GitHub Actions', 'DevOps', 'Automation']
  },
  {
    id: '5',
    title: 'TypeScript: Como tipagem salvou meu projeto',
    content: `## O Problema

Projeto JavaScript com 50k+ linhas, bugs frequentes em produção, time perdido debugando erros de tipo.

## Migração Gradual

### Fase 1: Setup Inicial
\`\`\`bash
# Instalação
npm install -D typescript @types/node @types/react
npx tsc --init
\`\`\`

### Fase 2: Configuração
\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true
  }
}
\`\`\`

## Casos Práticos

### 1. Props Typing
\`\`\`typescript
// ANTES - JavaScript
function UserCard({ user, onClick }) {
  return <div onClick={onClick}>{user.name}</div>;
}

// DEPOIS - TypeScript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface UserCardProps {
  user: User;
  onClick: (user: User) => void;
}

function UserCard({ user, onClick }: UserCardProps) {
  return <div onClick={() => onClick(user)}>{user.name}</div>;
}
\`\`\`

### 2. API Responses
\`\`\`typescript
// Tipagem de API
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface UserResponse {
  users: User[];
  total: number;
}

async function getUsers(): Promise<ApiResponse<UserResponse>> {
  const response = await fetch('/api/users');
  return response.json();
}
\`\`\`

### 3. Error Handling
\`\`\`typescript
// Tipagem de erros
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
  }
}

// Type Guards
function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
\`\`\`

## Benefícios Observados

### 1. Compile-time Errors
\`\`\`typescript
// Erro detectado em tempo de compilação
user.nmae; // Property 'nmae' does not exist on type 'User'
\`\`\`

### 2. IntelliSense Melhorado
Autocompletar para props, métodos e tipos.

### 3. Refactoring Seguro
Renomear propriedades com confiança.

## Padrões Avançados

### 1. Utility Types
\`\`\`typescript
// Pick - selecionar propriedades
type UserBasicInfo = Pick<User, 'id' | 'name' | 'email'>;

// Omit - remover propriedades  
type CreateUserRequest = Omit<User, 'id'>;

// Partial - todas opcionais
type UpdateUserRequest = Partial<User>;
\`\`\`

### 2. Generics
\`\`\`typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
}

class UserRepository implements Repository<User> {
  // implementação...
}
\`\`\`

## Métricas

- **Runtime errors**: -70%
- **Development velocity**: +40%
- **Code review time**: -50%
- **New developer onboarding**: -60%

## Ferramentas Úteis

- **ESLint + @typescript-eslint**: Code quality
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **ts-node**: TypeScript execution

## O que faria diferente

Teria começado com \`strict: true\` desde o início e usado mais utility types para evitar repetição.`,
    summary: 'Como a migração para TypeScript reduziu bugs em 70% e melhorou a produtividade do time...',
    categoryId: 'frontend',
    author: {
      name: 'João Developer',
      isAnonymous: false
    },
    createdAt: new Date('2024-01-11T08:00:00'),
    readingTime: 18,
    difficulty: 'iniciante',
    upvotes: 723,
    downvotes: 8,
    comments: [
      {
        id: 'c6',
        content: 'Como você lidou com bibliotecas sem tipagem?',
        author: {
          name: 'Mariana TS',
          isAnonymous: false
        },
        createdAt: new Date('2024-01-11T09:00:00'),
        upvotes: 45,
        downvotes: 1,
        replies: [
          {
            id: 'c6-reply',
            content: 'Criei type declarations para as principais bibliotecas e usei // @ts-ignore como último recurso. Também contribuí com types para DefinitelyTyped.',
            author: {
              name: 'João Developer',
              isAnonymous: false
            },
            createdAt: new Date('2024-01-11T09:30:00'),
            upvotes: 28,
            downvotes: 0,
            replies: [],
            parentId: 'c6',
            isAnswered: true
          }
        ],
        isQuestion: true,
        isAnswered: true
      }
    ],
    tags: ['TypeScript', 'Frontend', 'Type Safety', 'JavaScript']
  }
];
