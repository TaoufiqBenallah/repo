module.exports = {
  filenameHashing: false,
  devServer: {
    https: true,
    port: 8081,
    host: 'localhost',
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
};
