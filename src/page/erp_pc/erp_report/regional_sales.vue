<template>
    <div class="page-secondnav page-commonnav">
        
        <div class="homepage-wrap">
            <!-- <div class="content">
                <div class="common" style="width:25%">
                    <div class="header">统计分析</div>
                    <div class="vue-div">
                        <jiaobanzhanzhang_clxhxx></jiaobanzhanzhang_clxhxx>
                    </div>
                </div>
            </div> -->
            <div class="content">
                <div class="common" v-for="(item,key) in items"
                     :style="{left:item.field1+'%',top:item.field2+'%',width:item.field3+'%',height:item.field4+'%'}" :key="key">
                    <div class="header">
                        <div>{{item.itemname}}</div>
                    </div>
                    <!-- <div class="iframe-div" v-if="item.remark =='iframe'">
                        <iframe frameborder="0" class="dynamic" :src="item.itemvalue"></iframe>
                    </div> -->
                    <div class="vue-div">
                        <component :is="item.itemvalue"  ref="component_ref"></component>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // import my_plan from './ph_block/my_plan'
    // import my_point from './ph_block/my_point'
    // import public_notice from './ph_block/public_notice'
    // import order_count from './ph_block/order_count'    hot_product   lastyear_sales
    export default {
        components: {
            //各镇街排名
            'street_ranking':resolve => require(['./report_block/street_ranking'], resolve),
            //市场分布
            'market_distributed':resolve => require(['./report_block/market_distributed'], resolve),
            //达成指标
            'reached_index':resolve => require(['./report_block/reached_index'], resolve),
            //热门产品
            'hot_product':resolve => require(['./report_block/hot_product'], resolve),
            //历年销售对比
            'lastyear_sales':resolve => require(['./report_block/lastyear_sales'], resolve),
            //工程排行
            'project_type':resolve => require(['./report_block/project_type'], resolve),
            //销售方量
            'sales_qty':resolve => require(['./report_block/sales_qty'], resolve),
        },
        data() {
            return {
                navs:this.$store.getters.getSideNavlist||[],
                sideValue: sessionStorage.getItem('sideValue')!==undefined?parseInt(sessionStorage.getItem('sideValue')):0,
                sysNav: [],
                items:[
                    {field1:'0',field2:'0',field3:'30',field4:'32',itemvalue:'street_ranking',itemname:'各镇街排名'},
                    {field1:'31',field2:'0',field3:'40',field4:'70',itemvalue:'market_distributed',itemname:'市场分布图'},
                    {field1:'72',field2:'0',field3:'28',field4:'32',itemvalue:'reached_index',itemname:'达成指标'},
                    {field1:'0',field2:'34',field3:'30',field4:'32',itemvalue:'hot_product',itemname:'热门产品'},
                    {field1:'72',field2:'34',field3:'28',field4:'36',itemvalue:'lastyear_sales',itemname:'历年销售对比'},
                    {field1:'0',field2:'68',field3:'30',field4:'32',itemvalue:'project_type',itemname:'工程排名'},
                    {field1:'31',field2:'72',field3:'69',field4:'28',itemvalue:'sales_qty',itemname:'销售方量'},
                ],
                position:null,
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                //this.sysNav = this.navs[this.sideValue].children;
                this.getTemplate();
            },

            //获取模块
            getTemplate() {
                
            },

        }
    }
</script>