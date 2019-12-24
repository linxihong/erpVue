<template>
    <div class="f-content f-iframe">
        <iframe :src="durl" frameborder="0" ></iframe>
    </div>
</template>
<script type="es6">
    export default {
        name: 'hello',
        data() {
            return {
                durl:'http://www.bing.com'
            }
        },
        watch:{
            "$route":"init",
            "$store.state.activenavItem":"init",
        },
        mounted() {
            this.init();
        },
        methods: {
            init(){
                this.durl = this.$store.state.activenavItem.defaulturl;
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less" type="text/less">
    .f-iframe{
        width: 100%;
        height: 100%;
        overflow: hidden;

        iframe{
            width: 100%;
            height: 100%;
        }
    }
</style>
