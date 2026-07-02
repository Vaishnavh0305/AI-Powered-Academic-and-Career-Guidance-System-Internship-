import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  LinearProgress,
  Chip} from '@mui/material';
import {
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  PlayArrow as TrainIcon,
  Analytics as AnalyticsIcon,
  People as StudentIcon,
  School as CourseIcon,
  TrendingUp as CareerIcon,
  ModelTraining as ModelIcon} from '@mui/icons-material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend} from 'recharts';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Model training simulator states
  const [isTraining, setIsTraining] = useState(false);
  const [trainStep, setTrainStep] = useState(0);
  const [datasetUploaded, setDatasetUploaded] = useState(false);

  const trainingLogs = [
    'Importing MongoDB dataset exports...',
    'Cleaning outliers and normalizing CGPA distributions...',
    'Encoding categorical interest chips variables...',
    'Splitting datasets (80% Train, 20% Validation test)...',
    'Training Ensemble Random Forest & XGBoost classifiers...',
    'Evaluating validation score (Accuracy: 95.82%, Precision: 94.61%)...',
    'Saving updated weights to server directory...',
    'AI Model updated & deployed successfully!',
  ];

  useEffect(() => {
    let timer;
    if (isTraining) {
      timer = setInterval(() => {
        setTrainStep((prev) => {
          if (prev >= trainingLogs.length - 1) {
            clearInterval(timer);
            setIsTraining(false);
            setToastMessage('XGBoost Classification Models retrained successfully!');
            setToastOpen(true);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTraining]);

  // Mock Students
  const [students, setStudents] = useState([
    { id: 1, name: 'Jane Doe', email: 'student@guidance.edu', cgpa: '8.9', prediction: 'ML Engineer' },
    { id: 2, name: 'Rahul Sharma', email: 'rahul@sharma.in', cgpa: '9.2', prediction: 'Full Stack Dev' },
    { id: 3, name: 'Emily Watson', email: 'emily.w@google.com', cgpa: '8.5', prediction: 'Cybersecurity' },
    { id: 4, name: 'Li Wei', email: 'li.wei@edu.cn', cgpa: '7.8', prediction: 'DevOps Engineer' },
  ]);

  // Mock Courses
  const [courses, setCourses] = useState([
    { id: 1, name: 'Machine Learning Specialization', provider: 'Stanford via Coursera', status: 'Active' },
    { id: 2, name: 'AWS Cloud Architect Bootcamp', provider: 'Amazon Web Services', status: 'Active' },
    { id: 3, name: 'Full Stack Developer Career Path', provider: 'Scrimba', status: 'Draft' },
  ]);

  // Mock Careers
  const [careers, setCareers] = useState([
    { id: 1, name: 'Machine Learning Engineer', salary: '$125k Avg', demand: 'Very High' },
    { id: 2, name: 'Full Stack Web Developer', salary: '$95k Avg', demand: 'High' },
    { id: 3, name: 'Cybersecurity Analyst', salary: '$105k Avg', demand: 'High' },
  ]);

  // Charts Mock Data
  const statData = [
    { name: 'Stream post-10th', count: 1200 },
    { name: 'UG Course post-12th', count: 2500 },
    { name: 'Career path forecast', count: 4800 },
  ];

  const accuracyData = [
    { name: 'Stream Model', accuracy: 96 },
    { name: 'Course Model', accuracy: 92 },
    { name: 'Career Model', accuracy: 95 },
  ];

  const handleRemoveStudent = (id) => {
    setStudents(students.filter((std) => std.id !== id));
    setToastMessage('Student record removed.');
    setToastOpen(true);
  };

  const handleUpload = () => {
    setDatasetUploaded(true);
    setToastMessage('Student dataset (CSV) uploaded successfully.');
    setToastOpen(true);
  };

  const handleTrain = () => {
    if (!datasetUploaded) {
      alert('Please upload a fresh dataset (.csv) before retraining.');
      return;
    }
    setTrainStep(0);
    setIsTraining(true);
  };

  return (
    <RouteTransition>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Outfit", sans-serif' }}>
          Admin Control Center
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage guidance assets databases, upload student records datasets, and retrain neural classifiers.
        </Typography>
      </Box>

      {/* Admin Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, val) => setActiveTab(val)}
        textColor="secondary"
        indicatorColor="secondary"
        sx={{
          mb: 4,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          '& .MuiTab-root': { fontWeight: 700, fontSize: '0.95rem' }}}
      >
        <Tab icon={<StudentIcon />} iconPosition="start" label="Manage Students" />
        <Tab icon={<CourseIcon />} iconPosition="start" label="Manage Courses" />
        <Tab icon={<CareerIcon />} iconPosition="start" label="Career Domains" />
        <Tab icon={<ModelIcon />} iconPosition="start" label="Model Control & Train" />
        <Tab icon={<AnalyticsIcon />} iconPosition="start" label="Analytics" />
      </Tabs>

      {/* Tab 0: Students Table */}
      {activeTab === 0 && (
        <GlassCard>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.01)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>CGPA</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Active Prediction</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((std) => (
                  <TableRow key={std.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' } }}>
                    <TableCell sx={{ fontWeight: 600 }}>{std.name}</TableCell>
                    <TableCell>{std.email}</TableCell>
                    <TableCell>{std.cgpa}</TableCell>
                    <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>{std.prediction}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleRemoveStudent(std.id)}>
                        <DeleteIcon sx={{ color: 'error.light' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassCard>
      )}

      {/* Tab 1: Courses Table */}
      {activeTab === 1 && (
        <GlassCard>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.01)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Course Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Provider</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{course.name}</TableCell>
                    <TableCell>{course.provider}</TableCell>
                    <TableCell>
                      <Chip 
                        label={course.status} 
                        size="small" 
                        color={course.status === 'Active' ? 'success' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassCard>
      )}

      {/* Tab 2: Career Domains */}
      {activeTab === 2 && (
        <GlassCard>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.01)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Career Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Salary Expectation</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Market Demand</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {careers.map((career) => (
                  <TableRow key={career.id}>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{career.name}</TableCell>
                    <TableCell>{career.salary}</TableCell>
                    <TableCell>
                      <Chip label={career.demand} size="small" color="secondary" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassCard>
      )}

      {/* Tab 3: Model Control & Train */}
      {activeTab === 3 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
            <GlassCard sx={{ p: 4, height: '100%' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Upload Training Records
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload historical students datasets containing grades, branch records, selected careers, and validation tags (.csv).
              </Typography>
              
              <Box
                sx={{
                  border: '2px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: 3,
                  py: 6,
                  textAlign: 'center',
                  bgcolor: 'rgba(255,255,255,0.01)',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#6366F1',
                    bgcolor: 'rgba(99, 102, 241, 0.02)'}
                }}
                onClick={handleUpload}
              >
                <UploadIcon sx={{ fontSize: 44, color: 'text.secondary', mb: 1.5 }} />
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Drag and drop CSV files here
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  Maximum file size: 50MB (Supports CSV files only)
                </Typography>
              </Box>

              {datasetUploaded && (
                <Typography variant="caption" color="success.main" fontWeight={700} display="block" sx={{ mt: 2 }}>
                  ✓ dataset_validation_v2.csv (14.2 MB) successfully loaded. Ready to compile model.
                </Typography>
              )}
            </GlassCard>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
            <GlassCard sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Train Guidance Classifier Model
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Compile XGBoost tree regressors on raw datasets. Builds streams, courses, and jobs weights.
              </Typography>

              <Button
                variant="contained"
                color="secondary"
                disabled={isTraining || !datasetUploaded}
                onClick={handleTrain}
                startIcon={<TrainIcon />}
                sx={{ py: 1.5, mb: 3 }}
              >
                {isTraining ? 'Training AI Classifiers...' : 'Start Training Classifier'}
              </Button>

              {isTraining && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                    Training process: {Math.round(((trainStep + 1) / trainingLogs.length) * 100)}%
                  </Typography>
                  <LinearProgress variant="determinate" value={((trainStep + 1) / trainingLogs.length) * 100} color="secondary" />
                </Box>
              )}

              {/* Console Logs */}
              <Box
                sx={{
                  bgcolor: '#060A13',
                  borderRadius: 3,
                  p: 2,
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: '#10B981',
                  flexGrow: 1,
                  maxHeight: 180,
                  overflowY: 'auto',
                  border: '1px solid rgba(255,255,255,0.06)'}}
              >
                {isTraining || trainStep > 0 ? (
                  trainingLogs.slice(0, trainStep + 1).map((log, idx) => (
                    <div key={idx}>&gt; {log}</div>
                  ))
                ) : (
                  <div style={{ color: '#64748B' }}>&gt; Console idle. Awaiting dataset and compilation triggers...</div>
                )}
              </Box>
            </GlassCard>
          </Box>
        </Box>
      )}

      {/* Tab 4: Analytics */}
      {activeTab === 4 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Prediction Counts Chart */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
            <GlassCard sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Prediction Statistics</Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Number of guidance requests resolved since launch
              </Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#94A3B8" tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0F172A', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(255, 255, 255, 0.15)' 
                      }} 
                    />
                    <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </GlassCard>
          </Box>

          {/* Model Accuracy Chart */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
            <GlassCard sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>AI Validation Accuracy (%)</Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Model accuracy validated against historical test sets
              </Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={accuracyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                    <YAxis domain={[80, 100]} stroke="#94A3B8" tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0F172A', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(255, 255, 255, 0.15)' 
                      }} 
                    />
                    <Bar dataKey="accuracy" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </GlassCard>
          </Box>
        </Box>
      )}

      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={() => setToastOpen(false)}>
        <Alert onClose={() => setToastOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </RouteTransition>
  );
};

export default AdminDashboard;
