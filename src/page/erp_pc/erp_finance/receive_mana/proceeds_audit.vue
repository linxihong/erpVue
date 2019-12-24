<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap" @click="handleNotAllowed" v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">

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
                :mainHeight="mainHeight"
                :isShowStatus="isShowStatus"
                :propData="tableProp"
                :otherVariable="otherVariable"
                :tableData="tableData"
                @getInitPage="getInitPage"
                @handleDetail="handleDetail"
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
                @handleDelete="handleDelete"
            >
                <!--详情头部-->
                <template slot="header">
                    <div class="header-form" ref="headForm">
                        <template v-for="item in formProp">
                            <div v-if="item.type === 'outter'">
                                <span>{{ item.name ? (item.name + ':') : '' }}</span>
                                <span>{{ left_detailForm[item.prop]===50?'未审核':left_detailForm[item.prop] ===100?'已审核':left_detailForm[item.prop]===0?'未提交':left_detailForm[item.prop]}}</span>
                            </div>
                        </template>
                    </div>
                </template>
                <!--头部按钮-->
                <template slot="main-btn-wrap">
                    <div class="xs-icon-confirm" v-if="detailForm.docStatus>0 && detailForm.docStatus!=100"  @click="handleConfirm" style="right: 170px">审核</div>
                    <!--<div class="xs-icon-confirm"  @click="handleConfirm" v-if="detailForm.docStatus=100" style="right: 170px">反审</div>-->
                </template>
                <!--头部标题-->
                <template slot="head-form-title">
                    <div class="">
                        <span style="font-size: 30px;">收款凭证</span>
                        <span></span>
                    </div>
                </template>
                <!--头部表单-->
                <template slot="head-form-content">
                    <div class="head-form-content">
                        <template v-for="item in formProp">
                            <div v-if="item.type === 'inner' && !item.isLong">
                                <span>{{ item.name }}：</span>
                                <span>{{ left_detailForm[item.prop] }}</span>
                            </div>
                        </template>
                    </div>
                    <div class="remark-wrap">
                        <div style="height: 50px"></div>
                        <!--<div class="headspan scrollBar" :title="left_detailForm.remark">{{ left_detailForm.remark }}</div>-->
                    </div>
                </template>
                <!--详情内容-->
                <template slot="common-content" >
                    <div style="margin-top: 40px" class="inline-form-add">
                        <el-form :model="detailForm"  :inline="true"  label-width="110px" >
                            <el-form-item  label="收款日期:" >
                                <el-date-picker
                                    size="large"
                                    :readonly=this.readonly
                                    v-model="detailForm.docDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>

                            <br>
                            <el-form-item label="收款类型:" prop="docType"    >
                                <el-input v-model="addOrEditForm.docTypeName" :readonly=this.readonly></el-input>
                            </el-form-item>

                            <el-form-item label="单据编号:" prop="refDocCode"  v-if="showInp">
                                <el-input v-model="addOrEditForm.refDocCode" :readonly=this.readonly></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item  label="客户代码:" >
                                <el-input v-model="detailForm.clientCode" :readonly=this.readonly ></el-input>
                            </el-form-item>
                            <el-form-item  label="" class="long-input">
                                <el-input v-model="detailForm.clientName" :readonly=this.readonly ></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item  label="经销商:" >
                                <el-input v-model="detailForm.clientCode2" :readonly=this.readonly ></el-input>
                            </el-form-item>
                            <el-form-item  label="" class="long-input">
                                <el-input v-model="detailForm.clientName2" :readonly=this.readonly ></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item  label="工程名称:" >
                                <el-input v-model="detailForm.projectName" :readonly=this.readonly ></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item  label="客户银行账号:" >
                                <el-input v-model="detailForm.bandAccount" :readonly=this.readonly ></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item  label="客户银行户名:" >
                                <el-input v-model="detailForm.bandAccountName" :readonly=this.readonly ></el-input>
                            </el-form-item>
                            <el-form-item  label="银行名称: " >
                                <el-input v-model="detailForm.bandName" :readonly=this.readonly ></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item label="收款金额: " >
                                <el-input v-model="detailForm.receiveMoney" :readonly=this.readonly ></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item  label="预计开票时间:" >
                                <el-date-picker
                                    :readonly=this.readonly
                                    v-model="detailForm.expectReceiveDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item  label="实际开票时间:">
                                <el-date-picker
                                    :readonly=this.readonly
                                    v-model="detailForm.actualReceiveDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                            <br/>
                            <el-form-item  label="备注:"  class="foramAddress" >
                                <el-input type="textarea" v-model="detailForm.remark" rows="2" style="width: 256%" :disabled="this.readonly" ></el-input>
                            </el-form-item>
                        </el-form>
                    </div>


                </template>
            </CommonDetailX>

            <!--获取公共数据-->
            <CommonData :valueObj="valueObj" ref="commondata"></CommonData>


        </div>
    </div>
