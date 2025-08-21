# 🎯 TaskRoulette

Uma aplicação moderna e interativa para distribuição justa de tarefas via roleta!

[![Demo](https://img.shields.io/badge/🌐_Demo-Live-success)](https://willianszwy.github.io/roleta/)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646cff)](https://vitejs.dev/)

## ✨ Funcionalidades

### 🎯 **Sistema de Projetos Multi-Tarefa**
- **Projetos Múltiplos**: Gerencie vários projetos independentes com dados isolados
- **Tarefas Multi-Responsáveis**: Atribua 1-10 participantes por tarefa automaticamente
- **Equipes Globais**: Crie equipes reutilizáveis entre diferentes projetos
- **Sistema de Fila**: Tarefas são processadas automaticamente em ordem de prioridade

### 🎯 **Distribuição Inteligente**
- **Sorteios Consecutivos**: Para tarefas que precisam de múltiplos responsáveis
- **Algoritmo Anti-Duplicação**: Evita selecionar o mesmo participante duas vezes
- **Progresso Visual**: Acompanhe quantos participantes faltam ser sorteados
- **Modal de Conclusão**: Lista completa dos responsáveis selecionados

### 🎨 **Interface & Design**
- **Design Glassmorphism**: Interface moderna com efeitos de vidro e blur
- **Layout Responsivo**: Grid adaptativo (3→2→1 colunas) para todos os dispositivos
- **Animações Fluidas**: Roleta gira suavemente por 4.5s com easing otimizado
- **Modal Full-Screen**: Overlay completo usando React Portal para máxima compatibilidade

### 🎛️ **Configurações Avançadas**
- **Context API + useReducer**: Gerenciamento de estado robusto e previsível  
- **Persistência Automática**: Todos os dados salvos no localStorage com migração automática
- **Modo Participantes**: Sorteio clássico simples (modo legacy)
- **Remoção Automática**: Remove participantes vencedores automaticamente

### 🎉 **Experiência do Usuário**
- **Efeitos Celebrativos**: Confete animado ao concluir tarefas
- **Feedback Visual**: Indicadores claros de próximas tarefas e progresso
- **Zero Race Conditions**: State machine elimina conflitos de estado
- **Performance Otimizada**: Código limpo e build otimizado para produção

## 🚀 Demo

Experimente agora: [**TaskRoulette Live Demo**](https://willianszwy.github.io/roleta/)

## 🛠️ Tecnologias

- **React 19** - Interface reativa moderna
- **TypeScript** - Tipagem estática para maior confiabilidade
- **Vite** - Build tool ultrarrápida
- **Styled Components** - CSS-in-JS com tema dinâmico
- **Framer Motion** - Animações fluidas e performáticas
- **Canvas Confetti** - Efeitos visuais celebrativos

## 🏃‍♂️ Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/willianszwy/roleta.git

# Entre no diretório
cd roleta

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build de produção
npm run lint     # Análise de código com ESLint
```

## 🎮 Como Usar

### 🏗️ **Criando Projeto Multi-Tarefa**
1. **Criar Projeto**: Use o seletor de projetos no header para criar um novo projeto
2. **Adicionar Participantes**: Importe participantes individuais ou em massa
3. **Criar Equipes Globais**: (Opcional) Organize participantes em equipes reutilizáveis  
4. **Adicionar Tarefas**: Configure quantos participantes cada tarefa precisa (1-10)

### 🎯 **Executando Sorteios Multi-Participante**
1. **Sortear Tarefa**: Clique "Sortear Responsável" para iniciar primeira tarefa da fila
2. **Acompanhar Progresso**: Veja barra de progresso e lista de selecionados
3. **Sortear Participantes**: Continue clicando até completar todos os responsáveis necessários
4. **Ver Conclusão**: Modal mostra todos os responsáveis sorteados para a tarefa

### 📋 **Modo Participantes (Legacy)**
1. **Alternar Modo**: Use as configurações para voltar ao modo clássico
2. **Sorteio Simples**: Um participante por vez, interface tradicional
3. **Ideal Para**: Sorteios simples, escolhas únicas, decisões rápidas

### ⚙️ **Funcionalidades Avançadas**
- **Projetos Independentes**: Cada projeto mantém seus próprios dados isolados
- **Import/Export**: Equipes podem ser importadas para projetos específicos  
- **Histórico Detalhado**: Rastreamento completo de todas as atribuições
- **Persistência Robusta**: Sistema de migração automática de dados legados

## 🏗️ Arquitetura

```
src/
├── components/              # Componentes React reutilizáveis
│   ├── ProjectSelector/    # Seletor de projetos no header
│   ├── TeamManager/        # Gerenciamento de equipes globais  
│   ├── TaskRoulette/       # Roleta principal (layout 2 colunas)
│   ├── Roulette/          # Roleta modo participantes (legacy)
│   ├── ParticipantManager/ # Gerenciamento de participantes
│   ├── TaskManager/        # Gerenciamento de tarefas multi-responsáveis
│   ├── TaskHistory/        # Histórico de tarefas com responsáveis
│   ├── History/           # Histórico participantes (legacy)
│   ├── WinnerModal/       # Modal glassmorphism com React Portal
│   ├── Settings/          # Configurações e preferências
│   └── SidePanel/         # Painel lateral responsivo unificado
├── context/               # Estado global centralizado
│   ├── RouletteContext.tsx # Context API principal  
│   ├── RouletteProvider.tsx# Provider com persistência
│   └── RouletteReducer.ts  # Reducer com actions atômicas
├── hooks/                 # Hooks customizados
│   ├── useLocalStorage.ts # Persistência localStorage robusta
│   └── useA11y.ts        # Hooks de acessibilidade
├── types/                 # Definições TypeScript completas
│   └── index.ts          # Project, Team, TaskHistory types
├── utils/                 # Funções utilitárias otimizadas  
│   ├── helpers.ts        # Algoritmos de rotação e cores
│   └── taskExportHelpers.ts # Importação/exportação de dados
└── design-system/         # Sistema de design modular
    ├── components/        # Componentes base reutilizáveis
    ├── tokens.ts         # Design tokens do sistema
    └── hooks/            # Hooks de design (breakpoints, toggle)
```

### 🎨 **Arquitetura Técnica**

#### **State Management**
- **Context API + useReducer**: Estado centralizado e previsível
- **Actions Atômicas**: Eliminam race conditions completamente  
- **State Machine**: Estados `idle` → `spinning` → `completed` com timing perfeito
- **Persistência Inteligente**: Auto-migração de dados legados para nova estrutura

#### **Performance & UX**
- **React Portal**: Modais renderizados fora da árvore DOM para overlay completo
- **Lazy Loading**: Componentes carregados sob demanda
- **Virtual Scrolling**: Listas grandes otimizadas para performance
- **Debounced Inputs**: Evita re-renders desnecessários em formulários

#### **Design System**
- **Glassmorphism**: `rgba(255, 255, 255, 0.08)` + `backdrop-filter: blur(15px)`
- **Grid Responsivo**: 3-col → 2-col → 1-col com breakpoints otimizados
- **Animações Fluidas**: Framer Motion com timing de 4.5s e easing personalizado
- **Tokens Design**: Sistema modular de cores, espaçamentos e tipografia

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ por [Willians](https://github.com/willianszwy)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!