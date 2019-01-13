module.exports = (isDev) => {
    return {
        preserveWhitespace: true, // 写.vue文件的时候空格的处理
        extractCSS: !isDev, //生产环境才使用
        cssModules: {
            localIdentName: '[path]-[name]-[hash:base64:5]',
            camelCase: true
        },
        // hotReload: false 
    }
}