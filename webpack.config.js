const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const path = require("path");
const webpack = require("webpack");

module.exports = (
  env,
  argv
) => {
  const devMode = argv.mode !== "production";
  let envPath = ".env.local";
  let publicPath = "/";
  let imageAsset = "assets";
  if (!devMode) {
    envPath = ".env";
    publicPath = "/";
    imageAsset = "assets";
  }

  return {
    resolve : {
      extensions : [
        ".ts",
        ".tsx",
        ".js"
      ]
    },
    output : {
      path : path.resolve(__dirname, "dist"),
      // Generated JS file names (with nested folders).
      // There will be one main bundle, and one file per asynchronous chunk.
      // We don't currently advertise code splitting but Webpack supports it.
      filename : "assets/js/[name].[fullhash].js",
      chunkFilename : "assets/js/[name].[fullhash].chunk.js",
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath : publicPath
    },
    plugins : [
      new HtmlWebpackPlugin(
        {
          template : path.resolve(__dirname, "src", "index.html")
        }
      ),
      new MiniCssExtractPlugin({
        filename : "assets/css/[name].[fullhash].css",
        chunkFilename : "assets/css/[id].[fullhash].css"
      }),
      new CopyWebpackPlugin({
        patterns : [
          {
            from : "src/assets/images",
            to : imageAsset + "/images"
          }
          // ,
          // {
          //   from : "src/assets/font",
          //   to : "assets/font"
          // }
        ]
      }),
      new Dotenv({
        path : envPath
      })
    ],
    module : {
      rules : [
        {
          test : /\.(js|jsx|tsx|ts)$/,
          exclude : /node_modules/,
          use : ["babel-loader"]
        },
        {
          test : /\.(sa|sc|c)ss$/,
          use : [
            // {
            //   loader : MiniCssExtractPlugin.loader
            // },
            { loader : "style-loader" },
            {
              loader : "css-loader",
              options : {
                url : false
              }
            },
            {
              loader : "sass-loader"
            }
          ]
        }
      ]
    },
    optimization : {
      splitChunks : {
        chunks : "all"
      },
      minimizer : [
        new UglifyJsPlugin({
          test : /\.(js|jsx|tsx|ts)$/,
          exclude : /node_modules/,
          uglifyOptions : {
            comments : false,
            compress : {
              drop_console : true
            },
          }
        }),
      ]
    },
    devServer : {
      historyApiFallback : true,
      port : 3010,
      compress : false,
      devMiddleware : {
        publicPath : "/"
      }
    }
  };
};
