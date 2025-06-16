const path = require('path');

module.exports = {
  entry: './src/index.js', // Adjust if entry point differs
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/js/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      three: path.resolve(__dirname, 'node_modules/three'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  devServer: {
    port: 3000,
    static: path.join(__dirname, 'public'),
    hot: true,
  },
};