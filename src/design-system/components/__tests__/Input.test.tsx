import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input, TextArea } from '../Input';

describe('Input Component', () => {
  it('renders input correctly', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with label', () => {
    render(<Input label="Username" placeholder="Enter username" />);
    
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('shows error message and applies error styles', () => {
    render(
      <Input
        label="Email"
        placeholder="Enter email"
        error="Email is required"
      />
    );
    
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toHaveStyle({
      color: '#f87171',
    });
  });

  it('handles user input correctly', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    
    render(
      <Input
        placeholder="Type here"
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hello World');
    
    expect(handleChange).toHaveBeenCalledTimes(11); // One for each character
  });

  it('applies fullWidth prop', () => {
    render(<Input fullWidth placeholder="Full width input" />);
    const container = screen.getByPlaceholderText('Full width input').closest('div');
    expect(container).toHaveStyle({ width: '100%' });
  });

  it('renders with start and end icons', () => {
    const StartIcon = () => <span data-testid="start-icon">🔍</span>;
    const EndIcon = () => <span data-testid="end-icon">✓</span>;
    
    render(
      <Input
        placeholder="Search"
        startIcon={<StartIcon />}
        endIcon={<EndIcon />}
      />
    );
    
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    
    expect(input).toBeDisabled();
    expect(input).toHaveStyle({
      cursor: 'not-allowed',
    });
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />);
    let input = screen.getByPlaceholderText('Email');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type="password" placeholder="Password" />);
    input = screen.getByPlaceholderText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });
});

describe('TextArea Component', () => {
  it('renders textarea correctly', () => {
    render(<TextArea placeholder="Enter description" />);
    const textarea = screen.getByPlaceholderText('Enter description');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('renders with label', () => {
    render(<TextArea label="Description" placeholder="Enter description" />);
    
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(
      <TextArea
        label="Comments"
        placeholder="Enter comments"
        error="Comments are required"
      />
    );
    
    expect(screen.getByText('Comments are required')).toBeInTheDocument();
  });

  it('handles user input correctly', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    
    render(
      <TextArea
        placeholder="Type here"
        value=""
        onChange={handleChange}
      />
    );
    
    const textarea = screen.getByPlaceholderText('Type here');
    await user.type(textarea, 'Hello');
    
    expect(handleChange).toHaveBeenCalledTimes(5);
  });

  it('applies fullWidth prop', () => {
    render(<TextArea fullWidth placeholder="Full width textarea" />);
    const container = screen.getByPlaceholderText('Full width textarea').closest('div');
    expect(container).toHaveStyle({ width: '100%' });
  });

  it('supports rows attribute', () => {
    render(<TextArea rows={5} placeholder="Multi-line input" />);
    const textarea = screen.getByPlaceholderText('Multi-line input');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('handles disabled state', () => {
    render(<TextArea disabled placeholder="Disabled textarea" />);
    const textarea = screen.getByPlaceholderText('Disabled textarea');
    
    expect(textarea).toBeDisabled();
  });
});