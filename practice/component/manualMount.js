import Vue from 'vue'

const myComponent = Vue.extend({
    template: `<div> from extend 手动挂载 </div>`
})

new myComponent().$mount('#root')