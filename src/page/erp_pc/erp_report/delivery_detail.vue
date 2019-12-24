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
                <ZLCommonSearch :fields="searchFields" @searchII="search" ref="ZLCommonSearch"></ZLCommonSearch>
            </div>
            <!--送货单明细表-->
            <ZLCommonTable :tableData="deliveryData" @detail="showDetail" :tabHeight="tabHeight" :itemValues="itemValues" :isLoading ="isLoading"></ZLCommonTable>
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
            <!--时序图-->
            <el-dialog
                    class="dialogDiv dialogDivII"
                    :show-close="false"
                    size="tiny"
                    :top="dialog_top"
                    :visible.sync="detailVisible"
                    :width='dialogW'
                    :modal="true">
                <div class="slideContent leftOffsetIII" :style='{width:dialogW}'>
                    <div class="slideTop" v-drag1>生产配送各个环节</div>
                    <div class="slideMid">
                        <sequence_chart ref="sequence" :detailVisible="detailVisible"></sequence_chart>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import ZLCommonSearch from '../../../components/ZLCommonSearch'
    import ZLCommonTable from '../../../components/ZLCommonTable'
    import sequence_chart from './report_block/sequence_chart'
    export default {
        data() {
            const _this = this;
            return {
                tabHeight: null,
                isLoading: false,
                deliveryData:[],
                searchFields:[
                    {
                        name: '统计时间',
                        type: 'daterange',
                        fieldName: 'datehandle',
                        label:'senddate',
                        value: [_this.recentDate(1), _this.recentDate(1)]
                    },{
                        name: '订单类别',
                        type: 'select',
                        fieldName: 'contracttype',
                        label: [{label:'现金合同',value:'0'},{label:'预付款合同',value:'1'},{label:'普通合同',value:'2'}]
                    },{
                        name: '订单编号',
                        type: 'string',
                        fieldName: 'ordernum_like'
                    },{
                        name: '客户名称',
                        type: 'string',
                        fieldName: 'clientname_like'
                    },{
                        name: '工程项目',
                        type: 'string',
                        fieldName: 'buildsite_like'
                    },{
                        name: '产品名称',
                        type: 'string',
                        fieldName: 'goodsname_like'
                    },{
                        name: '浇筑部位',
                        type: 'string',
                        fieldName: 'buildpartname_like'
                    },{
                        name: '业务员',
                        type: 'string',
                        fieldName: 'empname_like'
                    },
//                    {
//                        name: '送货单状态',//todo
//                        type: 'select',
//                        fieldName: 'clientcode_like'
//                    },
//                    {
//                        name: '送货单号',//todo
//                        type: 'string',
//                        fieldName: 'clientcode_like'
//                    },
                    {
                        name: '送货车号',
                        type: 'string',
                        fieldName: 'senddriver_like'
                    },{
                        name: '送货司机',
                        type: 'string',
                        fieldName: 'senddrivername_like'
                    },
//                    {
//                        name: '生产线',//todo
//                        type: 'string',
//                        fieldName: 'clientcode_like'
//                    },
//                    {
//                        name: '操作员',//todo
//                        type: 'string',
//                        fieldName: 'clientcode_like'
//                    }
                ],
                itemValues: [
                    {
                        name:'contracttypename',
                        label:'类别',
                        width:80,
                        widthI:70,
                        type:'normal'
                    },{
                        name:'sendnum',
                        label:'送货单号',
                        width:90,
                        type:'normal'
                    },{
                        name:'senddate',
                        label:'送货时间',
                        width:80,
                        widthI:70,
                        type:'normal',
                        formatter:true
                    },{
                        name:'empname',
                        label:'业务员',
                        width:60,
                        widthI:45,
                        type:'normal'
                    },{
                        name:'clientname',
                        label:'客户名称',
                        width:'',
                        type: 'normal'
                    },{
                        name:'buildsite',
                        label:'工程项目',
                        width:'',
                        type:'normal'
                    },{
                        name:'goodsname',
                        label:'产品名称',
                        width:100,
                        widthI:90,
                        type:'normal'
                    },{
                        name:'buildpartname',
                        label:'浇筑部位',
                        width:100,
                        widthI:90,
                        type:'normal'
                    },{
                        name:'buildwayname',
                        label:'浇筑方式',
                        width:65,
                        widthI:40,
                        type:'normal'
                    },{
                        name:'buildslumpname',
                        label:'塌落度',
                        width:60,
                        widthI:45,
                        type:'normal'
                    },{
                        name:'sendqty',
                        label:'送货方量',
                        width:65,
                        widthI:40,
                        type:'normal'
                    },{
                        name:'senddriver',
                        label:'送货车号',
                        width:'',
                        type:'normal'
                    },{
                        name:'senddrivername',
                        label:'送货司机',
                        width:65,
                        widthI:45,
                        type:'normal'
                    },
//                    {
//                        name:'remark',//todo
//                        label:'操作员',
//                        width:60,
//                        widthI:45,
//                        type:'normal'
//                    },
//                    {
//                        name:'remark',//todo
//                        label:'生产线',
//                        width:65,
//                        widthI:45,
//                        type:'normal'
//                    },
//                    {
//                        name:'remark',//todo
//                        label:'联系人',
//                        width:60,
//                        widthI:50,
//                        type:'normal'
//                    },
//                    {
//                        name:'remark',//todo
//                        label:'电话号码',
//                        width:'',
//                        type:'normal'
//                    },
                    {
                        name:'warnmark',
                        label:'备注',
                        width:'',
                        type:'normal'
                    }, {
                        type:'button',
                        label:'时序图',
                        width: 120,
                        buttons: [
                            {name:'detail',label:'查看'}
                        ]
                    }
                ],
                content:'senddate_ge_date='+_this.recentDate(1)+'&senddate_le_date='+_this.recentDate(1)+'&sendstatus_gt=-1',
                arrowBot: true,
                arrowTop: false,
                searchVisible: true,
                height: null,
                formHeight: null,
                detailVisible: false,
                dialogW: "850px",
                dialog_top: "100px"
            }
        },
        components:{
            ZLCommonSearch,ZLCommonTable,sequence_chart
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

            //获取送货列表
            getlist() {
                this.isLoading = true;
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
                            });
                            this.isLoading = false;
                        }
                    })
            },

            //查看时序图
            showDetail(index,rows) {
                this.detailVisible = true;
                this.$nextTick(() => {
                    this.$refs.sequence.initEchart(rows[index].sendnum);
                })
            }
        }
    }
</script>