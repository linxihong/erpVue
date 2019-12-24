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
                @selectChange="selectChange"
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
                                <span>{{ detailForm[item.prop]==='已提交'?'待提交':(detailForm[item.prop])=='已确认'?'已提交':detailForm[item.prop] }}</span>
                            </div>
                        </template>
                    </div>
                </template>
                <!--头部按钮-->
                <template slot="main-btn-wrap" v-if="!otherVariable.isChildEdit">
                    <div v-if="docStatus === 0" class="xs-icon-confirm" :class="otherVariable.isSaving ? 'banClick' : ''" @click="!otherVariable.isSaving && handleConfirm(50)">提交</div>
                    <div v-if="docStatus === 50" class="xs-icon-confirm" :class="otherVariable.isSaving ? 'banClick' : ''" @click="!otherVariable.isSaving && handleConfirm(0)">撤回</div>
                    <i v-if="docStatus < 50" class="sm-icon-edit el-icon-edit" title="编辑" @click="handleEdit"></i>
                    <i v-if="docStatus < 50" class="icon-delete" title="删除" @click="handleDelete"></i>
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
                        <el-button class="btn-cyan search-btn" @click="handleAddChild" v-if="!otherVariable.isChildEdit&&docStatus < 50">增行</el-button>
                    </div>
                    <!--tab区域-->
                    <el-tabs v-model="activeName" class="common-content-tab order_style">
                        <el-tab-pane label="报价明细" name="first">
                            <!--:span-method="objectSpanMethod"-->
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
                                <el-table-column label="价格类型" align="left" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ pricetypeList[(scope.row.priceType-1)] }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="报价项目">
                                    <el-table-column label="代码" align="left" width="80" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.itemCode }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="名称" align="left" width="130" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.itemName }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="项目类型" align="left" width="120">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.itemTypeName }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="材质" align="left" width="110">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.cx2Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="涂层" align="left" width="110">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.cx6Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="价格(元)" align="right" width="70">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.price }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位" align="left" width="60">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.uom }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="货币" align="left" width="60">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.currency }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注" align="right" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span >{{ scope.row.remark }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" v-if="docStatus < 50" align="center" width="55" fixed="right">
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
                                <el-input v-model="addOrEditForm.projectName"></el-input>
                            </el-form-item>
                            <el-form-item label="客户" prop="clientCode">
                                <SelectEnter
                                    ref="clientSelect"
                                    :inputValue="valueObj.clientCode"
                                    :selectTHs="valueObj.clientTHs"
                                    :selectTds="valueObj.priceClientList"
                                    placeholder="请输入客户代码/名称"
                                    @getList="getClient"
                                    @setObj="setClient"
                                    selectLabel="fcode"
                                    selectValue="fcode"
                                    selectKey="fid">
                                </SelectEnter>
                            </el-form-item>
                            <el-form-item label="经销商" prop="clientCode2">
                                <el-input v-model="addOrEditForm.clientCode2" :readonly="true"></el-input>
                            </el-form-item>
                            <el-form-item label="报价日期" prop="docDate">
                                <el-date-picker
                                    v-model="addOrEditForm.docDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="报价类型" prop="offerType">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.offerType"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="(item,index) in offerTypeList"
                                        :key="index"
                                        :label="item.dictText"
                                        :value="item.dictText">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="计价方式" prop="pricingModelName">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.pricingModelName"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="(item,index) in pricingModelList"
                                        :key="index"
                                        :label="item.dictText"
                                        :value="item.dictText">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="区域" prop="regionId">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.regionId"
                                    style="width: 100%"
                                    @change="setRegion"
                                >
                                    <el-option
                                        v-for="(item,index) in regionList"
                                        :key="index"
                                        :label="item.fname"
                                        :value="item.fid">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="备注说明" prop="remark" class="full-remark">
                                <el-input v-model="addOrEditForm.remark" type="textarea" :rows="3"></el-input>
                            </el-form-item>
                        </el-form>
                    </template>
                </CommonAdd>
            </transition>
            <!--选择结果列表区域-->
            <transition name="popup">
                <div class="common-right-wrap" style="z-index: 101;" v-if="isShowResultChoose">
                    <div class="header-form">&nbsp;</div>
                    <div class="common-right-content" >
                        <i class="icon-cancel cancel-choose" @click="isShowResultChoose = false"></i>
                        <div class="choose-list-wrap" style="overflow-y: auto;">
                            <div class="choose-item el-card">
                                <el-button size="mini" class="choose-add-btn" type="info" icon="el-icon-plus" circle @click="addChooseItems('aluminum')"></el-button>
                                <el-table :data="childDataI">
                                    <el-table-column align="center" label="铝加工费" prop="itemName"></el-table-column>
                                    <el-table-column align="center" label="单位:元/吨" prop="price"></el-table-column>
                                </el-table>
                            </div>
                            <div class="choose-item el-card">
                                <el-button size="mini" class="choose-add-btn" type="info" icon="el-icon-plus" circle @click="addChooseItems('surface')"></el-button>
                                <el-table :data="childDataII">
                                    <el-table-column align="center" label="表面加工费" prop="itemName"></el-table-column>
                                    <el-table-column align="center" label="单位:元/吨(氟碳单位:元/m²)" prop="price"></el-table-column>
                                </el-table>
                            </div>
                            <div class="choose-item el-card">
                                <el-button size="mini" class="choose-add-btn" type="info" icon="el-icon-plus" circle @click="addChooseItems('gine')"></el-button>
                                <el-table :data="childDataIII">
                                    <el-table-column align="center" label="隔热胶条/注胶" prop="itemName"></el-table-column>
                                    <el-table-column align="center" label="单位:元/m" prop="price"></el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <!--可选择列表区域-->
            <transition name="popup">
                <div class="common-right-wrap" style="z-index: 102;" v-if="isShowChildChoose">
                    <div class="header-form">&nbsp;</div>
                    <div class="common-right-content">
                        <i class="icon-cancel cancel-choose" @click="isShowChildChoose = false"></i>
                        <i class="icon-confirm confirm-choose" @click="confirmChoose"></i>
                        <el-input class="search-choose" v-model="searchItem" @keyup.enter.native="getChooseItems"></el-input>
                        <div class="choose-list-wrap" style="overflow-y: auto;">
                            <el-table class="choose-table" border :data="childChooseData" ref="multipleTable" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="55"></el-table-column>
                                <el-table-column align="center" :label="'已选:'+chooseChildList.length" prop="itemName"></el-table-column>
                                <el-table-column align="center" :label="uomName" prop="price"></el-table-column>
                                <el-table-column align="center" v-if="showuom" :label="uom" prop="uom"></el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </transition>
            <!--获取公共数据-->
            <CommonData :valueObj="valueObj" ref="commondata"></CommonData>
        </div>
        <!--修改价格-->
        <el-dialog
            title="修改价格"
            :visible.sync="changeVisible"
            width="30%">
            <el-form :model="changeForm">
                <el-form-item label="材质">
                    <!--<el-input v-model="changeForm.cx2Name"></el-input>-->
                    <el-select
                        placeholder="请输入搜索并选择"
                        style="width: 100%"
                        clearable
                        filterable
                        remote
                        :remote-method="getMatAlloy"
                        v-model.trim="changeForm.cx2Name"
                        @change="setMatAlloy"
                    >
                        <el-option
                            v-for="(item,index) in matAlloyList"
                            :key="index"
                            :label="item.fname"
                            :value="item.fcode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="涂层">
                    <el-input v-Int v-model="changeForm.cx6Name"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-Int v-model="changeForm.price"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeVisible = false">取 消</el-button>
                <el-button class="btn-cyan add-btn" @click="saveChangeForm">确 定</el-button>
            </span>
        </el-dialog>
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
                isBanOperate: false,
                operateType: 'add',
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
                    projectName: [
                        { required: true, message: '请输入工程项目', trigger: 'blur' }
                    ],
                    clientCode: [
                        { required: true, message: '请输入客户代码', trigger: 'blur' }
                    ],
                    regionId: [
                        { required: true, message: '请输入区域', trigger: 'blur' }
                    ],
                    docDate: [
                        { required: true, message: '请选择报价日期', trigger: 'blur' }
                    ],
                    offerType: [
                        { required: true, message: '请选择报价类型', trigger: 'blur' }
                    ]
                },
                //搜索映射表
                searchProp: [
                    {
                        name:'报价单号',
                        prop:'docCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入报价单号'
                    },
                    {
                        name:'报价状态',
                        prop:'tempStatus',
                        type:'selectChange',
                        selectList:[{value:1,label:'全部'},{value:2,label:'未确认'},{value:3,label:'已确认'},{value:4,label:'已审核'}],
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'报价日期',
                        prop:'docDate',
                        type:'date',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'至',
                        prop:'',
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
                    },
                ],
                //详情映射列表
                formProp: [
                    {name:'报价单号',prop:'docCode',type:'outter'},
                    {name:'报价日期',prop:'docDate',type:'outter'},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'报价类型',prop:'offerType',type:'inner'},
                    {name:'计价方式',prop:'pricingModelName',type:'inner'},
                    {name:'经销商',prop:'clientCode2',type:'inner'},
                    {name:'区域',prop:'regionName',type:'inner'},
                    //todo
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
                        prop1:'docCode',
                        name2:'状态',
                        prop2:'docStatusName',
                        type:'mixinNormal',
                        width: '115'
                    },
                    {
                        name1:'报价类型/',
                        prop1:'offerType',
                        name2:'报价日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '130'
                    },
                    {
                        name1:'客户/',
                        prop1:'clientCode',
                        name2:'区域',
                        prop2:'regionName',
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
                searchForm: {tempStatus: 2,minDocStatus: 0, maxDocStatus: 50},
                addOrEditForm: {},
                addForm: {},
                detailForm: {},
                copyForm: {},
                tempForm: {},
                submitRow: {},
                detailId: null,
                docStatus: null,
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
                tabDataI: [],
                copyDataI: [],
                spanArr: [],
                position: 0,
                loadingI: false,
                pricetypeList: ['铝加工费','表面加工费','断桥加工费','深加工费','附加费'],
                isShowNotAllowed: false,
                //增行选择框
                isShowResultChoose: false,
                isShowChildChoose: false,
                showuom:false,
                uomName: null,
                uom:null,
                chooseChildList: [],
                chooseChildType: null,
                searchItem: '',
                childChooseData: [],
                childDataI: [],
                childDataII: [],
                childDataIII: [],
                //修改价格
                changeVisible: false,
                changeForm: {},
                //数据
                pricingModelList: [],
                offerTypeList: [],
                regionList: [],
                matAlloyList: [],
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
            'isShowResultChoose':{
                handler(val) {
                    this.isShowNotAllowed = val;
                }
            },
            'isShowChildChoose':{
                handler(val) {
                    if(val&&this.isShowResultChoose) {
                        this.isShowNotAllowed = true;
                    }
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
            this.getRegionList();
            this.getPricingModelList();
            this.getOfferTypeList();
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
                this.fetch(`/oms/sls/OfferPrice/getOfferPriceMasterList?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
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
                            this.tabDataI = [];
                            this.copyDataI = [];
                            this.detailForm = {};
                            this.detailId = null;
                            this.docStatus = null;
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },
            selectChange(val) {
                if(val === 1) {
                    this.searchForm.minDocStatus = 0;
                    this.searchForm.maxDocStatus = 101;
                }else if(val === 2) {
                    this.searchForm.minDocStatus = 0;
                    this.searchForm.maxDocStatus = 50;
                }else if(val === 3) {
                    this.searchForm.minDocStatus = 50;
                    this.searchForm.maxDocStatus = 100;
                }else if(val === 4) {
                    this.searchForm.minDocStatus = 100;
                    this.searchForm.maxDocStatus = 101;
                }
            },
            //刷新
            handleRefresh() {
                this.isBanOperate = false;
                this.getData();
                this.detailForm = {};
                this.detailId = null;
                this.docStatus = null;
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },
            //重置
            handleReset() {
                this.searchForm = {tempStatus: 2,minDocStatus: 0, maxDocStatus: 50};
                this.handleRefresh();
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //点击主表行
            handleDetail(row) {
                if(row.docStatus >= 0 && row.docStatus < 50) {
                    this.isBanOperate = true
                }else {
                    this.isBanOperate = false
                }
                this.otherVariable.isChildEdit = false;
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.handleCancel(this.operateType);
                this.fetch('/oms/sls/OfferPrice/getOfferPriceMasterList',{fId:row.fid})
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
                this.tabDataI = this.giveState(this.tabDataI);
                this.getChildTable(row.fid);
                this.detailId = row.fid;
                this.docStatus = row.docStatus;
            },
            //主表添加行
            handleAdd() {
                this.operateType = 'add';
                this.addForm = {};
                this.addOrEditForm = {};
                this.$refs.clientSelect.inputValueData = '';
                this.valueObj.clientCode = '';
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
            //主表编辑行
            handleEdit() {
                this.operateType = 'edit';
                this.otherVariable.popupTitle = this.otherVariable.detailTitle;
                this.otherVariable.isEdit = true;
                this.addOrEditForm = this.detailForm;
                if(this.detailId) {
                    this.isShowStatus.isPopUp = true;
                    //客户
                    this.$set(this.addOrEditForm,'clientCode',this.detailForm.clientCode);
                    this.$set(this.valueObj,'clientCode',this.detailForm.clientCode);
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
                            api = '/oms/sls/OfferPrice/insertMaster';
                        }else {
                            api = '/oms/sls/OfferPrice/updateMaster';
                        }
                        tempObj = this.addOrEditForm;
                        this.otherVariable.isSaving = true;
                        this.fetch(api,tempObj)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
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
            //主表删除行
            handleDelete() {
                if(this.detailId) {
                    if(confirm('确定删除？') === true) {
                        this.fetch(`/oms/sls/OfferPrice/deleteMaster`,{fId:this.detailId})
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
                                    })
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
            //主表确认
            handleConfirm(status) {
                if(this.detailForm.fid) {
                    this.$confirm('是否提交?', '提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.otherVariable.isSaving = true;
                        this.getAjax(`/oms/sls/OfferPrice/confirmPrice?offerPriceDocMasterId=${this.detailForm.fid}&docStatus=${status}`)
                            .then(result => {
                                if(result.status === 200) {
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
            //获取从表
            getChildTable(fid,isGet = false) {
                this.clickTimes = 0;
                this.tabDataI = [];
                this.copyDataI = [];
                if(!isGet) {
                    this.loadingI = true;
                    this.isShowNotAllowed = true;
                }
                this.getAjax(`/oms/sls/OfferPrice/getOfferPriceDetailListByMasterId?pageSize=1000&masterId=${fid}`)
                    .then(result => {
                        if(!isGet) {
                            this.loadingI = false;
                            this.isShowNotAllowed = false;
                        }
                        if(result.data && result.data.list && result.data.list) {
                            this.tabDataI = result.data.list;
                            this.copyDataI = this.$lodash.cloneDeep(this.tabDataI);
                        }
                    })
                    .then(() => {
                        if(!isGet) {
                            this.loadingI = false;
                        }else {
                            this.getExistList();
                        }
                    })
            },
            //从表添加行
            handleAddChild() {
                if(this.detailId) {
                    this.isShowResultChoose = true;
                    this.getExistList();
                }else {
                    this.$message({
                        message: '请选择报价单',
                        type: 'warning'
                    });
                }
            },
            // 获取已存在的列表
            getExistList() {
                this.childDataI = [];
                this.childDataII = [];
                this.childDataIII = [];
                this.copyDataI.forEach(item => {
                    if(item.priceType === 1) {
                        this.childDataI.push(item);
                    }else if(item.priceType === 2) {
                        this.childDataII.push(item);
                    }else if(item.priceType === 3) {
                        this.childDataIII.push(item);
                    }
                })
            },
            // 新增选择列表
            addChooseItems(type) {
                this.chooseChildType = type;
                this.isShowChildChoose = true;
                this.chooseChildList = [];
                this.childChooseData = [];
                this.searchItem = '';
                this.getChooseItems();
            },
            getChooseItems() {
                let url = '';
                let searchParam = '';
                if(this.chooseChildType === 'aluminum') {
                    // 获取铝加工费
                    this.uomName = '单位:元/吨';
                    this.showuom = false;
                    url = '/oms/sls/OfferPrice/getAluModelGroupList?offerPricePrimaryKey';
                    searchParam = 'modelGroupName';
                }else if(this.chooseChildType === 'surface') {
                    // 获取表面加工费
                    this.uomName = '单位:元/吨(氟碳单位:元/m²)';
                    this.uom ='单位';
                    this.showuom = true;
                    url = '/oms/sls/OfferPrice/getRouteGroupList?offerPricePrimaryKey';
                    searchParam = 'routeGroupName';
                }else if(this.chooseChildType === 'gine') {
                    // 获取隔热胶条/注胶
                    this.showuom = false;
                    this.uomName = '单位:元/m';
                    url = '/oms/sls/OfferPrice/getMatPriceList?offerPricePrimaryKey';
                    searchParam = 'matName';
                }
                this.childChooseData = [];
                this.getAjax(`${url}=${this.detailId}&${searchParam}=${this.searchItem}`)
                    .then(result => {
                        if(result.data && result.data.list && result.data.list.length) {
                            this.childChooseData = result.data.list;
                        }
                    })
            },
            handleSelectionChange(val) {
                this.chooseChildList = val;
            },
            confirmChoose() {
                this.fetch(`/oms/sls/OfferPrice/addPriceItem?offerPricePrimaryKey=${this.detailId}`,this.chooseChildList)
                    .then(result => {
                        if(result.status === 200) {
                            this.isShowChildChoose = false;
                            this.getChildTable(this.detailId,true);
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
                this.changeForm = this.$lodash.cloneDeep(row);
                this.changeVisible = true;
            },
            //保存修改价格
            saveChangeForm() {
                this.fetch('/oms/sls/OfferPrice/updateItemPrice',this.changeForm)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.changeVisible = false;
                            this.getChildTable(this.detailId);
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            });
                        }
                    })
            },
            //从表取消操作
            handleCancelChild() {
                this.getChildTable(this.detailId);
                this.scrollHeight = 0;
                this.otherVariable.isChildEdit = false;
                this.isAddDetail = false;
            },
            //从表删除行
            handleDeleteChild(row,index) {
                if(row.fid) {
                    if(confirm('确定删除？') === true) {
                        this.fetch(`/oms/sls/OfferPrice/DeleteDetailItem?offerPriceDetailPrimaryKey=${row.fid}`,{})
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
                                    })
                                }
                            });
                        this.otherVariable.isChildEdit = false;
                    }
                }else {
                    this.tabDataI.splice(index,1);
                }
            },
            //合并列表
            rowspan() {
                this.tabDataI.forEach((item,index) => {
                    if(index === 0) {
                        this.spanArr.push(1);
                        this.position = 0;
                    }else {
                        if(this.tabDataI[index].priceType === this.tabDataI[index-1].priceType ) {
                            this.spanArr[this.position] += 1;
                            this.spanArr.push(0);
                        }else {
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
            // 客户
            getClient(val) {
                this.$refs.commondata.getPriceClient(val);
            },
            setClient(item) {
                console.log(item.parentid);
                this.$set(this.valueObj,'clientCode',item.fcode);
                this.$set(this.addOrEditForm,'clientName',item.fname);
                this.$set(this.addOrEditForm,'clientCode',item.fcode);
                this.$set(this.addOrEditForm,'clientId',item.fid);
                if(item.parentid) {
                    this.fetch('/oms/sls/OfferPrice/getClientCompany',{cltcompanyid:item.parentid})
                        .then(result => {
                            if(result.data && result.data.list && result.data.length) {
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
            //材质资料
            getMatAlloy(val) {
                this.matAlloyList = [];
                this.fetch('/oms/BasedataController/getMatAlloy',{fcode:val})
                    .then(result => {
                        if(result.data && result.data.list && result.data.list.length) {
                            this.matAlloyList = result.data.list;
                        }else {
                            this.matAlloyList = [];
                        }
                    })
            },
            setMatAlloy(val) {
                if(val) {
                    let item = this.matAlloyList.find(item => item.fcode === val);
                    if(JSON.stringify(item) !== {}) {
                        this.$set(this.changeForm,'alloyId',item.fid);
                        this.$set(this.changeForm,'cx2',item.fcode);
                        this.$set(this.changeForm,'cx2Name',item.fname);
                    }
                }else {
                    this.$set(this.changeForm,'alloyId',null);
                    this.$set(this.changeForm,'cx2',null);
                    this.$set(this.changeForm,'cx2Name',null);
                }
            },
            // 计价方式
            getPricingModelList() {
                this.pricingModelList = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30112')
                    .then(result => {
                        if(result.data) {
                            this.pricingModelList = result.data;
                        }else {
                            this.pricingModelList = [];
                        }
                    })
            },
            // 报价类型
            getOfferTypeList() {
                this.offerTypeList = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30113')
                    .then(result => {
                        if(result.data) {
                            this.offerTypeList = result.data;
                        }else {
                            this.offerTypeList = [];
                        }
                    })
            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
            },
            // 价格区域
            getRegionList() {
                this.regionList = [];
                this.fetch('/oms/pqm/PqmRegionController/selectPqmRegion?pageSize=100',{})
                    .then(result => {
                        if(result.data && result.data.list && result.data.list.length) {
                            this.regionList = result.data.list;
                        }
                    })
            },
            setRegion(val) {
                let item;
                item = this.regionList.find(item => item.fid === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.regionName = item.fname;
                    this.addOrEditForm.regionCode = item.fcode;
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
