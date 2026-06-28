export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    icon: '⚛️',
    color: '#61dafb',
    description: 'Desenvolvimento de interfaces e experiência do usuário'
  },
  {
    id: 'backend',
    name: 'Backend',
    icon: '�',
    color: '#68217a',
    description: 'Servidores, APIs e lógica de negócio'
  },
  {
    id: 'devops',
    name: 'DevOps',
    icon: '�',
    color: '#ff6b35',
    description: 'CI/CD, containers e infraestrutura'
  },
  {
    id: 'arquitetura',
    name: 'Arquitetura de Software',
    icon: '🏗️',
    color: '#2c3e50',
    description: 'Padrões, design e estruturas de sistemas'
  },
  {
    id: 'bugs',
    name: 'Bugs e Debugging',
    icon: '�',
    color: '#e74c3c',
    description: 'Resolução de problemas e caça aos bugs'
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: '⚡',
    color: '#f39c12',
    description: 'Otimização e melhoria de desempenho'
  },
  {
    id: 'projetos',
    name: 'Projetos Reais',
    icon: '�',
    color: '#27ae60',
    description: 'Casos práticos e implementações'
  },
  {
    id: 'aprendizados',
    name: 'Aprendizados',
    icon: '📖',
    color: '#8e44ad',
    description: 'Descobertas e novos conhecimentos'
  },
  {
    id: 'erros',
    name: 'Erros e Falhas',
    icon: '❌',
    color: '#c0392b',
    description: 'Falhas e o que aprendi com elas'
  },
  {
    id: 'boas-praticas',
    name: 'Boas Práticas',
    icon: '✅',
    color: '#16a085',
    description: 'Padrões e melhores abordagens'
  }
];
