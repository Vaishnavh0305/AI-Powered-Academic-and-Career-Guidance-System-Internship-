import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1', // Premium Indigo
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#10B981', // Professional Emerald Green
      light: '#34D399',
      dark: '#059669',
      contrastText: '#090A0F',
    },
    background: {
      default: '#090A0F', // Obsidian
      paper: '#12131A',   // Premium Slate Surface
      glass: 'rgba(18, 19, 26, 0.7)',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      disabled: '#64748B',
    },
    divider: 'rgba(255, 255, 255, 0.06)',
    action: {
      active: '#6366F1',
      hover: 'rgba(99, 102, 241, 0.05)',
      selected: 'rgba(99, 102, 241, 0.1)',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.08) transparent',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            },
          },
        },
        body: {
          backgroundColor: '#090A0F',
          color: '#F8FAFC',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.08) transparent',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#12131A',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          borderRadius: 12,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: 'rgba(99, 102, 241, 0.25)',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.06)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 18px',
          transition: 'all 0.15s ease-in-out',
        },
        containedPrimary: {
          background: '#6366F1',
          boxShadow: 'none',
          '&:hover': {
            background: '#4F46E5',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          background: '#10B981',
          boxShadow: 'none',
          '&:hover': {
            background: '#059669',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          background: 'transparent',
          '&:hover': {
            borderColor: '#6366F1',
            background: 'rgba(99, 102, 241, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            transition: 'all 0.15s ease-in-out',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.15)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366F1',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          '&.MuiChip-clickable:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
  },
});

export default theme;
