<template>
    <div class=" flex-column common-table">
        <el-form :model="searchForm" :inline="true" @submit.native.prevent @keyup.enter.native="getData" label-width="130">
            <el-form-item label="订单号:" >
                <el-input
                    width="70"
                    v-model.trim="searchForm.refDocCode"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="项目号:" >
                <el-input

                    v-model.trim="searchForm.itemNo">
                </el-input>
            </el-form-item>

            <br>
            <el-form-item label="型号:" style="margin-right: 22px;margin-left: 14px;">
                <el-input
                    width="70"
                    v-model.trim="searchForm.matCode"
                >
                </el-input>
            </el-form-item >
                <el-form-item label="颜色:"  style="margin-right: 950px">
                    <el-input
                        width="70"
                        v-model.trim="searchForm.cx1Name"
                    >
                    </el-input>
                </el-form-item>
            <el-button class="btn-cyan search-btn" @click="getSearchList">查询</el-button>
            <el-button  @click="handleCheck">重置</el-button>
            <el-button @click="handleRefresh">刷新</el-button>
            <el-button @click="pushExsh">导出</el-button>

        </el-form>
        <!--<el-row :gutter="20">-->
            <!--<el-col :span="1" :offset="1">汇总</el-col>-->
            <!--<el-col :span="2" >支数订单</el-col>-->
            <!--<el-col :span="2">支数计划</el-col>-->
            <!--<el-col :span="2">支数已发货</el-col>-->
            <!--<el-col :span="2">支数缺少</el-col>-->
            <!--<el-col :span="2">支数可用库存</el-col>-->
            <!--<el-col :span="2" :offset="1">重量订单</el-col>-->
            <!--<el-col :span="2">重量计划</el-col>-->
            <!--<el-col :span="2">重量已发货</el-col>-->
            <!--<el-col :span="2">重量缺少</el-col>-->
            <!--<el-col :span="2">重量可用库存</el-col>-->
        <!--</el-row>-->
        <!--<el-row :gutter="20">-->
            <!--<el-col :span="2" :offset="2" style="color: blue;font-size: 15px;">{{BigDecimal}}</el-col>-->
            <!--<el-col :span="2" style="color: blue;font-size: 15px;">{{planDigit}}</el-col>-->
            <!--<el-col :span="2" style="color: blue;font-size: 15px;">{{deliveryDigit}}</el-col>-->
            <!--<el-col :span="2" style="color: blue;font-size: 15px;">{{lackDigit}}</el-col>-->
            <!--<el-col :span="2" style="color: blue;font-size: 15px;">{{allocDigit}}</el-col>-->
            <!--<el-col :span="2" :offset="1" style="color: blue;font-size: 15px;">{{theroyWght}}</el-col>-->
            <!--<el-col :span="2" style="color: blue;font-size: 15px;">{{planTheroyWght}}</el-col>-->
            <!--<el-col :span="2" style="color: blue;font-size: 15px;">{{deliveryDigit}}</el-col>-->
            <!--<el-col :span="2" style="color: blue;font-size: 15px;">{{lackTheroyWght}}</el-col>-->
            <!--<el-col :span="2" style="color: blue;font-size: 15px;">{{allocTheroyWght}}</el-col>-->
        <!--</el-row>-->
            <!--<el-col  :span="24">-->
                <!--<p style="margin-left: 20px;font-size: 15px;">-->
                    <!--总支数订单:<span style="margin-right: 10px;color: blue;font-size: 15px;"> {{BigDecimal}}</span>-->
                    <!--总支数计划: <span style="margin-right: 10px;color: blue;font-size: 15px;">{{planDigit}}</span>-->
                    <!--总支数已发货: <span style="margin-right: 10px;color: blue;font-size: 15px;">{{deliveryDigit}}</span>-->
                    <!--总支数缺少: <span style="margin-right: 10px;color: blue;font-size: 15px;">{{lackDigit}}</span>-->
                    <!--总支数可用库存: <span style="margin-right: 10px;color: blue;font-size: 15px;">{{allocDigit}}</span>-->
                <!--</p>-->
            <!--</el-col>-->
            <!--<el-col  :span="24">-->
                <!--<p style="margin-left: 20px;font-size: 15px;">-->
                    <!--总重量订单:<span style="margin-right: 10px;color: blue;font-size: 15px;"> {{theroyWght}}</span>-->
                    <!--总重量计划: <span style="margin-right: 10px;color: blue;font-size: 15px;">{{planTheroyWght}}</span>-->
                    <!--总重量已发货: <span style="margin-right: 10px;color: blue;font-size: 15px;">{{deliveryDigit}}</span>-->
                    <!--总重量缺少: <span style="margin-right: 10px;color: blue;font-size: 15px;">{{lackTheroyWght}}</span>-->
                    <!--总重量可用库存: <span style="margin-right: 10px;color: blue;font-size: 15px;">{{allocTheroyWght}}</span>-->

                <!--</p>-->
            <!--</el-col>-->
        <el-table
            :data="tableData"
            v-loading="loading"
            highlight-current-row
            style="width: 100%"
            :height="$store.state.screenHei*0.72"
            ref="moviesTable"
            border
            show-summary
            :summary-method="getSummaries"
        >
            <el-table-column prop="refDocCode" label="订单号" :show-overflow-tooltip="true"  align="left"></el-table-column>
            <el-table-column prop="itemNo" label="项目号" :show-overflow-tooltip="true"  align="left"></el-table-column>
            <el-table-column prop="matCode" label="型号" :show-overflow-tooltip="true"  align="left"></el-table-column>
            <el-table-column prop="cx1Name" label="颜色" :show-overflow-tooltip="true"  align="left"></el-table-column>
            <el-table-column prop="cx2" label="材质" :show-overflow-tooltip="true"  align="left"></el-table-column>
            <el-table-column prop="cx4Name" label="长度" :show-overflow-tooltip="true"  align="right"></el-table-column>

            <el-table-column  label="支数" align="center" >
                <el-table-column prop="digit" label="订单" align="right" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column prop="planDigit" label="计划" align="right" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column prop="deliveryDigit" label="已发货" align="right" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column prop="lackDigit" label="缺少" align="right" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column prop="allocDigit" label="可用库存" align="right" :show-overflow-tooltip="true" ></el-table-column>
            </el-table-column>
            <el-table-column  label="重量" align="center" >
                <el-table-column prop="theroyWght" label="订单" align="right" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column prop="planTheroyWght" label="计划" align="right" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column prop="deliveryDigit" label="已发货" align="right" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column prop="lackTheroyWght" label="缺少" align="right" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column prop="allocTheroyWght" label="可用库存" align="right" :show-overflow-tooltip="true" ></el-table-column>
            </el-table-column>
            <el-table-column prop="clientCode2" label="经销商" :show-overflow-tooltip="true"  align="center"></el-table-column>
            <el-table-column prop="clientName2" label="经销商名称" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>
            <el-table-column prop="projectName" label="工程名称" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>
        </el-table>

        <!--<CommonTable-->
            <!--ref="refTable"-->
            <!--:isCenter="false"-->
            <!--:isSum = "true"-->
            <!--:isMulCommonTable="true"-->
            <!--:tableHeight="$store.state.screenHei*0.76"-->
            <!--:isShowStatus="isShowStatus"-->
            <!--:propData="tableProp"-->
            <!--:otherVariable="otherVariable"-->
            <!--:tableData="tableData"-->
        <!--&gt;</CommonTable>-->
        <!--分页区域-->
        <!--<div style="height: 36px;line-height: 36px;background-color: #F5F7FA;" v-if="tableData.length>0">-->
            <!--<span style="display: inline-block;-->
    <!--padding-right: 497px;-->
    <!--padding-left: 30px;">汇总</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 89px;-->
    <!--text-align: start;"  >{{BigDecimal}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 89px;-->
    <!--text-align: start;">{{planDigit}}</span>-->
            <!--<span style="    display: inline-block;-->
    <!--width: 81px;-->
    <!--text-align: start;">{{deliveryDigit}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 88px;-->
    <!--text-align: start;">{{lackDigit}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 86px;-->
    <!--text-align: start;">{{allocDigit}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 89px;-->
    <!--text-align: start;">{{theroyWght}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 86px;-->
    <!--text-align: start;">{{planTheroyWght}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 85px;-->
    <!--text-align: start;">{{deliveryTheroyWght}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 87px;-->
    <!--text-align: start;">{{lackTheroyWght}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 93px;-->
    <!--text-align: start;">{{allocTheroyWght}}</span>-->
        <!--</div>-->
        <div style="display: flex; flex-direction: row;">
            <div style="display: flex; flex-direction: row; flex: 3; padding-top: 15px;">
                <div style="text-align: right;height: 65px;line-height: 65px;font-size: 15px;font-weight: 600;flex: 1;padding-right: 10px;min-width: 60px;">
                    汇总:
                </div>
                <div style="flex: 4; display: flex; flex-direction: column;">
                    <div></div>
                    <div style="margin-top: 15px;font-size: 14px;text-align: left">
                        总支数(单位:pcs)
                    </div>
                    <div style="text-align: left;font-size: 14px;">
                        总重量(单位:KG)
                    </div>
                </div>
                <div style="flex: 4; display: flex; flex-direction: column;">
                    <div style="text-align: right">订单</div>
                    <div style="font-weight: bold;text-align: right">{{BigDecimal}}</div>
                    <div style="font-weight: bold;text-align: right">{{theroyWght}}</div>
                </div>
                <div style="flex: 4; display: flex; flex-direction: column;">
                    <div style="text-align: right">计划</div>
                    <div style="font-weight: bold;text-align: right">{{planDigit}}</div>
                    <div style="font-weight: bold;text-align: right">{{planTheroyWght}}</div>
                </div>
                <div style="flex: 4; display: flex; flex-direction: column;">
                    <div style="text-align: right">已发货</div>
                    <div style="font-weight: bold;text-align: right">{{deliveryDigit}}</div>
                    <div style="font-weight: bold;text-align: right">{{deliveryDigit}}</div>
                </div>
                <div style="flex: 4; display: flex; flex-direction: column;">
                    <div style="text-align: right">缺货</div>
                    <div style="font-weight: bold;text-align: right">{{lackDigit}}</div>
                    <div style="font-weight: bold;text-align: right">{{lackTheroyWght}}</div>
                </div>
                <div style="flex: 4; display: flex; flex-direction: column;padding-right: 240px">
                    <div style="text-align: right;" >可用库存</div>
                    <div style="font-weight: bold;text-align: right">{{allocDigit}}</div>
                    <div style="font-weight: bold;text-align: right">{{allocTheroyWght}}</div>
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
                BigDecimal:'',
                planDigit:'',
                deliveryDigit:'',
                lackDigit:'',
                theroyWght:'',
                planTheroyWght:'',
                deliveryTheroyWght:'',
                lackTheroyWght:'',
                allocDigit:'',
                allocTheroyWght:'',
                matchRate:'',
                deliveryRate:'',
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
                    {prop:'refDocCode', name:'订单号',type:'normal',align:'left',width:'100'},
                    {prop:'itemNo', name:'项目号',type:'normal',align:'left',width:'100'},
                    {prop:'matCode', name:'型号',type:'normal',align:'left',isShort:true,width:'70'},
                    {prop:'cx1Name', name:'颜色',type:'normal',align:'left',width:'70'},
                    {prop:'cx2', name:'材质',type:'normal',align:'left',width:'70'},
                    {prop:'cx4Name', name:'长度',type:'normal',align:'left',width:'70'},
                    {
                        prop:'', name:'支数',align:'center',
                        children:[
                            {prop:'digit',name:'订单',type:'normal',align:'right',rule:'limitLength',isShort:true,width:'90'},
                            {prop:'planDigit',name:'计划',type:'normal',align:'right',rule:'limitLength',isShort:true,width:'90'},
                            {prop:'deliveryDigit',name:'已发货',type:'normal',align:'right',rule:'limitLength',isShort:true,width:'90'},
                            {prop:'lackDigit',name:'缺少',type:'normal',align:'right',rule:'limitLength',isShort:true,width:'90'},
                            {prop:'allocDigit',name:'可用库存',type:'normal',align:'right',rule:'limitLength',isShort:true,width:'90'},
                        ]
                    },
                    {
                        prop:'', name:'重量',align:'center',
                        children:[
                            {prop:'theroyWght',name:'订单',type:'normal',align:'right',rule:'limitLength',isShort:true,width:'90'},
                            {prop:'planTheroyWght',name:'计划',type:'normal',align:'right',rule:'limitLength',isShort:true,width:'90'},
                            {prop:'deliveryTheroyWght',name:'已发货',type:'normal',align:'right',rule:'limitLength',isShort:true,width:'90'},
                            {prop:'lackTheroyWght',name:'缺少',type:'normal',align:'right',rule:'limitLength',isShort:true,width:'90'},
                            {prop:'allocTheroyWght',name:'可用库存',type:'normal',align:'right',rule:'limitLength',isShort:true,width:'90'},
                        ]
                    },
                    {prop:'clientCode2', name:'经销商',type:'normal',align:'left'},
                    {prop:'clientName2', name:'经销商名称',type:'normal',align:'left'},
                    {prop:'projectName', name:'工程名称',type:'normal',align:'left'},


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
                this.fetch(`/oms/pcs/StockSearch/getMatProductInventory?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data) {
                            this.loading=false;
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                        }else {
                            this.tableData = [];
                            this.pageObj.commonTotal = 0;
                        }
                    })

            },
            getTotal(){
                this.fetch(`/oms/pcs/StockSearch/getMatProductInventoryTotal`,this.searchForm)
                    .then(result => {
                        if(result.data) {
                            this.BigDecimal = result.data.digit;
                            this.planDigit = result.data.planDigit;
                            this.deliveryDigit = result.data.deliveryDigit;
                            this.lackDigit = result.data.lackDigit;
                            this.theroyWght = result.data.theroyWght;
                            this.allocDigit = result.data.allocDigit;
                            this.planTheroyWght = result.data.planTheroyWght;
                            this.deliveryTheroyWght = result.data.deliveryTheroyWght;
                            this.lackTheroyWght = result.data.lackTheroyWght;
                            this.allocTheroyWght = result.data.allocTheroyWght;
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
            handleCheck() {
                if(!this.isHasEnterprise){
                    this.searchForm.clientPortal = true;
                }else{
                    this.searchForm={};
                }
                this.getData();
                this.getTotal();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },

            //合计-订单数、理重
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                let digit = null;
                let planDigit = null;
                let deliveryDigit = null;
                let lackDigit = null;
                let allocDigit = null;
                let theroyWght = null;
                let planTheroyWght = null;
                let deliveryTheroyWght = null;
                let lackTheroyWght = null;
                let allocTheroyWght = null;
                if(data.length){
                    data.forEach((d,i)=>{
                        digit += Number(d.digit);
                        planDigit += Number(d.planDigit);
                        lackDigit += Number(d.lackDigit);
                        deliveryDigit += Number(d.deliveryDigit);
                        allocDigit += Number(d.allocDigit);
                        theroyWght += Number(d.theroyWght);
                        planTheroyWght += Number(d.planTheroyWght);
                        deliveryTheroyWght += Number(d.deliveryTheroyWght);
                        lackTheroyWght += Number(d.lackTheroyWght);
                        allocTheroyWght += Number(d.allocTheroyWght);
                    })
                }
                sums[0] ='合计';
                digit ? sums[6] = digit.toFixed(3) : sums[6] =0;
                planDigit ? sums[7] = planDigit.toFixed(3) : sums[7] =0;
                deliveryDigit ? sums[8] = deliveryDigit.toFixed(3) : sums[8] =0;
                lackDigit ? sums[9] = lackDigit.toFixed(3) : sums[9] =0;
                allocDigit ? sums[10] = allocDigit.toFixed(3) : sums[10] =0;
                theroyWght ? sums[11] = theroyWght.toFixed(3) : sums[11] =0;
                planTheroyWght ? sums[12] = planTheroyWght.toFixed(3) : sums[12] =0;
                deliveryDigit ? sums[13] = deliveryDigit.toFixed(3) : sums[13] =0;
                lackTheroyWght ? sums[14] = lackTheroyWght.toFixed(3) : sums[14] =0;
                allocTheroyWght ? sums[15] = allocTheroyWght.toFixed(3) : sums[15] =0;

                return sums;

            },

            handleCommand(command,row,index){
                if(command === 'a'){
                    this.jumpToDetail(row)

                }else{
                    this.$store.state.order_Code = row.refDocCode;
                    this.goTargetTag(this.filterArray(this.sysNav,'resname','产品料库库存'));

                }

            },
            //跳转到订单库存查询页面
            jumpToDetail(row,index){
                this.$store.state.order_Code = row.refDocCode;
                this.goTargetTag(this.filterArray(this.sysNav,'resname','订单库存查询'));
            },
            pushExsh() {
                this.fetch(`/oms/pcs/StockSearch/exportProductInventoryExcel`, this.searchForm, {responseType: 'blob'})
                    .then(result => {
                        this.downloads(result,'订单产品库存')
                    })
            },
        }
    }
</script>
<style scoped>
    .searchInput{
        width: 10%;
    }
    .el-table__body tr:hover>td{
        background-color: #64D3A5 !important;
        color: white;
    }
    .common-table {
        padding: 10px;
        /* display: flex; */
        height: 100%;
    }
</style>
