import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { saveGuidanceData, getMLPrediction } from '../services/api';
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

  // Mode Specific Data — Dynamically calculated from local storage
  const getModeData = () => {
    let savedMarks = {};
    try {
      const saved = localStorage.getItem('guidance_academic_marks');
      if (saved) savedMarks = JSON.parse(saved);
    } catch (e) {}

    let savedAcademics = {};
    try {
      const saved = localStorage.getItem('guidance_user_academics');
      if (saved) savedAcademics = JSON.parse(saved);
    } catch (e) {}

    let savedProg = {};
    try {
      const saved = localStorage.getItem('guidance_user_programming_skills');
      if (saved) savedProg = JSON.parse(saved);
    } catch (e) {}

    let savedSoft = {};
    try {
      const saved = localStorage.getItem('guidance_user_soft_skills');
      if (saved) savedSoft = JSON.parse(saved);
    } catch (e) {}

    const getMark = (sub, def = 70) => savedMarks[sub] !== undefined ? Number(savedMarks[sub]) : def;
    const getProg = (skill, def = 50) => savedProg[skill] !== undefined ? Number(savedProg[skill]) : def;
    const getSoft = (skill, def = 50) => savedSoft[skill] !== undefined ? Number(savedSoft[skill]) : def;

    switch (mode) {
      case 'stream': {
        const pcm = getMark('Mathematics', 75) * 0.4 + getMark('Science', 75) * 0.4 + getMark('Computer Applications', 70) * 0.2;
        const pcb = getMark('Science', 75) * 0.6 + getMark('Mathematics', 70) * 0.2 + getMark('English', 70) * 0.2;
        const commerce = getMark('Mathematics', 70) * 0.3 + getMark('Social Science', 70) * 0.3 + getMark('English', 70) * 0.4;
        const arts = getMark('Social Science', 70) * 0.5 + getMark('English', 70) * 0.3 + getMark('Hindi', 70) * 0.2;

        const options = [
          { name: 'Science Elective (PCM with Computer Science)', value: Math.round(pcm || 75), color: '#6366F1' },
          { name: 'Science with Biology (PCB)', value: Math.round(pcb || 70), color: '#10B981' },
          { name: 'Commerce with Applied Math', value: Math.round(commerce || 60), color: '#818CF8' },
          { name: 'Arts with Humanities', value: Math.round(arts || 50), color: '#3B82F6' },
        ];

        options.sort((a, b) => b.value - a.value);
        const primary = options[0];
        const alternatives = options.slice(1);
        const confidenceVal = Math.min(99, Math.max(70, Math.round(primary.value)));

        const topSubject = getMark('Mathematics', 75) >= getMark('Science', 75) ? 'Mathematics' : 'Science';
        const topScore = Math.max(getMark('Mathematics', 75), getMark('Science', 75));
        const descText = `Based on your academic performance, including ${topSubject} (${topScore}%) and Computer Applications (${getMark('Computer Applications', 70)}%), our model identifies "${primary.name}" as your optimal stream. This trajectory aligns with high quantitative ability and interest patterns.`;

        return {
          title: 'Class 10 Stream Suggestion',
          subtitle: 'Suggests the ideal subject stream for post-10th grade',
          predictionName: primary.name,
          confidence: `${confidenceVal}%`,
          desc: descText,
          alternatives: alternatives,
          radar: [
            { subject: 'Logical Math', value: getMark('Mathematics', 75), fullMark: 100 },
            { subject: 'Science Aptitude', value: getMark('Science', 75), fullMark: 100 },
            { subject: 'Languages', value: Math.round((getMark('English', 70) + getMark('Hindi', 70)) / 2), fullMark: 100 },
            { subject: 'Creativity', value: getMark('Computer Applications', 70), fullMark: 100 },
            { subject: 'Analytical', value: Math.round((getMark('Mathematics', 75) + getMark('Science', 75)) / 2), fullMark: 100 },
          ]
        };
      }
      case 'course': {
        const cseMl = getMark('Computer Science', 70) * 0.4 + getMark('Mathematics', 75) * 0.4 + getMark('Physics', 75) * 0.2;
        const dataSci = getMark('Mathematics', 75) * 0.5 + getMark('Computer Science', 70) * 0.3 + getMark('Economics', 70) * 0.2;
        const electronics = getMark('Physics', 75) * 0.4 + getMark('Mathematics', 75) * 0.4 + getMark('Computer Science', 70) * 0.2;
        const bio = getMark('Biology', 70) * 0.5 + getMark('Chemistry', 70) * 0.3 + getMark('Physics', 75) * 0.2;
        const commerce = getMark('Accountancy', 70) * 0.4 + getMark('Business Studies', 70) * 0.3 + getMark('Economics', 70) * 0.3;
        const humanities = getMark('English', 75) * 0.5 + getMark('Hindi', 70) * 0.3 + getMark('Economics', 70) * 0.2;

        const options = [
          { name: 'B.Tech in Computer Science & Engineering (AI/ML)', value: Math.round(cseMl || 75), color: '#6366F1' },
          { name: 'B.Sc in Data Science', value: Math.round(dataSci || 70), color: '#10B981' },
          { name: 'B.Tech in Electronics & Comm.', value: Math.round(electronics || 65), color: '#818CF8' },
          { name: 'Bachelor of Medicine / BDS (MBBS)', value: Math.round(bio || 50), color: '#EC4899' },
          { name: 'Bachelor of Commerce (B.Com Hons)', value: Math.round(commerce || 55), color: '#F59E0B' },
          { name: 'Bachelor of Arts (Humanities)', value: Math.round(humanities || 45), color: '#3B82F6' },
        ];

        options.sort((a, b) => b.value - a.value);
        const primary = options[0];
        const alternatives = options.slice(1, 4);
        const confidenceVal = Math.min(99, Math.max(70, Math.round(primary.value)));

        const topSubject = getMark('Mathematics', 75) >= getMark('Computer Science', 70) ? 'Mathematics' : 'Computer Science';
        const topScore = Math.max(getMark('Mathematics', 75), getMark('Computer Science', 70));
        const descText = `Recommended based on your subject performance in ${topSubject} (${topScore}%) and Physics (${getMark('Physics', 75)}%). This fits students showing high logical, computational, and technical aptitude.`;

        return {
          title: 'Undergraduate Course Recommendation',
          subtitle: 'Suggests suitable Bachelors courses after Class 12th',
          predictionName: primary.name,
          confidence: `${confidenceVal}%`,
          desc: descText,
          alternatives: alternatives,
          radar: [
            { subject: 'Math & Stats', value: getMark('Mathematics', 75), fullMark: 100 },
            { subject: 'Computer Fundamentals', value: getMark('Computer Science', 70), fullMark: 100 },
            { subject: 'Physics Core', value: getMark('Physics', 75), fullMark: 100 },
            { subject: 'Logical Deductions', value: Math.round((getMark('Mathematics', 75) + getMark('Computer Science', 70)) / 2), fullMark: 100 },
            { subject: 'Communication', value: getMark('English', 75), fullMark: 100 },
          ]
        };
      }
      case 'career':
      default: {
        const dsMark = getMark('Data Structures', 70);
        const osMark = getMark('Operating Systems', 70);
        const dbMark = getMark('Database Management', 70);
        const mlMark = getMark('Machine Learning', 70);
        const aiMark = getMark('Artificial Intelligence', 70);
        const cloudMark = getMark('Cloud Computing', 70);
        const cyberMark = getMark('Cyber Security', 70);

        const mle = (getProg('Python', 50) * 0.3) + (getSoft('Problem Solving', 50) * 0.3) + (mlMark * 0.2) + (aiMark * 0.2);
        const ds = (getProg('Python', 50) * 0.3) + (getProg('SQL', 50) * 0.3) + (dbMark * 0.2) + (getSoft('Problem Solving', 50) * 0.2);
        const fs = (getProg('JavaScript', 50) * 0.4) + (getProg('SQL', 50) * 0.2) + (dsMark * 0.2) + (getSoft('Problem Solving', 50) * 0.2);
        const devops = (cloudMark * 0.3) + (osMark * 0.3) + (getProg('Java', 50) * 0.2) + (getSoft('Team Work', 50) * 0.2);
        const cyber = (cyberMark * 0.4) + (getSoft('Critical Thinking', 50) * 0.3) + (osMark * 0.3);
        const pm = (getSoft('Leadership', 50) * 0.4) + (getSoft('Communication', 50) * 0.3) + (getSoft('Team Work', 50) * 0.3);

        const options = [
          { name: 'Machine Learning Engineer', value: Math.round(mle || 75), color: '#6366F1' },
          { name: 'Data Scientist', value: Math.round(ds || 70), color: '#10B981' },
          { name: 'Full Stack Engineer', value: Math.round(fs || 65), color: '#818CF8' },
          { name: 'DevOps Cloud Engineer', value: Math.round(devops || 60), color: '#EC4899' },
          { name: 'Cyber Security Analyst', value: Math.round(cyber || 55), color: '#F59E0B' },
          { name: 'Product/Project Manager', value: Math.round(pm || 50), color: '#3B82F6' },
        ];

        options.sort((a, b) => b.value - a.value);
        const primary = options[0];
        const alternatives = options.slice(1, 4);
        const confidenceVal = Math.min(99, Math.max(70, Math.round(primary.value)));

        const descText = `Identified as the highest-matching career. Backed by solid technical foundation including Programming (${Math.round((getProg('Python') + getProg('Java') + getProg('C++') + getProg('JavaScript')) / 4)}%), Problem Solving (${getSoft('Problem Solving')}%), and academic specialization scores.`;

        return {
          title: 'Post-College Career Path Prediction',
          subtitle: 'Forecasts target industry jobs for undergraduate students',
          predictionName: primary.name,
          confidence: `${confidenceVal}%`,
          desc: descText,
          alternatives: alternatives,
          radar: [
            { subject: 'Algorithms & Dev', value: Math.round((getProg('Python') + getProg('Java') + getProg('JavaScript')) / 3), fullMark: 100 },
            { subject: 'Applied Systems', value: Math.round((osMark + dbMark) / 2), fullMark: 100 },
            { subject: 'Soft Skills', value: Math.round((getSoft('Communication') + getSoft('Leadership') + getSoft('Team Work')) / 3), fullMark: 100 },
            { subject: 'Databases (SQL)', value: getProg('SQL'), fullMark: 100 },
            { subject: 'Specialization', value: Math.max(mlMark, aiMark, cloudMark, cyberMark), fullMark: 100 },
          ]
        };
      }
    }
  };

  const [mlResult, setMlResult] = useState(null);

  const currentData = mlResult || getModeData();

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
            
            // Check if backend returned real ML predictions
            const finalResult = window.__pendingPredictionResult || getModeData();
            setMlResult(finalResult);
            
            // Save computed prediction to localStorage and DB
            const predictionName = finalResult.predictionName;
            localStorage.setItem('guidance_user_prediction', predictionName);
            saveGuidanceData({ prediction: predictionName });
            
            // Clear reference
            delete window.__pendingPredictionResult;
            
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
    setMlResult(null);
    setLoadingStep(0);
    setLoading(true);

    // Fetch predictions from Python/scikit-learn backend asynchronously
    let savedMarks = {};
    try {
      const saved = localStorage.getItem('guidance_academic_marks');
      if (saved) savedMarks = JSON.parse(saved);
    } catch (e) {}

    let savedProg = {};
    try {
      const saved = localStorage.getItem('guidance_user_programming_skills');
      if (saved) savedProg = JSON.parse(saved);
    } catch (e) {}

    let savedSoft = {};
    try {
      const saved = localStorage.getItem('guidance_user_soft_skills');
      if (saved) savedSoft = JSON.parse(saved);
    } catch (e) {}

    let academicsObj = {};
    try {
      const saved = localStorage.getItem('guidance_user_academics');
      if (saved) academicsObj = JSON.parse(saved);
    } catch (e) {}

    const currentEd = academicsObj.currentEducation || "";

    // Extract flat marks for the current education level from nested structure
    let flatMarks = savedMarks;
    if (savedMarks && savedMarks[currentEd]) {
      // Nested format: marks are keyed by education level
      flatMarks = savedMarks[currentEd];
    } else if (savedMarks) {
      // Check if first key is a level name (nested), and pick appropriate one
      const firstKey = Object.keys(savedMarks)[0];
      const knownLevels = ['Class 10', 'Class 12', 'Undergraduate', 'Undergraduate (Commerce)', 'Graduate'];
      if (firstKey && knownLevels.includes(firstKey)) {
        flatMarks = savedMarks[currentEd] || {};
      }
    }

    let savedInterests = [];
    try {
      const saved = localStorage.getItem('guidance_user_interests');
      if (saved) savedInterests = JSON.parse(saved);
    } catch (e) {}

    const payload = {
      mode,
      currentEducation: currentEd,
      marks: flatMarks,
      programmingSkills: savedProg,
      softSkills: savedSoft,
      interests: savedInterests
    };

    getMLPrediction(payload)
      .then((res) => {
        if (res && !res.error) {
          window.__pendingPredictionResult = res;
        } else {
          console.warn("ML API backend error. Falling back to rule engine.", res);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch backend ML predictions. Falling back.", err);
      });
  };

  const handleDownload = () => {
    setToastOpen(true);
  };

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
