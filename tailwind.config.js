/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // === Tokens DeWalt (spec: docs/ui-ux-spec.md + diretrizes 2026) ===
        dewalt: {
          yellow: '#FFC800',
          cyan: '#0EA5E9',
          emerald: '#10B981',
          red: '#EF4444',
        },
        // === Superficies Zinc (tema dark suave compacto) ===
        zinc: {
          dark: '#121212',
          card: '#1E1E1E',
          raised: '#262626',
          // Borda fina no tom amarelo industrial DeWalt (#FFC800)
          border: 'rgba(255, 200, 0, 0.32)',
        },
        slate: {
          light: '#F8FAFC',
          muted: '#9CA3AF',
          faint: '#6B7280',
        },
        // === Aliases Material (fidelidade aos mockups Stitch) ===
        surface: '#121212',
        'surface-dim': '#121212',
        'surface-container-lowest': '#0E0E10',
        'surface-container-low': '#181818',
        'surface-container': '#1E1E1E',
        'surface-container-high': '#262626',
        'surface-container-highest': '#2C2C2C',
        'surface-bright': '#39393B',
        'on-surface': '#F8FAFC',
        'on-surface-variant': '#9CA3AF',
        'primary-container': '#FFC800',
        'on-primary-container': '#121212',
        primary: '#FFE5B0',
        'on-primary': '#3F2E00',
        'primary-fixed': '#FFDF9C',
        'primary-fixed-dim': '#F5B900',
        secondary: '#89CEFF',
        'secondary-container': '#0EA5E9',
        'on-secondary': '#00344D',
        'on-secondary-container': '#00344E',
        'secondary-fixed': '#C9E6FF',
        'secondary-fixed-dim': '#89CEFF',
        tertiary: '#10B981',
        'tertiary-container': '#0C9C6C',
        'on-tertiary': '#052E1C',
        'on-tertiary-container': '#E6FFF4',
        'tertiary-fixed': '#6FFBBE',
        'tertiary-fixed-dim': '#4EDEA3',
        error: '#EF4444',
        'error-container': '#450A0A',
        'on-error': '#FFFFFF',
        'on-error-container': '#FECACA',
        outline: '#9C8F78',
        'outline-variant': '#4F4632',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.25rem',
        lg: '0.25rem',
        xl: '0.25rem',
        '2xl': '0.25rem',
        '3xl': '0.25rem',
        // Cantos retos/flat: apenas circulos literais (avatar marcador) usam full.
        full: '9999px',
      },
      boxShadow: {
        // Biesel industrial: capa de botão "levantada"
        'dewalt-bevel': '0 4px 0 #0D0E10',
        'yellow-bevel': '0 4px 0 #B08900',
        'red-bevel': '0 4px 0 #991B1B',
        'inner-press': 'inset 0 0 0 1px #2E3038',
      },
    },
  },
  plugins: [],
};