import React from 'react';
import './ParticleEffect.css'; // Assuming you have a CSS file for styles

const ParticleEffect = ({ particles }) => {
    return (
        <div className="particle-effect">
            {particles.map((particle, index) => (
                <div
                    key={index}
                    className="particle"
                    style={{
                        position: 'absolute',
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        backgroundColor: particle.color,
                        borderRadius: '50%',
                        opacity: particle.opacity,
                        transition: `transform ${particle.lifetime}ms ease-out`,
                        transform: `translate(${particle.dx}px, ${particle.dy}px)`,
                    }}
                />
            ))}
        </div>
    );
};

export default ParticleEffect;