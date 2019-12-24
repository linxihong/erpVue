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
                <ZLCommonSearch :fields="searchFields"  @searchII="search" ref="ZLCommonSearch"></ZLCommonSearch>
            </div>
            <!--送货单明细表(财务)-->
            <ZLCommonTable 
                :tableData="deliveryData"
                :tabHeight="tabHeight"
                :itemValues="itemValues"
                :isLoading ="isLoading"
                class="scroll-xx">
            </ZLCommonTable>
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
                deliveryData:[],
                searchFields:[
                    {
                        name: '统计时间',
                        type: 'daterange',
                        fieldName: 'datehandle',
                        value: [_this.recentDate(1), _this.recentDate(1)]
                    },{
                        name: '产线',//todo
                        type: 'select',
                        fieldName: 'ordernum_like'
                    },{
                        name: '业务员',
                        type: 'string',
                        fieldName: 'empname_like'
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
                        name: '送货单类别',
                        type: 'select',
                        fieldName: 'contracttype',
                        label: [{label:'现金合同',value:'0'},{label:'预付款合同',value:'1'},{label:'普通合同',value:'2'}]
                    }
                ],
                itemValues: [
                    {
                        name:'senddate',
                        label:'日期',
                        width:80,
                        widthI:70,
                        type:'normal'
                    },{
                        name:'createdate',
                        label:'出料时间',
                        width:80,
                        widthI:70,
                        type:'normal',
                        formatter:true
                    },{
                        name:'postdate',
                        label:'单据号',
                        width:'',
                        type:'normal'
                    },{
                        name:'contracttypename',
                        label:'类别',
                        width:60,
                        widthI:40,
                        type:'normal'
                    },{
                        name:'empname',
                        label:'业务员',
                        width:50,
                        widthI:45,
                        type: 'normal'
                    },{
                        name:'projectname',
                        label:'小票客户',
                        width:'',
                        type:'normal'
                    },{
                        name:'clientname',
                        label:'客户名称',
                        width:'',
                        type:'normal'
                    },{
                        name:'buildsite',
                        label:'工程名称',
                        width:'',
                        type:'normal'
                    },{
                        name:'buildpartname',
                        label:'工程部位',
                        width:'',
                        type:'normal'
                    },{
                        name:'amounts',
                        label:'砼等级',
                        width:50,
                        widthI:45,
                        type:'normal'
                    },{
                        name:'buildslumpname',
                        label:'塌落度(mm)',
                        width:'',
                        type:'normal'
                    },{
                        name:'goodsname',
                        label:'产品名称',
                        width:'',
                        type:'normal'
                    },{
                        name:'buildwayname',
                        label:'卸料方式',
                        width:'',
                        type:'normal'
                    },{
                        name:'sendqty',
                        label:'方量(m³)',
                        width:50,
                        widthI:45,
                        type:'normal'
                    },{
                        name:'balanceprice',
                        label:'单价(元)',
                        width:50,
                        widthI:45,
                        type:'normal'
                    },{
                        name:'sendtotalpirice',
                        label:'金额(元)',
                        width:50,
                        widthI:45,
                        type:'normal'
                    },{
                        name:'remark',//todo
                        label:'运费(元)',
                        width:50,
                        widthI:45,
                        type:'normal'
                    },{
                        name:'remark',//todo
                        label:'销售总额(元)',
                        width:50,
                        widthI:45,
                        type:'normal'
                    },{
                        name:'remark',//todo
                        label:'单据(张)',
                        width:50,
                        widthI:45,
                        type:'normal'
                    },{
                        name:'remark',//todo
                        label:'打印次数',
                        width:50,
                        widthI:45,
                        type:'normal'
                    },{
                        name:'senddriver',
                        label:'车号',
                        width:'',
                        type:'normal'
                    },{
                        name:'senddrivername',
                        label:'司机签名',
                        width:60,
                        widthI:45,
                        type:'normal'
                    },{
                        name:'remark',
                        label:'备注',
                        width:'',
                        type:'normal'
                    },{
                        name:'remarkadd',
                        label:'追加备注',
                        width:'',
                        type:'normal'
                    }
                ],
                content:'senddate_ge_date='+_this.recentDate(1)+'&senddate_le_date='+_this.recentDate(1)+'&sendstatus_gt=-1',
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

            //查询
            search(params){
                this.content = params +'&sendstatus_gt=-1';
                this.cPage=1;
                this.getlist();
            },

            //获取送货单列表
            getlist() {
                this.getAjax('/finance/erpMes/erp-prod-send?pageNo='+this.cPage+'&pageSize='+this.cSize+'&'+this.content)
                    .then(result => {
                        if(result.status === 200) {
                           if(result.data.list[0] === null){
                                this.deliveryData = [];
                                this.isLoading = false;
                            }else{
                                result.data.list.forEach((item,index) => {
                                   if(item.contracttype === 0) {
                                       item.contracttypename = '现金合同'
                                   }else if(item.contracttype === 1) {
                                       item.contracttypename = '预付款合同'
                                   }else if(item.contracttype === 2) {
                                       item.contracttypename = '普通合同'
                                   }else {
                                       item.contracttypename = null
                                   }
                                });
                                this.deliveryData = result.data.list;
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