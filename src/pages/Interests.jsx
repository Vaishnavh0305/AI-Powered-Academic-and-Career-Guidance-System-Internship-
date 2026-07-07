import React, { useState } from 'react';
import {
  Box,
  Typography,Button,
  Snackbar,
  Alert} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  Done as DoneIcon} from '@mui/icons-material';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';
import { saveGuidanceData } from '../services/api';

const Interests = () => {
  const [toastOpen, setToastOpen] = useState(false);

  const interestList = [
    'Artificial Intelligence',
    'Machine Learning',
    'Data Science',
    'Web Development',
    'Cybersecurity',
    'Cloud Computing',
    'DevOps',
    'Blockchain',
    'UI/UX',
    'Software Development',
    'Game Development',
    'Mobile Development',
    'Networking',
    'IoT',
    'Embedded Systems',
    'Robotics',
  ];

  const [selectedInterests, setSelectedInterests] = useState(() => {
    const saved = localStorage.getItem('guidance_user_interests');
    return saved ? JSON.parse(saved) : [];
  });

  const handleToggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSave = async () => {
    localStorage.setItem('guidance_user_interests', JSON.stringify(selectedInterests));
    await saveGuidanceData({ interests: selectedInterests });
    setToastOpen(true);
  };

  return (
    <RouteTransition>
      <Box 
        sx={{ 
          mb: 4, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2, 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          justifyContent: 'space-between' 
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Outfit", sans-serif' }}>
            Personal Interests Selection
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select the domains you are passionate about. Our AI algorithms cross-reference these selections with your performance.
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" onClick={handleSave} sx={{ fontWeight: 700 }}>
          Save Interests
        </Button>
      </Box>

      {/*of Interests */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        {interestList.map((interest) => {
          const isSelected = selectedInterests.includes(interest);
          return (
            <Box sx={{ flex: { xs: '1 1 calc(50% - 16px)', sm: '1 1 calc(33.333% - 16px)', md: '1 1 calc(25% - 16px)' }, minWidth: 0 }}key={interest}>
              <GlassCard
                onClick={() => handleToggleInterest(interest)}
                sx={{
                  cursor: 'pointer',
                  borderColor: isSelected ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.05) 100%)' 
                    : '#12131A',
                  boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.08)' : 'none',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: '#6366F1'}}}
              >
                <Box sx={{ p: 3 }} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography 
                    variant="body1" 
                    fontWeight={700}
                    color={isSelected ? 'primary.main' : 'text.primary'}
                  >
                    {interest}
                  </Typography>
                  {isSelected ? (
                    <DoneIcon sx={{ color: 'secondary.main' }} />
                  ) : (
                    <AIIcon sx={{ color: 'rgba(255,255,255,0.15)', fontSize: 20 }} />
                  )}
                </Box>
              </GlassCard>
            </Box>
          );
        })}
      </Box>

      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={() => setToastOpen(false)}>
        <Alert onClose={() => setToastOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Interests updated successfully! Neural networks weights re-aligned.
        </Alert>
      </Snackbar>
    </RouteTransition>
  );
};

export default Interests;
