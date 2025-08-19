import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../i18n';
import { useDropdown } from '../../context/useDropdown';
import type { Team, TeamManagerProps } from '../../types';
import { Button, Input, Card } from '../../design-system';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
`;

const CreateTeamForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;


const TeamsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 300px);
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const TeamCard = styled(Card)`
  padding: 1rem;
`;

const TeamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const TeamInfo = styled.div`
  flex: 1;
`;

const TeamName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.25rem 0;
`;

const TeamDescription = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

const TeamActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 6px;
  color: #a5b4fc;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.3);
    border-color: rgba(102, 126, 234, 0.6);
  }
  
  &.danger {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
    color: #fca5a5;
    
    &:hover {
      background: rgba(239, 68, 68, 0.3);
      border-color: rgba(239, 68, 68, 0.6);
    }
  }
`;


// Members components following participant pattern
const MembersSection = styled.div`
  margin-top: 0.75rem;
`;

const MembersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const MembersTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
`;

const AddMemberForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const MembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 0.25rem;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 2px;
  }
`;

const MemberCard = styled(motion.div)`
  position: relative;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(31, 38, 135, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 0 1px 1px 0;
  }
`;

const MemberContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
`;

const MemberColor = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
`;

const MemberName = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.1;
`;

const MemberMenuButton = styled(motion.button)`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  padding: 0.2rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const AddMemberButton = styled(motion.button)`
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.4);
  color: #86efac;
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    background: rgba(34, 197, 94, 0.3);
    border-color: rgba(34, 197, 94, 0.6);
  }
`;

const PortalDropdown = styled(motion.div)<{ $top: number; $left: number }>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
  padding: 0.5rem;
  min-width: 140px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  z-index: 999999;
`;

