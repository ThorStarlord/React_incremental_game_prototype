import React from 'react';
import { motion } from 'framer-motion';

/**
 * Props for the TraitEffectAnimation component
 */
interface TraitEffectAnimationProps {
    /** The effect content to display (can be text or JSX) */
    effect: React.ReactNode;
    /** Whether the animation is currently active */
    isActive: boolean;
}

/**
 * Component that animates trait effect visualizations
 * 
 * @param props Component props
 * @returns React component with animation
 */
const TraitEffectAnimation: React.FC<TraitEffectAnimationProps> = ({ effect, isActive }) => {
    const animationVariants = {
        initial: { opacity: 0, scale: 0.5 },
        active: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.5 },
    };

    return (
        <motion.div
            className="trait-effect-animation"
            initial="initial"
            animate={isActive ? "active" : "exit"}
            variants={animationVariants}
            transition={{ duration: 0.3 }}
        >
            {effect}
        </motion.div>
    );
};

export default TraitEffectAnimation;
