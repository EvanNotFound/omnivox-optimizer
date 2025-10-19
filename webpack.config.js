const path = require('path');
const { UserscriptPlugin } = require('webpack-userscript');
const pkg = require('./package.json');
const userscriptConfig = require('./userscript.config');


const dev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${pkg.name}.user.js`,
    publicPath: '',
    clean: true,
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 8080,
    hot: true,
    devMiddleware: {
      writeToDisk: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    new UserscriptPlugin(userscriptConfig),
  ],
  module: {
    rules: [
        {
            test: /\.styl$/,
            use: [
                'raw-loader',
                'css-loader',
                'stylus-loader'
            ]
        }
    ]
  },
};
