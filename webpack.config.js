var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

function zipObject(keys, values) {
  return keys.reduce(function (object, key, i) {
    object[key] = values[i];
    return object;
  }, {});
}

var BUILD_ENV = process.env.BUILD_ENV || 'development',
  vendorjs = [
    'react/dist/react.js',
    'react-dom/dist/react-dom.js',
  ].map(function (distPath) {
    return BUILD_ENV === 'production' ? distPath.replace(/\.js$/, '.min.js') : distPath;
  }),
  vendorjsNames = vendorjs.map(function (distPath) {
    return distPath.split('/')[0]; // npm name
  }),
  vendorjsPaths = vendorjs.map(function (distPath) {
    return path.resolve(__dirname, 'node_modules', distPath); // absolute local path
  });

module.exports = {
  entry: {
    vendor: vendorjsNames,
    app: './app/main.js',
  },
  output: {
    path: 'build',
    filename: '[name].js',
  },
  resolve: {
    alias: zipObject(vendorjsNames, vendorjsPaths),
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    noParse: vendorjsPaths.filter(function (p) { return !/react-dom/.test(p); }), // must parse react-dom because it uses `require('react')`
    loaders: [
      {
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
        test: /\.css$/,
      },
      {
        loader: 'babel-loader',
        test: /\.jsx?$/,
        exclude: vendorjsPaths,
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new ExtractTextPlugin('style.css'),
  ].concat(
    BUILD_ENV === 'production'
    ? [
        new webpack.optimize.UglifyJsPlugin({
          test: /\.js$/,
          exclude: /vendor/,
          sourceMap: false,
          compress: {
            screw_ie8: true,
          },
        }),
      ]
    : []
  ),
};
