<template>
    <div class="page-secondnav page-commonnav" ref="pageHeight">
        <div class="f-content">
            <div class="console-pt4 console-pb4" ref="btnHeight">
                <el-button type="text">&nbsp;</el-button>
                <div class="pull-right">
                    <el-button class="ui-color2 console-mr2" @click="initials" title="刷新"><i class="fa fa-refresh"></i></el-button>
                    <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowBot">更多查询<i class="el-icon-arrow-down margin-2"/></span>
                    <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowTop">更多查询<i class="el-icon-arrow-up margin-2"/></span>
                </div>
            </div>

            <div v-show="searchVisible" class="console-pb4" ref="formHeight">
                <ZLCommonSearch :fields="searchFields" @search="search" ref="ZLCommonSearch"></ZLCommonSearch>
            </div>
            <!--订单明细表(财务)-->
            <ZLCommonTable :tableData="orderData" :tabHeight="tabHeight" :itemValues="itemValues"  :isLoading ="isLoading"></ZLCommonTable>
            <el-pagination
                    class="console-mt5"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="cPage"
                    :page-sizes="cpageSizes"
                    :page-size="cSize"
                    layout="total, sizes, prev, pager, next"
                    :total="cTotal">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import ZLCommonSearch from '../../../components/ZLCommonSearch'
    import ZLCommonTable from '../../../components/ZLCommonTable'
    export default {
        data() {
            const _this = this;
            return {
                tabHeight: null,
                isLoading:true,
                orderData:[],
                searchFields:[
                    {
                        name: '统计时间',
                        type: 'daterange',
                        fieldName: 'dateRange',
                        value: [_this.recentDate(1), _this.recentDate(1)]
                    },{
                        name: '产线',//todo
                        type: 'select',
                        fieldName: 'ordernum_like'
                    },{
                        name: '业务员',
                        type: 'string',
                        fieldName: 'salesname_like'
                    },{
                        name: '客户名称',
                        type: 'string',
                        fieldName: 'clientname_like'
                    },{
                        name: '工程项目',
                        type: 'string',
                        fieldName: 'buildsite_like'
                    },{
                        name: '产品',
                        type: 'string',
                        fieldName: 'goodsname_like'
                    },{
                        name: '订单类别',
                        type: 'select',
                        fieldName: 'contracttype',
                        label: [{label:'现金合同',value:'0'},{label:'预付款合同',value:'1'},{label:'普通合同',value:'2'}]
                    }
                ],
                itemValues: [
                    {
                        name:'ordernum',
                        label:'订单编号',
                        width:90,
                        type:'normal'
                    },{
                        name:'builddate',
                        label:'送货时间',
                        width:80,
                        widthI:70,
                        type:'normal',
                        formatter:true
                    },{
                        name:'salesname',
                        label:'业务员',
                        width:60,
                        widthI:50,
                        type:'normal'
                    },{
                        name:'clientname',
                        label:'客户名称',
                        width:'',
                        type:'normal'
                    },{
                        name:'contractname',
                        label:'小票客户',
                        width:'',
                        type: 'normal'
                    },{
                        name:'buildsite',
                        label:'工程名称',
                        width:'',
                        type:'normal'
                    },{
                        name:'goodsname',
                        label:'产品名称',
                        width:'',
                        type:'normal'
                    },{
                        name:'buildslumpname',
                        label:'塌落度',
                        width:80,
                        widthI:50,
                        type:'normal'
                    },{
                        name:'buildpartname',
                        label:'浇筑部位',
                        width:100,
                        widthI:50,
                        type:'normal'
                    },{
                        name:'buildwayname',
                        label:'浇筑方式',
                        width:65,
                        widthI:50,
                        type:'normal'
                    },{
                        name:'buildlevel',
                        label:'等级强度',
                        width:65,
                        widthI:50,
                        type:'normal'
                    },{
                        name:'queryqtycnt',
                        label:'查询车次',
                        width:65,
                        widthI:50,
                        type:'normal'
                    },{
                        name:'queryqtysum',
                        label:'查询发货总量',
                        width:65,
                        widthI:50,
                        type:'normal'
                    },{
                        name:'orderqtycnt',
                        label:'订单总车次',
                        width:65,
                        widthI:50,
                        type:'normal'
                    },{
                        name:'orderqtysum',
                        label:'订单发货总量',
                        width:65,
                        widthI:50,
                        type:'normal'
                    },{
                        name:'balanceprice',
                        label:'单价',
                        width:65,
                        widthI:40,
                        type:'normal'
                    },{
                        name:'remark',
                        label:'金额',
                        width:65,
                        widthI:40,
                        type:'normal'
                    },{
                        name:'remark',
                        label:'备注',
                        width:'',
                        type:'normal'
                    }
                ],
                searchForm: {
                    builddate_ge_date:null,
                    builddate_le_date:null,
                    salesName:null,
                    clientNamae:null,
                    buildSite:null,
                    goodsName:null,
                    contracttype:null,
                    orderStatus: '-20',
                    orderType: '2',
                    orderWay: '2',
                },
                arrowBot: true,
                arrowTop: false,
                searchVisible: true,
                height: null,
                formHeight: null,
            }
        },
        components:{
            'ZLCommonSearch':ZLCommonSearch,
            'ZLCommonTable':ZLCommonTable
        },
        mounted() {
            this.init();
            setTimeout(()=>{
                this.getDivHeight();
            },20)
        },
        methods: {
            init(){
                this.getlist();
            },
            getDivHeight(){
                const pageHeight = this.$refs.pageHeight.offsetHeight;
                const btnHeight = this.$refs.btnHeight.offsetHeight;
                this.formHeight = this.$refs.formHeight.offsetHeight;
                this.height = pageHeight-btnHeight-this.$store.state.pageHeight;
                this.tabHeight = this.height-this.formHeight;
            },

            //切换显示状态
            toggleSearch(){
                this.arrowBot = !this.arrowBot;
                this.arrowTop = !this.arrowTop;
                this.searchVisible = !this.searchVisible;
                if (this.searchVisible) {
                    setTimeout(() => {
                        this.tabHeight = this.height - this.formHeight;
                    },20)
                } else {
                    this.tabHeight = this.height;
                }
            },

            //刷新
            initials(){
                this.$refs.ZLCommonSearch.init();
            },

            //搜索
            search(params) {
                this.searchForm.salesName = params.exts.salesname_like;
                this.searchForm.clientNamae = params.exts.clientname_like;
                this.searchForm.buildSite = params.exts.buildsite_like;
                this.searchForm.goodsName = params.exts.goodsname_like;
                this.searchForm.contracttype = params.exts.contracttype;
                this.searchForm.builddate_ge_date = params.exts.builddate_ge_date;
                this.searchForm.builddate_le_date = params.exts.builddate_le_date;
                this.cPage=1;
                this.getlist();
            },
            //获取订单列表
            getlist() {
                this.fetch('/mktmfc/clientOrder/getHistoryOrder?pageNo='+this.cPage+'&pageSize='+this.cSize,this.searchForm)
                    .then(result => {
                        if(result.status === 200) {
                             if(result.data.list[0] === null){
                                this.orderData = [];
                                this.isLoading = false;
                            }else{
                                this.orderData = result.data.list;
                                this.cTotal = result.data.total;
                                this.isLoading = false;
                            }
                        }else {
                            this.$message({
                                message:result.message||'系统正在升级中',
                                type:'error'
                            })
                            this.isLoading = false;
                        }
                    })
            }
        }
    }
</script>