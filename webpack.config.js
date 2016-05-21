var path = require('path');
var webpack = require("webpack");
var webpackDevServer = require("webpack-dev-server");
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
module.exports = {
  entry: "./src/entry.ts",
  output: {
    path: __dirname,
    filename: "action.bundle.js"
  },
  module: {
    loaders: [{
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        exclude: [nodeModulesPath]
    }, { test: /\.tsx?$/, loader: 'ts-loader' }],
  },
  externals: {
    // don't bundle the 'react' npm package with our bundle.js
    // but get it from a global 'React' variable
    'react': 'React'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx']
  }
};
