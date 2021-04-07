'use strict'
const packageJson = require('./package.json')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve('./src/client/tsconfig.json')
        }
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
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/client/favicon' }
      ]
    })
  ],
  resolve: {
    alias: packageJson._moduleAliases,
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
}
