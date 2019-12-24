<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <el-form :model="searchForm" :inline="true">
                <el-form-item  label="制单日期:"  width="70">
                    <el-date-picker
                        v-model="searchForm.beginDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item  label="" >
                    <el-date-picker
                        v-model="searchForm.overDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-button class="btn-cyan search-btn" @click="getData">查询</el-button>
                <el-button @click="handleRefresh">刷新</el-button>
            </el-form>
            <el-table
                :data="tableData"
                :highlight-current-row="true"
                style="width: 100%"
                :height="$store.state.screenHei*0.79"
                ref="moviesTable"
                @selection-change="handleSelectionChange"
                :row-class-name="tableRowClassName"
            >
                <el-table-column  label="供应商" align="center" >
                    <el-table-column prop="supplyCompanyCode" label="代码" :show-overflow-tooltip="true" ></el-table-column>
                    <el-table-column prop="supplyCompanyName" label="名称" :show-overflow-tooltip="true" ></el-table-column>
                </el-table-column>
                <el-table-column prop="billCode" label="单据编号" :show-overflow-tooltip="true"  align="right" ></el-table-column>
                <el-table-column prop="billDate" label="单据日期" :show-overflow-tooltip="true" align="right" ></el-table-column>
                <el-table-column prop="billType" label="单据类型" :show-overflow-tooltip="true" align="left" ></el-table-column>
                <el-table-column prop="digit" label="支数" :show-overflow-tooltip="true" align="right" ></el-table-column>
                <el-table-column prop="weight" label="重量" :show-overflow-tooltip="true" align="right" ></el-table-column>
                <el-table-column prop="payableMoney" label="应付金额" :show-overflow-tooltip="true" align="right" ></el-table-column>
                <el-table-column prop="paidMoney" label="已付金额" :show-overflow-tooltip="true" align="right" ></el-table-column>
                <el-table-column prop="balanceMoney" label="结余金额" :show-overflow-tooltip="true" align="right" ></el-table-column>
            </el-table>

            <!--分页区域-->
            <CommonPagination
                :pageObj="pageObj"
                @getData="getData"
            ></CommonPagination>
        </div>
        <div class="common-right" :style="{width: otherVariable.contentWidth + '%'}">
            <!--新增区域-->
            <transition name="popup">
                <CommonAdd
                    marginTop="30px"
                    v-show="isShowStatus.isPopUp"
                    :otherVariable="otherVariable"
                    :propData="formProp"
                    :addForm="addForm"
                    @handleCancel="handleCancel"
                    @handleSave="handleSave"
                >
                    <template slot="head-form-title">
                        <div class="head-form-title">
                            <span>{{otherVariable.addTitle}}</span>
                        </div>
                    </template>
                </CommonAdd>
            </transition>
        </div>
    </div>
</template>

