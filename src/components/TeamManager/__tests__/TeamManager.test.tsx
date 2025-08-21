import React from 'react';
import { render } from '@testing-library/react';
// @ts-ignore - temporary fix for React 19 compatibility
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamManager } from '../TeamManager';
import { I18nProvider } from '../../../i18n';
import type { Team } from '../../../types';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <h2 {...props}>{children}</h2>,
    form: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <form {...props}>{children}</form>,
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Development Team',
    description: 'Frontend and Backend developers',
    members: [
      { id: 'p1', name: 'John Doe', createdAt: new Date() },
      { id: 'p2', name: 'Jane Smith', createdAt: new Date() },
    ],
    createdAt: new Date(),
  },
  {
    id: 'team-2',
    name: 'Design Team',
    description: 'UI/UX designers',
    members: [],
    createdAt: new Date(),
  },
];

const mockProps = {
  teams: mockTeams,
  onAddTeam: jest.fn(),
  onRemoveTeam: jest.fn(),
  onEditTeam: jest.fn(),
  onAddMemberToTeam: jest.fn(),
  onRemoveMemberFromTeam: jest.fn(),
  onImportTeamToProject: jest.fn(),
};

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nProvider>
      {component}
    </I18nProvider>
  );
};

describe('TeamManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render teams list', () => {
    renderWithI18n(<TeamManager {...mockProps} />);

    expect(screen.getByText('Development Team')).toBeInTheDocument();
    expect(screen.getByText('Design Team')).toBeInTheDocument();
    expect(screen.getByText('Frontend and Backend developers')).toBeInTheDocument();
    expect(screen.getByText('UI/UX designers')).toBeInTheDocument();
  });

  it('should display team member counts', () => {
    renderWithI18n(<TeamManager {...mockProps} />);

    expect(screen.getByText('2')).toBeInTheDocument(); // Development Team has 2 members
    expect(screen.getByText('0')).toBeInTheDocument(); // Design Team has 0 members
  });

  it('should show team members', () => {
    renderWithI18n(<TeamManager {...mockProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should allow adding a new team', async () => {
    const user = userEvent.setup();
    renderWithI18n(<TeamManager {...mockProps} />);

    const addButton = screen.getByText('Ajouter une Équipe');
    await user.click(addButton);

    const nameInput = screen.getByPlaceholderText('Entrez le nom de l\'équipe');
    const descriptionInput = screen.getByPlaceholderText('Description optionnelle de l\'équipe');
    const submitButton = screen.getByText('Ajouter');

    await user.type(nameInput, 'New Team');
    await user.type(descriptionInput, 'New Description');
    await user.click(submitButton);

    expect(mockProps.onAddTeam).toHaveBeenCalledWith('New Team', 'New Description');
  });

  it('should validate team name when adding', async () => {
    const user = userEvent.setup();
    renderWithI18n(<TeamManager {...mockProps} />);

    const addButton = screen.getByText('Ajouter une Équipe');
    await user.click(addButton);

    const submitButton = screen.getByText('Ajouter');
    await user.click(submitButton);

    // Should not call onAddTeam without a name
    expect(mockProps.onAddTeam).not.toHaveBeenCalled();
  });

  it('should allow editing a team', async () => {
    const user = userEvent.setup();
    renderWithI18n(<TeamManager {...mockProps} />);

    const editButtons = screen.getAllByText('Modifier');
    await user.click(editButtons[0]);

    const nameInput = screen.getByDisplayValue('Development Team');
    const descriptionInput = screen.getByDisplayValue('Frontend and Backend developers');
    const saveButton = screen.getByText('Sauvegarder');

    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Team');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Updated Description');
    await user.click(saveButton);

    expect(mockProps.onEditTeam).toHaveBeenCalledWith('team-1', 'Updated Team', 'Updated Description');
  });

  it('should allow removing a team', async () => {
    const user = userEvent.setup();
    renderWithI18n(<TeamManager {...mockProps} />);

    const removeButtons = screen.getAllByText('Supprimer l\'équipe');
    await user.click(removeButtons[0]);

    expect(mockProps.onRemoveTeam).toHaveBeenCalledWith('team-1');
  });

  it('should allow importing a team to project', async () => {
    const user = userEvent.setup();
    renderWithI18n(<TeamManager {...mockProps} />);

    const importButtons = screen.getAllByText('Importer');
    await user.click(importButtons[0]);

    expect(mockProps.onImportTeamToProject).toHaveBeenCalledWith('team-1');
  });

  it('should allow removing members from team', async () => {
    const user = userEvent.setup();
    renderWithI18n(<TeamManager {...mockProps} />);

    const removeMemberButtons = screen.getAllByLabelText('Remover membro');
    await user.click(removeMemberButtons[0]);

    expect(mockProps.onRemoveMemberFromTeam).toHaveBeenCalledWith('team-1', 'p1');
  });

  it('should show empty state when no teams exist', () => {
    const emptyProps = { ...mockProps, teams: [] };
    renderWithI18n(<TeamManager {...emptyProps} />);

    expect(screen.getByText('Aucune équipe créée')).toBeInTheDocument();
  });

  it('should show empty state for teams with no members', () => {
    renderWithI18n(<TeamManager {...mockProps} />);

    expect(screen.getByText('Aucun membre dans l\'équipe')).toBeInTheDocument();
  });

  it('should cancel team creation form', async () => {
    const user = userEvent.setup();
    renderWithI18n(<TeamManager {...mockProps} />);

    const addButton = screen.getByText('Ajouter une Équipe');
    await user.click(addButton);

    const cancelButton = screen.getByText('Annuler');
    await user.click(cancelButton);

    // Form should be hidden
    expect(screen.queryByPlaceholderText('Entrez le nom de l\'équipe')).not.toBeInTheDocument();
  });

  it('should cancel team editing form', async () => {
    const user = userEvent.setup();
    renderWithI18n(<TeamManager {...mockProps} />);

    const editButtons = screen.getAllByText('Modifier');
    await user.click(editButtons[0]);

    const cancelButton = screen.getByText('Annuler');
    await user.click(cancelButton);

    // Edit form should be hidden
    expect(screen.queryByDisplayValue('Development Team')).not.toBeInTheDocument();
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithI18n(<TeamManager {...mockProps} />);

    const addButton = screen.getByText('Ajouter une Équipe');
    
    // Focus the add button
    addButton.focus();
    expect(addButton).toHaveFocus();

    // Press Enter to activate
    await user.keyboard('{Enter}');
    
    // Form should be shown
    expect(screen.getByPlaceholderText('Entrez le nom de l\'équipe')).toBeInTheDocument();
  });
});