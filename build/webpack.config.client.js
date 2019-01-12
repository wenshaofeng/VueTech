const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge') //合理地合并webpack.config
const ExtractPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config.base')


const isDev = process.env.NODE_ENV === 'development';

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new HTMLPlugin()
]

let config

const devServer = {
  port: '8080',
  host: '0.0.0.0',
  overlay: {  // webpack编译出现错误，则显示到网页上
    errors: true,
  },
  // open: true,
  // 不刷新热加载数据
  hot: true
}

if (isDev) {
  config = merge(baseConfig, {
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
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  })
} else {
  config = merge(baseConfig, {
    entry: {   // 将所用到的类库单独打包
      app: path.join(__dirname, '../src/index.js'),
      vendor: ['vue']
    },
    output: {
      filename: '[name].[chunkhash:8].js',
    },
    module: {
      rules: [
        {
          test: /\.styl/,
          use: ExtractPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true
                }
              },
              'stylus-loader'
            ]
          })
        }
      ],
    },
    plugins: defaultPlugins.concat([
      new ExtractPlugin('styles.[contentHash:8].css')
    ])
  })
  config.optimization = {
    splitChunks: {
      cacheGroups: {                  // 这里开始设置缓存的 chunks
        commons: {
          chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
          minSize: 0,             // 最小尺寸，默认0,
          minChunks: 2,           // 最小 chunk ，默认1
          maxInitialRequests: 5   // 最大初始化请求书，默认1
        },
        vendor: {
          test: /node_modules/,   // 正则规则验证，如果符合就提取 chunk
          chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
          name: 'vendor',         // 要缓存的 分隔出来的 chunk 名称
          priority: 10,           // 缓存组优先级
          enforce: true
        }
      }
    },
    runtimeChunk: true
  }

}

module.exports = config;
