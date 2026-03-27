import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Integr8 Main Brand
        palestra: '#175899',
        concrete: '#bdbcb7',
        // Integr8 Fight Team
        midnight: '#112938',
        gold: '#7d6e51',
      },
      fontFamily: {
        sans: ['var(--font-brandon)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
