import React from 'react';

const DialogueOption = ({ option, onSelect }) => {
    return (
        <div className="dialogue-option" onClick={() => onSelect(option)}>
            {option.text}
        </div>
    );
};

export default DialogueOption;