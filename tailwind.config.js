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
        primary: "#0a0a0f",
        glass: "rgba(18,18,24,0.75)",
        neon: "#FF007A",
        neonLight: "#FF3399",
        border: "rgba(255,0,122,0.12)",
        borderSoft: "rgba(255,255,255,0.06)",
        success: "#27C088",
        error: "#FF4D4F",
        sushiPink: "#FF007A",
        sushiDark: "#0a0a0f",
        sushiCard: "rgba(20,10,18,0.8)",
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(1200px circle at 50% 20%, rgba(255,0,122,0.12) 0%, rgba(255,0,122,0.04) 40%, rgba(10,10,15,0.98) 70%, rgba(10,10,15,1) 100%)',
        'card-glow':
          'linear-gradient(135deg, rgba(255,0,122,0.06) 0%, rgba(10,10,15,0.9) 100%)',
      },
      backdropBlur: {
        md: '20px',
        lg: '30px'
      },
      boxShadow: {
        'neon': '0 0 20px rgba(255,0,122,0.15)',
        'neon-lg': '0 0 40px rgba(255,0,122,0.2)',
        'card': '0 8px 32px rgba(0,0,0,0.5), 0 0 1px rgba(255,0,122,0.1)',
      }
    }
  },
  plugins: []
};
