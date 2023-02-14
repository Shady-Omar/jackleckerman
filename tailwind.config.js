/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["Login.html", "Signup.html", "coordinators.html", "votes.html", "attendees.html", "polls.html", "events.html","./src/main.css", "./src/index.js",, "./src/main.js", "./dist/bundle.js"],
  theme: {
    extend: {},
    colors: {
      darkblue: '#003366',
      blue: '#008dff',
      black: '#000000',
      white: '#FFFFFF',
      grey: '#636363',
      transparent: '#fff0',
      red: '#FF0000',
      navy: '#1F2937',
    }
  },
  plugins: [],
};
