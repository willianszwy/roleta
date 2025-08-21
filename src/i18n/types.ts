// Types for internationalization system
export type SupportedLocale = 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR';

export type TranslationKey = 
  // App general
  | 'app.title'
  | 'app.description'
  
  // Navigation
  | 'nav.participants'
  | 'nav.tasks'
  | 'nav.history'
  | 'nav.settings'
  | 'nav.openMenu'
  | 'nav.closeMenu'
  | 'nav.skipToContent'
  | 'nav.skipToNavigation'
  
  // Participants
  | 'participants.title'
  | 'participants.add'
  | 'participants.name'
  | 'participants.namePlaceholder'
  | 'participants.remove'
  | 'participants.clear'
  | 'participants.empty'
  | 'participants.count'
  | 'participants.import'
  | 'participants.export'
  | 'participants.bulkAdd'
  | 'participants.bulkAddPlaceholder'
  | 'participants.bulkAddDescription'
  
  // Tasks
  | 'tasks.title'
  | 'tasks.add'
  | 'tasks.name'
  | 'tasks.nameLabel'
  | 'tasks.namePlaceholder'
  | 'tasks.description'
  | 'tasks.descriptionLabel'
  | 'tasks.descriptionPlaceholder'
  | 'tasks.participantsLabel'
  | 'tasks.remove'
  | 'tasks.clear'
  | 'tasks.empty'
  | 'tasks.count'
  | 'tasks.import'
  | 'tasks.export'
  | 'tasks.bulkAdd'
  | 'tasks.bulkAddPlaceholder'
  | 'tasks.bulkAddDescription'
  | 'tasks.pending'
  | 'tasks.completed'
  | 'tasks.pendingCount'
  | 'tasks.completedCount'
  | 'tasks.noneDrawn'
  | 'tasks.noTasks'
  | 'tasks.drawResponsible'
  | 'tasks.drawing'
  | 'tasks.nextTask'
  | 'tasks.nextLabel'
  
  // Roulette
  | 'roulette.spin'
  | 'roulette.spinning'
  | 'roulette.noParticipants'
  | 'roulette.noTasks'
  | 'roulette.selectWinner'
  | 'roulette.winner'
  | 'roulette.taskAssigned'
  | 'roulette.participantMode'
  | 'roulette.taskMode'
  
  // History
  | 'history.title'
  | 'history.taskHistory'
  | 'history.clear'
  | 'history.empty'
  | 'history.winner'
  | 'history.task'
  | 'history.date'
  | 'history.time'
  | 'history.participant'
  | 'history.removeEntry'
  | 'history.export'
  | 'history.clearConfirm'
  | 'history.clearTaskConfirm'
  | 'history.noDraws'
  
  // Stats
  | 'stats.draws'
  | 'stats.assignments'
  | 'stats.people'
  | 'stats.participants'
  | 'stats.exportCsv'
  | 'stats.exportJson'
  
  // Settings
  | 'settings.title'
  | 'settings.language'
  | 'settings.showWinnerModal'
  | 'settings.autoRemoveWinner'
  | 'settings.winnerDisplayDuration'
  | 'settings.rouletteMode'
  | 'settings.reset'
  | 'settings.resetConfirm'
  | 'settings.theme'
  | 'settings.accessibility'
  | 'settings.performance'
  | 'settings.displayDuration'
  | 'settings.displayDurationDescription'
  | 'settings.lotteryType'
  | 'settings.lotteryTypeDescription'
  | 'settings.luckyPerson'
  | 'settings.unluckyPerson'
  | 'settings.duration3s'
  | 'settings.duration5s'
  | 'settings.duration8s'
  | 'settings.durationManual'
  
  // Modal/Dialog
  | 'modal.close'
  | 'modal.confirm'
  | 'modal.cancel'
  | 'modal.save'
  | 'modal.delete'
  | 'modal.removeParticipant'
  | 'modal.clearHistory'
  | 'modal.clearParticipants'
  | 'modal.removeTask'
  | 'modal.clearTasks'
  | 'modal.clearTaskHistory'
  | 'modal.export'
  | 'modal.noDataToExport'
  | 'modal.remove'
  | 'modal.clear'
  | 'modal.ok'
  
  // Winner Modal
  | 'winner.title'
  | 'winner.taskTitle'
  | 'winner.close'
  | 'winner.closing'
  | 'winner.willDo'
  
  // Validation/Errors
  | 'validation.required'
  | 'validation.minLength'
  | 'validation.maxLength'
  | 'validation.duplicate'
  | 'error.generic'
  | 'error.loadData'
  | 'error.saveData'
  | 'error.network'
  
  // Actions/Buttons
  | 'action.add'
  | 'action.remove'
  | 'action.clear'
  | 'action.save'
  | 'action.cancel'
  | 'action.edit'
  | 'action.delete'
  | 'action.export'
  | 'action.import'
  | 'action.reset'
  | 'action.spin'
  | 'action.close'
  | 'action.options'
  | 'action.clearAll'
  | 'action.importList'
  
  // Status
  | 'status.loading'
  | 'status.saving'
  | 'status.saved'
  | 'status.error'
  | 'status.success'
  | 'status.completed'
  | 'status.pending'
  
  // Accessibility
  | 'a11y.closeModal'
  | 'a11y.openMenu'
  | 'a11y.closeMenu'
  | 'a11y.loading'
  | 'a11y.required'
  | 'a11y.spinCompleted'
  | 'a11y.taskAssigned'
  | 'a11y.participantSelected'

  // Teams
  | 'teams.title'
  | 'teams.add'
  | 'teams.name'
  | 'teams.namePlaceholder'
  | 'teams.description'
  | 'teams.descriptionPlaceholder'
  | 'teams.remove'
  | 'teams.edit'
  | 'teams.import'
  | 'teams.imported'
  | 'teams.importToProject'
  | 'teams.empty'
  | 'teams.noMembers'
  | 'teams.members'
  | 'teams.addMember'
  | 'teams.memberName'
  | 'teams.removeMember'

  // Projects
  | 'projects.title'
  | 'projects.current'
  | 'projects.selector'
  | 'projects.selectProject'
  | 'projects.create'
  | 'projects.enterName'
  | 'projects.enterDescription'
  | 'projects.empty'
  | 'projects.stats'
  | 'projects.createNew'
  | 'projects.projectName'
  | 'projects.projectDescription'
  
  // Pagination
  | 'pagination.previous'
  | 'pagination.next'
  | 'pagination.page'
  | 'pagination.items'

  // SEO
  | 'seo.title'
  | 'seo.description'
  | 'seo.keywords'

  // Common
  | 'common.cancel'
  | 'common.create'
  | 'common.save'
  | 'common.delete';

export interface TranslationValues {
  [key: string]: string | number | boolean;
}

export type Translation = {
  [K in TranslationKey]: string;
}

export interface Translations {
  [locale: string]: Translation;
}

export interface I18nConfig {
  defaultLocale: SupportedLocale;
  fallbackLocale: SupportedLocale;
  supportedLocales: SupportedLocale[];
  debug?: boolean;
}

export interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
  isRTL: boolean;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  formatDateTime: (date: Date) => string;
  formatNumber: (num: number) => string;
}