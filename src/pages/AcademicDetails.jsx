import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  Chip} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  School as SchoolIcon,
  AccessTime as TimeIcon,
  Favorite as HeartIcon,
  WorkspacePremium as AchievementIcon,
  SwapHoriz as SwapIcon} from '@mui/icons-material';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';
import { getGuidanceData, saveGuidanceData } from '../services/api';

/* ── Subject mapping per education level ────────────────────────────── */
const SUBJECTS_BY_LEVEL = {
  'Class 10': [
    'Mathematics', 'Science', 'Social Science', 'English',
    'Hindi', 'Computer Applications',
  ],
  'Class 12': [
    'Mathematics', 'Physics', 'Chemistry', 'English',
    'Computer Science', 'Biology', 'Accountancy',
    'Business Studies', 'Economics', 'Hindi',
  ],
  'Undergraduate': [
    'Mathematics', 'Physics', 'Chemistry', 'English',
    'Computer Science', 'Electronics', 'Data Structures',
    'Operating Systems', 'Database Management', 'Statistics',
  ],
  'Undergraduate (Commerce)': [
    'Financial Accounting', 'Corporate Laws', 'Business Statistics',
    'Macroeconomics', 'Cost Accounting', 'Corporate Finance',
    'Auditing', 'Marketing Management', 'Human Resource Management',
  ],
  'Graduate': [
    'Machine Learning', 'Data Science', 'Artificial Intelligence',
    'Advanced Mathematics', 'Research Methodology', 'Computer Networks',
    'Cloud Computing', 'Cyber Security', 'Software Engineering',
  ],
};

const DEFAULT_LEVEL = 'Class 10';

/* ── Helper: build a zero-marks object from a subject list ──────────── */
const buildDefaultMarks = (subjects) =>
  subjects.reduce((acc, sub) => ({ ...acc, [sub]: 0 }), {});

/* ── Read education level from Profile's localStorage store ─────────── */
const readEducationLevel = () => {
  try {
    const raw = localStorage.getItem('guidance_user_academics');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.currentEducation && SUBJECTS_BY_LEVEL[parsed.currentEducation]) {
        return parsed.currentEducation;
      }
    }
  } catch { /* ignore parse errors */ }
  return DEFAULT_LEVEL;
};

