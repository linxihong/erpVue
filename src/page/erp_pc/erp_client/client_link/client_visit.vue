<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleAdd('new')">新建</el-button>
                <el-button class="btn-cyan add-btn" @click="handleRecord('recode')">查看记录</el-button>
                <el-button @click="handleRefresh">刷新</el-button>
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
                @toggleSpread="toggleSpread"
                @handleEdit="handleEdit"
                @handleDelete="handleDelete"
            >

                <template slot="main-btn-wrap">
                    <!--<div class="icon-edit" @click="handleEdit"></div>-->
                    <div class="xs-icon-confirm" @click="handleRecord('recode')" style="right:164px;height: 61px; width: 64px; line-height: 61px; ">查看记录</div>
                    <!--<i class="icon-delete" title="删除" @click="handleDelete"></i>-->
                </template>
                <!--头部标题-->
                <!--<template slot="head-form-title">-->
                <!--<div class="head-form-title">-->
                <!--<span>&nbsp;{{ detailForm.companyName }}</span>-->
                <!--<span>{{ detailForm.prdMethodName }}</span>-->
                <!--</div>-->
                <!--</template>-->
                <!--头部表单-->
                <template slot="head-form-content">
                    <div class="head-form-content">
                        <template >
                            <div >
                                <span style="font-size: 32px;">查看拜访记录</span>

                            </div>
                        </template>
                    </div>
                </template>
                <!--tab区域-->
                <template slot="common-content">
                    <el-tabs v-model="activeName" class="common-content-tab order_style">
                    <el-tab-pane label="" name="first">
                        <el-table
                            tooltip-effect="dark"
                            v-loading="loadingI"
                            :data="tabDataI"
                            @row-click="clickDetail"
                            border
                            :height="$store.state.screenHei*0.62"
                            highlight-current-row
                        >

                            <el-table-column label="客户名称" prop="itemNo" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.cltCompanyName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="受访人" prop="itemNo" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.visitors}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="职务" prop="itemNo" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.visitorsjob}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="联系电话" prop="itemNo" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.visitorsphone}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="受访目的" prop="itemNo" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.visitintent}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="拜访方式" prop="itemNo" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.visitmethod ===0?'当面拜访':(scope.row.visitmethod ===1?'电话拜访':'') }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" prop="itemNo" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.visitstatus===0?'待拜访':(scope.row.visitstatus===50?'拜访中':(scope.row.visitstatus===100?'已完成':''))}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="业务员" prop="itemNo" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.salesname }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="拜访日期" prop="itemNo" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.visitdate  }}</span>
                                </template>
                            </el-table-column>

                            <!--<el-table-column label="操作" align="center" width="55" fixed="right">-->
                                <!--<template slot-scope="scope">-->
                                    <!--<i class="el-icon-delete" title="删除" @click.stop="handleDeleteChild(scope.row,scope.$index)"></i>-->
                                <!--</template>-->
                            <!--</el-table-column>-->
                        </el-table>

                    </el-tab-pane>
                </el-tabs>
                   <el-pagination
                       class="child-pagination"
                       @size-change="handleChildSize"
                       @current-change="handleChildCurrent"
                       :pager-count="5"
                       :current-page="childPage"
                       :page-size="childSize"
                       layout="total, sizes, prev, pager, next"
                       :total="childTotal">
                   >

                   </el-pagination>
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
                >
                    <template slot="head-form-title">
                        <div class="head-form-title">
                            <span>{{otherVariable.popupTitle}}</span>
                        </div>
                    </template>
                    <template slot="custom-add-form">
                        <el-form ref="addOrEditForm" :model="addOrEditForm" :rules="mainRules" :inline="otherVariable.isInlineForm" label-width="120px">
                        <template v-if="showTable">
                            <el-form-item label="客户名称" prop="cltcompanyname" style="width: 50%" >
                                <SelectEnter
                                    ref="cltcompanySelect"
                                    :inputValue="valueObj.cltcompanyname"
                                    :selectTHs="valueObj.vistTHs"
                                    :selectTds="valueObj.vistList"
                                    @getList="getClientVist"
                                    @setObj="setClientVist"
                                    selectLabel="fname"
                                    selectValue="fname"
                                    selectKey="fid">
                                </SelectEnter>
                            </el-form-item>
                            <el-form-item label="拜访方式" prop="visitmethod">
                                <el-select v-model="addOrEditForm.visitmethod" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in clientPoList"
                                        :key="index"
                                        :label="item.dicttext"
                                        :value="item.dictvalue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="受访人" style="width: 50%" prop="visitors">
                                <el-input v-model="addOrEditForm.visitors"></el-input>
                            </el-form-item>
                            <el-form-item label="职务" prop="visitorsjob">
                                <el-input v-model="addOrEditForm.visitorsjob"></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话">
                                <el-input v-model="addOrEditForm.visitorsphone"></el-input>
                            </el-form-item>
                            <el-form-item label="携带资料" style="width: 100%" class="client_input">
                                <el-select v-if="isSelect" v-model="addOrEditForm.visitcarryfile" style="width: 100%" multiple="multiple">
                                    <el-option
                                        v-for="(item,index) in fileList"
                                        :key="index"
                                        :label="item.dicttext"
                                        :value="item.dicttext">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="拜访目的" style="width: 100%" class="client_input">
                                <el-select v-if="isSelect" v-model="addOrEditForm.visitIntent" style="width: 100%" multiple="multiple">
                                    <el-option
                                        v-for="(item,index) in IntentList"
                                        :key="index"
                                        :label="item.dicttext"
                                        :value="item.dicttext">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="业务员" style="width: 50%">
                                <el-input v-model="addOrEditForm.salesname"></el-input>
                            </el-form-item>
                            <el-form-item label="拜访日期" prop="visitdate">
                                <el-date-picker
                                    v-model="addOrEditForm.visitdate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </template>
                        <template v-if="!showTable" >
                            <div class="inline-form-title" style="width: 119px;">拜访任务信息</div>
                            <el-form-item label="客户名称:" style="width: 30%">
                           {{vistData.cltCompanyName}}
                            </el-form-item>
                            <el-form-item label="受访人:" style="width: 30%">
                                {{vistData.visitors}}
                            </el-form-item>
                            <el-form-item label="联系电话:" style="width: 30%">
                                {{vistData.visitorsphone}}
                            </el-form-item>
                            <el-form-item label="拜访方式:" style="width: 30%">
                                {{vistData.visitmethod==1?'当面拜访':'电话拜访'}}
                            </el-form-item>
                            <el-form-item label="业务员:" style="width: 30%">
                                {{vistData.salesname}}
                            </el-form-item>
                            <el-form-item label="拜访日期:" style="width: 30%">
                                {{vistData.visitdate}}
                            </el-form-item>
                            <el-form-item label="拜访目的:" style="width: 60%">
                                {{vistData.visitIntent}}
                            </el-form-item>

                            <el-form-item label="携带资料:" style="width: 30%">
                                {{vistData.visitcarryfile}}
                            </el-form-item>

                            <div class="inline-form-title" style="width: 119px;">拜访过程信息</div>
                            <el-form-item label="到达时间:" style="width: 50%">
                                {{vistData.signintime}}
                            </el-form-item>
                            <el-form-item label="现场位置:" style="width: 30%">
                                {{vistData.signinlocation}}
                            </el-form-item>
                            <el-form-item label="现场资料:" style="width: 50%">

                            </el-form-item>
                            <el-form-item label="备注:" style="width: 30%">
                                {{vistData.memo }}
                            </el-form-item>
                            <div class="inline-form-title" style="width: 119px;">拜访记录</div>
                            <el-form-item label="主营业务:" style="width: 40%;">
                                <el-input v-model="addOrEditForm.business"></el-input>
                            </el-form-item>
                            <el-form-item label="经验规模:" style="width: 40%;">
                                <el-input v-model="addOrEditForm.operateScale"></el-input>
                            </el-form-item>
                            <el-form-item label="客户反馈:" style="width: 90%;" class="client_inputvist">
                                <el-input v-model="addOrEditForm.requirements"></el-input>
                            </el-form-item>
                            <el-form-item label="拜访结果:" style="width: 90%;" class="client_inputvist">
                                <el-input v-model="addOrEditForm.result"></el-input>
                            </el-form-item>
                            <el-form-item label="竞争对手:" style="width: 90%;" class="client_inputvist">
                                <el-input v-model="addOrEditForm.competitor"></el-input>
                            </el-form-item>
                            <el-form-item label="下一步计划:" style="width: 40%;">
                                <el-input v-model="addOrEditForm.nextPlan"></el-input>
                            </el-form-item>
                            <el-form-item label="主管批示:" style="width: 40%;">
                                <el-input v-model="addOrEditForm.opinion"></el-input>
                            </el-form-item>
                        </template>
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

    export default {
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetailX,
            CommonAdd,
            CommonData,
            SelectEnter
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
                    detailTitle: '编辑客户信息',
                    addTitle: '新增客户拜访',
                    recordTitle:'录入客户拜访信息',
                    popupTitle: '',
                    isInlineForm: true,
                    isEdit: false,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    loading: false,
                    $isCustom: true
                },
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
                    vistName: null,
                    vistList: [],
                    vistTHs: [
                        {label:'代码',prop:'fcode'},
                        {label:'名称',prop:'fname'}
                    ],
                },
                isSelect: true,
                addType: 'new',
                showTable:false,
                tempWidth: null,
                tableData: [],
                visitList:{},
                visitFid:'',
                //搜索映射表
                searchProp: [
                    {
                        name:'客户代码',
                        prop:'cltcompanyname',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入客户名称'
                    },
                    {
                        name:'客户名称',
                        prop:'cltcompanyname',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false,

                    },
                    {
                        name:'代码',
                        prop:'cltcompanycode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'销售公司名称',
                        prop:'salesCompanyName',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'代码',
                        prop:'salesCompanyCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },

                ],
                //详情映射列表
                formProp: [
                    {name:'订单编号',prop:'refDocCode',type:'outter'},
                    {name:'下单日期',prop:'docDate',type:'outter'},
                    {name:'交货日期',prop:'dekuvertDate',type:'outter'},
                    {name:'单据状态',prop:'docType',type:'outter'},
                    {name:'业务员',prop:'sakesName',type:'inner'},
                    {name:'贴膜要求',prop:'padPastingMethodName',type:'inner'},
//                    {name:'提货方式',prop:'',type:'inner'},
                    {name:'经销商',prop:'clientName2',type:'inner'},
                    {name:'供货公司',prop:'supplyCompanyName',type:'inner'},
                    {name:'跟单员',prop:'followId',type:'inner'},
                    {name:'包装方式',prop:'packMethodCode',type:'inner'},
//                    {name:'结算方式',prop:'m',type:'inner'},
                    {name:'备注',prop:'remark',type:'inner'}
                ],
                //新增&编辑映射列表
                operateProp: [
                    {name:'下单日期',prop:'docDate',type:'normal'},
                    {name:'销售类型',prop:'sellType',type:'select',selectList:[{value:1,label:'国内'},{value:2,label:'出口'}]},
                    {name:'交货日期',prop:'deliveryDate',type:'normal'},
                    {name:'单据类型',prop:'docType',type:'normal'},
                    {name:'客户',prop:'clientName',type:'normal'},
                    {name:'货期等级',prop:'deliveryLevel',type:'normal'},
                    {name:'合同编码',prop:'contractId',type:'normal'},
                    {name:'经销商',prop:'clientName2',type:'normal'},
                    {name:'客户PO',prop:'clientPo',type:'normal'},
                    {name:'工程项目',prop:'projectName',type:'normal'},
                    {name:'备注说明',prop:'remark',type:'normal'},
                    {name:'包装方式',prop:'packMethodName',type:'normal'}
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
                        name:'状态',
                        prop:'clientstatusname',
                        type:'visits',
                        width: ''
                    },
                    {
                        name1:'客户名称/',
                        prop1:'fname',
                        name2:'代码',
                        prop2:'fcode',
                        type:'mixin',
                        width: ''
                    },
                    {
                        name1:'销售公司名称/',
                        prop1:'matSeriesName',
                        name2:'代码',
                        prop2:'matSeriesCode',
                        type:'mixin',
                        width: ''
                    },
                    {
                        name:'客户类型',
                        prop:'clienttype',
                        type:'client',
                        width: ''
                    },

                ],
                formItems: [
                    {name: '客户代码：', prop: 'fcode', type:'inner',span:24 },
                    {name: '客户名称：', prop: 'fname', type: 'inner',span:24},
                    {name: '客户别名：', prop: 'aliasname',type: 'inner',span:24},
                    {name: '客户类型：', prop: 'clienttype', type: 'inner',span:24},
                    {type: 'line' ,style: {display: 'block', margin: '10px auto', height: '2px', width: '100%',backgroundColor: '#cecece',span:24}},

                    {
                        span:12,
                        name: '国家:',
                        prop: 'countryname',
                        type: 'inner'
                    },
                    {
                        span:12,
                        type: 'inner',
                        name: '省区:',
                        prop: 'areaname'
                    },
                    {
                        span:12,
                        type: 'linkman',
                        name: '联系人:',
                        prop: 'meterWght'
                    },
                    {
                        span:12,
                        type: 'inner',
                        name: '手机:',
                        prop: 'mobile'
                    },
                    {
                        span:12,
                        type: 'inner',
                        name: '电话:',
                        prop: 'tel'
                    },
                    {
                        span:12,
                        type: 'inner',
                        name: '传真:',
                        prop: 'fax'
                    },
                    {
                        span:12,
                        type: 'inner',
                        name: '邮箱:',
                        prop: 'email '
                    },
                    {
                        span:12,
                        type: 'inner',
                        name: '邮编:',
                        prop: 'post'
                    },
                    {
                        span:24,
                        type: 'inner',
                        name: '地址:',
                        prop: 'address'
                    },
                    {
                        span:24,
                        type: 'inner',
                        name: '网址:',
                        prop: 'url',

                    },

                ],
                mainRules:{
                    cltcompanyname:[
                        {required:true,message:'请输入客户名称',trigger:'change'}
                    ],
                    visitmethod:[
                        {required: true, message: '请输入拜访方式', trigger: 'change'}
                    ],
                    visitors:[
                        {required:true,message:'请输入受访人',trigger:'blur'}
                    ],
                    visitorsjob:[
                        {required:true,message:'请输入职务',trigger:'blur'}
                    ],
                    visitdate:[
                        {required: true, message: '请输入拜访日期', trigger: 'change'}
                    ]
                },
                searchForm: {},
                addOrEditForm: {},
                addForm: {},
                detailForm:{},
                copyForm: {},
                childPage: 1,
                childSize: 10,
                childTotal: 0,
                vistData:{},
                //客户
                clientName: null,
                tempForm: {},
                submitRow: {},
                detailId: null,
                docCode: null,
                //型号
                clientPoList:[],
                fileList:[],
                IntentList:[],
                getMatCode: null,
                getMatName: null,
                //颜色
                getColorCode: null,
                getColorName: null,
                colorCodeTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                colorCodeList: [],
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
                //订单明细映射表
                tabPropI: [
                    {prop:'docItem', name:'序号',type:'normal'},
                    {
                        prop:'', name:'型材',
                        children:[
                            {prop:'matCode',name:'型号',type:'select',width:150,selectList:[]},
                            {prop:'matName',name:'名称',type:'normal'},
                        ]
                    },
                    {
                        prop:'', name:'颜色',
                        children:[
                            {prop:'cltCxl',name:'代码',type:'normal'},
                            {prop:'cltCxlName',name:'名称',type:'normal'},
                        ]
                    },
                    {prop:'cx2Name',name:'材质',type:'normal'},
                    {prop:'cx4Name',name:'长度',type:'normal'},
                    {prop:'cx3Name',name:'膜厚',type:'normal'},
                    {prop:'unitSqm',name:'支数',type:'normal'},
                    {prop:'meterWght',name:'米重',type:'normal'},
                    {prop:'unitWght',name:'支重',type:'normal'},
                    {prop:'theoryWght',name:'理重',type:'normal'},
                    {
                        prop:'',name:'生产要求',
                        children:[
                            {prop:'usrTxt1Name',name:'喷码',type:'normal'},
                            {prop:'usrTxt2Name',name:'禁喷类型',type:'normal'},
                            {prop:'usrTxt3Name',name:'撕筋',type:'checkbox'},
                        ]
                    },
                    {prop:'remark',name:'备注',type:'normal'}
                ],
                //订单明细数据
                tabDataI: [],
                copyDataI: [],
                loadingI: false
            }
        },
        mounted() {
            this.getData();
            this.getclientPoList();
            this.getfileList();
            this.getIntentList();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                this.tableData = [];
                this.fetch(`crm/Crm/VisitTaskInfo/getClientCompanyList?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
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
                            this.copyForm = {};
                            this.detailId = null;
                            this.docCode = null;
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },

            //客户
            getClientVist(val) {
                this.$refs.commondata.getClientVist(val);
            },
            setClientVist(item) {
                //客户
                this.$set(this.valueObj,'cltcompanyname',item.fname);
                this.$set(this.addOrEditForm,'cltcompanyname',item.fname);
                this.$set(this.addOrEditForm,'cltcompanycode',item.fcode);
            },
            //刷新
            handleRefresh() {
                this.isAudit = true;
                this.isBanOperate = true;
                this.searchForm = {};
                this.getData();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },
            //点击主表行
            handleDetail(row) {
                this.childPage =1;
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.copyDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = row;
                this.copyForm = this.$lodash.cloneDeep(row);
                this.handleCancel(this.operateType);
                this.detailId = row.fid;
                this.docCode = row.docCode;
                this.getChildTable();
            },
            getChildTable() {
                this.fetch(`crm/Crm/VisitTaskInfo/getClientVisitRecord?cltCompanyId=${this.detailId}&pageNo=${this.childPage}&pageSize=${this.childSize}`,{})
                    .then(result => {
                        if(result.status === 200) {
                            this.tabDataI = result.data.list;
                            this.copyDataI = this.$lodash.cloneDeep(result.data.list);
                            this.childTotal = result.data.total;
                        }else {
                            this.tabDataI = [];
                            this.copyDataI = [];
                            this.detailForm = {};
                            this.copyForm = {};
                            this.childTotal = 0;
                        }
                    });
            },
            //分页
            handleChildSize(val) {
                this.childSize = val;
                this.getChildTable();
            },
            handleChildCurrent(val) {
                this.childPage = val;
                this.getChildTable();
            },

            //主表添加行
            handleAdd(type) {
                this.addType = type;
                this.isSelect = false;
                this.isShowStatus.isPopUp = true;
                this.otherVariable.popupTitle = this.otherVariable.addTitle;
                this.otherVariable.isEdit = false;
                this.addForm = {};
                this.addOrEditForm = {};
                this.showTable=true;
                setTimeout(() => {
                    this.isSelect = true;
                    this.$refs.cltcompanySelect.inputValueData='';
                },200)
            },

            //主表编辑行
            handleEdit() {
                this.isSelect = false;
                this.otherVariable.popupTitle = this.otherVariable.detailTitle;
                this.otherVariable.isEdit = true;
                this.showTable=true;
                this.addOrEditForm = this.detailForm;
                if(this.detailForm.fid) {
                    this.isShowStatus.isPopUp = true;
                    //客户
                    this.$set(this.addOrEditForm,'cltcompanyname',this.detailForm.cltcompanyname);
                    this.$set(this.valueObj,'cltcompanyname',this.detailForm.cltcompanyname)
                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    });
                }
                setTimeout(() => {
                    this.isSelect = true;
                },200)
            },
            //主表保存行
            handleSave(type) {
                this.$refs.addOrEditForm.validate((valid) => {

                    if (valid) {
                        let tempObj;
                        let api;
                        if(type === 'add') {
                            api = '/crm/Crm/VisitTaskInfo/insert';
                            if(this.addType === 'new') {

                            }else {
                                this.addOrEditForm = {...this.addOrEditForm,...this.vistData};
                            }
                        }else {
                            api = '/crm/Org/ClientCompany/updateClientCompany';
                        }
                        if(Array.isArray(this.addOrEditForm.visitcarryfile)) {
                            this.addOrEditForm.visitcarryfile = this.addOrEditForm.visitcarryfile.join();
                        }
                        tempObj = this.addOrEditForm;
                        this.fetch(api,tempObj)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    type === 'add' ? this.isShowStatus.isPopUp = false : this.isShowStatus.isRead = true;
                                    this.addForm = {};
                                    this.searchForm = {};
                                    this.getData();
                                    this.handleRefresh();
                                }else {
                                    this.$message({
                                        message: '保存失败',
                                        type: 'error'
                                    });
                                }
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })

            },
            //主表取消操作
            handleCancel(type) {
                this.isShowStatus.isPopUp = false;
                if(type === 'add') {
                    this.addForm = {};
                }else {
                    this.detailForm = this.$lodash.cloneDeep(this.copyForm);
                }
            },
            //主表确认
            handleConfirm() {
                this.getAjax(`/crm/Org/ClientCompany/updateClientCompany?orderId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
                    .then(result => {
                        if(result.status ===200){
                            this.$message({
                                message:result.message,
                                type:'success'
                            });
                            this.handleDetail({fid:this.detailId});
                            setTimeout(() => {
                                this.getData();
                            },200)
                        }else{
                            this.$message({
                                message:result.message,
                                type:'success'
                            })
                        }
                    });
            },
            //主表删除行
            handleDelete() {
                if(this.detailForm.fid) {
                    this.getAjax(`?orderId=${this.detailForm.fid}`)
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
                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    });
                }
            },

            //从表删除行
            handleDeleteChild(row,index) {
                if(row.fId) {
                    if(confirm('确定删除？') === true) {
                        if(this.activeName === 'first') {
                            this.getAjax(`/oms/sls/SalesOrderDetail/delete?fid=${this.tabDataI[index].fId}`)
                                .then(result => {
                                    if(result.status === 200) {
                                        this.$message({
                                            message: '删除成功',
                                            type: 'success'
                                        });
                                        this.tabDataI.splice(index,1);
                                    }else {
                                        this.$message({
                                            message: '删除失败',
                                            type: 'error'
                                        });
                                    }
                                });
                            this.otherVariable.isChildEdit = false;
                        }else if(this.activeName === 'second') {
                            this.tabDataII.splice(index,1);
                        }
                    }
                }else {
                    this.tabDataI.splice(index,1);
                }
            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
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
               //console.log(row);
               this.visitList =  row;
               //获取当前列的fid
                this.visitFid = this.visitList.fid;
            },

            handleRecord(type){
                this.addType = type;
                this.isShowStatus.isPopUp = true;
                this.otherVariable.popupTitle = this.otherVariable.recordTitle;
                this.otherVariable.isEdit = false;
                this.addForm = {};
                this.addOrEditForm = {};
                this.showTable=false;
                this.fetch(`crm/Crm/VisitTaskInfo/getVisitInfoByPrimaryKey?primaryKey=${this.visitFid}`,{})
                    .then(result => {
                        if(result.data) {
                            this.vistData = result.data
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })
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
            //获取拜访方式
            getclientPoList(){
                this.clientPoList=[];

                this.getAjax('/crm/Crm/VisitTaskInfo/getVisitMethodList?pageSize=10000')
                    .then(result => {
                        if(result.data) {
                            this.clientPoList = result.data;
                        }
                    })
            },
            //获取拜访资料
            getfileList(){
                this.fileList=[];
                this.getAjax('/crm/Crm/VisitTaskInfo/getVisitCarryFilesList?pageSize=10000')
                    .then(result => {
                        if(result.data) {
                            this.fileList = result.data;
                        }
                    })
            },

            //获取拜访目的
            getIntentList(){
                this.IntentList=[];
                this.getAjax('crm/Crm/VisitTaskInfo/getVisitIntentList?pageSize=10000')
                    .then(result => {
                        if(result.data) {
                            this.IntentList = result.data;
                        }
                    })
            },
            //获取子型号
            setMatCode(item) {
                this.getMatCode = item.fcode;
                this.getMatName = item.fname;
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
            //获取颜色
            setColorCode(item) {
                this.getColorCode = item.fcode;
                this.getColorName = item.fname;
                this.$set(this.tabDataI[this.editIndex],'cltCx1',item.fcode);
                this.$set(this.tabDataI[this.editIndex],'cltCx1Name',item.fname);
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
    .el-tabs .el-tabs__active-bar{
        background-color:transparent !important;
    }
    .el-padding{
        padding: 5px;
    }

</style>
