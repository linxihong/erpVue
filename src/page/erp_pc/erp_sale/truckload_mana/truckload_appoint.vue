<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap"  v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleMulAudit" :disabled="otherVariable.isSaving">批量签批</el-button>
                <el-button @click="handleRefresh">刷新</el-button>
                <el-button @click="handleReset">重置</el-button>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="searchProp"
                :searchForm="searchForm"
                @getData="getSearchList"
            >
            </CommonSearch>
            <!--表格区域-->
            <CommonTable
                v-if="isResize"
                ref="commontable"
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
                    <div class="xs-audit-icon" v-if="!isBanOperate"  @click="!otherVariable.isSaving && handleAudit()"  :class="otherVariable.isSaving ? 'banClick' : ''">签批</div>
                    <!--<div class="xs-unaudit-icon" @click="handleUnAudit">反批</div>-->
                </template>
                <!--头部标题-->
                <template slot="head-form-title">
                    <div class="head-form-title">
                        <span>&nbsp;{{ detailForm.projectName }}{{ detailForm.projectCode?("("+ detailForm.projectCode + ")"):"" }}</span>
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
                    <div class="remark-wrap">
                        <div>备注：</div>
                        <div class="headspan scrollBar" :title="detailForm.remark">{{ detailForm.remark }}</div>
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
                isBanOperate: true,
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
                //搜索映射表
                searchProp: [
                    {
                        name:'装车预约号',
                        prop:'refDocCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入装车预约号'
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
                        name:'预约状态',
                        prop:'docStatus',
                        type:'select',
                        selectList:[{value:null,label:'全部'},{value:60,label:'已签批'},{value:50,label:'未签批'}],
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'下单日期',
                        prop:'docDate',
                        type:'date',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'至',
                        prop:'docDate',
                        type:'date',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'客户',
                        prop:'clientCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'经销商',
                        prop:'clientCode2',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    }
                ],
                //详情映射列表
                formProp: [
                    {name:'装车预约号',prop:'refDocCode',type:'outter'},
                    {name:'预约日期',prop:'docDate',type:'outter'},
                    {name:'单据状态',prop:'docStatusName',type:'outter'},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'经销商',prop:'clientCode2',type:'inner'},
                    {name:'合同号',prop:'contractCode',type:'inner'},
                    {name:'送货地区',prop:'destination',type:'inner'},
                    {name:'授信额',prop:'',type:'inner'},//todo
                    {name:'理论载重(T)',prop:'loadWght',type:'inner'},
                    {name:'备注',prop:'remark',type:'inner',isLong:true}
                ],
                //表格映射列表
                tableProp: [
                    {
                        name:'fId',
                        prop:'fId',
                        type:'normal',
                        isMain:true
                    },
                    {
                        name1:'装车预约号/',
                        prop1:'refDocCode',
                        name2:'状态',
                        prop2:'docStatusName',
                        type:'mixin',
                        width: '105'
                    },
                    {
                        name1:'流程单号/',
                        prop1:'docCode',
                        name2:'预约日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '120',

                    },
                    {
                        name1:'送货地区/',
                        prop1:'destination',
                        name2:'提货方式',
                        prop2:'loaderMethodName',
                        type:'mixin',
                        width: '120'
                    },
                    {
                        name1:'理论载重/',
                        prop1:'theoryWght',
                        name2:'失效日期',
                        prop2:'endDate',
                        type:'mixin',
                        width: '138'
                    },
                ],
                searchForm: {
                    queryStatus:50
                },
                detailForm: {},
                copyForm: {},
                detailId: null,
                docCode: null,
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //详情表格内容
                tabLeft: '200px',
                activeName: 'first',
                //装车明细映射表
                tabPropI: [
                    {prop:'docItem', name:'序号',type:'normal',isShort: true,width:'40',align:'center'},
                    {prop:'itemNo', name:'项目号',type:'normal',isShort: true,width:'130'},
                    {prop:'matCode', name:'型材型号',type:'normal'},
                    {prop:'cx1Name', name:'颜色名称',type:'normal'},
                    {prop:'cx2Name',name:'材质',type:'normal'},
                    {prop:'cx4Name',name:'长度',type:'normal',rule:'limitLength',unit:' m',isShort: true,align:'right'},
                    {prop:'cx3Name',name:'膜厚',type:'normal',unit:'',isShort: true,align:'right'},
                    {prop:'',name:'公差',type:'normal',unit:'',isShort: true,align:'right'},
                    {prop:'digit',name:'装车数',type:'normal',unit:'',isShort: true,align:'right'},
                    {prop:'meterWght',name:'米重',type:'normal',rule:'limitLength',unit:' kg/m',isShort: true,align:'right'},
                    {prop:'unitWght',name:'支重',type:'normal',rule:'limitLength',unit:' kg/pcs',isShort: true,align:'right'},
                    {prop:'theoryWght',name:'理重',type:'normal',rule:'limitLength',unit:' kg',isShort: true,align:'right'},
                    {prop:'',name:'单支方数',type:'normal',isShort: true,align:'right'},
                    {
                        prop:'', name:'包装方式',
                        children:[
                            {prop:'',name:'代码',type:'normal'},
                            {prop:'',name:'说明',type:'normal'},
                            {prop:'',name:'支/扎',type:'normal'},
                        ]
                    },
                    {
                        prop:'', name:'结算方式',
                        children:[
                            {prop:'',name:'代码',type:'normal'},
                            {prop:'',name:'说明',type:'normal'},
                        ]
                    },
                    {
                        prop:'', name:'生产要求',
                        children:[
                            {prop:'usrTxt1Name',name:'喷码',type:'normal'},
                            {prop:'usrTxt2Name',name:'禁喷类型',type:'normal'},
                            {prop:'usrTxt3Name',name:'撕筋',type:'checkbox',width: 55, align:'center'}
                        ]
                    },
                    {
                        prop:'', name:'型材系列',
                        children:[
                            {prop:'',name:'型号',type:'normal'},
                            {prop:'',name:'名称',type:'normal'}
                        ]
                    },
                    {
                        prop:'', name:'型材组',
                        children:[
                            {prop:'matCode',name:'代码',type:'normal',align:'right'},
                            {prop:'matName',name:'名称',type:'normal'}
                        ]
                    },
                    {prop:'',name:'颜色类别',type:'normal'},
                    {prop:'',name:'直径',type:'normal'},
                    {prop:'',name:'机台级别',type:'normal'},
                    {prop:'',name:'胶条规格',type:'normal'},
                    {prop:'remark',name:'备注',type:'normal',width:180}
                ],
                //装车明细数据
                tabDataI: [],
                copyDataI: [],
                loadingI : false,
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
            getData(isFirst = true) {
                if(this.searchForm.refDocCode) {
                    this.searchForm = {refDocCode:this.searchForm.refDocCode}
                }else {
                    this.searchForm.refDocCode = null;
                }
                this.isBanOperate = true;
                this.tableData = [];
                this.fetch(`/oms/sls/ClientLoaderDocController/getClientLoaderMaster?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            if(isFirst) {
                                this.$nextTick(() => {
                                    this.$refs.commontable.renderRow(this.tableData[0].fid);
                                    this.handleDetail(this.tableData[0])
                                })
                            }
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },
            //重置
            handleReset(){
                this.searchForm = {queryStatus:50};
                this.handleRefresh();
            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
            },
            //刷新
            handleRefresh() {

                this.getData();
                this.detailForm = {};
                this.detailId = null;
                this.tabDataI = [];
            },
            //更改后的刷新
            changeRefresh() {
                this.getData(false);
                this.otherVariable.isChildEdit = false;
            },
            //点击主表行
            handleDetail(row) {
                this.isShowNotAllowed = true;
                this.loadingI = true;
                row.docStatus === 60 ? this.isBanOperate = true : this.isBanOperate = false;
                this.tabDataI = [];
                this.copyDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = row;
                this.getAjax(`/oms/sls/ClientLoaderDocController/getClientLoaderDetail?clientLoaderMasterId=${row.fid}`)
                    .then(result => {
                        this.loadingI = false;
                        this.isShowNotAllowed = false;
                        if(result.status === 200) {
                            this.tabDataI = result.data.list;
                            this.copyDataI = this.$lodash.cloneDeep(this.tabDataI);
                        }
                    })
                    .then(() => {
                        this.$refs['childTable'].initStatus();
                    })
                this.detailId = row.fid;
                this.docCode = row.docCode;
            },
            handleSelectionChange(rows) {
                this.selectOrderList = [];
                rows.forEach(item => {
                    this.selectOrderList.push(item.fid)
                })
            },
            //批量签批
            handleMulAudit() {
                if(this.selectOrderList.length) {
                    this.$confirm('是否确认签批'+this.selectOrderList.length+'条订单?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let resultStatus;
                        this.getAjax(`/oms/sls/ClientLoaderDocController/signClientLoaderBatch?clientLoaderMasterIds=${this.selectOrderList}`)
                            .then(result => {
                                resultStatus = result.status;
                                if(result.status ===200) {
                                    this.$message({
                                        message:result.message,
                                        type:'success'
                                    })
                                }else{
                                    this.$message({
                                        message:this.returnErrorMsg(result.error),
                                        type:'error'
                                    })
                                }
                            })
                            .then(() => {
                                if(resultStatus === 200) {
                                    this.getData();
                                }
                            })
                    })
                }else {
                    this.$message({
                        message: '请勾选装车单',
                        type:'warning'
                    })
                }
            },
            //签批
            handleAudit() {
                this.$confirm('是否签批?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let resultStatus;
                    this.otherVariable.isSaving = true;
                    this.getAjax(`/oms/sls/ClientLoaderDocController/signClientLoader?clientLoaderMasterId=${this.detailForm.fid}`)
                        .then(result => {
                            resultStatus = result.status;
                            if(result.status ===200){
                                this.$message({
                                    message:result.message,
                                    type:'success'
                                });
                                this.changeRefresh();
                            }else{
                                this.$message({
                                    message:this.returnErrorMsg(result.error),
                                    type:'error'
                                })
                            }
                        })
                        .then(() => {
                            if(resultStatus === 200) {
                                this.$refs['childTable'].initStatus();
                                this.$refs.commontable.renderRow(this.detailId);
                            }
                            this.otherVariable.isSaving = false;
                        })

                })

            },
            //反批
            handleUnAudit() {
                let resultStatus;
                this.getAjax(`/oms/sls/ClientLoaderDocController/unSignClientLoader?clientLoaderMasterId=${this.detailForm.fid}`)
                    .then(result => {
                        if(result.status ===200){
                            this.$message({
                                message:result.message,
                                type:'success'
                            });
                            this.changeRefresh();
                        }else {
                            this.$message({
                                message:this.returnErrorMsg(result.error),
                                type: 'error'
                            })
                        }
                    })
                    .then(() => {
                        if(resultStatus === 200) {
                            this.$refs['childTable'].initStatus();
                            this.$refs.commontable.renderRow(this.detailId);
                        }
                    })
            }
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
