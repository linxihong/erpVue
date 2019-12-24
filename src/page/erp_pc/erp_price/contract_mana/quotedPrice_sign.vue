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
                            </div>
                        </template>
                    </div>
                </template>
                <!--头部按钮-->
                <template slot="main-btn-wrap" v-if="!otherVariable.isChildEdit">
                    <div v-if="showButton" class="xs-audit-icon" @click="!otherVariable.isSaving && handleAdudit('alone')"  :class="otherVariable.isSaving ? 'banClick' : ''" >签批</div>
                    <div v-if="showUnAudit" class="xs-unaudit-icon" @click="handleUnAudit">反批</div>
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
                        <!--<el-button class="btn-cyan search-btn" @click="handleAddChild" v-if="!otherVariable.isChildEdit">增行</el-button>-->
                        <!--<el-button @click="handleCancelChild" v-if="otherVariable.isChildEdit">取消</el-button>-->
                        <!--<el-button class="btn-cyan search-btn" @click="handleSaveChild(0,'first')" v-if="otherVariable.isChildEdit">保存</el-button>-->
                    </div>
                    <!--tab区域-->
                    <el-tabs v-model="activeName" class="common-content-tab order_style">
                        <el-tab-pane label="报价明细" name="first">
                            <el-table
                                v-if="isResize"
                                class="childtable"
                                ref="childTable"
                                :span-method="objectSpanMethod"
                                tooltip-effect="dark"
                                v-loading="loadingI"
                                :data="tabDataI"
                                @row-click="clickDetail"
                                border
                                :height="tableHeight"
                                highlight-current-row
                            >
                                <el-table-column label="价格类型"  align="right" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem }}</span>
                                    </template>
                                </el-table-column>

                                <el-table-column label="报价项目">
                                    <el-table-column label="代码" :align="otherVariable.isChildEdit?'center':'left'" width="80px" label-class-name="table-valid-head" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrcode }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="名称" :align="otherVariable.isChildEdit?'center':'left'" width="80px" label-class-name="table-valid-head" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrTxt1Name }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="项目类型"  align="right" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem1 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="材质"  align="right" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem2 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="涂层"  align="right" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem3 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="价格(元)"  align="right" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem4 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位"  align="right" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem5 }}</span>
                                    </template>
                                </el-table-column>


                                <el-table-column label="备注" width="200" :align="otherVariable.isChildEdit?'center':'left'" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span >{{ scope.row.remark }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="isBanOperate" label="操作" align="center" width="55" fixed="right">
                                    <template slot-scope="scope">
                                        <i v-if="!(Boolean(scope.row.variantId)&&Boolean(scope.row.parentVariantId))" class="el-icon-delete expand-delete" title="删除" @click.stop="handleDeleteChild(scope.row,scope.$index)"></i>
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
                        <el-form ref="addOrEditForm" :rules="mainRules" :model="addOrEditForm" :inline="otherVariable.isInlineForm" label-width="120px">
                            <el-form-item label="工程项目" prop="projectName">
                                <el-input></el-input>
                                <!--<el-input
                                    v-model="addOrEditForm.projectName"
                                    @keydown.enter.native="nextFocus"
                                    data-index
                                    @focus="setFocus(8)"
                                ></el-input>-->
                            </el-form-item>
                            <el-form-item label="客户" prop="clientCode">
                                <el-input></el-input>
                                <!--<SelectEnter
                                    data-index
                                    @inputFocus="setFocus(3)"
                                    @selected="nextFocus"
                                    ref="clientSelect"
                                    :inputValue="valueObj.clientCode"
                                    :selectTHs="valueObj.clientTHs"
                                    :selectTds="valueObj.orgClientList"
                                    placeholder="请输入客户代码"
                                    @getList="getOrgClient"
                                    @setObj="setClient"
                                    selectLabel="fcode"
                                    selectValue="fcode"
                                    selectKey="fid">
                                </SelectEnter>-->
                            </el-form-item>
                            <el-form-item label="报价日期" prop="docDate">
                                <el-input></el-input>
                                <!--<el-date-picker
                                    :readonly="operateType === 'edit'"
                                    v-model="addOrEditForm.docDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                    data-index
                                    @blur="nextFocus"
                                    @focus="setFocus(0)"
                                >
                                </el-date-picker>-->
                            </el-form-item>
                            <el-form-item label="报价类型" prop="docType">
                                <el-input></el-input>
                                <!--<el-select
                                    clearable
                                    v-model="addOrEditForm.docType"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(1)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in orderTypeList"
                                        :key="index"
                                        :label="item.dictText"
                                        :value="item.dictText">
                                    </el-option>
                                </el-select>-->
                            </el-form-item>
                            <el-form-item label="计价方式" prop="packMethodName">
                                <el-input></el-input>
                                <!--<SelectEnter
                                    data-index
                                    @inputFocus="setFocus(10)"
                                    @selected="nextFocus"
                                    ref="packMethodSelect"
                                    :inputValue="valueObj.packMethodName"
                                    :selectTHs="valueObj.packMethodTHs"
                                    :selectTds="valueObj.mdmPackList"
                                    placeholder="请选择"
                                    @getList="getMdmPackMethod"
                                    @setObj="setPackMethod"
                                    selectLabel="fname"
                                    selectValue="fname"
                                    selectKey="fid">
                                </SelectEnter>-->
                            </el-form-item>
                            <el-form-item label="备注说明" class="full-remark">
                                <el-input></el-input>
                                <!--<el-input
                                    type="textarea" :rows="3" v-model="addOrEditForm.remark" prop="remark"
                                    @keydown.enter.native="nextFocus"
                                    data-index
                                    @focus="setFocus(9)"
                                ></el-input>-->
                            </el-form-item>
                        </el-form>
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
                isShowCopyBtn: false,
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
                //批量修改数据
                orderDetailDTOList:[],
                enterTimes: 1,
                isBanNextFocus: false,
                //组件配置
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    detailTitle: '编辑报价',
                    addTitle: '新建报价',
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
                        name:'报价单号',
                        prop:'refDocCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入报价单号'
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
                    {name:'报价单号',prop:'refDocCode',type:'outter'},
                    {name:'报价日期',prop:'docDate',type:'outter'},
                    {name:'单据状态',prop:'docDate',type:'outter'},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'销售公司',prop:'',type:'inner'},
                    {name:'业务员',prop:'',type:'inner'},
                    {name:'贴膜要求',prop:'clientCode2',type:'inner'},
                    {name:'提货方式',prop:'',type:'inner'},
                    {name:'经销商',prop:'',type:'inner'},
                    {name:'供货公司',prop:'',type:'inner'},
                    {name:'包装方式',prop:'',type:'inner'},
                    {name:'结算方式',prop:'',type:'inner'},
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
                        name1:'报价单号/',
                        prop1:'refDocCode',
                        name2:'状态',
                        prop2:'docStatusName',
                        status:'docStatus',
                        type:'mixinStatus',
                        width: '115'
                    },
                    {
                        name1:'报价类型/',
                        prop1:'docType',
                        name2:'报价日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '130'
                    },
                    {
                        name1:'客户/',
                        prop1:'',
                        name2:'区域',
                        prop2:'',
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
                copyChildDetailRow: {},
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
                showButton:false,
                showUnAudit:false,

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
            //重置
            handleReset() {
                this.searchForm = {isCancel:0,isClose:0};
                this.handleRefresh();
            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //点击主表行
            handleDetail(row) {
                this.orderDetailDTOList = [];
                row.docStatus > 0 ? this.isBanOperate = false : this.isBanOperate = true;
                this.otherVariable.isChildEdit = false;
                //this.tabDataI = [];
                this.copyDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.handleCancel(this.operateType);
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
            //审批
            handleAdudit(){},
            //反审
            handleUnAudit(){},
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
            handleCancel(type) {
                this.isShowStatus.isPopUp = false;
                if(type === 'add') {
                    this.addOrEditForm = {};
                }else {
                    this.detailForm = this.$lodash.cloneDeep(this.copyForm);
                    this.addOrEditForm = this.$lodash.cloneDeep(this.copyForm);
                }
                this.$refs.addOrEditForm.resetFields();
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
            //从表添加行
            handleAddChild() {
                if(this.detailForm.fid) {
                    /*this.isShowCopyBtn = false;
                    this.isAddDetail = true;
                    //this.clearCellSelect();
                    this.otherVariable.isChildEdit = true;
                    this.childDetailRow.fid = null;
                    this.$nextTick(()=>{
                        this.tempForm = {matCode:'',matName:'',cx1:'',cx1Name:'',cx2:'',cx2Name:'',cx3:'',cx3Name:'',usrTxt1Name:'',usrTxt1:'',isEditState:true};
                        this.tabDataI.unshift(this.$lodash.cloneDeep(this.tempForm));
                    });
                    setTimeout(() => {
                        $('.el-table__body-wrapper .el-input__inner')[0].focus();
                    },200)*/
                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    });
                }
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
                if(isCopy) {
                    api = '/oms/sls/SalesClientOrder/insertDetail';
                    tempObj = this.childDetailRow;
                    saveChild();
                }else {
                    if(!isHasId) {
                        api = '/oms/sls/SalesClientOrder/insertDetail';
                        tempObj = this.tabDataI[0];
                        tempObj.masterId = this.detailId;
                        tempObj.docCode = this.docCode;
                        if(!(tempObj['matCode']||tempObj['cx1']||tempObj['cx2']||tempObj['cx3']||tempObj['usrTxt1'])) {
                            this.handleCancelChild();
                            isSave = false;
                        }
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
                this.isShowCopyBtn = !(Boolean(row.variantId)&&Boolean(row.parentVariantId));
                this.clickTimes += 1;
                if(this.isBanOperate) {
                    if(!this.otherVariable.isReadTable) {
                        this.otherVariable.isChildEdit = true;
                        this.tabDataI = this.giveState(this.tabDataI);
                        row.isEditState = true;
                        this.$nextTick(() => {
                            this.matCode = row.matCode;
                            this.colorName = row.cx1Name;
                            this.matAlloy = row.cx2;
                            this.matThick = row.cx3Name;
                            this.markMethod = row.usrTxt1Name;
                        });
                        this.orderDetailDTOList.push(row);
                    }
                    this.childDetailRow = row || {};
                    this.$nextTick(() => {
                        if(this.clickTimes === 1) {
                            this.copyChildDetailRow = this.$lodash.cloneDeep(this.childDetailRow);
                        }
                    });
                    this.editIndex = this.$lodash.findIndex(this.tabDataI, ['variantId', row.variantId]);
                    if(this.editIndex < 0) {
                        this.editIndex = 0;
                    }
                    //根据滚动条位置调整禁止区域
                    if(this.scrollHeight) {
                        this.notAllowUpHeight = this.editIndex*34 - this.scrollHeight + 'px';
                        this.notAllowDownHeight = this.tableHeight - 121 + this.scrollHeight - this.editIndex*34 + 'px';
                    }else {
                        this.notAllowUpHeight = this.editIndex*34+'px';
                        this.notAllowDownHeight = this.tableHeight - 121 - this.editIndex*34 + 'px';
                    }
                }else {
                    this.otherVariable.isChildEdit = false;
                }
            },
            //批量修改明细
            UpdataorderList(){
                if(this.orderDetailDTOList.length) {
                    this.fetch('/oms/sls/SalesOrderDetail/updateList',this.orderDetailDTOList)
                        .then(result => {
                            if(result.status ===200){
                                this.$message({
                                    message:result.message,
                                    type:'success'
                                });
                                this.isShowCopyBtn = false;
                                this.otherVariable.isChildEdit=false;
                                this.isShowNotAllowed = false;
                                this.isBanOperate = true;
                                this.tabDataI[this.editIndex].isEditState = false;
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
                }else {
                    this.$message({
                        message: '请选择修改项',
                        type:'warning'
                    })
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
</style>
