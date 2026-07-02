import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Divider,
  Container,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import RouteTransition from '../components/RouteTransition';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('guidance_user_profile') || '{}');
    const updated = {
      ...existing,
      email: email || 'student@antigravity.edu',
      name: existing.name || (email ? email.split('@')[0] : 'Jane Doe'),
      isAdmin: (email && email.toLowerCase().includes('admin')) ? true : false
    };
    localStorage.setItem('guidance_user_profile', JSON.stringify(updated));
    navigate('/dashboard');
  };

  const handleGoogleLogin = (isAdminUser) => {
    const email = isAdminUser ? 'admin@antigravity.edu' : 'student@antigravity.edu';
    const name = isAdminUser ? 'Admin Portal Manager' : 'Jane Doe';
    const existing = JSON.parse(localStorage.getItem('guidance_user_profile') || '{}');
    const updated = {
      ...existing,
      email: email,
      name: name,
      isAdmin: isAdminUser
    };
    localStorage.setItem('guidance_user_profile', JSON.stringify(updated));
    navigate('/dashboard');
  };

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
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Sign in to resume your AI academic & career analytics.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
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

              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" sx={{ color: 'rgba(255,255,255,0.3)' }} />}
                  label={<Typography variant="body2" color="text.secondary">Remember me</Typography>}
                />
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  color="secondary.main"
                  onClick={() => alert('Demo Reset: Try logging in with current credentials.')}
                  sx={{ textDecoration: 'none', fontWeight: 600 }}
                >
                  Forgot Password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ py: 1.5, mb: 3 }}
              >
                Sign In
              </Button>

              <Divider sx={{ mb: 3, opacity: 0.1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleGoogleLogin(false)}
                size="large"
                sx={{
                  py: 1.5,
                  mb: 2,
                  color: 'text.primary',
                  borderColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.25)',
                    background: 'rgba(255,255,255,0.03)',
                  },
                }}
              >
                Continue with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={<GoogleIcon />}
                onClick={() => handleGoogleLogin(true)}
                size="large"
                sx={{
                  py: 1.5,
                  mb: 3,
                  color: 'secondary.main',
                  borderColor: 'rgba(16, 185, 129, 0.2)',
                  '&:hover': {
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    background: 'rgba(16, 185, 129, 0.05)',
                  },
                }}
              >
                Sign In as Admin with Google
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
                color="secondary.main"
                sx={{ textDecoration: 'none', fontWeight: 700 }}
              >
                Register Now
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </RouteTransition>
  );
};

export default Login;
