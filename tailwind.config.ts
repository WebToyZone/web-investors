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
        brand: 'var(--color-brand)',
        brandDark: 'var(--color-brand-dark)',
        neutral: 'var(--color-neutral)',
        bgNeutral: 'var(--color-bgNeutral)',
      },
      
    },
  },
  plugins: [],
};
export default config;
