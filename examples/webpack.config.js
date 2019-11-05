'use strict';

const path = require('path');
const CSSDarkModePlugin = require('../lib/index.js');

module.exports = {
  mode: 'production',
  entry: ['./styles/style.less'],
  output: {
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              plugins: [
                new CSSDarkModePlugin()
              ]
            }
          }
        ]
      }
    ]
  }
};
