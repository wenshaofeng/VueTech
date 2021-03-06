import Vue from 'vue'

new Vue({
  el: '#root',
  // template: `
  //   <div>
  //     <!--{{isActive ? 'active' : 'not active'}}-->
  //     <!--{{arr.join(' ')}}-->
  //     <!--{{Date.now()}}-->
  //     <!--{{html}}-->
  //     <div :id="aaa" @click="handleClick">
  //       <p v-html="html">
  //         {{html}}
  //       </p>
  //     </div>
  //   </div>
  // `,
  template: `
    <!--<div :class="{ active: !isActive }">-->
    <!--<div :class="[ isActive ? 'active' : ' ' ]">-->
    <div
      :class="[{ active: isActive }]"
      :style="[styles, styles2]"
    >
      <p>
        {{getJoinedArr(arr)}}
      </p>
      <p> {{Date.now()}} </p>
    </div>
  `,
  data: {
    isActive: false,
    arr: [1, 2, 3],
    html: '<span>123</span>',
    aaa: 'main',
    styles: {
      color: 'red',
      appearance: 'none'
    },
    styles2: {
      color: 'black'
    }
  },
  methods: {
    handleClick () {
      alert('checked') //eslint-disable-line
    },
    getJoinedArr (arr) {
      return arr.join('-')
    }
  }
})
