import React, { useState } from 'react';
import {
  Box,
  Typography,TextField,
  Button,
  Slider,
  MenuItem,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  School as SchoolIcon,
  AccessTime as TimeIcon,
  Favorite as HeartIcon,
  WorkspacePremium as AchievementIcon} from '@mui/icons-material';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';

const AcademicDetails = () => {
  const [toastOpen, setToastOpen] = useState(false);

  // Academic marks / grades (1 - 100)
  const [marks, setMarks] = useState(() => {
    const saved = localStorage.getItem('guidance_academic_marks');
    return saved ? JSON.parse(saved) : {
      Mathematics: 0,
      Physics: 0,
      Chemistry: 0,
      English: 0,
      'Computer Science': 0};
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('guidance_academic_attendance');
    return saved ? Number(saved) : 0;
  });

  const [studyHours, setStudyHours] = useState(() => {
    const saved = localStorage.getItem('guidance_academic_study_hours');
    return saved ? Number(saved) : 0;
  });

  const [favoriteSubject, setFavoriteSubject] = useState(() => {
    const saved = localStorage.getItem('guidance_academic_fav_subject');
    return saved || '';
  });
  
  const [achievementInput, setAchievementInput] = useState('');
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('guidance_academic_achievements');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = () => {
    localStorage.setItem('guidance_academic_marks', JSON.stringify(marks));
    localStorage.setItem('guidance_academic_attendance', attendance.toString());
    localStorage.setItem('guidance_academic_study_hours', studyHours.toString());
    localStorage.setItem('guidance_academic_fav_subject', favoriteSubject);
    localStorage.setItem('guidance_academic_achievements', JSON.stringify(achievements));
    setToastOpen(true);
  };

  const handleAddAchievement = () => {
    if (achievementInput.trim() && !achievements.includes(achievementInput.trim())) {
      setAchievements([...achievements, achievementInput.trim()]);
      setAchievementInput('');
    }
  };

  const handleRemoveAchievement = (item) => {
    setAchievements(achievements.filter((ach) => ach !== item));
  };

  return (
    <RouteTransition>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Outfit", sans-serif' }}>
            Academic Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Provide grades, attendance, study schedules, and achievements to calibrate neural model recommendations.
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" onClick={handleSave} sx={{ fontWeight: 700 }}>
          Save Details
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        
        {/* Subject-Wise Performance */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
          <GlassCard sx={{ height: '100%' }}>
            <Box sx={{ p: 3, mb: 3 }} borderBottom="1px solid rgba(255,255,255,0.05)" display="flex" alignItems="center" gap={1}>
              <SchoolIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={700}>Subject Marks / Grades</Typography>
            </Box>
            <Box sx={{ p: 3 }} display="flex" flexDirection="column" gap={3}>
              {Object.keys(marks).map((sub) => (
                <Box key={sub}>
                  <Box sx={{ mb: 1 }} display="flex" justifyContent="space-between">
                    <Typography variant="body2" fontWeight={600}>{sub}</Typography>
                    <Typography variant="body2" color="secondary" fontWeight={700}>
                      {marks[sub]} / 100
                    </Typography>
                  </Box>
                  <Slider
                    value={marks[sub]}
                    onChange={(e, val) => setMarks({ ...marks, [sub]: val })}
                    color="secondary"
                    valueLabelDisplay="auto"
                  />
                </Box>
              ))}
            </Box>
          </GlassCard>
        </Box>

        {/* Study Hours & Attendance Metrics */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <GlassCard>
            <Box sx={{ p: 3, mb: 3 }} borderBottom="1px solid rgba(255,255,255,0.05)" display="flex" alignItems="center" gap={1}>
              <TimeIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={700}>Study Habits & Engagement</Typography>
            </Box>
            <Box sx={{ p: 3 }} display="flex" flexDirection="column" gap={3}>
              {/* Attendance Slider */}
              <Box>
                <Box sx={{ mb: 1 }} display="flex" justifyContent="space-between">
                  <Typography variant="body2" fontWeight={600}>Overall Attendance (%)</Typography>
                  <Typography variant="body2" color="primary.light" fontWeight={700}>
                    {attendance}%
                  </Typography>
                </Box>
                <Slider
                  value={attendance}
                  onChange={(e, val) => setAttendance(val)}
                  color="primary"
                  valueLabelDisplay="auto"
                />
              </Box>

              {/* Study Hours Textbox */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                  <TextField
                    fullWidth
                    label="Daily Study Hours"
                    type="number"
                    value={studyHours}
                    onChange={(e) => setStudyHours(e.target.value)}
                  />
                </Box>
                {/* Favorite Subject Dropdown */}
                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                  <TextField
                    fullWidth
                    select
                    label="Favorite Subject"
                    value={favoriteSubject}
                    onChange={(e) => setFavoriteSubject(e.target.value)}
                  >
                    {Object.keys(marks).map((sub) => (
                      <MenuItem key={sub} value={sub}>
                        {sub}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Box>
            </Box>
          </GlassCard>

          {/* Academic Achievements Section */}
          <GlassCard sx={{ flexGrow: 1 }}>
            <Box sx={{ p: 3, mb: 2 }} borderBottom="1px solid rgba(255,255,255,0.05)" display="flex" alignItems="center" gap={1}>
              <AchievementIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={700}>Academic Achievements</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter honor, scholarship or reward"
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
                />
                <Button variant="outlined" color="secondary" onClick={handleAddAchievement}>
                  <AddIcon />
                </Button>
              </Box>
              <List sx={{ maxHeight: 220, overflowY: 'auto' }}>
                {achievements.map((ach, idx) => (
                  <ListItem
                    key={idx}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveAchievement(ach)}>
                        <DeleteIcon sx={{ color: 'error.light' }} />
                      </IconButton>
                    }
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.02)',
                      borderRadius: 2,
                      mb: 1,
                      border: '1px solid rgba(255,255,255,0.04)'}}
                  >
                    <ListItemText primary={ach} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </GlassCard>
        </Box>

      </Box>

      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={() => setToastOpen(false)}>
        <Alert onClose={() => setToastOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Academic details updated. Run career prediction analysis for fresh updates!
        </Alert>
      </Snackbar>
    </RouteTransition>
  );
};

export default AcademicDetails;
