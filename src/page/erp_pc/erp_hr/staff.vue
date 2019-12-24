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
            <CommonDetailX
                :otherVariable="otherVariable"
                :propData="formProp"
                :detailForm="detailForm"
                :hasSimpleHead="true"
                @toggleSpread="toggleSpread"
                @handleEdit="handleEdit"
                @handleDelete="handleDelete"
                headHeight="60px"
            >
                <!--头部按钮-->
                <template slot="main-btn-wrap">
                    <div class="icon-edit" @click="handleEdit"></div>
                    <i class="icon-delete" title="删除" @click="handleDelete"></i>
                </template>
            </CommonDetailX>
            <!--新增/编辑区域-->
            <transition name="popup">
                <CommonAdd
                    v-show="isShowStatus.isPopUp"
                    :otherVariable="otherVariable"
                    :addForm="addOrEditForm"
                    @handleCancel="handleCancel"
                    @handleSave="handleSave"
                    headHeight="60px"
                >
                    <template slot="head-form-title">
                        <div class="head-form-title">
                            <span>{{otherVariable.popupTitle}}</span>
                        </div>
                    </template>
                    <template slot="custom-add-form">
                        <el-form ref="addOrEditForm" :rules="addRules" :model="addOrEditForm" :inline="otherVariable.isInlineForm" label-width="120px">
                            <div class="inline-form-title" style="width: 110px">人员基本信息</div>
                            <el-form-item label="员工编号" prop="empCode">
                                <el-input
                                    v-model="addOrEditForm.empCode"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(0)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="员工姓名" prop="empName">
                                <el-input
                                    v-model="addOrEditForm.empName"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(1)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="员工状态" prop="status">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.status"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(2)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in statusList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="民族" prop="nationnality">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.nationnality"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(3)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in nationnalityList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="政治面貌" prop="politicalstatus">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.politicalstatus"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(4)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in politicalStatusList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="性别" prop="sex">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.sex"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(5)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in sexList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <div class="inline-form-title">户籍信息</div>
                            <el-form-item label="身份证号码" prop="idnum">
                                <el-input
                                    v-model="addOrEditForm.idnum"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(7)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="出生日期" prop="birthdate">
                                <el-date-picker
                                    v-model="addOrEditForm.birthdate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                    data-index
                                    @blur="nextFocus"
                                    @focus="setFocus(8)"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="婚姻状况" prop="marriage">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.marriage"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(9)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in marriageList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="籍贯省" prop="province">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.province"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(10)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in provinceList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="籍贯市" prop="city">
                                <el-input
                                    v-model="addOrEditForm.city"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(11)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="出生地" prop="homeplace">
                                <el-input
                                    v-model="addOrEditForm.homeplace"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(12)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="户口所在地" prop="regresidence">
                                <el-input
                                    v-model="addOrEditForm.regresidence"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(13)"
                                ></el-input>
                            </el-form-item>
                            <div class="inline-form-title">员工信息</div>
                            <el-form-item label="员工工号" prop="empNum">
                                <el-input
                                    v-model="addOrEditForm.empNum"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(14)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="工牌IC卡号" prop="cardno">
                                <el-input
                                    v-model="addOrEditForm.cardno"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(15)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="是否正式员工" prop="isregempflag">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.isregempflag"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(16)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in regempflagList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="员工类型" prop="empTypeid">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.empTypeid"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(17)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in empTypelist"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="所属组织" prop="orgids" class="full-remark">
                                <el-select v-model="selectOrgNames" multiple placeholder="请选择">
                                    <el-option
                                        v-for="(item,index) in groupList"
                                        :key="index"
                                        :label="item.orgname"
                                        :value="item.orgname">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <div class="inline-form-title" style="width: 130px">联系方式及其他</div>
                            <el-form-item label="家庭地址" prop="homeAddress">
                                <el-input
                                    v-model="addOrEditForm.homeAddress"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(18)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话" prop="phoneContact">
                                <el-input
                                    v-model="addOrEditForm.phoneContact"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(19)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="手机号码" prop="phoneMobile">
                                <el-input
                                    v-model="addOrEditForm.phoneMobile"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(20)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="手机短号" prop="phoneShort">
                                <el-input
                                    v-model="addOrEditForm.phoneShort"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(21)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="电子邮箱" prop="email">
                                <el-input
                                    v-model="addOrEditForm.email"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(22)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="特长" prop="speciality">
                                <el-input
                                    v-model="addOrEditForm.speciality"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(23)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="备注" prop="remark">
                                <el-input
                                    v-model="addOrEditForm.remark"
                                    data-index
                                    @keydown.enter.native="nextFocus"
                                    @focus="setFocus(24)"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </template>
                </CommonAdd>
            </transition>
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
    export default {
        mixins: [CommonMixins],
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetailX,
            CommonAdd,
        },
        data() {
            return {
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    detailTitle: '员工信息',
                    addTitle: '新增员工',
                    popupTitle: '新增员工',
                    isInlineForm: true,
                    isEdit: false,
                    isChildEdit: false,
                    isHeadComplex: false,
                    isFormComplex: false,
                    loading: false,
                    $isCustom: true
                },
                tempWidth: null,
                tableData: [],
                operateType: 'add',
                groupList: [],
                _groupList: [],
                groupIdList: [],
                groupNameList: [],
                isShowNotAllowed: false,
                //数据字典
                empTypelist: [],
                statusList: [],
                provinceList: [],
                nationnalityList: [],
                marriageList: [],
                politicalStatusList: [],
                sexList: [],
                regempflagList: [],
                //键盘操作
                currentIndex: 0,
                enterTimes: 1,
                isBanNextFocus: false,
                //搜索映射表
                searchProp: [
                    {
                        name: '员工姓名',
                        prop: 'empName',
                        type: 'normal',
                        isMainSearch: true,
                        isMain: false,
                        placeholder: '请输入员工姓名'
                    },
                    {
                        name: '员工工号',
                        prop: 'empNum',
                        type: 'normal',
                        isMainSearch: false,
                        isMain: false
                    },
                    {
                        name: '员工编号',
                        prop: 'empCode',
                        type: 'normal',
                        isMainSearch: false,
                        isMain: false
                    },
                ],
                //校验
                addRules:{
                    'empCode':[
                        { required: true, message: '请输入员工编号', trigger: 'blur' }
                    ],
                    'empName':[
                        { required: true, message: '请输入员工姓名', trigger: 'blur' }
                    ],
                    'empTypeid':[
                        { required: true, message: '请选择员工类型', trigger: 'blur' }
                    ],
                    'status':[
                        { required: true, message: '请选择员工状态', trigger: 'blur' }
                    ],
                    'isregempflag':[
                        { required: true, message: '请选择是否正式员工', trigger: 'blur' }
                    ],
                    /*'phoneShort':[
                        {validator: this.validataPhoneShort, message: '请检查手机短号是否正确', trigger: 'blur'},
                    ],
                    'phoneContact':[
                        {validator: this.validataTelephone, message: '请检查联系电话是否正确', trigger: 'blur'},
                    ],
                    'phoneMobile':[
                        {validator: this.validataPhone, message: '请检查手机号码是否正确', trigger: 'blur'},
                    ],
                    'email':[
                        {type: 'email', message: '请检查电子邮箱是否正确', trigger: 'blur'},
                    ],*/
                    'idnum':[
                        { required: true, message: '请输入身份证号码', trigger: 'blur' },
                        {validator: this.validataIdentityNumber, message: '请检查身份证号码是否正确', trigger: 'blur'}
                    ],
                    'sex':[
                        { required: true, message: '请选择性别', trigger: 'blur' }
                    ]
                },
                //新增&编辑映射列表
                formProp: [
                    //0
                    {name: '人员基本信息', type: 'title',width: '110px',isMain: true},
                    //1
                    {name: '员工编号', prop: 'empCode', type: 'normal'},
                    //2
                    {name: '员工姓名', prop: 'empName', type: 'normal'},
                    //3
                    {name: '员工状态', prop: 'status', type: 'select', selectList: []},
                    //4
                    {name: '民族', prop: 'nationnality', type: 'select', selectList: []},
                    //5
                    {name: '政治面貌', prop: 'politicalstatus', type: 'select', selectList: []},
                    //6
                    {name: '性别', prop: 'sex', type: 'select', selectList: []},
                    //7
                    {name: '户籍信息', type: 'title',isMain: true},
                    //8
                    {name: '身份证号码', prop: 'idnum', type: 'normal'},
                    //9
                    {name: '出生日期', prop: 'birthdate', type: 'date'},
                    //10
                    {name: '婚姻状况', prop: 'marriage', type: 'select', selectList: []},
                    //11
                    {name: '籍贯省', prop: 'province', type: 'select', selectList: []},
                    //12
                    {name: '籍贯市', prop: 'city', type: 'normal'},
                    //13
                    {name: '出生地', prop: 'homeplace', type: 'normal'},
                    //14
                    {name: '户口所在地', prop: 'regresidence', type: 'normal'},
                    //15
                    {name: '员工信息', type: 'title',isMain: true},
                    //16
                    {name: '员工工号', prop: 'empNum', type: 'normal'},
                    //17
                    {name: '工牌IC卡号', prop: 'cardno', type: 'normal'},
                    //18
                    {name: '是否正式员工', prop: 'isregempflag', type: 'select', selectList: []},
                    //19
                    {name: '员工类型', prop: 'empTypeid', type: 'select', selectList: []},
                    //20
                    {name: '所属组织', prop: 'orgnames', type: 'normal',isLong: true},
                    //21
                    {name: '联系方式及其他', type: 'title',width: '130px',isMain: true},
                    //22
                    {name: '家庭地址', prop: 'homeAddress', type: 'normal'},
                    //23
                    {name: '联系电话', prop: 'phoneContact', type: 'normal'},
                    //24
                    {name: '手机号码', prop: 'phoneMobile', type: 'normal'},
                    //25
                    {name: '手机短号', prop: 'phoneShort', type: 'normal'},
                    //26
                    {name: '电子邮箱', prop: 'email', type: 'normal'},
                    //27
                    {name: '特长', prop: 'speciality', type: 'normal'},
                    //28
                    {name: '备注', prop: 'remark', type: 'normal'}
                ],
                //表格映射列表
                tableProp: [
                    {
                        name: '员工姓名',
                        prop: 'empName',
                        type: 'normal',
                    },
                    {
                        name1: '员工工号',
                        prop1: 'empNum',
                        name2: '/员工编号',
                        prop2: 'empCode',
                        type: 'mixin',
                        width: ''
                    },
                    {
                        name: '员工类型',
                        prop: 'empTypeid',
                        selectList: []
                    },
                    {
                        name: '正式员工',
                        prop: 'isregempflag',
                        type: 'select',
                        selectList: [],
                        align: 'center',
                        width: 70
                    },
                    {
                        name: '性别',
                        prop: 'sex',
                        type: 'select',
                        selectList: [],
                        align: 'center',
                        width: 50
                    },
                ],
                searchForm: {},
                addOrEditForm: {},
                detailForm: {},
                copyForm: {},
                detailId: null,
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                selectOrgNames: []
            }
        },
        watch: {
            'isShowStatus.isPopUp':{
                handler(val) {
                    this.isShowNotAllowed = val;
                }
            }
        },
        mounted() {
            this.getData();
            this.getDicdata();
            this.getGroupList();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                this.tableData = [];
                this.searchForm.pageNo = this.pageObj.commonPage;
                this.searchForm.pageSize = this.pageObj.commonSize;
                this.fetch('/sys/employee/getAll', this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            if(isFirst) {
                                this.$nextTick(() => {
                                    this.$refs.commontable.renderRow(this.tableData[0].empId,'empId');
                                })
                            }
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },
            //重置
            handleReset() {
                this.searchForm = {};
                this.handleRefresh();
            },
            //刷新
            handleRefresh() {
                this.detailForm = {};
                this.detailId = null;
                this.getData();
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //获取数据字典数据
            getDicdata() {
                this.fetch('/sys/unique/getDic',[
                    {'nodekey': 'empType'},
                    {'nodekey': 'status'},
                    {'nodekey': 'province'},
                    {'nodekey': 'nationnality'},
                    {'nodekey': 'marriage'},
                    {'nodekey': 'politicalstatus'},
                    {'nodekey': 'sex'},
                    {'nodekey': 'isregempflag'},
                ]).then(result => {
                    if(result.status === 200 && result.data) {
                        this.statusList = this.formProp[3].selectList = this.formatArray(result.data.status,'itemname','itemvalue');
                        this.marriageList = this.formProp[10].selectList = this.formatArray(result.data.marriage,'itemname','itemvalue');
                        this.provinceList = this.formProp[11].selectList = this.formatArray(result.data.province,'itemname','itemvalue');
                        this.nationnalityList = this.formProp[4].selectList = this.formatArray(result.data.nationnality,'itemname','itemvalue');
                        this.politicalStatusList = this.formProp[5].selectList = this.formatArray(result.data.politicalstatus,'itemname','itemvalue');
                        this.empTypelist = this.formProp[19].selectList = this.tableProp[2].selectList = this.formatArray(result.data.empType,'itemname','itemvalue');
                        this.regempflagList = this.formProp[18].selectList = this.tableProp[3].selectList = this.formatArray(result.data.isregempflag,'itemname','itemvalue',true);
                        this.sexList = this.formProp[6].selectList = this.tableProp[4].selectList = this.formatArray(result.data.sex,'itemname','itemvalue',true);
                    }
                })
            },
            //获取组织列表
            getGroupList() {
                this.groupList = [];
                this._groupList = [];
                this.groupIdList = [];
                this.groupNameList = [];
                this.getAjax('/sys/org/getList')
                    .then(result => {
                        if(result.status === 200 && result.data[0]) {
                            this.groupList = result.data[0].list;
                            this._groupList = this.$lodash.cloneDeep(this.groupList);
                            this.groupList.forEach(item => {
                                this.groupIdList.push((item.orgid).toString());
                                this.groupNameList.push(item.orgname);
                            })
                        }
                    })
            },
            //点击主表行
            handleDetail(row) {
                this.otherVariable.popupTitle = '员工信息';
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.getAjax('/sys/employee/edit/'+row.empId)
                    .then(result => {
                        if(result.status === 200) {
                            this.groupList = this.$lodash.cloneDeep(this._groupList);
                            this.detailForm = this.handleItemstoString(result.data, ['status', 'marriage', 'politicalstatus', 'province', 'nationnality']);
                            this.copyForm = this.$lodash.cloneDeep(this.detailForm);
                            let idList = this.detailForm.orgids.split(',') || [];
                            let nameList = this.detailForm.orgnames.split(',') || [];
                            let obj = {};
                            obj.orgid = this.$lodash.difference(idList,this.groupIdList)[0] || '';
                            obj.orgname = this.$lodash.difference(nameList,this.groupNameList)[0] || '';
                            if(obj.orgid) this.groupList.push(obj);
                        }else {
                            this.$message({
                                message: '请求失败',
                                type: 'warning'
                            });
                            this.detailForm = {};
                            this.copyForm = {};
                        }
                    });
                this.detailId = row.empId;
            },
            //主表添加行
            handleAdd() {
                this.selectOrgNames = [];
                this.operateType = 'add';
                this.isShowStatus.isPopUp = true;
                this.otherVariable.popupTitle = this.otherVariable.addTitle;
                this.otherVariable.isEdit = false;
                this.addOrEditForm = {};
            },
            //主表编辑行
            handleEdit() {
                this.operateType = 'edit';
                this.otherVariable.popupTitle = this.otherVariable.detailTitle;
                this.otherVariable.isEdit = true;
                this.addOrEditForm = this.detailForm;
                this.selectOrgNames = this.addOrEditForm.orgnames ? this.addOrEditForm.orgnames.split(',') : [];
                if(this.detailForm.empId) {
                    this.isShowStatus.isPopUp = true;
                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    })
                }
            },
            //主表保存行
            handleSave(type) {
                let tempObj;
                let api;
                let orgIds = [];
                let temObj = {};
                this.selectOrgNames.forEach(item => {
                    temObj = this.groupList.find(v => v['orgname'] === item);
                    orgIds.push(temObj.orgid);
                });
                if(type === 'add') {
                    api = '/sys/employee/save';
                    this.addOrEditForm.orgnames = this.selectOrgNames.join();
                    this.addOrEditForm.orgids = orgIds.join();
                    tempObj = this.addOrEditForm;
                }else {
                    api = '/sys/employee/update';
                    this.detailForm.orgnames = this.selectOrgNames.join();
                    this.detailForm.orgids = orgIds.join();
                    tempObj = this.detailForm;
                }
                this.fetch(api, tempObj)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.isShowStatus.isPopUp = false;
                            this.detailForm = {};
                            this.addOrEditForm = {};
                            this.searchForm = {};
                            this.getData();
                        }else {
                            this.$message({
                                message: result.message,
                                type: 'error'
                            })
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
                }
            },
            //主表删除行
            handleDelete() {
                if(this.detailForm.empId) {
                    this.$confirm('是否删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteAjax(`/sys/employee/delete/${this.detailForm.empId}`)
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
                                    })
                                }
                            })
                    }).catch(() => {
                        console.log('cnacel')
                    })


                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    })
                }
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
