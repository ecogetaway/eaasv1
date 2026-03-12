// EaaS Operator Portal — Separate deployment from consumer app.
// Security & compliance mandate frontend + services separation.
// Shared database sits behind firewall and proxy. No direct client access.
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