const MenuItem = styled(motion.button)`
  width: 100%;
  background: none;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.danger {
    color: #fca5a5;
    
    &:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const TeamManager: React.FC<TeamManagerProps> = ({
  teams,
  onAddTeam,
  onRemoveTeam,
  onEditTeam,
  onAddMemberToTeam,
  onRemoveMemberFromTeam,
  onImportTeamToProject,
}) => {
  const { t } = useI18n();
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [importingTeam, setImportingTeam] = useState<string | null>(null);
  const [addingMemberToTeam, setAddingMemberToTeam] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState('');
  const [memberMenuPositions, setMemberMenuPositions] = useState<Record<string, { top: number; left: number }>>({});
  
  const dropdownContext = useDropdown();
  const { activeDropdown, setActiveDropdown, closeAllDropdowns } = dropdownContext;

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim()) {
      onAddTeam(teamName.trim(), teamDescription.trim() || undefined);
      setTeamName('');
      setTeamDescription('');
    }
  };

  const handleStartEdit = (team: Team) => {
    setEditingTeam(team.id);
    setEditName(team.name);
    setEditDescription(team.description || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeam && editName.trim()) {
      onEditTeam(editingTeam, editName.trim(), editDescription.trim() || undefined);
      setEditingTeam(null);
      setEditName('');
      setEditDescription('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTeam(null);
    setEditName('');
    setEditDescription('');
  };

  const handleImportTeam = async (teamId: string) => {
    setImportingTeam(teamId);
    try {
      await onImportTeamToProject(teamId);
      // Show success feedback briefly
      setTimeout(() => setImportingTeam(null), 1000);
    } catch (error) {
      console.error('Failed to import team:', error);
      setImportingTeam(null);
    }
  };

  const handleAddMember = (e: React.FormEvent, teamId: string) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      // Create a new participant to add to the team
      const newMember = {
        id: Date.now().toString(), // Simple ID generation
        name: newMemberName.trim(),
        createdAt: new Date(),
      };
      onAddMemberToTeam(teamId, newMember);
      setNewMemberName('');
      setAddingMemberToTeam(null);
    }
  };

  const handleRemoveMember = (teamId: string, participantId: string) => {
    onRemoveMemberFromTeam(teamId, participantId);
  };

  const handleStartAddingMember = (teamId: string) => {
    setAddingMemberToTeam(teamId);
  };

  const handleCancelAddingMember = () => {
    setAddingMemberToTeam(null);
    setNewMemberName('');
  };

  const handleMemberMenuClick = (e: React.MouseEvent, memberId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const button = e.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    const position = {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    };
    
    setMemberMenuPositions(prev => ({
      ...prev,
      [memberId]: position,
    }));
    
    const menuId = `member-menu-${memberId}`;
    setActiveDropdown(activeDropdown === menuId ? null : menuId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeDropdown?.startsWith('member-menu-')) {
        closeAllDropdowns();
      }
    };

    if (activeDropdown?.startsWith('member-menu-')) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeDropdown, closeAllDropdowns]);

  return (
    <Container>
      <Header>
        <Title>{t('teams.title')}</Title>
        
        <CreateTeamForm onSubmit={handleCreateTeam}>
          <Input
            type="text"
            placeholder={t('teams.namePlaceholder')}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            aria-label={t('teams.name')}
          />
          <Input
            type="text"
            placeholder={t('teams.descriptionPlaceholder')}
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
            aria-label={t('teams.description')}
          />
          <Button 
            type="submit" 
            disabled={!teamName.trim()}
            aria-label={t('teams.add')}
          >
            {t('teams.add')}
          </Button>
        </CreateTeamForm>
      </Header>

      <TeamsList>
        <AnimatePresence>
          {teams.length === 0 ? (
            <EmptyState>
              <p>{t('teams.empty')}</p>
            </EmptyState>
          ) : (
            teams.map((team) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TeamCard>
                  {editingTeam === team.id ? (
                    // Edit mode
                    <form onSubmit={handleSaveEdit}>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder={t('teams.name')}
                        aria-label={t('teams.name')}
                        style={{ marginBottom: '0.5rem' }}
                      />
                      <Input
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder={t('teams.description')}
                        aria-label={t('teams.description')}
                        style={{ marginBottom: '1rem' }}
                      />
                      <TeamActions>
                        <ActionButton type="submit" disabled={!editName.trim()}>
                          {t('action.save')}
                        </ActionButton>
                        <ActionButton type="button" onClick={handleCancelEdit}>
                          {t('action.cancel')}
                        </ActionButton>
                      </TeamActions>
                    </form>
                  ) : (
                    // View mode
                    <>
                      <TeamHeader>
                        <TeamInfo>
                          <TeamName>{team.name}</TeamName>
                          {team.description && (
                            <TeamDescription>{team.description}</TeamDescription>
                          )}
                        </TeamInfo>
                        <TeamActions>
                          <ActionButton
                            onClick={() => handleImportTeam(team.id)}
                            disabled={importingTeam === team.id}
                            aria-label={t('teams.importToProject')}
                          >
                            {importingTeam === team.id ? '✓ ' + t('teams.imported') : t('teams.import')}
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleStartEdit(team)}
                            aria-label={t('teams.edit')}
                          >
                            {t('teams.edit')}
                          </ActionButton>
                          <ActionButton
                            className="danger"
                            onClick={() => onRemoveTeam(team.id)}
                            aria-label={t('teams.remove')}
                          >
                            {t('teams.remove')}
                          </ActionButton>
                        </TeamActions>
                      </TeamHeader>
                    </>
                  )}
                  
                  {/* Members Section - only show in view mode */}
                  {editingTeam !== team.id && (
                    <MembersSection>
                      <MembersHeader>
                        <MembersTitle>{t('teams.members')} ({team.members.length})</MembersTitle>
                        <AddMemberButton
                          onClick={() => handleStartAddingMember(team.id)}
                          aria-label={t('teams.addMember')}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          + {t('teams.addMember')}
                        </AddMemberButton>
                      </MembersHeader>
                      
                      {addingMemberToTeam === team.id && (
                        <AddMemberForm onSubmit={(e) => handleAddMember(e, team.id)}>
                          <Input
                            type="text"
                            placeholder={t('teams.memberName')}
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            aria-label={t('teams.memberName')}
                            style={{ flex: 1, fontSize: '0.8rem' }}
                          />
                          <ActionButton type="submit" disabled={!newMemberName.trim()}>
                            {t('action.add')}
                          </ActionButton>
                          <ActionButton type="button" onClick={handleCancelAddingMember}>
                            {t('action.cancel')}
                          </ActionButton>
                        </AddMemberForm>
                      )}
                      
                      {team.members.length > 0 && (
                        <MembersList>
                          <AnimatePresence>
                            {team.members.map((member) => {
                              const memberMenuId = `member-menu-${member.id}`;
                              const isMenuOpen = activeDropdown === memberMenuId;
                              const menuPosition = memberMenuPositions[member.id];
                              
                              return (
                                <MemberCard
                                  key={member.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <MemberContent>
                                    <MemberInfo>
                                      <MemberColor />
                                      <MemberName>{member.name}</MemberName>
                                    </MemberInfo>
                                    <MemberMenuButton
                                      onClick={(e) => handleMemberMenuClick(e, member.id)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      aria-label={t('action.options')}
                                    >
                                      ⋮
                                    </MemberMenuButton>
                                  </MemberContent>
                                  
                                  {/* Portal dropdown menu */}
                                  {isMenuOpen && menuPosition && createPortal(
                                    <PortalDropdown
                                      $top={menuPosition.top}
                                      $left={menuPosition.left}
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      transition={{ duration: 0.15 }}
                                    >
                                      <MenuItem
                                        className="danger"
                                        onClick={() => {
                                          handleRemoveMember(team.id, member.id);
                                          closeAllDropdowns();
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        {t('teams.removeMember')}
                                      </MenuItem>
                                    </PortalDropdown>,
                                    document.body
                                  )}
                                </MemberCard>
                              );
                            })}
                          </AnimatePresence>
                        </MembersList>
                      )}
                      
                      {team.members.length === 0 && addingMemberToTeam !== team.id && (
                        <EmptyState>
                          <small>{t('teams.noMembers')}</small>
                        </EmptyState>
                      )}
                    </MembersSection>
                  )}
                </TeamCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </TeamsList>
    </Container>
  );
};

export default TeamManager;