<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap"  v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleMulAudit" :disabled="otherVariable.isSaving">批量审核</el-button>
                <el-button @click="handleRefresh">刷新</el-button>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="searchProp"
                :searchForm="searchForm"
                @selectChange="selectChange"
                @getData="getSearchList"
            >
                <template slot="search-other-btn">
                    <el-button @click="handleReset">重置</el-button>
                </template>
            </CommonSearch>
            <!--表格区域-->
            <CommonTable
                v-if="isResize"
                ref="commontable"
                v-loading="loadingI"
                :mainHeight="mainHeight"
                :isShowStatus="isShowStatus"
                :propData="tableProp"
                :otherVariable="otherVariable"
                :tableData="tableData"
                @handleDetail="handleDetail"
                @handleSelectionChange="handleSelectionChange"
            >
            </CommonTable>
            <!--分页区域-->
            <CommonPagination
                :pageObj="pageObj"
                @getData="getData"
            >
            </CommonPagination>
        </div>
        <div class="common-right" :style="{width: otherVariable.contentWidth + '%'}">
            <!--编辑/详情区域-->
            <CommonDetailX
                :otherVariable="otherVariable"
                :propData="formProp"
                :detailForm="detailForm"
                @toggleSpread="toggleSpread"
            >
                <!--详情头部-->
                <template slot="header">
                    <div class="header-form" ref="headForm">
                        <template v-for="item in formProp">
                            <div v-if="item.type === 'outter'">
                                <span>{{ item.name ? (item.name + ':') : '' }}</span>
                                <span>{{ detailForm[item.prop] }}</span>
                            </div>
                        </template>
                    </div>
                </template>
                <!--头部按钮-->
                <template slot="main-btn-wrap">
                    <div v-if="showButton" class="xs-audit-icon" @click="!otherVariable.isSaving && handleAudit()" :class="otherVariable.isSaving ? 'banClick' : ''">审核</div>
                    <!--v-if="showUnAudit"-->
                    <div v-if="false" class="xs-unaudit-icon" @click="handleUnAudit">反审</div>
                    <i v-if="detailId" class="icon-print" title="打印" @click="handlePrint" style="right: 30px;"></i>
                </template>
                <!--头部标题-->
                <template slot="head-form-title">
                    <div class="head-form-title">
                        <span>&nbsp;{{ detailForm.clientName }}</span>
                        <span></span>
                    </div>
                </template>
                <!--头部表单-->
                <template slot="head-form-content">
                    <div class="head-form-content">
                        <template v-for="item in formProp">
                            <div v-if="item.type === 'inner' && !item.isLong">
                                <span>{{ item.name }}：</span>
                                <span>{{ detailForm[item.prop] }}</span>
                            </div>
                        </template>
                    </div>
                    <div class="project-wrap">
                        <div>工程名称：</div>
                        <div class="scrollBar" :title="detailForm.projectName">
                            &nbsp;{{ detailForm.projectName }}{{ detailForm.projectCode?("("+ detailForm.projectCode + ")"):"" }}
                        </div>
                    </div>
                    <div class="remark-wrap scrollBar">
                        <div>备注：</div>
                        <div class="headspan" :title="detailForm.remark">{{ detailForm.remark }}</div>
                    </div>
                </template>
                <!--详情内容-->
                <template slot="common-content">
                    <!--tab区域-->
                    <el-tabs v-model="activeName" class="common-content-tab order_style">
                        <el-tab-pane label="订单明细" name="first">
                            <CommonTable
                                v-if="isResize"
                                v-loading="loadingI"
                                ref="childTable"
                                :isSum="true"
                                :sumParam = {digit:12,theoryWght:15}
                                :isCenter="true"
                                :isMulTable="true"
                                :isNotMulSelect="false"
                                :otherVariable="otherVariable"
                                :formTableData="tabDataI"
                                :formPropTable="tabPropI"
                                :tableHeight="tableHeight"
                            >
                            </CommonTable>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </CommonDetailX>
        </div>
    </div>
</template>

