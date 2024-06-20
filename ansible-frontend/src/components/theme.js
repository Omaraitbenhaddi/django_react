import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const sgRed = {
  50: '#ffe5e5',
  100: '#fcb8b8',
  200: '#f58a8a',
  300: '#f05c5c',
  400: '#ec3333',
  500: '#e60000',
  600: '#df0000',
  700: '#d80000',
  800: '#d10000',
  900: '#c40000',
};

export const sgBlack = {
  50: '#e8e8e8',
  100: '#c5c5c5',
  200: '#9f9f9f',
  300: '#797979',
  400: '#5b5b5b',
  500: '#3c3c3c',
  600: '#363636',
  700: '#2e2e2e',
  800: '#262626',
  900: '#181818',
};

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      light: sgRed[300],
      main: sgRed[500],
      dark: sgRed[700],
      contrastText: sgBlack[50],
      ...(mode === 'dark' && {
        contrastText: sgRed[100],
        light: sgRed[300],
        main: sgRed[400],
        dark: sgRed[800],
      }),
    },
    secondary: {
      light: sgBlack[300],
      main: sgBlack[500],
      dark: sgBlack[700],
      ...(mode === 'dark' && {
        light: sgBlack[400],
        main: sgBlack[500],
        dark: sgBlack[900],
      }),
    },
    warning: {
      main: '#F7B538',
      dark: '#F79F00',
      ...(mode === 'dark' && { main: '#F7B538', dark: '#F79F00' }),
    },
    error: {
      light: red[50],
      main: red[500],
      dark: red[700],
      ...(mode === 'dark' && { light: '#D32F2F', main: '#D32F2F', dark: '#B22A2A' }),
    },
    success: {
      light: sgRed[300],
      main: sgRed[400],
      dark: sgRed[800],
      ...(mode === 'dark' && {
        light: sgRed[400],
        main: sgRed[500],
        dark: sgRed[700],
      }),
    },
    grey: {
      50: sgBlack[50],
      100: sgBlack[100],
      200: sgBlack[200],
      300: sgBlack[300],
      400: sgBlack[400],
      500: sgBlack[500],
      600: sgBlack[600],
      700: sgBlack[700],
      800: sgBlack[800],
      900: sgBlack[900],
    },
    divider: mode === 'dark' ? alpha(sgBlack[600], 0.3) : alpha(sgBlack[300], 0.5),
    background: {
      default: '#fff',
      paper: sgBlack[50],
      ...(mode === 'dark' && { default: sgBlack[900], paper: sgBlack[800] }),
    },
    text: {
      primary: sgBlack[800],
      secondary: sgBlack[600],
      ...(mode === 'dark' && { primary: '#fff', secondary: sgBlack[400] }),
    },
    action: {
      selected: `${alpha(sgRed[200], 0.2)}`,
      ...(mode === 'dark' && {
        selected: alpha(sgRed[800], 0.2),
      }),
    },
  },
  typography: {
    fontFamily: ['"Inter", "sans-serif"'].join(','),
    h1: {
      fontSize: 60,
      fontWeight: 600,
      lineHeight: 78 / 70,
      letterSpacing: -0.2,
    },
    h2: {
      fontSize: 48,
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: 42,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: 36,
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: 20,
      fontWeight: 600,
    },
    h6: {
      fontSize: 18,
    },
    subtitle1: {
      fontSize: 18,
    },
    subtitle2: {
      fontSize: 16,
    },
    body1: {
      fontWeight: 400,
      fontSize: 15,
    },
    body2: {
      fontWeight: 400,
      fontSize: 14,
    },
    caption: {
      fontWeight: 400,
      fontSize: 12,
    },
  },
});

export default function getCheckoutTheme(mode) {
  return createTheme({
    ...getDesignTokens(mode),
    components: {
      MuiAlert: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 10,
            backgroundColor: sgRed[100],
            color: theme.palette.text.primary,
            border: `1px solid ${alpha(sgRed[300], 0.5)}`,
            '& .MuiAlert-icon': {
              color: sgRed[500],
            },
            ...(theme.palette.mode === 'dark' && {
              backgroundColor: `${alpha(sgRed[900], 0.5)}`,
              border: `1px solid ${alpha(sgRed[800], 0.5)}`,
            }),
          }),
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: '10px',
            boxShadow: `0 4px 16px ${alpha(sgBlack[400], 0.2)}`,
            '& .Mui-selected': {
              color: sgRed[500],
            },
            ...(theme.palette.mode === 'dark' && {
              '& .Mui-selected': {
                color: '#fff',
              },
              boxShadow: `0 4px 16px ${alpha(sgRed[700], 0.5)}`,
            }),
          }),
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: '12px 16px',
            textTransform: 'none',
            borderRadius: '10px',
            fontWeight: 500,
            ...(theme.palette.mode === 'dark' && {
              color: sgBlack[400],
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
              '&.Mui-selected': { color: sgRed[300] },
            }),
          }),
        },
      },
      MuiButtonBase: {
        defaultProps: {
          disableTouchRipple: true,
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            boxSizing: 'border-box',
            transition: 'all 100ms ease-in',
            '&:focus-visible': {
              outline: `3px solid ${alpha(sgRed[500], 0.5)}`,
              outlineOffset: '2px',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            boxShadow: 'none',
            borderRadius: '10px',
            textTransform: 'none',
            ...(ownerState.size === 'large' && {
              padding: '12px 16px',
              fontSize: 18,
            }),
            ...(ownerState.size === 'small' && {
              padding: '6px 10px',
              fontSize: 13,
            }),
            ...(ownerState.variant === 'contained' &&
              theme.palette.mode === 'light' && {
                backgroundColor: sgRed[500],
                color: '#fff',
                '&:hover': {
                  backgroundColor: sgRed[700],
                  color: '#fff',
                },
                '&:active': {
                  boxShadow: `0 0 0 0.2rem ${alpha(sgRed[300], 0.5)}`,
                },
                '&:focus': {
                  boxShadow: `0 0 0 0.2rem ${alpha(sgRed[300], 0.5)}`,
                },
              }),
          }),
        },
      },
    },
  });
}
