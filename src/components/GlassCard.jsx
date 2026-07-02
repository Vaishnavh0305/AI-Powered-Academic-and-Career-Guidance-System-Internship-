import React from 'react';
import { Card } from '@mui/material';

const GlassCard = ({ children, sx = {}, ...props }) => {
  return (
    <Card 
      sx={{ 
        position: 'relative',
        overflow: 'visible',
        ...sx 
      }} 
      {...props}
    >
      {children}
    </Card>
  );
};

export default GlassCard;
