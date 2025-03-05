import React from 'react';

interface EssenceDisplayProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
  showDetails?: boolean;
  compact?: boolean;
  showRate?: boolean;
}

/**
 * EssenceDisplay component for showing player essence resources
 */
declare const EssenceDisplay: React.FC<EssenceDisplayProps>;

export default EssenceDisplay;
