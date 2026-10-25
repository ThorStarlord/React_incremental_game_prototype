import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { saveGameThunk } from '../../features/Meta/state/MetaThunks';
import { selectLastSavedTimestamp } from '../../features/Meta/state/MetaSelectors';
import { AUTOSAVE_NAME_PREFIX, AUTOSAVE_RETENTION, pruneAutosaves } from '../../shared/utils/saveUtils';

/**
 * In-game save actions for the canonical save system.
 *
 * Saves go through the same saveGameThunk as autosave, and the Main Menu stays
 * the canonical load/import/export surface; this is not a separate save
 * management page. Leaving the page also writes a rolling autosave so closing
 * the tab between autosave intervals does not lose progress.
 */
export const GameSessionBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const lastSaved = useAppSelector(selectLastSavedTimestamp);
  const [saveFailed, setSaveFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  const save = useCallback(async (): Promise<boolean> => {
    setBusy(true);
    try {
      await dispatch(saveGameThunk(undefined)).unwrap();
      setSaveFailed(false);
      return true;
    } catch {
      setSaveFailed(true);
      return false;
    } finally {
      setBusy(false);
    }
  }, [dispatch]);

  const saveAndReturnToMenu = useCallback(async () => {
    if (await save()) navigate('/');
  }, [save, navigate]);

  useEffect(() => {
    // localStorage writes are synchronous, and saveGameThunk performs its
    // write before its first await, so this completes during pagehide.
    const handlePageHide = () => {
      pruneAutosaves(AUTOSAVE_RETENTION - 1);
      dispatch(saveGameThunk(`${AUTOSAVE_NAME_PREFIX}exit_${Date.now()}`));
    };
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, [dispatch]);

  const status = saveFailed
    ? 'Save failed. Your game is still running; delete old saves from Main Menu → Load Game, then try again.'
    : lastSaved
      ? `Last saved ${new Date(lastSaved).toLocaleTimeString()}`
      : 'Not saved yet';

  return (
    <Box
      role="region"
      aria-label="Game session"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 }, mb: { xs: 0.5, sm: 1 } }}
    >
      <Typography
        variant="caption"
        color={saveFailed ? 'error' : 'text.secondary'}
        role="status"
        aria-live="polite"
        sx={{ display: { xs: saveFailed ? 'block' : 'none', sm: 'block' }, width: { xs: saveFailed ? '100%' : 'auto', sm: 'auto' } }}
      >
        {status}
      </Typography>
      <Button size="small" sx={{ minHeight: 44 }} variant="outlined" startIcon={<SaveIcon />} onClick={save} disabled={busy}>
        Save Game
      </Button>
      <Button size="small" sx={{ minHeight: 44 }} startIcon={<HomeIcon />} onClick={saveAndReturnToMenu} disabled={busy}>
        Save &amp; Main Menu
      </Button>
    </Box>
  );
};

export default GameSessionBar;
