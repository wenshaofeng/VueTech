import Vue from 'vue'

const app = new Vue({
    el: '#root',
    template: `
    <div ref='div'>{{text}}</div>
  `,
    data: {
        text: 1
    }
})

// app.$mount('#root')

setInterval(() => {
    app.text += 1
    app.text += 1
    app.text += 1
    app.text += 1
    app.text += 1
    //   app.$options.data.text += 1
    //   app.$data.text += 1
}, 1000)

// console.log(app.$data)
// console.log(app.$props)  // undefined
// console.log(app.$el) // <div> 1 </div> 
console.log(app)

// app.$options.render = (h) => {
//   return h('div', {}, 'new render function')
// }

// console.log(app.$root === app)
// console.log(app.$children)
// console.log(app.$slots)
// console.log(app.$scopedSlots)
// console.log(app.$refs)
// console.log(app.$isServer) // 服务端渲染时用到

// 在Vue实例中的watch 属性和 app.$watch 的区别 ： 
// watch 属性会在组件被销毁的时候自动解绑，而 app.$watch 需要我们手动调用 unWatch()来解绑，避免内存泄漏

const unWatch = app.$watch('text', (newText, oldText) => {
    console.log(`${newText} : ${oldText}`)
})
setTimeout(() => {
    unWatch()
}, 8000)

