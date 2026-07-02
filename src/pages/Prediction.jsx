import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,LinearProgress,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  Avatar} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  Analytics as AnalyticsIcon,
  CloudDownload as DownloadIcon,
  CheckCircle as CheckedIcon,
  PlayArrow as PlayIcon} from '@mui/icons-material';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid, PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip} from 'recharts';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';

const Prediction = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'career'; // 'stream', 'course', 'career'

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [predicted, setPredicted] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const loadingMessages = [
    'Initializing Neural Weights...',
    'Parsing student academic record database...',
    'Comparing skills index to 50,000+ graduates profile...',
    'Running XGBoost Random Forest classifiers...',
    'Constructing career timeline roadmap...',
    'Finalizing predictions output...',
  ];

  // Auto trigger steps when loading is true
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= loadingMessages.length - 1) {
            clearInterval(interval);
            setLoading(false);
            setPredicted(true);
            
            // Save prediction to localStorage
            let predictionName = 'Machine Learning Engineer';
            if (mode === 'stream') {
              predictionName = 'Science Elective (PCM with Computer Science)';
            } else if (mode === 'course') {
              predictionName = 'B.Tech in Computer Science & Engineering (AI/ML)';
            }
            localStorage.setItem('guidance_user_prediction', predictionName);
            
            return 0;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [loading, mode]);

  const handlePredict = () => {
    setPredicted(false);
    setLoadingStep(0);
    setLoading(true);
  };

  const handleDownload = () => {
    setToastOpen(true);
  };

  // Mode Specific Data
  const getModeData = () => {
    switch (mode) {
      case 'stream':
        return {
          title: 'Class 10 Stream Suggestion',
          subtitle: 'Suggests the ideal subject stream for post-10th grade',
          predictionName: 'Science Elective (PCM with Computer Science)',
          confidence: '95%',
          desc: 'Based on high marks in Mathematics (92%) and Computer Science (95%), combined with cognitive interest in AI and Robotics.',
          alternatives: [
            { name: 'Science with Biology (PCB)', value: 68, color: '#6366F1' },
            { name: 'Commerce with Applied Math', value: 55, color: '#10B981' },
            { name: 'Arts with Humanities', value: 34, color: '#818CF8' },
          ],
          radar: [
            { subject: 'Logical Math', value: 92, fullMark: 100 },
            { subject: 'Science Aptitude', value: 85, fullMark: 100 },
            { subject: 'Languages', value: 78, fullMark: 100 },
            { subject: 'Creativity', value: 80, fullMark: 100 },
            { subject: 'Analytical', value: 88, fullMark: 100 },
          ]
        };
      case 'course':
        return {
          title: 'Undergraduate Course Recommendation',
          subtitle: 'Suggests suitable Bachelors courses after Class 12th',
          predictionName: 'B.Tech in Computer Science & Engineering (AI/ML)',
          confidence: '91%',
          desc: 'Recommended based on mathematical analytical scores (92%), programming proficiency (Python 85%), and self-stated interest in AI/Machine Learning.',
          alternatives: [
            { name: 'B.Tech in Information Technology', value: 85, color: '#6366F1' },
            { name: 'B.Sc in Data Science', value: 78, color: '#10B981' },
            { name: 'B.Tech in Electronics & Comm.', value: 60, color: '#818CF8' },
          ],
          radar: [
            { subject: 'Math & Stats', value: 92, fullMark: 100 },
            { subject: 'Computer Fundamentals', value: 88, fullMark: 100 },
            { subject: 'Physics Core', value: 85, fullMark: 100 },
            { subject: 'Logical Deductions', value: 90, fullMark: 100 },
            { subject: 'Communication', value: 80, fullMark: 100 },
          ]
        };
      case 'career':
      default:
        return {
          title: 'Post-College Career Path Prediction',
          subtitle: 'Forecasts target industry jobs for undergraduate students',
          predictionName: 'Machine Learning Engineer',
          confidence: '94%',
          desc: 'Identified as the highest-matching career. Backed by solid data structures foundations, top-percentile problem solving skills (92%), and multiple completed AI projects.',
          alternatives: [
            { name: 'Data Scientist', value: 88, color: '#6366F1' },
            { name: 'Full Stack Engineer', value: 75, color: '#10B981' },
            { name: 'DevOps Cloud Engineer', value: 64, color: '#818CF8' },
          ],
          radar: [
            { subject: 'Algorithms & Python', value: 85, fullMark: 100 },
            { subject: 'Applied Math', value: 92, fullMark: 100 },
            { subject: 'Soft Skills', value: 80, fullMark: 100 },
            { subject: 'Databases (SQL)', value: 75, fullMark: 100 },
            { subject: 'Software Architecture', value: 70, fullMark: 100 },
          ]
        };
    }
  };

  const currentData = getModeData();

  return (
    <RouteTransition>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Outfit", sans-serif' }}>
            {currentData.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentData.subtitle}
          </Typography>
        </Box>
      </Box>

      {/* Main Prediction Actions Card */}
      {!loading && !predicted && (
        <GlassCard sx={{ p: 5, textAlign: 'center', mb: 4, py: 8 }}>
          <Box sx={{ mb: 3 }} display="flex" justifyContent="center">
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(99, 102, 241, 0.08)', 
                color: '#6366F1', 
                width: 80, 
                height: 80, 
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}
            >
              <AIIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </Box>
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Ready for AI Guidance Prediction
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 550, mx: 'auto', mb: 4 }}>
            Click the button below to feed your grades, skill inventory, and personal interests choices to our classification neural pipelines.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handlePredict}
            startIcon={<PlayIcon />}
            sx={{ px: 5, py: 1.75, fontWeight: 700 }}
          >
            Run AI Prediction
          </Button>
        </GlassCard>
      )}

      {/* Loading Screen */}
      {loading && (
        <GlassCard sx={{ p: 5, mb: 4, py: 6 }}>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={3}>
            <CircularProgress color="primary" size={60} />
            <Typography variant="h5" fontWeight={700}>
              AI Classification Engine Running
            </Typography>
            <Box width="100%" maxWidth={450}>
              <LinearProgress color="primary" sx={{ height: 6, borderRadius: 3, mb: 3 }} />
              
              {/* Stepper Status Logs */}
              <List sx={{ bgcolor: 'rgba(255,255,255,0.01)', borderRadius: 3, p: 2, border: '1px solid rgba(255,255,255,0.04)' }}>
                {loadingMessages.map((msg, index) => {
                  const isDone = index < loadingStep;
                  const isCurrent = index === loadingStep;
                  return (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {isDone ? (
                          <CheckedIcon sx={{ color: '#10B981', fontSize: 18 }} />
                        ) : isCurrent ? (
                          <CircularProgress size={14} color="primary" />
                        ) : (
                          <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.2)' }} />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={msg} 
                        primaryTypographyProps={{ 
                          fontSize: '0.85rem',
                          color: isDone ? 'text.secondary' : isCurrent ? 'primary.main' : 'text.disabled',
                          fontWeight: isCurrent ? 700 : 500}} 
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Box>
        </GlassCard>
      )}

      {/* Prediction Output Results */}
      {predicted && !loading && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          
          {/* Main Forecast Metrics Card */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(58.333% - 16px)' }, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <GlassCard sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="caption" color="secondary.main" fontWeight={800} letterSpacing="0.05em">
                    AI OPTIMAL PATH
                  </Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Outfit", sans-serif', my: 0.5 }}>
                    {currentData.predictionName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Primary Forecasted Trajectory
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: 'rgba(6, 182, 212, 0.1)', 
                    border: '1px solid rgba(6, 182, 212, 0.25)', 
                    borderRadius: 3, 
                    px: 3, 
                    py: 1.5, 
                    textAlign: 'center' 
                  }}
                >
                  <Typography variant="h4" fontWeight={900} color="secondary.main">
                    {currentData.confidence}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={650}>
                    Confidence
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3, opacity: 0.08 }} />

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 4 }}>
                {currentData.desc}
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={2}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => handlePredict()}
                  startIcon={<PlayIcon />}
                >
                  Re-evaluate AI
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  sx={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  Download Report
                </Button>
              </Box>
            </GlassCard>

            {/* Alternative Predictions List */}
            <GlassCard sx={{ p: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Alternative Path Probabilities</Typography>
                <Typography variant="caption" color="text.secondary">Alternate suitable avenues ranked by confidence weight</Typography>
              </Box>
              
              <Box sx={{ height: 200, py: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={currentData.alternatives} 
                    margin={{ top: 10, right: 20, left: 30, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 9 }} />
                    <YAxis type="category" dataKey="name" stroke="#94A3B8" tick={{ fontSize: 9 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0F172A', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(255, 255, 255, 0.15)' 
                      }} 
                    />
                    <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]}>
                      {currentData.alternatives.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </GlassCard>
          </Box>

          {/* Capability Radar Matching Chart */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(41.667% - 16px)' }, minWidth: 0 }}>
            <GlassCard sx={{ height: '100%', p: 4, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 3 }} display="flex" alignItems="center" gap={1}>
                <AnalyticsIcon sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>Aptitude Matching Matrix</Typography>
                  <Typography variant="caption" color="text.secondary">Student scores vs optimal sector benchmark</Typography>
                </Box>
              </Box>

              <Box sx={{ height: 320, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={currentData.radar}>
                    <PolarGrid stroke="rgba(255,255,255,0.04)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 8 }} />
                    <Radar
                      name="Student Capabilities"
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

        </Box>
      )}

      {/* PDF Simulation Download Toast */}
      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={() => setToastOpen(false)}>
        <Alert onClose={() => setToastOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Guidance Forecast Report generated. PDF download started!
        </Alert>
      </Snackbar>
    </RouteTransition>
  );
};

export default Prediction;
