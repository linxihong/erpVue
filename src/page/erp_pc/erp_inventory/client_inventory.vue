<template>
    <div class="common-wrap flex-column">
<div style="display: flex;flex-direction: row;justify-content: space-between;margin: 0 26px;">
        <el-form :model="searchForm" :inline="true" @submit.native.prevent @keyup.enter.native="getData">
            <el-form-item label="经销商:" >
                <el-input
                    v-model.trim="searchForm.clientCode2"
                    style="width: 250px"
                >
                </el-input>
            </el-form-item>
                <el-form-item label="工程名称:"  >
                    <el-input
                        v-model.trim="searchForm.projectName"
                        style="width: 250px"
                    >
                    </el-input>
                </el-form-item>
        </el-form>
        <div>
        <el-button class="btn-cyan search-btn" @click="getSearchList">查询</el-button>
        <el-button  @click="handleCheck">重置</el-button>
        <el-button @click="handleRefresh">刷新</el-button>
        <el-checkbox style="margin-left: 10px;" v-model="searchForm.isOpen"  @change="changeSelf" true-label="1" false-label="0">展开汇总</el-checkbox>
        <el-button @click="pushExsh">导出</el-button>
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
            <el-table-column prop="clientCode2" label="经销商代码" :show-overflow-tooltip="true"  align="left"></el-table-column>
            <el-table-column prop="clientName2" label="经销商名称" :show-overflow-tooltip="true" align="left"></el-table-column>
            <el-table-column prop="companyName" label="销售公司" :show-overflow-tooltip="true" align="left" ></el-table-column>
            <el-table-column prop="projectName" label="工程名称" :show-overflow-tooltip="true" align="left"></el-table-column>
            <el-table-column prop="stockDigit" label="支数"   align="right" width="130" ></el-table-column>
            <el-table-column prop="stockTheroyWght" label="重量"   align="right" width="130" ></el-table-column>
            <el-table-column label="操作"  align="center" width="130" >
                <template slot-scope="scope">
                    <el-dropdown @command="handleCommand($event,scope.row,scope.$index)" trigger="click">
                        <el-button type="primary">库存追踪 <i class="el-icon-d-arrow-right"></i></el-button>
                        <el-dropdown-menu slot="dropdown" class="del-shadow">
                            <el-dropdown-item command="a" >仓库库存</el-dropdown-item>
                            <el-dropdown-item command="b">料框库存</el-dropdown-item>
                            <el-dropdown-item command="c">订单库存</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <!--分页区域-->
        <div style="display: flex; flex-direction: row;">
            <div style="display: flex; flex-direction: row; flex: 3;">
                <div style="text-align: right;height: 58px;line-height: 58px;font-size: 15px;font-weight: 600;flex: 1;padding-right: 10px;min-width: 60px;">
                    汇总:
                </div>
                <div style="flex: 4;">
                    <div style="margin-top: 10px;font-size: 13px;">
                        总支数(单位:pcs)
                    </div>
                    <div>
                        <span style="font-weight: bold"> {{allDigit}}</span>
                    </div>
                </div>
                <div style="flex: 26;">
                    <div style="margin-top: 10px;font-size: 13px;">总重量(单位:KG)</div>
                    <div>
                        <span style="font-weight: bold"> {{allTheroyWght}}</span>
                    </div>

                </div>
            </div>
            <CommonPagination style="flex: 1;"
                              :pageObj="pageObj"
                              @getData="getData"
            ></CommonPagination>


        </div>

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
                searchForm: {},
                tableData: [],
            }
        },
        mounted() {
            this.sysNav = this.navs[this.sideValue].children;
            this.getData();
            this.getTotal();
        },
        methods: {
            getData() {
                this.fetch(`/oms/pcs/StockSearch/getClientStore?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`, this.searchForm)
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
            getTotal(){
                this.fetch(`/oms/pcs/StockSearch/getClientStoreTotal`,this.searchForm)
                    .then(result => {
                        if(result.data) {

                            this.allTheroyWght = result.data.allTheroyWght;
                            this.allDigit = result.data.allDigit;

                        }else {

                        }
                    })
            },
            getSearchList() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
                this.getTotal();
            },
            handleRefresh() {
                this.getData();
                this.getTotal();
            },
            handleCheck() {
                if (!this.isHasEnterprise) {
                    this.searchForm.clientPortal = true;
                } else {
                    this.searchForm = {};
                }
                this.getData();
                this.getTotal();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },
            handleCommand(command, row, index) {
                if (command === 'a') {
                    this.$store.state.order_Code = row.clientCode2;
                    this.goTargetTag(this.filterArray(this.sysNav, 'resname', '客户仓库库存查询'));
                } else if (command === 'b') {
                    this.$store.state.order_product = row.clientCode2;
                    this.goTargetTag(this.filterArray(this.sysNav, 'resname', '客户料框库存查询'));
                } else {
                    this.$store.state.order_inventory = row.clientCode2;
                    this.goTargetTag(this.filterArray(this.sysNav, 'resname', '订单库存查询'));
                }
            },
            //跳转到订单库存查询页面
            jumpToDetail(row, index) {
                this.$store.state.order_Code = row.refDocCode;
                this.goTargetTag(this.filterArray(this.sysNav, 'resname', '订单库存查询'));
            },
            pushExsh() {
                this.fetch(`/oms/pcs/StockSearch/exportClientStoreExcel`, this.searchForm, {"responseType": 'blob'})
                    .then((data) => {
                        this.downloads(data,'客户库存')
                    })
            },
            changeSelf(){
                this.getData();
            }
        }

    }
</script>
<style>
    .searchInput{
        width: 10%;
    }

</style>
