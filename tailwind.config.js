/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // GitHub Light
        'gh-light-bg': '#FFFFFF',
        'gh-light-bg-secondary': '#F6F8FA',
        'gh-light-text': '#24292F',
        'gh-light-text-secondary': '#57606A',
        'gh-light-link': '#0969DA',
        'gh-light-border': '#D0D7DE',

        // GitHub Dark
        'gh-dark-bg': '#0D1117',
        'gh-dark-bg-secondary': '#161B22',
        'gh-dark-text': '#C9D1D9',
        'gh-dark-text-secondary': '#8B949E',
        'gh-dark-link': '#58A6FF',
        'gh-dark-border': '#30363D',
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
