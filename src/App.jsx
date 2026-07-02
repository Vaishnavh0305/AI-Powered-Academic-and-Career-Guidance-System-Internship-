import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Layout
import Layout from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AcademicDetails from './pages/AcademicDetails';
import Interests from './pages/Interests';
import SkillsAssessment from './pages/SkillsAssessment';
import Prediction from './pages/Prediction';
import Recommendations from './pages/Recommendations';
import LearningRoadmap from './pages/LearningRoadmap';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Pages (wrapped in Layout) */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/academic-details"
            element={
              <Layout>
                <AcademicDetails />
              </Layout>
            }
          />
          <Route
            path="/interests"
            element={
              <Layout>
                <Interests />
              </Layout>
            }
          />
          <Route
            path="/skills-assessment"
            element={
              <Layout>
                <SkillsAssessment />
              </Layout>
            }
          />
          <Route
            path="/prediction"
            element={
              <Layout>
                <Prediction />
              </Layout>
            }
          />
          <Route
            path="/recommendations"
            element={
              <Layout>
                <Recommendations />
              </Layout>
            }
          />
          <Route
            path="/roadmap"
            element={
              <Layout>
                <LearningRoadmap />
              </Layout>
            }
          />
          <Route
            path="/history"
            element={
              <Layout>
                <History />
              </Layout>
            }
          />
          <Route
            path="/admin"
            element={
              <Layout>
                <AdminDashboard />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <Settings />
              </Layout>
            }
          />

          {/* Catch All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
