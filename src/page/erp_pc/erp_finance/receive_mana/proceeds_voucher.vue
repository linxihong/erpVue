<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap" @click="handleNotAllowed" v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleAdd" :disabled="newAdd">新建</el-button>
                <el-button @click="handleRefresh">刷新</el-button>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="searchProp"
                :searchForm="searchForm"
                @getData="getSearchList"
                @selectChange="selectChange"
            >
                <template slot="search-other-btn">
                    <el-button @click="handleReset">重置</el-button>
                </template>
            </CommonSearch>
            <!--表格区域-->
            <CommonTable
                v-if="isResize"
                ref="commontable"
                :indexList="indexList"
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
                                <span>{{ left_detailForm[item.prop]===0?'未提交':left_detailForm[item.prop] ===50?'已提交':left_detailForm[item.prop] ===100?'已审核':left_detailForm[item.prop]}}</span>
                            </div>
                        </template>
                    </div>
                </template>
                <!--头部按钮-->
                <template slot="main-btn-wrap">
                    <div class="xs-icon-confirm" v-if="detailForm.docStatus<50 && handleEn"  @click="handleConfirm" style="right: 170px">提交</div>
                    <div class="xs-icon-confirm" v-if="detailForm.docStatus==50 && handleEn"  @click="handleCanle" style="right: 170px">撤回</div>
                    <!--<div class="xs-icon-confirm" v-if="detailForm.docStatus!=50 && !handleEn"  @click="handleUpdate" style="right: 170px">保存</div>-->
                    <!--&lt;!&ndash;<i class="sm-icon-edit icon-confirm" v-if="detailForm.docStatus!=50 && !handleEn" @click="handleUpdate" title="保存"  style="right: 170px"></i>&ndash;&gt;-->
                    <!--<i class="sm-icon-edit icon-cancel" v-if="detailForm.docStatus!=50 && !handleEn" @click="vouchercancel" title="取消"  style="right: 135px"></i>-->
                    <i class="sm-icon-edit el-icon-edit" v-if="detailForm.docStatus<50 && handleEn" @click="handleEditNew" title="编辑"  style="right: 135px"></i>
                    <i class="sm-icon-edit el-icon-delete" v-if="detailForm.docStatus<50 && handleEn" @click="handleCancelNew" title="删除"  style="right: 100px"></i>
                    <!--<i class="sm-icon-edit el-icon-document" v-if="detailForm.docStatus!=50 && handleEn" @click="handleEditSave" title="复制"   style="right: 65px"></i>-->
                    <!--<i class="sm-icon-edit el-icon-printer" v-if="detailForm.docStatus!=50 && handleEn" title="" @click="cancelOrder" title="打印" style="right: 32px"></i>-->

                </template>
                <!--头部标题-->
                <template slot="head-form-title">
                    <div class="">
                        <span style="font-size: 30px;">{{headerTitle}}</span>
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
                <template slot="common-content"   v-show="!isShowStatus.isPopUp">
                    <div class="inline-form-add"  style="margin-top: 40px"  >
                    <el-form :model="detailForm"  :inline="true" label-width="110px" >


                        <el-form-item  label="收款日期:">
                            <el-date-picker
                                style="width: 198px"
                                size="large"
                                :readonly=this.readonly
                                v-model="detailForm.docDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>



                        <br>

                        <el-form-item label="收款类型:" prop="docTypeName"  >
                            <el-input v-model="addOrEditForm.docTypeName" :readonly=this.readonly></el-input>
                        </el-form-item>

                        <el-form-item label="收款单号:" prop="refDocCode" v-if="showDtailForm">
                            <el-input v-model="detailForm.refDocCode" :readonly=this.readonly style="width: 198px"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item  label="客户代码:">
                            <el-input v-model="detailForm.clientCode" :readonly=this.readonly></el-input>
                        </el-form-item>
                            <el-form-item label="" class="long-input">
                            <el-input v-model="detailForm.clientName" :readonly=this.readonly ></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item  label="经销商:">
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
                        <el-form-item label="收款金额: " prop="receiveMoney" >
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
            <!--新增/编辑区域-->
            <transition name="popup">
                <CommonAdd
                    v-show="isShowStatus.isPopUp"
                    :otherVariable="otherVariable"
                    @handleCancel="handleCancel"
                    @handleSave="handleSave"
                >
                    <template slot="head-form-title">
                        <div class="head-form-title">
                            <span>{{otherVariable.popupTitle}}</span>
                        </div>
                    </template>
                    <template slot="custom-add-form">
                        <div class="inline-form-add" style="margin-top: 40px">
                            <el-form :model="addOrEditForm"  :inline="true"  ref="addOrEditForm" :rules="mainRules" label-width="110px"  >



                                <el-form-item  label="收款日期:" prop="docDate" >
                                    <el-date-picker
                                        v-model="addOrEditForm.docDate"
                                        style="width: 198px"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>

                                <!--<el-form-item>-->
                                    <!--<el-checkbox label="已审核"></el-checkbox>-->
                                    <!--<el-checkbox label="已结转"></el-checkbox>-->
                                    <!--<el-checkbox label="是否委托"></el-checkbox>-->
                                    <!--<el-checkbox label="已办委托"></el-checkbox>-->
                                    <!--<el-checkbox label="已截数"></el-checkbox>-->
                                <!--</el-form-item>-->
                                <br>


                                <el-form-item label="收款类型:" prop="docType" >
                                    <el-select v-model="addOrEditForm.docType"  @change="selectDocDate" >
                                        <el-option
                                            style="width: 198px"
                                            v-for="(item,index) in docTypeList"
                                            :key="index"
                                            :label="item.dictText"
                                            :value="item.dictValue">
                                        </el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="单据编号:" prop="refDocCode"  v-if="showInp">
                                    <el-input v-model="addOrEditForm.refDocCode"></el-input>
                                </el-form-item>
                                <br>
                                <el-form-item  label="客户代码:" prop="clientCode" >
                                    <SelectEnter
                                        style="width:200px"
                                        ref="clientSelect"
                                        :inputValue="valueObj.clientCode"
                                        :selectTHs="valueObj.clientTHs"
                                        :selectTds="valueObj.clientList"
                                        placeholder="输入客户代码回车搜索"
                                        @getList="getClient"
                                        @setObj="setClient"
                                        selectLabel="fcode"
                                        selectValue="fcode"
                                        selectKey="fid">
                                    </SelectEnter>
                                </el-form-item>
                                <el-form-item  label="" class="long-input">
                                    <el-input v-model="addOrEditForm.clientName" :readonly="true" ></el-input>
                                </el-form-item>
                                <br>
                                <el-form-item  label="经销商:" >
                                    <el-input v-model="addOrEditForm.clientCode2" :readonly="true" ></el-input>
                                </el-form-item>
                                <el-form-item  label="" class="long-input">
                                    <el-input v-model="addOrEditForm.clientName2" :readonly="true" ></el-input>
                                </el-form-item>
                                <br>
                                <el-form-item  label="工程名称:">
                                    <el-input v-model="addOrEditForm.projectName" ></el-input>
                                </el-form-item>
                                <br>
                                <el-form-item  label="客户银行账号:" >
                                    <el-input v-model="addOrEditForm.bandAccount" ></el-input>
                                </el-form-item>
                                <br>
                                <el-form-item  label="客户银行户名:" >
                                    <el-input v-model="addOrEditForm.bandAccountName" ></el-input>
                                </el-form-item>
                                <el-form-item  label="银行名称: " >
                                    <el-input v-model="addOrEditForm.bandName"  ></el-input>
                                </el-form-item>
                                <br>
                                <el-form-item label="收款金额: " prop="receiveMoney" >
                                    <el-input v-model="addOrEditForm.receiveMoney" ></el-input>
                                </el-form-item>
                                <br>
                                <el-form-item  label="预计开票时:" >
                                    <el-date-picker
                                        style="width: 198px"
                                        v-model="addOrEditForm.expectReceiveDate"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>

                                <el-form-item  label="实际开票时:">
                                    <el-date-picker
                                        style="width: 198px"
                                        v-model="addOrEditForm.actualReceiveDate"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                                <br/>


                                <el-form-item  label="备注:" class="foramAddress">
                                    <el-input type="textarea" v-model="addOrEditForm.remark" rows="2" style="width: 280%" ></el-input>
                                </el-form-item>



                            </el-form>
                        </div>
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
                newAdd:false,
                docTypeList:[],
                headerTitle:'收款凭证',
                showInp:false,
                proceeds:'提交',
                handleEn:true,
                formHeight: 526,
                tableHeight: this.$store.state.screenHei*0.65,
                readonly:true,
                mainHeight: 716,
                operateType: 'add',
                isResize: true,
                operateType: 'add',
                showDtailForm:false,
                isNewEdit: false,
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                indexList: [],
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
                    isReadTable: true,
                    isSaving:false,
                },
                tempWidth: null,
                tableData: [],
                mainRules:{
                    refDocCode:[
                        { required: true, message: '请输入单据编号', trigger: 'blur' }
                    ],
                    docDate:[
                        { required: true, message: '请输入收款日期', trigger: 'blur' }
                    ],
                    docType:[
                        { required: true, message: '请输入收款类型', trigger: 'blur' }
                    ],
                    receiveMoney:[
                        { required: true, message: '请输入收款金额', trigger: 'blur' }
                    ],
                    clientCode:[
                        { required: true, message: '请输入客户代码', trigger: 'blur' }
                    ],
                    clientCode2:[
                        { required: true, message: '请输入经销商', trigger: 'blur' }
                    ]
                },
                //搜索映射表
                searchProp: [
                    {
                        name:'收款单号',
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
                        selectList:[{value:1,label:'未提交'},{value:2,label:'已提交'},{value:3,label:'已审核'},{value:4,label:'全部'}],
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
                        prop:'clientName',
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
                    minDocStatus : 0,
                    maxDocStatus : 50,
                    tempStatus:1,
                },
                newVoucher:false,
                addOrEditForm: {
                    docDate:this.recentDate(0),
                },
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
                getIndex:0,
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
                    clientList: [],
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
            this.getdocTypeList();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                this.tableData = [];
                this.indexList = [];
                this.fetch(`/oms/fm/FmClientReceiveController/getClientReceiveList?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list.length) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            if(isFirst) {
                                this.$nextTick(() => {
                                    this.$refs.commontable.renderRow(this.tableData[this.getIndex].fid);
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
                this.searchForm ={
                    minDocStatus : 0,
                    maxDocStatus : 50,
                    tempStatus:1,
                };
                this.handleRefresh();
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //更改后的刷新
            changeRefresh() {
                this.getData(false);
                this.otherVariable.isChildEdit = false;
            },
            selectChange(val) {
                if(val === 1) {
                    this.searchForm.minDocStatus = 0;
                    this.searchForm.maxDocStatus = 50;
                }else if(val === 2) {
                    this.searchForm.minDocStatus = 50;
                    this.searchForm.maxDocStatus = 100;
                }else if(val === 3) {
                    this.searchForm.minDocStatus = 100;
                    this.searchForm.maxDocStatus = 101;
                }else if(val === 4) {
                    this.searchForm.minDocStatus = 0;
                    this.searchForm.maxDocStatus = 101;
                }
            },
            //选中下拉框某个值
            selectDocDate(val){
                let item;
                if(val){
                   item = this.docTypeList.find(item => val === item.dictValue);
                   this.addOrEditForm.docTypeName=item.dictText;
                }
                if(val<0){
                    this.showInp = true;
                }else {
                    this.showInp = false;
                }

            },
            //点击主表行
            handleDetail(row) {
                this.newAdd = true;
                this.getIndex = row.index;
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.left_detailForm = row;
                this.addOrEditForm = {};
                this.tempObjFid = row.fid;
                this.copyForm = {};
                this.handleCancel(this.operateType);
                this.fetch('/oms/fm/FmClientReceiveController/getClientReceiveList',{fid:row.fid})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list.length) {
                            this.newAdd = false;
                            this.detailForm = result.data.list[0];
                            if(this.detailForm.docType < 0){
                                this.showDtailForm=true;
                            }else{
                                this.showDtailForm=false;
                            }
                            this.addOrEditForm = result.data.list[0];
                            this.copyForm = this.$lodash.cloneDeep(result.data.list[0]);
                            this.$nextTick(() => {
                                this.$refs.clientSelect.inputValueData = this.detailForm.clientCode;
                                this.valueObj.clientCode = this.detailForm.clientCode;
                            })
                        }else {
                            this.detailForm = {};
                            this.copyForm = {};
                        }
                    });
               // this.getChildTable(row.fid);
                this.detailId = row.fid;
                this.orderDocStatus = row.orderDocStatus;
                this.orderChangeDocStatus = row.orderChangeDocStatus;
                this.docCode = row.docCode;
                this.docStatus = row.docStatus;
            },
            //主表添加行
            handleAdd() {
                this.showInp=false;
                this.addOrEditForm = {
                    docDate:this.recentDate(0)
                };

                this.newVoucher = true;
                //console.log(this.addOrEditForm.docDate);
                this.operateType = 'add';
                this.isShowStatus.isPopUp = true;
                this.otherVariable.popupTitle = '新增收款凭证';
                this.otherVariable.isEdit = false;
                this.valueObj.clientCode = "";
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
                        this.readonly = true;
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
                this.$refs.commondata.getproceeds(val);
            },
            setClient(item) {
                if(item.clientType==2){
                    this.$set(this.addOrEditForm,'clientName2',item.fname);
                    this.$set(this.addOrEditForm,'clientCode2',item.fcode);
                    this.$set(this.addOrEditForm,'clientId2',item.fid);
                }else if(item.clientType==0) {
                    if(item.parentId) {
                        this.fetch('/oms/BasedataController/getOrgClientCompany',{fId:item.parentId})
                            .then(result => {
                                if(result.data && result.data.list && result.data.list.length) {
                                    let tempItem = result.data.list[0];
                                    this.$set(this.addOrEditForm,'clientName2',tempItem.fname);
                                    this.$set(this.addOrEditForm,'clientCode2',tempItem.fcode);
                                    this.$set(this.addOrEditForm,'clientId2',tempItem.fid);
                                }else {
                                    this.$message({
                                        message: '该客户没有关联经销商',
                                        type: 'error'
                                    });
                                }
                            })
                    }else {
                        this.$message({
                            message: '该客户没有关联经销商',
                            type: 'error'
                        });
                    }
                }
                this.$set(this.valueObj,'clientCode',item.fcode);
                this.$set(this.addOrEditForm,'clientName',item.fname);
                this.$set(this.addOrEditForm,'clientCode',item.fcode);
                this.$set(this.addOrEditForm,'clientId',item.fid);

            },
            //获取类型
            getdocTypeList() {
                this.docTypeList = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30130')
                    .then(result => {
                        if(result.data && result.data.length) {
                            result.data.forEach(item => {
                                //item.dictText = item.dictText;
                                item.dictValue = Number(item.dictValue);

                            });
                            this.docTypeList = result.data;
                            console.log(1,this.docTypeList)
                        }else {
                            this.docTypeList = [];
                        }
                    })
            },

            //主表新增保存行
            handleSave() {
                this.otherVariable.isSaving=true;
                this.$refs.addOrEditForm.validate((valid)=>{
                    if(valid){
                        let tempObj;
                        let api;
                        if(this.newVoucher) {
                            tempObj =  {
                                clientName2: this.addOrEditForm.clientName2,
                                clientId2:this.addOrEditForm.clientId2,
                                clientName: this.addOrEditForm.clientName,
                                clientId:this.addOrEditForm.clientId,
                                docCode:this.addOrEditForm.docCode,
                                docDate:this.addOrEditForm.docDate,
                                receiveMoney:this.addOrEditForm.receiveMoney,
                                expectReceiveDate:this.addOrEditForm.expectReceiveDate,
                                actualReceiveDate:this.addOrEditForm.actualReceiveDate,
                                clientCode:this.addOrEditForm.clientCode,
                                clientCode2:this.addOrEditForm.clientCode2,
                                projectName:this.addOrEditForm.projectName,
                                remark:this.addOrEditForm.remark,
                                docType:this.addOrEditForm.docType,
                                bandAccount:this.addOrEditForm.bandAccount,
                                bandAccountName:this.addOrEditForm.bandAccountName,
                                bandName:this.addOrEditForm.bandName,
                                refDocCode:this.addOrEditForm.refDocCode,
                                docTypeName:this.addOrEditForm.docTypeName


                            };
                            api = '/oms/fm/FmClientReceiveController/addClientReceive';
                            this.fetch(api,tempObj)
                                .then(result => {
                                    if(result.status === 200) {
                                        this.$message({
                                            message: '保存成功',
                                            type: 'success'
                                        });
                                        this.otherVariable.isSaving=false;
                                        this.readonly=true;
                                        this.handleEn=true;
                                        this.isShowStatus.isPopUp = false;
                                        this.addForm = {};
                                        this.searchForm = {
                                            minDocStatus : 0,
                                            maxDocStatus : 50,
                                            tempStatus:1,
                                        };
                                        this.detailId = result.data;
                                        this.getData();
                                    }else {
                                        this.$message({
                                            message: this.returnErrorMsg(result.error),
                                            type: 'error'
                                        });
                                    }
                                })

                        }else {
                            console.log(this.tempObjFid);
                            tempObj =  {
                                clientName2: this.addOrEditForm.clientName2,
                                clientId2:this.addOrEditForm.clientId2,
                                clientName: this.addOrEditForm.clientName,
                                clientId:this.addOrEditForm.clientId,
                                docCode:this.addOrEditForm.docCode,
                                docDate:this.addOrEditForm.docDate,
                                receiveMoney:this.addOrEditForm.receiveMoney,
                                expectReceiveDate:this.addOrEditForm.expectReceiveDate,
                                actualReceiveDate:this.addOrEditForm.actualReceiveDate,
                                clientCode:this.addOrEditForm.clientCode,
                                clientCode2:this.addOrEditForm.clientCode2,
                                projectName:this.addOrEditForm.projectName,
                                remark:this.addOrEditForm.remark,
                                docType:this.addOrEditForm.docType,
                                bandAccount:this.addOrEditForm.bandAccount,
                                bandAccountName:this.addOrEditForm.bandAccountName,
                                bandName:this.addOrEditForm.bandName,
                                refDocCode:this.addOrEditForm.refDocCode,
                                fid:this.tempObjFid,
                                docTypeName:this.addOrEditForm.docTypeName

                            };
                            api = '/oms/fm/FmClientReceiveController/updateClientReceive';
                            this.fetch(api,tempObj)
                                .then(result => {
                                    if(result.status === 200) {
                                        this.$message({
                                            message: '保存成功',
                                            type: 'success'
                                        });
                                        this.readonly=true;
                                        this.handleEn=true;
                                        this.isShowStatus.isPopUp = false;
                                        this.addForm = {};
                                        this.searchForm = {
                                            minDocStatus : 0,
                                            maxDocStatus : 50,
                                            tempStatus:1,
                                        };
                                        this.detailId = result.data;
                                        this.getData();
                                    }else {
                                        this.$message({
                                            message: this.returnErrorMsg(result.error),
                                            type: 'error'
                                        });
                                    }
                                })
                        }





                    }else{
                        console.log('error submit!!');
                        return false;
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
                console.log(this.showInp);
                this.newVoucher = false;
                console.log(this.newVoucher);
                this.isShowStatus.isPopUp = true;
                this.isShowNotAllowed = true;
                this.proceeds='保存';
                this.otherVariable.popupTitle='修改收款凭证';
                this.handleEn = false;
                this.readonly = false;
               // console.log(22222,this.detailForm.docType)
                //this.$set(this.addOrEditForm,'docType',this.detailForm.docTypeName);
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


                })


            },
            //主表取消操作
            handleCancel() {

                this.isShowStatus.isPopUp = false;
                if(this.newVoucher) {
                    this.addOrEditForm = {};
                }else {
                    this.detailForm.docStatus<50;
                    this.handleEn = true;
                    this.readonly=true;
                    this.detailForm = this.$lodash.cloneDeep(this.copyForm);
                    this.addOrEditForm = this.$lodash.cloneDeep(this.copyForm);
                }
            },

            //主表确认
            handleConfirm() {
                this.$confirm('是否提交?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.detailForm.docStatus = 50;
                    this.fetch('/oms/fm/FmClientReceiveController/submitClientReceive',this.detailForm)
                        .then(result => {
                            if (result.status === 200) {
                                this.readonly = true;
                                this.handleEn = true;
                                this.$message({
                                    message: result.message,
                                    type: 'success'
                                });
                                this.getData();

                            }else {
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                })
                            }
                        })
                })

            },
            //撤回
            handleCanle(){
                this.$confirm('是否撤回?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.detailForm.docStatus = 0;
                    this.fetch('/oms/fm/FmClientReceiveController/submitClientReceive',this.detailForm)
                        .then(result => {
                            if (result.status === 200) {
                                this.readonly = true;
                                this.handleEn = true;
                                this.$message({
                                    message: result.message,
                                    type: 'success'
                                });
                                this.handleRefresh();

                            }else {
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                })
                            }
                        })
                })


            },
            //修改
            handleUpdate(){
                this.$confirm('是否保存?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.fetch('/oms/fm/FmClientReceiveController/updateClientReceive',this.detailForm)
                        .then(result => {
                            if (result.status === 200) {
                                this.readonly = true;
                                this.isShowNotAllowed = false;
                                this.handleEn=true;
                                this.$message({
                                    message: result.message,
                                    type: 'success'
                                });
                                this.getData();

                            }else {
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                })
                            }
                        })

                })


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
    .banClick {
        cursor: not-allowed!important;
    }

</style>
