# 🎯 TaskRoulette

Uma aplicação moderna e interativa para distribuição justa de tarefas via roleta!

[![Demo](https://img.shields.io/badge/🌐_Demo-Live-success)](https://willianszwy.github.io/roleta/)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646cff)](https://vitejs.dev/)

## ✨ Funcionalidades

### 🎯 **Foco em Distribuição de Tarefas**
- **Sistema Principal**: Distribuição justa de tarefas entre participantes
- **Sistema de Fila**: Tarefas são atribuídas automaticamente em ordem
- **Modo Participantes**: Sorteio clássico entre pessoas (secundário)

### 🎨 **Interface & Design**
- **Design Glassmorphism**: Interface moderna com efeitos de vidro e blur
- **Layout Responsivo**: Adapta-se perfeitamente a desktop, tablet e mobile
- **Animações Fluidas**: Transições suaves com Framer Motion
- **Cores Inteligentes**: Sistema de 20 cores otimizadas para evitar repetições consecutivas

### 🎛️ **Configurações Avançadas**
- **Modal de Vencedor**: Modal customizável com auto-fechamento configurável
- **Remoção Automática**: Remove vencedores automaticamente de forma transparente
- **Persistência Total**: Participantes, tarefas e histórico salvos localmente

### 🎉 **Experiência do Usuário**
- **Efeitos Celebrativos**: Confete animado ao selecionar vencedores
- **Feedback Visual**: Indicadores claros do próximo na fila
- **Sistema Anti-Fraude**: Remoção transparente antes do giro (não durante)
- **Histórico Paginado**: Performance otimizada para grandes volumes

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

### 📋 **Modo Participantes**
1. **Adicione Participantes**: Digite nomes individuais ou em lote (um por linha)
2. **Configure Opções**: Acesse as configurações para personalizar comportamento
3. **Gire a Roleta**: Clique no botão "🎰 Girar Roleta" para iniciar
4. **Veja o Resultado**: Modal mostra o vencedor com efeitos celebrativos

### 🎯 **Modo Tarefas**
1. **Mude para Modo Tarefas**: Vá em Configurações → Modo → Tarefas
2. **Adicione Participantes e Tarefas**: Use o painel lateral para gerenciar
3. **Sorteie Responsáveis**: Sistema automaticamente sorteia para a primeira tarefa da fila
4. **Acompanhe Progresso**: Veja quem foi sorteado para cada tarefa no histórico

### ⚙️ **Configurações Disponíveis**
- **Modal de Vencedor**: Ativar/desativar modal de resultado
- **Auto-Fechamento**: Configurar tempo de fechamento automático (1-10s)
- **Remoção Automática**: Remove vencedores automaticamente após sorteio
- **Modo de Sorteio**: Alternar entre Participantes e Tarefas

## 🏗️ Arquitetura

```
src/
├── components/              # Componentes React reutilizáveis
│   ├── Roulette/           # Roleta modo participantes
│   ├── TaskRoulette/       # Roleta modo tarefas (layout 2 colunas)
│   ├── ParticipantManager/ # Gerenciamento de participantes
│   ├── TaskManager/        # Gerenciamento de tarefas
│   ├── History/            # Histórico com paginação
│   ├── TaskHistory/        # Histórico de tarefas sorteadas
│   ├── WinnerModal/        # Modal de resultado glassmorphism
│   ├── Settings/           # Painel de configurações
│   └── SidePanel/          # Painel lateral responsivo
├── hooks/                  # Hooks customizados
│   ├── useRoulette.ts      # Estado modo participantes
│   ├── useTaskRoulette.ts  # Estado modo tarefas
│   └── useLocalStorage.ts  # Persistência localStorage
├── types/                  # Definições TypeScript
├── utils/                  # Funções utilitárias
│   └── helpers.ts          # Algoritmos de rotação e cores
└── styles/                 # Estilos globais glassmorphism
```

### 🎨 **Design System**
- **Glassmorphism**: `rgba(255, 255, 255, 0.08)` com `backdrop-filter: blur(15px)`
- **Gradientes**: Sistema de cores harmoniosas predefinidas
- **Responsividade**: Mobile-first com breakpoints em 768px e 1024px
- **Animações**: Framer Motion com spring physics naturais

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