<script>
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    import CommonAdd from '$src/components/CommonAdd'
    export default {
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonAdd
        },
        data() {
            return {
                showSearchInput:false,
                showSearch:false,
                isActive:false,
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                otherVariable: {
                    isSpread: false,
                    detailTitle: '查看客户结存',
                    addTitle: '新增客户结存',
                    contentWidth: 0
                },
                tempWidth: null,
                whetherUseList: this.getStaticList('whetherUse'),
                tableData: [],
                //搜索映射列表
                searchProp: [
                    {prop:'fcode', name:'结存代码',type:'normal','isMainSearch':true, 'placeholder':'请输入结存号'},
                    {prop:'beginDate', name:'开始日期',type:'date'},
                    {prop:'overDate', name:'结束日期',type:'date'},
                ],
                //详情映射列表
                formProp: [
//                    {prop:'billCode', name:'结存编号',type:'normal'},
//                    {prop:'billDate', name:'结存日期',type:'date'},
//                    //{prop:'', name:'结存人',type:'normal'},
//                    {prop:'remark',name:'备注',type:'textarea'},
                    {prop:"",name:'经销商',
                        children:[
                            {prop:'supplyCompanyCode',name:'代码',type:'normal'},
                            {prop:'supplyCompanyName',name:'名称',type:'normal'},
                        ]
                    },
                    {prop:"",name:'客户',
                        children:[
                            {prop:'clientCompanName',name:'名称',type:'normal'},
                        ]
                    },
                    {prop:'billCode',name:'单据编号',type:'normal'},
                    {prop:'billDate',name:'单据日期',type:'normal'},
                    {prop:'billType',name:'单据类型',type:'normal'},
                    {prop:'remark',name:'经销商结余',type:'normal'},
                    {prop:'digit',name:'支数',type:'normal'},
                    {prop:'weight',name:'重量',type:'normal'},
                    {prop:'receivableMoney',name:'应收金额',type:'normal'},
                    {prop:'receivedMoney',name:'已收金额',type:'normal'},
                    {prop:'remark',name:'结余欠款',type:'normal'},


                ],
                //表格映射列表
                tableProp: [

                    {prop:"",name:'经销商',
                        children:[
                            {prop:'supplyCompanyCode',name:'代码',type:'normal'},
                            {prop:'supplyCompanyName',name:'名称',type:'normal'},
                        ]
                    },
                    {prop:"",name:'客户',
                        children:[
                            {prop:'clientCompanName',name:'名称',type:'normal'},
                        ]
                    },
                    {prop:'billCode',name:'单据编号',type:'normal',isShort:true},
                    {prop:'billDate',name:'单据日期',type:'normal',isShort:true},
                    {prop:'billType',name:'单据类型',type:'normal',isShort:true},
                    {prop:'digit',name:'支数',type:'normal',isShort:true},
                    {prop:'weight',name:'重量',type:'normal',isShort:true},
                    {prop:'receivableMoney',name:'应付金额',type:'normal',isShort:true},
                    {prop:'receivedMoney',name:'已付金额',type:'normal',isShort:true},
                    {prop:'remark',name:'结余欠款',type:'normal',isShort:true},
                ],
                searchForm: {},
                addForm: {},
                detailForm: {},
                detailId: null,
                pageObj: {
                    className: 'custom-pagination',
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                }
            }
        },
        mounted() {
            this.getData();
            this.tempWidth = this.otherVariable.contentWidth;

        },
        methods: {
            getData() {
                this.tableData = [];
                this.fetch(`/oms/FinancialManager/selectSupplyBalance?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            if(JSON.stringify(this.searchForm) != "{}"){
                                this.getsearchForm();
                            }
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    });
            },
            //查询出来数据 --添加到tableData的第一条
            getsearchForm(){
                this.searchData={};
                this.isActive = true;
                this.fetch('/oms/FinancialManager/selectUpSupplyBalance',{upBalanceDate:this.searchForm.beginDate})
                    .then(result => {
                        if(result.data) {
                            this.searchData = result.data;
                            this.searchData.billCode="";
                            this.searchData.billDate="";
                            if(JSON.stringify(this.searchData) != "{}"){
                                this.tableData.unshift(this.searchData);
                            }
                        }else {
                            this.searchData={};
                        }
                    })
            },
            tableRowClassName(row) {
                console.log(row.rowIndex);
                if (row.rowIndex === 0 && this.isActive) {
                    return 'success-row';

                } else {
                    return ''
                }
            },
            //刷新
            handleRefresh(){
                this.isActive=false;
                this.searchForm={};
                this.getData();

            },
            handleSearch() {
                this.pageObj.commonTotal = 0;
                this.getData();
            },
            //更多查询
            toggleSearch(){
                this.showSearchInput=!this.showSearchInput;
                this.showSearch = !this.showSearch;
            },
            handleDetail(row) {
                this.detailForm = row;
            },
            handleAdd() {
                this.isShowStatus.isPopUp = true;
                this.otherVariable.contentWidth = 50;
            },
            handleSave(type) {
                let tempObj;
                let api;
                if(type === 'add') {
                    api = '/';
                    tempObj = this.addForm;
                }else {
                    api = '/';
                    tempObj = this.detailForm;
                }
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
                            this.detailForm = {};
                            this.getData();
                        }else if(result.status === 500){
                            this.$message({
                                message:result.error.substring(result.error.indexOf(":")+2,result.error.indexOf('\n'))
                            })
                        }else {
                            this.$message({
                                message: '保存失败',
                                type: 'error'
                            });
                        }
                    })
            },
            handleCancel() {
                this.isShowStatus.isPopUp = false;
                this.addForm = {};
                this.otherVariable.contentWidth = 0;
            },
            handleDelete() {
                if(this.detailForm.fid) {
                    if(confirm('确定反结存?')) {
                        this.fetch('/',{fid:this.detailForm.fid})
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '反结存成功',
                                        type: 'success'
                                    });
                                    this.searchForm = {};
                                    this.detailForm = {};
                                    this.getData();
                                }else {
                                    this.$message({
                                        message: '反结存失败',
                                        type: 'error'
                                    });
                                }
                            })
                    }
                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    });
                }
            },
            toggleSpread() {
                this.otherVariable.isSpread = !this.otherVariable.isSpread;
                if(this.otherVariable.isSpread) {
                    this.otherVariable.contentWidth = 100;
                }else {
                    this.otherVariable.contentWidth = this.tempWidth;
                }
            }
        }
    }
</script>
<style>
    .el-table .success-row {
        background: #04D77D;
    }
</style>

