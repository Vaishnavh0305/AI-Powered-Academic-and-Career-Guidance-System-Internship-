import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as PredictionIcon,
  AssignmentTurnedIn as AssessmentIcon,
  EmojiEvents as TrophyIcon,
  Bookmark as CourseIcon,
  Code as CodeIcon,
  CheckCircle as CompletedIcon,
  ArrowForward as ArrowIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Load user data dynamically from localStorage
  const savedProfile = JSON.parse(localStorage.getItem('guidance_user_profile') || '{}');
  const savedAcademics = JSON.parse(localStorage.getItem('guidance_user_academics') || '{}');
  const savedProgrammingSkills = JSON.parse(localStorage.getItem('guidance_user_programming_skills') || '{}');
  const savedSoftSkills = JSON.parse(localStorage.getItem('guidance_user_soft_skills') || '{}');
  const savedCerts = JSON.parse(localStorage.getItem('guidance_user_certs') || '[]');
  const savedPrediction = localStorage.getItem('guidance_user_prediction') || 'None';

  const userName = savedProfile.name || 'Student';
  const hasData = savedProfile.name || localStorage.getItem('guidance_academic_marks');

  // Dynamic Average Skill Score calculation
  const progValues = Object.values(savedProgrammingSkills);
  const softValues = Object.values(savedSoftSkills);
  const allSkills = [...progValues, ...softValues];
  const avgScore = allSkills.length > 0 ? Math.round(allSkills.reduce((a, b) => a + b, 0) / allSkills.length) : 0;

  // Recharts career distribution logic
  const careerData = savedPrediction !== 'None' 
    ? [
        { name: savedPrediction, value: 50, color: '#6366F1' },
        { name: 'Data Scientist', value: 25, color: '#10B981' },
        { name: 'Full Stack Dev', value: 25, color: '#818CF8' },
      ]
    : [
        { name: 'Software Developer', value: 40, color: '#6366F1' },
        { name: 'Data Scientist', value: 30, color: '#10B981' },
        { name: 'Cybersecurity Expert', value: 15, color: '#818CF8' },
        { name: 'UI/UX Designer', value: 15, color: '#A78BFA' },
      ];

  // Recharts dynamic skills radar chart data
  const skillData = [
    { subject: 'Python', value: savedProgrammingSkills.Python || 0, fullMark: 100 },
    { subject: 'Problem Solving', value: savedSoftSkills['Problem Solving'] || 0, fullMark: 100 },
    { subject: 'Communication', value: savedSoftSkills.Communication || 0, fullMark: 100 },
    { subject: 'SQL', value: savedProgrammingSkills.SQL || 0, fullMark: 100 },
    { subject: 'Leadership', value: savedSoftSkills.Leadership || 0, fullMark: 100 },
    { subject: 'Java', value: savedProgrammingSkills.Java || 0, fullMark: 100 },
  ];

  // Recharts dynamic academic marks bar chart data
  const marks10Value = Number(savedAcademics.marks10) || 0;
  const marks12Value = Number(savedAcademics.marks12) || 0;
  const cgpaValue = Number(savedAcademics.cgpa) ? Math.min(Math.round(Number(savedAcademics.cgpa) * 10), 100) : 0;

  const academicData = [
    { name: 'Class 10th (%)', gpa: marks10Value },
    { name: 'Class 12th (%)', gpa: marks12Value },
    { name: 'Current CGPA (%)', gpa: cgpaValue },
  ];

  // Dynamic Recent Activities based on user logs
  const recentActivities = [];
  if (localStorage.getItem('guidance_user_profile')) {
    recentActivities.push({
      title: 'Profile details saved',
      time: 'Recently',
      desc: `Personal records updated for ${userName}.`,
      icon: <CodeIcon sx={{ color: 'primary.main' }} />,
      bgColor: 'rgba(99, 102, 241, 0.08)',
    });
  }
  if (localStorage.getItem('guidance_academic_marks')) {
    recentActivities.push({
      title: 'Academic grades updated',
      time: 'Recently',
      desc: 'Grades and study attendance metrics saved.',
      icon: <AssessmentIcon sx={{ color: 'secondary.main' }} />,
      bgColor: 'rgba(16, 185, 129, 0.08)',
    });
  }
  if (savedPrediction !== 'None') {
    recentActivities.push({
      title: 'AI predictions generated',
      time: 'Recently',
      desc: `AI calibrated ${savedPrediction} as ideal target path.`,
      icon: <AIIcon sx={{ color: 'secondary.main' }} />,
      bgColor: 'rgba(16, 185, 129, 0.08)',
    });
  }

  return (
    <RouteTransition>
      {/* Welcome Banner */}
      <GlassCard 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.15)'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={850} gutterBottom sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Welcome back, {userName}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 650 }}>
              {hasData 
                ? "Our AI models have processed your academic profile and skills. Your customized predictions and recommended pathways are available."
                : "Complete your profile, academic details, and skills assessment to allow our AI models to calibrate personalized recommendations for you."}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/prediction')}
            endIcon={<ArrowIcon />}
            sx={{ fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Analyze Prediction
          </Button>
        </Box>
      </GlassCard>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 0 }}>
          <StatCard
            title="Primary Prediction"
            value={savedPrediction !== 'None' ? savedPrediction : 'N/A'}
            trend={savedPrediction !== 'None' ? 'Calibrated via AI' : 'Run prediction'}
            trendColor={savedPrediction !== 'None' ? 'secondary.main' : 'text.secondary'}
            icon={<PredictionIcon />}
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 0 }}>
          <StatCard
            title="Completed Assessments"
            value={localStorage.getItem('guidance_academic_marks') ? 'Completed' : '0 Tests'}
            trend={localStorage.getItem('guidance_academic_marks') ? 'Active profile' : 'Pending input'}
            trendColor={localStorage.getItem('guidance_academic_marks') ? 'success.main' : 'text.secondary'}
            icon={<AssessmentIcon />}
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 0 }}>
          <StatCard
            title="Average Skill Score"
            value={avgScore > 0 ? `${avgScore} / 100` : '0 / 100'}
            trend="Calibrated index"
            trendColor={avgScore > 0 ? 'success.main' : 'text.secondary'}
            icon={<TrophyIcon />}
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, minWidth: 0 }}>
          <StatCard
            title="Claimed Credentials"
            value={`${savedCerts.length} Claimed`}
            trend="Certifications profile"
            trendColor={savedCerts.length > 0 ? 'success.main' : 'text.secondary'}
            icon={<CourseIcon />}
          />
        </Box>
      </Box>

      {/* Charts & Graphs */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        
        {/* Career Distribution Chart */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' }, minWidth: 0 }}>
          <GlassCard sx={{ height: '100%' }}>
            <Box sx={{ p: 3 }} borderBottom="1px solid rgba(255, 255, 255, 0.05)">
              <Typography variant="h6" fontWeight={700}>Career Distribution</Typography>
              <Typography variant="caption" color="text.secondary">AI-predicted suitable domains</Typography>
            </Box>
            <Box sx={{ height: 260, py: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={careerData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {careerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#12131A', 
                      borderRadius: '6px', 
                      border: '1px solid rgba(255, 255, 255, 0.05)' 
                    }} 
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconSize={10}
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Box>

        {/* Skill Analysis Chart */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' }, minWidth: 0 }}>
          <GlassCard sx={{ height: '100%' }}>
            <Box sx={{ p: 3 }} borderBottom="1px solid rgba(255, 255, 255, 0.05)">
              <Typography variant="h6" fontWeight={700}>Skill Analysis Matrix</Typography>
              <Typography variant="caption" color="text.secondary">Core strengths vs soft skills</Typography>
            </Box>
            <Box sx={{ height: 260, py: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillData}>
                  <PolarGrid stroke="rgba(255,255,255,0.04)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 8 }} />
                  <Radar
                    name={userName}
                    dataKey="value"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Box>

        {/* Academic Performance Chart */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' }, minWidth: 0 }}>
          <GlassCard sx={{ height: '100%' }}>
            <Box sx={{ p: 3 }} borderBottom="1px solid rgba(255, 255, 255, 0.05)">
              <Typography variant="h6" fontWeight={700}>Academic Performance</Typography>
              <Typography variant="caption" color="text.secondary">Grade indicators timeline (%)</Typography>
            </Box>
            <Box sx={{ height: 260, py: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={academicData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#12131A', 
                      borderRadius: '6px', 
                      border: '1px solid rgba(255, 255, 255, 0.05)' 
                    }} 
                  />
                  <Bar dataKey="gpa" fill="#6366F1" radius={[4, 4, 0, 0]}>
                    {academicData.map((entry, index) => (
                      <Cell 
                      key={`cell-${index}`} 
                      fill={index >= 2 ? '#6366F1' : '#10B981'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Box>

      </Box>

      {/* Recent Activity Section */}
      <GlassCard>
        <Box sx={{ p: 3 }} borderBottom="1px solid rgba(255, 255, 255, 0.05)" display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>Recent Platform Activity</Typography>
          <Button size="small" onClick={() => navigate('/history')} sx={{ color: 'secondary.main', fontWeight: 650 }}>
            View Full Logs
          </Button>
        </Box>
        {recentActivities.length > 0 ? (
          <List sx={{ p: 2 }}>
            {recentActivities.map((act, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: act.bgColor, borderRadius: 2 }}>
                      {act.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={act.title}
                    secondary={act.desc}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
                    secondaryTypographyProps={{ color: 'text.secondary', fontSize: '0.85rem' }}
                  />
                  <Typography variant="caption" color="text.disabled" sx={{ minWidth: 80, textAlign: 'right' }}>
                    {act.time}
                  </Typography>
                </ListItem>
                {index < recentActivities.length - 1 && <Divider sx={{ opacity: 0.05, ml: 7 }} />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 4 }} textAlign="center">
            <Typography variant="body2" color="text.secondary">No recent platform activity logged. Fill out details to trigger activity logs.</Typography>
          </Box>
        )}
      </GlassCard>
    </RouteTransition>
  );
};

export default Dashboard;