</template>

<script>
    import CommonMixins from '$src/components/CommonMixins'
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    import CommonDetailX from '$src/components/CommonDetailX'
    import CommonAdd from '$src/components/CommonAdd'
    import CommonData from '$src/components/CommonData'
    import SelectEnter from '$src/components/SelectEnter'
    export default {
        mixins: [CommonMixins],
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetailX,
            CommonAdd,
            CommonData,
            SelectEnter,
        },
        data() {
            return {
                showInp:false,
                formHeight: 526,
                tableHeight: this.$store.state.screenHei*0.65,
                readonly:true,
                mainHeight: 716,
                isResize: true,
                operateType: 'add',
                isNewEdit: false,
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                //键盘操作
                currentIndex: 0,
                enterTimes: 1,
                isBanNextFocus: false,
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    detailTitle: '编辑订单',
                    addTitle: '新建订单',
                    popupTitle: '',
                    isInlineForm: true,
                    isEdit: false,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    loading: false,
                    $isCustom: true,
                    isNotValidate: true,
                    isReadTable: true
                },
                tempWidth: null,
                tableData: [],
                mainRules:{
                    docCode:[
                        { required: true, message: '请输入订单编号', trigger: 'blur' }
                    ],
                    receiveMoney:[
                        { required: true, message: '请输入收款金额', trigger: 'blur' }
                    ],
                    clientCode:[
                        { required: true, message: '请输入客户', trigger: 'blur' }
                    ],
                    clientCode2:[
                        { required: true, message: '请输入经销商', trigger: 'blur' }
                    ]
                },
                //搜索映射表
                searchProp: [
                    {
                        name:'工程名称',
                        prop:'docCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入收款单号'
                    },
                    {
                        name:'订单状态',
                        prop:'tempStatus',
                        type:'selectChange',
                        selectList:[{value:1,label:'未审核'},{value:2,label:'已审核'},{value:3,label:'全部'}],
                        isMainSearch:false,
                        isMain:false,
                    },
                    {
                        name:'单据单号',
                        prop:'docCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false,
                    },
                    {
                        name:'开始日期',
                        prop:'orderDocDateStart',
                        type:'date',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'结束日期',
                        prop:'orderDocDateEnd',
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
                        prop:'supplyCompanyName',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                ],
                //详情映射列表
                formProp: [
                    {name:'收款单号',prop:'docCode',type:'outter'},
                    {name:'创建人',prop:'enterName',type:'outter'},
                    {name:'创建时间',prop:'enterTime',type:'outter'},
                    {name:'单据类型',prop:'docStatus',type:'outter'},

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
                        name1:'收款单号/',
                        prop1:'docCode',
                        name2:'状态',
                        prop2:'docStatus',
                        type:'mixinVoucher',

                    },
                    {
                        name1:'客户/',
                        prop1:'clientCode',
                        name2:'经销商',
                        prop2:'clientCode2',
                        type:'mixin',

                    },
                    {
                        name1:'收款日期/',
                        prop1:'docDate',
                        name2:'收款类型',
                        prop2:'docTypeName',
                        type:'mixin',

                    },

                    {
                        name:'金额',
                        prop:'receiveMoney',
                        type:'normal',
                        width: '100'

                    },
                ],
                searchForm: {
                    tempStatus:1,
                    minDocStatus:50,
                    maxDocStatus:100,
                },
                addOrEditForm: {},
                detailForm: {},
                left_detailForm: {},
                copyForm: {},
                tempForm: {},
                submitRow: {},
                detailId: null,
                orderDocStatus: null,
                orderChangeDocStatus: null,
                docCode: null,
                docStatus: null,
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                pageDialog:{
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //选择订单
                searchChooseForm: {minStatus:100,minStatusOperator:'>='},
                chooseTableData: [],
                //详情表格内容
                tabLeft: '300px',
                activeName: 'first',
                childDetailRow: {},
                editIndex: 0,
                //订单明细数据
                tabDataI: [],
                loadingI: false,
                isShowNotAllowed: false,
                //变更
                changeVisible: false,
                changeType: '',
                changeForm: {},
                changeTitle: '',
                changeColorName: '',
                changeMatCode: '',
                tempSelect: false,
                isShowNew: true,
                //批量变更
                multiChangeVisible: false,
                multiChangeForm: {},
                multiTempSelect: false,
                //型号
                matCode: null,
                matCodeList: [],
                matCodeTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //颜色
                colorName: null,
                colorCodeList: [],
                colorCodeTHs: [
                    //{label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //材质资料
                matAlloy: null,
                matAlloyList: [],
                matAlloyTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //获取膜厚
                matThick: null,
                matThickList: [],
                matThickTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //销售类型
                sellTypeList: [],
                //单据类型
                orderTypeList: [],
                //货期等级
                deliveryLevelList: [],
                //包装方式
                packMethodList: [],
                //提货方式
                deliveryMethodList: [],
                //禁喷类型
                usrTxt2Name: null,
                multiUsrTxt2Name: null,
                usrTxt2List: [],
                valueObj: {
                    //客户
                    clientCode: null,
                    priceClientList: [],
                    clientTHs: [
                        {label:'代码',prop:'fcode'},
                        {label:'名称',prop:'fname'}
                    ],
                }
            }
        },
        watch: {
            'isShowStatus.isPopUp':{
                handler(val) {
                    this.isShowNotAllowed = val;
                }
            },
            'otherVariable.isChildEdit':{
                handler(val) {
                    this.isShowNotAllowed = val;
                }
            },
            'isNewEdit':{
                handler(val) {
                    this.isShowNotAllowed = val;
                }
            },
        },
        mounted() {
            this.getData();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                this.tableData = [];
                this.fetch(`/oms/fm/FmClientReceiveController/getClientReceiveList?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
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
                            this.tabDataI = [];
                            this.detailForm = {};
                            this.left_detailForm = {};
                            this.addOrEditForm = {};
                            this.detailId = null;
                            this.orderDocStatus = null;
                            this.orderChangeDocStatus = null;
                        }
                    });
            },
            //刷新
            handleRefresh() {
                this.detailForm = {};
                this.left_detailForm = {};
                this.addOrEditForm = {};
                this.getData();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },
            //重置
            handleReset() {
                this.searchForm =  {
                    tempStatus:1,
                    minDocStatus:50,
                    maxDocStatus:100,
                };
                this.handleRefresh();
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },

            selectChange(val) {
                if(val === 1) {
                    this.searchForm.minDocStatus = 50;
                    this.searchForm.maxDocStatus = 100;
                }else if(val === 2) {
                    this.searchForm.minDocStatus = 100;
                    this.searchForm.maxDocStatus = 101;
                }else if(val === 3) {
                    this.searchForm.minDocStatus = 0;
                    this.searchForm.maxDocStatus = 101;
                }
            },
            //更改后的刷新
            changeRefresh() {
                this.getData(false);
                this.otherVariable.isChildEdit = false;
            },
            //点击主表行
            handleDetail(row) {
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.left_detailForm = row;
                this.addOrEditForm = {};
                this.copyForm = {};
                this.handleCancel(this.operateType);
                this.fetch('/oms/fm/FmClientReceiveController/getClientReceiveList',{fid:row.fid})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list.length) {
                            this.detailForm = result.data.list[0];
                            if(this.detailForm.docType < 0){
                                this.showInp=true;
                            }else{
                                this.showInp=false;
                            }
                            this.addOrEditForm = result.data.list[0];
                            this.copyForm = this.$lodash.cloneDeep(result.data.list[0]);

                        }else {
                            this.detailForm = {};
                            this.copyForm = {};
                        }
                    });
                this.getChildTable(row.fid);
                this.detailId = row.fid;
                this.orderDocStatus = row.orderDocStatus;
                this.orderChangeDocStatus = row.orderChangeDocStatus;
                this.docCode = row.docCode;
                this.docStatus = row.docStatus;
            },
            //主表添加行
            handleAdd() {
                this.operateType = 'add';
                this.addOrEditForm = {};
                this.isShowStatus.isPopUp = true;
                this.otherVariable.popupTitle = '新增收款凭证';
                this.otherVariable.isEdit = false;

            },
            //禁止点击表格提醒
            handleNotAllowed() {
                if(this.isShowStatus.isPopUp) {
                    this.$confirm('此操作将清空已填写的数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.handleCancel(this.operateType);
                    }).catch(() => {
                        console.log('cnacel')
                    })
                }
                if(this.otherVariable.isChildEdit) {
                    this.$confirm('此操作将清空已填写的数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.handleCancelChild();
                    }).catch(() => {
                        console.log('cnacel')
                    })
                }
            },

            // 客户
            getClient(val) {
                this.$refs.commondata.getPriceClient(val);
            },
            setClient(item) {
                console.log(2222,item);
                this.$set(this.valueObj,'clientCode',item.fcode);
                this.$set(this.addOrEditForm,'clientName',item.fname);
                this.$set(this.addOrEditForm,'clientCode',item.fcode);
                this.$set(this.addOrEditForm,'clientId',item.fid);
                if(item.parentid) {
                    this.fetch('/oms/sls/OfferPrice/getClientCompany',{cltcompanyid:item.parentid})
                        .then(result => {
                            if(result.data && result.data.list && result.data.list.length) {
                                let tempItem = result.data.list[0];
                                this.$set(this.addOrEditForm,'clientName2',tempItem.fname);
                                this.$set(this.addOrEditForm,'clientCode2',tempItem.fcode);
                                this.$set(this.addOrEditForm,'clientId2',tempItem.fid);
                            }
                        })
                }else {
                    this.$set(this.addOrEditForm,'clientName2',item.fname);
                    this.$set(this.addOrEditForm,'clientCode2',item.fcode);
                    this.$set(this.addOrEditForm,'clientId2',item.fid);
                }
            },

            //主表新增保存行
            handleSave() {

                this.fetch('/oms/fm/FmClientReceiveController/addClientReceive',this.addOrEditForm)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.isShowStatus.isPopUp = false;
                            this.handleRefresh();
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            });
                        }
                    })
            },
            //主表编辑保存行
            handleEditSave() {
                this.addOrEditForm.fid = this.detailId;
                this.addOrEditForm.docCode = this.docCode;
                this.addOrEditForm.orderNewSellType = 1;
                this.addOrEditForm.orderNewProjectCode = this.detailForm.orderOldProjectCode;
                let resultStatus;
                this.fetch('/oms/sls/SalesOrderChange/updateMaster',this.addOrEditForm)
                    .then(result => {
                        resultStatus = result.status;
                        if(result.status === 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.getData(false);
                            this.isNewEdit = false;
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            });
                        }
                    })
            },
            handleEditNew() {
                this.readonly = false;
            },
            //删除
            handleCancelNew() {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.fetch('/oms/fm/FmClientReceiveController/deleteClientReceive',{fid:this.detailForm.fid})
                        .then(result => {
                            if (result.status === 200) {
                                this.readonly = true;
                                this.getData();
                                this.$message({
                                    message: result.message,
                                    type: 'success'
                                });

                            }else {
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                })
                            }
                        })

                });


            },
            //主表取消操作
            handleCancel(type) {
                this.isShowStatus.isPopUp = false;
                if(type === 'add') {
                    this.addOrEditForm = {};
                }else {
                    this.detailForm = this.$lodash.cloneDeep(this.copyForm);
                    this.addOrEditForm = this.$lodash.cloneDeep(this.copyForm);
                }
            },
            //审核
            handleConfirm() {
                this.$confirm('是否审核?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.fetch('/oms/fm/FmClientReceiveController/auditingClientReceive',{fid:this.detailForm.fid,docStatus:100})
                        .then(result => {
                            if (result.status === 200) {
                                this.readonly = true;
                                this.getData();
                                this.$message({
                                    message: result.message,
                                    type: 'success'
                                });

                            }else {
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                })
                            }
                        })

                })

            },
            //主表撤销
            handleUnConfirm() {
                if(this.detailId) {
                    this.$confirm('是否撤销?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let resultStatus;
                        this.getAjax(`/oms/sls/SalesOrderChange/unConfirmChangeOrder?orderChangeMasterId=${this.detailForm.fid}`)
                            .then(result => {
                                resultStatus = result.status;
                                if (result.status === 200) {
                                    this.$message({
                                        message: result.message,
                                        type: 'success'
                                    });
                                    this.getInitPage();
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    })
                                }
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
            //主表删除行
            handleDelete() {
                if(this.detailId) {
                    this.$confirm('是否删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getAjax(`/oms/sls/SalesOrderChange/deleteOrderChangeMaster?orderChangeMasterId=${this.detailId}`)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    this.detailForm = {};
                                    this.tabDataI = [];
                                    this.getInitPage();
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    });
                                }
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
            //主表作废行
            cancelOrder() {
                if(this.detailId) {
                    this.$confirm('是否作废?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getAjax(`/oms/sls/SalesOrderChange/cancelOrderChangeMasterById?orderChangeMasterId=${this.detailForm.fid}`)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '作废成功',
                                        type: 'success'
                                    });
                                    this.detailForm = {};
                                    this.tabDataI = [];
                                    this.getInitPage();
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    });
                                }
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
            //获取从表
            getChildTable(fid) {
                this.loadingI = true;
                this.isShowNotAllowed = true;
                this.getAjax(`/oms/sls/SalesOrderChange/getOrderChangeDetail?pageSize=1000&orderChangeMasterId=${fid}`)
                    .then(result => {
                        this.loadingI = false;
                        this.isShowNotAllowed = false;
                        if(result.data && result.data.list) {
                            result.data.list.forEach(item => {
                                if(item.usrTxt3Name) {
                                    item.usrTxt3Name = item.usrTxt3Name.toLowerCase();
                                }
                            });
                            this.tabDataI = result.data.list;
                        }
                    })
            },
            //从表添加行
            handleAddChild() {
                if(this.detailId) {
                    this.matCode = '';
                    this.colorName = '';
                    this.matAlloy = '';
                    this.matThick = '';
                    this.markMethod = '';
                    this.otherVariable.isChildEdit = true;
                    this.$nextTick(()=>{
                        this.tempForm = {matCode:'',matName:'',cx1:'',cx1Name:'',cx2:'',cx2Name:'',cx3:'',cx3Name:'',isEditState:true};
                        this.tabDataI.unshift(this.$lodash.cloneDeep(this.tempForm));
                    });
                    setTimeout(() => {
                        $('.el-table__body-wrapper .el-input__inner')[0].focus();
                    },200)
                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    });
                }
            },
            //从表保存
            handleSaveChild() {
                let api;
                let tempObj;
                let isSave = true;
                let operate = 'edit';
                if(!this.childDetailRow.fid) {
                    operate = 'add';
                    api = '/oms/sls/SalesOrderChange/insertDetail';
                    tempObj = this.tabDataI[0];
                    tempObj.masterId = this.detailId;
                    tempObj.docCode = this.docCode;
                    if(!(tempObj['matCode']||tempObj['cx1']||tempObj['cx2']||tempObj['cx3']||tempObj['usrTxt1Name'])) {
                        this.handleCancelChild();
                        isSave = false;
                    }
                }else {
                    operate = 'edit';
                    api = '/oms/sls/SalesOrderChange/updateDetailItem';
                    tempObj = this.childDetailRow;
                    tempObj.orderNewUsrTxt1 = this.childDetailRow.usrTxt1;
                    tempObj.orderNewUsrTxt1Name = this.childDetailRow.usrTxt1Name;
                    tempObj.orderNewUsrTxt2 = this.childDetailRow.usrTxt2;
                    tempObj.orderNewUsrTxt2Name = this.childDetailRow.usrTxt2Name;
                    tempObj.orderNewUsrTxt3 = this.childDetailRow.usrTxt3;
                    tempObj.orderNewUsrTxt3Name = this.childDetailRow.usrTxt3Name;
                    tempObj.orderNewUsrTxt6 = this.childDetailRow.usrTxt6;
                    tempObj.orderNewUsrTxt6Name = this.childDetailRow.usrTxt6Name;
                    tempObj.orderNewDigit = this.childDetailRow.digit;
                    tempObj.orderNewRemark = this.childDetailRow.remark;
                    tempObj.orderNewMatCode = this.childDetailRow.matCode;
                    tempObj.orderNewMatName = this.childDetailRow.matName;
                    tempObj.orderNewCx1 = this.childDetailRow.cx1;
                    tempObj.orderNewCx1Name = this.childDetailRow.cx1Name;
                    tempObj.orderNewCx2 = this.childDetailRow.cx2;
                    tempObj.orderNewCx2Name = this.childDetailRow.cx2Name;
                    tempObj.orderNewCx3 = this.childDetailRow.cx3;
                    tempObj.orderNewCx3Name = this.childDetailRow.cx3Name;
                    tempObj.orderNewCx4 = this.childDetailRow.cx4;
                    tempObj.orderNewCx4Name = this.childDetailRow.cx4Name;
                    tempObj.detailId = this.childDetailRow.fid;
                }
                isSave && this.fetch(api,tempObj)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.childDetailRow.fid = null;
                            if(operate === 'edit') {
                                this.handleCancelChild();
                            }else {
                                this.getChildTable(this.detailId);
                                this.otherVariable.isChildEdit = false;
                            }
                        }else {
                            this.tabDataI[this.editIndex].isEditState = true;
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            });
                        }
                    });
                this.tabDataI = this.giveState(this.tabDataI)
            },
            //从表取消操作
            handleCancelChild() {
                this.getChildTable(this.detailId);
                this.otherVariable.isChildEdit = false;
            },
            //从表删除行
            handleRealDeleteChild(row,index) {
                if(confirm('是否确定删除?') === true) {
                    this.fetch('/oms/sls/SalesOrderChange/deleteDetail',[{fid:row.fid}])
                        .then(result => {
                            if(result.status === 200) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.getChildTable(this.detailId);
                            }else {
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                });
                            }
                        });
                    this.otherVariable.isChildEdit = false;
                }
            },
            //从表变更删除行
            handleDeleteChild(index,rows,isDelete = true) {
                let tempObj = {
                    orderDetailId: rows[index].orderDetailId,
                    masterId: rows[index].masterId,
                    variantId: rows[index].variantId,
                    changeDetailItemId: rows[index].changeDetailItemId
                };
                let apiUrl;
                let confirmText;
                let successText;
                if(isDelete) {
                    apiUrl = '/oms/sls/SalesOrderChange/deleteOrderChangeDetail';
                    confirmText = '是否确定删除?';
                    successText = '删除成功';
                }else {
                    apiUrl = '/oms/sls/SalesOrderChange/cancelDeleteOrderChangeDetail';
                    confirmText = '是否取消删除?';
                    successText = '取消删除成功';
                }
                if(rows[index].masterId) {
                    if(confirm(confirmText) === true) {
                        this.fetch(apiUrl,tempObj)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: successText,
                                        type: 'success'
                                    });
                                    this.getChildTable(this.detailId);
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    });
                                }
                            });
                        this.otherVariable.isChildEdit = false;
                    }
                }else {
                    this.$message({
                        message: '新增的明细不可删除',
                        type: 'warning'
                    })
                }
            },

            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
            },
            //从表点击行
            clickDetail(row) {
                if(row.changType === 1) {
                    this.otherVariable.isChildEdit = true;
                    this.tabDataI = this.giveState(this.tabDataI);
                    row.isEditState = true;
                    this.$nextTick(() => {
                        this.matCode = row.matCode;
                        this.colorName = row.cx1Name;
                        this.matAlloy = row.cx2;
                        this.matThick = row.cx3;
                    })
                }
                this.childDetailRow = row || {};
                this.editIndex = this.$lodash.findIndex(this.tabDataI, ['fid', row.fid]);
                if(this.editIndex < 0) {
                    this.editIndex = 0;
                }
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
    .el-tabs .el-tabs__active-bar{
        background-color:transparent !important;
    }

</style>
