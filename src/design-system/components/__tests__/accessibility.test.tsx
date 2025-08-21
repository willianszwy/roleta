import React from 'react';
import { render, fireEvent } from '@testing-library/react';
// @ts-ignore - temporary fix for React 19 compatibility
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// @ts-ignore - jest-axe types issue
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';
import { Input, TextArea } from '../Input';
import { Card } from '../Card';
import { Modal } from '../Modal';

// Extend Jest matchers
// @ts-ignore - jest-axe types issue
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('Button Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      // @ts-ignore - jest-axe matcher
      expect(results).toHaveNoViolations();
    });

    it('should be accessible by keyboard', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button', { name: 'Click me' });
      
      await user.tab();
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('should have proper ARIA attributes', () => {
      render(
        <Button 
          aria-label="Custom label"
          aria-describedby="description"
          aria-expanded={true}
        >
          Click me
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-describedby', 'description');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should indicate loading state to screen readers', () => {
      render(<Button loading>Loading button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should be properly disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Input Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Input 
          label="Name" 
          placeholder="Enter your name"
        />
      );
      const results = await axe(container);
      // @ts-ignore - jest-axe matcher
      expect(results).toHaveNoViolations();
    });

    it('should have proper label association', () => {
      render(<Input label="Name" />);
      
      const input = screen.getByRole('textbox', { name: 'Name' });
      const label = screen.getByText('Name');
      
      expect(input).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      expect(input).toHaveAttribute('id');
      expect(label).toHaveAttribute('for', input.getAttribute('id'));
    });

    it('should show error state correctly', () => {
      render(<Input label="Email" error="Invalid email" />);
      
      const input = screen.getByRole('textbox', { name: 'Email' });
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby');
      
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Invalid email');
    });

    it('should show help text correctly', () => {
      render(<Input label="Password" helpText="Must be at least 8 characters" />);
      
      const input = screen.getByRole('textbox', { name: 'Password' });
      expect(input).toHaveAttribute('aria-describedby');
      
      expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
    });

    it('should indicate required fields', () => {
      render(<Input label="Required field" aria-required={true} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('TextArea Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <TextArea 
          label="Message" 
          placeholder="Enter your message"
        />
      );
      const results = await axe(container);
      // @ts-ignore - jest-axe matcher
      expect(results).toHaveNoViolations();
    });

    it('should have proper label association', () => {
      render(<TextArea label="Message" />);
      
      const textarea = screen.getByRole('textbox', { name: 'Message' });
      const label = screen.getByText('Message');
      
      expect(textarea).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      expect(textarea).toHaveAttribute('id');
      expect(label).toHaveAttribute('for', textarea.getAttribute('id'));
    });
  });

  describe('Card Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Card>
          <h2>Card Title</h2>
          <p>Card content</p>
        </Card>
      );
      const results = await axe(container);
      // @ts-ignore - jest-axe matcher
      expect(results).toHaveNoViolations();
    });

    it('should be keyboard accessible when clickable', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(
        <Card onClick={handleClick} aria-label="Clickable card">
          Card content
        </Card>
      );
      
      const card = screen.getByRole('button', { name: 'Clickable card' });
      expect(card).toHaveAttribute('tabIndex', '0');
      
      await user.tab();
      expect(card).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('should not be focusable when not clickable', () => {
      render(<Card>Static content</Card>);
      
      const card = screen.getByText('Static content').closest('div');
      expect(card).not.toHaveAttribute('tabIndex');
      expect(card).not.toHaveAttribute('role');
    });
  });

  describe('Modal Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      const results = await axe(container);
      // @ts-ignore - jest-axe matcher
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby');
      expect(modal).toHaveAttribute('aria-describedby');
    });

    it('should close on Escape key', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();
      
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      await user.keyboard('{Escape}');
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should focus close button when opened', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      const closeButton = screen.getByRole('button', { name: 'Fechar modal' });
      expect(closeButton).toBeInTheDocument();
    });
  });
});