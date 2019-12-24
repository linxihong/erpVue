<!--
    銷售跟單-----订单异常
-->
<template>
    <div class="Progress"
         style="height: 450px;border: 1px solid #F0F1F1;
         padding-left: 10px;padding-right: 8px;
         margin-top: 15px;background-color: white;box-shadow:0px 3px 3px #c8c8c8;border-radius: 7px;


">
        <el-row style="height: 25px;line-height: 25px;" class="abnormal">
            <el-col :span="16" style="font-size: 14px">
                <span style="font-size: 15px;font-weight: bold;">订单异常</span>
            </el-col>
            <el-col :span="8" style="text-align: end;" >
                <ul>
                    <li v-for="(item,index) in Ten"
                        :class="index==0?'abnormalI':index==1?'abnormalII':index==2?'abnormalIII':
                                index==3?'abnormalIV':index==4?'abnormalV':index==5?'abnormalVI':index==6?'abnormalVII':
                                index==7?'abnormalVIII':index==8?'abnormalIX':index==9?'abnormalX':''"
                    >{{item}}</li>
                </ul>


            </el-col>

        </el-row>
        <CommonTable
        ref="commontable"
        :mainHeight="mainHeight"
        :isShowStatus="isShowStatus"
        :propData="tablePropI"
        :otherVariable="otherVariable"
        :tableData="ExceptionList"
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
                tablePropI: [
                    {prop: 'refDocCode', name: '订单号', type: 'normal', align: 'left', tooltip: true, width: '120'},
                    {prop: 'deliveryDate', name: '交期', type: 'normal', align: 'left', tooltip: true, width: "90"},
                    {prop: 'projectName', name: '工程名称', type: 'normal', align: 'left', tooltip: true,},
                    {
                        prop: 'ledgerStatusName',
                        name: '状态',
                        type: 'normal',
                        align: 'center',
                        width: '80',
                        tooltip: true,
                    },
                    {
                        prop: 'auditingOrderOverDay',
                        name: '审核超期',
                        type: 'Exception',
                        align: 'center',
                        width: '80',
                        tooltip: true,
                    },
                    {
                        prop: 'signingOrderOverDay',
                        name: '签批超期',
                        type: 'Exception',
                        align: 'center',
                        tooltip: true,
                        width: '80'
                    },
                    {
                        prop: 'productOverDay',
                        name: '生产超期',
                        type: 'Exception',
                        align: 'center',
                        width: '80',
                        tooltip: true,
                    },
                    {
                        prop: 'takeDeliveryOverDay',
                        name: '提货超期',
                        type: 'Exception',
                        align: 'center',
                        isShort: true,
                        tooltip: true,
                        width: '80',
                    },
                    {
                        prop: 'overDayRate',
                        name: '超期率',
                        type: 'circle',
                        align: 'center',
                        isShort: true,
                        tooltip: true,
                        width: '80',
                    },
//                    {prop:'allocDigitI', name:'快速处理',type:'normal',align:'left',isShort:true,tooltip: true,},
                ],
                Ten:[1,2,3,4,5,6,7,8,9,10],
                mainHeight: 400,
                isShowStatus: {
                    isRead: true,
                    isPopUp: false,
                },
                otherVariable: {
                    isReadTable: true
                },

                ExceptionList: [],


            }
        },
        mounted() {
            this.getSlsOrderException();

        },
        methods: {
            getSlsOrderException() {
                this.ExceptionList = [];
                this.fetch(`/oms/MyIndexController/getSlsOrderException?pageNo=1&pageSize=5`, {})
                    .then(result => {
                        if (result.status === 200 && result.data) {
                            this.ExceptionList = result.data.list;
                        } else {
                            this.ExceptionList = [];
                        }
                    })
//            },

            }
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
