"use strict";
/** @type {import('webpack').Configuration} */

const WebExtPlugin = require("./webpack.webext");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CommentJson = require("comment-json");
const package_json = require("./package.json");
const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV,
  context: path.resolve(__dirname, "./src"),
  entry: {
    "background/index": "./background/index.ts",
    "options/index": "./options/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
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
    extensions: [".ts", ".js", ".css"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    modules: ["node_modules"],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        // manifest.json
        {
          from: "./manifest.json",
          to: "./manifest.json",
          transform: {
            transformer: (content) => {
              const json = JSON.parse(transformJson(content));
              json.name = package_json.productName;
              json.version = package_json.version;
              json.description = package_json.description;
              return JSON.stringify(json, null, 2);
            },
            cache: true,
          },
        },
        // icons
        {
          from: "./icons",
          to: "./icons",
        },
        // options
        {
          from: "./options/index.html",
          to: "./options/index.html",
          transform: {
            transformer: transformHtml,
            cache: true,
          },
        },
        // popup
        // {
        //   from: "./popup/index.html",
        //   to: "./popup/index.html",
        //   transform: {
        //     transformer: transformHtml,
        //     cache: true,
        //   },
        // },
      ],
    }),
    new WebExtPlugin({ sourceDir: "dist", target: process.env.BROWSER_TARGET }),
  ],
};

// transform content
function transformJson(content, _path) {
  const obj = CommentJson.parse(content.toString(), null, true);
  return CommentJson.stringify(obj, null, 2);
}

function transformHtml(content, _path) {
  return content.toString();
}