const AcademicDetails = () => {
  const [toastOpen, setToastOpen] = useState(false);

  /* ── Education level (synced from Profile page) ───────────────────── */
  const [educationLevel, setEducationLevel] = useState(readEducationLevel);

  /* ── Derive available subjects from the level ─────────────────────── */
  const availableSubjects = SUBJECTS_BY_LEVEL[educationLevel] || SUBJECTS_BY_LEVEL[DEFAULT_LEVEL];

  /* ── Academic marks / grades (1 – 100) ────────────────────────────── */
  const [marks, setMarks] = useState(() => {
    let savedMarks = {};
    try {
      const saved = localStorage.getItem('guidance_academic_marks');
      if (saved) savedMarks = JSON.parse(saved);
    } catch { /* ignore */ }

    // Always build a nested structure for all levels to isolate marks
    const result = {};
    Object.keys(SUBJECTS_BY_LEVEL).forEach((level) => {
      result[level] = {};
      const subjects = SUBJECTS_BY_LEVEL[level];
      subjects.forEach((sub) => {
        if (savedMarks[level] && savedMarks[level][sub] !== undefined) {
          result[level][sub] = savedMarks[level][sub];
        } else if (savedMarks[sub] !== undefined && level === DEFAULT_LEVEL) {
          result[level][sub] = savedMarks[sub];
        } else {
          result[level][sub] = 0;
        }
      });
    });
    return result;
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

  /* ── When the education level changes ──────────────────────────────── */
  const handleLevelChange = useCallback((newLevel) => {
    setEducationLevel(newLevel);
    const subjects = SUBJECTS_BY_LEVEL[newLevel] || SUBJECTS_BY_LEVEL[DEFAULT_LEVEL];

    // Ensure this level has entries in nested marks (in case it was never initialised)
    setMarks((prev) => {
      if (prev[newLevel]) return prev;
      const next = { ...prev, [newLevel]: {} };
      subjects.forEach((sub) => { next[newLevel][sub] = 0; });
      return next;
    });

    // Reset favourite if current pick is not in the new list
    setFavoriteSubject((prev) => (subjects.includes(prev) ? prev : ''));

    // Also update Profile's localStorage so both pages stay in sync
    try {
      const raw = localStorage.getItem('guidance_user_academics');
      const academics = raw ? JSON.parse(raw) : {};
      academics.currentEducation = newLevel;
      localStorage.setItem('guidance_user_academics', JSON.stringify(academics));
    } catch { /* ignore */ }
  }, []);

  /* ── Sync and load data from backend / Profile's storage on mount ── */
  useEffect(() => {
    const loadData = async () => {
      const data = await getGuidanceData();
      if (data && data.academics) {
        if (data.academics.currentEducation) setEducationLevel(data.academics.currentEducation);
        if (data.academics.marks) {
          setMarks((prev) => {
            const incoming = data.academics.marks;
            // Check if incoming marks are already nested (keyed by level)
            const firstKey = Object.keys(incoming)[0];
            if (firstKey && SUBJECTS_BY_LEVEL[firstKey]) {
              // Already nested – merge with defaults
              const merged = { ...prev };
              Object.keys(incoming).forEach((level) => {
                merged[level] = { ...(prev[level] || {}), ...incoming[level] };
              });
              return merged;
            }
            // Legacy flat format – place under current level
            const level = data.academics.currentEducation || readEducationLevel();
            return { ...prev, [level]: { ...(prev[level] || {}), ...incoming } };
          });
        }
        if (data.academics.attendance !== undefined) setAttendance(Number(data.academics.attendance));
        if (data.academics.studyHours !== undefined) setStudyHours(Number(data.academics.studyHours));
        if (data.academics.favSubject !== undefined) setFavoriteSubject(data.academics.favSubject);
        if (data.academics.achievements) setAchievements(data.academics.achievements);
      } else {
        const storedLevel = readEducationLevel();
        if (storedLevel !== educationLevel) {
          handleLevelChange(storedLevel);
        }
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    localStorage.setItem('guidance_academic_marks', JSON.stringify(marks));
    localStorage.setItem('guidance_academic_attendance', attendance.toString());
    localStorage.setItem('guidance_academic_study_hours', studyHours.toString());
    localStorage.setItem('guidance_academic_fav_subject', favoriteSubject);
    localStorage.setItem('guidance_academic_achievements', JSON.stringify(achievements));
    
    // Save all fields to MongoDB backend
    await saveGuidanceData({
      academics: {
        currentEducation: educationLevel,
        marks,
        attendance,
        studyHours,
        favSubject: favoriteSubject,
        achievements
      }
    });
    
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

      {/* ── Education Level Selector ──────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <GlassCard>
          <Box sx={{ p: 3 }} display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <SwapIcon sx={{ color: 'secondary.main' }} />
            <Typography variant="subtitle1" fontWeight={700} sx={{ mr: 1 }}>
              Current Education Level
            </Typography>
            <TextField
              select
              size="small"
              value={educationLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              sx={{ minWidth: 220 }}
            >
              {Object.keys(SUBJECTS_BY_LEVEL).map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
            <Chip
              label={`${availableSubjects.length} subjects`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ ml: 'auto' }}
            />
          </Box>
        </GlassCard>
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
              {availableSubjects.map((sub) => (
                <Box key={sub}>
                  <Box sx={{ mb: 1 }} display="flex" justifyContent="space-between">
                    <Typography variant="body2" fontWeight={600}>{sub}</Typography>
                    <Typography variant="body2" color="secondary" fontWeight={700}>
                      {(marks[educationLevel] && marks[educationLevel][sub]) || 0} / 100
                    </Typography>
                  </Box>
                  <Slider
                    value={(marks[educationLevel] && marks[educationLevel][sub]) || 0}
                    onChange={(e, val) => setMarks({
                      ...marks,
                      [educationLevel]: { ...(marks[educationLevel] || {}), [sub]: val }
                    })}
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
                {/* Favorite Subject Dropdown — now uses dynamic subjects */}
                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
                  <TextField
                    fullWidth
                    select
                    label="Favorite Subject"
                    value={favoriteSubject}
                    onChange={(e) => setFavoriteSubject(e.target.value)}
                  >
                    {availableSubjects.map((sub) => (
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

