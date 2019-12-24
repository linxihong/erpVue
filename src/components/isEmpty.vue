/**
* @date 2017/11/22
* @desc 暂无数据
**/
<template>
    <div>
        <div style="min-height: 50px;" v-if="JSON.stringify(obj)=='{}'">
            <span class="el-tree__empty-text">暂无数据</span>
        </div>
        <slot  v-if="JSON.stringify(obj)!='{}'"></slot>
    </div>
</template>

<script type="es6">
    export default {
        name: 'topbar',
        data () {
            return {

            }
        },
        props: ['obj'],
        watch: {

        },
        mounted(){

        },
        methods: {

        }
    }
</script>