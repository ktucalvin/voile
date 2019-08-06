'use strict'
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env'] }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(otf|png)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: [
        '**/*',
        '!android-chrome-*.png',
        '!apple-touch-icon.png',
        '!browserconfig.xml',
        '!favicon*',
        '!mstile-*.png',
        '!safari-pinned-tab.svg',
        '!site.webmanifest'
      ],
      cleanAfterEveryBuildPatterns: [
        '!android-chrome-*.png',
        '!apple-touch-icon.png',
        '!browserconfig.xml',
        '!favicon*',
        '!mstile-*.png',
        '!safari-pinned-tab.svg',
        '!site.webmanifest'
      ]
    }),
    new CopyWebpackPlugin([
      { from: './src/favicon' }
    ])
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'https://localhost',
    filename: '[name].[contenthash].js'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-router-dom': 'ReactRouterDOM'
  }
}
