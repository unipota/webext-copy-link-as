"use strict";
/** @type {import('webpack').Configuration} */

const WebExtPlugin = require("./webpack.webext.plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
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
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[hash][ext][query]",
        },
      },
      {
        test: /\.ico$/,
        type: "asset/resource",
        generator: {
          filename: "assets/icons/[hash][ext][query]",
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/inline",
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
  optimization: {
    // minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
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
    new WebExtPlugin({
      sourceDir: "dist",
      artifactsDir: "artifacts",
      target: process.env.BROWSER_TARGET ?? "firefox-desktop",
    }),
  ],
  // workaround for issue of unsafe-eval
  // https://github.com/webpack/webpack/issues/4899
  devtool: "inline-source-map",
};

// transform content
function transformJson(content, _path) {
  const obj = CommentJson.parse(content.toString(), null, true);
  return CommentJson.stringify(obj, null, 2);
}

function transformHtml(content, _path) {
  return content.toString();
}
