import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ParticipantManager } from '../ParticipantManager';
import type { Participant } from '../../../types';

const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'João Silva',
    color: '#ff5722',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2', 
    name: 'Maria Santos',
    color: '#2196f3',
    createdAt: new Date('2024-01-02'),
  },
];

const defaultProps = {
  participants: [],
  onAdd: jest.fn(),
  onAddBulk: jest.fn(),
  onRemove: jest.fn(),
  onClear: jest.fn(),
};

describe('ParticipantManager Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no participants', () => {
    render(<ParticipantManager {...defaultProps} />);
    
    expect(screen.getByText('Participantes')).toBeInTheDocument();
    expect(screen.getByText('Adicione participantes para começar o sorteio')).toBeInTheDocument();
  });

  it('displays participants list correctly', () => {
    render(<ParticipantManager {...defaultProps} participants={mockParticipants} />);
    
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // participant count
  });

  it('adds new participant via form', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    
    render(<ParticipantManager {...defaultProps} onAdd={onAdd} />);
    
    const input = screen.getByPlaceholderText('Nome...');
    const addButton = screen.getByText('Adicionar');
    
    await user.type(input, 'Novo Participante');
    await user.click(addButton);
    
    expect(onAdd).toHaveBeenCalledWith('Novo Participante');
  });

  it('clears input after adding participant', async () => {
    const user = userEvent.setup();
    
    render(<ParticipantManager {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Nome...');
    const addButton = screen.getByText('Adicionar');
    
    await user.type(input, 'Test User');
    await user.click(addButton);
    
    expect(input).toHaveValue('');
  });

  it('disables add button when input is empty', async () => {
    const user = userEvent.setup();
    
    render(<ParticipantManager {...defaultProps} />);
    
    const addButton = screen.getByText('Adicionar');
    expect(addButton).toBeDisabled();
    
    const input = screen.getByPlaceholderText('Nome...');
    await user.type(input, 'Test');
    
    expect(addButton).not.toBeDisabled();
    
    await user.clear(input);
    expect(addButton).toBeDisabled();
  });

  it('shows bulk import section when toggle is clicked', async () => {
    const user = userEvent.setup();
    
    render(<ParticipantManager {...defaultProps} />);
    
    const importButton = screen.getByText('Importar Lista');
    await user.click(importButton);
    
    expect(screen.getByText('Importar Participantes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite os nomes separados/)).toBeInTheDocument();
  });

  it('handles bulk import correctly', async () => {
    const user = userEvent.setup();
    const onAddBulk = jest.fn();
    
    render(<ParticipantManager {...defaultProps} onAddBulk={onAddBulk} />);
    
    // Open bulk import
    await user.click(screen.getByText('Importar Lista'));
    
    const textarea = screen.getByPlaceholderText(/Digite os nomes separados/);
    await user.type(textarea, 'João\nMaria\nPedro');
    
    const addBulkButton = screen.getByText(/Adicionar \(3 nomes\)/);
    await user.click(addBulkButton);
    
    expect(onAddBulk).toHaveBeenCalledWith(['João', 'Maria', 'Pedro']);
  });

  it('handles comma-separated bulk import', async () => {
    const user = userEvent.setup();
    const onAddBulk = jest.fn();
    
    render(<ParticipantManager {...defaultProps} onAddBulk={onAddBulk} />);
    
    await user.click(screen.getByText('Importar Lista'));
    
    const textarea = screen.getByPlaceholderText(/Digite os nomes separados/);
    await user.type(textarea, 'Ana, Carlos, Diana');
    
    const addBulkButton = screen.getByText(/Adicionar \(3 nomes\)/);
    await user.click(addBulkButton);
    
    expect(onAddBulk).toHaveBeenCalledWith(['Ana', 'Carlos', 'Diana']);
  });

  it('shows participant options menu', async () => {
    const user = userEvent.setup();
    
    render(<ParticipantManager {...defaultProps} participants={mockParticipants} />);
    
    const menuButtons = screen.getAllByText('⋮');
    await user.click(menuButtons[0]);
    
    expect(screen.getByText('Remover participante')).toBeInTheDocument();
  });

  it('removes participant with confirmation', async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    
    // Mock window.confirm to return true
    global.confirm = jest.fn(() => true);
    
    render(<ParticipantManager {...defaultProps} participants={mockParticipants} onRemove={onRemove} />);
    
    const menuButtons = screen.getAllByText('⋮');
    await user.click(menuButtons[0]);
    
    const removeButton = screen.getByText('Remover participante');
    await user.click(removeButton);
    
    expect(global.confirm).toHaveBeenCalledWith('Remover "João Silva" dos participantes?');
    expect(onRemove).toHaveBeenCalledWith('1');
  });

  it('does not remove participant when confirmation is cancelled', async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    
    // Mock window.confirm to return false
    global.confirm = jest.fn(() => false);
    
    render(<ParticipantManager {...defaultProps} participants={mockParticipants} onRemove={onRemove} />);
    
    const menuButtons = screen.getAllByText('⋮');
    await user.click(menuButtons[0]);
    
    const removeButton = screen.getByText('Remover participante');
    await user.click(removeButton);
    
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('shows clear all option when multiple participants exist', () => {
    render(<ParticipantManager {...defaultProps} participants={mockParticipants} />);
    
    expect(screen.getByText('Opções ⋮')).toBeInTheDocument();
  });

  it('clears all participants with confirmation', async () => {
    const user = userEvent.setup();
    const onClear = jest.fn();
    
    global.confirm = jest.fn(() => true);
    
    render(<ParticipantManager {...defaultProps} participants={mockParticipants} onClear={onClear} />);
    
    await user.click(screen.getByText('Opções ⋮'));
    await user.click(screen.getByText('Limpar todos'));
    
    expect(global.confirm).toHaveBeenCalledWith('Remover todos os participantes?');
    expect(onClear).toHaveBeenCalled();
  });

  it('limits input length to 30 characters', async () => {
    const user = userEvent.setup();
    
    render(<ParticipantManager {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Nome...');
    const longText = 'a'.repeat(50);
    
    await user.type(input, longText);
    
    expect(input).toHaveValue('a'.repeat(30));
  });

  it('trims whitespace from input', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    
    render(<ParticipantManager {...defaultProps} onAdd={onAdd} />);
    
    const input = screen.getByPlaceholderText('Nome...');
    const addButton = screen.getByText('Adicionar');
    
    await user.type(input, '  João Silva  ');
    await user.click(addButton);
    
    expect(onAdd).toHaveBeenCalledWith('João Silva');
  });

  it('closes bulk import when toggle is clicked again', async () => {
    const user = userEvent.setup();
    
    render(<ParticipantManager {...defaultProps} />);
    
    // Open bulk import
    await user.click(screen.getByText('Importar Lista'));
    expect(screen.getByText('Importar Participantes')).toBeInTheDocument();
    
    // Close bulk import
    await user.click(screen.getByText('Fechar'));
    
    await waitFor(() => {
      expect(screen.queryByText('Importar Participantes')).not.toBeInTheDocument();
    });
  });
});