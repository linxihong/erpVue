<!--//商务经理主页-->
<template>
    <div >
        <el-row :gutter="5" style="background-color: white;padding: 3px;">
            <el-col :span="6"  v-for="(item,index) in propData" :key="index">
                <div
                    :class="index==0?'colorOne':index==1?'colorTwo':index==2?'colorThree':index==3?'colorFour':'colorOne'"
                    style="height: 100px;border-radius: 7px;">
                    <p  style="margin-top: 5px;padding: 10px;color: white;font-weight: 600;font-size: 18px;">{{item.name}}</p>
                    <p style="margin-top: 0px;color: white;font-weight: 600;font-size: 23px;padding-right: 10px;text-align: right;" v-if="item.prop&&homeData.length>=0">{{homeData[item.prop]/1000}}
                        <span v-if="item.prop =='clientReceive' || item.prop =='clientBalance'">万元</span> <span v-if="item.prop =='overStock'|| item.prop =='deliveryStock' || item.prop =='allStock'">t</span>
                        <span v-if="item.prop =='clientReceiveRate'">%</span> <span v-if="item.prop =='stockInYear'">万吨</span>

                    </p>
                    <p style="margin-top: 0px;color: white;font-weight: 600;font-size: 23px;padding-right: 10px;text-align: right;" v-else="">暂无数据</p>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        props: {

            'otherVariable': {
                type: Object
            },

            'addForm': {
                type: Object
            },
            'addRules': {
                type: Object
            },
            'headHeight': {
                type: String,
                default: '120px'
            },
            'marginTop': {
                type: String,
                default: '10px'
            }
        },
        data() {
            return {
                ManagerDate:{
                    beginDate:this.recentDate(0),
                },
                homeData: {},
                //header映射列表
                propData:[
                    {
                        name:'客户积压库存',
                        prop:'overStock',
                    },
                    {
                        name:'今日通知发货总量',
                        prop:'deliveryStock'
                    },
                    {
                        name:'客户应付超期率',
                        prop:''
                    },

                    {
                        name:'客户应付金额汇总',
                        prop:'clientReceive'
                    },
                    {
                        name:'客户总库存',
                        prop:'allStock'
                    },
                    {
                        name:'今年接单总量',
                        prop:'stockInYear'
                    },


                    {
                        name:'客户回款率',
                        prop:'clientReceiveRate'
                    },
                    {
                        name:'客户应付回款金额',
                        prop:'clientBalance'
                    },

                ],


            }
        },
        mounted(){
            this.getManagerIndexHeader();
        },
        methods: {
            getManagerIndexHeader() {
                this.fetch(`/oms/MyIndexController/getManagerIndexHeader`, {})
                    .then(result => {
                        if(result.status==200) {
                            this.homeData = result.data;
//                            console.log(111,this.homeData)
//                            this.ClientBalance = this.homeData.clientBalance;
//                            this.OrderInventory = result.data.orderInventory;
                        }else{
                            this.ClientBalance = '暂无数据';
                        }
                    })
            },

        }
    }
</script>

<style>
    .banClick {
        cursor: not-allowed!important;
    }
    .colorOne{
        background: linear-gradient(to right,#B076EC,#E688FE);
    }
    .colorTwo{
        background: linear-gradient(to right,#77ABF5,#6CC7F2);
    }
    .colorThree{
        background: linear-gradient(to right,#52CCD1,#85DDBE);
    }
    .colorFour{
        background: linear-gradient(to right,#F77EE3,#F888BE);
    }

</style>
