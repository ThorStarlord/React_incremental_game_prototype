// This is a type declaration file for the JavaScript QuestsTab module
import React from 'react';

interface QuestsTabProps {
  npcId: string;
  playerLevel?: number;
  essence?: number;
  showNotification?: (message: string, type?: string) => void;
  dispatch: any;
}

declare const QuestsTab: React.FC<QuestsTabProps>;

export default QuestsTab;