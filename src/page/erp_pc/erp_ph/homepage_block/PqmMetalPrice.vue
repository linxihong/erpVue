<!--今日鋁價-->
<template>
    <div>
        <div class="echtable"
             style="padding-left: 20px;
             width: 98%;
             border: 1px solid #F0F1F1;margin-left: 15px;
             margin-top: 12px;height: 240px;
             background-color: white;box-shadow:0px 3px 3px #c8c8c8;border-radius: 7px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item >
                    <span>今日铝锭价</span>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker
                        style="width: 100%"
                        v-model="formInline.priceDate"
                        type="date"
                        @change="changeDate"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-select  v-model="formInline.fName" @change="changePrice">
                        <el-option
                            v-for="(item,index) in ChanceList"
                            :key="index"
                            :label="item.fname"
                            :value="item.fcode"
                        ></el-option>

                    </el-select>
                </el-form-item>
            </el-form>

            <div ref="myChart" :style="{width: '700px', height: '260px'}" class="myChart"></div>
            <div style="position: absolute;top: 43px;left: 510px;font-size: 20px;color: darkgreen;">¥{{todayTol}} <span style="font-size: 15px;color: black;">万元/吨</span></div>
        </div>
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
                formInline:{
                    priceDate:this.recentDate(0),
                    fCode:10002,
                },
                searchForm: {
                    overDate:this.recentDate(0),
                    beginDate:this.recentDate(-6),
                },
                dateList: this.returnNeddDate('lastSeven'),
                tableData: [],
                aloneData: [],
                ChanceList:[],
                todayTol:"",

            }
        },
        mounted(){
            this.getTableData();
            this.getPriceList();
            this.$set(this.formInline,'fName','南海有色铝');
        },
        methods: {
            getTableData() {
                this.dateList = this.getdiffdate(this.searchForm.beginDate,this.formInline.priceDate);
                this.aloneData = [];
                this.fetch(`/oms/MyIndexController/getPqmMetalPrice?pageNo=1&pageSize=10`,{
                    beginDate: this.searchForm.beginDate,
                    overDate: this.formInline.priceDate,
                    priceListCode: this.formInline.fCode,
                })
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            this.tableData = result.data;
                            this.dateList.forEach(item => {
                                let tempObj = {};
                                tempObj.name = item;
                                if(this.tableData.find(v => v.priceDate === item)) {
                                    tempObj.value = (this.tableData.find(v => v.priceDate === item)).price;
                                }else {
                                    tempObj.value = 0;
                                }
                                this.aloneData.push(tempObj.value/10000);
                                //获取当前价格
                                // this.aloneData[this.aloneData.length-1];
                                this.todayTol=this.aloneData[this.aloneData.length-1]


                            });

                        }
                    })
                    .then(() => {
                        this.drawLine();
                    })
            },
            //获取铝价品种
            getPriceList(){
                this.fetch(`/oms/MyIndexController/getPriceList`,{
                    listType:'铝锭价目'
                })
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            this.PriceList = result.data;
                            this.PriceList.forEach(item=>{

                                this.Fname=item.fname;
                                this.Fcode=parseFloat(item.fcode);
                                let tempObj={};
                                tempObj.fname=this.Fname;
                                tempObj.fcode = this.Fcode;

                                this.ChanceList.push(tempObj);
                            })

                        }

                    })
            },
            changeDate(val) {
                let item;
                if (val) {
                    this.formInline.priceDate = val;
                    item = this.dateList.find(item => item === val);
                    this.fun_submit(val);
                    this.getTableData();

                } else {
                    this.formInline.priceDate = '';
                }

            },
            //7天后的时间
            fun_submit(item){
                //获取选中日期
                var date1 = new Date(item);
                var date2 = date1.getDate();
                //获取当前日期
                var date3 = new Date().getDate();
                //获取日期差
                var date4= date3-date2;

                this.searchForm.beginDate=this.recentDate(-6-date4)

            },
            changePrice(val){
                let item;
                if(val){
                    item = this.PriceList.find(item =>item.fcode ==val);
                    this.formInline.fName = item.fname;
                    this.formInline.fCode = item.fcode;
                    this.formInline.priceDate=this.recentDate(0);
                    this.getTableData();

                }

            },
            drawLine(){
                this.myChart = echarts.init(this.$refs.myChart);  //今日铝锭价
                this.myChart.setOption({
                    title: { text: '在Vue中使用echarts' },
                    tooltip: {},
                    legend: {
                        icon: 'rect',
                        right: '5%',
//                        data: nameList,
//                        selected: this.selected
                    },
                    grid: { //定位位置
                        left: '12%',
                        right: '12%',
                        bottom: '40%',
                        top:'15%',
//                        containLabel: true
                    },
                    xAxis: { //y轴标题
                        type:'category',
                        boundaryGap:false,
                        data: this.dateList
                    },
                    yAxis:
                        {
                            name: '单位(万元/吨)',//y轴标题
                            type: 'value',
                            show: true,
                            splitLine:{
                                show: false
                            },
                            nameTextStyle: {
                                color: '#000'
                            },
                            axisLabel: {
                                color: '#000',
                                margin: 12
                            },
                            axisTick: {
                                length: 8
                            },
                            axisLine: {
                                lineStyle: {
                                    color: 'orange',
                                    width: 3
                                }
                            }
                        },

                    series: [{
                        name: '销量',
                        type: 'line',
                        data: this.aloneData
                    }]
                });
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


</style>
