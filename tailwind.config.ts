import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-lite': 'var(--gray-lite)',
        'radio-blue': 'var(--radio-blue)',
        'gray-dark': 'var(--gray-dark)',
      }
    }
  },
  plugins: [],
}


export default config