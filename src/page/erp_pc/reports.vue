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
                durl:''
            }
        },
        watch:{
            "$route":"init",
        },
        mounted() {
            this.init();
        },
        methods: {
            init(){
                this.getlist();
            },
            getlist(){
                this.tableData = [];
                this.getAjax('/report/reportForm/'+this.$route.params.id,{
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if (result.status == '200') {
                        this.durl = result.data;
                    }
                })
            }
        }
    }
</script>
<style lang="less" scoped type="text/less">
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
