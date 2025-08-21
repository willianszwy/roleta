import React from 'react';
import { render, waitFor } from '@testing-library/react';
// @ts-ignore - temporary fix for React 19 compatibility
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectSelector } from '../ProjectSelector';
import { I18nProvider } from '../../../i18n';
import type { Project } from '../../../types';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Frontend Project',
    description: 'React development project',
    participants: [
      { id: 'p1', name: 'John', createdAt: new Date() },
      { id: 'p2', name: 'Jane', createdAt: new Date() },
    ],
    tasks: [
      { id: 't1', name: 'Task 1', requiredParticipants: 1, createdAt: new Date() },
    ],
    teams: [],
    history: [],
    taskHistory: [],
    settings: {
      autoRemoveParticipants: false,
      animationDuration: 3000,
      allowDuplicateParticipantsInTask: false,
    },
    createdAt: new Date(),
    lastModified: new Date(),
  },
  {
    id: 'project-2',
    name: 'Backend Project',
    description: 'API development project',
    participants: [],
    tasks: [],
    teams: [
      {
        id: 'team-1',
        name: 'Backend Team',
        description: 'API developers',
        members: [],
        createdAt: new Date(),
      },
    ],
    history: [],
    taskHistory: [],
    settings: {
      autoRemoveParticipants: false,
      animationDuration: 3000,
      allowDuplicateParticipantsInTask: false,
    },
    createdAt: new Date(),
    lastModified: new Date(),
  },
];

const mockProps = {
  projects: mockProjects,
  activeProjectId: 'project-1',
  onSwitchProject: jest.fn(),
  onCreateProject: jest.fn(),
  onDeleteProject: jest.fn(),
};

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nProvider>
      {component}
    </I18nProvider>
  );
};

describe('ProjectSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render current project name', () => {
    renderWithI18n(<ProjectSelector {...mockProps} />);

    expect(screen.getByText('Frontend Project')).toBeInTheDocument();
  });

  it('should show dropdown when clicked', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ProjectSelector {...mockProps} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText('Backend Project')).toBeInTheDocument();
    expect(screen.getByText('Créer un Projet')).toBeInTheDocument();
  });

  it('should display project statistics', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ProjectSelector {...mockProps} />);

    const button = screen.getByRole('button');
    await user.click(button);

    // Frontend Project: 2 participants • 1 tasks • 0 teams
    expect(screen.getByText('2 participants • 1 tâches • 0 équipes')).toBeInTheDocument();
    
    // Backend Project: 0 participants • 0 tasks • 1 teams
    expect(screen.getByText('0 participants • 0 tâches • 1 équipes')).toBeInTheDocument();
  });

  it('should allow selecting a different project', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ProjectSelector {...mockProps} />);

    const button = screen.getByRole('button');
    await user.click(button);

    const backendProject = screen.getByText('Backend Project');
    await user.click(backendProject);

    expect(mockProps.onSwitchProject).toHaveBeenCalledWith('project-2');
  });

  it('should show create project form when create button clicked', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ProjectSelector {...mockProps} />);

    const button = screen.getByRole('button');
    await user.click(button);

    const createButton = screen.getByText('Créer un Projet');
    await user.click(createButton);

    expect(screen.getByPlaceholderText('Entrez le nom du projet')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Entrez la description du projet (optionnel)')).toBeInTheDocument();
  });

  it('should create a new project', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ProjectSelector {...mockProps} />);

    const button = screen.getByRole('button');
    await user.click(button);

    const createButton = screen.getByText('Créer un Projet');
    await user.click(createButton);

    const nameInput = screen.getByPlaceholderText('Entrez le nom du projet');
    const descriptionInput = screen.getByPlaceholderText('Entrez la description du projet (optionnel)');
    const submitButton = screen.getByText('Créer');

    await user.type(nameInput, 'New Project');
    await user.type(descriptionInput, 'New Description');
    await user.click(submitButton);

    expect(mockProps.onCreateProject).toHaveBeenCalledWith('New Project', 'New Description');
  });

  it('should validate project name when creating', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ProjectSelector {...mockProps} />);

    const button = screen.getByRole('button');
    await user.click(button);

    const createButton = screen.getByText('Créer un Projet');
    await user.click(createButton);

    const submitButton = screen.getByText('Créer');
    await user.click(submitButton);

    // Should not call onCreateProject without a name
    expect(mockProps.onCreateProject).not.toHaveBeenCalled();
  });

  it('should cancel project creation', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ProjectSelector {...mockProps} />);

    const button = screen.getByRole('button');
    await user.click(button);

    const createButton = screen.getByText('Créer un Projet');
    await user.click(createButton);

    const cancelButton = screen.getByText('Annuler');
    await user.click(cancelButton);

    // Form should be hidden
    expect(screen.queryByPlaceholderText('Entrez le nom du projet')).not.toBeInTheDocument();
  });

  it('should close dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ProjectSelector {...mockProps} />);

    const button = screen.getByRole('button');
    await user.click(button);

    // Dropdown should be open
    expect(screen.getByText('Backend Project')).toBeInTheDocument();

    // Click outside
    await user.click(document.body);

    // Wait for dropdown to close
    await waitFor(() => {
      expect(screen.queryByText('Backend Project')).not.toBeInTheDocument();
    });
  });

  it('should handle empty projects list', () => {
    const emptyProps = { ...mockProps, projects: [], activeProjectId: null };
    renderWithI18n(<ProjectSelector {...emptyProps} />);

    expect(screen.getByText('Sélectionner un projet')).toBeInTheDocument();
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ProjectSelector {...mockProps} />);

    const button = screen.getByRole('button');
    
    // Focus the button
    button.focus();
    expect(button).toHaveFocus();

    // Press Enter to open dropdown
    await user.keyboard('{Enter}');
    
    // Dropdown should be open
    expect(screen.getByText('Backend Project')).toBeInTheDocument();

    // Press Escape to close
    await user.keyboard('{Escape}');
    
    // Wait for dropdown to close
    await waitFor(() => {
      expect(screen.queryByText('Backend Project')).not.toBeInTheDocument();
    });
  });

  it('should have proper accessibility attributes', () => {
    renderWithI18n(<ProjectSelector {...mockProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-haspopup', 'true');
  });

  it('should update accessibility attributes when dropdown is open', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ProjectSelector {...mockProps} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});