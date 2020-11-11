const webpack = require('webpack')
module.exports = {
  transpileDependencies: ['/vuetify/'],
  devServer: {
    port: 8088,
    host: process.env.NODE_ENV === 'production' ? 'localhost' : '0.0.0.0'
  }
};
