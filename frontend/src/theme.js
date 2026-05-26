import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: '#6366f1', light: '#818cf8', dark: '#4f46e5', contrastText: '#fff' },
    secondary: { main: '#a855f7', light: '#c084fc', dark: '#9333ea', contrastText: '#fff' },
    success:   { main: '#10b981', light: '#34d399', dark: '#059669' },
    warning:   { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
    error:     { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
    info:      { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb' },
    background: { default: '#f8f7ff', paper: '#ffffff' },
    text: { primary: '#0f0a2e', secondary: '#6b7280' },
    divider: '#ede9fe',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: { fontWeight: 900, letterSpacing: '-2px' },
    h2: { fontWeight: 800, letterSpacing: '-1px' },
    h3: { fontWeight: 800, letterSpacing: '-0.5px' },
    h4: { fontWeight: 800, letterSpacing: '-0.5px' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 500 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: '-0.01em' },
  },
  shape: { borderRadius: 14 },
  shadows: [
    'none',
    '0 1px 3px rgba(99,102,241,0.06)',
    '0 2px 8px rgba(99,102,241,0.08)',
    '0 4px 16px rgba(99,102,241,0.1)',
    '0 8px 24px rgba(99,102,241,0.12)',
    '0 12px 32px rgba(99,102,241,0.14)',
    '0 20px 48px rgba(99,102,241,0.18)',
    '0 24px 64px rgba(99,102,241,0.2)',
    ...Array(17).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#f8f7ff' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '9px 22px',
          fontSize: '0.875rem',
          fontWeight: 700,
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          '&:hover': { boxShadow: 'none', transform: 'translateY(-2px)' },
          '&:active': { transform: 'translateY(0px)' },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
            boxShadow: '0 8px 24px rgba(99,102,241,0.45) !important',
          },
        },
        containedSuccess: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          '&:hover': { boxShadow: '0 8px 24px rgba(16,185,129,0.4) !important' },
        },
        containedError: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          '&:hover': { boxShadow: '0 8px 24px rgba(239,68,68,0.4) !important' },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': { borderWidth: '1.5px', backgroundColor: 'rgba(99,102,241,0.04)' },
        },
        sizeLarge: { padding: '13px 32px', fontSize: '1rem', borderRadius: 14 },
        sizeSmall: { padding: '6px 14px', fontSize: '0.8rem', borderRadius: 10 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
          transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          '&:hover': {
            boxShadow: '0 16px 48px rgba(99,102,241,0.18)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(237,233,254,0.8)',
          boxShadow: '0 2px 16px rgba(99,102,241,0.06)',
        },
        elevation0: { boxShadow: 'none', border: '1px solid #ede9fe' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#faf9ff',
            transition: 'all 0.2s ease',
            '& fieldset': { borderColor: '#ede9fe', borderWidth: '1.5px' },
            '&:hover fieldset': { borderColor: '#a78bfa' },
            '&.Mui-focused': {
              backgroundColor: '#fff',
              '& fieldset': { borderColor: '#6366f1', borderWidth: '2px' },
            },
            '&.Mui-focused .MuiInputAdornment-root svg': { color: '#6366f1' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 700,
          fontSize: '0.72rem',
          letterSpacing: '0.01em',
          transition: 'all 0.15s ease',
        },
        filled: {
          '&:hover': { filter: 'brightness(0.95)' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(40px)',
          boxShadow: '0 32px 80px rgba(99,102,241,0.25)',
          border: '1px solid rgba(237,233,254,0.8)',
        },
        backdrop: {
          backgroundColor: 'rgba(15,10,46,0.5)',
          backdropFilter: 'blur(4px)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 700,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#9ca3af',
            backgroundColor: '#faf9ff',
            borderBottom: '1px solid #ede9fe',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
          '&:hover': { backgroundColor: '#faf9ff' },
          '& .MuiTableCell-root': { borderBottom: '1px solid #f5f3ff' },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: { borderRadius: 16, border: '1px solid #ede9fe' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 8, height: 8, backgroundColor: '#ede9fe' },
        bar: { borderRadius: 8 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          textTransform: 'none',
          fontSize: '0.875rem',
          letterSpacing: '-0.01em',
          color: '#9ca3af',
          '&.Mui-selected': { color: '#6366f1' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #6366f1, #a855f7)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12, fontWeight: 500 },
        standardError: { backgroundColor: '#fef2f2', border: '1px solid #fecaca' },
        standardSuccess: { backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 800,
          fontSize: '0.85rem',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#ede9fe' },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 16px 48px rgba(99,102,241,0.2)',
          border: '1px solid #ede9fe',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          mx: 0.5,
          fontSize: '0.875rem',
          fontWeight: 500,
          '&:hover': { backgroundColor: '#f5f3ff' },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#0f0a2e',
          borderRadius: 8,
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '6px 12px',
        },
        arrow: { color: '#0f0a2e' },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: { borderRadius: 12 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.2s ease',
          '&:hover': { backgroundColor: '#f5f3ff', transform: 'scale(1.1)' },
        },
      },
    },
  },
});

export default theme;
