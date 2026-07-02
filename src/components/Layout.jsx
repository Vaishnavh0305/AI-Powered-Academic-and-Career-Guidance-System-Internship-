import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  InputBase,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AutoAwesome as AIIcon,
  TrendingUp as TrendingUpIcon,
  Map as MapIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  SupervisorAccount as AdminIcon,
  WorkspacePremium as SkillsIcon,
  Extension as InterestsIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';

const sidebarWidth = 280;

const Layout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notiEl, setNotiEl] = useState(null);

  const storedProfile = JSON.parse(localStorage.getItem('guidance_user_profile') || '{}');
  const userName = storedProfile.name || 'Student';
  const userRole = storedProfile.currentEducation || 'Undergraduate Student';
  const isAdmin = storedProfile.isAdmin === true || (storedProfile.email && storedProfile.email.toLowerCase().includes('admin'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotiOpen = (event) => {
    setNotiEl(event.currentTarget);
  };

  const handleNotiClose = () => {
    setNotiEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    navigate('/');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Academic Details', icon: <SchoolIcon />, path: '/academic-details' },
    { text: 'Interests', icon: <InterestsIcon />, path: '/interests' },
    { text: 'Skills Assessment', icon: <SkillsIcon />, path: '/skills-assessment' },
    { divider: true },
    { text: 'Stream Recommend', icon: <AIIcon sx={{ color: 'primary.main' }} />, path: '/prediction?mode=stream' },
    { text: 'Course Recommend', icon: <BookIcon sx={{ color: 'primary.main' }} />, path: '/prediction?mode=course' },
    { text: 'Career Prediction', icon: <TrendingUpIcon sx={{ color: 'primary.main' }} />, path: '/prediction?mode=career' },
    { text: 'AI Recommendations', icon: <AIIcon sx={{ color: 'secondary.main' }} />, path: '/recommendations' },
    { text: 'Learning Roadmap', icon: <MapIcon />, path: '/roadmap' },
    { text: 'History Logs', icon: <HistoryIcon />, path: '/history' },
    { divider: true },
    ...(isAdmin ? [
      { text: 'Admin Console', icon: <AdminIcon />, path: '/admin' },
      { divider: true }
    ] : []),
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#090A0F' }}>
      {/* Brand Logo Header */}
      <Box 
        sx={{ 
          p: 3, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          cursor: 'pointer' 
        }}
        onClick={() => navigate('/')}
      >
        <Avatar 
          sx={{ 
            bgcolor: 'rgba(99, 102, 241, 0.1)', 
            color: '#6366F1',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}
        >
          <AIIcon />
        </Avatar>
        <Typography 
          variant="h6" 
          fontWeight={800} 
          sx={{ 
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            background: 'linear-gradient(135deg, #FFF 60%, #818CF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.05em'
          }}
        >
          AI GUIDANCE
        </Typography>
      </Box>
      <Divider sx={{ opacity: 0.05, mb: 1 }} />

      {/* Navigation List */}
      <List sx={{ px: 2, flexGrow: 1, overflowY: 'auto' }}>
        {menuItems.map((item, index) => {
          if (item.divider) {
            return <Divider key={`div-${index}`} sx={{ my: 1.5, opacity: 0.05 }} />;
          }

          const isActive = location.pathname + location.search === item.path || 
                           (item.path.includes('prediction') && location.pathname === '/prediction' && location.search === item.path.substring(item.path.indexOf('?')));

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 1.5,
                  py: 1,
                  px: 2.2, // slightly increased padding for alignment without borderLeft
                  transition: 'all 0.15s',
                  bgcolor: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  '&:hover': {
                    bgcolor: isActive ? 'rgba(99, 102, 241, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#6366F1' : 'text.secondary', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.875rem', 
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#F8FAFC' : 'text.secondary'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer / Logout */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ opacity: 0.05, mb: 2 }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1.5,
            py: 1,
            px: 2,
            color: 'error.light',
            '&:hover': {
              bgcolor: 'rgba(239, 68, 68, 0.06)',
              transform: 'translateX(2px)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'error.light', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', bgcolor: '#090A0F' }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
          ml: isMobile ? 0 : `${sidebarWidth}px`,
          background: 'rgba(9, 10, 15, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2.5, sm: 4 } }}>
          <Box display="flex" alignItems="center" gap={1}>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            {/* Notifications */}
            <IconButton onClick={handleNotiOpen} color="inherit" sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)', p: 1 }}>
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Notification Menu */}
            <Menu
              anchorEl={notiEl}
              open={Boolean(notiEl)}
              onClose={handleNotiClose}
              PaperProps={{
                sx: {
                  width: 320,
                  bgcolor: '#12131A',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  mt: 1.5,
                }
              }}
            >
              <Box sx={{ p: 2 }} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" fontWeight={700}>Notifications</Typography>
              </Box>
              <Divider sx={{ opacity: 0.05 }} />
              <Box sx={{ p: 2.5 }} textAlign="center">
                <Typography variant="body2" color="text.secondary">No new notifications</Typography>
              </Box>
            </Menu>

            {/* User Profile Info & Avatar */}
            <Tooltip title="Account Settings">
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                <Avatar 
                  alt={userName} 
                  src={storedProfile.profilePhoto || undefined}
                  sx={{ 
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    width: 36,
                    height: 36,
                    bgcolor: '#6366F1',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}
                >
                  {!storedProfile.profilePhoto && userName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Profile Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                sx: {
                  width: 220,
                  bgcolor: '#12131A',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  mt: 1.5,
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>{userName}</Typography>
                <Typography variant="caption" color="text.secondary">{userRole}</Typography>
              </Box>
              <Divider sx={{ opacity: 0.05 }} />
              <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>My Profile</MenuItem>
              <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>Settings</MenuItem>
              <Divider sx={{ opacity: 0.05 }} />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.light' }}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer for Desktop & Mobile */}
      <Box component="nav" sx={{ width: { md: sidebarWidth }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: sidebarWidth, 
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                bgcolor: '#090A0F'
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            open
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: sidebarWidth, 
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                bgcolor: '#090A0F'
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, sm: 4 },
          minWidth: 0,
          mt: '64px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)',
          overflowX: 'hidden'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
