var path = require('path');
var webpack = require("webpack");
var webpackDevServer = require("webpack-dev-server");
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var compiler = webpack({
  entry: "./src/entry.js",
  output: {
    path: __dirname,
    filename: "action.bundle.js"
  },
  module: {
    loaders: [{
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        exclude: [nodeModulesPath]
    }, ],
  },
  externals: {
    // don't bundle the 'react' npm package with our bundle.js
    // but get it from a global 'React' variable
    'react': 'React'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
});
var server = new webpackDevServer(compiler, {
  "quiet": false,
  "stats": { "colors": true },
  "proxy": {
    "/tests/index.php": {
      "target": {
        "host": "action-js.dev",
        "protocol": 'http:',
        "port": 80
      },
      "changeOrigin": true,
      "secure": false
    },
    "/api": {
      "target": {
        "host": "action-js.dev",
        "protocol": 'http:',
        "port": 80
      },
      "changeOrigin": true,
      "secure": false
    }
  }
});
server.listen(8080);
