// Notes!
// 1 - use in previous versions - CleanWebpackPlugin plugin
// 2 - use in previous versions- 'file-loader'
// 3 - optimizate repeatedly used libraries
// 4 - minimize js files.
// 5 - minimize css files.
// 6 -  generate css file
// 7 - runtimeChunk?

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const deployPath = 'build';
const devMode = process.env.NODE_ENV === 'development';
const prodMode = !devMode;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all', // (3)
    },
    runtimeChunk: 'single',
  };
  if (prodMode) {
    config.minimize = true;
    config.minimizer = [
      new TerserPlugin(), // (4)
      new CssMinimizerPlugin(), // (5)
    ];
  }
  return config;
};

const filename = (ext) => (devMode ? `[name].${ext}` : `[name].[contenthash].${ext}`);

const cssLoaders = (extra) => {
  const loaders = [MiniCssExtractPlugin.loader, 'css-loader'];
  if (extra) {
    loaders.push(extra);
  }
  return loaders;
};

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),

  entry: {
    main: './index.js',
    analytics: './analytics.js',
  },

  output: {
    path: path.resolve(__dirname, deployPath),
    filename: filename('js'),
    clean: true, // (1)
    assetModuleFilename: '[name][ext]', // (2 )
  },

  resolve: {
    extensions: ['.js', '.json'],
    // I wait for this a long time ;)
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
  },

  module: {
    rules: [
      // css
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      // less
      {
        test: /\.less$/,
        use: cssLoaders('less-loader'),
      },
      // sass/scss
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      // images | (2)
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
      // fonts | (2)
      {
        test: /\.(ttf|woff|woff2|eos)$/,
        type: 'asset/resource',
      },
      // xml
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      // csv
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
      // babel/js/jsx/ts/tsx
      {
        test: /\.(m?js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
          },
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      minify: prodMode,
    }),

    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, deployPath),
        },
      ],
    }),

    // (6)
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),

    new BundleAnalyzerPlugin(),
  ],

  optimization: optimization(),

  devServer: {
    port: 3000,
    open: true,
    compress: true,
    static: {
      directory: path.join(__dirname, deployPath),
    },
  },

  devtool: 'source-map',
};
