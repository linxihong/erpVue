<!--客戶回款情況-->
<template>
    <div
        class="Progress"
        style="height: 342px; width:100%;border: 1px solid #F0F1F1;padding-left: 10px;padding-right: 8px;
         margin-top: 15px;background-color: white;box-shadow:0px 3px 3px #c8c8c8;border-radius: 7px;
">
        <el-row style="height: 30px;line-height: 30px;">
            <el-col :span="12" style="font-size: 14px">
                <span style="font-size: 15px;font-weight: bold;">客户回款情况</span>
            </el-col>
            <el-col :span="12" style="text-align: end;">
                <el-form :inline="true" :model="ReceiveList">
                    <el-form-item label="">
                        <el-date-picker
                            style="width: 100%"
                            v-model="ReceiveList.beginDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            @change="changeDateI"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="至">
                        <el-date-picker
                            style="width: 100%"
                            v-model="ReceiveList.endDate"
                            type="date"
                            @change="changeDateII"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>

            </el-col>
        </el-row>

        <div ref="myChart4" :style="{width: '1000px', height: '300px'}" class="myChart"></div>

    </div>
</template>

<script>
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/line');
    require('echarts/lib/chart/bar');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/legend');
    export default {
        props: {
            'TodoList': {
                type: Array
            },
            'otherVariable': {
                type: Object
            },
            'propData': {
                type: Array
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
                ReceiveList:{
                    endDate:this.recentDate(0),
                    beginDate:this.recentDate(-6),
                },
                RdateList:[],
                tableDateI:[],
                RloneDate:[],
                BloneDate:[],
                tableDateII:[],


            }
        },
        mounted(){
            this.getClientReceiveList();
            this.getClientBalanceList();
        },
        methods: {
            //客户回款情况（实收）
            getClientReceiveList() {
                this.RdateList = this.getdiffdate(this.ReceiveList.beginDate,this.ReceiveList.endDate);
                this.RloneDate=[];
                this.fetch(`/oms/MyIndexController/getClientReceiveList?pageNo=1&pageSize=10`,{
                    beginDate: this.ReceiveList.beginDate,
                    endDate: this.ReceiveList.endDate,
                })
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            this.tableDateI= result.data;
                            this.RdateList.forEach(item=>{
                                let tempObjI ={};
                                tempObjI.name = item;
                                if(this.tableDateI.find(v => v.docDate === item)) {
                                    tempObjI.value = (this.tableDateI.find(v => v.docDate === item)).receiveMoney;

                                }else {
                                    tempObjI.value = 0;
                                }

                                this.RloneDate.push(tempObjI.value/10000);



                            })
                        }
                    })
                    .then(() => {

                        this.drawLine();
                    })
            },
            //客户回款情况（应收）
            getClientBalanceList() {
                this.RdateList = this.getdiffdate(this.ReceiveList.beginDate,this.ReceiveList.endDate);
                this.BloneDate=[];
                this.fetch(`/oms/MyIndexController/getClientBalanceList?pageNo=1&pageSize=10`,{
                    beginDate: this.ReceiveList.beginDate,
                    endDate: this.ReceiveList.endDate,
                })
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            this.tableDateII= result.data;
                            this.RdateList.forEach(item=>{
                                let tempObjI ={};
                                tempObjI.name = item;
                                if(this.tableDateII.find(v => v.docDate === item)) {
                                    tempObjI.value = (this.tableDateII.find(v => v.docDate === item)).balanceTotoalMoney;
                                }else {
                                    tempObjI.value = 0;
                                }
                                this.BloneDate.push(tempObjI.value/10000);
                                console.log(333,this.BloneDate);


                            })
                        }else{
                            this.tableDateII='';
                        }
                    })
                    .then(() => {
                        this.drawLine();
                    })
            },
          drawLine(){
              this.myChart4 = echarts.init(this.$refs.myChart4);
              this.myChart4.setOption({
                  tooltip : {
                      trigger: 'axis'
                  },
                  legend: {
                      data:['应收汇款金额','实际汇款金额']
                  },
                  toolbox: {
                      show : true,
                      feature : {
                          dataView : {show: true, readOnly: false},
                          magicType : {show: true, type: ['line', 'bar']},
                          restore : {show: true},
                          saveAsImage : {show: true}
                      }
                  },
                  calculable : true,
                  xAxis : [
                      {
                          type : 'category',
                          data :this.RdateList
                      }
                  ],
                  yAxis : [
                      {
                          type : 'value',
                          name: '单位(万元)',//y轴标题
                      }
                  ],
                  series : [
                      {
                          name:'应收汇款金额',
                          type:'bar',
                          data:this.BloneDate,
                          itemStyle:{
                              normal:{
                                  color:'#00BAFF'
                              }
                          }


                      },
                      {
                          name:'实际汇款金额',
                          type:'line',
                          data:this.RloneDate,
                          itemStyle : {
                              normal : {
                                  color:'#D05A56',
                                  lineStyle:{
                                      color:'#D05A56'
                                  }
                              }
                          },

                      }
                  ]

              })

          },
            //客户回款开始日期
            changeDateI(val){
                this.BloneDate=[];
                this.RloneDate=[];
                this.ReceiveList.beginDate = val;
                let a = Date.parse(this.ReceiveList.beginDate);
                let b = Date.parse(this.ReceiveList.endDate);

                if(b>a){
                    val = this.ReceiveList.beginDate;
                    this.getClientReceiveList();
                    this.getClientBalanceList();
                }else{

                    this.$message({
                        message:'开始实际不能大于结束时间',
                        type:'warning'
                    })

                }
            },
            //客户回款结束日期
            changeDateII(val){
                this.BloneDate=[];
                this.RloneDate=[];
                this.ReceiveList.endDate = val;
                let a = Date.parse(this.ReceiveList.beginDate);
                let b = Date.parse(this.ReceiveList.endDate);

                if(b>a){
                    this.ReceiveList.endDate = val;
                    this.getClientReceiveList();
                    this.getClientBalanceList();

                }else{
                    this.$message({
                        message:'开始实际不能大于结束时间',
                        type:'warning'
                    })

                }
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


</style>
