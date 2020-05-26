const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [
    './**/*.html',
    './**/*.vue',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          80: '#EFF4F8',
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
        brand: '#ffad1f'
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        mono: ['Cascadia', ...defaultTheme.fontFamily.mono], // font for code snippets 😎
      },
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/ui'),
  ]
}
