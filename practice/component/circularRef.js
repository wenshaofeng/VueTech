import Vue from 'vue'

const recursiveCom = {
    template: `
   <div>
        <div class="list-item" :style="styleObject" v-for="(item, index) in list" :key="index">
            <div class="item-name">
                <span>{{item.name}}</span>
            </div>
            <div v-if="item.children" class="children-item">
                <list :list="item.children"></list>
            </div>
        </div>
    </div>
      `
    ,
    name: 'List',
    data() {
        return {
            styleObject: {
                marginLeft: '20px'
            }
        }
    },
    props: {
        list: Array
    }
}

new Vue({
    el: '#root',
    components: {
        List: recursiveCom
    },
    template: `
     <list :list="list"></list>
    `,
    data: {
        list: [
            {
                name: "经济",
                children: [{
                    name: "如家",
                    children: [{
                        name: "长江路-如家"
                    }, {
                        name: "望江路-如家"
                    }]
                }, {
                    name: "7天",
                    children: [{
                        name: "长江路-7天"
                    }, {
                        name: "望江路-7天"
                    }]
                }]
            },
            {
                name: "舒适",
                children: [{
                    name: "智选假日"
                }, {
                    name: "全级"
                }]
            },
            {
                name: "高档"
            }
        ]
    }
})