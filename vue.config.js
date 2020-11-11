const webpack = require('webpack')
module.exports = {
  transpileDependencies: ['/vuetify/'],
  devServer: {
    port: 8088,
    host: process.env.NODE_ENV === 'production' ? 'localhost' : '0.0.0.0'
  },
  publicPath: process.env.NODE_ENV === 'production' ? './ququlu_view/dist/' : './',
  assetsDir: ''
};
