import React from 'react';
import { render, fireEvent } from '@testing-library/react';
// @ts-ignore - temporary fix for React 19 compatibility
import { screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      background: 'rgba(102, 126, 234, 0.2)',
    });
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveStyle({
      background: 'rgba(255, 255, 255, 0.08)',
    });

    rerender(<Button variant="success">Success</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveStyle({
      background: 'rgba(34, 197, 94, 0.2)',
    });

    rerender(<Button variant="error">Error</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveStyle({
      background: 'rgba(239, 68, 68, 0.2)',
    });

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveStyle({
      background: 'transparent',
    });
  });

  it('applies correct size styles', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveStyle({
      padding: '0.5rem 0.75rem',
      fontSize: '0.75rem',
    });

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveStyle({
      padding: '1rem 1.25rem',
      fontSize: '1rem',
    });
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<Button loading>Loading Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveStyle({ color: 'transparent' });
  });

  it('handles disabled state', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies fullWidth prop correctly', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ width: '100%' });
  });

  it('supports different button types', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');

    rerender(<Button type="reset">Reset</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('applies custom className and style', () => {
    render(
      <Button className="custom-class" style={{ margin: '10px' }}>
        Custom Button
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveStyle({ margin: '10px' });
  });

  it('prevents interaction when loading', () => {
    const handleClick = jest.fn();
    render(
      <Button loading onClick={handleClick}>
        Loading Button
      </Button>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});