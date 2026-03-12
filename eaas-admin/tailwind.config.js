// EaaS Operator Portal — Separate deployment from consumer app.
// Security & compliance mandate frontend + services separation.
// Shared database sits behind firewall and proxy. No direct client access.
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
