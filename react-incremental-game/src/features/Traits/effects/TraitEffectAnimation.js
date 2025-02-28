import React from 'react';
import { motion } from 'framer-motion';

const TraitEffectAnimation = ({ effect, isActive }) => {
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