<script>
    import CommonMixins from '$src/components/CommonMixins'
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    import CommonDetailX from '$src/components/CommonDetailX'
    export default {
        mixins: [CommonMixins],
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetailX
        },
        data() {
            return {
                tableHeight: this.$store.state.screenHei*0.60,
                mainHeight: 716,
                isShowNotAllowed: false,
                loadingI:false,
                hanleNo:'',
                isShowStatus: {
                    isMore: false,
                    isRead: true
                },
                isResize: true,

                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    popupTitle: '',
                    isMulSelect: true,
                    isInlineForm: true,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    isReadTable: true,
                    isSaving:false,
                },
                tempWidth: null,
                tableData: [],
                showButton: false,
                showUnAudit: false,
                //搜索映射表
                searchProp: [
                    {
                        name:'订单号',
                        prop:'refDocCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入订单号'
                    },
                    {
                        name:'客户代码',
                        prop:'clientCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'客户名称',
                        prop:'clientName',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'订单状态',
                        prop:'tempStatus',
                        type:'selectChange',
                        selectList:[{value:1,label:'全部'},{value:2,label:'未审核'},{value:3,label:'已审核'}],
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'下单日期',
                        prop:'orderDocDateStart',
                        type:'date',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'至',
                        prop:'orderDocDateEnd',
                        type:'date',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'网单',
                        prop:'docCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'销售公司',
                        prop:'companyName',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'供货公司',
                        prop:'supplyCompanyName',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                ],
                //详情映射列表
                formProp: [
                    {name:'订单编号',prop:'refDocCode',type:'outter'},
                    {name:'下单日期',prop:'docDate',type:'outter'},
                    {name:'交货日期',prop:'deliveryDate',type:'outter'},
                    {name:'单据状态',prop:'docStatusName',type:'outter'},
                    {name:'',prop:'prdMethodName',type:'outter'},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'经销商',prop:'clientCode2',type:'inner'},
                    {name:'单据类型',prop:'docType',type:'inner'},
                    {name:'业务员',prop:'salesName',type:'inner'},
                    {name:'贴膜要求',prop:'padPastingMethodName',type:'inner'},
                    {name:'货期等级',prop:'deliveryLevelName',type:'inner'},
                    {name:'生产基地',prop:'supplyCompanyName',type:'inner'},
                    {name:'跟单员',prop:'followName',type:'inner'},
                    {name:'包装方式',prop:'packMethodName',type:'inner'},
                    {name:'开票类型',prop:'vatTypeName',type:'inner'},
                    {name:'铝价日期',prop:'alPriceDate',type:'inner'},
                    {name:'喷码',prop:'usrTxt1Name',type:'inner'},
                    {name:'备注',prop:'remark',type:'inner',isLong:true}
                ],
                //表格映射列表
                tableProp: [
                    {
                        name:'fid',
                        prop:'fid',
                        type:'normal',
                        isMain:true
                    },
                    {
                        name1:'订单号/',
                        prop1:'refDocCode',
                        name2:'状态',
                        prop2:'docStatusName',
                        status: 'docStatus',
                        type:'mixinStatus',
                        hasCircleI: true,
                        width: '120'
                    },
                    {
                        name1:'单据类型/',
                        prop1:'docType',
                        name2:'下单日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '123'
                    },
                    {
                        name1:'客户/',
                        prop1:'clientCode',
                        name2:'经销商',
                        prop2:'clientCode2',
                        type:'mixin',
                        width: '100'
                    },
                    {
                        name1:'流程单号/',
                        prop1:'docCode',
                        name2:'工程名称',
                        prop2:'projectName',
                        type:'mixin',
                        width:'130',
                        tooltip:true
                    }
                ],
                searchForm: {tempStatus: 2,minStatus:50,minStatusOperator:'>=',maxStatus:100,maxStatusOperator:'<'},
                detailForm: {},
                copyForm: {},
                detailId: null,
                parentId: null,
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //详情表格内容
                tabLeft: '200px',
                activeName: 'first',
                //订单明细映射表
                tabPropI: [
                    {prop:'docItem', name:'序号',type:'normal',isShort: true,width:'40',align:'center'},
                    {prop:'itemNo', name:'项目号',type:'normal',isShort: true,width:'130'},
                    {prop:'matCode', name:'型材型号',type:'normal'},
                    {prop:'usrTxt6Name', name:'胶条规格',type:'normal'},
                    {prop:'matSeriesName', name:'型材系列',type:'normal'},
                    {prop:'matGroupAlType1', name:'型材类别',type:'normal'},
                    {prop:'cx1Name', name:'颜色代码',type:'normal'},
                    {prop:'colorDescribe', name:'颜色名称',type:'normal'},
                    {prop:'cx2Name',name:'材质',type:'normal'},
                    {prop:'cx4Name',name:'长度',type:'normal',rule:'limitLength',unit:' m',isShort: true,align:'right'},
                    {prop:'cx3Name',name:'膜厚',type:'normal',unit:'',isShort: true,align:'right'},
                    {prop:'cltMatCode', name:'自定义型号',type:'normal'},
                    {prop:'digit',name:'支数',type:'normal',isShort: true,align:'right'},
                    {prop:'meterWght',name:'米重',type:'normal',rule:'limitLength',unit:' kg/m',isShort: true,align:'right'},
                    {prop:'unitWght',name:'支重',type:'normal',rule:'limitLength',unit:' kg/pcs',isShort: true,align:'right'},
                    {prop:'theoryWght',name:'理重',type:'normal',rule:'limitLength',unit:' kg',isShort: true,align:'right'},
                    {prop:'perLotQty', name:'支/扎',type:'normal'},
                    {prop:'machineLevelName', name:'机台级别',type:'normal'},
                    {prop:'thick', name:'壁厚',type:'normal'},
                    {prop:'usrTxt1Name',name:'喷码',type:'normal'},
                    {
                        prop:'usrTxt2Name',name:'禁喷类型',type:'normal',
                        children: [
                            {prop:'banSprayType',name:'默认'},
                            {prop:'usrTxt2Name',name:'要求'}
                        ]
                    },
                    {
                        prop:'',name:'撕筋',type:'normal',
                        children: [
                            {prop:'isTear',name:'默认',type:'checkbox',width: 55, align:'center'},
                            {prop:'usrTxt3Name',name:'要求',type:'checkbox',width: 55, align:'center'}
                        ]
                    },
                    {prop:'productDescription', name:'产品描述',type:'normal'},
                    {prop:'remark',name:'备注',type:'normal',width:200}
                ],
                //订单明细数据
                tabDataI: [],
                copyDataI: [],
                //所选订单
                selectOrderList: []
            }
        },
        mounted() {
            this.getData();
            // 操作/布局相关
            this.listenScroll();
            this.listenResize();
            this.changeSize();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取主表数据
            getData() {
                this.tableData = [];
                this.fetch(`/oms/sls/SalesOrderMaster/getOrderMaster?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            this.$nextTick(() => {
                                this.$refs.commontable.renderRow(this.tableData[0].fid);
                            })
                        }else {
                            this.tabDataI = [];
                            this.copyDataI = [];
                            this.detailForm = {};
                            this.detailId = null;
                            this.parentId = null;
                            this.pageObj.commonTotal = 0;
                            this.$nextTick(() => {
                                this.$refs['childTable'].initStatus();
                            })
                        }
                    })
            },
            selectChange(val) {
                if(val === 1) {
                    this.searchForm.minStatus = 50;
                    this.searchForm.minStatusOperator = '>=';
                    delete this.searchForm.maxStatus;
                    delete this.searchForm.maxStatusOperator;
                }else if(val === 2) {
                    this.searchForm.minStatus = 50;
                    this.searchForm.minStatusOperator = '>=';
                    this.searchForm.maxStatus = 100;
                    this.searchForm.maxStatusOperator = '<';
                }else if(val === 3) {
                    this.searchForm.minStatus = 100;
                    this.searchForm.minStatusOperator = '>=';
                    delete this.searchForm.maxStatus;
                    delete this.searchForm.maxStatusOperator;
                }
            },
            //点击主表行
            handleDetail(row) {
                this.loadingI = true;
                this.isShowNotAllowed = true;
                if(row.docStatus !== 50) {
                    this.showUnAudit = true;
                    this.showButton = false
                }else {
                    this.showUnAudit = false;
                    this.showButton = true
                }
                this.tabDataI = [];
                this.copyDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.fetch('/oms/sls/SalesOrderMaster/getOrderMaster',{fid:row.fid})
                    .then(result => {
                        if(result.status === 200) {
                            this.detailForm = result.data.list[0];
                            this.copyForm = this.$lodash.cloneDeep(result.data.list[0]);
                        }else {
                            this.$message({
                                message: '请求失败',
                                type: 'warning'
                            });
                            this.detailForm = {};
                            this.copyForm = {};
                        }
                    });
                this.getAjax(`/oms/sls/SalesOrderDetail/getOrderDetail?pageSize=1000&orderMasterId=${row.fid}`)
                    .then(result => {
                        this.loadingI = false;
                        this.isShowNotAllowed = false;
                        if(result.data && result.data.list) {
                            this.tabDataI = result.data.list;
                            this.copyDataI = this.$lodash.cloneDeep(this.tabDataI);
                        }
                    })
                    .then(() => {
                        this.loadingI = false;
                        this.$refs['childTable'].initStatus();
                    });
                this.detailId = row.fid;
                this.parentId = row.parentId;
            },
            handleSelectionChange(rows) {
                this.selectOrderList = [];
                rows.forEach(item => {
                    this.selectOrderList.push(item.fid)
                })
            },
            //批量审核
            handleMulAudit() {
                if(this.selectOrderList.length) {
                    this.$confirm('是否确认审核'+this.selectOrderList.length+'条订单?','提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.fetch('/oms/sls/SalesOrderMaster/batchAuditOrder',this.selectOrderList)
                            .then(result => {
                                if(result.status ===200){
                                    this.$message({
                                        message:result.message,
                                        type:'success'
                                    });
                                    this.getData();
                                }else{
                                    this.$message({
                                        message:this.returnErrorMsg(result.error),
                                        type:'error'
                                    })
                                }
                            })
                    })

                }else {
                    this.$message({
                        message: '请勾选订单',
                        type:'warning'
                    })
                }
            },
            //刷新
            handleRefresh() {
                this.getData();
                this.detailForm = {};
                this.detailId = null;
                this.parentId = null;
                this.tabDataI = [];
                this.copyDataI = [];
            },
            //重置
            handleReset() {
                this.searchForm = {tempStatus: 2,minStatus:50,minStatusOperator:'>=',maxStatus:100,maxStatusOperator:'<'};
                this.handleRefresh();
            },
            //更改后的刷新
            changeRefresh() {
                this.detailForm = {};
                this.copyForm = {};
                this.tabDataI = [];
                this.copyDataI = [];
                this.getData();
                this.otherVariable.isChildEdit = false;
            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
            },
            //审核
            handleAudit() {
                if(this.detailForm.fid) {
                    this.$confirm('是否审核?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.otherVariable.isSaving = true;
                        this.getAjax(`/oms/sls/SalesOrderMaster/auditOrder?orderId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message:result.message,
                                        type:'success'
                                    });
                                    this.getData();
                                }else {
                                    this.$message({
                                        message:this.returnErrorMsg(result.error,'second'),
                                        type:'error'
                                    })
                                }
                            })
                            .then(() => {
                                this.otherVariable.isSaving = false;
                            })
                    }).catch(() => {
                        console.log('cnacel')
                    })

                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    })
                }
            },
            //反审
            handleUnAudit() {
                this.getAjax(`/oms/sls/SalesOrderMaster/unAuditOrder?orderId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
                    .then(result => {
                        if(result.status ===200){
                            this.$message({
                                message:result.message,
                                type:'success'
                            });
                            this.getData();
                        }else{
                            this.$message({
                                message:this.returnErrorMsg(result.error,'second'),
                                type:'error'
                            })
                        }
                    });
            },
            // 打印
            handlePrint() {
                let isReturn = false;
                let resultUrl = '';
                this.getAjax(`/oms/PrintController/isPrint?fId=${this.detailId}`)
                    .then(result => {
                        if(result.status === 200) {
                            isReturn = true;
                            resultUrl = result.data;
                        }else {
                            isReturn = false;
                            this.$message({
                                type:'error',
                                message: result.error || '请求错误'
                            })
                        }
                    })
                    .then(() => {
                        if(isReturn) {
                            window.open(resultUrl);
                        }
                    })
            },
        }
    }
</script>

<style lang="less" scoped>
    .popup-enter-active, .popup-leave-active {
        transition: left 0.1s;
        left: 0;
    }
    .popup-enter, .popup-leave-to {
        left: 100%;
    }
</style>
