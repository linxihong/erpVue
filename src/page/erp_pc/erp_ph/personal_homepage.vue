<template>
    <div class="page-secondnav page-commonnav" style="padding: 10px;">
        <div class="hp-wrapper">
            <div v-for="item in items" :style="{position: 'absolute',left:item.field1+'%',top:item.field2+'%',width:item.field3+'%',height:item.field4+'%'}">
                <component :is="item.itemvalue" :module="item" ref="component_ref"></component>
            </div>
        </div>
    </div>
</template>

<script>
    import HomeHeader from './homepage_block/HomeHeader'
    import TodoList from './homepage_block/TodoList'
    import Exception from './homepage_block/Exception'
    import Receive from './homepage_block/Receive'
    import PqmMetalPrice from './homepage_block/PqmMetalPrice'
    import commerceHeader from './homepage_block/commerceHeader'
    import SeventDate from './homepage_block/SeventDate'
    import AddUp from './homepage_block/AddUp'
    import IndexNew from './homepage_block/IndexNew'
    import ClientToDolist from './homepage_block/ClientToDolist'
    import orderProgress from './homepage_block/orderProgress'
    import Marrival from './homepage_block/Marrival'
    export default {
        components: {
            HomeHeader,//销售跟单头部方块
            TodoList,//待办事项
            Exception,// 銷售跟單-----订单异常
            Receive,// 客戶回款情況
            PqmMetalPrice, //今日鋁價
            commerceHeader,//商务经理头部方块
            SeventDate,//未来七天走势
            AddUp,//超期统计分析
            IndexNew,//消息通知
            ClientToDolist,//客户主页待办事项
            orderProgress,//客户主页订单进度
            Marrival,//客户主页到账提醒
        },
        data() {
            return {
                navs: this.$store.getters.getSideNavlist||[],
                sideValue: sessionStorage.getItem('sideValue')!==undefined?parseInt(sessionStorage.getItem('sideValue')):0,
                sysNav: [],
                items: [],
                position: null,
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.sysNav = this.navs[this.sideValue].children;
                this.getTemplate();
                // 点击
                // this.goTargetTag(this.filterArray(this.sysNav,'resname','系统公告'));
            },

            //获取模块
            getTemplate() {
                this.getAjax('/sys/gltype/getTemplate')
                    .then(result => {
                        if(JSON.stringify(result.data) === "{}" || result.data.length === 0 ) {
                        }else {
                            this.items = result.data[0].dicList;
                            this.position = result.data[0].roleidname;
                        }
                    })
            }
        }
    }
</script>

<style scoped>
    .hp-wrapper {
        height: 100%;
        overflow-y: hidden;
        position: relative;
    }
</style>
