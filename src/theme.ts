import { createTheme } from '@mui/material/styles';
import { alpha, PaletteMode, Shadows } from '@mui/material/styles';

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface PaletteColor extends ColorRange {}
}

const defaultTheme = createTheme();

const customShadows: Shadows = [...defaultTheme.shadows];

export const brand = {
  50: 'hsl(220, 100%, 95%)',
  100: 'hsl(220, 90%, 85%)',
  200: 'hsl(220, 80%, 75%)',
  300: 'hsl(220, 70%, 65%)',
  400: 'hsl(220, 60%, 55%)',
  500: 'hsl(220, 50%, 50%)',
  600: 'hsl(220, 40%, 45%)',
  700: 'hsl(220, 30%, 35%)',
  800: 'hsl(220, 20%, 25%)',
  900: 'hsl(220, 10%, 15%)',
};

export const gray = {
  50: 'hsl(210, 10%, 95%)',
  100: 'hsl(210, 10%, 85%)',
  200: 'hsl(210, 10%, 75%)',
  300: 'hsl(210, 10%, 65%)',
  400: 'hsl(210, 10%, 55%)',
  500: 'hsl(210, 10%, 45%)',
  600: 'hsl(210, 10%, 35%)',
  700: 'hsl(210, 10%, 25%)',
  800: 'hsl(210, 10%, 15%)',
  900: 'hsl(210, 10%, 10%)',
};

export const getDesignTokens = (mode: PaletteMode) => {
  customShadows[1] =
    mode === 'dark'
      ? 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px'
      : 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px';

  return {
    palette: {
      mode,
      primary: {
        light: brand[200],
        main: brand[500],
        dark: brand[700],
        contrastText: brand[50],
        ...(mode === 'dark' && {
          contrastText: brand[50],
          light: brand[300],
          main: brand[400],
          dark: brand[700],
        }),
      },
      secondary: {
        light: brand[200],
        main: brand[500],
        dark: brand[800],
        contrastText: brand[50],
      },
      grey: {
        ...gray,
      },
      divider: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
      background: {
        default: mode === 'dark' ? gray[900] : 'hsl(0, 0%, 99%)',
        paper: mode === 'dark' ? gray[800] : 'hsl(220, 35%, 97%)',
      },
      text: {
        primary: mode === 'dark' ? gray[50] : gray[800],
        secondary: mode === 'dark' ? gray[200] : gray[600],
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: alpha(gray[200], 0.3),
        ...(mode === 'dark' && {
          hover: alpha(gray[600], 0.2),
          selected: alpha(gray[600], 0.3),
        }),
      },
    },
    typography: {
      fontFamily: ['"Inter", "sans-serif"'].join(','),
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5,
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2,
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(14),
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400,
      },
      caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: customShadows,
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '16px',
            backgroundColor: mode === 'dark' ? gray[800] : gray[50],
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: mode === 'dark' ? gray[700] : gray[100],
            },
          },
        },
      },
    },
  };
};

// カスタムテーマの適用
export const theme = createTheme(getDesignTokens('light'));
