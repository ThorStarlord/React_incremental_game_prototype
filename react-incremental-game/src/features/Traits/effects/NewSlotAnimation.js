import React from 'react';
import { motion } from 'framer-motion';

const NewSlotAnimation = ({ isVisible }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
            className="new-slot-animation"
        >
            {/* Animation content can go here */}
        </motion.div>
    );
};

export default NewSlotAnimation;