import Vue from 'vue'

Vue.component('async-example', function (resolve, reject) {
    setTimeout(function () {
        // 向 `resolve` 回调传递组件定义
        resolve({
            template: '<div>异步组件加载了</div>'
        })
    }, 3000)
})

new Vue({
    el:'#root',
    template:`
    <div>
        实例挂载
        <async-example />
    </div>
    `
})