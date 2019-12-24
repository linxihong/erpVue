<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap" @click="handleNotAllowed" v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleAdd">新建</el-button>
                <el-button @click="handleRefresh">刷新</el-button>
                <el-button @click="handleReset">重置</el-button>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="searchProp"
                :searchForm="searchForm"
                @getData="getInitPage"
            >
            </CommonSearch>
            <!--表格区域-->
            <CommonTable
                v-if="isResize"
                ref="commontable"
                :mainHeight="mainHeight"
                :isShowStatus="isShowStatus"
                :propData="tableProp"
                @getInitPage="getInitPage"
                :otherVariable="otherVariable"
                :tableData="tableData"
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
                @handleEdit="handleEdit"
                @handleDelete="handleDelete"
            >
                <!--详情头部-->
                <template slot="header">
                    <div class="header-form" ref="headForm">
                        <template v-for="item in formProp">
                            <div v-if="item.type === 'outter'">
                                <span>{{ item.name ? (item.name + ':') : '' }}</span>
                                <span>{{ detailForm[item.prop]==='已提交'?'待提交':(detailForm[item.prop])=='已确认'?'已提交':detailForm[item.prop] }}</span>
                            </div>
                        </template>
                    </div>
                </template>
                <!--头部按钮-->
                <template slot="main-btn-wrap" v-if="!otherVariable.isChildEdit">
                    <div v-if="isBanOperate" class="xs-icon-confirm" @click="handleConfirm">提交</div>
                    <i v-if="isBanOperate" class="sm-icon-edit el-icon-edit" title="编辑" @click="handleEdit"></i>
                    <i v-if="isBanOperate" class="icon-delete" title="删除" @click="handleDelete"></i>
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
                    <!--按钮区域-->
                    <div class="tab-btn-wrap" :style="{left: tabLeft}">
                        <el-button @click="handleCancelChild" v-if="otherVariable.isChildEdit">取消</el-button>
                        <el-button class="btn-cyan search-btn" @click="handleSaveChild(0,'first')" v-if="otherVariable.isChildEdit">保存</el-button>
                    </div>
                    <!--tab区域-->
                    <el-tabs v-model="activeName" class="common-content-tab">
                        <el-tab-pane label="合同明细" name="first">
                            <el-table
                                v-if="isResize"
                                class="childtable"
                                ref="childTable"
                                :span-method="objectSpanMethod"
                                tooltip-effect="dark"
                                v-loading="loadingI"
                                :data="tabDataI"
                                border
                                :height="tableHeight"
                                highlight-current-row
                            >
                                <el-table-column label="价格类型"  align="left" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="报价项目">
                                    <el-table-column label="代码" align="left" width="80px" label-class-name="table-valid-head" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrcode }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="名称" align="left" width="80px" label-class-name="table-valid-head" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrTxt1Name }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="项目类型" align="left" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem1 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="材质" align="left" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem2 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="涂层" align="left" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem3 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="价格(元)" align="right" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem4 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位" align="left" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem5 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注" width="200" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span >{{ scope.row.remark }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="55" fixed="right">
                                    <template slot-scope="scope">
                                        <el-dropdown @command="handleCommand($event,scope.row,scope.$index)">
                                            <span><i class="el-icon-more"></i></span>
                                            <el-dropdown-menu slot="dropdown" class="del-shadow">
                                                <el-dropdown-item command="a">编辑</el-dropdown-item>
                                                <el-dropdown-item command="b">删除</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="附加条款" name="second">
                            <el-table
                                v-if="isResize"
                                class="childtable"
                                ref="childTable"
                                tooltip-effect="dark"
                                v-loading="loadingI"
                                :data="tabDataI"
                                border
                                :height="tableHeight"
                                highlight-current-row
                            >
                                <el-table-column type="selection" width="55"></el-table-column>
                                <el-table-column label="序号" type="index" align="center">
                                </el-table-column>
                                <el-table-column label="描述" align="left">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </CommonDetailX>
            <!--新增/编辑区域-->
            <transition name="popup">
                <CommonAdd
                    marginTop="30px"
                    v-show="isShowStatus.isPopUp"
                    :otherVariable="otherVariable"
                    :addForm="addOrEditForm"
                    @handleCancel="handleCancel"
                    @handleSave="handleSave"
                >
                    <template slot="head-form-title">
                        <div class="head-form-title">
                            <span>{{otherVariable.popupTitle}}</span>
                        </div>
                    </template>
                    <template slot="custom-add-form">
                        <el-form :model="searchContractForm" :inline="otherVariable.isInlineForm" label-width="80px">
                            <el-form-item label="合同日期">
                                <el-date-picker
                                    v-model="searchContractForm.docDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="至">
                                <el-date-picker
                                    v-model="searchContractForm.docDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="合同号">
                                <el-input v-model="searchContractForm.contractCode"></el-input>
                            </el-form-item>
                            <el-form-item label=" ">
                                <el-button class="btn-cyan search-btn">查询</el-button>
                                <el-button>重置</el-button>
                            </el-form-item>
                        </el-form>
                        <CommonTable
                            ref="detailTable"
                            :isCenter="true"
                            :isMulTable="true"
                            :isNotMulSelect="false"
                            :otherVariable="detailVariable"
                            :formTableData="tabDataI"
                            :formPropTable="detailTableProp"
                            :tableHeight="$store.state.screenHei*0.58"
                        >
                        </CommonTable>
                    </template>
                </CommonAdd>
            </transition>
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
                tableHeight: this.$store.state.screenHei*0.67,
                mainHeight: 716,
                notAllowUpHeight: 0,
                notAllowDownHeight: 0,
                scrollHeight: 0,
                //显示
                isResize: true,
                isBanOperate: true,
                operateType: 'add',
                topFIds: [],
                isCanSave: false,
                tempWidth: null,
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                //键盘操作
                currentIndex: 0,
                enterTimes: 1,
                isBanNextFocus: false,
                //组件配置
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    detailTitle: '',
                    addTitle: '选择合同',
                    popupTitle: '',
                    isInlineForm: true,
                    isEdit: false,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    loading: false,
                    $isCustom: true,
                    isSaving: false
                },
                //验证规则
                mainRules: {
                    remark: [
                        { required: true, message: '请输入备注', trigger: 'blur' }
                    ],
                },
                //搜索映射表
                searchProp: [
                    {
                        name:'合同号',
                        prop:'refDocCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入合同号'
                    },
                    {
                        name:'合同日期',
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
                        name:'合同号',
                        prop:'contractCode',
                        type:'normal',
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
                    },
                ],
                //详情映射列表
                formProp: [
                    {name:'合同号',prop:'contractCode',type:'outter'},
                    {name:'合同日期',prop:'docDate',type:'outter'},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'经销商',prop:'clientCode2',type:'inner'},
                    {name:'合同类型',prop:'',type:'inner'},
                    {name:'支付方式',prop:'',type:'inner'},
                    {name:'生效日期',prop:'',type:'inner'},
                    {name:'失效日期',prop:'',type:'inner'},
                    {name:'结算方式',prop:'',type:'inner'},
                    {name:'开票方式',prop:'',type:'inner'},
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
                        name1:'变更单号/',
                        prop1:'refDocCode',
                        name2:'状态',
                        prop2:'docStatusName',
                        type:'mixin',
                        width: '115'
                    },
                    {
                        name1:'合同号/',
                        prop1:'contractCode',
                        name2:'合同日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '130'
                    },
                    {
                        name1:'客户/',
                        prop1:'clientCode',
                        name2:'经销商',
                        prop2:'clientCode2',
                        type:'mixin',
                        width: '120'
                    },
                    {
                        name1:'录入人/',
                        prop1:'enterName',
                        name2:'录入日期',
                        prop2:'enterTime',
                        type:'mixin',
                        width: '148'
                    }
                ],
                tableData: [],
                searchForm: {isCancel:0,isClose:0},
                addOrEditForm: {},
                addForm: {},
                detailForm: {},
                copyForm: {},
                tempForm: {},
                submitRow: {},
                detailId: null,
                docCode: null,
                //分页
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //详情表格内容
                tabLeft: '100px',
                activeName: 'first',
                childDetailRow: {},
                clickTimes: 0,
                editIndex: 0,
                isAddDetail: false,
                //订单明细数据
                tabDataI: [
                    {
                        docItem:'铝加工费用',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'铝加工费用',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'铝加工费用',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'表面加工',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'表面加工',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'表面加工',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'隔条加热',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'隔条加热',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'隔条加热',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    }
                ],
                copyDataI: [],
                spanArr: [],
                position: 0,
                loadingI: false,
                isShowNotAllowed: false,
                //选择合同
                searchContractForm: {},
                detailVariable: {
                    isReadTable: true
                },
                detailTableProp: [
                    {prop:'docItem',name:'合同号',type:'normal',align:'center'},
                    {prop:'docItem',name:'状态',type:'normal',align:'center'},
                    {prop:'docItem',name:'合同日期',type:'normal',align:'center'},
                    {prop:'docItem',name:'客户代码',type:'normal',align:'center'},
                    {prop:'docItem',name:'经销商代码',type:'normal',align:'center'},
                    {prop:'docItem',name:'工程名称',type:'normal',align:'center'},
                    {prop:'docItem',name:'生效日期',type:'normal',align:'center'},
                    {prop:'docItem',name:'失效日期',type:'normal',align:'center'},
                ],
                //数据
                valueObj: {}
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
            'currentIndex':{
                handler(val) {
                    this.enterTimes = 1;
                }
            },
            'isBanNextFocus':{
                handler(val) {
                    if(val) {this.enterTimes = 1;}
                }
            },
            'editIndex': {
                handler(val,oldValue) {
                    if(this.otherVariable.isChildEdit) {
                        if(val !== oldValue) {
                            this.clickTimes = 1
                        }
                    }
                }
            },
            deep: true
        },
        mounted() {
            // 获取数据
            this.getData();
            this.rowspan();
            // 操作/布局相关
            this.listenScroll();
            this.listenResize();
            this.changeSize();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                this.tableData = [];
                this.fetch(`/oms/sls/SalesClientOrder/getOrderMaster?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list) {
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
            //刷新
            handleRefresh() {
                this.isBanOperate = true;
                this.getData();
                this.detailForm = {};
                this.detailId = null;
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //重置
            handleReset() {
                this.searchForm = {isCancel:0,isClose:0};
                this.handleRefresh();
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //点击主表行
            handleDetail(row) {
                row.docStatus > 0 ? this.isBanOperate = false : this.isBanOperate = true;
                this.otherVariable.isChildEdit = false;
                // todo
                //this.tabDataI = [];
                this.copyDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.handleCancel(this.operateType,true);
                this.fetch('/oms/sls/SalesClientOrder/getOrderMaster',{fid:row.fid})
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
                // todo
                this.tabDataI = this.giveState(this.tabDataI);
                //this.getChildTable(row.fid);
                this.detailId = row.fid;
                this.docCode = row.docCode;
            },
            //主表添加行
            handleAdd() {
                this.operateType = 'add';
                this.addForm = {};
                this.addOrEditForm = {};
                //this.clearSelect();
                this.isShowStatus.isPopUp = true;
                this.otherVariable.popupTitle = this.otherVariable.addTitle;
                this.otherVariable.isEdit = false;
                this.$nextTick(() => {
                    this.toggleSpread();
                })
            },
            //禁止点击表格提醒
            handleNotAllowed() {
                if(this.isShowStatus.isPopUp) {
                    this.$confirm('此操作将清空已填写的数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.handleCancel(this.operateType,true);
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
            isSaveChildRow() {
                this.$confirm('是否保存?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleSaveChild(0,'first');
                }).catch(() => {
                    console.log('cancel')
                })
            },
            //主表编辑行
            handleEdit() {
                this.operateType = 'edit';
                this.otherVariable.popupTitle = this.otherVariable.detailTitle;
                this.otherVariable.isEdit = true;
                this.addOrEditForm = this.detailForm;
                if(this.detailForm.fid) {
                    this.isShowStatus.isPopUp = true;
                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    })
                }
            },
            //主表保存行
            handleSave(type) {
                this.addOrEditForm.sellType = 1;
                this.$refs.addOrEditForm.validate((valid) => {
                    if(valid) {
                        let tempObj;
                        let api;
                        if(type === 'add') {
                            api = '/oms/sls/SalesClientOrder/insertMaster';
                        }else {
                            api = '/oms/sls/SalesClientOrder/updateMaster';
                        }
                        tempObj = this.addOrEditForm;
                        this.otherVariable.isSaving = true;
                        this.fetch(api,tempObj)
                            .then(result => {
                                if(result.status === 200) {
                                    this.topFIds = [];
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    this.topFIds.push(result.data.fid);
                                    this.isShowStatus.isPopUp = false;
                                    this.addForm = {};
                                    type === 'add' ? this.getData() : this.getData(false);
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    });
                                }
                            })
                            .then(() => {
                                this.otherVariable.isSaving = false;
                            })
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            //主表取消操作
            handleCancel(type,isDetail = false) {
                this.isShowStatus.isPopUp = false;
                if(type === 'add') {
                    this.addOrEditForm = {};
                }else {
                    this.detailForm = this.$lodash.cloneDeep(this.copyForm);
                    this.addOrEditForm = this.$lodash.cloneDeep(this.copyForm);
                }
                //this.$refs.addOrEditForm.resetFields();
                if(!isDetail) {
                    this.$nextTick(() => {
                        this.toggleSpread();
                    })
                }
            },
            //主表确认
            handleConfirm() {
                if(this.detailForm.fid) {
                    this.$confirm('是否提交?', '提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.otherVariable.isSaving = true;
                        this.getAjax(`/oms/sls/SalesClientOrder/clientConfirm?orderId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
                            .then(result => {
                                if (result.status === 200) {
                                    this.$message({
                                        message: result.message,
                                        type: 'success'
                                    });
                                    this.getData(false);
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    })
                                }
                            })
                            .then(() => {
                                this.otherVariable.isSaving = false;
                            })
                    })
                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    });
                }
            },
            //主表取消确认
            handleCanCelConfirm() {
                if(this.detailForm.fid) {
                    this.otherVariable.isSaving = true;
                    this.getAjax(`/oms/sls/SalesClientOrder/unConfirmOrder?orderId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
                        .then(result => {
                            if (result.status === 200) {
                                this.$message({
                                    message: result.message,
                                    type: 'success'
                                });
                                this.getData(false);
                            }else {
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                })
                            }
                        })
                        .then(() => {
                            this.otherVariable.isSaving = false;
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
                if(this.detailForm.fid) {
                    if(confirm('确定删除？') === true) {
                        this.getAjax(`/oms/sls/SalesClientOrder/deleteOrder?orderId=${this.detailForm.fid}`)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    this.detailForm = {};
                                    this.getInitPage();
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.message),
                                        type: 'error'
                                    });
                                }
                            })
                    }
                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    })
                }
            },
            //获取从表
            getChildTable(fid,index,type) {
                this.clickTimes = 0;
                this.tabDataI = [];
                this.loadingI = true;
                this.isShowNotAllowed = true;
                this.getAjax(`/oms/sls/SalesClientOrder/getOrderDetail?pageSize=1000&clientOrderMasterId=${fid}`)
                    .then(result => {
                        this.isShowNotAllowed = false;
                        if(result.data && result.data.list) {
                            this.tabDataI = result.data.list;
                            this.copyDataI = this.$lodash.cloneDeep(this.tabDataI);
                        }
                    })
                    .then(() => {
                        this.loadingI = false;
                        if(!this.isCansave) {
                            this.goTemp(index,type);
                        }
                    })
            },
            handleCommand(command,row,index) {
                if(command === 'a') {
                    this.showEditPrice(row,index);
                }else {
                    this.handleDeleteChild(row,index);
                }
            },
            //从表编辑
            showEditPrice(row,index) {

            },
            //从表保存
            handleSaveChild(index,type,isCopy = false) {
                const that = this;
                this.isCanSave = true;
                let tempObj;
                let api;
                let isHasId;
                let isSave = true;
                this.childDetailRow.fid ? isHasId = true : isHasId = false;
                if(!isHasId) {
                    api = '/oms/sls/SalesClientOrder/insertDetail';
                    tempObj = this.tabDataI[0];
                    tempObj.masterId = this.detailId;
                    tempObj.docCode = this.docCode;
                    saveChild();
                }else {
                    api = '/oms/sls/SalesClientOrder/updateDetail';
                    tempObj = this.childDetailRow;
                    if(this.copyChildDetailRow.matCode !== this.childDetailRow.matCode) {
                        this.$confirm('更改型材型号，跟型号关联的属性会变成默认值，是否继续保存?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            saveChild();
                        }).catch(() => {
                            return false;
                        })
                    }else {
                        saveChild();
                    }
                }
                function saveChild() {
                    isSave && that.fetch(api,tempObj)
                        .then(result => {
                            if(result.status === 200) {
                                that.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                that.isCanSave = false;
                                that.childDetailRow.fid = null;
                                that.handleCancelChild();
                            }else {
                                that.tabDataI[that.editIndex].isEditState = true;
                                that.$message({
                                    message: that.returnErrorMsg(result.error),
                                    type: 'error'
                                });
                                that.isCanSave = false;
                            }
                        });
                    that.tabDataI = that.giveState(that.tabDataI)
                }
            },
            //从表取消操作
            handleCancelChild() {
                //this.getChildTable(this.detailId);
                this.scrollHeight = 0;
                this.otherVariable.isChildEdit = false;
                this.isAddDetail = false;
            },
            //从表删除行
            handleDeleteChild(row,index) {
                if(row.fid) {
                    if(confirm('确定删除？') === true) {
                        this.getAjax(`/oms/sls/SalesClientOrder/deleteDetail?fid=${this.tabDataI[index].fid}&variantId=${this.tabDataI[index].variantId}`)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    this.tabDataI.splice(index,1);
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
                    this.tabDataI.splice(index,1);
                }
            },
            //从表点击行
            clickDetail(row) {
                this.clickTimes += 1;
                if(this.isBanOperate) {
                    if(!this.otherVariable.isReadTable) {
                        this.otherVariable.isChildEdit = true;
                        this.tabDataI = this.giveState(this.tabDataI);
                        row.isEditState = true;
                    }
                    this.childDetailRow = row || {};
                    this.editIndex = this.$lodash.findIndex(this.tabDataI, ['variantId', row.variantId]);
                    if(this.editIndex < 0) {
                        this.editIndex = 0;
                    }
                }else {
                    this.otherVariable.isChildEdit = false;
                }
            },
            //合并列表
            rowspan() {
                this.tabDataI.forEach((item,index) => {
                    if( index === 0){
                        this.spanArr.push(1);
                        this.position = 0;
                    }else{
                        if(this.tabDataI[index].docItem === this.tabDataI[index-1].docItem ){
                            this.spanArr[this.position] += 1;
                            this.spanArr.push(0);
                        }else{
                            this.spanArr.push(1);
                            this.position = index;
                        }
                    }
                })
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {  //表格合并行
                if (columnIndex === 0) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row>0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
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
    .cancel-choose {
        position: absolute;
        top: -10px!important;
        right: 48%!important;
    }
    .confirm-choose {
        position: absolute;
        top: -22px!important;
        right: 42%!important;
    }
    .search-choose {
        position: absolute;
        width: 40%;
        top: 17px;
        left: 2%;
    }
    .choose-list-wrap {
        position: absolute;
        height: calc(~"100% - 50px");
        width: 100%;
        top: 50px;
        padding: 10px;
    }
    .choose-item {
        position: relative;
        margin-bottom: 20px;
    }
    .choose-add-btn {
        position: absolute;
        top: 0;
        right: 5px;
        z-index: 1;
    }
</style>
