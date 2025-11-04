/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0b0b10',       // preto profundo
          primary: '#6d28d9',  // roxo
          accent: '#facc15'    // amarelo
        }
      },
      boxShadow: {
        glow: '0 0 20px rgba(109, 40, 217, 0.45)'
      }
    }
  },
  plugins: []
};
