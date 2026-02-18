// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        superWonder: ['Super Wonder', 'sans-serif'], // nuevo nombre de la fuente
      },
    },
  },
  plugins: [],
}
