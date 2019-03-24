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


>Vue 实例的生命周期函数（官方11个）：
beforeCreate：在实例部分（事件/生命周期）初始化完成之后调用。
created：在完成外部的注入/双向的绑定等的初始化之后调用。
beforeMount：在页面渲染之前执行。
mounted：dom 元素在挂载到页面之后执行。

>首次加载页面时，不会走这两个钩子，只有当数据发生改变时才会执行：
beforeUpdate：数据改变，还没重新渲染之前执行。
updated：渲染数据完成之后执行。

>执行销毁需要调用：vm.$destroy()
beforeDestroy：实例销毁之前执行。
destroyed：实例销毁之后执行。

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

- 在 `beforeCreate` 钩子函数调用的时候，是获取不到 `props` 或者 `data` 中的数据的，因为这些数据的初始化都在 `initState` 中。

- created 和 mounted 这两个生命周期在组件渲染时只会被调用一次，且在使用服务端渲染(SSR) 的时候，`mounted`&&`beforeMount` 是不会被调用的
**注意** mounted 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 vm.$nextTick 替换掉 mounted：

- .vue 文件开发时，是没有`template`的，`vue-loader`帮助了我们把`template`处理成了`render function` , 因为解析`template`为一个 `render function` 是一个比较耗时的过程，所以`vue-loader`帮助我们处理了这一过程，使得页面渲染的效率变得更高

- 另外还有 keep-alive 独有的生命周期，分别为 `activated`和 `deactivated` 。用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 `deactivated` 钩子函数，命中缓存渲染后会执行 `actived` 钩子函数。

- 最后就是销毁组件的钩子函数 `beforeDestroy` 和 `destroyed`。前者适合移除事件、定时器等等，否则可能会引起内存泄露的问题。然后进行一系列的销毁操作，如果有子组件的话，也会递归销毁子组件，所有子组件都销毁完毕后才会执行根组件的 `destroyed` 钩子函数。

