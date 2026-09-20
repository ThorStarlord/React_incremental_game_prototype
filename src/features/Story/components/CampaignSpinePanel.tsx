import React from 'react';
import { Alert, AlertTitle, Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { selectOpeningCampaignStage } from '../CampaignSpine';
import { selectChapterProgress } from '../ChapterSelectors';

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
  const latticeChapterComplete = useAppSelector(state =>
    selectChapterProgress(state, 'lattice_under_strain').status === 'complete'
  );
  const chronoCryptComplete = useAppSelector(state =>
    selectChapterProgress(state, 'chrono_crypt').status === 'complete'
  );
  const networkChapterComplete = useAppSelector(state =>
    selectChapterProgress(state, 'network_under_pressure').status === 'complete'
  );

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
          <ActionButton to="/game/npcs/npc_lyra">Open Lyra</ActionButton>
        </Box>
      </Alert>
    );
  }

  if (!latticeChapterComplete) {
    return (
      <Alert severity="info" data-testid="gc06-campaign-objective" sx={{ mb: 2 }}>
        <AlertTitle>Chapter 4 — Lattice Under Strain</AlertTitle>
        <Typography variant="body2">
          The opening campaign is complete, but the Telluric Echo is now stressing the network
          those relationships built. Start with Elara's diagnosis, share the operational fact
          where useful, choose a stabilization strategy, then return to Lyra when the local
          lattice is stable.
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
          <ActionButton to="/game/npcs/npc_scholar_elara">Open Scholar Elara</ActionButton>
          <ActionButton to="/game/npcs/npc_captain_valerius">Open Valerius</ActionButton>
          <ActionButton to="/game/npcs/npc_blacksmith_gronk">Open Gronk</ActionButton>
          <ActionButton to="/game/npcs/npc_lyra">Open Lyra</ActionButton>
          <ActionButton to="/game/quests">Open quests</ActionButton>
        </Stack>
      </Alert>
    );
  }

  if (!chronoCryptComplete) {
    return (
      <Alert severity="info" data-testid="gc07-campaign-objective" sx={{ mb: 2 }}>
        <AlertTitle>Chapter 5 — The Chrono-Crypt</AlertTitle>
        <Typography variant="body2">
          The local lattice is stable, but containment is not a countermeasure. Start Lyra's
          counterphase Quest, travel through the Whispering Woods into the unlocked Chrono-Crypt,
          derive one legal solution, then return to Lyra to record what the result means.
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
          <ActionButton to="/game/npcs/npc_lyra">Open Lyra</ActionButton>
          <ActionButton to="/game/quests">Open quests</ActionButton>
          <ActionButton to="/game/dashboard">Open travel controls</ActionButton>
        </Stack>
      </Alert>
    );
  }

  if (!networkChapterComplete) {
    return (
      <Alert severity="info" data-testid="gc08-campaign-objective" sx={{ mb: 2 }}>
        <AlertTitle>Chapter 6 — Network Under Pressure</AlertTitle>
        <Typography variant="body2">
          Lyra knows the counterphase, but the rest of the network does not. Brief Elara first,
          choose which other anchors to inform, prepare one legal posture, and return to Lyra for
          the manual commitment. Archive Verification is already mastered; repetitive verification
          may be delegated to an eligible Copy, but briefings and the posture choice remain yours.
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
          <ActionButton to="/game/npcs/npc_scholar_elara">Open Scholar Elara</ActionButton>
          <ActionButton to="/game/npcs/npc_blacksmith_gronk">Open Gronk</ActionButton>
          <ActionButton to="/game/npcs/npc_captain_valerius">Open Valerius</ActionButton>
          <ActionButton to="/game/npcs/npc_lyra">Open Lyra</ActionButton>
          <ActionButton to="/game/quests">Open quests</ActionButton>
          <ActionButton to="/game/copies">Open Copies</ActionButton>
        </Stack>
      </Alert>
    );
  }

  return (
    <Alert severity="success" data-testid="gc08-campaign-objective" sx={{ mb: 2 }}>
      <AlertTitle>Chapter 6 complete — Counterphase is next</AlertTitle>
      <Typography variant="body2">
        The network now has an explicit posture, and its uneven Knowledge, institutional support,
        relationship history, and delegated preparation remain intact for Chapter 7.
      </Typography>
    </Alert>
  );
};

export default CampaignSpinePanel;
