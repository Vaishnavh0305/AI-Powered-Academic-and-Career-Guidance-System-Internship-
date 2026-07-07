import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,Chip,
  Button,
  Avatar,
  Divider} from '@mui/material';
import {
  MenuBook as BookIcon,
  PlayArrow as VideoIcon,
  WorkspacePremium as CertIcon,
  Code as ProjectIcon,
  School as CourseIcon,
  ArrowForward as ArrowIcon,
  AccessTime as DurationIcon} from '@mui/icons-material';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';

const Recommendations = () => {
  const navigate = useNavigate();

  const courses = [
    {
      title: 'Machine Learning Specialization',
      provider: 'Stanford & DeepLearning.AI via Coursera',
      duration: 'approx. 2 months (6 hours/week)',
      type: 'Course',
      level: 'Beginner-Intermediate',
      rating: '4.9/5',
      icon: <CourseIcon sx={{ color: '#6366F1' }} />},
    {
      title: 'Deep Learning Specialization',
      provider: 'DeepLearning.AI via Coursera',
      duration: 'approx. 3 months (8 hours/week)',
      type: 'Course',
      level: 'Advanced',
      rating: '4.8/5',
      icon: <CourseIcon sx={{ color: '#818CF8' }} />},
  ];

  const certs = [
    {
      title: 'AWS Certified Machine Learning - Specialty',
      provider: 'Amazon Web Services',
      duration: 'Study recommendation: 3 months',
      cost: 'Paid Exam ($300)',
      icon: <CertIcon sx={{ color: '#10B981' }} />},
    {
      title: 'Google Cloud Professional ML Engineer',
      provider: 'Google Cloud Platform',
      duration: 'Study recommendation: 2 months',
      cost: 'Paid Exam ($200)',
      icon: <CertIcon sx={{ color: '#6366F1' }} />},
  ];

  const projects = [
    {
      title: 'Real-time NLP Resume Parser & Classifier',
      difficulty: 'Hard',
      tech: 'Python, SpaCy, BERT, Streamlit',
      desc: 'Build a neural model to parse resumes and predict job-roles alignment using NLP pipelines.',
      icon: <ProjectIcon sx={{ color: '#EC4899' }} />},
    {
      title: 'Predictive Student Marks Analyzer Dashboard',
      difficulty: 'Medium',
      tech: 'Python, Pandas, Scikit-learn, React.js',
      desc: 'Train regressors and classification trees to forecast students marks and export visual summaries.',
      icon: <ProjectIcon sx={{ color: '#F59E0B' }} />},
  ];

  const booksAndVideos = [
    {
      title: 'Hands-On Machine Learning with Scikit-Learn, Keras, & TensorFlow',
      author: 'Aurélien Géron',
      type: 'Book (Highly Recommended)',
      desc: 'The definitive handbook detailing practical applications of machine learning frameworks.',
      icon: <BookIcon sx={{ color: '#3B82F6' }} />},
    {
      title: '3Blue1Brown: Neural Networks Deep Dive',
      author: 'Grant Sanderson (YouTube)',
      type: 'Video Playlist',
      desc: 'Stunning mathematical visualizations of backpropagation, layers and neural architectures.',
      icon: <VideoIcon sx={{ color: '#EF4444' }} />},
  ];

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
            AI Course & Career Recommendations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Curated resources, textbooks, practical projects and certification pathways aligned with Machine Learning Engineer forecast.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => navigate('/roadmap')}
          endIcon={<ArrowIcon />}
          sx={{ fontWeight: 700 }}
        >
          View Full Roadmap
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        
        {/* Recommended Courses */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>Recommended Courses</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {courses.map((item, idx) => (
              <Box sx={{ flex: '1 1 100%', minWidth: 0 }}key={idx}>
                <GlassCard>
                  <Box sx={{ p: 3 }} display="flex" gap={2} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.08)', color: '#6366F1', borderRadius: 1.5 }}>
                      {item.icon}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Box sx={{ mb: 1 }} display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
                        <Typography variant="subtitle1" fontWeight={700}>{item.title}</Typography>
                        <Chip label={item.level} size="small" color="primary" sx={{ fontSize: '0.7rem' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>{item.provider}</Typography>
                      <Box sx={{ mt: 1.5 }} display="flex" alignItems="center" gap={0.5}>
                        <DurationIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">{item.duration}</Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1, opacity: 0.1 }} />
                        <Typography variant="caption" color="secondary.main" fontWeight={700}>Rating: {item.rating}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </GlassCard>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Recommended Certifications */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>Professional Certifications</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {certs.map((item, idx) => (
              <Box sx={{ flex: '1 1 100%', minWidth: 0 }}key={idx}>
                <GlassCard>
                  <Box sx={{ p: 3 }} display="flex" gap={2} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: 2 }}>
                      {item.icon}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>{item.provider}</Typography>
                      <Box sx={{ mt: 1.5 }} display="flex" alignItems="center" gap={0.5}>
                        <DurationIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">{item.duration}</Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1, opacity: 0.1 }} />
                        <Typography variant="caption" color="success.main" fontWeight={700}>{item.cost}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </GlassCard>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Suggested Projects */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>Portfolio Building Projects</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {projects.map((item, idx) => (
              <Box sx={{ flex: '1 1 100%', minWidth: 0 }}key={idx}>
                <GlassCard>
                  <Box sx={{ p: 3 }} display="flex" gap={2} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: 'rgba(236, 72, 153, 0.1)', color: '#EC4899', borderRadius: 2 }}>
                      {item.icon}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Box sx={{ mb: 1 }} display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
                        <Typography variant="subtitle1" fontWeight={700}>{item.title}</Typography>
                        <Chip 
                          label={item.difficulty} 
                          size="small" 
                          color={item.difficulty === 'Hard' ? 'error' : 'warning'} 
                          sx={{ fontSize: '0.7rem' }} 
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{item.desc}</Typography>
                      <Chip label={`Tech: ${item.tech}`} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                    </Box>
                  </Box>
                </GlassCard>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Textbooks & YouTube Resources */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>Reference Books & Video Playlists</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {booksAndVideos.map((item, idx) => (
              <Box sx={{ flex: '1 1 100%', minWidth: 0 }}key={idx}>
                <GlassCard>
                  <Box sx={{ p: 3 }} display="flex" gap={2} alignItems="flex-start">
                    <Avatar sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', borderRadius: 2 }}>
                      {item.icon}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Box sx={{ mb: 0.5 }} display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
                        <Typography variant="subtitle1" fontWeight={700}>{item.title}</Typography>
                        <Chip label={item.type} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>By {item.author}</Typography>
                      <Typography variant="caption" color="text.disabled" display="block" mt={1}>{item.desc}</Typography>
                    </Box>
                  </Box>
                </GlassCard>
              </Box>
            ))}
          </Box>
        </Box>

      </Box>
    </RouteTransition>
  );
};

export default Recommendations;
