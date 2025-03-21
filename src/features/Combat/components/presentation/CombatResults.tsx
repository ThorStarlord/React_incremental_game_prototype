import React, { memo } from 'react';
import { Box, Typography, Button, Fade } from '@mui/material';
import Panel from '../../../../shared/components/layout/Panel';
import { Rewards, CombatResult } from '../../types/combatTypes';

interface CombatResultsProps {
  combatResult: CombatResult;
  totalRewards: Rewards;
  onFinish: () => void;
}

/**
 * Component to display combat results
 */
const CombatResults: React.FC<CombatResultsProps> = memo(({ 
  combatResult, 
  totalRewards, 
  onFinish 
}) => {
  return (
    <Fade in={true}>
      <Box sx={{ p: 2, height: '100%' }}>
        <Panel title="Combat Results">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 2 }}>
            <Typography variant="h5" color={combatResult.victory ? "primary" : "error"}>
              {combatResult.victory ? "Victory!" : combatResult.retreat ? "Retreated" : "Defeat!"}
            </Typography>
            
            {combatResult.victory && (
              <Box sx={{ width: '100%', mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Rewards Earned:
                </Typography>
                <Typography variant="body1">
                  Experience: {totalRewards.experience}
                </Typography>
                <Typography variant="body1">
                  Gold: {totalRewards.gold}
                </Typography>
                {totalRewards.items.length > 0 && (
                  <>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Items:
                    </Typography>
                    <ul style={{ marginTop: 4 }}>
                      {totalRewards.items.map((item, index) => (
                        <li key={index}>
                          {item.name} x{item.quantity}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Box>
            )}
            
            <Button 
              variant="contained" 
              color={combatResult.victory ? "success" : "primary"}
              onClick={onFinish}
              sx={{ mt: 2 }}
            >
              {combatResult.victory ? "Continue" : "Return to Town"}
            </Button>
          </Box>
        </Panel>
      </Box>
    </Fade>
  );
});

CombatResults.displayName = 'CombatResults';

export default CombatResults;
