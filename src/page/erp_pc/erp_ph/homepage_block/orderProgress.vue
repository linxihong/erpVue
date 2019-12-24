<!--
    客户主页-----订单进度
-->
<template>
    <div class="Progress"
         style="height: 450px;border: 1px solid #F0F1F1;padding-left: 10px;padding-right: 8px; margin-top: 15px;
         background-color: white;box-shadow:0px 3px 3px #c8c8c8;border-radius: 7px;


">

    <el-row>
    <el-col :span="20" style="font-size: 14px">
    <i class="el-icon-message"></i> <span>订单进度</span>
    </el-col>
    <el-col :span="4" style="text-align: end; cursor: pointer;" > <el-button type="text" @click="JunpPage" style="color: black">更多</el-button> <i class="el-icon-d-arrow-right"></i></el-col>
    </el-row>

    <CommonTable
    ref="commontable"
    :mainHeight="mainHeight"
    :isShowStatus="isShowStatus"
    :propData="tableProp"
    :otherVariable="otherVariable"
    :tableData="tableData3"
    >
    </CommonTable>

    </div>
</template>

<script>
    import CommonTable from '$src/components/CommonTable'
    export default {
        components: {
            CommonTable,
        },
        data() {
            return {
                mainHeight: 400,
                //订单进度表格映射列表
                tableProp: [
                    {prop:'refDocCode',name:'订单号',type:'normal',align:'left',tooltip: true,width:'120'},
                    {prop:'deliveryDate',name:'交期',type:'normal',align:'left',tooltip: true,width:"90"},
                    {prop:'projectName',name:'工程名称',type:'normal',align:'left',tooltip: true,width:'120',},
                    {prop:'ledgerStatusName', name:'状态',type:'normal',align:'left',width:'100',tooltip: true,},
                    {prop:'digit', name:'订单总量',type:'normal',align:'left',width:'100',tooltip: true,},
                    {prop:'productDigit', name:'生产入库',type:'normal',align:'left',tooltip: true,width:'80'},
                    {prop:'cx1Name', name:'已提库',type:'normal',align:'left',width:'70',tooltip: true,},
                    {prop:'allocDigit', name:'可用库存',type:'normal',align:'left',isShort:true,tooltip: true,},
                    {prop:'orderMatchRate', name:'配套率',type:'circle',align:'left',isShort:true,tooltip: true,},
                    {prop:'orderDeliveryRate', name:'提货率',type:'circle',align:'left',isShort:true,tooltip: true,},

                ],
                isShowStatus: {
                    isRead: true,
                    isPopUp: false,
                },
                otherVariable: {
                    isReadTable: true
                },
                tableData3:[],
                navs:this.$store.getters.getSideNavlist||[],
                sideValue: sessionStorage.getItem('sideValue')!==undefined?parseInt(sessionStorage.getItem('sideValue')):0,
                sysNav: [],


            }
        },
        mounted() {
            this.getOrderData();
            this.sysNav = this.navs[this.sideValue].children;

        },
        methods: {
            getOrderData() {
                this.fetch(`/oms/MyIndexController/getOrderSchedule?pageNo=1&pageSize=5`, {})
                    .then(result => {
                        if (result.data) {
                            this.loading=false;
                            this.tableData3 = result.data.list;

                            //this.pageObj.commonTotal = result.data.total;
                        } else {
                            this.tableData3="";
                            // this.pageObj.commonTotal = 0;
                        }
                    })
            },
            JunpPage(){
                console.log(112146);
                this.goTargetTag(this.filterArray(this.sysNav,'resname','订单查询'))
            },
        }
    }
</script>

<style>
    .todoList{
        height: 250px;
        border: 1px solid  #F0F1F1;
        padding-left: 10px;
        padding-right: 8px;
        background-color: white;
        box-shadow:0px 3px 3px #c8c8c8;
        border-radius: 7px;

    }
    .abnormal ul li{
        float: left;
        width: 25px;
        padding: 0 8px;
    }
    .abnormalI{
        background-color: #FFEAE5;
    }
    .abnormalII{
        background-color: #FFC3B9;
    }
    .abnormalIII{
        background-color: #FF9C91;
    }
    .abnormalIV{
        background-color: #FF7369;
    }
    .abnormalV{
        background-color: #FF4640;
    }
    .abnormalVI{
        background-color: #FF2619;
        color: white;
    }
    .abnormalVII{
        background-color: #D91F11;
        color: white;
    }
    .abnormalVIII{
        background-color: #B3170B;
        color: white;
    }
    .abnormalIX{
        background-color: #8C100D;
        color: white;
    }
    .abnormalX{
        background-color: #66090E;
        color: white;
    }



</style>
