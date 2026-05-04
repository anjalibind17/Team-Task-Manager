/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: { extend: { boxShadow: { soft: '0 20px 60px rgba(15, 23, 42, 0.08)' } } },
  plugins: []
};
