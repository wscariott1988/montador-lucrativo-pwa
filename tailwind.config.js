/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // === Tokens DeWalt (spec: docs/ui-ux-spec.md) ===
        dewalt: {
          yellow: '#FFC200',
          cyan: '#0EA5E9',
          emerald: '#10B981',
          red: '#EF4444',
        },
        // === Superficies Zinc (tema dark industrial) ===
        zinc: {
          dark: '#121214',
          card: '#1C1D22',
          raised: '#262830',
          border: '#2E3038',
        },
        slate: {
          light: '#F8FAFC',
          muted: '#9CA3AF',
          faint: '#6B7280',
        },
        // === Aliases Material (fidelidade aos mockups Stitch) ===
        surface: '#121214',
        'surface-dim': '#121214',
        'surface-container-lowest': '#0E0E10',
        'surface-container-low': '#18191E',
        'surface-container': '#1C1D22',
        'surface-container-high': '#262830',
        'surface-container-highest': '#2E3038',
        'surface-bright': '#39393B',
        'on-surface': '#F8FAFC',
        'on-surface-variant': '#9CA3AF',
        'primary-container': '#FFC200',
        'on-primary-container': '#121214',
        primary: '#FFE5B0',
        'on-primary': '#3F2E00',
        'primary-fixed': '#FFDF9C',
        'primary-fixed-dim': '#F9BD00',
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
        sans: ['Chivo', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      boxShadow: {
        // Biesel industrial: capa de botão "levantada"
        'dewalt-bevel': '0 4px 0 #0D0E10',
        'yellow-bevel': '0 4px 0 #B28800',
        'red-bevel': '0 4px 0 #991B1B',
        'inner-press': 'inset 0 0 0 1px #2E3038',
      },
    },
  },
  plugins: [],
};