import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  AutoAwesome as AIIcon,
  Psychology as MLIcon,
  TrendingUp as CareerIcon,
  School as SchoolIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckIcon,

  Speed as PerformanceIcon,
  Security as PrivacyIcon} from '@mui/icons-material';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MLIcon sx={{ color: 'primary.main', fontSize: 32 }} />,
      title: 'Advanced ML Predictions',
      desc: 'Utilizes sophisticated models trained on student datasets to predict paths with over 90% confidence.'},
    {
      icon: <SchoolIcon sx={{ color: 'primary.main', fontSize: 32 }} />,
      title: 'Multi-Stage Academic Levels',
      desc: 'Custom pipelines for Class 10 stream choices, Class 12 undergraduate courses, and college career paths.'},
    {
      icon: <CareerIcon sx={{ color: 'primary.main', fontSize: 32 }} />,
      title: 'Personalized Curated Roadmap',
      desc: 'Generates step-by-step learning schedules, suggesting certifications, top books, and video lectures.'},
    {
      icon: <PerformanceIcon sx={{ color: 'primary.main', fontSize: 32 }} />,
      title: 'Real-time Skill Assessments',
      desc: 'Dynamically evaluate programming and soft skills to continuously improve recommendation matches.'},
  ];

  const steps = [
    { num: '01', title: 'Fill Your Profile', desc: 'Enter academic records, CGPA, and subjects ratings.' },
    { num: '02', title: 'State Your Interests', desc: 'Choose fields like AI, Web Development, Cybersecurity, etc.' },
    { num: '03', title: 'Complete Skills assessment', desc: 'Submit project lists, hackathons, and certifications.' },
    { num: '04', title: 'Get Predictions & Roadmap', desc: 'Unlock instant career forecast reports and timelines.' },
  ];

  const benefits = [
    'Saves time by reducing confusion about career paths',
    'Backed by peer-reviewed machine learning architectures',
    'Access to curated high-quality learning resources',
    'Real-time administrative dashboards to track class progress',
    'Fully secure, GDPR and MongoDB-secure data storage',
  ];

  const faqs = [
    {
      q: 'How accurate are the guidance predictions?',
      a: 'The backend models use XGBoost and Random Forest architectures trained on over 50,000 students records, achieving high historical validation rates.'},
    {
      q: 'Is this system suitable for Class 10 students?',
      a: 'Yes! The system has dedicated algorithms for choosing post-10th streams (Science, Commerce, Arts) as well as higher-level pathways.'},
    {
      q: 'Can I track my learning progress?',
      a: 'Yes, the Learning Roadmap page provides interactive checklists to check off basics, intermediate concepts, and placement prep milestones.'},
  ];

  return (
    <RouteTransition>
      <Box sx={{ minHeight: '100vh', bgcolor: '#090A0F', color: 'text.primary', overflowX: 'hidden' }}>
        
        {/* Navigation Header */}
        <Box
          sx={{
            py: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'sticky',
            top: 0,
            bgcolor: 'rgba(9, 10, 15, 0.8)',
            backdropFilter: 'blur(12px)',
            zIndex: 100}}
        >
          <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box display="flex" alignItems="center" gap={1.5} sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
              <AIIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={800} sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.05em' }}>
                AI GUIDANCE
              </Typography>
            </Box>
            
            {/* Desktop Navigation Links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
              {['Features', 'How It Works', 'Benefits', 'FAQ'].map((link) => (
                <Button
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  sx={{ color: 'text.secondary', fontWeight: 500, '&:hover': { color: 'primary.main' } }}
                >
                  {link}
                </Button>
              ))}
            </Box>

            <Box display="flex" gap={2}>
              <Button variant="outlined" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
                Register
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center', zIndex: 1, position: 'relative' }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  borderRadius: 5,
                  bgcolor: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  mb: 3}}
              >
                <AIIcon sx={{ color: 'primary.main', fontSize: 16 }} />
                <Typography variant="caption" color="primary.light" fontWeight={700} letterSpacing="0.05em">
                  AI-POWERED INSIGHTS
                </Typography>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.15,
                  mb: 3,
                  fontFamily: '"Plus Jakarta Sans", sans-serif'}}
              >
                Discover Your Ideal Academic &{' '}
                <span style={{ background: 'linear-gradient(135deg, #10B981 0%, #6366F1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Career Path
                </span>{' '}
                Using AI
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, mb: 4, lineHeight: 1.6 }}>
                Analyze your academic performance, interests, and skills to receive personalized recommendations and custom roadmap timelines.
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/register')}
                  sx={{ px: 4, py: 1.75 }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ px: 4, py: 1.75 }}
                >
                  Login Portal
                </Button>
              </Box>
            </Box>

            {/* AI SVG Visual Illustration */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 500,
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'}}
              >
                <svg width="100%" height="100%" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer rings */}
                  <circle cx="250" cy="200" r="160" stroke="#6366F1" strokeWidth="1" strokeDasharray="5 5" opacity="0.2" />
                  <circle cx="250" cy="200" r="120" stroke="#10B981" strokeWidth="1" opacity="0.3" />
                  
                  {/* Central node */}
                  <circle cx="250" cy="200" r="50" fill="url(#brainGlow)" />
                  
                  {/* Nodes and Links */}
                  <g stroke="#6366F1" strokeWidth="1.5" opacity="0.3">
                    <line x1="250" y1="200" x2="130" y2="120" />
                    <line x1="250" y1="200" x2="370" y2="120" />
                    <line x1="250" y1="200" x2="130" y2="280" />
                    <line x1="250" y1="200" x2="370" y2="280" />
                  </g>

                  {/* Outer floating feature nodes */}
                  <circle cx="130" cy="120" r="30" fill="#12131A" stroke="#6366F1" strokeWidth="2" />
                  <path d="M125 110 L135 120 L125 130" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
                  
                  <circle cx="370" cy="120" r="30" fill="#12131A" stroke="#10B981" strokeWidth="2" />
                  <circle cx="370" cy="120" r="12" fill="#10B981" opacity="0.8" />
                  
                  <circle cx="130" cy="280" r="30" fill="#12131A" stroke="#10B981" strokeWidth="2" />
                  <circle cx="130" cy="280" r="10" fill="#6366F1" />

                  <circle cx="370" cy="280" r="30" fill="#12131A" stroke="#6366F1" strokeWidth="2" />
                  <line x1="360" y1="280" x2="380" y2="280" stroke="#F8FAFC" strokeWidth="2" />
                  <line x1="370" y1="270" x2="370" y2="290" stroke="#F8FAFC" strokeWidth="2" />

                  {/* Gradients */}
                  <defs>
                    <radialGradient id="brainGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(250 200) rotate(90) scale(50)">
                      <stop stopColor="#6366F1" />
                      <stop offset="1" stopColor="#10B981" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
              </Box>
            </Box>
          </Box>
        </Container>

        {/* Features Section */}
        <Box id="features" sx={{ py: 10, borderTop: '1px solid rgba(255, 255, 255, 0.05)', bgcolor: 'rgba(18, 19, 26, 0.4)' }}>
          <Container maxWidth="lg">
            <Typography variant="h3" fontWeight={800} align="center" gutterBottom sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Features Crafted For Career Success
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
              A full platform built using advanced machine learning models, customized roadmaps, and detailed dashboards.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {features.map((feat, idx) => (
                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 16px)' }, minWidth: 0 }} key={idx}>
                  <GlassCard sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                      {feat.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                      {feat.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feat.desc}
                    </Typography>
                  </GlassCard>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* How It Works Section */}
        <Box id="how-it-works" sx={{ py: 10 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" fontWeight={800} align="center" gutterBottom sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              How The Pipeline Works
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}>
              Follow these simple steps to analyze your capabilities and unlock career trajectories.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {steps.map((step, idx) => (
                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 16px)' }, minWidth: 0 }} key={idx}>
                  <GlassCard sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(99, 102, 241, 0.08)',
                        border: '1px solid rgba(99, 102, 241, 0.15)',
                        mb: 0.5}}
                    >
                      <Typography variant="h6" fontWeight={800} sx={{ color: 'primary.main', fontSize: '1rem' }}>
                        {step.num}
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#F8FAFC' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {step.desc}
                    </Typography>
                  </GlassCard>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Benefits Section */}
        <Box id="benefits" sx={{ py: 10, borderTop: '1px solid rgba(255, 255, 255, 0.05)', bgcolor: 'rgba(18, 19, 26, 0.4)' }}>
          <Container maxWidth="md">
            <Typography variant="h3" fontWeight={800} align="center" gutterBottom sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Why Choose AI Guidance?
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 6 }}>
              Key benefits that make our guidance solution distinct from traditional advisor methods.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
              <Box sx={{ flex: '1 1 100%', minWidth: 0 }}>
                <GlassCard sx={{ p: 4 }}>
                  <List>
                    {benefits.map((benefit, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <CheckIcon sx={{ color: 'secondary.main' }} />
                        </ListItemIcon>
                        <ListItemText primary={benefit} primaryTypographyProps={{ fontWeight: 500 }} />
                      </ListItem>
                    ))}
                  </List>
                </GlassCard>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* FAQ Section */}
        <Box id="faq" sx={{ py: 10, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <Container maxWidth="md">
            <Typography variant="h3" fontWeight={800} align="center" gutterBottom sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Frequently Asked Questions
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 6 }}>
              Find quick answers to common questions about our platform and models.
            </Typography>

            <Box>
              {faqs.map((faq, idx) => (
                <Accordion
                  key={idx}
                  sx={{
                    bgcolor: '#12131A',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: '8px !important',
                    mb: 2,
                    boxShadow: 'none',
                    '&::before': { display: 'none' }}}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {faq.q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <Typography variant="body2" color="text.secondary">
                      {faq.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ py: 6, borderTop: '1px solid rgba(255, 255, 255, 0.05)', bgcolor: '#090A0F' }}>
          <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <AIIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={800} sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.05em' }}>
                AI GUIDANCE
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} AI Guidance System. All rights reserved. Made for Final Year Project.
            </Typography>
            <Box display="flex" gap={2}>
              <Button size="small" sx={{ color: 'text.secondary' }}>Privacy Policy</Button>
              <Button size="small" sx={{ color: 'text.secondary' }}>Terms of Service</Button>
            </Box>
          </Container>
        </Box>

      </Box>
    </RouteTransition>
  );
};

export default LandingPage;