### Vue父子组件的渲染顺序
![](https://upload-images.jianshu.io/upload_images/9249356-469e5bd1002a6614.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 加载渲染过程

父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted

- 子组件更新过程

父beforeUpdate->子beforeUpdate->子updated->父updated

- 父组件更新

父beforeUpdate->父updated

- 销毁过程

父beforeDestroy->子beforeDestroy->子destroyed->父destroyed


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

### 组件注册

```javascript
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
```

![](https://upload-images.jianshu.io/upload_images/9249356-965c907d7e670cf6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**全局注册的行为必须在根 Vue 实例 (通过 new Vue) 创建之前发生。**

### 组件继承

组件继承`extends`的使用场景：
对于一个含有多个配置项的公用组件( 功能比较泛的组件 )，那么在调用的时候可以先通过`extends`的方式继承公用组件，然后覆盖它的配置项，再进行调用

#### - `extend` 合并

```javascript

const component = {
  props: {
    active: Boolean,
    propOne: {
      required : true
    }
  },
  template: `
    <div>
      <input type="text" v-model="text"/>
      <span @click="handleChange">{{propOne}}</span>
      <span v-show="active">see me if active</span>
    </div>
  `,
  data () {
    return {
      text: 0
    }
  },
  mounted () {
    console.log('comp mounted')
  },
  methods: {
    handleChange () {
      this.$emit('change')
    }
  }
}

...

// extend 方法需要使用 propsData 传入
const CompVue = Vue.extend(component)

new CompVue({
  el: '#root',
  propsData: {
    propOne: 'xxx科比'
  },
  data: {
    text: '123'   
  },
  mounted () {
    console.log('instance mounted kebi')
  }
})

```
new 一个新的实例 CompVue 的 data会覆盖 配置里的 data ，而生命周期函数则两个都会执行
![](https://upload-images.jianshu.io/upload_images/9249356-bbc81e646d1d4a53.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

![](https://upload-images.jianshu.io/upload_images/9249356-e12926b95512fa2d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 继承方式 2 

```javascript
const component2 = {
  extends: component,
  data () {
    return {
      text: 1
    }
  },
  mounted () {
    console.log('comp2 mounted')
  }
}
...

new Vue({
  el: '#root',
  components: {
    Comp: component2
  },
  template:`
  <comp></comp>
  `
})
```

![](https://upload-images.jianshu.io/upload_images/9249356-702e89d25e8b3578.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#### $parent 

```javascript
const component2 = {
  // parent: parent,
  extends: component,
  data () {
    return {
      text: 1
    }
  },
  mounted () {
    console.log('comp2 mounted')
    console.log(this.$parent.$options.name)
    this.$parent.text = '12345'
  }
}

...

new Vue({
  name: 'Root',
  el: '#root',
  mounted () {
    
  },
  components: {
    Comp: component2
  },
  data: {
    text: 2333
  },
  template: `
    <div>
      <span>{{text}}</span>
      <comp></comp>
    </div>
  `
})

```

![](https://upload-images.jianshu.io/upload_images/9249356-3bb058f717513232.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到，子组件可以通过 `this.$parent`方法去改变父组件的属性(**但是不推荐！**)

##### 指定 parent

```javascript
const component2 = {
  parent: parent,
  extends: component,
  data () {
    return {
      text: 1
    }
  },
  mounted () {
    console.log('comp2 mounted')
    console.log(this.$parent.$options.name)  
    this.$parent.text = '12345'
  }
}

...
const parent = new Vue({
  name: 'parent'
})

...
new Vue({
  name: 'Root',
  el: '#root',
  components: {
    Comp: component2
  },
  data: {
    text: 2333
  },
  template: `
    <div>
      <span>{{text}}</span>
      <comp></comp>
    </div>
  `
})
```


```javascript
const component2 = {
  extends: component,
  data () {
    return {
      text: 1
    }
  },
  mounted () {
    console.log('comp2 mounted')
    console.log(this.$parent.$options.name)  
    this.$parent.text = '12345'
  }
}
...
const parent = new Vue({
  name: 'parent'
})

...
new Vue({
  name: 'Root',
  el: '#root',
  mounted () {
    console.log(this.$parent.$options.name)  
  }
  components: {
    Comp: component2
  },
  data: {
    text: 2333
  },
  template: `
    <div>
      <span>{{text}}</span>
      <comp></comp>
    </div>
  `
})

```
![](https://upload-images.jianshu.io/upload_images/9249356-087578143a5e422a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 可以看出我们在通过 new 一个 Vue 实例的时候，才可以去指定 `parent` 是什么
- 而如果是通过声明一个组件 ，因为组件是通过模板去编译的，它的`parent`是在Vue在渲染的过程中指定的，我们无法去修改它的`parent`




### 组件的自定义双向绑定

### BUS通信

### 动态组件、异步组件

### 组件之间的循环引用

- 递归组件(循环引用自身)

- 组件之间的循环引用


### 手动挂载 (比如 message 弹窗组件)

### 组件的高级属性

### 组件的 render function

>template 转换成 render function 

```javascript
//template
template: `
    <comp-one ref="comp">
      <span ref="span">{{value}}</span>
    </comp-one>
`,

// template 会被编译为一个 render 函数
render (createElement) {
    // return this.$createElement()
    return createElement(
      'comp-one',  
      {
        ref: 'comp',
      },
      [
        createElement('span', {
          ref: 'span'
        }, this.value)
      ]
    )
  }
})


```

>createElement(one,two,three) 函数 有三个参数， 

- one: 是一个要创建的节点的名字(该节点可以是一个DOM 节点元素，也可以是一个组件)
- two: 节点的一些属性( data )
- three: 节点里的内容，可以是一个子节点(数组)，也可以是字符串

createElement会创建一个Vnode 类，也就是Vue的虚拟DOM，会存在内存中，跟真实的DOM进行对比


### 函数化组件( funtional )
Vue.js 提供了一个 functional 的布尔值选项，设置为true 可以使组件无状态和无实例，也就是没有data 和 this上下文，这样用 render 函数返回虚拟节点可以更容易渲染，因为函数化组件只是一个函数，渲染开销要小很多
