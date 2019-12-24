<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap"  v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleMulAudit" :disabled="otherVariable.isSaving">批量审核</el-button>
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
                @getInitPage="getInitPage"
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
                    <div v-if="showButton" class="xs-audit-icon" @click="!otherVariable.isSaving && handleAudit()"  :class="otherVariable.isSaving ? 'banClick' : ''">审核</div>
                    <div v-if="false"  class="xs-unaudit-icon" @click="handleUnAudit">反审</div>
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
                isShowNotAllowed:false,
                loadingI:false,
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
                        name:'装车单',
                        prop:'refDocCode',
                        type:'date',
                        isMainSearch:true,
                        isMain:false,
                        placeholder: '请输入装车单号'
                    },
                    {
                        name:'装车单状态',
                        prop:'queryStatusInSet',
                        type:'select',
                        selectList:[{value:"50,100",label:'全部'},{value:50,label:'已确认'},{value:100,label:'已审核'}],
                        isMainSearch:false,
                        isMain:false
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
                        prop:'refDocCode',
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
                    {name:'装车单号',prop:'refDocCode',type:'outter'},
                    {name:'装车日期',prop:'docDate',type:'outter'},
                    {name:'单据状态',prop:'docStatusName',type:'outter'},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'经销商',prop:'clientCode2',type:'inner'},
                    {name:'送货地区',prop:'destination',type:'inner'},
                    {name:'授信额',prop:'',type:'inner'},//todo
                    {name:'提货方式',prop:'loaderMethodName',type:'inner'},
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
                        name1:'装车单号/',
                        prop1:'refDocCode',
                        name2:'状态',
                        prop2:'docStatusName',
                        type:'mixin',
                        width: '110'
                    },
                    {
                        name1:'流程单号/',
                        prop1:'docCode',
                        name2:'装车日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '120'
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
                        name1:'送货地区/',
                        prop1:'destination',
                        name2:'提货方式',
                        prop2:'loaderMethodName',
                        type:'mixin',
                    }
                ],
                searchForm: {queryStatusInSet: 50},
                detailForm: {},
                copyForm: {},
                showButton:false,
                showUnAudit:false,
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
                    {prop:'digit',name:'装车数',type:'normal',isShort: true,align:'right'},
                    {prop:'meterWght',name:'米重',type:'normal',rule:'limitLength',unit:' kg',isShort: true,align:'right'},
                    {prop:'unitWght',name:'支重',type:'normal',rule:'limitLength',unit:' kg/pcs',isShort: true,align:'right'},
                    {prop:'theoryWght',name:'理重',type:'normal',rule:'limitLength',unit:' kg',isShort: true,align:'right'},
                    {prop:'remark',name:'备注',type:'normal',width:180}
                ],
                //装车明细数据
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
            getData(isFirst = true) {
                if(this.searchForm.refDocCode) {
                    this.searchForm = {refDocCode:this.searchForm.refDocCode}
                }else {
                    this.searchForm.refDocCode = null;
                }
                this.tableData = [];
                this.fetch(`/oms/sls/LoaderDoc/getMaster?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list.length) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            if(isFirst) {
                                this.$nextTick(() => {
                                    this.$refs.commontable.renderRow(this.tableData[0].fid);
                                })
                            }else {
                                this.$nextTick(() => {
                                    this.$refs.commontable.renderRow(this.detailId);
                                })
                            }
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },
            //重置
            handleReset() {
                this.searchForm = {queryStatusInSet: 50};
                this.handleRefresh();
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //刷新
            handleRefresh() {
                this.getData();
                this.tabDataI = [];
                setTimeout(() => {
                    this.$refs['childTable'].initStatus();
                },200)
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
                if(row.docStatus === 100) {
                    this.showUnAudit = true;
                    this.showButton = false
                }else {
                    this.showUnAudit = false;
                    this.showButton = true
                }
                this.tabDataI = [];
                this.copyDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = row;
                this.copyForm = this.$lodash.cloneDeep(row);
                this.getAjax(`/oms/sls/LoaderDoc/getDetail?pageSize=1000&loaderMasterId=${row.fid}`)
                    .then(result => {
                        this.loadingI = false;
                        this.isShowNotAllowed = false;
                        if(result.data && result.data.list) {
                            this.tabDataI = result.data.list;
                            this.copyDataI = this.$lodash.cloneDeep(this.tabDataI);
                        }
                    })
                    .then(() => {
                        this.$refs['childTable'].initStatus();
                    });
                this.detailId = row.fid;
                this.docCode = row.docCode;
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
                    this.$confirm('是否确认审核'+this.selectOrderList.length+'条订单?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let resultStatus;
                        this.fetch('/oms/sls/LoaderDoc/auditListLoader',this.selectOrderList)
                            .then(result => {
                                resultStatus = result.status;
                                if(result.status ===200){
                                    this.$message({
                                        message:result.message,
                                        type:'success'
                                    })
                                    this.getSearchList();
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
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
            },
            //审核
            handleAudit() {
                this.$confirm('是否审核?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.otherVariable.isSaving = true;
                    this.getAjax(`/oms/sls/LoaderDoc/auditLoader?docCode=${this.detailForm.docCode}&loaderMasterId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
                        .then(result => {
                            if(result.status ===200){
                                this.$message({
                                    message:result.message,
                                    type:'success'
                                });
                                this.getSearchList();
                            }else{
                                this.$message({
                                    message:this.returnErrorMsg(result.error),
                                    type:'error'
                                })
                            }
                        })
                        .then(() => {
                            this.otherVariable.isSaving = false;
                        })
                })


            },
            //反审
            handleUnAudit() {
                this.otherVariable.isSaving = true;
                this.getAjax(`/oms/sls/LoaderDoc/unAuditLoader?docCode=${this.detailForm.docCode}&loaderMasterId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
                    .then(result => {
                        resultStatus = result.status;
                        if(result.status ===200){
                            this.$message({
                                message:result.message,
                                type:'success'
                            });
                            this.getData(false);
                        }else{
                            this.$message({
                                message:this.returnErrorMsg(result.error),
                                type: 'error'
                            })
                        }
                    })
                    .then(() => {
                        this.otherVariable.isSaving = false;
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
