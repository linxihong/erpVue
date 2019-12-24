<template>
    <div class="common-table flex-column">
        <el-form :model="searchForm" :inline="true"  @submit.native.prevent @keyup.enter.native="getData">
            <el-form-item  label="单据日期:" >
                <el-date-picker
                    v-model="searchForm.orderDocDateStart"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item  label="至" >
                <el-date-picker
                    v-model="searchForm.orderDocDateEnd"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="订单编号:" >
                <el-input
                    v-model.trim="searchForm.orderDocCode"
                    width="70"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="变更单号:" >
                <el-input
                    v-model.trim="searchForm.orderChangeCode"
                    width="70"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="变更状态" prop="docStatus">
                <el-select v-model="searchForm.docStatus"  >
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
            @selection-change="handleSelectionChange"
        >
            <el-table-column  type="index" width="55"></el-table-column>
            <el-table-column label="变更单号" width="120" align="center">
                <template slot-scope="scope">
                    <span @click="handleOrder(scope.$index,scope.row)" style="color: blue">{{scope.row.orderChangeCode}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="orderDocCode" label="订单编号" :show-overflow-tooltip="true"  align="center"></el-table-column>
            <el-table-column prop="docStatus" label="变更状态" :show-overflow-tooltip="true" align="center" width="90">
                <template slot-scope="scope">
                    <span>{{scope.row.docStatus == 0?'制单中':scope.row.docStatus==50?"已提交":scope.row.docStatus==90?'转办生产':scope.row.docStatus==100?'已生效':scope.row.docStatus==120?'已受理':scope.row.docStatus==140?'已签批':''}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sellType" label="订单类型" :show-overflow-tooltip="true" align="center" width="90">
                <template slot-scope="scope">
                    <span>{{scope.row.sellType == 1?'国内':scope.row.sellType==2?"出口":""}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="docDate" label="变更日期" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>
            <el-table-column prop="clientCode2" label="经销商"   width="120" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="clientCode" label="客户"  :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="projectName" label="工程名称" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="orderNewDeliveryLevelName" label="货期类型"  :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="supplyCompanyName" label="生产基地" width="120"   :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="followName" label="跟单员姓名"   width="120"  :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column  label="包装方式" align="center" >
                <el-table-column prop="packMethodCode" label="代码" :show-overflow-tooltip="true" align="center"></el-table-column>
                <el-table-column prop="packMethodName" label="名称" :show-overflow-tooltip="true" align="center"></el-table-column>
            </el-table-column>
            <el-table-column  label="录入"  align="center">
                <el-table-column prop="enterName" label="人员" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="enterTime" label="日期" :show-overflow-tooltip="true" width="100"></el-table-column>
            </el-table-column>
            <el-table-column  label="审批"  align="center">
                <el-table-column prop="postName" label="人员" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="postTime" label="日期" :show-overflow-tooltip="true" width="100"></el-table-column>
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
                <el-col :span="24">
                    <el-row :gutter="20">
                        <el-col :span="4" style="margin: 5px"><span>变更单号：{{editForm.orderChangeCode}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>变单日期：{{editForm.docDate}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>订单号：{{editForm.orderDocCode}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>订单类型：{{editForm.sellType == 1?'国内':editForm.sellType==2?"出口":""}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>变更状态：{{editForm.docStatus == 0?'制单中':editForm.docStatus==50?"已提交":editForm.docStatus==90?'转办生产':editForm.docStatus==100?'已生效':editForm.docStatus==120?'已受理':editForm.docStatus==140?'已签批':''}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>交货天数：{{editForm.orderOldDeliveryDays}} <span v-if="editForm.orderOldDeliveryDays!= editForm.orderNewDeliveryDays && editForm.orderNewDeliveryDays!=null"> -> {{editForm.orderNewDeliveryDays}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>货期类型：{{editForm.orderOldDeliveryLevelName}} <span v-if="editForm.orderOldDeliveryLevelName != editForm.orderNewDeliveryLevelName && editForm.orderNewDeliveryLevelName!=null"> -> {{editForm.orderNewDeliveryLevelName}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>单据类型：{{editForm.orderOldDocType}} <span v-if="editForm.orderOldDocType != editForm.orderNewDocType && editForm.orderNewDocType!=null"> -> {{editForm.orderNewDocType}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>包装方式：{{editForm.orderOldPackMethodName}} <span v-if="editForm.orderOldPackMethodName != editForm.orderNewPackMethodName &&editForm.orderNewPackMethodName!=null"> -> {{editForm.orderNewPackMethodName}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>贴膜方式：{{editForm.orderOldPadPastingMethodName}} <span v-if="editForm.orderOldPadPastingMethodName != editForm.orderNewPadPastingMethodName &&editForm.orderNewPadPastingMethodName!=null"> -> {{editForm.orderNewPadPastingMethodName}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>提货方式	：{{editForm.orderOldLoaderMethodName}} <span v-if="editForm.orderOldLoaderMethodName != editForm.orderNewLoaderMethodName &&editForm.orderNewLoaderMethodName!=null"> -> {{editForm.orderNewLoaderMethodName}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>生产方式	：{{editForm.orderOldPackMethodName}} <span v-if="editForm.orderOldPackMethodName != editForm.orderNewPackMethodName &&editForm.orderNewPackMethodName!=null"> -> {{editForm.orderNewPackMethodName}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>生产基地	：{{editForm.orderOldPackMethodName}} <span v-if="editForm.orderOldPackMethodName != editForm.orderNewPackMethodName &&editForm.orderNewPackMethodName!=null"> -> {{editForm.orderNewPackMethodName}}</span></span></el-col>

                        <el-col :span="4" style="margin: 5px"><span>客户：{{editForm.orderOldClientCode}} <span v-if="editForm.orderOldClientCode != editForm.orderNewClientCode && editForm.orderNewClientCode !=null"> -> {{editForm.orderNewClientCode}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>客户标签1：{{editForm.orderOldUsrLabelText1}} <span v-if="editForm.orderOldUsrLabelText1 != editForm.orderNewUsrLabelText1 &&editForm.orderNewUsrLabelText1!=null"> -> {{editForm.orderNewUsrLabelText1}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>客户标签2：{{editForm.orderOldUsrLabelText2}} <span v-if="editForm.orderOldUsrLabelText2 != editForm.orderNewUsrLabelText2 &&editForm.orderNewUsrLabelText2!=null"> -> {{editForm.orderNewUsrLabelText2}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>支数上限：{{editForm.orderOldDigitUpperRate}} <span v-if="editForm.orderOldDigitUpperRate != editForm.orderNewDigitUpperRate &&editForm.orderNewDigitUpperRate!=null"> -> {{editForm.orderNewDigitUpperRate}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>支数下限：{{editForm.orderOldDigitLowerRate}} <span v-if="editForm.orderOldDigitLowerRate != editForm.orderNewDigitLowerRate &&editForm.orderNewDigitLowerRate!=null"> -> {{editForm.orderNewDigitLowerRate}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>开票类型：{{editForm.orderOldVatTypeName}} <span v-if="editForm.orderOldVatTypeName != editForm.orderNewVatTypeName &&editForm.orderNewVatTypeName!=null"> -> {{editForm.orderNewVatTypeName}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>理重发货：{{editForm.orderOldIsTheory=='1'?'是':editForm.orderOldIsTheory=='0'?'否':''}} <span v-if="editForm.orderOldIsTheory != editForm.orderNewIsTheory &&editForm.orderNewIsTheory!=null"> -> {{editForm.orderNewIsTheory=='1'?'是':editForm.orderNewIsTheory=='0'?'否':''}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>据挂痕：{{editForm.orderOldIsSawTrace=='1'?'是':editForm.orderOldIsSawTrace=='0'?'否':''}} <span v-if="editForm.orderNewIsSawTrace != editForm.orderNewIsSawTrace &&editForm.orderNewIsSawTrace!=null"> -> {{editForm.orderNewIsSawTrace=='1'?'是':editForm.orderNewIsSawTrace=='0'?'否':''}}</span></span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>是否打捆发货：{{editForm.orderOldIsBundley=='1'?'是':editForm.orderOldIsBundley=='0'?'否':''}} <span v-if="editForm.orderOldIsBundle != editForm.orderNewIsBundle &&editForm.orderNewIsBundle!=null"> -> {{editForm.orderNewIsBundle=='1'?'是':editForm.orderNewIsBundle=='0'?'否':''}}</span></span></el-col>

                        <br>
                        <el-col :span="13" style="margin: 5px"><span>工程名称：{{editForm.orderOldProjectName}} <span v-if="editForm.orderOldProjectName != editForm.orderNewProjectName && editForm.orderNewProjectName!=null"> -> {{editForm.orderNewProjectName}}</span></span></el-col>
                        <br>
                        <el-col :span="24" style="margin: 5px"><span style="overflow:hidden; text-overflow:ellipsis;white-space:nowrap; ">备注：{{editForm.orderOldRemark}} <span v-if="editForm.orderOldRemark != editForm.orderNewRemark && editForm.orderNewRemark!=null"> -> {{editForm.orderNewRemark}}</span></span></el-col>

                        <br>
                        <el-col :span="24" style="margin: 5px"><span>拒批理由：{{editForm.refuseReason}}</span></el-col>
                    </el-row>
                </el-col>
            </el-row>
            <!--tab区域-->
            <div class="tab-wrap">
                <el-tabs  class="common-content-tab">
                    <el-tab-pane  >
                        <el-table
                            :data="ordersDatilList"
                            heihlight-current-row
                            :height="$store.state.screenHei*0.60"
                            border
                        >
                            <el-table-column prop="changeText" label="变更请求内容" fixed="left"  width="200" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="" label="型材"  >
                                <el-table-column prop="matCode" label="型号" align="left" :show-overflow-tooltip="true" width="55"></el-table-column>
                                <el-table-column prop="matName" label="名称" align="left" :show-overflow-tooltip="true" width="55"></el-table-column>
                            </el-table-column>
                            <el-table-column  label="颜色"  >
                                <el-table-column prop="cx1Code" label="代码" align="left" :show-overflow-tooltip="true" width="55"></el-table-column>
                                <el-table-column prop="cx1Name" label="名称" align="left" :show-overflow-tooltip="true" width="55"></el-table-column>
                            </el-table-column>
                            <el-table-column prop="cx2Name" label="材质"  :show-overflow-tooltip="true" align="left" width="80"></el-table-column>
                            <el-table-column prop="cx4Name" label="长度"  :show-overflow-tooltip="true" align="right" width="70"></el-table-column>
                            <el-table-column prop="cx3Name" label="膜厚"  :show-overflow-tooltip="true" align="right" width="70"></el-table-column>
                            <el-table-column prop="digit" label="订单数"  :show-overflow-tooltip="true" align="right" width="70"></el-table-column>
                            <el-table-column prop="meterWght" label="米重"  :show-overflow-tooltip="true" align="right" width="70"></el-table-column>
                            <el-table-column prop="unitWght" label="支重"  :show-overflow-tooltip="true" align="right" width="70"></el-table-column>
                            <el-table-column prop="theoryWght" label="理论总重"  :show-overflow-tooltip="true" align="right" width="70"></el-table-column>
                            <el-table-column prop="unitSqm" label="单支方数"  :show-overflow-tooltip="true" align="right" width="70"></el-table-column>
                            <el-table-column  label="生产要求"  align="center">
                                <el-table-column prop="usrTxt1Name" label="喷码" align="left" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="usrTxt2Name" label="禁喷类型" align="left" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column label="撕筋" width="55px" align="center">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.usrTxt3Name === 'true' ? '✔' : '' }}</span>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column prop="usrTxt6Name" label="胶条规格"  :show-overflow-tooltip="true" align="right"></el-table-column>
                            <el-table-column prop="remark" label="备注"  :show-overflow-tooltip="true" align="left"></el-table-column>
                            <el-table-column prop="isRefuse" label="拒批"  :show-overflow-tooltip="true" align="left"></el-table-column>
                            <el-table-column prop="refuseReason" label="拒批理由"  :show-overflow-tooltip="true"  align="left"></el-table-column>
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
                tableHeaderColor: {
                    'background-color':'#f5f7fa'
                },
                checked:true,
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
                activeName: 'first',
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
                ordersDatilList:[],
                //仓库进度
                ordersSatiList:[],
                ordersChandList:[],
                editForm:{},
                //订单状态
                OrderList:[
                    {
                        value: 0,
                        label: '制单中'
                    },
                    {
                        value: 50,
                        label: '已提交'
                    },
                    {
                        value: 90,
                        label: '转办生产'
                    },
                    {
                        value: 100,
                        label: '已生效'
                    },
                    {
                        value: 120,
                        label: '已受理'
                    },
                    {
                        value: 140,
                        label: '已签批'
                    },
                    {
                        value: '',
                        label: '全部'
                    },
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
//                    isCancel:0,isClose:0

                },
                tableData: [],
            }
        },
        mounted() {
            this.getData();

            this. getledgerList();
        },
        methods: {
            getData() {
                this.orders=[];
                this.fetch(`/oms/sls/SalesOrderChange/getChangeMasterFlow?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
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
                this.searchForm = {isCancel:0,isClose:0};
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
                this.getState();
                this.getChande();
            },

            //弹框接口
            getDialog() {
                this.orderId = this.editForm.fid;
                this.getAjax('/oms/sls/SalesOrderChange/getOrderChangeDetail?pageNo=1&pageSize=12&orderChangeMasterId='+this.orderId)
                    .then(result => {
                        if(result.data) {
                            this.ordersDatilList = result.data.list;
                            this.pageDialog.commonTotal = result.data.total;
                        }else {
                            this.pageDialog.commonTotal = 0;
                        }
                    })
            },
            //仓库
            getState(){
                this.orderId = this.editForm.fId;
                this.flowId = this.editForm.flowId;
                this.fetch(`/oms/sls/OrderSchedule/getOrderScheduleStockDetail?pageNo=${this.pageDialog.commonPage}&pageSize=1000`,{fId: this.orderId})
                    .then(result => {
                        if(result.data) {
                            this.ordersSatiList = result.data;

                            this.pageDialog.commonTotal = result.data.total;
                        }else {
                            this.pageDialog.commonTotal = 0;
                        }
                    })

            },
            //变更
            getChande(){
                this.orderId = this.editForm.fId;
                this.flowId = this.editForm.flowId;
                this.fetch(`/oms/sls/SalesOrderChange/getChangeHistory?pageNo=${this.pageDialog.commonPage}&pageSize=1000`,{orderId :this.orderId})
                    .then(result => {

                        if(result.data) {
                            this.ordersChandList = result.data.list;

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





            //获取订单进度状态
            getledgerList(){
                this.ledgerList = [];
                this.getAjax(`/basedata/sys/DataDictionary/getDataDictionary?docCode=${30128}`)
                    .then(result => {
                        if(result.data) {
                            this.ledgerList = result.data;
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
