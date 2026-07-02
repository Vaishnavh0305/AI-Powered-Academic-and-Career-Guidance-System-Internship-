import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -12,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.3,
};

const RouteTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
    >
      {children}
    </motion.div>
  );
};

export default RouteTransition;
