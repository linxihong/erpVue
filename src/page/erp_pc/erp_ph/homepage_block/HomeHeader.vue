
<template>
  <div class="block_wrap">
      <el-row :gutter="5" style="background-color: white;padding: 3px;">
          <el-col :span="6"  v-for="(item,index) in propData" :key="index">
              <div
                  :class="index==0?'colorOne':index==1?'colorTwo':index==2?'colorThree':index==3?'colorFour':'colorOne'"
                  style="height: 100px;border-radius: 7px;">
                  <p  style="margin-top: 0px;padding: 10px;color: white;font-weight: 600;font-size: 18px;">{{item.name}}</p>
                  <p style="margin-top: 0px;color: white;font-weight: 600;font-size: 23px;padding-right: 10px;text-align: right;" v-if="item.prop">{{homeData[item.prop]/1000}}
                      <span v-if="item.prop =='clientBalance'">万元</span> <span v-else>t</span></p>
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
                homeData: {},
                //header映射列表
                propData:[
                    {
                        name:'可用货库存理论重量',
                        prop:'orderInventory',
                    },
                    {
                        name:'超期账款金额',
                        prop:''
                    },
                    {
                        name:'结余账款金额',
                        prop:'clientBalance'
                    },
                    {
                        name:'剩余信用额度',
                        prop:''
                    },

                ],


            }
        },
        mounted(){
            this.getClientBalance();
        },
        methods: {
            getClientBalance() {
                this.fetch(`/oms/MyIndexController/getIndexHeader`, {})
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

<style scoped>
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
