// Barrel exports for page components
// Assuming all page components are default exported from their respective files.

export { default as CharacterPage } from './CharacterPage';
export { default as DashboardPage } from './DashboardPage';
export { default as EssencePage } from './EssencePage';
export { default as GamePage } from './GamePage';
export { default as NotFoundPage } from './NotFoundPage';
// export { default as NPCPage } from './NPCPage'; // Assuming NPCPage.tsx does not exist, NPCsPage.tsx is used.
export { default as NPCsPage } from './NPCsPage';
export { default as SettingsPage } from './SettingsPage';
export { default as TraitsPage } from './TraitsPage';

// Re-export PlaceholderPage from shared for convenience
export { PlaceholderPage } from '../shared/components/PlaceholderPage';
