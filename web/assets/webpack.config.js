const path = require('path');
var webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    "css": path.resolve(__dirname, 'src') + '/sass/bundles/core.scss',
    "js/app": path.resolve(__dirname, 'src') + '/js/app.js',
    "js/home": path.resolve(__dirname, 'src') + '/js/bundles/home.js',
    "js/projects": path.resolve(__dirname, 'src') + '/js/bundles/projects.js',
  },
  plugins: [
    new CleanWebpackPlugin(
      {
        cleanStaleWebpackAssets: false,
        protectWebpackAssets: true,     
        cleanOnceBeforeBuildPatterns: ['**/*', '!static-files*'],
        cleanOnceBeforeBuildPatterns: []                
      },
    ),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })    
  ],
  output: {    
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },      
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },     
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },       
      {
        test: /\.scss$/,
        use: [           
          {
            loader: 'file-loader',
            options: {outputPath: '/css/', name: '[name].min.css'}
          },            
          'sass-loader'
        ],
      },
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public')
  }
};