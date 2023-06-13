// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path")
// const ESLintPlugin = require("eslint-webpack-plugin")
const isProduction = process.env.NODE_ENV == "production"

const stylesHandler = "style-loader"

const config = {
  entry: "./example/libExample/all.ts",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "MyLibrary",
      type: "umd",
      export: "default"
    }
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "./public")
    },
    hot: false,
    compress: true,
    port: 9001,
    host: "0.0.0.0",
    client: {
      logging: "info",
      overlay: false
    }
  },
  plugins: [
    // new ESLintPlugin()
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [

      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"]
      },

      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset"
      }

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."]
  }
}

module.exports = () => {
  if (isProduction) {
    config.mode = "production"
  } else {
    config.mode = "development"
  }
  return config
}
