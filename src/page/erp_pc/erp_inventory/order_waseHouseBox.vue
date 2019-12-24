<template>
    <div class="common-wrap flex-column">
        <div style="display: flex;flex-direction: row;justify-content: space-between;margin: 0 26px;">
        <el-form :model="searchForm" :inline="true" style="margin-left: 15px" @submit.native.prevent @keyup.enter.native="getData" label-width="100">
            <el-form-item label="仓库:" style="margin-left: 15px">
                <el-input
                    v-model.trim="searchForm.storageCode"
                    style="width: 150px"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="料框:"  style="margin-left: 15px">
                <el-input
                    v-model.trim="searchForm.boxCode"
                    style="width: 150px"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="项目号:"  >
                <el-input
                    v-model.trim="searchForm.itemNo"
                    style="width: 150px"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="颜色:" >
                <el-input
                    v-model.trim="searchForm.cx1Name"
                    style="width: 150px"
                >
                </el-input>
            </el-form-item>
            <br>

            <el-form-item label="经销商:" >
                <el-input
                    v-model.trim="searchForm.clientCode2"
                    style="width: 150px"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="订单号:" >
                <el-input
                    v-model.trim="searchForm.refDocCode"
                    style="width: 150px"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="型号:" style="margin-left: 15px">
                <el-input
                    v-model.trim="searchForm.matCode"
                    style="width: 150px"
                >
                </el-input>
            </el-form-item>

        </el-form>
        <div>
            <el-button class="btn-cyan search-btn" @click="getSearchList">查询</el-button>
            <el-button @click="handleRefresh">刷新</el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button @click="pushExsh">导出</el-button>
        </div>
        </div>
        <!--表格区域-->
        <CommonTable
            ref="refTable"
            :isCenter="false"
            :isMulCommonTable="true"
            :tableHeight="$store.state.screenHei*0.75"
            :isShowStatus="isShowStatus"
            :propData="tableProp"
            :otherVariable="otherVariable"
            :tableData="tableData"
        ></CommonTable>
        <!--分页区域-->
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
                <div style="flex: 27;">
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
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                allTheroyWght:'',
                allDigit:'',
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
                    {prop:'clientCode2',name:'经销商代码',type:'normal',align:'left',width:'130', tooltip: true,},
                    {prop:'clientName2',name:'经销商名称',type:'normal',align:'left', tooltip: true,},
                    {prop:'projectName',name:'工程名称',type:'normal',align:'left', tooltip: true,},
                    {prop:'refDocCode', name:'订单号',type:'normal',align:'left',width:'130', tooltip: true,},
                    {prop:'itemNo', name:'项目号',type:'normal',align:'left',width:'130', tooltip: true,},
                    {prop:'matCode', name:'型号',type:'normal',align:'left',width:'100',isShort:true, tooltip: true,},
                    {prop:'cx1Name', name:'颜色',type:'normal',align:'left',width:'90' , tooltip: true,},
                    {prop:'cx2', name:'材质',type:'normal',align:'left',width:'70',isShort:true, tooltip: true,},
                    {prop:'cx4', name:'长度',type:'normal',align:'right',width:'70' ,isShort:true},
                    {prop:'storageCode', name:'仓库',type:'normal',align:'left',width:'100',isShort:true, tooltip: true,},
                    {prop:'boxCode',name:'料框',type:'normal',align:'left',width:'100',isShort:true, tooltip: true,},
                    {prop:'stockDigit',name:'支数',type:'normal',align:'right',width:'100',isShort:true,tooltip: true,},
                    {prop:'stockTheroyWght',name:'重量',type:'normal',align:'right',width:'100',isShort:true,tooltip: true,},
                ],
                searchForm: {},
                tableData: [],
            }
        },
        mounted() {
            this.getData();
            this.getTotal();
            setTimeout(() => {
                this.$refs.refTable.initStatus();
            },200);
            //是否客户用户
            if(!this.isHasEnterprise){
                this.searchForm.clientPortal = true;
            }else{
                this.searchForm={};
            }
        },
        methods: {
            getData() {
                this.fetch(`/oms/pcs/StockSearch/getMatWarehouseBox?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data) {

                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                        }else {
                            this.tableData = result.data;
                            this.pageObj.commonTotal = 0;
                        }
                    })

            },
            getTotal(){
                this.fetch(`/oms/pcs/StockSearch/getMatWarehouseBoxTotal`,this.searchForm)
                    .then(result => {
                        if(result.data) {
                            this.allTheroyWght = result.data.stockTheroyWght;
                            this.allDigit = result.data.stockDigit;

                        }else {

                        }
                    })

            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
                this.getTotal();
            },
            handleRefresh(){
                this.getData();
                this.getTotal();
            },
            handleReset(){
                this.searchForm={},
                this.getData();
                this.getTotal();
            },
            handleCheck() {
                if(!this.isHasEnterprise){
                    this.searchForm.clientPortal = true;
                }else{
                    this.searchForm={};
                }
                this.getData();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },
            pushExsh() {
                this.fetch(`/oms/pcs/StockSearch/exportClientWarehouseBoxExcel`, this.searchForm, {responseType: 'blob'})
                    .then(result => {
                        this.downloads(result,'产品料框库存')

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
