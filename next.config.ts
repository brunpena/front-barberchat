// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // suas outras configs do next aqui
  reactStrictMode: true,

  // DESATIVA Turbopack (usa Webpack em vez de Turbopack)
  experimental: {
    turbo: false,
  },

  // Se você tiver uma configuração webpack custom, deixe-a aqui.
  // Exemplo de hook webpack (opcional):
  // webpack: (config, { isServer }) => {
  //   // custom webpack tweaks
  //   return config;
  // },
});
