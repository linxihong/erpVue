<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleAdd">新建</el-button>
                <el-button @click="handleRefresh">刷新</el-button>
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
                ref="commontable"
                :isShowStatus="isShowStatus"
                :propData="tableProp"
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
            <CommonDetail
                marginTop="30px"
                :editRules="editRules"
                :isShowStatus="isShowStatus"
                :otherVariable="otherVariable"
                :propData="formProp"
                :detailForm="detailForm"
                @toggleSpread="toggleSpread"
                @handleEdit="handleEdit"
                @handleDelete="handleDelete"
                @handleCancel="handleCancel"
                @handleSave="handleSave"
            >
                <template slot="head-form-title">
                    <div class="head-form-title">
                        <span>{{otherVariable.detailTitle}}</span>
                    </div>
                </template>
            </CommonDetail>
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
                            <el-form-item label="商机代码" prop="doccode">
                                <el-input v-model="addOrEditForm.doccode" readonly></el-input>
                            </el-form-item>

                            <el-form-item label="商机名称" prop="doctitle">
                                <el-input v-model="addOrEditForm.doctitle"></el-input>
                            </el-form-item>
                            <el-form-item label="商机类型" prop="doctype">
                                <el-select v-model="addOrEditForm.doctype" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in docTypeList"
                                        :key="index"
                                        :label="item.dicttext"
                                        :value="item.dicttext">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="商机来源" prop="chancesource"  >
                                <el-select v-model="addOrEditForm.chancesource" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in chancesourceList"
                                        :key="index"
                                        :label="item.dicttext"
                                        :value="item.dicttext">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="客户名称" prop="cltcompanyname">
                                <SelectEnter
                                    ref="cltcompanySelect"
                                    :inputValue="valueObj.clientName"
                                    :selectTHs="valueObj.clientTHs"
                                    :selectTds="valueObj.clientList"
                                    @getList="getClient"
                                    @setObj="setClient"
                                    selectLabel="fname"
                                    selectValue="fname"
                                    selectKey="fid">
                                </SelectEnter>
                            </el-form-item>
                            <el-form-item label="中介名称" prop="agencyname">
                                <el-input v-model="addOrEditForm.agencyname"></el-input>
                            </el-form-item>
                            <el-form-item label="销售预期" prop="expectdate">
                                <el-date-picker
                                    v-model="addOrEditForm.expectdate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item label="预期收益" prop="expectincome">
                                <el-input v-model="addOrEditForm.expectincome"></el-input>
                            </el-form-item>
                            <el-form-item label="可能性">
                                <el-input v-model="addOrEditForm.possibility"></el-input>
                            </el-form-item>
                            <el-form-item label="成功关键因素" class="full-remark">
                                <el-input type="textarea" :rows="3" v-model="addOrEditForm.successfactors"></el-input>
                            </el-form-item>
                            <el-form-item label="失败关键因素" class="full-remark">
                                <el-input type="textarea" :rows="3" v-model="addOrEditForm.failurefactors"></el-input>
                            </el-form-item>
                            <el-form-item label="备注" class="full-remark">
                                <el-input type="textarea" :rows="3" v-model="addOrEditForm.memo"></el-input>
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
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    import CommonDetailX from '$src/components/CommonDetailX'
    import CommonAdd from '$src/components/CommonAdd'
    import CommonData from '$src/components/CommonData'
    import SelectEnter from '$src/components/SelectEnter'
    import CommonDetail from '$src/components/CommonDetail'
    export default {
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetailX,
            CommonAdd,
            CommonData,
            SelectEnter,
            CommonDetail,

        },
        data() {
            const that = this;
            return {
                operateType: 'add',
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    detailTitle: '商机信息',
                    addTitle: '新增商机信息',
                    popupTitle: '',
                    isInlineForm: true,
                    isEdit: false,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    loading: false,
                    $isCustom: true
                },
                tempWidth: null,
                tableData: [],
                mainRules: {
                    doctitle: [
                        { required: true, message: '请输入商机名称', trigger: 'blur' }
                    ],
                    doctype: [
                        { required: true, message: '请输入商机类型', trigger: 'change' }
                    ],
                    chancesource: [
                        { required: true, message: '请输入商机来源', trigger: 'change' }
                    ],
                    cltcompanyname: [
                        { required: true, message: '请选择客户', trigger: 'change' }
                    ],
                    agencyname: [
                        { required: true, message: '请输入中介名称', trigger: 'blur' }
                    ],
                    expectdate: [
                        { required: true, message: '请选择销售预期', trigger: 'change' }
                    ],
                    expectincome: [
                        { required: true, message: '请选择预期收益', trigger: 'blur' }
                    ]
                },
                editRules: {
                    doctitle: [
                        { required: true, message: '请输入商机名称', trigger: 'blur' }
                    ],
                    doctype: [
                        { required: true, message: '请输入商机类型', trigger: 'change' }
                    ],
                    chancesource: [
                        { required: true, message: '请输入商机来源', trigger: 'change' }
                    ],
                    cltcompanyname: [
                        { required: true, message: '请选择客户', trigger: 'change' }
                    ],
                    agencyname: [
                        { required: true, message: '请输入中介名称', trigger: 'blur' }
                    ],
                    expectdate: [
                        { required: true, message: '请选择销售预期', trigger: 'change' }
                    ],
                    expectincome: [
                        { required: true, message: '请选择预期收益', trigger: 'blur' }
                    ]
                },
                //搜索映射表
                searchProp: [
                    {
                        name:'商机名称',
                        prop:'doctitle',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入商机名称/类型'
                    },
                    {
                        name:'商机名称',
                        prop:'doctitle',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false,

                    },
                    {
                        name:'商机类型',
                        prop:'doctype',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'客户名称',
                        prop:'cltcompanyname',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    }
                ],
                //详情映射列表
                formProp: [
                    {name:'fid',prop:'fid',type:'normal',isMainSearch:false,isMain:true,placeholder:'请输入商机名称/类型'},
                    {name:'商机代码',prop:'doccode',type:'normal',isMainSearch:false,isMain:false},
                    {name:'商机名称',prop:'doctitle',type:'normal',isMainSearch:false,isMain:false},
                    {name:'商机类型',prop:'doctype',type:'select',isMainSearch:false,isMain:false,selectList:[]},
                    {name:'商机来源',prop:'chancesource',type:'select',isMainSearch:false,isMain:false,selectList:[]},
                    {name:'客户名称',prop:'cltcompanyname',type:'normal',isMainSearch:false,isMain:false},
                    {name:'中介机构',prop:'agencyname',type:'normal',isMainSearch:false,isMain:false},
                    {name:'销售预期',prop:'expectdate',type:'normal',isMainSearch:false,isMain:false},
                    {name:'预期收益',prop:'expectincome',type:'normal',isMainSearch:false,isMain:false},
                    {name:'可能性',prop:'possibility',type:'normal',isMainSearch:false,isMain:false},
                    {name:'成功关键因素',prop:'successfactors',type:'textarea',isMainSearch:false,isMain:false},
                    {name:'失败关键因素',prop:'failurefactors',type:'textarea',isMainSearch:false,isMain:false},
                    {name:'备注',prop:'memo',type:'textarea',isMainSearch:false,isMain:false},
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
                        name1:'商机名称/',
                        prop1:'doctitle',
                        name2:'商机类型',
                        prop2:'doctype',
                        type:'doctypes',
                        width: ''
                    },
                    {
                        name1:'登记人/',
                        prop1:'entername',
                        name2:'登记日期',
                        prop2:'entertime',
                        type:'mixin',
                        width: ''
                    },
                ],
                searchForm: {},
                addOrEditForm: {},
                addForm: {},
                detailForm: {},
                copyForm: {},
                tempForm: {},
                submitRow: {},
                detailId: null,
                docCode: null,
                //商机类型
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
                focusTimes: 1,
                editIndex: 0,
                //订单明细数据
                tabDataI: [],
                copyDataI: [],
                loadingI: false,
                //商机类型
                docTypeList: [],
                //商机来源
                chancesourceList:[],
                //货期等级
                deliveryLevelList: [],
                valueObj: {
                    //包装方式
                    mdmPackMethod: null,
                    mdmPackList: [],
                    mdmPackTHs: [
                        {label:'代码',prop:'fcode'},
                        {label:'名称',prop:'fname'}
                    ],
                    //工程列表
                    projectName: null,
                    projectList: [],
                    projectTHs: [
                        {label:'代码',prop:'fcode'},
                        {label:'名称',prop:'fname'}
                    ],
                    //合同编号
                    contractCode: null,
                    contractList: [],
                    contractTHs: [
                        {label:'代码',prop:'fcode'},
                        {label:'名称',prop:'fname'}
                    ],
                    //客户
                    clientName: null,
                    clientList: [],
                    clientTHs: [
                        {label:'代码',prop:'fcode'},
                        {label:'名称',prop:'fname'}
                    ],
                }
            }
        },
        mounted() {
            this.getData();
            this.getdocType();
            this.getChancesourceList();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                this.tableData = [];
                this.fetch(`/crm/sls/ChanceDocController/getChanceList?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            if (isFirst) {
                                this.$nextTick(() => {
                                    this.$refs.commontable.renderRow(this.tableData[0].fid);
                                })
                            } else {
                                this.$nextTick(() => {
                                    this.$refs.commontable.renderRow(this.detailId);
                                })
                            }
                        }else {
                            this.tabDataI = [];
                            this.copyDataI = [];
                            this.detailForm = {};
                            this.copyForm = {};
                            this.detailId = null;
                            this.docCode = null;
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            clearSelect() {
                this.$refs.cltcompanySelect.inputValueData = '';
            },
            //点击主表行
            handleDetail(row) {
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.copyDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.handleCancel(this.operateType);
                this.fetch('/crm/sls/ChanceDocController/getChanceList',{fid:row.fid})
                    .then(result => {
                        if(result.status === 200) {
                            this.detailForm = result.data.list[0];
                            this.copyForm = this.$lodash.cloneDeep(result.data.list[0]);
                            this.formProp[3].selectList = this.formatArray(this.docTypeList,'dicttext','dictvalue');
                            this.formProp[4].selectList = this.formatArray(this.chancesourceList,'dicttext','dicttext');
                        }else {
                            this.$message({
                                message: '请求失败',
                                type: 'warning'
                            });
                            this.detailForm = {};
                            this.copyForm = {};
                        }
                    });
                this.detailId = row.fid;
                this.docCode = row.docCode;
            },
            //主表添加行
            handleAdd() {
                this.operateType = 'add';
                this.clearSelect();
                this.isShowStatus.isPopUp = true;
                this.otherVariable.popupTitle = this.otherVariable.addTitle;
                this.otherVariable.isEdit = false;
                this.addOrEditForm = this.addForm;

            },
            //主表编辑行
            handleEdit() {
                this.operateType = 'edit';
                this.otherVariable.popupTitle = this.otherVariable.detailTitle;
                this.otherVariable.isEdit = true;
                this.addOrEditForm = this.detailForm;
                if(this.detailForm.fid) {
                    this.isShowStatus.isPopUp = true;
                    this.$set(this.addOrEditForm,'cltcompanyname',this.detailForm.cltcompanyname);
                    this.$set(this.valueObj,'clientName',this.detailForm.cltcompanyname);
                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    });
                }
            },
            //主表保存行
            handleSave(type) {
                let tempObj;
                let api;
                if(type === 'add') {
                    api = '/crm/sls/ChanceDocController/addChance';
                    tempObj = this.addForm;
                }else {
                    api = '/crm/sls/ChanceDocController/updateChance';
                    tempObj = this.detailForm;
                }
                this.fetch(api,tempObj)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.isShowStatus.isPopUp = false;
                            this.addForm = {};
                            this.searchForm = {};
                            this.getData();
                        }else {
                            this.$message({
                                message: '保存失败',
                                type: 'error'
                            })
                        }
                    })
            },
            handleRefresh(){
                this.isBanOperate = true;
                this.searchForm = {};
                this.getData();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },
            //主表取消操作
            handleCancel(type) {
                this.isShowStatus.isPopUp = false;
                if(type === 'add') {
                    this.addForm = {};
                }else {
                    this.detailForm = this.$lodash.cloneDeep(this.copyForm);
                    this.addOrEditForm = this.$lodash.cloneDeep(this.copyForm);
                }
            },
            //主表删除行
            handleDelete() {
                if(this.detailForm.fid) {
                    if(confirm('确定删除？') === true) {
                        this.getAjax(`/oms/sls/SalesOrderMaster/deleteOrder?orderId=${this.detailForm.fid}`)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    this.searchForm = {};
                                    this.detailForm = {};
                                    this.getData();
                                }else {
                                    this.$message({
                                        message: '删除失败',
                                        type: 'error'
                                    });
                                }
                            })
                    }
                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    });
                }
            },
            //切换布局
            toggleSpread() {
                this.otherVariable.isSpread = !this.otherVariable.isSpread;
                if(this.otherVariable.isSpread) {
                    this.otherVariable.contentWidth = 100;
                }else {
                    this.otherVariable.contentWidth = this.tempWidth;
                }
            },
            //从表点击行
            clickDetail(row) {
                this.focusTimes = 1;
                if(!this.otherVariable.isReadTable) {
                    this.otherVariable.isChildEdit = true;
                    this.tabDataI = this.giveState(this.tabDataI);
                    row.isEditState = true;
                    this.$nextTick(() => {
                        this.matCode = row.matCode;
                        this.colorCode = row.cx1;
                        //this.handleFocus();
                    })
                }
                this.childDetailRow = row || {};
                this.editIndex = this.$lodash.findIndex(this.tabDataI, ['variantId', row.variantId]);
                if(this.editIndex < 0) {
                    this.editIndex = 0;
                }
            },
            //获取子型号列表
            getMatCodeList(val) {
                this.matCodeList = [];
                if(val) {
                    this.fetch('/oms/BasedataController/selectAluModel?pageSize=10000',{fcode:val})
                        .then(result => {
                            if(result.data && result.data.list) {
                                this.matCodeList = result.data.list;
                            }
                        });
                }
            },
            //获取子型号
            setMatCode(item) {
                this.matCode = item.fcode;
                this.$set(this.tabDataI[this.editIndex],'matCode',item.fcode);
                this.$set(this.tabDataI[this.editIndex],'matName',item.fname);
            },
            //获取颜色列表
            getColorCodeList(val) {
                this.colorCodeList = [];
                if(val) {
                    this.fetch('/oms/BasedataController/selectMatColor?pageSize=10000',{fcode:val})
                        .then(result => {
                            if(result.data && result.data.list) {
                                this.colorCodeList = result.data.list;
                            }
                        });
                }
            },
            //获取商机来源
            getChancesourceList() {
                this.chancesourceList = [];
                this.getAjax('/oms/sys/DataDictionary/getChanceSource?pageSize=10000')
                    .then(result => {
                        if(result.data) {
                            this.chancesourceList = result.data;

                        }
                    })
            },

            //获取商机类型
            getdocType() {
                this.docTypeList = [];
                this.getAjax('/oms/sys/DataDictionary/getChanceType?pageSize=10000')
                    .then(result => {
                        if(result.data) {
                            this.docTypeList = result.data;
                        }
                    })
            },

            //客户
            getClient(val) {
                this.$refs.commondata.getClient(val);
            },
            setClient(item) {
                //客户
                this.$set(this.valueObj,'clientName',item.fname);
                this.$set(this.addOrEditForm,'cltcompanyname',item.fname);
                this.$set(this.addOrEditForm,'cltcompanycode',item.fcode);
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
    .el-textarea__inner{
        padding: 5px 23px !important;
    }

</style>
