import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button} from '@mui/material';
import {
  WorkspacePremium as AchievementIcon,
  Code as CodeIcon,
  Forum as CommIcon,
  Psychology as LogicalIcon,
  Analytics as AnalyticalIcon,
  Groups as TeamIcon,
  Grade as GradeIcon} from '@mui/icons-material';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';

const SkillsAssessment = () => {
  const navigate = useNavigate();

  // Retrieve user data from local storage
  const hasProfile = !!localStorage.getItem('guidance_user_profile');
  const hasAcademics = !!localStorage.getItem('guidance_academic_marks');
  const progSkillsRaw = localStorage.getItem('guidance_user_programming_skills');
  const softSkillsRaw = localStorage.getItem('guidance_user_soft_skills');
  const hasProgSkills = !!progSkillsRaw;
  const hasSoftSkills = !!softSkillsRaw;

  // Verify if baseline data is provided
  const isDataProvided = hasProfile && hasAcademics && (hasProgSkills || hasSoftSkills);

  const savedProg = progSkillsRaw ? JSON.parse(progSkillsRaw) : {};
  const savedSoft = softSkillsRaw ? JSON.parse(softSkillsRaw) : {};
  const savedProjects = JSON.parse(localStorage.getItem('guidance_user_projects') || '[]');
  const savedInternships = JSON.parse(localStorage.getItem('guidance_user_internships') || '[]');
  const savedHackathons = JSON.parse(localStorage.getItem('guidance_user_hackathons') || '[]');
  const savedCerts = JSON.parse(localStorage.getItem('guidance_user_certs') || '[]');

  // Check if any skills have non-zero value
  const isSkillsSet = Object.values(savedProg).some(v => v > 0) || Object.values(savedSoft).some(v => v > 0);

  const isLocked = !isDataProvided || !isSkillsSet;

  const technicalSkills = [
    { name: 'Python Programming', value: savedProg.Python || 0, icon: <CodeIcon sx={{ color: 'primary.main' }} /> },
    { name: 'Java Programming', value: savedProg.Java || 0, icon: <CodeIcon sx={{ color: 'primary.main' }} /> },
    { name: 'JavaScript Development', value: savedProg.JavaScript || 0, icon: <CodeIcon sx={{ color: 'primary.main' }} /> },
    { name: 'SQL & Database Design', value: savedProg.SQL || 0, icon: <CodeIcon sx={{ color: 'primary.main' }} /> },
  ];

  const cognitiveSkills = [
    { name: 'Problem Solving', value: savedSoft['Problem Solving'] || 0, icon: <LogicalIcon sx={{ color: 'primary.main' }} /> },
    { name: 'Critical Thinking', value: savedSoft['Critical Thinking'] || 0, icon: <AnalyticalIcon sx={{ color: 'primary.main' }} /> },
  ];

  const interpersonalSkills = [
    { name: 'Communication', value: savedSoft.Communication || 0, icon: <CommIcon sx={{ color: '#EC4899' }} /> },
    { name: 'Leadership', value: savedSoft.Leadership || 0, icon: <TeamIcon sx={{ color: '#EC4899' }} /> },
    { name: 'Team Work', value: savedSoft['Team Work'] || 0, icon: <TeamIcon sx={{ color: '#EC4899' }} /> },
  ];

  const rawAccomplishments = [
    ...savedProjects.map(title => ({ type: 'Project', title, detail: 'AI Verified Project' })),
    ...savedInternships.map(title => ({ type: 'Internship', title, detail: 'AI Verified Placement' })),
    ...savedHackathons.map(title => ({ type: 'Hackathon', title, detail: 'AI Verified Rank' })),
    ...savedCerts.map(title => ({ type: 'Certification', title, detail: 'Credential Verified' })),
  ];

  const accomplishments = rawAccomplishments.length > 0 ? rawAccomplishments : [
    { type: 'Info', title: 'No Achievements Added Yet', detail: 'Configure your profile details to add achievements.' }
  ];

  if (isLocked) {
    return (
      <RouteTransition>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Outfit", sans-serif' }}>
            Skills Inventory & Assessment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI-validated capabilities catalog detailing core metrics, cognitive tests, and completed milestones.
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '50vh' }}>
          <GlassCard sx={{ p: 5, textAlign: 'center', maxWidth: 600, width: '100%' }}>
            <Box 
              sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                bgcolor: 'rgba(99,102,241,0.1)', 
                color: 'primary.main', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mx: 'auto', 
                mb: 3 
              }}
            >
              <AchievementIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Skills Assessment Locked
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
              You haven't set up your profile details, academic grades, or rated your skill matrix yet. AI cannot calibrate your capability score card without these baseline metrics.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/profile')}
              sx={{ fontWeight: 700, px: 4, py: 1.2 }}
            >
              Configure Profile & Skills Now
            </Button>
          </GlassCard>
        </Box>
      </RouteTransition>
    );
  }

  return (
    <RouteTransition>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Outfit", sans-serif' }}>
          Skills Inventory & Assessment
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AI-validated capabilities catalog detailing core metrics, cognitive tests, and completed milestones.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        
        {/* Progress Bars (Technical, Cognitive, Soft) */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(66.667% - 16px)' }, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* Tech Skills */}
          <GlassCard>
            <Box sx={{ p: 3, mb: 2 }} borderBottom="1px solid rgba(255,255,255,0.05)">
              <Typography variant="h6" fontWeight={700}>Core Coding & Tech Skills</Typography>
            </Box>
            <Box sx={{ p: 3 }} display="flex" flexDirection="column" gap={3}>
              {technicalSkills.map((skill) => (
                <Box key={skill.name}>
                  <Box sx={{ mb: 1 }} display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      {skill.icon}
                      <Typography variant="body2" fontWeight={600}>{skill.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="secondary" fontWeight={700}>
                      {skill.value}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={skill.value}
                    color="secondary"
                    sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)' }}
                  />
                </Box>
              ))}
            </Box>
          </GlassCard>

          {/* Cognitive & Analytical */}
          <GlassCard>
            <Box sx={{ p: 3, mb: 2 }} borderBottom="1px solid rgba(255,255,255,0.05)">
              <Typography variant="h6" fontWeight={700}>Cognitive & Reasoning Capabilities</Typography>
            </Box>
            <Box sx={{ p: 3 }} display="flex" flexDirection="column" gap={3}>
              {cognitiveSkills.map((skill) => (
                <Box key={skill.name}>
                  <Box sx={{ mb: 1 }} display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      {skill.icon}
                      <Typography variant="body2" fontWeight={600}>{skill.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="primary.light" fontWeight={700}>
                      {skill.value}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={skill.value}
                    color="primary"
                    sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)' }}
                  />
                </Box>
              ))}
            </Box>
          </GlassCard>

          {/* Interpersonal / Soft Skills */}
          <GlassCard>
            <Box sx={{ p: 3, mb: 2 }} borderBottom="1px solid rgba(255,255,255,0.05)">
              <Typography variant="h6" fontWeight={700}>Interpersonal & Soft Skills</Typography>
            </Box>
            <Box sx={{ p: 3 }} display="flex" flexDirection="column" gap={3}>
              {interpersonalSkills.map((skill) => (
                <Box key={skill.name}>
                  <Box sx={{ mb: 1 }} display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      {skill.icon}
                      <Typography variant="body2" fontWeight={600}>{skill.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="error.light" fontWeight={700}>
                      {skill.value}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={skill.value}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#EC4899'}
                    }}
                  />
                </Box>
              ))}
            </Box>
          </GlassCard>

        </Box>

        {/* Accomplishments & Verifications Column */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 16px)' }, minWidth: 0 }}>
          <GlassCard sx={{ height: '100%' }}>
            <Box sx={{ p: 3, mb: 2 }} borderBottom="1px solid rgba(255,255,255,0.05)" display="flex" alignItems="center" gap={1}>
              <AchievementIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={700}>Verified Achievements</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <List>
                {accomplishments.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      mb: 2,
                      bgcolor: 'rgba(255,255,255,0.02)',
                      borderRadius: 3,
                      border: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      p: 2}}
                  >
                    <Box sx={{ mb: 1 }} display="flex" justifyContent="space-between" width="100%" alignItems="center">
                      <Chip
                        label={item.type}
                        size="small"
                        color={
                          item.type === 'Project'
                            ? 'primary'
                            : item.type === 'Internship'
                            ? 'secondary'
                            : item.type === 'Hackathon'
                            ? 'info'
                            : 'warning'
                        }
                        sx={{ fontSize: '0.75rem', fontWeight: 700 }}
                      />
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <GradeIcon sx={{ color: 'secondary.main', fontSize: 14 }} />
                        <Typography variant="caption" color="text.secondary">Verified</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.detail}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          </GlassCard>
        </Box>

      </Box>
    </RouteTransition>
  );
};

export default SkillsAssessment;
