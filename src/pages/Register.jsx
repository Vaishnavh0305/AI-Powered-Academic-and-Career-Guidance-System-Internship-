import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Container,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import RouteTransition from '../components/RouteTransition';
import { registerUser } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [educationLevel, setEducationLevel] = useState('Undergraduate');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    registerUser({ name, email, password, educationLevel })
      .then((res) => {
        if (res && res.error) {
          alert(res.error);
        } else {
          alert('Registration successful! Please sign in with your credentials.');
          navigate('/login');
        }
      })
      .catch(() => {
        alert('Registration error. Running in local fallback mode.');
        const profile = {
          email: email,
          name: name,
          isAdmin: email.toLowerCase().includes('admin')
        };
        localStorage.setItem('guidance_user_profile', JSON.stringify(profile));
        navigate('/dashboard');
      });
  };

  const eduLevels = [
    { value: 'High School (Class 10)', label: 'Class 10 Student' },
    { value: 'Higher Secondary (Class 12)', label: 'Class 12 Student' },
    { value: 'Undergraduate', label: 'College Student (Undergraduate)' },
    { value: 'Graduate', label: 'Graduate Student' },
  ];

  return (
    <RouteTransition>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 50%, #12131A 0%, #090A0F 100%)',
          px: 2,
          py: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xs" sx={{ zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: { xs: 3, sm: 5 },
              bgcolor: '#12131A',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Header Icon */}
            <Box
              onClick={() => navigate('/')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
                cursor: 'pointer',
              }}
            >
              <AIIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  background: 'linear-gradient(135deg, #FFFFFF 60%, #818CF8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                AI Guidance
              </Typography>
            </Box>

            <Typography variant="h4" component="h1" fontWeight={700} align="center" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Register to discover your ideal academic and career options.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="educationLevel"
                select
                label="Education Level"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                sx={{ mb: 2 }}
              >
                {eduLevels.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ py: 1.5, mb: 3 }}
              >
                Register
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                color="secondary.main"
                sx={{ textDecoration: 'none', fontWeight: 700 }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </RouteTransition>
  );
};

export default Register;
