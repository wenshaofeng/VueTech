const path = require('path')
const ExtractPlugin = require('extract-text-webpack-plugin')
const VueServerPlugin = require('vue-server-renderer/server-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge') //合理地合并webpack.config
const baseConfig = require('./webpack.config.base')


const isDev = process.env.NODE_ENV === 'development';

let config

const plugins = [
    new ExtractPlugin('styles.[contentHash:8].css'),
    new webpack.defaultPlugins({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.VUE_ENV': '"server"'
    })
]

if (isDev) {  
    plugins.push(new VueServerPlugin())
}

config = merge(baseConfig, {
    target: 'node',
    entry: path.join(__dirname, '../client/sever-entry.js'),
    devtool: 'source-map',
    output: {
        libraryTarget: 'commonjs2',
        filename: 'sever-entry.js',
        path: path.join(__dirname, '../server-build')
    },
    externals: Object.keys(require('../package.json').dependencies),//不需要打包的文件
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
        ]
    },
    plugins
})

module.exports = config;
