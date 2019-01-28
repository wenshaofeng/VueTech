const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const MemoryFS = require('memory-fs') // 扩展了fs模块功能，不把数据写入磁盘上面而是内存
const axios = require('axios')
const webpack = require('webpack')
const VueServerRender = require('vue-server-renderer')

const serverRender = require('./server-render')
const serverConfig = require('../../build/webpack.config.server') //拿到webpack配置

const serverCompiler = webpack(serverConfig)
const mfs = new MemoryFS()
serverCompiler.outputFileSystem = mfs

let bundle 
serverCompiler.watch