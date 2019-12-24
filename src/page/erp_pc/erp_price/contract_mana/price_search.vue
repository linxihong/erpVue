<template>
    <div class="common-table flex-column">
        <el-form :model="searchForm" :inline="true">
            <el-form-item  label="单据日期:" >
                <el-date-picker
                    v-model="searchForm.beginDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item  label="至" >
                <el-date-picker
                    v-model="searchForm.overDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="报价单号:" >
                <el-input
                    v-model.trim="searchForm.docCode"
                    class="search-input"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="状态" prop="tempStatus">
                <el-select v-model="searchForm.tempStatus" @change="selectChange">
                    <el-option
                        v-for="(item,index) in OrderList"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-button class="btn-cyan search-btn" @click="handleSearch">查询</el-button>
            <el-button class="search-more" @click="toggleSearch">
                <span>更多查询</span>
                <i class="el-icon--right" :class="showSearch?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
            </el-button>
            <el-button @click="handleRefresh">刷新</el-button>
            <el-button @click="handleReset">重置</el-button>
        </el-form>

        <el-table
            :data="orders"
            highlight-current-row
            style="width: 100%"
            :height="$store.state.screenHei*0.80"
            ref="moviesTable"
            @row-click="clickRow"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="index" width="40" align="center"></el-table-column>
            <el-table-column label="报价单号" width="120" align="center">
                <template slot-scope="scope">
                    <span @click="handleOrder(scope.$index,scope.row)" style="color: blue">{{scope.row.docCode}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="docStatusName" label="状态" :show-overflow-tooltip="true" align="center" width="70"></el-table-column>
            <el-table-column prop="offerType" label="报价类型" :show-overflow-tooltip="true" align="center" width="100"></el-table-column>
            <el-table-column prop="docDate" label="报价日期" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>
            <el-table-column prop="clientCode2" label="经销商" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="clientCode" label="客户" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="projectName" label="工程" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="salesName" label="业务员" :show-overflow-tooltip="true" align="center" width="70"></el-table-column>

            <el-table-column  label="录入" align="center">
                <el-table-column align="center" prop="enterName" label="人员" :show-overflow-tooltip="true" width="70"></el-table-column>
                <el-table-column align="center" prop="enterTime" label="日期" :show-overflow-tooltip="true" width="140"></el-table-column>
            </el-table-column>
            <el-table-column  label="审核" align="center">
                <el-table-column align="center" prop="postName" label="人员" :show-overflow-tooltip="true" width="70"></el-table-column>
                <el-table-column align="center" prop="postTime" label="日期" :show-overflow-tooltip="true" width="140"></el-table-column>
            </el-table-column>
        </el-table>

        <!--分页区域-->
        <CommonPagination
            :pageObj="pageObj"
            @getData="getData"
        ></CommonPagination>

        <!--订单详情界面-->
        <!-- 编辑界面 -->
        <el-dialog :visible.sync="editFormVisible" class="orderdialog" fullscreen :modal="false">
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-row :gutter="20">
                        <el-col :span="5" style="margin: 5px"><span>报价单号:{{editForm.docCode}}</span></el-col>
                        <el-col :span="5" style="margin: 5px"><span>报价日期:{{editForm.docDate}}</span></el-col>
                        <el-col :span="5" style="margin: 5px"><span>状态: {{editForm.docStatus}}</span></el-col>
                        <el-col :span="5" style="margin: 5px"><span>客户:{{editForm.clientCode}}</span></el-col>
                        <el-col :span="5" style="margin: 5px"><span>经销商:{{editForm.clientCode2}}</span></el-col>
                        <el-col :span="5" style="margin: 5px"><span>区域:{{editForm.regionName}}</span></el-col>
                        <br>
                        <el-col :span="24" style="margin: 5px"><span>备注:{{editForm.remark}}</span></el-col>
                    </el-row>
                </el-col>
            </el-row>
            <!--tab区域-->
            <div class="tab-wrap">
                <!--<el-button v-if="false" class="print-btn btn-cyan search-btn" @click="handlePrint">打印</el-button>-->
                <el-tabs  class="common-content-tab order_style">
                    <el-tab-pane label="报价明细" >
                        <!--<el-table-->
                            <!--:span-method="objectSpanMethod"-->
                            <!--tooltip-effect="dark"-->
                            <!--:data="tabDataI"-->
                            <!--border-->
                            <!--highlight-current-row-->
                        <!--&gt;-->
                            <!--<el-table-column label="价格类型"  align="right" >-->
                                <!--<template slot-scope="scope">-->
                                    <!--<span>{{ scope.row.priceType=='1'?'铝加工费':scope.row.priceType=='2'?'表面加工费':'隔热条加工费'}}</span>-->
                                <!--</template>-->
                            <!--</el-table-column>-->

                            <!--<el-table-column label="报价项目">-->
                                <!--<el-table-column label="代码"  :show-overflow-tooltip="true">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.itemCode }}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="名称"  :show-overflow-tooltip="true">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.itemName }}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                            <!--</el-table-column>-->
                            <!--<el-table-column label="项目类型"  align="right" width="130">-->
                                <!--<template slot-scope="scope">-->
                                    <!--<span>{{ scope.row.itemTypeName}}</span>-->
                                <!--</template>-->
                            <!--</el-table-column>-->
                            <!--<el-table-column label="材质"  align="right" width="130">-->
                                <!--<template slot-scope="scope">-->
                                    <!--<span>{{ scope.row.cx2Name }}</span>-->
                                <!--</template>-->
                            <!--</el-table-column>-->
                            <!--<el-table-column label="涂层"  align="right" width="130">-->
                                <!--<template slot-scope="scope">-->
                                    <!--<span>{{ scope.row.cx6Name }}</span>-->
                                <!--</template>-->
                            <!--</el-table-column>-->
                            <!--<el-table-column label="价格(元)"  align="right" width="130">-->
                                <!--<template slot-scope="scope">-->
                                    <!--<span>{{ scope.row.price}}</span>-->
                                <!--</template>-->
                            <!--</el-table-column>-->
                            <!--<el-table-column label="单位"  align="right" width="130">-->
                                <!--<template slot-scope="scope">-->
                                    <!--<span>{{ scope.row.uom }}</span>-->
                                <!--</template>-->
                            <!--</el-table-column>-->
                            <!--<el-table-column label="备注"  align="right" width="130">-->
                                <!--<template slot-scope="scope">-->
                                    <!--<span>{{ scope.row.remark }}</span>-->
                                <!--</template>-->
                            <!--</el-table-column>-->
                        <!--</el-table>-->
                        <el-table
                            :data="tabDataI"
                            tooltip-effect="dark"
                            :span-method="objectSpanMethod"
                            highlight-current-row
                            border
                            >
                            <el-table-column label="价格类型"  align="center" width="120">
                            <template slot-scope="scope">
                            <span>{{ scope.row.priceType=='1'?'铝加工费':scope.row.priceType=='2'?'表面加工费':'隔热条加工费'}}</span>
                            </template>
                            </el-table-column>

                            <el-table-column label="报价项目" align="center">
                            <el-table-column label="代码"  :show-overflow-tooltip="true" align="left" width="120">
                            <template slot-scope="scope">
                            <span>{{ scope.row.itemCode }}</span>
                            </template>
                            </el-table-column>
                            <el-table-column label="名称"  :show-overflow-tooltip="true" align="left" width="120">
                            <template slot-scope="scope">
                            <span>{{ scope.row.itemName }}</span>
                            </template>
                            </el-table-column>
                            </el-table-column>
                            <el-table-column label="项目类型"  align="left" width="130">
                            <template slot-scope="scope" >
                            <span >{{ scope.row.itemTypeName}}</span>
                            </template>
                            </el-table-column>
                            <el-table-column label="材质"  align="left" width="100">
                            <template slot-scope="scope">
                            <span>{{ scope.row.cx2Name }}</span>
                            </template>
                            </el-table-column>
                            <el-table-column label="涂层"  align="left" width="130">
                            <template slot-scope="scope">
                            <span>{{ scope.row.cx6Name }}</span>
                            </template>
                            </el-table-column>
                            <el-table-column label="价格(元)"  align="right" width="130">
                            <template slot-scope="scope">
                            <span>{{ scope.row.price}}</span>
                            </template>
                            </el-table-column>
                            <el-table-column label="单位"  align="left" width="130">
                            <template slot-scope="scope">
                            <span>{{ scope.row.uom }}</span>
                            </template>
                            </el-table-column>
                            <el-table-column label="备注"  align="right" width="130">
                            <template slot-scope="scope">
                            <span>{{ scope.row.remark }}</span>
                            </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>

                </el-tabs>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    export default {
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination
        },
        data() {
            return {
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                otherVariable: {
                    isReadTable: true,
                    isMulSelect:true,
                },
                showOverflowTooltip:true,
                isMulSelect:true,
                isNotMulSelect:true,
                editFormVisible:false,
                showSearch:false,
                showSearchInput:false,
                currentRow: null,
                orderId: null,
                flowId: null,
                copyDataI: [],
                spanArr: [],
                position: 0,
                //订单明细数据
                tabDataI: [],
                //分页
                pageObj: {
                    className: 'custom-pagination',
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
                orders:[],
                tableData6: [{
                    id: '12987122',
                    name: '王小虎',
                    amount1: '234',
                    amount2: '3.2',
                    amount3: 10
                }, {
                    id: '12987123',
                    name: '王小虎',
                    amount1: '165',
                    amount2: '4.43',
                    amount3: 12
                }, {
                    id: '12987124',
                    name: '王小虎',
                    amount1: '324',
                    amount2: '1.9',
                    amount3: 9
                }, {
                    id: '12987125',
                    name: '王小虎',
                    amount1: '621',
                    amount2: '2.2',
                    amount3: 17
                }, {
                    id: '12987126',
                    name: '王小虎',
                    amount1: '539',
                    amount2: '4.1',
                    amount3: 15
                }],
                ordersDatilList:[],
                editForm:{},
                //订单状态
                OrderList:[
                    {value:1,label:'全部'},{value:2,label:'已确认'},{value:3,label:'已审核'},
                ],
                ledgerList:[],
                //搜索映射表
                searchProp: [
                    {
                        name:'订单号',
                        prop:'docCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder: '请输入订单号'
                    },
                ],
                //表格映射列表
                tableProp: [

                    {prop:'refDocCode', name:'订单编号',type:'normal',align:'left',fixed:'left' },
                    {prop:'itemNo', name:'订单进度',
                        children:[
                            {prop:'',name:'配套率',type:'normal',align:'right'},
                            {prop:'',name:'单据状态',type:'normal',align:'right'},

                        ]

                    },
                    {prop:'', name:'单据类型',type:'normal',align:'left'},
                    {prop:'', name:'单据日期',type:'normal',align:'left'},
                    {prop:'', name:'交货日期',type:'normal',align:'left'},
                    {prop:'', name:'经销商代码',type:'normal',align:'right'},
                    {prop:'', name:'客户代码',type:'normal',align:'right'},
                    {prop:'', name:'工程名称',type:'normal',align:'right'},
                    {prop:'', name:'货期类型',type:'normal',align:'right'},
                    {prop:'', name:'生产基地代码',type:'normal',align:'right'},
                    {prop:'', name:'跟单员姓名',type:'normal',align:'right'},

                    {
                        prop:'', name:'包装方式',
                        children:[
                            {prop:'',name:'代码',type:'normal',align:'right'},
                            {prop:'',name:'名称',type:'normal',align:'right'},
                        ]
                    },
                    {
                        prop:'', name:'录入',
                        children:[
                            {prop:'',name:'人员',type:'normal',align:'right'},
                            {prop:'',name:'日期',type:'normal',align:'right'},

                        ]
                    },
                    {
                        prop:'', name:'签批',
                        children:[
                            {prop:'',name:'人员',type:'normal',align:'right'},
                            {prop:'',name:'日期',type:'normal',align:'right'},

                        ]
                    },
                    {
                        prop:'', name:'审核',
                        children:[
                            {prop:'',name:'人员',type:'normal',align:'right'},
                            {prop:'',name:'日期',type:'normal',align:'right'},

                        ]
                    },
                ],
                searchForm: {
                    maxDocStatus:101,
                    minDocStatus:0,

                },
                tableData: [],
            }
        },
        mounted() {
            this.getData();
            this. getledgerList();
            this.rowspan();
        },
        methods: {
            getData() {
                this.orders=[];
                this.fetch(`/oms/sls/OfferPrice/getOfferPriceMaster?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data) {
                            this.orders = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })

            },
            handleRefresh() {
                this.getData();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },
            handleReset() {
                this.searchForm = {};
                this.handleRefresh();
            },
            handleSearch() {
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.pageObj.commonTotal = 0;
                this.getData();
            },
            handlePrint() {
                let isReturn = false;
                let resultUrl = '';
                this.getAjax(`/oms/PrintController/isPrint?fId=${this.flowId}`)
                    .then(result => {
                        if(result.status === 200) {
                            isReturn = true;
                            resultUrl = result.data;
                        }else {
                            isReturn = false;
                            this.$message({
                                type:'error',
                                message: result.error
                            })
                        }
                    })
                    .then(() => {
                        if(isReturn) {
                            window.open(resultUrl);
                        }
                    })
            },
            //更多查询
            toggleSearch(){
                this.showSearchInput=!this.showSearchInput;
                this.showSearch = !this.showSearch;
            },

            //订单编号点击
            handleOrder(index,row){
                this.editForm = row;
                this.editFormVisible=true;
                this.ordersDatilList=[];
                this.$refs.moviesTable.setCurrentRow(row);
                this.getDialog();
            },
            selectChange(val) {
                if(val === 1) {
                    this.searchForm.minDocStatus = 0;
                    this.searchForm.maxDocStatus = 101;
                }else if(val === 2) {
                    this.searchForm.minDocStatus = 50;
                    this.searchForm.maxDocStatus = 50;
                }else if(val === 3) {
                    this.searchForm.minDocStatus = 100;
                    this.searchForm.maxDocStatus = 100;
                }
            },

            //弹框接口
            getDialog() {
                console.log('1111',this.editForm.fid);
                this.orderId = this.editForm.fid;
                this.flowId = this.editForm.flowId;
                this.getAjax('/oms/sls/OfferPrice/getOfferPriceDetailListByMasterId?pageSize=1000&masterId='+this.editForm.fid)
                    .then(result => {
                        if(result.data) {
                            this.tabDataI = result.data.list;
                            this.pageDialog.commonTotal = result.data.total;
                        }else {
                            this.pageDialog.commonTotal = 0;
                        }
                    })
            },
            clickRow(row){
                this.editForm = row;
                this.editFormVisible=true;
                this.ordersDatilList=[];
                this.$refs.moviesTable.setCurrentRow(row);
                this.getDialog();
                this.$refs.moviesTable.toggleRowSelection(row);
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
//            objectSpanMethod({ row, column, rowIndex, columnIndex }) {  //表格合并行
//                if (columnIndex === 0) {
//                    const _row = this.spanArr[rowIndex];
//                    const _col = _row>0 ? 1 : 0;
//                    return {
//                        rowspan: _row,
//                        colspan: _col
//                    }
//                }
//            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if (rowIndex % 2 === 0) {
                        return {
                            rowspan: 2,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },

            //获取订单状态
//            getdocType() {
//                this.OrderList = [];
//                this.getAjax(`/basedata/sys/DataDictionary/getDataDictionary?docCode=${30127}`)
//                    .then(result => {
//                        if(result.data) {
//                            this.OrderList = result.data;
//                        }else {
//                            this.OrderList = [];
//                        }
//                    })
//            },



            //获取订单进度状态
            getledgerList(){
                this.ledgerList = [];
                this.getAjax(`/basedata/sys/DataDictionary/getDataDictionary?docCode=${30128}`)
                    .then(result => {
                        if(result.data) {
                            this.ledgerList = result.data;
                            // console.log(this.ledgerList)
                        }else {
                            this.ledgerList = [];
                        }
                    })

            }
        }
    }
</script>
<style>
    .searchInput{
        width: 10%;
    }
    .orderdialog .el-dialog{
        margin-top: 0vh !important;
        width: 91%;
        height: 100%;
        margin-left: 8.6%;
    }
    .el-table_2_column_30  .cell{
        text-align: center;
    }

    .common-table {
        padding: 10px;
        /* display: flex; */
        height: 100%;
    }
    .common-table.flex-column {
        flex-direction: column;
    }
    .tab-wrap {
        position: relative;
    }
    .print-btn {
        z-index: 100;
        position: absolute;
        left: 130px;
        top: 6px;
    }
</style>
