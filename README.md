# 🎰 LuckyWheel

Uma aplicação moderna e interativa de roleta para sorteios justos e divertidos!

[![Demo](https://img.shields.io/badge/🌐_Demo-Live-success)](https://willianszwy.github.io/roleta/)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646cff)](https://vitejs.dev/)

## ✨ Funcionalidades

- 🎯 **Sorteios Justos**: Algoritmo de seleção aleatória confiável
- 🎨 **Interface Moderna**: Design glassmorphism com animações fluidas
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 💾 **Persistência Local**: Seus participantes e histórico são salvos automaticamente
- 🎉 **Animações Celebrativas**: Efeitos de confete ao selecionar um vencedor
- 📊 **Histórico Completo**: Acompanhe todos os sorteios realizados
- ⚡ **Performance**: Construído com Vite para carregamento ultrarrápido

## 🚀 Demo

Experimente agora: [**LuckyWheel Live Demo**](https://willianszwy.github.io/roleta/)

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

1. **Adicione Participantes**: Digite nomes na caixa de texto e clique em "Adicionar"
2. **Gire a Roleta**: Clique no botão "Girar Roleta" para iniciar o sorteio
3. **Veja o Resultado**: A roleta girará e selecionará um vencedor aleatório
4. **Gerencie o Histórico**: Acompanhe todos os sorteios e remova participantes se necessário

## 🏗️ Arquitetura

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── Roulette/       # Componente principal da roleta
│   ├── ParticipantManager/ # Gerenciamento de participantes
│   └── History/        # Histórico de sorteios
├── hooks/              # Hooks customizados
│   ├── useRoulette.ts  # Lógica principal da aplicação
│   └── useLocalStorage.ts # Persistência local
├── types/              # Definições TypeScript
├── utils/              # Funções utilitárias
└── styles/             # Estilos globais
```

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