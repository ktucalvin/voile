'use strict'
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
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
      { from: './src/client/favicon' }
    ])
  ]
}
