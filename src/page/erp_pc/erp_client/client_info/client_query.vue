<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
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
            >

                <template slot="head-form-content">
                    <div class="head-form-content">
                        <template >
                            <div >
                                <span style="font-size: 32px;">客户信息</span>

                            </div>
                        </template>
                    </div>
                </template>
                <!--tab区域-->
                <template slot="common-content">
                    <div style="padding-left: 20px;margin-top: 12px;height: 240px;" class="client_tabs">
                        <el-tabs v-model="activeName"   >
                            <el-tab-pane label="客户资料" name="first" >
                                <div style="margin-left: 120px;margin-top: 60px;">
                                    <p>客户代码:{{this.detailForm.fcode}}</p>
                                    <p>客户名称：{{this.detailForm.fname}}</p>
                                    <p>客户别名：{{this.detailForm.aliasname}} </p>
                                    <p>客户类型：{{this.detailForm.clienttypename}}</p>
                                    <p style="padding: 10px;border-bottom: 1px solid #80808029;"></p>
                                </div>
                                <div style="margin-left: 120px;margin-top: 60px;display: flex;flex-direction: row;width: 800px;">
                                    <div style="flex: 1">
                                        <p>国家： {{this.detailForm.countryname}}</p>
                                        <p>联系人 ：{{this.detailForm.linkman}}</p>
                                        <p>电话：{{this.detailForm.linkman}} </p>
                                        <p>邮箱： {{this.detailForm.email}}</p>
                                        <p>地址： {{this.detailForm.address}}</p>
                                        <p>网址：  {{this.detailForm.url}}</p>
                                    </div>
                                    <div style="flex: 1">
                                        <p>省区： {{this.detailForm.areaname}}</p>
                                        <p>手机： {{this.detailForm.mobile}}</p>
                                        <p>传真： {{this.detailForm.fax}}</p>
                                        <p>邮编： {{this.detailForm.post}}</p>
                                    </div>
                                </div>

                            </el-tab-pane>
                            <!--<el-tab-pane label="客户商机 " name="second">-->
                                <!--<el-table-->

                                    <!--highlight-current-row-->
                                    <!--style="width: 100%"-->
                                    <!--:height="$store.state.screenHei*0.80"-->
                                    <!--ref="moviesTable"-->
                                    <!--@selection-change="handleSelectionChange"-->
                                <!--&gt;-->
                                    <!--<el-table-column  type="index" width="55" label="序号"></el-table-column>-->
                                    <!--<el-table-column prop="orderDocCode" label="商机名称" :show-overflow-tooltip="true"  align="center"></el-table-column>-->
                                    <!--<el-table-column prop="docDate" label="商机类型" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>-->
                                    <!--<el-table-column prop="clientCode2" label="商机来源"   width="120" :show-overflow-tooltip="true" align="center"></el-table-column>-->
                                    <!--<el-table-column prop="clientCode" label="登记人"  :show-overflow-tooltip="true" align="center"></el-table-column>-->
                                    <!--<el-table-column prop="projectName" label="登记日期" :show-overflow-tooltip="true" align="center"></el-table-column>-->
                                    <!--<el-table-column prop="orderNewDeliveryLevelName" label="备注"  :show-overflow-tooltip="true" align="center"></el-table-column>-->

                                        <!--<el-table-column  label="操作" align="center" width="55" fixed="right">-->
                                            <!--<template slot-scope="scope">-->
                                                <!--<i class="el-icon-delete" title="删除" ></i>-->
                                            <!--</template>-->
                                        <!--</el-table-column>-->
                                <!--</el-table>-->
                            <!--</el-tab-pane>-->
                            <!--<el-tab-pane label="客户资信 " name="third">-->
                                <!--<el-table-->

                                    <!--highlight-current-row-->
                                    <!--style="width: 100%"-->
                                    <!--:height="$store.state.screenHei*0.80"-->
                                    <!--ref="moviesTable"-->
                                    <!--@selection-change="handleSelectionChange"-->
                                <!--&gt;-->
                                    <!--<el-table-column  type="index" width="55" label="序号"></el-table-column>-->
                                    <!--<el-table-column prop="orderDocCode" label="资信名称" :show-overflow-tooltip="true"  align="center"></el-table-column>-->
                                    <!--<el-table-column prop="docDate" label="资信类型" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>-->
                                    <!--<el-table-column prop="clientCode2" label="资信来源"   width="120" :show-overflow-tooltip="true" align="center"></el-table-column>-->
                                    <!--<el-table-column prop="clientCode" label="创建人"  :show-overflow-tooltip="true" align="center"></el-table-column>-->
                                    <!--<el-table-column prop="projectName" label="创建日期" :show-overflow-tooltip="true" align="center"></el-table-column>-->
                                    <!--<el-table-column prop="orderNewDeliveryLevelName" label="备注"  :show-overflow-tooltip="true" align="center"></el-table-column>-->

                                    <!--<el-table-column  label="操作" align="center" width="55" fixed="right">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<i class="el-icon-delete" title="删除" ></i>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                <!--</el-table>-->
                            <!--</el-tab-pane>-->
                            <!--<el-tab-pane label="客户投诉 " name="fourth">-->
                                <!--<el-table-->
                                    <!--highlight-current-row-->
                                    <!--style="width: 100%"-->
                                    <!--:height="$store.state.screenHei*0.80"-->
                                    <!--ref="moviesTable"-->
                                    <!--@selection-change="handleSelectionChange"-->
                                <!--&gt;-->
                                    <!--<el-table-column  type="index" width="55" label="序号"></el-table-column>-->
                                    <!--<el-table-column prop="orderDocCode" label="单据编号" :show-overflow-tooltip="true"  align="center"></el-table-column>-->
                                    <!--<el-table-column prop="docDate" label="投诉日期" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>-->
                                    <!--<el-table-column prop="clientCode2" label="订单号"   width="120" :show-overflow-tooltip="true" align="center"></el-table-column>-->
                                    <!--<el-table-column prop="clientCode" label="投诉内容"  :show-overflow-tooltip="true" align="center"></el-table-column>-->
                                    <!--<el-table-column prop="projectName" label="投诉类型" :show-overflow-tooltip="true" align="center"></el-table-column>-->
                                    <!--<el-table-column prop="orderNewDeliveryLevelName" label="备注"  :show-overflow-tooltip="true" align="center"></el-table-column>-->

                                    <!--<el-table-column  label="操作" align="center" width="55" fixed="right">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<i class="el-icon-delete" title="删除" ></i>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                <!--</el-table>-->
                            <!--</el-tab-pane>-->
                            <!--<el-tab-pane label="客户拜访 " name="fifth">-->
                                <!--<el-table-->
                                    <!--:data="tabDataI"-->
                                    <!--highlight-current-row-->
                                    <!--style="width: 100%"-->
                                    <!--:height="$store.state.screenHei*0.80"-->
                                    <!--ref="moviesTable"-->
                                    <!--@selection-change="handleSelectionChange"-->
                                <!--&gt;-->
                                    <!--<el-table-column  type="index" width="55" label="序号"></el-table-column>-->
                                    <!--<el-table-column prop="visitors" label="受访人" :show-overflow-tooltip="true"  align="center"></el-table-column>-->
                                    <!--<el-table-column prop="visitorsjob" label="职务" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>-->
                                    <!--<el-table-column prop="visitintent" label="受访目的"   width="120" :show-overflow-tooltip="true" align="center"></el-table-column>-->
                                    <!--<el-table-column label="拜访方式" prop="itemNo" align="center">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{scope.row.visitmethod ===0?'当面拜访':(scope.row.visitmethod ===1?'电话拜访':'') }}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column label="状态" prop="itemNo" align="center">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{scope.row.visitstatus===0?'待拜访':(scope.row.visitstatus===50?'拜访中':(scope.row.visitstatus===100?'已完成':''))}}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column prop="salesname" label="业务员" :show-overflow-tooltip="true" align="center"></el-table-column>-->
                                    <!--<el-table-column prop="salesname" label="拜访日期" :show-overflow-tooltip="true" align="center"></el-table-column>-->
                                    <!--<el-table-column prop="remark" label="备注"  :show-overflow-tooltip="true" align="center"></el-table-column>-->

                                    <!--<el-table-column  label="操作" align="center" width="55" fixed="right">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<i class="el-icon-delete" title="删除" ></i>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                <!--</el-table>-->
                            <!--</el-tab-pane>-->
                        </el-tabs>
                    </div>
                    <!--<div>-->
                    <!--&lt;!&ndash;<el-tabs v-model="activeName" class="common-content-tab order_style" style="margin-top: 36px;margin-left: 55px;">&ndash;&gt;-->
                        <!--&lt;!&ndash;<el-tab-pane label="客户资料" name="first">用户管理</el-tab-pane>&ndash;&gt;-->
                        <!--&lt;!&ndash;<el-tab-pane label="客户商机" name="second">配置管理</el-tab-pane>&ndash;&gt;-->
                        <!--&lt;!&ndash;<el-tab-pane label="客户资信" name="third">角色管理</el-tab-pane>&ndash;&gt;-->
                        <!--&lt;!&ndash;<el-tab-pane label="客户投诉" name="fourth">定时任务补偿</el-tab-pane>&ndash;&gt;-->
                        <!--&lt;!&ndash;<el-tab-pane label="客户拜访" name="fifth">定时任务补偿</el-tab-pane>&ndash;&gt;-->
                    <!--&lt;!&ndash;</el-tabs>&ndash;&gt;-->
                    <!--</div>-->
                </template>

            </CommonDetailX>

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
                        prop:'clientStatusName',
                        type:'normal',
                        width: '80'

                    },
                    {
                        name1:'客户名称/',
                        prop1:'fname',
                        name2:'客户代码',
                        prop2:'fcode',
                        type:'mixin',

                    },
                    {
                        name1:'销售公司名称/',
                        prop1:'matSeriesName',
                        name2:'销售公司代码',
                        prop2:'matSeriesCode',
                        type:'mixin',

                    },
                    {
                        name:'客户类型',
                        prop:'clientTypeName',
                        type:'normal',
                        width: '80'
                    }

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
                getIndex:0,
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
                this.fetch(`/oms/BasedataController/getOrgClientCompany?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            if(isFirst){
                                this.$nextTick(() => {
                                    this.$refs.commontable.renderRow(this.tableData[this.getIndex].fid);
                                })
                            }
                        }else {
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
                this.getIndex = row.index;
                this.isShowStatus.isPopUp = false;
                this.isShowEnterpriseList = false;
                this.isShowEnterprise = false;
                this.searchList = [];
                this.searchName = "";
                this.otherVariable.isChildEdit = false;
                this.detailId = row.fid;
                this.tabDataI = [];
                this.copyDataI = [];
                this.fetch(`crm/pc/Org/ClientCompany/getClientCompanyByPrimaryKey?clientPrimaryKey=${row.fid}`,{})
                    .then(result => {
                        if(result.status === 200) {
                            this.detailForm = result.data;
                            console.log(this.detailForm);
                            this.copyForm = this.$lodash.cloneDeep(result.data);
                        }else {
                            this.$message({
                                message: '请求失败',
                                type: 'warning'
                            });
                            this.detailForm = {};
                            this.copyForm = {};
                        }
                    })

                this.fetch(`crm/Crm/VisitTaskInfo/getClientVisitRecord?cltCompanyId=${this.detailId}&pageNo=1&pageSize=1000`,{})
                    .then(result => {
                        if(result.status === 200) {
                            this.tabDataI = result.data.list;
                            this.copyDataI = this.$lodash.cloneDeep(result.data.list);

                        }else {
                            this.tabDataI = [];
                        }
                    })



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
    .el-tabs__nav-wrap::after{
        background-color: white;
    }

</style>
