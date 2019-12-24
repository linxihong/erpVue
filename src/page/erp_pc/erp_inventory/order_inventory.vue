<template>
    <div class="common-table flex-column">
        <el-form :model="searchForm" :inline="true" style="margin-top: 10px; margin-left: 10px;" @submit.native.prevent @keyup.enter.native="getData" label-width="130">
            <el-form-item label="下单日期:" >
                <el-date-picker
                    v-model="searchForm.orderDocDateStart"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item  label="至:" >
                <el-date-picker
                    v-model="searchForm.orderDocDateEnd"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="订单号:" >
                <el-input
                   style="width: 150px"
                    v-model.trim="searchForm.refDocCode"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="工程名称:" style="margin-right: 415px">
                <el-input
                    style="width: 150px"
                    v-model.trim="searchForm.projectName"
                >
                </el-input>
            </el-form-item>

            <el-button class="btn-cyan search-btn" @click="getSearchList">查询</el-button>
            <el-button  @click="handleCheck">重置</el-button>
            <el-button @click="handleRefresh">刷新</el-button>
            <el-button @click="pushExsh">导出</el-button>
            <br>
            <el-form-item  label="交货日期:" width="70">
                <el-date-picker
                    v-model="searchForm.orderDeliveryDateStart"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item  label="至:" width="70">
                <el-date-picker
                    v-model="searchForm.orderDeliveryDateEnd"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <!--<el-form-item label="客户:" style="margin-left: 27px">-->
                <!--<el-input-->
                    <!--v-model.trim="searchForm.clientCode"-->
                    <!--class="search-input"-->
                <!--&gt;-->
                <!--</el-input>-->

            <!--</el-form-item>-->
            <el-form-item label="经销商:"  style="margin-left: 3px;margin-right: 100px;" >
                <el-input
                    style="width: 385px"
                    v-model.trim="searchForm.clientCode2"
                >
                </el-input>
            </el-form-item>

            <span style="margin-left: 298px;font-size: 16px;">配套率：<span style="font-size: 20px;color: blue;margin-right: 20px;">{{matchRate}}%</span></span>
            <span style="margin-left: 29px;font-size: 16px;">发货率 <span style="font-size: 20px;color: blue;margin-right: 20px;">{{deliveryRate}}%</span> </span>
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



        <!--表格区域-->
        <!--<CommonTable-->
            <!--ref="refTable"-->
            <!--:isMulCommonTable="true"-->
            <!--:isSum = "true"-->
            <!--:tableHeight="$store.state.screenHei*0.70"-->
            <!--:isShowStatus="isShowStatus"-->
            <!--:propData="tableProp"-->
            <!--:otherVariable="otherVariable"-->
            <!--:tableData="tableData"-->
        <!--&gt;</CommonTable>-->
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
            <el-table-column prop="sellType" label="销售类型" :show-overflow-tooltip="true"  align="left">
                <template slot-scope="scope">
                    <div>{{scope.row.sellType==1?"国内":scope.row.sellType==2?"出口":"广成"}}</div>
                </template>

            </el-table-column>
            <el-table-column prop="docDate" label="下单日期" :show-overflow-tooltip="true"  align="left"></el-table-column>
            <el-table-column prop="deliveryDate" label="交货日期" :show-overflow-tooltip="true"  align="left"></el-table-column>
            <el-table-column prop="deliveryLevelName" label="货期类型" :show-overflow-tooltip="true"  align="left"></el-table-column>
            <el-table-column  label="支数"  align="center" >
                <el-table-column prop="digit" label="订单"  align="right" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="planDigit" label="计划" align="right" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="deliveryDigit" label="已发货" align="right" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="lackDigit" label="缺少" align="right" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="allocDigit" label="可用库存" align="right" :show-overflow-tooltip="true"></el-table-column>
            </el-table-column>
            <el-table-column  label="重量" align="center" >
                <el-table-column prop="theroyWght" label="订单" align="right" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="planTheroyWght" label="计划" align="right" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="deliveryDigit" label="已发货" align="right" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="lackTheroyWght" label="缺少" align="right" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column prop="allocTheroyWght" label="可用库存"align="right" :show-overflow-tooltip="true" ></el-table-column>
            </el-table-column>
            <el-table-column prop="orderMatchRate" label="订单配套率" :show-overflow-tooltip="true"  align="right"></el-table-column>
            <el-table-column prop="clientCode2" label="经销商" :show-overflow-tooltip="true"  align="center"></el-table-column>
            <el-table-column prop="clientName2" label="经销商名称" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>
            <el-table-column prop="projectName" label="工程名称" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>


        </el-table>
        <!--<div style="height: 36px;line-height: 36px;background-color: #F5F7FA;" v-if="tableData.length>0">-->
            <!--<span style="display: inline-block;-->
    <!--padding-right: 414px;-->
    <!--padding-left: 35px;">汇总</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 89px;-->
    <!--text-align: start;"  >{{BigDecimal}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 87px;-->
    <!--text-align: start;">{{planDigit}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 87px;-->
    <!--text-align: start;">{{deliveryDigit}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 88px;-->
    <!--text-align: start;">{{lackDigit}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 87px;-->
    <!--text-align: start;">{{allocDigit}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 87px;-->
    <!--text-align: start;">{{theroyWght}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 89px;-->
    <!--text-align: start;">{{planTheroyWght}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 86px;-->
    <!--text-align: start;">{{deliveryTheroyWhgt}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 88px;-->
    <!--text-align: start;">{{lackTheroyWght}}</span>-->
            <!--<span style="display: inline-block;-->
    <!--width: 93px;-->
    <!--text-align: start;">{{allocTheroyWght}}</span>-->
        <!--</div>-->
        <!--分页区域-->
        <div style="display: flex; flex-direction: row;">
            <div style="display: flex; flex-direction: row; flex: 3; padding-top: 15px;">
                <div style="text-align: right;height: 65px;line-height: 65px;font-size: 15px;font-weight: 600;flex: 1;margin-left: 12px;padding-right: 10px;min-width: 60px;">
                    汇总:
                </div>
                <div style="flex: 4; display: flex; flex-direction: column;">
                    <div></div>
                    <div style="margin-top: 15px;font-size: 14px;text-align: left">
                        总支数(单位:pcs)
                    </div>
                    <div style="text-align: right;font-size: 14px;text-align: left">
                        总重量(单位:KG)
                    </div>
                </div>
                <div style="flex: 4; display: flex; flex-direction: column;">
                    <div style="text-align: right">订单</div>
                    <div style="font-weight: bold;text-align: right">{{BigDecimal}}</div>
                    <div style="font-weight: bold;text-align: right">{{theroyWght}}</div>
                </div>
                <div style="flex: 4; display: flex; flex-direction: column;">
                    <div style="text-align: right;">计划</div>
                    <div style="font-weight: bold;text-align: right">{{planDigit}}</div>
                    <div style="font-weight: bold;text-align: right">{{planTheroyWght}}</div>
                </div>
                <div style="flex: 4; display: flex; flex-direction: column;">
                    <div style="text-align: right;">已发货</div>
                    <div style="font-weight: bold;text-align: right">{{deliveryDigit}}</div>
                    <div style="font-weight: bold;text-align: right">{{deliveryDigit}}</div>
                </div>
                <div style="flex: 4; display: flex; flex-direction: column;">
                    <div style="text-align: right;">缺货</div>
                    <div style="font-weight: bold;text-align: right">{{lackDigit}}</div>
                    <div style="font-weight: bold;text-align: right">{{lackTheroyWght}}</div>
                </div>
                <div style="flex: 4; display: flex; flex-direction: column;padding-right: 240px">
                    <div style="text-align: right;">可用库存</div>
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
        data() {
            return {
                allDigit:'',
                loading: true,
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                otherVariable: {
                    isReadTable: true
                },
                BigDecimal:'',
                planDigit:'',
                deliveryDigit:'',
                lackDigit:'',
                theroyWght:'',
                planTheroyWght:'',
                deliveryTheroyWhgt:'',
                lackTheroyWght:'',
                allocDigit:'',
                allocTheroyWght:'',
                matchRate:'',
                deliveryRate:'',
                //分页
                pageObj: {
                    className: 'custom-pagination',
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                searchForm: {
                    clientPortal:false
                },
                navs:this.$store.getters.getSideNavlist||[],
                sideValue: sessionStorage.getItem('sideValue')!==undefined?parseInt(sessionStorage.getItem('sideValue')):0,
                sysNav: [],
                tableData: [],
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
                        name:'流程单号',
                        prop:'docCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'交货日期',
                        prop:'orderDeliveryDateStart',
                        type:'date',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'至',
                        prop:'orderDeliveryDateEnd',
                        type:'date',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'客户',
                        prop:'clientCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'经销商',
                        prop:'clientCode2',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                ],
                //表格映射列表
                tableProp: [
                    {prop:'refDocCode', name:'订单号',type:'normal',align:'left',width:'100'},
                    {prop:'sellType', name:'销售类型',type:'sell',align:'left',isShort:true,width:'60'},
                    {prop:'docDate', name:'下单日期',type:'normal',align:'left',isShort:true,width:'80'},
                    {prop:'deliveryDate', name:'交货日期',type:'normal',align:'left',isShort:true,width:'80'},
                    {prop:'deliveryLevelName', name:'货期类型',type:'normal',align:'left',isShort:true,width:'70'},
                    {
                        prop:'', name:'支数',
                        children:[
                            {prop:'digit',name:'订单',type:'normal',align:'right',isShort:true,width:'100',isShort:true,},
                            {prop:'planDigit',name:'计划',type:'normal',align:'right',isShort:true,width:'80',isShort:true},
                            {prop:'deliveryDigit',name:'已发货',type:'normal',align:'right',isShort:true,width:'80',isShort:true},
                            {prop:'lackDigit',name:'缺少',type:'normal',align:'right',isShort:true,width:'80',isShort:true},
                            {prop:'allocDigit',name:'可用库存',type:'normal',align:'right',isShort:true,width:'100',isShort:true}
                        ]
                    },
                    {
                        prop:'', name:'重量',
                        children:[
                            {prop:'theroyWght',name:'订单',type:'normal', align:'right',width:'100',isShort:true},
                            {prop:'planTheroyWght',name:'计划',type:'normal',align:'right',isShort:true,width:'80',isShort:true},
                            {prop:'deliveryTheroyWhgt',name:'已发货',type:'normal',align:'right',isShort:true,width:'80',isShort:true},
                            {prop:'lackTheroyWght',name:'缺少',type:'normal',align:'right',isShort:true,width:'80',isShort:true},
                            {prop:'allocTheroyWght',name:'可用库存',type:'normal',align:'right',isShort:true,width:'100',isShort:true}
                        ]
                    },
                    {prop:'orderMatchRate',name:'订单配套率',type:'normal',align:'right',isShort:true,width:'80'},
                    {prop:'clientCode2',name:'经销商',type:'normal',align:'left',width:'80'},
                    {prop:'companyName',name:'销售公司',type:'normal',align:'left'},
                    {prop:'projectName',name:'工程名称',type:'normal',align:'left'}
                ],

            }
        },
        watch:{
            '$store.state.order_inventory':function (val) {
                this.$set(this.searchForm,'clientCode2',val);
                this.getData();

            }
        },
        mounted() {
            this.sysNav = this.navs[this.sideValue].children;
            this.$set(this.searchForm,'clientCode2',this.$store.state.order_inventory);
            this.getData();
            this.getTotal();

        },
        methods: {
            getData() {
                this.tableData = [];
                this.fetch(`/oms/pcs/StockSearch/getOrderInventory?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data) {
                            this.loading=false;
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })

            },
            getTotal(){
                this.fetch(`/oms/pcs/StockSearch/getOrderInventoryTotal`,this.searchForm)
                    .then(result => {
                        if(result.data) {
                            this.matchRate = result.data.matchRate;
                            this.deliveryRate = result.data.deliveryRate;
                            this.BigDecimal = result.data.digit;
                            this.planDigit = result.data.planDigit;
                            this.deliveryDigit = result.data.deliveryDigit;
                            this.lackDigit = result.data.lackDigit;
                            this.theroyWght = result.data.theroyWght;
                            this.allocDigit = result.data.allocDigit;
                            this.planTheroyWght = result.data.planTheroyWght;
                            this.deliveryTheroyWhgt = result.data.deliveryTheroyWhgt;
                            this.lackTheroyWght = result.data.lackTheroyWght;
                            this.allocTheroyWght = result.data.allocTheroyWght;



                        }else {

                        }
                    })

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
                digit ? sums[5] = digit.toFixed(3) : sums[5] =0;
                planDigit ? sums[6] = planDigit.toFixed(3) : sums[6] =0;
                deliveryDigit ? sums[7] = deliveryDigit.toFixed(3) : sums[7] =0;
                lackDigit ? sums[8] = lackDigit.toFixed(3) : sums[8] =0;
                allocDigit ? sums[9] = allocDigit.toFixed(3) : sums[9] =0;
                theroyWght ? sums[10] = theroyWght.toFixed(3) : sums[10] =0;
                planTheroyWght ? sums[11] = planTheroyWght.toFixed(3) : sums[11] =0;
                deliveryDigit ? sums[12] = deliveryDigit.toFixed(3) : sums[12] =0;
                lackTheroyWght ? sums[13] = lackTheroyWght.toFixed(3) : sums[13] =0;
                allocTheroyWght ? sums[14] = allocTheroyWght.toFixed(3) : sums[14] =0;

                return sums;

            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
                this.getTotal();
            },
            handleCheck(){
                this.searchForm={};
                this.searchForm.clientPortal=false;
                this.$store.state.order_inventory='';
                this.getData();
                this.getTotal();
            },

            handleRefresh() {
                this.$store.state.order_inventory='';
                this.getData();
            },
            //点击主表行
            handleDetail(row){
                this.$store.state.order_Code = row.clientCode2;
                this.goTargetTag(this.filterArray(this.sysNav,'resname','产品库存查询'),row);
            },
            pushExsh() {
                this.fetch(`/oms/pcs/StockSearch/exportOrderInventoryExcel`, this.searchForm, {responseType: 'blob'})
                    .then(result => {
                        this.downloads(result,'订单库存')
                    })
            }
        }
    }
</script>
