// Tema centralizado para o app mobile moderno
export const theme = {
  colors: {
    // Paleta principal
    primary: '#4f51d4',
    secondary: '#19376d',
    dark: '#0b2447',
    background: '#fff',
    
    // Cores de texto
    text: {
      primary: '#0b2447',
      secondary: '#19376d',
      light: '#4f51d4',
      white: '#fff',
      muted: '#6b7280',
    },
    
    // Cores de fundo
    surface: {
      primary: '#fff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
    },
    
    // Cores de estado
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Bordas e divisores
    border: {
      light: '#e2e8f0',
      medium: '#cbd5e1',
      dark: '#19376d',
    },
    
    // Sombras e elevação
    shadow: {
      light: 'rgba(11, 36, 71, 0.1)',
      medium: 'rgba(11, 36, 71, 0.15)',
      dark: 'rgba(11, 36, 71, 0.25)',
    },
  },
  fonts: {
    main: 'System',
    alt: 'System',
    weights: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#0b2447',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#0b2447',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#0b2447',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};
