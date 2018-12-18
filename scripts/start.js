process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const express = require('express');
const webpack = require('webpack');

const path = require('path');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.dev.config');

const app = express();

const compiler = webpack(webpackConfig);

const devServerOptions = Object.assign({}, webpackConfig.devServer, {
  logLevel: 'warn',
  publicPath: '/',
  silent: true,
  stats: 'errors-only',
});

const middleware = webpackDevMiddleware(compiler, devServerOptions);
app.use(middleware);
app.use(webpackHotMiddleware(compiler));

// 静态资源处理
const staticPath = '/static';
app.use(staticPath, express.static('./static'));


const customHost = process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host

app.listen(8080, host, () => {
  console.log('Starting server on http://localhost:8080');
});