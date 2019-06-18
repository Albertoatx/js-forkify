const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
      contentBase: './dist'
    },
    plugins: [
      new HtmlWebpackPlugin({
          filename: 'index.html',
          template: './src/index.html'
      })
    ],
    module: {
      rules: [
          {
              test: /\.js$/,            // apply babel to all the .js files 
              exclude: /node_modules/,  // except the .js files in the node_modules
              use: {
                  loader: 'babel-loader'
              }
          }
      ]
    }
};
