/*
* index.js
* 项目入口文件
* */
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'

// 引入全局CSS样式
import './assets/styles/global.styl'
import createRouter from './config/router'

Vue.use(VueRouter)

const router = createRouter()

router.beforeResolve((to, from, next) => {
  
    console.log('beforeResolve 执行了');   
    next()
})


router.beforeEach((to, from, next) => {
   
    console.log('beforeEach 执行了');
    next()
})



router.afterEach((to,from)=>{
    console.log('afterEach 执行了');   
})

// 在body下创建一个根节点
// const root = document.createElement('div');
// document.body.appendChild(root);

// 将根节点root注入到app.vue组件中
new Vue({
    router,
    render: (h) => h(App)
}).$mount('#root');

