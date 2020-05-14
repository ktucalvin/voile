'use strict'
require('dotenv').config()
const path = require('path')
const send = require('koa-send')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { WebpackPluginServe } = require('webpack-plugin-serve')

const serve = new WebpackPluginServe({
  host: 'localhost',
  port: 3000,
  waitForBuild: true,
  ramdisk: true,
  progress: 'minimal',
  https: {
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT
  },
  static: path.join(__dirname, 'dist'),
  middleware: (app, builtins) => {
    app.use(builtins.proxy('/api', {
      target: 'https://localhost/'
    }))

    app.use(builtins.proxy('/i', {
      target: 'https://localhost/'
    }))

    app.use(async (ctx, next) => {
      if (ctx.accepts('html')) {
        await send(ctx, path.join('dist/index.html'))
        await next()
      }
    })
  }
})

module.exports = merge(common, {
  mode: 'development',
  entry: ['./client/index.js', 'webpack-plugin-serve/client'],
  devtool: 'inline-source-map',
  watch: true,
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    serve,
    new HtmlWebpackPlugin({
      template: './client/index.ejs'
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[hash].js'
  }
})
