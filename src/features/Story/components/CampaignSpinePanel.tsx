import React from 'react';
import { Alert, AlertTitle, Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { selectOpeningCampaignStage } from '../CampaignSpine';

const ActionButton: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <Button component={RouterLink} to={to} size="small" variant="outlined">
    {children}
  </Button>
);

/**
 * Ordinary-UI guidance for the already-authored opening Campaign One spine.
 *
 * This surface projects canonical Relationship/dialogue evidence; it does not
 * create chapter-owned state, auto-complete content, or expose hidden route
 * requirements.
 */
export const CampaignSpinePanel: React.FC = () => {
  const stage = useAppSelector(selectOpeningCampaignStage);

  if (stage === 'PROLOGUE') return null;

  if (stage === 'CHAPTER_1') {
    return (
      <Alert severity="info" data-testid="gc03-campaign-objective" sx={{ mb: 2 }}>
        <AlertTitle>Chapter 1 — Merchant District Crisis</AlertTitle>
        <Typography variant="body2">
          Return through City Gate and investigate the Merchant District crisis. Work with the
          people already tied to the district; the chapter advances only when one authored
          conclusion is actually recorded.
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
          <ActionButton to="/game/dashboard">Open travel controls</ActionButton>
          <ActionButton to="/game/npcs/npc_captain_valerius">Open Valerius</ActionButton>
          <ActionButton to="/game/npcs/npc_blacksmith_gronk">Open Gronk</ActionButton>
          <ActionButton to="/game/npcs/npc_rogue_silas">Open Silas</ActionButton>
        </Stack>
      </Alert>
    );
  }

  if (stage === 'CHAPTER_2') {
    return (
      <Alert severity="info" data-testid="gc03-campaign-objective" sx={{ mb: 2 }}>
        <AlertTitle>Chapter 2 — Archive Inquiry</AlertTitle>
        <Typography variant="body2">
          The Merchant District crisis has a recorded conclusion. Continue with Scholar Elara's
          inquiry and follow the evidence through independent verification.
        </Typography>
        <Box sx={{ mt: 1.5 }}>
          <ActionButton to="/game/npcs/npc_scholar_elara">Open Scholar Elara</ActionButton>
        </Box>
      </Alert>
    );
  }

  if (stage === 'CHAPTER_3') {
    return (
      <Alert severity="info" data-testid="gc03-campaign-objective" sx={{ mb: 2 }}>
        <AlertTitle>Chapter 3 — Enemies in Phase</AlertTitle>
        <Typography variant="body2">
          The Archive Inquiry is resolved. Continue Lyra's adversarial-calibration arc until the
          relationship history records the chapter's authored conclusion.
        </Typography>
        <Box sx={{ mt: 1.5 }}>
          <ActionButton to="/game/npcs/npc_rival_lyra">Open Lyra</ActionButton>
        </Box>
      </Alert>
    );
  }

  return (
    <Alert severity="success" data-testid="gc03-campaign-objective" sx={{ mb: 2 }}>
      <AlertTitle>Opening campaign spine complete</AlertTitle>
      <Typography variant="body2">
        Prologue and Chapters 1–3 are complete through canonical game evidence. The next Campaign
        One construction responsibility is Chapter 4 — Lattice Under Strain.
      </Typography>
    </Alert>
  );
};

export default CampaignSpinePanel;
