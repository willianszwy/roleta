# Feature Development Guidelines

## 🎯 Padrões Obrigatórios para Novas Features

### 📋 Checklist de Planejamento (SEMPRE necessário)

Antes de iniciar qualquer feature, criar uma task de planejamento que inclua:

1. **Análise de Requisitos**
   - Definir escopo e objetivos claros
   - Identificar componentes afetados
   - Mapear dependências e integrações

2. **Arquitetura e Design**
   - Definir estrutura de componentes
   - Planejar integração com design system
   - Considerar performance e bundle size

3. **Estratégia de Implementação**
   - Quebrar em subtasks menores
   - Definir ordem de implementação
   - Identificar pontos de risco

### ✅ Testes (OBRIGATÓRIO)

Toda nova feature DEVE incluir:

- **Unit Tests**: Para lógica de negócio e hooks
- **Component Tests**: Para comportamento dos componentes
- **Integration Tests**: Para fluxos completos
- **Accessibility Tests**: Usando jest-axe
- **Coverage mínimo**: 80% para novos códigos

```typescript
// Exemplo de estrutura de teste obrigatória
describe('NovaFeature', () => {
  // Unit tests
  describe('Logic', () => { });
  
  // Component tests  
  describe('Component Behavior', () => { });
  
  // Integration tests
  describe('Integration Flows', () => { });
  
  // Accessibility tests
  describe('Accessibility', () => { });
});
```

### ♿ Acessibilidade (OBRIGATÓRIO)

Toda nova feature DEVE implementar:

- **ARIA labels e roles** apropriados
- **Navegação por teclado** funcional
- **Screen reader** compatibilidade
- **Contraste de cores** adequado (WCAG 2.1 AA)
- **Focus management** correto

```typescript
// Exemplo de implementação obrigatória
const NovoComponente = () => {
  return (
    <div
      role="region"
      aria-label={t('novaFeature.label')}
      aria-describedby="feature-description"
    >
      {/* Implementação com a11y */}
    </div>
  );
};
```

### 🌐 Internacionalização (OBRIGATÓRIO)

Toda nova feature DEVE incluir:

- **Chaves de tradução** para todos os textos
- **Traduções completas** em 4 idiomas (pt-BR, en-US, es-ES, fr-FR)
- **Formatação de dados** localizados
- **Zero texto hardcoded**

```typescript
// Estrutura obrigatória em types.ts
export type TranslationKey = 
  | 'novaFeature.title'
  | 'novaFeature.description'
  | 'novaFeature.action'
  | 'novaFeature.success'
  | 'novaFeature.error'
  // ... todas as chaves necessárias

// Uso obrigatório no componente
const { t } = useI18n();
return <h1>{t('novaFeature.title')}</h1>;
```

### 📂 Estrutura de Arquivos Obrigatória

```
src/components/NovaFeature/
├── NovaFeature.tsx              # Componente principal
├── index.ts                     # Export público
├── __tests__/
│   ├── NovaFeature.test.tsx     # Testes do componente
│   └── integration.test.tsx     # Testes de integração
└── types.ts                     # Tipos específicos (se necessário)

src/i18n/locales/
├── pt-BR.ts                     # Adicionar novas chaves
├── en-US.ts                     # Adicionar novas chaves  
├── es-ES.ts                     # Adicionar novas chaves
└── fr-FR.ts                     # Adicionar novas chaves

src/i18n/types.ts                # Atualizar TranslationKey
```

### 🔄 Workflow de Desenvolvimento

1. **Planejamento** (TODO item obrigatório)
   - Criar task de planejamento detalhado
   - Definir acceptance criteria
   - Estimar esforço para cada aspecto

2. **Implementação** (seguir ordem)
   - Tipos e interfaces
   - Lógica de negócio + unit tests
   - Componentes + component tests  
   - Traduções (4 idiomas)
   - Acessibilidade + a11y tests
   - Integration tests

3. **Validação** (checklist obrigatório)
   - ✅ Todos os testes passando
   - ✅ Coverage > 80%
   - ✅ ESLint sem errors
   - ✅ Build funcionando
   - ✅ Acessibilidade validada
   - ✅ Traduções completas

### 🚨 Critérios de Bloqueio

**NÃO mergeabilidade se:**
- Faltam testes (qualquer tipo)
- Falta acessibilidade
- Faltam traduções
- Coverage < 80%
- ESLint com errors
- Build quebrado

### 📝 Template de Commit

```
feat: implementar [nome da feature]

## Feature
- [Descrição concisa da funcionalidade]

## Implementação
- ✅ Testes: unit, component, integration, a11y
- ✅ Acessibilidade: ARIA, keyboard, screen reader
- ✅ i18n: traduções pt-BR, en-US, es-ES, fr-FR
- ✅ Coverage: X% (mínimo 80%)

## Validação
- [ ] Manual testing completo
- [ ] Accessibility testing
- [ ] Multi-language testing

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 🎯 Lembretes Automáticos

**Sempre que iniciar uma nova feature:**

1. ❓ Criei a task de planejamento?
2. ❓ Defini os testes necessários?
3. ❓ Planejei a acessibilidade?
4. ❓ Listei todas as traduções necessárias?
5. ❓ Considerei impacto no design system?

**Antes de finalizar:**

1. ❓ Todos os testes estão passando?
2. ❓ A feature é totalmente acessível?
3. ❓ Todas as traduções estão implementadas?
4. ❓ O coverage está acima de 80%?
5. ❓ A documentação está atualizada?

---

## 💡 Benefícios Esperados

- **Qualidade consistente** em todas as features
- **Experiência acessível** para todos os usuários
- **Suporte multilingual** completo
- **Cobertura de testes** robusta
- **Manutenibilidade** a longo prazo
- **Performance** otimizada