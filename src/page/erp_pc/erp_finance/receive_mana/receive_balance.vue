<template>
    <div class="common-wrap flex-column">
        <div style="display: flex;flex-direction: row;justify-content: space-between;margin: 0 26px;">
            <el-form :model="searchForm" ref="searchForm" :rules="mainRules" :inline="true" @submit.native.prevent @keyup.enter.native="getSearchList">
                <el-form-item  label="制单日期:" prop="beginDate" >
                    <el-date-picker
                        v-model="searchForm.beginDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item  label=""  prop="overDate" >
                    <el-date-picker
                        v-model="searchForm.overDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="经销商:" >
                    <el-input
                        v-model.trim="searchForm.clientCompanCode"
                        style="width: 250px"
                    >
                    </el-input>
                </el-form-item>

            </el-form>
            <div>
                <el-button class="btn-cyan search-btn" @click="getSearchList">查询</el-button>
                <!--<el-button class="search-more" >-->
                <!--<span>更多查询</span>-->
                <!--<i class="el-icon&#45;&#45;right" :class="showSearch?'el-icon-arrow-up':'el-icon-arrow-down'"></i>-->
                <!--</el-button>-->
                <el-button @click="handleRefresh">刷新</el-button>
                <el-button @click="pushExsh" >导出</el-button>
                <!--<el-button >打印</el-button>-->
            </div>
        </div>

        <el-table
            :data="tableData"
            v-loading="loading"
            highlight-current-row
            border
            :height="$store.state.screenHei*0.60"
            ref="moviesTable"
            @selection-change="handleSelectionChange"
            tooltip-effect="dark"
            class="main-table"
            :header-cell-style="tableHeaderColor"
        >
            <el-table-column label="经销商" align="center">
                <el-table-column label="代码" align="left" width="120px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.clientCompanCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="名称" align="left" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <!--<span v-if="scope.row.isLocked !== 1 && scope.row.isCheck !== 1">{{ scope.row.contractPrice?parseFloat(scope.row.contractPrice).toFixed(3):'' }}</span>-->
                        <span class="num-cell-r">{{ scope.row.clientCompanName}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column prop="initialBalanceMoney" label="期初结余金额" width="200px" :show-overflow-tooltip="false" align="right"></el-table-column>

            <el-table-column label="本期" align="center">
                <el-table-column label="提货支数"  align="right" width="150px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.digit}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="提货重量" width="150px" align="right" >
                    <template slot-scope="scope">
                        <!--<span v-if="scope.row.isLocked !== 1 && scope.row.isCheck !== 1">{{ scope.row.contractPrice?parseFloat(scope.row.contractPrice).toFixed(3):'' }}</span>-->
                        <span class="num-cell-r">{{ scope.row.weight}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="应付金额" width="150px" align="right" >
                    <template slot-scope="scope">
                        <!--<span v-if="scope.row.isLocked !== 1 && scope.row.isCheck !== 1">{{ scope.row.contractPrice?parseFloat(scope.row.contractPrice).toFixed(3):'' }}</span>-->
                        <span class="num-cell-r">{{ scope.row.receivableMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="已付金额" align="right" width="150px" >
                    <template slot-scope="scope">
                        <!--<span v-if="scope.row.isLocked !== 1 && scope.row.isCheck !== 1">{{ scope.row.contractPrice?parseFloat(scope.row.contractPrice).toFixed(3):'' }}</span>-->
                        <span class="num-cell-r">{{ scope.row.receivedMoney}}</span>
                    </template>
                </el-table-column>
            </el-table-column>

            <el-table-column prop="endBalanceMoney" label="期末结余金额" width="200px" :show-overflow-tooltip="false" align="right"></el-table-column>


        </el-table>
        <!--分页区域-->
        <CommonPagination style="flex: 1;"
                          :pageObj="pageObj"
                          @getData="getData"
        ></CommonPagination>


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
        props: {
            'isHasEnterprise': {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                loading: true,
                tableHeaderColor: {
                    'background-color':'#f5f7fa'
                },
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                otherVariable: {
                    isReadTable: true
                },
                //分页
                pageObj: {
                    className: 'custom-pagination',
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                allTheroyWght:'',
                allDigit:'',
                navs:this.$store.getters.getSideNavlist||[],
                sideValue: sessionStorage.getItem('sideValue')!==undefined?parseInt(sessionStorage.getItem('sideValue')):0,
                sysNav: [],
                mainRules:{
                    beginDate:[
                        {required: true, message: '请输入制单日期', trigger: 'blur'}
                    ],
                    overDate:[
                        {required: true, message: '请输入制单日期', trigger: 'blur'}
                    ]
                },
                //搜索映射表
                searchProp: [
                    {
                        name:'订单号',
                        prop:'refDocCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder: '请输入订单号'
                    },
                ],
                //表格映射列表
                tableProp: [
                    {prop:'clientCode2', name:'经销商代码',type:'normal',align:'left',width:'130'},
                    {prop:'clientName2', name:'经销商名称',type:'normal',align:'left',width:'130'},
                    {prop:'companyName', name:'销售公司',type:'normal',align:'left',isShort:true},
                    {prop:'projectName', name:'工程名称',type:'normal',align:'left'},
                    {prop:'cx2', name:'仓库',type:'normal',align:'left',isShort:true},
                    {prop:'digit', name:'支数',type:'normal',align:'right',isShort:true},
                    {prop:'theroyWght',name:'重量',type:'normal',align:'left'},
                ],
                searchForm: {
                    upBalanceDate:this.recentDate(-30),
                    overDate:this.recentDate(0),
                    beginDate:this.recentDate(-30),
                },
                tableData: [],
            }
        },
        mounted() {
            this.sysNav = this.navs[this.sideValue].children;
            this.getData();
        },
        methods: {
            getData() {
                this.fetch(`/oms/FinancialManager/selectReceivableBalance?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`, this.searchForm)
                    .then(result => {
                        if (result.data) {
                            this.loading=false;
                            this.tableData = result.data.list;

                            this.pageObj.commonTotal = result.data.total;
                        } else {
                            this.tableData="";
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },

            getSearchList() {
                this.$refs.searchForm.validate((valid)=>{
                    if(valid){
                        this.Exsh=true;
                        this.searchForm.upBalanceDate=this.searchForm.beginDate;
                        this.pageObj.commonPage=1;
                        this.pageObj.commonSize=10;
                        this.getData();
                    }else{
                        this.Exsh=false;
                    }
                })
            },
            handleRefresh() {
                this.searchForm={};
                this.getData();

            },
            handleCheck() {
                if (!this.isHasEnterprise) {
                    this.searchForm.clientPortal = true;
                } else {
                    this.searchForm = {};
                }
                this.getData();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },
            pushExsh() {
                this.fetch(`/oms/FinancialManager/exportReceivableBalanceInfoExcel`, this.searchForm, {responseType: 'blob'})
                    .then(result => {
                        this.downloads(result,'应收账款')
                    })
            },

        }
    }
</script>
<style>
    .searchInput{
        width: 10%;
    }

</style>
