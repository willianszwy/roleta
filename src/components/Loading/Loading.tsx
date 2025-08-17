import React from 'react';
import styled, { keyframes } from 'styled-components';
import { tokens } from '../../design-system';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.4; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${tokens.spacing['3xl']};
  min-height: 120px;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${tokens.colors.glass.border};
  border-top: 3px solid ${tokens.colors.primary.main};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: ${tokens.spacing.lg};
`;

const LoadingText = styled.p`
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.sizes.sm};
  font-weight: ${tokens.typography.fontWeights.medium};
  margin: 0;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};
  width: 100%;
  max-width: 300px;
`;

const SkeletonLine = styled.div<{ width?: string; height?: string }>`
  background: ${tokens.colors.glass.primary};
  border-radius: ${tokens.borderRadius.md};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '16px'};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

interface LoadingProps {
  text?: string;
  variant?: 'spinner' | 'skeleton';
}

export const Loading: React.FC<LoadingProps> = ({ 
  text = 'Carregando...', 
  variant = 'spinner' 
}) => {
  if (variant === 'skeleton') {
    return (
      <LoadingContainer>
        <LoadingSkeleton>
          <SkeletonLine height="24px" width="60%" />
          <SkeletonLine height="16px" width="100%" />
          <SkeletonLine height="16px" width="80%" />
          <SkeletonLine height="16px" width="90%" />
        </LoadingSkeleton>
      </LoadingContainer>
    );
  }

  return (
    <LoadingContainer>
      <Spinner />
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
};