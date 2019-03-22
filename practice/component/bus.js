import Vue from 'vue'

const bus = new Vue({

})

Vue.component('component-a', {
    template: `<button @click="handleEvent">传递事件</button>`,
    methods: {
        handleEvent() {
            bus.$emit('on-message', '来自组件 com-a 的内容')
        }
    }
})

const ComponentB = {
    template: `<div>这是组件 B {{ message }}</div> `,
    data() {
        return {
            message: ''
        }
    },
    mounted() {
        bus.$on('on-message', (msg) => {
            this.message = msg
        })
    }
}

const app = new Vue({
    el: '#root',
    components: {
        Comb: ComponentB
    },
    template: `
        <div>
            <component-a />
            <comb />
        </div>
    `
})