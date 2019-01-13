## Vue的各个版本
有无`runtime`的区别:有`runtime`的时候无法写`template`的配置项 

```javascript
import Vue from 'vue'

const div = document.createElement('div')
document.body.appendChild(div)

new Vue({
    el:div,
    template:`<div> this is content </div>`
})
```
![](https://upload-images.jianshu.io/upload_images/9249356-365307022b545eb3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

需要加入配置,更改版本
```javascript
resolve:{
    alias:{
        'vue':path.join(__dirname,'../node_modules/vue/dist/vue.esm.js')
    }
}

```

## Vue的实例

两种挂载Vue实例的方式

```javascript
const app = new Vue({
    template:`<div> this is content </div>`
})

app.$mount('#root')

-----------el属性-------------
const app = new Vue({
    el:"#root",
    template:`<div> this is content </div>`
})
```

在Vue实例中的watch 属性和 app.$watch 的区别 ： 
watch 属性会在组件被销毁的时候自动解绑，而 app.$watch 需要我们手动调用 unWatch()来解绑，避免内存泄漏

```javascript
const unWatch = app.$watch('text', (newText, oldText) => {
    console.log(`${newText} : ${oldText}`)
  })
  setTimeout(() => {
    unWatch()
  }, 8000)

```

Vue中的渲染的过程其实是异步的，比如下面代码中的text值改变了5次，但是Vue是在最后一次性把它渲染到DOM上去的

```javascript
setInterval(() => {
    app.text += 1
    app.text += 1
    app.text += 1
    app.text += 1
    app.text += 1
    //   app.$options.data.text += 1
    //   app.$data.text += 1
}, 1000)
```

## Vue的生命周期

组件销毁时，会解除所有的事件监听以及 `watch`

```javascript
 beforeCreate () {
    console.log(this.$el,this.$data, 'beforeCreate')
  },
  created () {
    console.log(this.$el,this.$data.text, 'created')
  },
  beforeMount () {
    console.log(this.$el,this.$data.text, 'beforeMount')
  },
  mounted () {
    console.log(this.$el,this.$data.text, 'mounted')
  },
```

![](https://upload-images.jianshu.io/upload_images/9249356-99402fbfcd2a01cb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 从上图中可以看出，在`created`生命周期时，是无法进行DOM的操作的，因为页面 DOM节点 还未挂载,但是此时可以修改数据
- created 和 mounted 这两个生命周期在组件渲染时只会被调用一次，且在使用服务端渲染(SSR) 的时候，`mounted`&&`beforeMount` 是不会被调用的
- .vue 文件开发时，是没有`template`的，`vue-loader`帮助了我们把`template`处理成了`render function` , 因为解析`template`为一个 `render function` 是一个比较耗时的过程，所以`vue-loader`帮助我们处理了这一过程，使得页面渲染的效率变得更高

## 数据绑定

## computed 和 watch

- 如果是数值的叠加，拼装之类的，一般用`computed` ,因为`watch`的代码量相当于 `computed` 的两倍
- 如果是监听某个属性或数值的变化，然后进行下一步操作，比如发送 ajax 请求 ，那么一般使用`watch`
- **注意**：在`computed` 和 `watch` 中，我们都只是返回一个新的值，而不要去修改原来的值，否则可能造成无限循环地调用
```javascript
watch: {
    firstName: {
      handler (newName, oldName) {
        this.fullName = newName + this.firstName
      },
      immediate: true,
      deep: false
    },
    'obj.a': {
      handler () {
        console.log('obj.a changed')
      },
      immediate: true
      // deep: true // 深入观察，遍历监听的属性
    }
  },

```

## Vue 的原生指令

- `v-if` 和 `v-else`
如果一组 v-if + v-else 的元素类型相同，最好使用 key (比如两个 <div> 元素)。

默认情况下，Vue 会尽可能高效的更新 DOM。这意味着其在相同类型的元素之间切换时，会修补已存在的元素，而不是将旧的元素移除然后在同一位置添加一个新元素。如果本不相同的元素被识别为相同，则会出现意料之外的副作用。

```html
<!-- 反例 -->
<div v-if="error">
  错误：{{ error }}
</div>
<div v-else>
  {{ results }}
</div>


<!-- 好例子   -->
<div
  v-if="error"
  key="search-status"
>
  错误：{{ error }}
</div>
<div
  v-else
  key="search-results"
>
  {{ results }}
</div>


<p v-if="error">
  错误：{{ error }}
</p>
<div v-else>
  {{ results }}
</div>
```

- `v-if` 和`v-for`
**永远不要把 `v-if` 和 `v-for` 同时用在同一个元素上。**

一般我们在两种常见的情况下会倾向于这样做：

- 为了过滤一个列表中的项目 (比如 v-for="user in users" v-if="user.isActive")。在这种情形下，请将 users 替换为一个计算属性 (比如 activeUsers)，让其返回过滤后的列表。

- 为了避免渲染本应该被隐藏的列表 (比如 v-for="user in users" v-if="shouldShowUsers")。这种情形下，请将 v-if 移动至容器元素上 (比如 ul, ol)。

[官方文档具体解释](https://cn.vuejs.org/v2/style-guide/#%E9%81%BF%E5%85%8D-v-if-%E5%92%8C-v-for-%E7%94%A8%E5%9C%A8%E4%B8%80%E8%B5%B7-%E5%BF%85%E8%A6%81)

## Vue组件