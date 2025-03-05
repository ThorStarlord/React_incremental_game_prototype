import React from 'react';

interface PanelProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
  sx?: any;
}

/**
 * Panel component for layout structure
 */
declare const Panel: React.FC<PanelProps>;

export default Panel;
