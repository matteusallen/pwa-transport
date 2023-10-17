/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        transparent: 'transparent',
        black: '#000000',
        white: '#ffffff',
        primary: {
          400: '#ED8324'
        },
        gray: {
          highlight: '#FAFAFA',
          lighter: '#F4F5F7',
          light: '#EEF2F4',
          dark: '#0F0F0F',
          darker: '#595A60'
        },
        disabledGray: '#E0E0E0'
      },
      spacing: {
        0.25: '2px',
        0.5: '4px',
        1: '8px',
        1.5: '12px',
        2: '16px',
        2.5: '20px',
        3: '24px',
        3.5: '28px',
        4: '32px',
        5: '40px',
        6: '48px',
        7: '56px',
        8: '64px',
        9: '72px',
        10: '80px',
        11: '88px',
        12: '96px',
      },
      fontSize: {
        '2.5xl': ['28px', '34px']
      }
    },
  },
  plugins: [],
}