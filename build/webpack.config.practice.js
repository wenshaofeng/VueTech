const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge') //合理地合并webpack.config
const baseConfig = require('./webpack.config.base')


const isDev = process.env.NODE_ENV === 'development';

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV:  '"development"' 
    }
  }),
  new HTMLPlugin({
      template:path.join(__dirname,'template.html')
  })
]

let config

const devServer = {
  port: 8090,
  host: '0.0.0.0',
  overlay: {  // webpack编译出现错误，则显示到网页上
    errors: true,
  },
  // open: true,
  // 不刷新热加载数据
  hot: true
}

config = merge(baseConfig, {
    entry:path.join(__dirname,'../practice/index.js'),
    devtool: '#cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.styl/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    devServer,
    resolve:{
        alias:{
            'vue':path.join(__dirname,'../node_modules/vue/dist/vue.esm.js')
        }
    },
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  })

module.exports = config;
