const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    sourceMap: true,
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/scss/main.scss";`,
      },
    },
  },
});
