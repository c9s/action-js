var path = require('path');
var webpack = require("webpack");
var webpackDevServer = require("webpack-dev-server");
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
module.exports = {
  'entry': {
    'action': ["./src/entry.ts"],
    'action-test': ["./src/entry.ts"],
  },
  'output': {
    'path': __dirname,
    'filename': '[name].js'
  },
  'module': {
    'loaders': [
      { test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      { test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [nodeModulesPath]
      },
    ]
  },
  'externals': {
    // don't bundle the 'react' npm package with our bundle.js
    // but get it from a global 'React' variable
    'jquery': 'jQuery',
    'react': 'React'
  },
  'resolve': {
    'root': [path.resolve('./src')],
    'extensions': ['', '.ts', '.tsx', '.js', '.jsx']
  }
};
