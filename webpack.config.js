"use strict";
/** @type {import('webpack').Configuration} */

const WebExtPlugin = require("./webpack.webext");

module.exports = {
  mode: "development",
  entry: {
    background: "./src/background.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new WebExtPlugin({ sourceDir: "src" })],
};
