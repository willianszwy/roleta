import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../i18n';
import type { ProjectManagerProps } from '../../types';
import { Button } from '../../design-system';
import { CreateProjectModal } from './CreateProjectModal';

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CurrentProjectLabel = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CurrentProjectName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const SelectorButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(102, 126, 234, 0.4);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.5);
  }
`;

const DropdownArrow = styled.span<{ $isOpen: boolean }>`
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid currentColor;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const DropdownOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 280px;
  background: #2a2a3e;
  border: 1px solid #444458;
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  z-index: 1002;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const DropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const DropdownTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  margin: 0 0 0.5rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const CreateProjectButton = styled(Button)`
  width: 100%;
  justify-content: center;
`;

const ProjectsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const ProjectItem = styled.button<{ isActive: boolean }>`
  all: unset;
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${props => props.isActive ? 'rgba(102, 126, 234, 0.2)' : 'transparent'};
  border: none;
  border-radius: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ProjectName = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const ProjectDescription = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
`;

const ProjectStats = styled.span`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
`;

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
`;

interface ProjectSelectorProps extends Omit<ProjectManagerProps, 'onRenameProject'> {
  onCreateProject: (name: string, description?: string) => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  activeProjectId,
  onCreateProject,
  // onDeleteProject, // TODO: Implement delete functionality
  onSwitchProject,
}) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeProject = projects.find(p => p.id === activeProjectId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Don't close create modal on outside click - let the modal handle it
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProjectSelect = (projectId: string) => {
    onSwitchProject(projectId);
    setIsOpen(false);
  };

  const handleCreateProject = () => {
    setIsOpen(false);
    setShowCreateModal(true);
  };

  const handleCreateProjectSubmit = (name: string, description?: string) => {
    onCreateProject(name, description);
  };

  return (
    <Container ref={containerRef}>
      {activeProject && (
        <ProjectInfo>
          <CurrentProjectLabel>{t('projects.current')}</CurrentProjectLabel>
          <CurrentProjectName>{activeProject.name}</CurrentProjectName>
        </ProjectInfo>
      )}
      
      <SelectorButton
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('projects.selectProject')}
        aria-expanded={isOpen}
      >
        {t('projects.selector')}
        <DropdownArrow $isOpen={isOpen} />
      </SelectorButton>

      <AnimatePresence>
        {isOpen && (
          <>
            <DropdownOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <DropdownMenu
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
            <DropdownHeader>
              <DropdownTitle>{t('projects.title')}</DropdownTitle>
              <CreateProjectButton onClick={handleCreateProject}>
                {t('projects.create')}
              </CreateProjectButton>
            </DropdownHeader>

            <ProjectsList>
              {projects.length === 0 ? (
                <EmptyState>
                  <p>{t('projects.empty')}</p>
                </EmptyState>
              ) : (
                projects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    isActive={project.id === activeProjectId}
                    onClick={() => handleProjectSelect(project.id)}
                  >
                    <ProjectName>{project.name}</ProjectName>
                    {project.description && (
                      <ProjectDescription>{project.description}</ProjectDescription>
                    )}
                    <ProjectStats>
                      {t('projects.stats', {
                        participants: project.participants.length,
                        tasks: project.tasks.length,
                        teams: project.teams.length
                      })}
                    </ProjectStats>
                  </ProjectItem>
                ))
              )}
            </ProjectsList>
          </DropdownMenu>
          </>
        )}
      </AnimatePresence>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateProjectSubmit}
      />
    </Container>
  );
};

export default ProjectSelector;