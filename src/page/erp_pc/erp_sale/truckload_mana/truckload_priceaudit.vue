<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap"  v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleAdudit('multi')" :disabled="otherVariable.isSaving">批量审核</el-button>
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
                :otherVariable="otherVariable"
                :tableData="tableData"
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
                                <span v-if="!item.isCheck">{{ detailForm[item.prop] }}</span>
                                <span v-if="item.isCheck">{{ detailForm[item.prop] === 1 ? '✔':(detailForm[item.prop] === 0?'x':'') }}</span>
                            </div>
                        </template>
                    </div>
                </template>
                <!--头部按钮-->
                <template slot="main-btn-wrap">
                    <div v-if="showButton" class="xs-audit-icon" @click="!otherVariable.isSaving && handleAdudit('alone')" :class="otherVariable.isSaving ? 'banClick' : ''">审核</div>
                    <div v-if="showUnAudit" class="xs-unaudit-icon" @click="!otherVariable.isSaving && handleUnAudit()" :class="otherVariable.isSaving ? 'banClick' : ''">反审</div>
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
                    <el-tabs v-model="activeName" class="common-content-tab order_style">
                        <el-tab-pane label="价格明细" name="first">
                            <el-table
                                v-if="isResize"
                                tooltip-effect="dark"
                                v-loading="loadingI"
                                :data="tabDataI"
                                @row-click="clickDetail"
                                border
                                :height="tableHeightI"
                                highlight-current-row
                            >
                                <el-table-column label="项目号" align="left" width="120px">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.itemNo}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="型材型号" lign="left" width="120px">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.matCode }}</span>
                                        </template>
                                </el-table-column>
                                <!--<el-table-column label="型材组" align="center">-->
                                    <!--<el-table-column label="代码" lign="left" width="120px">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span></span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column label="名称" lign="left" :show-overflow-tooltip="true">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span></span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="颜色组" align="center">-->
                                    <!--<el-table-column label="代码" lign="left" width="120px">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span></span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column label="名称" lign="left" :show-overflow-tooltip="true">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span></span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                <!--</el-table-column>-->
                                <el-table-column label="颜色名称" align="left" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.cx1Name }}</span>
                                        </template>
                                </el-table-column>
                                <el-table-column label="单价" align="center">
                                    <el-table-column label="面积(元/m²)" align="right" width="120px">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.otherPrice?parseFloat(scope.row.otherPrice).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="重量(元/kg)" align="left">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.price?parseFloat(scope.row.price).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="价格组成(元/KG)" align="center">
                                    <el-table-column label="铝锭价" align="right" width="120px">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.pricePart8?parseFloat(scope.row.pricePart8).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="铝加工" align="right">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.pricePart1?parseFloat(scope.row.pricePart1).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="表面加工" align="right">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.pricePart2?parseFloat(scope.row.pricePart2).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="后工序" align="right">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.pricePart3?parseFloat(scope.row.pricePart3).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="附加费" align="right">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.pricePart4?parseFloat(scope.row.pricePart4).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="特殊材质费" align="right">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrPricePart1?parseFloat(scope.row.usrPricePart1).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="特殊包装费" align="right">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrPricePart1?parseFloat(scope.row.usrPricePart2).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="长料费" align="right">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrPricePart1?parseFloat(scope.row.usrPricePart3).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="小料费" align="right">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrPricePart1?parseFloat(scope.row.usrPricePart4).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="机型费" align="right">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrPricePart1?parseFloat(scope.row.usrPricePart5).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="锯挂痕费" align="right">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrPricePart1?parseFloat(scope.row.usrPricePart6).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="撕筋费" align="right">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrPricePart1?parseFloat(scope.row.usrPricePart7).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="禁喷加工费" align="right">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrPricePart1?parseFloat(scope.row.usrPricePart8).toFixed(3):0.00 }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="机台级别" align="right" width="80px">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.machineLevelCode }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="胶条规格" align="right" width="80px" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.usrTxt6Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="生产要求" align="center">
                                    <el-table-column label="喷码" align="center" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrTxt1Name }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="禁喷类型" align="right">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrTxt2Name }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="撕筋" align="center">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrTxt3Name }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="型材系列" align="center">
                                    <el-table-column label="型号" align="left" width="120px">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.matSeriesCode}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="名称" align="left" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.matSeriesName }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="材质" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.cx2Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="长度" align="right">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.cx4Name ? parseFloat(scope.row.cx4Name).toFixed(3):0.00 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="膜厚" align="right">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.cx3Name  }}</span>
                                    </template>
                                </el-table-column>

                                <el-table-column label="结算方式" align="center">
                                    <el-table-column label="代码" align="left" width="120px">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.settlementMethod}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="名称" align="left" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.settlementMethodName }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="备注" align="center">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.remark }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div v-if="showTable" style="margin-top: 10px;">
                                <CommonTable
                                    v-if="isResize"
                                    ref="tabTableIII"
                                    :isCenter="true"
                                    :isMulTable=true
                                    :otherVariable="otherVariable"
                                    :formTableData="tabDataIII"
                                    :formPropTable="tabPropIII"
                                    :tableHeight="tableHeightII"
                                >
                                </CommonTable>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </CommonDetailX>
        </div>
    </div>
