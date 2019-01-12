module.exports = (isDev) => {
    return {
        preserveWhitespace: true, // 写.vue文件的时候空格的处理
        extractCSS: !isDev,
        cssModules: {},
        hotReload: 
    }
}