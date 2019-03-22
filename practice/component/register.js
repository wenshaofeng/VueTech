import Vue from 'vue'
//全局注册
Vue.component('my-component', {
    template: '<div>我是全局注册的组件内容</div>'
})

const Part_Register = {
    template: `
    <div>
     我是局部注册的组件
    </div>
  `
}

new Vue({
    el: '#root',
    components: {
        Nice: Part_Register
    },
    template: `
    <div>
    <nice />
      <my-component />
      <nice />
    </div>
  `,
})