module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    devtool: 'source-map' // 주석처리
  },

  pluginOptions: {
    electronBuilder: {
      // nodeIntegration: true,
      preload: 'src/preload.ts'
    }
  }
}
