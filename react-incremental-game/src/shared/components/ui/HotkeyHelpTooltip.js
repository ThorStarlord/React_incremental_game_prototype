import React from 'react';
import PropTypes from 'prop-types';
import './HotkeyHelpTooltip.css';

const HotkeyHelpTooltip = ({ hotkeys }) => {
    return (
        <div className="hotkey-help-tooltip">
            <h3>Hotkey Help</h3>
            <ul>
                {hotkeys.map((hotkey, index) => (
                    <li key={index}>
                        <strong>{hotkey.key}</strong>: {hotkey.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

HotkeyHelpTooltip.propTypes = {
    hotkeys: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default HotkeyHelpTooltip;