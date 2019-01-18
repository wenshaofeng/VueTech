<template>
    <!-- app.vue 的template标签内只能有一个节点 -->
    <div id="app">
        <div id="cover"></div>
        <APP_Header></APP_Header>
        <router-link to='/app/123'>app123</router-link>
        <router-link to='/app/456'>app456</router-link>
        <router-link to='/app/789'>app789</router-link>
        <router-link to='/login'>login</router-link>
        <router-view />
        <!-- <APP_Todo></APP_Todo> -->
        <APP_Footer></APP_Footer>
    </div>
</template>

<script>
    // 引入header.vue组件
    import APP_Header from './layout/header.vue';

    // 引入footer.jsx组件
    import APP_Footer from './layout/footer.jsx';

    // 引入todo.vue组件
    import APP_Todo from './views/todo/todo.vue';

    export default {
        // 声明组件，之后便可以使用组件标签
        components: {
            APP_Header,
            APP_Footer,
            APP_Todo
        }
    }
</script>

<!-- 设置scoped 表示当前组件下的id只在当前组件起作用，不会跟其他组件引起冲突 -->
<style lang="stylus" scoped>
    #app {
        position absolute left 0 right 0 top 0 bottom 0
    }

    #cover {
        position absolute left 0 right 0 top 0 bottom 0 background-color #555 opacity 0.5 z-index -1
    }
</style>