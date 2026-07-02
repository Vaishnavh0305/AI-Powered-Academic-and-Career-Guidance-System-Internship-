import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import GlassCard from './GlassCard';

const StatCard = ({ title, value, icon, trend, trendColor = 'success.main', sx = {} }) => {
  return (
    <GlassCard sx={{ height: '100%', ...sx }}>
      <Box sx={{ height: '100%', minHeight: 140, p: 3 }} display="flex" flexDirection="column" justifyContent="space-between">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
          {icon && (
            <Avatar
              sx={{
                bgcolor: 'rgba(99, 102, 241, 0.08)',
                color: '#6366F1',
                width: 38,
                height: 38,
                borderRadius: '8px',
                border: '1px solid rgba(99, 102, 241, 0.15)',
              }}
            >
              {icon}
            </Avatar>
          )}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ my: 0.5 }}>
            {value}
          </Typography>
          {trend && (
            <Typography variant="caption" color={trendColor} fontWeight={600} display="block">
              {trend}
            </Typography>
          )}
        </Box>
      </Box>
    </GlassCard>
  );
};

export default StatCard;
