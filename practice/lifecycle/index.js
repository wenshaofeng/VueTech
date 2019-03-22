import Vue from 'vue'

const comA_son = {
  template: `<div>
  组件 A 的子组件 
  {{Bdata}}
  </div>`,
  props: ['sonPropsData'],
  data() {
    return {
      Bdata: `子组件的数据`
    }
  },
  beforeCreate() {
    console.log(this.$el, this.$data,this.$props, '孙子组件beforeCreate')
  },
  created() {
    console.log(this.$el, this.$data.Bdata,this.$props.sonPropsData, '孙子组件created')
  },
  beforeMount() {
    console.log(this.$el, this.$data.Bdata,this.$props.sonPropsData, '孙子组件beforeMount')
  },

  mounted() {
    console.log(this.$el,this.$data.Bdata,this.$props.sonPropsData, '孙子组件mounted')
  },
}

const comA = {
  template: `<div>
  组件 A 
  {{Adata}}
    <div>
      <com-b :sonPropsData='msg'></com-b>  
     </div>
  </div>`,
  props: ['propsData'],
  data() {
    return {
      Adata: `组件A的 data`,
      msg:'传给B的数据'
    }
  },
  components: {
    comB: comA_son
  },
  beforeCreate() {
    console.log(this.$el, this.$data,this.$props, '子组件1 beforeCreate')
  },
  created() {
    console.log(this.$el, this.$data.Adata,this.$props.propsData, '子组件1 created')
  },
  beforeMount() {
    console.log(this.$el, this.$data.Adata,this.$props.propsData, '子组件1 beforeMount')
  },
  mounted() {
    console.log(this.$el, this.$data.Adata,this.$props.propsData, '子组件1 mounted')
  }
}

const comC = {
  template: `<div>
  组件 C  
  {{Cdata}}
  </div>`,
  props: ['propsData'],
  data() {
    return {
      Cdata: `组件C的 data`,
    }
  },
  beforeCreate() {
    console.log(this.$el, this.$data,this.$props, '子组件2  beforeCreate')
  },
  created() {
    console.log(this.$el, this.$data.Cdata,this.$props.propsData, '子组件2 created')
  },
  beforeMount() {
    console.log(this.$el, this.$data.Cdata,this.$props.propsData, '子组件2 beforeMount')
  },
  mounted() {
    console.log(this.$el, this.$data.Cdata,this.$props.propsData, '子组件2 mounted')
  },
 
}

const app = new Vue({
  // el: '#root',
  template: `<div>
  {{text}}
  <com-a :propsData="sonData"></com-a>
  <com-c :propsData="sonData"></com-c>
  </div>`,
  data: {
    text: 0,
    sonData: '父组件传递过来的 数据'
  },
  components: {
    comA,
    comC
  },
  beforeCreate() {
    console.log(this, this.$el, this._data, 'beforeCreate')
  },
  created() {
    console.log(this.$el, this.$data.text, 'created')
  },
  beforeMount() {
    console.log(this.$el, this.$data.text, 'beforeMount')
  },
  mounted() {
    console.log(this.$el, this.$data.text, 'mounted')
  },
  beforeUpdate() {
    console.log(this, 'beforeUpdate')
  },
  updated() {
    console.log(this, 'updated')
  },
  activated() {
    console.log(this, 'activated')
  },
  deactivated() {
    console.log(this, 'deactivated')
  },
  beforeDestroy() {
    console.log(this, 'beforeDestroy')
  },
  destroyed() {
    console.log(this, 'destroyed')
  },
  // render (h) {
  //   throw new TypeError('render reeor')
  //   console.log('render function invoked')
  //   return h('div', {}, this.text)
  // },
  // renderError (h, err) {
  //   return h('div', {}, err.stack)
  // },
  errorCaptured() {
    // 会向上冒泡, 正式环境可以使用
  }
})

app.$mount('#root')
// beforemounted 和 mounted 在this.$el上面有区别，仔细对比下

// setInterval(() => { // 改变data触发hook:updated
//   app.text = app.text + 1
// }, 1000)

// setTimeout(() => {
//   app.$destroy()
// }, 1000)
