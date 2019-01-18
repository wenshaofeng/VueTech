<template>
    <section class="real-app">
        <input type="text" class="add-input" autofocus="autofocus" :placeholder="id" @keyup.enter="addTodo">

        <!-- 使用items组件 -->
        <!-- :todo="todo" 往子组件item.vue 传入todo对象
             v-for="todo in filteredTodos" 遍历 todos 数组
             @del="deleteTodo" 接收子组件要触发的del方法
        -->
        <APP_Item :todo="todo" v-for="todo in filteredTodos" :key="todo.id" @del="deleteTodo">
        </APP_Item>
        <!--
            用 key 管理可复用的元素
            Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。
            这么做除了使 Vue 变得非常快之外，还有其它一些好处。
        -->


        <!-- 使用tabs组件 -->
        <APP_Tabs :filter="filter" :todos="todos" @toggle="toggleFilter" @clearAllCompleted="clearAllCompleted">
        </APP_Tabs>
    </section>
</template>

<script>
    import APP_Item from './items.vue';
    import APP_Tabs from './tabs.vue';

    let id = 0;

    export default {
        // data() 声明数据
        data() {
            return {
                todos: [],
                filter: 'all'
            }

        },
        props:['id'],
        // 计算
        computed: {
            filteredTodos() {
                if (this.filter === 'all') {
                    return this.todos;
                }
                const completed = this.filter === 'completed';

                // 将todos数组中，completed为true的值过滤出来，并返回一个新数组
                return this.todos.filter(todo => completed === todo.completed);

            }
        },
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

        // 组件
        components: {
            APP_Item,
            APP_Tabs,
        },

        //方法
        methods: {
            addTodo(e) {
                if (e.target.value.trim()) {
                    this.todos.unshift({
                        id: id++,
                        content: e.target.value.trim(),
                        completed: false
                    });
                    e.target.value = '';
                } else {
                    alert('傻X，输入不能为空 !-_-');
                }
            },
            deleteTodo(id) {
                this.todos.splice(this.todos.findIndex(todo => todo.id === id), 1)
            },
            toggleFilter(state) {
                this.filter = state;

            },
            clearAllCompleted() {
                // 给todos赋一个新的值（即todo.completed为false的值）
                this.todos = this.todos.filter(todo => todo.completed === false)

            }
        }
    };
</script>

<style lang="stylus" scoped>
    .real-app {
        width 600px;
        margin 0 auto;
        box-shadow 0 0 5px #666
    }

    .add-input {
        position: relative;
        margin: 0;
        width: 100%;
        font-size: 24px;
        font-family: inherit;
        font-weight: inherit;
        line-height: 1.4em;
        border: 0;
        outline: none;
        color: inherit;
        box-sizing: border-box;
        font-smoothing: antialiased;
        padding: 16px 16px 16px 36px;
        border: none;
        box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    }
</style>