</template>

<script>
    import CommonMixins from '$src/components/CommonMixins'
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    import CommonDetailX from '$src/components/CommonDetailX'
    export default {
        mixins: [CommonMixins],
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetailX
        },
        data() {
            return {
                mainHeight: 716,
                isResize: true,
                isShowNotAllowed:false,
                hanleNo:'',
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                tableHeightI: this.$store.state.screenHei*0.62,
                tableHeightII: 150,
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    popupTitle: '',
                    isMulSelect: true,
                    isInlineForm: true,
                    isEdit: false,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    loading: false,
                    $isCustom: true,
                    isSaving:false,

                },
                showTable: false,
                tempWidth: null,
                showButton:false,
                showUnAudit:false,
                tableData: [],
                //搜索映射表
                searchProp: [
                    {
                        name:'装车单',
                        prop:'refDocCode',
                        type:'date',
                        isMainSearch:true,
                        isMain:false,
                        placeholder: '请输入装车单号'
                    },
                    {
                        name:'装车价格状态',
                        prop:'tempStatus',
                        type:'selectChange',
                        selectList:[{value:1,label:'全部'},{value:2,label:'未审核'},{value:3,label:'已审核'}],
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
                    {name:'装车单号',prop:'docCode',type:'outter'},
                    {name:'装车日期',prop:'docDate',type:'outter'},
                    {name:'交货日期',prop:'docDate',type:'outter'},
                    {name:'单据状态',prop:'docStatusName',type:'outter'},
                    {name:'已审价',prop:'isCheckPrice',type:'outter',isCheck:true},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'经销商',prop:'clientCode2',type:'inner'},
                    {name:'合同号',prop:'contractCode',type:'inner'},
                    {name:'铝锭取价方式',prop:'alPriceMethodName',type:'inner'},
                    {name:'铝锭价',prop:'alPrice',type:'inner'},
                    {name:'销售公司',prop:'companyName',type:'inner'},
                    {name:'取价日期',prop:'alPriceDate',type:'inner'},
                    {name:'结算方式',prop:'settlementMethodName',type:'inner'},
                    {name:'铝价日期',prop:'alPriceDate',type:'inner'},
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
                        name1:'装车单号/',
                        prop1:'refDocCode',
                        name2:'状态',
                        prop2:'priceStatus',
                        type:'is_check_price',
                        width: '110'
                    },
                    {
                        name1:'工程号/',
                        prop1:'projectCode',
                        name2:'装车日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '120'
                    },
                    {
                        name1:'客户/',
                        prop1:'clientCode',
                        name2:'经销商',
                        prop2:'clientCode2',
                        type:'mixin',
                        width: '110'
                    },
                    {
                        name1:'送货地区/',
                        prop1:'destination',
                        name2:'提货方式',
                        prop2:'loaderMethodName',
                        type:'mixin',
                    }
                ],
                searchForm: {tempStatus: 2,minPriceStatus: 50,maxPriceStatus: 100},
                docStatus:'',
                detailForm: {},
                detailId: null,
                detailIdList: [],
                docCode: null,
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //详情表格内容
                tabLeft: '100px',
                activeName: 'first',
                //订单明细数据
                tabDataI: [],
                loadingI: false,
                tabPropIII: [
                    {prop:'itemNo', name:'序号',},
                    {prop:'priceItemText', name:'合同条款内容',type:'normal',width:'100'},
                    {
                        prop:'', name:'价格',
                        children:[
                            {prop:'otherPrice',name:'面积(元/m²)',type:'normal'},
                            {prop:'price',name:'重量(元/kg)',type:'normal'},

                        ]
                    },
                    {
                        prop:'', name:'价格组成',
                        children:[
                            {prop:'',name:'加工费'},
                            {prop:'',name:'运算费'},
                            {prop:'',name:'打托费'},
                            {prop:'',name:'附加费'},

                        ]
                    },
                    {
                        prop:'', name:'特批不收费',
                        children:[
                            {prop:'',name:'运输'},
                            {prop:'',name:'打托'},

                        ]
                    },
                ],
                tabDataIII:[]
            }
        },
        mounted() {
            this.getData();
            // 操作/布局相关
            this.listenResizeIII();
            this.changeSizeIII();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                if(this.searchForm.refDocCode) {
                    this.searchForm = {refDocCode:this.searchForm.refDocCode};
                    this.selectChange(1);
                }else {
                    this.searchForm.refDocCode = null;
                }
                this.tableData = [];
                this.fetch(`/oms/sls/LoaderDoc/getLoaderAndContractInfo?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
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
            selectChange(val) {
                if(val === 1) {
                    this.searchForm.minPriceStatus = 50;
                    this.searchForm.maxPriceStatus = 101;
                }else if(val === 2) {
                    this.searchForm.minPriceStatus = 50;
                    this.searchForm.maxPriceStatus = 100;
                }else if(val === 3) {
                    this.searchForm.minPriceStatus = 100;
                    this.searchForm.maxPriceStatus = 100;
                }
            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
            },
            handleReset(){
                this.searchForm = {tempStatus: 2,minPriceStatus: 50,maxPriceStatus: 100};
                this.handleRefresh();
            },
            //刷新
            handleRefresh() {
                this.getData();
                this.tabDataI = [];
                this.detailForm = {};
                this.showUnAudit = false;
                this.showButton = false;
            },
            //更改后的刷新
            changeRefresh() {
                this.getData(false);
                this.otherVariable.isChildEdit = false;
            },
            //点击主表行
            handleDetail(row) {
                this.isShowNotAllowed = true;
                this.loadingI = true;
                if(row.priceStatus === 0 || row.priceStatus === null || row.priceStatus === 50) {
                    this.showUnAudit = false;
                    this.showButton = true
                }else if(row.priceStatus === 100){
                    this.showUnAudit = true;
                    this.showButton = false
                }else {
                    this.showUnAudit = false;
                    this.showButton = false
                }
                this.detailForm = row;
                this.showTable = false;
                this.tabDataIII = [];
                this.detailId = row.fid;
                this.docStatus = row.docStatus;
                this.docCode = row.docCode;
                this.getDetailTable(row.fid)
            },
            //批量选择-审核
            handleSelectionChange(rows) {
                this.detailIdList = [];
                rows.forEach(item => {
                    this.detailIdList.push(item.fid)
                })
            },
            //获取从表价格明细
            getDetailTable(fid) {
                this.tabDataI = [];
                this.getAjax(`/oms/sls/SalesLoaderPriceController/getLoaderPrice?loaderFlowId=${fid}`)
                    .then(result => {
                        this.loadingI = false;
                        this.isShowNotAllowed = false;
                        if(result.status === 200 && result.data) {
                            this.tabDataI = result.data;
                        }else {
                            this.tabDataI = [];
                        }
                    })
            },
            //获取价格明细详情
            clickDetail(row) {
                this.tabDataIII = [];
                this.showTable = !this.showTable;
                if(this.showTable) {
                    this.isResize = false;
                    this.tableHeightI = this.tableHeightI - 150;
                    this.showTable = true;
                    this.$nextTick(() => {
                        this.isResize = true;
                    })
                }else {
                    this.tableHeightI = this.tableHeightI + 150;
                }
                //请求数据
                this.fetch('/oms/sls/SalesOrderPriceController/getMatPriceItem', {matPriceId:row.priceId})
                    .then(result => {
                        if (result.status === 200) {
                            this.tabDataIII = result.data.list;
                        }else {
                            this.tabDataIII = [];
                        }
                    })
                    .then(() => {
                        if(this.showTable) {
                            this.$refs['tabTableIII'].initStatus();
                        }
                    })
            },
            //审核
            handleAdudit(type) {
                if(this.detailIdList.length>0 && type ==='multi'){
                    this.hanleNo = this.detailIdList.length;

                }else{
                    this.hanleNo='';
                }
                this.$confirm('是否确认审核'+this.hanleNo+'条订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let tempObj,api;
                    let isBatch = false;
                    this.otherVariable.isSaving = true;
                    if(type === 'alone') {
                        isBatch = false;
                        tempObj = {loaderFlowId: this.detailId,checkPrice:1};
                        api = '/oms/sls/SalesLoaderPriceController/checkLoaderPriceInfo';
                    }else {
                        isBatch = true;
                        tempObj = {loaderFlowIds: this.detailIdList};
                        api = '/oms/sls/SalesLoaderPriceController/checkLoaderPriceInfoBatch';
                    }
                    if(isBatch && this.detailIdList.length || !isBatch) {
                        let resultStatus;
                        this.fetch(api,tempObj)
                            .then(result => {
                                resultStatus = result.status;
                                if(result.status === 200) {
                                    this.$message({
                                        message: result.data,
                                        type: 'success'
                                    });
                                    if(this.searchForm.tempStatus === 0 && !isBatch) {
                                        this.getData(false);
                                    }else {
                                        this.getData();
                                    }
                                }else {
                                    this.$message({
                                        message: result.data,
                                        type: 'warning'
                                    })
                                }
                            })
                            .then(() => {
                                this.otherVariable.isSaving = false;
                            })
                    }else {
                        this.$message({
                            message: '请勾选装车单',
                            type:'warning'
                        })
                    }

                })

            },
            //反审
            handleUnAudit() {
                let tempObj,api;
                this.otherVariable.isSaving = true;
                tempObj = {loaderFlowId: this.detailId};
                api = '/oms/sls/SalesLoaderPriceController/checkLoaderPriceInfo';
                let resultStatus;
                this.fetch(api,tempObj)
                    .then(result => {
                        resultStatus = result.status;
                        if(result.status === 200) {
                            this.$message({
                                message: result.data,
                                type: 'success'
                            });
                            this.searchForm.tempStatus === 0 ? this.getData(false) : this.getData();
                        }else {
                            this.$message({
                                message: result.data,
                                type: 'warning'
                            })
                        }
                    })
                    .then(() => {
                        this.otherVariable.isSaving = false;
                    })
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
    .exportCount {
        z-index: 99;
        position: absolute;
        right: 216px;
        bottom: 3px;
        transform: translateY(50%);
        cursor: pointer;
        border-radius: 50%;
        width: 55px;
        height: 55px;
        line-height: 55px;
        text-align: center;
        font-size: 18px;
        color: #fff;
        background: #FF7F00;
    }
    .exportText {
        z-index: 98;
        position: absolute;
        right: 169px;
        bottom: 3px;
        transform: translateY(50%);
        cursor: pointer;
        width: 61px;
        height: 33px;
        line-height: 33px;
        text-align: center;
        font-size: 15px;
        color: #fff;
        background: #FF7F00;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
    }
    .exportCount1 {
        z-index: 99;
        position: absolute;
        right: 99px;
        bottom: 3px;
        transform: translateY(50%);
        cursor: pointer;
        border-radius: 50%;
        width: 55px;
        height: 55px;
        line-height: 47px;
        text-align: center;
        font-size: 18px;
        color: #666;
        background-color: white;
        border: 1px solid #666;
    }
    .exportText1 {
        z-index: 98;
        position: absolute;
        right: 49px;
        bottom: 3px;
        transform: translateY(50%);
        cursor: pointer;
        width: 61px;
        height: 33px;
        line-height: 33px;
        text-align: center;
        font-size: 15px;
        color: #666;
        background-color: white;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
        border: 1px solid #666;
    }
</style>
