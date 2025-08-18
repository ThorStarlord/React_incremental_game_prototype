import React, { useState } from 'react';
import { QuestObjective } from '../../state/QuestTypes';

interface QuestPuzzleModalProps {
  open: boolean;
  onClose: () => void;
  objective: QuestObjective | null;
  onSolve: (solution: string) => void;
}

const QuestPuzzleModal: React.FC<QuestPuzzleModalProps> = ({ open, onClose, objective, onSolve }) => {
  const [inputSequence, setInputSequence] = useState<string[]>([]);

  if (!open || !objective || !objective.puzzleData) {
    return null;
  }

  const { puzzleData } = objective;

  const handleOptionClick = (option: string) => {
    setInputSequence([...inputSequence, option]);
  };

  const handleSubmit = () => {
    onSolve(inputSequence.join(','));
  };

  const handleForce = () => {
    onSolve('force');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{puzzleData.prompt}</h2>
        <div>
          {puzzleData.options.map((option) => (
            <button key={option} onClick={() => handleOptionClick(option)}>
              {option}
            </button>
          ))}
        </div>
        <div>
          <p>Current Sequence: {inputSequence.join(', ')}</p>
        </div>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={handleForce}>Force It</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default QuestPuzzleModal;
