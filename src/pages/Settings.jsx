import React, { useState } from 'react';
import {
  Box,
  Typography,TextField,
  Button,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Divider} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  NotificationsActive as NotificationIcon} from '@mui/icons-material';
import RouteTransition from '../components/RouteTransition';
import GlassCard from '../components/GlassCard';

const Settings = () => {
  const [toastOpen, setToastOpen] = useState(false);
  const [settings, setSettings] = useState({
    emailNoti: true,
    predictNoti: true,
    twoFactor: false,
    apiKey: ''});

  const handleSave = () => {
    setToastOpen(true);
  };

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
            System Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure system parameters, notifications preferences and API configurations.
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" onClick={handleSave} sx={{ fontWeight: 700 }}>
          Save Settings
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        
        {/* Notification Preferences */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
          <GlassCard sx={{ height: '100%' }}>
            <Box sx={{ p: 3, mb: 3 }} borderBottom="1px solid rgba(255,255,255,0.05)" display="flex" alignItems="center" gap={1}>
              <NotificationIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={700}>Notification Setup</Typography>
            </Box>
            <Box sx={{ p: 3 }} display="flex" flexDirection="column" gap={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNoti}
                    onChange={(e) => setSettings({ ...settings, emailNoti: e.target.checked })}
                    color="secondary"
                  />
                }
                label={<Typography variant="body2" fontWeight={600}>Email recommendations notifications</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.predictNoti}
                    onChange={(e) => setSettings({ ...settings, predictNoti: e.target.checked })}
                    color="secondary"
                  />
                }
                label={<Typography variant="body2" fontWeight={600}>Push notifications when model is retrained</Typography>}
              />
            </Box>
          </GlassCard>
        </Box>

        {/* Security & API keys */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' }, minWidth: 0 }}>
          <GlassCard sx={{ height: '100%' }}>
            <Box sx={{ p: 3, mb: 3 }} borderBottom="1px solid rgba(255,255,255,0.05)" display="flex" alignItems="center" gap={1}>
              <SecurityIcon sx={{ color: 'secondary.main' }} />
              <Typography variant="h6" fontWeight={700}>Security & Integration Keys</Typography>
            </Box>
            <Box sx={{ p: 3 }} display="flex" flexDirection="column" gap={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactor}
                    onChange={(e) => setSettings({ ...settings, twoFactor: e.target.checked })}
                    color="primary"
                  />
                }
                label={<Typography variant="body2" fontWeight={600}>Enable two-factor authentication (JWT)</Typography>}
              />
              <Divider sx={{ opacity: 0.05 }} />
              <TextField
                fullWidth
                label="Mock Guidance API Key"
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                type="password"
              />
            </Box>
          </GlassCard>
        </Box>

      </Box>

      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={() => setToastOpen(false)}>
        <Alert onClose={() => setToastOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Settings successfully updated.
        </Alert>
      </Snackbar>
    </RouteTransition>
  );
};

export default Settings;
