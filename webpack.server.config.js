var path = require('path');
var webpack = require("webpack");
var webpackDevServer = require("webpack-dev-server");
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var webpackConfig = require("./webpack.config.js");
var compiler = webpack(webpackConfig);
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
