import React, { useEffect } from 'react';
import { useAppDispatch } from './app/hooks';
import { fetchTraitsThunk } from './features/Traits/state/TraitThunks';
import { AppRouter } from './routes/AppRouter'; 
import { ThemeProviderWrapper as ThemeProvider } from './theme/provider'; 

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTraitsThunk());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <AppRouter /> 
    </ThemeProvider>
  );
};

export default App;
