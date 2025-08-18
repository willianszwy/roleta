import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Button, 
  Input, 
  TextArea, 
  Card, 
  Modal, 
  tokens,
  useToggle,
  useBreakpoint 
} from '../index';

const DemoContainer = styled.div`
  padding: ${tokens.spacing['3xl']};
  max-width: 1200px;
  margin: 0 auto;
  background: ${tokens.colors.background.body};
  min-height: 100vh;
`;

const Section = styled.section`
  margin-bottom: ${tokens.spacing['4xl']};
`;

const SectionTitle = styled.h2`
  font-size: ${tokens.typography.sizes['2xl']};
  font-weight: ${tokens.typography.fontWeights.bold};
  color: ${tokens.colors.text.primary};
  margin-bottom: ${tokens.spacing['2xl']};
  background: ${tokens.colors.primaryGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${tokens.spacing.lg};
  margin-bottom: ${tokens.spacing['2xl']};
`;

const CodeBlock = styled.pre`
  background: ${tokens.colors.glass.primary};
  border: 1px solid ${tokens.colors.glass.border};
  border-radius: ${tokens.borderRadius.lg};
  padding: ${tokens.spacing.lg};
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.sizes.sm};
  overflow-x: auto;
  margin: ${tokens.spacing.lg} 0;
`;

export const DesignSystemDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [isModalOpen, toggleModal] = useToggle(false);
  const { current: breakpoint, width } = useBreakpoint();

  return (
    <DemoContainer>
      <SectionTitle>TaskRoulette Design System</SectionTitle>
      
      {/* Responsive Info */}
      <Card padding="sm" variant="outlined">
        <p style={{ color: tokens.colors.text.primary, margin: 0 }}>
          Breakpoint atual: <strong>{breakpoint}</strong> | Largura: <strong>{width}px</strong>
        </p>
      </Card>

      {/* Buttons Section */}
      <Section>
        <SectionTitle>Buttons</SectionTitle>
        <Grid>
          <Card>
            <h3 style={{ color: tokens.colors.text.primary, marginTop: 0 }}>Variants</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="error">Error</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </Card>

          <Card>
            <h3 style={{ color: tokens.colors.text.primary, marginTop: 0 }}>Sizes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </Card>

          <Card>
            <h3 style={{ color: tokens.colors.text.primary, marginTop: 0 }}>States</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
              <Button>Normal</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button fullWidth>Full Width</Button>
            </div>
          </Card>
        </Grid>

        <CodeBlock>
{`<Button variant="primary" size="lg" loading>
  Loading Button
</Button>`}
        </CodeBlock>
      </Section>

      {/* Inputs Section */}
      <Section>
        <SectionTitle>Form Controls</SectionTitle>
        <Grid>
          <Card>
            <h3 style={{ color: tokens.colors.text.primary, marginTop: 0 }}>Input</h3>
            <Input
              label="Nome"
              placeholder="Digite seu nome..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              fullWidth
            />
            
            <div style={{ marginTop: tokens.spacing.lg }}>
              <Input
                label="Email com erro"
                placeholder="email@exemplo.com"
                error="Email é obrigatório"
                fullWidth
              />
            </div>
          </Card>

          <Card>
            <h3 style={{ color: tokens.colors.text.primary, marginTop: 0 }}>TextArea</h3>
            <TextArea
              label="Descrição"
              placeholder="Digite uma descrição..."
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
              fullWidth
            />
          </Card>
        </Grid>

        <CodeBlock>
{`<Input
  label="Email"
  placeholder="email@exemplo.com"
  error="Email é obrigatório"
  fullWidth
/>`}
        </CodeBlock>
      </Section>

      {/* Cards Section */}
      <Section>
        <SectionTitle>Cards</SectionTitle>
        <Grid>
          <Card variant="glass" hoverable>
            <h3 style={{ color: tokens.colors.text.primary, marginTop: 0 }}>Glass Card</h3>
            <p style={{ color: tokens.colors.text.secondary, margin: 0 }}>
              Card com efeito glassmorphism
            </p>
          </Card>

          <Card variant="solid" hoverable>
            <h3 style={{ color: tokens.colors.text.primary, marginTop: 0 }}>Solid Card</h3>
            <p style={{ color: tokens.colors.text.secondary, margin: 0 }}>
              Card com fundo sólido
            </p>
          </Card>

          <Card variant="outlined" hoverable>
            <h3 style={{ color: tokens.colors.text.primary, marginTop: 0 }}>Outlined Card</h3>
            <p style={{ color: tokens.colors.text.secondary, margin: 0 }}>
              Card apenas com borda
            </p>
          </Card>
        </Grid>

        <CodeBlock>
{`<Card variant="glass" hoverable>
  <h3>Título do Card</h3>
  <p>Conteúdo do card...</p>
</Card>`}
        </CodeBlock>
      </Section>

      {/* Modal Section */}
      <Section>
        <SectionTitle>Modal</SectionTitle>
        <Button onClick={toggleModal}>Abrir Modal</Button>
        
        <Modal
          isOpen={isModalOpen}
          onClose={toggleModal}
          title="Modal de Exemplo"
        >
          <p style={{ color: tokens.colors.text.primary }}>
            Este é um exemplo de modal usando o design system.
          </p>
          <div style={{ marginTop: tokens.spacing.lg }}>
            <Button variant="success" onClick={toggleModal} fullWidth>
              Confirmar
            </Button>
          </div>
        </Modal>

        <CodeBlock>
{`<Modal
  isOpen={isModalOpen}
  onClose={toggleModal}
  title="Título do Modal"
>
  <p>Conteúdo do modal...</p>
</Modal>`}
        </CodeBlock>
      </Section>

      {/* Color Tokens */}
      <Section>
        <SectionTitle>Design Tokens</SectionTitle>
        <Card>
          <h3 style={{ color: tokens.colors.text.primary, marginTop: 0 }}>Cores</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: tokens.spacing.md }}>
            <div>
              <div style={{ 
                background: tokens.colors.primary.main, 
                height: '40px', 
                borderRadius: tokens.borderRadius.md,
                marginBottom: tokens.spacing.sm 
              }} />
              <small style={{ color: tokens.colors.text.secondary }}>Primary</small>
            </div>
            <div>
              <div style={{ 
                background: tokens.colors.secondary.main, 
                height: '40px', 
                borderRadius: tokens.borderRadius.md,
                marginBottom: tokens.spacing.sm 
              }} />
              <small style={{ color: tokens.colors.text.secondary }}>Secondary</small>
            </div>
            <div>
              <div style={{ 
                background: tokens.colors.success.main, 
                height: '40px', 
                borderRadius: tokens.borderRadius.md,
                marginBottom: tokens.spacing.sm 
              }} />
              <small style={{ color: tokens.colors.text.secondary }}>Success</small>
            </div>
            <div>
              <div style={{ 
                background: tokens.colors.error.main, 
                height: '40px', 
                borderRadius: tokens.borderRadius.md,
                marginBottom: tokens.spacing.sm 
              }} />
              <small style={{ color: tokens.colors.text.secondary }}>Error</small>
            </div>
          </div>
        </Card>
      </Section>
    </DemoContainer>
  );
};