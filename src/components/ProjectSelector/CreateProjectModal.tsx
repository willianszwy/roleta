import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../i18n';
import { Button } from '../../design-system';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: #2a2a3e;
  border: 1px solid #444458;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2001;
`;

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: #1e1e2e;
  border: 1px solid #444458;
  border-radius: 6px;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.6);
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    background: rgba(255, 255, 255, 0.35);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background: #1e1e2e;
  border: 1px solid #444458;
  border-radius: 6px;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.6);
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    background: rgba(255, 255, 255, 0.35);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;


interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), description.trim() || undefined);
      setName('');
      setDescription('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <Modal
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <Title>{t('projects.createNew')}</Title>
              
              <FormGroup>
                <Label htmlFor="project-name">
                  {t('projects.projectName')} *
                </Label>
                <Input
                  id="project-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('projects.enterName')}
                  autoFocus
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="project-description">
                  {t('projects.projectDescription')}
                </Label>
                <TextArea
                  id="project-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('projects.enterDescription')}
                />
              </FormGroup>

              <ButtonGroup>
                <Button variant="secondary" type="button" onClick={handleClose}>
                  {t('common.cancel')}
                </Button>
                <Button variant="primary" type="submit" disabled={!name.trim()}>
                  {t('common.create')}
                </Button>
              </ButtonGroup>
            </form>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};