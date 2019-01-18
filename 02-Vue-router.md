## VUE 路由META作用及在路由中添加PROPS作用
vue路由meta:有利于seo，我们在html中加入meta标签，就是有利于处理seo，搜索引擎

## 路由组件传参
在组件中使用 `$route` 会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的 URL 上使用，限制了其灵活性。

使用 `props` 将组件和路由解耦：
取代与 `$route` 的耦合

```javascript
export default [
  {
  path: '/app/:id',
    name:'app',
    props:true,//这里添加props属性并且设置为true
    meta:'',
  component: Todo,
    children:[{
    path:'test',
      component :Login
    }]
},
```
在组件中mouted生命周期函数里就能看到相应的id

```html
<template>
    <div>todo
        <router-view></router-view>
    </div>
</template>

<script>
     export default {
          name: "todo",
       props:['id'],
       mounted () {
           console.log(this.$route.params.id);
            console.log(this.id)
       }

     }
</script>
```

尽量使用这种方法，不要使用this.$route.paramas,让组件和路由解耦尽量不要在组件中使用$routes,$router方法，当然也可以获取query中的参数例如给组件加代码如下
```html
<template>
  <div id="app">
    <router-link to="/app/123?a=234&b=345">todo</router-link>
    <router-link :to="{name:'login'}">注册</router-link>
    <router-view/>
  </div>
</template>
```
路由设置如下：
```javascript
export default [
  {
  path: '/app/:id',
    name:'app',
    props:(route) =>({id:route.query.b}),
    meta:'',
  component: Todo,
    children:[{
    path:'test',
      component :Login
    }]
},
```

## 导航守卫

>“导航”表示路由正在发生改变。
**参数或查询的改变并不会触发进入/离开的导航守卫。**你可以通过观察 `$route` 对象来应对这些变化，或使用 `beforeRouteUpdate` 的组件内守卫。

### 全局守卫

```javascript

router.beforeEach((to, from, next) => {
    console.log('beforeEach 执行了');
    next()
})

router.beforeResolve((to, from, next) => {
  
    console.log('beforeResolve 执行了');   
    next()
})

router.afterEach((to,from)=>{
    console.log('afterEach 执行了');   
})

```
每次导航跳转都会触发全局守卫
使用场景：
- 验证用户登录( 如判断未登录，就`next('/login')`)


### 局部守卫
- 路由配置守卫
- 组件内守卫 (**注意**：`beforeRouteEnter` 中并不能拿到组件的 this)
- `beforeRouteUpdate`使用场景：当在相同的路径显示的是同一个组件的情况下，可能会用到

![](https://upload-images.jianshu.io/upload_images/9249356-6b6f20f4fb802f53.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


```javascript
//路由配置守卫
{
    path: '/app',
    component: Todo,
    beforeEnter: (to, from, next) => {
      console.log('进入了app组件');
      next()

    }
},  

会在 beforeEach 和 beforeResolve 之间执行

//组件内守卫
<router-link to='/app/123'>app123</router-link>
<router-link to='/app/456'>app456</router-link>
<router-link to='/app/789'>app789</router-link>

beforeRouteEnter(to, from, next) {
    console.log("todo 被执行");
    console.log(this);
    next()

    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
},
beforeRouteUpdate(to, from, next) {
    console.log("todo 更新");
    console.log(this);
    next()
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
},
beforeRouteLeave(to, from, next) {
    console.log("todo 离开");
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    next()
},

```


### 完整的导航解析流程
- 导航被触发。
- 在失活的组件里调用离开守卫。
- 调用全局的 beforeEach 守卫。
- 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
- 在路由配置里调用 beforeEnter。
- 解析异步路由组件。
- 在被激活的组件里调用 beforeRouteEnter。
- 调用全局的 beforeResolve 守卫 (2.5+)。
- 导航被确认。
- 调用全局的 afterEach 钩子。
- 触发 DOM 更新。
- 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

## 路由懒加载