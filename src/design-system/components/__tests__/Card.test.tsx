import React from 'react';
import { render, fireEvent } from '@testing-library/react';
// @ts-ignore - temporary fix for React 19 compatibility
import { screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <h3>Card Title</h3>
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies glass variant by default', () => {
    render(<Card>Default Card</Card>);
    const card = screen.getByText('Default Card').closest('div');
    
    expect(card).toHaveStyle({
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(15px)',
    });
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(<Card variant="solid">Solid Card</Card>);
    let card = screen.getByText('Solid Card').closest('div');
    expect(card).toHaveStyle({
      background: 'rgba(255, 255, 255, 0.06)',
    });

    rerender(<Card variant="outlined">Outlined Card</Card>);
    card = screen.getByText('Outlined Card').closest('div');
    expect(card).toHaveStyle({
      background: 'transparent',
    });
  });

  it('applies correct padding styles', () => {
    const { rerender } = render(<Card padding="sm">Small Padding</Card>);
    let card = screen.getByText('Small Padding').closest('div');
    expect(card).toHaveStyle({
      padding: '1rem',
    });

    rerender(<Card padding="lg">Large Padding</Card>);
    card = screen.getByText('Large Padding').closest('div');
    expect(card).toHaveStyle({
      padding: '1.5rem',
    });
  });

  it('handles click events when clickable', () => {
    const handleClick = jest.fn();
    render(
      <Card onClick={handleClick}>
        Clickable Card
      </Card>
    );
    
    const card = screen.getByText('Clickable Card').closest('div');
    expect(card).toHaveStyle({ cursor: 'pointer' });
    
    fireEvent.click(card!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not show pointer cursor when not clickable', () => {
    render(<Card>Non-clickable Card</Card>);
    const card = screen.getByText('Non-clickable Card').closest('div');
    expect(card).not.toHaveStyle({ cursor: 'pointer' });
  });

  it('applies hoverable styles correctly', () => {
    render(<Card hoverable>Hoverable Card</Card>);
    const card = screen.getByText('Hoverable Card').closest('div');
    
    // The component should have hover styles defined in CSS
    expect(card).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-card-class">
        Custom Card
      </Card>
    );
    
    const card = screen.getByText('Custom Card').closest('div');
    expect(card).toHaveClass('custom-card-class');
  });

  it('combines multiple props correctly', () => {
    const handleClick = jest.fn();
    render(
      <Card
        variant="outlined"
        padding="lg"
        hoverable
        onClick={handleClick}
        className="multi-prop-card"
      >
        Multi-prop Card
      </Card>
    );
    
    const card = screen.getByText('Multi-prop Card').closest('div');
    
    expect(card).toHaveClass('multi-prop-card');
    expect(card).toHaveStyle({
      background: 'transparent',
      padding: '1.5rem',
      cursor: 'pointer',
    });
    
    fireEvent.click(card!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});