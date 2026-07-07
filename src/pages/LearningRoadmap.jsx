import React, { useState } from 'react';
import {
  Box,
  Typography,LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button,
  Chip,
  Divider} from '@mui/material';
import {
  RadioButtonChecked as DotIcon,
  PlayArrow as PlayIcon,
  Launch as OpenIcon,
  CheckCircle as CheckedIcon} from '@mui/icons-material';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';

const LearningRoadmap = () => {
  // Timeline nodes state
  const [timeline, setTimeline] = useState([
    {
      id: 1,
      title: 'Phase 1: Learn Basics (Foundations)',
      desc: 'Master fundamental tools, databases, and core calculus/statistics required for classification modeling.',
      progress: 100,
      resources: [
        { name: 'Python for Beginners (freeCodeCamp)', url: 'https://youtube.com' },
        { name: 'SQL BootCamp (SQLBolt)', url: 'https://sqlbolt.com' },
        { name: 'Linear Algebra elective (Khan Academy)', url: 'https://khanacademy.org' },
      ],
      skills: ['Python Basics', 'SQL Queries', 'Basic Calculus']},
    {
      id: 2,
      title: 'Phase 2: Intermediate (Statistical ML)',
      desc: 'Understand data prep, regressors, classifiers, decision trees, and validation metrics.',
      progress: 75,
      resources: [
        { name: 'Scikit-Learn Tutorial (Official Docs)', url: 'https://scikit-learn.org' },
        { name: 'Kaggle Machine Learning Intro', url: 'https://kaggle.com' },
        { name: 'StatQuest: Machine Learning (YouTube)', url: 'https://youtube.com' },
      ],
      skills: ['Pandas & NumPy', 'Regression Models', 'Random Forest Classifier']},
    {
      id: 3,
      title: 'Phase 3: Advanced (Deep Learning & NLP)',
      desc: 'Dive into neural networks, backpropagation, and text/image classification algorithms.',
      progress: 25,
      resources: [
        { name: 'Deep Learning Specialization (Andrew Ng)', url: 'https://coursera.org' },
        { name: 'Hugging Face NLP Course', url: 'https://huggingface.co' },
      ],
      skills: ['PyTorch / TensorFlow', 'CNN / RNN', 'Transformers & BERT']},
    {
      id: 4,
      title: 'Phase 4: Practical Portfolio Projects',
      desc: 'Create end-to-end applications demonstrating NLP parsing and predictive dashboards.',
      progress: 50,
      resources: [
        { name: 'Suggested Project: AI Resume Parser repo', url: 'https://github.com' },
        { name: 'Project 2: Academic Guidance Dashboard', url: 'https://github.com' },
      ],
      skills: ['Model Deployment', 'Streamlit UI', 'API Fast-API Integrations']},
    {
      id: 5,
      title: 'Phase 5: Technical Internships',
      desc: 'Work on production systems in collaboration with tech teams or research labs.',
      progress: 0,
      resources: [
        { name: 'Internship Guide: GSoC (Google Summer of Code)', url: 'https://summerofcode.withgoogle.com' },
        { name: 'LinkedIn ML Internship Job Search', url: 'https://linkedin.com' },
      ],
      skills: ['Git Collaborative Flow', 'CI/CD Pipelines', 'MLOps Basics']},
    {
      id: 6,
      title: 'Phase 6: Placement Preparation',
      desc: 'Practice mock technical interviews, data structures algorithms, and portfolio showcases.',
      progress: 0,
      resources: [
        { name: 'LeetCode top interview 150', url: 'https://leetcode.com' },
        { name: 'Behavioral Prep drills (Star Method)', url: 'https://coursera.org' },
      ],
      skills: ['Data Structures (DSA)', 'Mock Coding Boards', 'Resume Optimization']},
  ]);

  const handleUpdateProgress = (id, change) => {
    setTimeline(
      timeline.map((step) => {
        if (step.id === id) {
          const newVal = Math.min(100, Math.max(0, step.progress + change));
          return { ...step, progress: newVal };
        }
        return step;
      })
    );
  };

  return (
    <RouteTransition>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Outfit", sans-serif' }}>
          Interactive Learning Roadmap
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track and check off your learning phases dynamically. Ratings calibrate recommendations matches.
        </Typography>
      </Box>

      {/* Custom Timeline Layout */}
      <Box sx={{ position: 'relative', pl: { xs: 2, sm: 6 }, '&::before': { content: '""', position: 'absolute', left: { xs: 8, sm: 24 }, top: 20, bottom: 20, width: 2, bgcolor: 'rgba(255, 255, 255, 0.08)' } }}>
        {timeline.map((step) => (
          <Box key={step.id} sx={{ position: 'relative', mb: 5 }}>
            
            {/* Bullet Circle Connector */}
            <Box
              sx={{
                position: 'absolute',
                left: { xs: -25, sm: -48 },
                top: 4,
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: step.progress === 100 ? '#10B981' : step.progress > 0 ? '#6366F1' : '#1E293B',
                border: '3px solid #090A0F',
                boxShadow: step.progress > 0 ? '0 0 6px rgba(99, 102, 241, 0.4)' : 'none',
                zIndex: 1}}
            />

            {/* Timeline Phase Card */}
            <GlassCard>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.667% - 16px)' }, minWidth: 0 }}>
                    <Box 
                      sx={{ 
                        mb: 1.5, 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' }, 
                        alignItems: { xs: 'flex-start', sm: 'center' }, 
                        gap: 1.5 
                      }}
                    >
                      <Typography variant="h6" fontWeight={700}>
                        {step.title}
                      </Typography>
                      {step.progress === 100 ? (
                        <Chip label="Completed" size="small" color="success" sx={{ fontSize: '0.7rem', fontWeight: 700 }} />
                      ) : step.progress > 0 ? (
                        <Chip label="In Progress" size="small" color="secondary" sx={{ fontSize: '0.7rem', fontWeight: 700 }} />
                      ) : (
                        <Chip label="Not Started" size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {step.desc}
                    </Typography>

                    {/* Skill Tags */}
                    <Box sx={{ mb: 2 }} display="flex" flexWrap="wrap" gap={1}>
                      {step.skills.map((skill) => (
                        <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.06)', color: 'text.secondary' }} />
                      ))}
                    </Box>
                  </Box>

                  {/* Progress & Controls Column */}
                  <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' }, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ mb: 1 }} display="flex" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary" fontWeight={650}>Phase Progress</Typography>
                        <Typography variant="caption" color="secondary.main" fontWeight={700}>{step.progress}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={step.progress} color={step.progress === 100 ? 'success' : 'secondary'} sx={{ height: 6, borderRadius: 3 }} />
                    </Box>

                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleUpdateProgress(step.id, -25)}
                        disabled={step.progress === 0}
                        sx={{ borderColor: 'rgba(255,255,255,0.08)', minWidth: 40 }}
                      >
                        -
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleUpdateProgress(step.id, 25)}
                        disabled={step.progress === 100}
                        sx={{ borderColor: 'rgba(255,255,255,0.08)', minWidth: 40 }}
                      >
                        +
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => handleUpdateProgress(step.id, 100)}
                        disabled={step.progress === 100}
                        sx={{ flexGrow: 1 }}
                      >
                        Complete
                      </Button>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2, opacity: 0.05 }} />

                {/* Resource Links */}
                <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" mb={1}>
                  Learning Resources:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {step.resources.map((res, index) => (
                    <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(33.333% - 16px)' }, minWidth: 0 }}key={index}>
                      <Button
                        variant="text"
                        size="small"
                        href={res.url}
                        target="_blank"
                        startIcon={step.progress === 100 ? <CheckedIcon sx={{ color: '#10B981' }} /> : <PlayIcon sx={{ color: 'primary.main' }} />}
                        endIcon={<OpenIcon sx={{ fontSize: 10 }} />}
                        sx={{
                          color: 'text.primary',
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          fontSize: '0.78rem',
                          textTransform: 'none',
                          p: 0,
                          '&:hover': { color: 'primary.main' }}}
                      >
                        {res.name}
                      </Button>
                    </Box>
                  ))}
                </Box>

              </Box>
            </GlassCard>
          </Box>
        ))}
      </Box>
    </RouteTransition>
  );
};

export default LearningRoadmap;
