/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        apple: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'SF Pro Display',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Helvetica Neue',
          'sans-serif'
        ]
      },
      colors: {
        primary: "#000000",
        glass: "rgba(22,22,23,0.65)",
        neon: "#FF007A",
        border: "rgba(255,255,255,0.06)",
        success: "#27C088",
        error: "#FF4D4F",
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(1200px circle at 60% 30%, rgba(255,0,122,0.08) 0%, rgba(0,0,0,0.92) 70%, rgba(0,0,0,1) 100%)'
      },
      backdropBlur: {
        md: '20px',
        lg: '30px'
      }
    }
  },
  plugins: []
};