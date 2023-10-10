const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  configureWebpack: {
    externals: {
      AMap: 'AMap',
    },
  },
  transpileDependencies: true
})
