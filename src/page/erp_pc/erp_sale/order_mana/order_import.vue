<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap"  v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <!--<el-button class="btn-cyan add-btn" @click="handleMulImport" :disabled="otherVariable.isSaving">批量签批</el-button>-->
                <el-button class="btn-cyan add-btn" @click="showChooseFollow(true)">批量指派跟单</el-button>
                <el-button @click="handleRefresh">刷新</el-button>
                <el-checkbox style="margin-left: 10px;" v-model="isImport" @change="changeImport">待签批</el-checkbox>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="searchProp"
                :searchForm="searchForm"
                @selectChange="selectChange"
                @getData="getInitPage"
            >
                <template slot="search-other-btn">
                    <el-button @click="handleReset">重置</el-button>
                </template>
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
                    <div class="xs-audit-icon" v-if="!isBanOperate" :class="otherVariable.isSaving ? 'banClick' : ''" @click="!otherVariable.isSaving && handleImport()">签批</div>
                    <div class="xs-unaudit-icon" v-if="false" @click="handleUnImport">反批</div>
                    <div class="xs-icon-confirm" @click="showChooseFollow(false)" v-if="detailId" title="指派跟单" style="right: 20px;background: #00C26F; line-height: 1; padding-top: 8px;">指派  跟单</div>
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
                                :sumParam = {digit:8,theoryWght:11}
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
        <el-dialog
            title="请指派跟单员"
            :visible.sync="followVisiable"
            width="30%">
            <el-select
                :disabled="isSelf"
                clearable
                filterable
                remote
                placeholder="请输入跟单员进行搜索"
                :remote-method="getFollowerList"
                v-model.trim="followForm.followName"
                @change="changeFollower"
                style="width: 100%"
            >
                <el-option
                    v-for="(item,index) in followerList"
                    :key="index"
                    :label="item.fName"
                    :value="item.fName">
                </el-option>
            </el-select>
            <el-checkbox style="margin-top: 10px;" v-model="isSelf" @change="isGiveSelf">给自己</el-checkbox>
            <span slot="footer" class="dialog-footer">
                <el-button @click="followVisiable = false">取 消</el-button>
                <el-button class="btn-cyan" @click="handleFollow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import CommonMixins from '$src/components/CommonMixins'
    import FollowMixins from './FollowMixins'
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    import CommonDetailX from '$src/components/CommonDetailX'
    export default {
        mixins: [CommonMixins,FollowMixins],
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
                isBanOperate: true,
                isShowNotAllowed: false,
                isShowStatus: {
                    isMore: false,
                    isRead: true
                },
                isImport: true,
                isResize: true,
                loadingI: false,
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
                    isSaving: false,
                },
                tempWidth: null,
                tableData: [],

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
                        prop:'destClientCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'客户名称',
                        prop:'destClientName',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'订单状态',
                        prop:'tempStatus',
                        type:'selectChange',
                        selectList:[{value:1,label:'全部'},{value:2,label:'已审核'},{value:3,label:'已签批'}],
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
                    {name:'客户',prop:'destClientCode',type:'inner'},
                    {name:'经销商',prop:'destClientCode2',type:'inner'},
                    {name:'单据类型',prop:'docType',type:'inner'},
                    {name:'贴膜要求',prop:'padPastingMethodName',type:'inner'},
                    {name:'货期等级',prop:'deliveryLevelName',type:'inner'},
                    {name:'生产基地',prop:'supplyCompanyName',type:'inner'},
                    {name:'跟单员',prop:'destFollowName',type:'inner'},
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
                        type:'mixin',
                        width: '115'
                    },
                    {
                        name1:'单据类型/',
                        prop1:'docType',
                        name2:'下单日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '120'
                    },
                    {
                        name1:'客户/',
                        prop1:'destClientCode',
                        name2:'经销商',
                        prop2:'destClientCode2',
                        type:'mixin',
                        width: '108'
                    },
                    {
                        name1:'流程单号/',
                        prop1:'docCode',
                        name2:'工程名称',
                        prop2:'projectName',
                        type:'mixin',
                        width: '130',
                        tooltip: true
                    }
                ],
                searchForm: {docStatus: 100},
                detailForm: {},
                copyForm: {},
                detailId: null,
                clientId: null,
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
                    {prop:'docItem',name:'序号',type:'normal',isShort: true,width:'50',align:'center'},
                    {prop:'itemNo', name:'项目号',type:'normal',isShort: true,width:'130'},
                    {prop:'matCode', name:'型材型号',type:'normal',isShort: true,width:'130'},
                    {prop:'cx1Name', name:'颜色名称',type:'normal',isShort: true,width:'130'},
                    {prop:'cx2Name',name:'材质',type:'normal'},
                    {prop:'cx4Name',name:'长度',type:'normal',rule:'limitLength',unit:' m',isShort: true,align:'right'},
                    {prop:'cx3Name',name:'膜厚',type:'normal',unit:'',isShort: true,align:'right'},
                    {prop:'',name:'自定义型号',type:'normal',align:'right'},
                    {prop:'digit',name:'订单数',type:'normal',align:'right'},
                    {prop:'meterWght',name:'米重',type:'normal',rule:'limitLength',unit:' kg',isShort: true,align:'right'},
                    {prop:'unitWght',name:'支重',type:'normal',rule:'limitLength',unit:' kg/pcs',isShort: true,align:'right'},
                    {prop:'theoryWght',name:'理重',type:'normal',rule:'limitLength',unit:' kg',isShort: true,align:'right'},
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
                    {prop:'productDescription',name:'产品描述',type:'normal'},
                    {prop:'remark',name:'备注',type:'normal',width:200}
                ],
                //订单明细数据
                tabDataI: [],
                copyDataI: [],
                //所选订单
                selectOrderList: [],
                isOrderImport: true
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
                this.fetch(`/oms/sls/SalesOrderMaster/getClientOrderMasterForSignAudit?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list && result.data.list.length) {
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
                            this.detailForm = {};
                            this.copyForm = {};
                            this.tabDataI = [];
                            this.copyDataI = [];
                            this.detailId = null;
                            this.clientId = null;
                            this.pageObj.commonTotal = 0;
                            this.$nextTick(() => {
                                this.$refs['childTable'].initStatus();
                            })
                        }
                    })
            },
            selectChange(val) {
                if(val === 1) {
                    //全部
                    this.searchForm.docStatus = null;
                    delete this.searchForm.maxStatus;
                    delete this.searchForm.maxStatusOperator;
                    delete this.searchForm.minStatus;
                    delete this.searchForm.minStatusOperator;
                }else if(val === 2) {
                    //已审核
                    this.searchForm.docStatus = 100;
                    delete this.searchForm.maxStatus;
                    delete this.searchForm.maxStatusOperator;
                    delete this.searchForm.minStatus;
                    delete this.searchForm.minStatusOperator;
                }else if(val === 3) {
                    //已签批
                    this.searchForm.minStatus = 100;
                    this.searchForm.minStatusOperator = '>';
                    delete this.searchForm.maxStatus;
                    delete this.searchForm.maxStatusOperator;
                    delete this.searchForm.docStatus;
                }
            },
            //刷新
            handleRefresh() {
                this.getData();
                this.detailForm = {};
                this.detailId = null;
                this.clientId = null;
                this.tabDataI = [];
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //重置
            handleReset() {
                this.isImport = true;
                this.searchForm = {docStatus:100};
                this.handleRefresh();
            },
            //更改后的刷新
            changeRefresh() {
                this.getData(false);
                this.otherVariable.isChildEdit = false;
            },
            //切换是否待签批
            changeImport(val) {
                if(val) {
                    this.searchForm.docStatus = 100
                }else {
                    delete this.searchForm.docStatus;
                    delete this.searchForm.tempStatus;
                }
                this.getData();
            },
            //点击主表行
            handleDetail(row) {
                row.docStatus === 100 ? this.isBanOperate = false : this.isBanOperate = true;
                this.tabDataI = [];
                this.copyDataI = [];
                this.isShowNotAllowed = true;
                this.loadingI = true;
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.fetch('/oms/sls/SalesOrderMaster/getClientOrderMasterForSignAudit',{fid:row.fid})
                    .then(result => {
                        this.isShowNotAllowed = false;
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
                    }).then(()=>{
                    this.loadingI = false;
                });
                this.getAjax(`/oms/sls/SalesOrderDetail/getClientOrderDetail?pageSize=1000&clientOrderMasterId=${row.fid}`)
                    .then(result => {
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
                this.clientId = row.clientId;
            },
            handleSelectionChange(rows) {
                this.selectOrderList = [];
                rows.forEach(item => {
                    this.selectOrderList.push(item.fid)
                })
            },
            //批量签批
            handleMulImport() {
                if(this.selectOrderList.length) {
                    this.$confirm('是否确认签批'+this.selectOrderList.length+'条订单?',  '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.otherVariable.isSaving = true;
                        this.fetch('/oms/sls/SalesOrderMaster/batchSignAuditClientOrder',this.selectOrderList)
                            .then(result => {
                                if(result.status ===200){
                                    this.$message({
                                        message:'签批成功',
                                        type:'success'
                                    });
                                    this.getInitPage()
                                }else{
                                    this.$message({
                                        message:this.returnErrorMsg(result.error,'second'),
                                        type:'error'
                                    })
                                }
                            })
                            .then(() => {
                                this.otherVariable.isSaving = false;
                            })
                    })
                }else {
                    this.$message({
                        message: '请勾选订单',
                        type:'warning'
                    })
                }
            },
            //签批
            handleImport() {
                if(this.detailForm.fid) {
                    this.$confirm('是否签批?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.otherVariable.isSaving = true;
                        this.getAjax(`/oms/sls/SalesOrderMaster/signAuditOrder?orderId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
                            .then(result => {
                                if(result.status ===200){
                                    this.$message({
                                        message:result.message,
                                        type:'success'
                                    });
                                    this.getData(false);
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
                    })
                }else {
                    this.$message({
                        message: '请选择网单',
                        type: 'warning'
                    })
                }
            },
            handleUnImport() {
                if(this.detailForm.fid) {
                    this.getAjax(`/oms/sls/SalesOrderMaster/unSignAuditOrder?orderId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
                        .then(result => {
                            this.otherVariable.isSaving = true;
                            if(result.status ===200){
                                this.$message({
                                    message:result.message,
                                    type:'success'
                                });
                                this.detailForm = {};
                                this.copyForm = {};
                                this.tabDataI = [];
                                this.copyDataI = [];
                                this.getData(false);
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
                }else {
                    this.$message({
                        message: '请选择网单',
                        type: 'warning'
                    })
                }
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
