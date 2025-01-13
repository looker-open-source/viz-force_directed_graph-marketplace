var path = require("path");

const TerserPlugin = require('terser-webpack-plugin');

var webpackConfig = {
  mode: "production",
  entry: {
    forcedirected: "./src/force-directed.ts",
  },
  devServer: {
    contentBase: "./dist",
  },
  output: {
    filename: "[name].js",
    path: __dirname,
    library: "[name]",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".js"],
  },
  plugins: [new TerserPlugin()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "to-string-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
    ],
  },
};

module.exports = webpackConfig;
