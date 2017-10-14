var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require("autoprefixer");

module.exports = {
  entry: path.join(__dirname, "js/app/index"),
  output: {
    path: path.join(__dirname, "../public"),
    filename: "js/index.js"
  },
  module: {
    rules: [
      {
        test: /(\.scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        }) //把 css 抽离出来生成一个文件
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: { presets: ["es2015"] }
      }
    ],
  },
  resolve: {
    alias: {
      jquery: path.join(__dirname, "js/lib/jquery-2.0.3.min.js"),
      mod: path.join(__dirname, "js/mod"),
      sass: path.join(__dirname, "sass")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery"
    }),
    new ExtractTextPlugin("css/index.css"),
    new webpack.LoaderOptionsPlugin({
      options: {
        css: [autoprefixer()]
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      }
    })
  ]
};
