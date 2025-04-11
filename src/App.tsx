import React from 'react';
// Update to named import
import { AppRouter } from './routes/AppRouter'; 
import { ThemeProviderWrapper as ThemeProvider } from './theme/provider'; 

/**
 * Main App Component
 * 
 * Renders the main application router wrapped in necessary providers.
 * The Redux provider is in index.tsx
 */
const App: React.FC = () => {
  return (
    <ThemeProvider>
      {/* AppRouter usage remains the same */}
      <AppRouter /> 
    </ThemeProvider>
  );
};

export default App;
