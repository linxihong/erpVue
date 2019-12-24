<template>
    <div class="common-wrap flex-column">
        <el-form :model="searchForm" :inline="true" ref="searchForm" :rules="mainRules" @submit.native.prevent @keyup.enter.native="getSearchList">
            <el-form-item  label="制单日期:" width="70" prop="beginDate">
                <el-date-picker
                    v-model="searchForm.beginDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="">
                <el-date-picker
                    v-model="searchForm.overDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="经销商:" prop="clientCompanyId">
                <!--<el-input-->
                    <!--v-model.trim="searchForm.clientCompanCode"-->
                    <!--style="width: 150px"-->
                <!--&gt;-->
                <!--</el-input>-->
                <el-select
                    v-model="searchForm.clientCompanyId"
                    filterable
                    remote
                    placeholder="请输入经销商"
                    :remote-method="remoteMethod"
                    style="width: 150px"

                    >
                    <el-option
                        @click.native="setMatCode(item.fid)"
                        v-for="(item,index) in options4"
                        :key="item.value"
                        :label="item.fcode"
                        :value="item.fid">
                    </el-option>
                </el-select>

            </el-form-item>
            <el-button class="btn-cyan search-btn" @click="getSearchList" :disabled="SearchShow">查询</el-button>
            <el-button @click="handleRefresh">刷新</el-button>
            <el-button @click="pushExsh" :disabled="!Exsh">导出</el-button>
            <el-button :disabled="!Exsh"  title="打印" @click="handlePrint" >打印</el-button>
        </el-form>
        <!--表格区域-->
        <CommonTable
            ref="refTable"
            :isMulCommonTable="true"
            :tableHeight="$store.state.screenHei*0.79"
            :isShowStatus="isShowStatus"
            :propData="tableProp"
            :otherVariable="otherVariable"
            :tableData="tableData"
        ></CommonTable>
        <!--分页区域-->
        <CommonPagination
            :pageObj="pageObj"
            @getData="getData"
        ></CommonPagination>
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
                getFid:'',
                SearchShow:false,
                options4: [],
                Exsh:false,
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
                    detailTitle: '客户结存',
                    addTitle: '新增客户结存',
                    contentWidth: 0
                },
                tempWidth: null,
                whetherUseList: this.getStaticList('whetherUse'),
                tableData: [],
                mainRules:{
                    clientCompanyId:[
                        { required: true, message: '请输入经销商', trigger: 'blur' }
                    ],
                    beginDate:[
                        {required: true, message: '请输入制单日期', trigger: 'blur'}
                    ]
                },
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
//                    {prop:"",name:'客户',
//                        children:[
//                            {prop:'clientCompanName',name:'名称',type:'normal'},
//                        ]

                    {prop:'billCode',name:'单据编号',type:'normal'},
                    {prop:'productDescriptionSet',name:'产品名称描述',type:'normal'},
                    {prop:'billDate',name:'单据日期',type:'normal'},
                    {prop:'billType',name:'单据类型',type:'normal'},
                    {prop:'remark',name:'经销商结余',type:'normal'},
                    {prop:'digit',name:'支数',type:'normal'},
                    {prop:'weight',name:'重量',type:'normal'},
                    {prop:'receivableMoney',name:'应收金额',type:'normal'},
                    {prop:'receivedMoney',name:'已收金额',type:'normal'},
                    {prop:'balanceMoney',name:'结余欠款',type:'normal'},
                ],
                //表格映射列表
                tableProp: [
                    {prop:"",name:'经销商',
                        children:[
                            {prop:'clientCompanCode',name:'代码',type:'normal',align:"left",isShort:true},
                            {prop:'clientCompanName',name:'名称',type:'normal',align:"left",isShort:true},
                        ]
                    },
//                    {prop:"",name:'客户',
//                        children:[
//                            {prop:'clientCompanName',name:'名称',type:'normal'},
//                        ]
//                    },
                    {prop:'billCode',name:'单据编号',type:'normal',width:'150',align:"left",isShort:true},
                    {prop:'productDescriptionSet',name:'产品名称描述',type:'normal'},
                    {prop:'billDate',name:'单据日期',type:'normal',width:'100',align:"left",isShort:true},
                    {prop:'billType',name:'单据类型',type:'normal',width:'100',align:"left",isShort:true},
                    {prop:'digit',name:'支数',type:'normal',width:'100',align:"right",isShort:true},
                    {prop:'weight',name:'重量',type:'normal',width:'100',align:"right",isShort:true},
                    {prop:'receivableMoney',name:'应付金额',type:'normal',width:'100',align:"right",isShort:true},
                    {prop:'receivedMoney',name:'已付金额',type:'normal',width:'100',align:"right",isShort:true},
                    {prop:'balanceMoney',name:'结余欠款',type:'normal',width:'100',align:"right",isShort:true},
                ],
                searchForm: {
                    overDate:this.recentDate(0),
                    beginDate:this.recentDate(-30),
                },
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
            //this.getData();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            getData() {
                this.tableData = [];
                this.fetch(`/oms/FinancialManager/selectClientBalance?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data) {
                            this.SearchShow= false;
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            if(JSON.stringify(this.searchForm) !== "{}"){
                                this.getsearchForm();
                            }
                        }else if(result.data==null){
                            this.getsearchForm();
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },
            //查询出来数据 --添加到tableData的第一条
            getsearchForm(){
                this.searchData={};
                this.isActive = true;
                    this.fetch('/oms/FinancialManager/selectUpClientUpBalance',{upBalanceDate:this.searchForm.beginDate,clientCompanyId:this.searchForm.clientCompanyId})
                        .then(result => {
                            if(result.data) {
                                this.SearchShow= false;
                                this.searchData = result.data;
                                this.searchData.billCode="";
                                this.searchData.billDate="";
                                if(JSON.stringify(this.searchData) !== "{}"){
                                    this.tableData.unshift(this.searchData);
                              }
                            }else {
                                this.searchData={};
                            }
                        })
            },
            tableRowClassName(row) {
                if (row.rowIndex === 0 && this.isActive) {
                    return 'success-row';
                } else {
                    return ''
                }
            },
            //刷新
            handleRefresh(){
                this.Exsh=false;
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
            getSearchList(){
                this.SearchShow= true;
                this.$refs.searchForm.validate((valid)=>{
                    if(valid){
                        this.Exsh=true;
                        this.pageObj.commonPage=1;
                        this.pageObj.commonSize=10;
                        this.getData();
                    }else{
                        this.Exsh=false;
                    }
                })
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
                    })
                }
            },
            toggleSpread() {
                this.otherVariable.isSpread = !this.otherVariable.isSpread;
                if(this.otherVariable.isSpread) {
                    this.otherVariable.contentWidth = 100;
                }else {
                    this.otherVariable.contentWidth = this.tempWidth;
                }
            },
            pushExsh() {
                this.fetch(`/oms/FinancialManager/exportCustomerBalanceInfoExcel`, this.searchForm, {responseType: 'blob'})
                    .then(result => {
                        this.downloads(result,'客户结余')
                    })
            },
            setMatCode(fid){
                this.getFid=fid;
            },
            remoteMethod(val) {
                this.options4 = [];
                if(val) {
                    this.fetch('/oms/BasedataController/getOrgClientCompany?pageSize=1000',{fcode:val,clientType:2})
                        .then(result => {
                            if(result.data && result.data.list) {
                                this.options4 = result.data.list;
                            }
                        });
                }
            },
            handlePrint(){
                let isReturn = false;
                let resultUrl = '';
                this.getAjax(`/oms/PrintController/clientBalancePrint?clientCompanyId=${this.getFid}&beginBillDate=${this.beginDate}&endBillDate=${this.overDate}`)
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


        }


    }
</script>
<style>
    .el-table .success-row {
        background: #04D77D;
    }
</style>

