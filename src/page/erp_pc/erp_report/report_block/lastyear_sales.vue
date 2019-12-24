<template>
    <!-- 历年销售对比 -->
    <div class="wrap-div" ref="wrapHeight">
    <div ref="bar_chart" class="bar-chart" :style = "{width:wrapWidth+'px',height:wrapHeight+'px'}"></div>
    </div>
</template>
<script>
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/line');
    require('echarts/lib/chart/gauge');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/legend');
    export default {
        data(){
            return{
                yearData:[],
                qtyData:[],
                wrapHeight: 210,
                wrapWidth: 342,
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.getlist();
                this.getDivHeight();
            },
            getDivHeight(){
                this.wrapHeight = this.$refs.wrapHeight.offsetHeight;
                this.wrapWidth = this.$refs.wrapHeight.offsetWidth;
            },

            //获取数据
            getlist(){
                let tempData = [];
                this.yearData = [];
                this.qtyData = [];
                this.getAjax('/mktmfc/forms/getsalescompare')
                .then((result)=>{
                    if(result.status === 200){
                        tempData = result.data.salesCompare
                        if(tempData.length === 0){
                            this.yearData = ['2017','2018'];
                            this.qtyData = [0,0];
                        }else {
                            for(let i=0; i<tempData.length; i++){
                                this.yearData.push(tempData[i].YEAR);
                                this.qtyData.push(tempData[i].qty);
                            }
                        }
                    }else {
                        this.$message({
                            message:this.returnIntercept(result),
                            type: 'error'
                        });
                    }
                })
                .then(()=>{
                    this.initEchart();
                    this.setEchart(this.yearData,this.qtyData);
                })
            },

            initEchart(){
                this.bar_chart = echarts.init(this.$refs.bar_chart);
            },

            //传参
            setEchart(yearData,qtyData) {
                //bar
                this.bar_chart.setOption({
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    // legend: {
                    //     data:['应收','实收'],
                    //     right: '7%',
                    // },
                    grid: {
                        left: '16%',
                        width:'75%',
                        height:'70%',
                        bottom: '17%'
                    },
                    xAxis : [
                        {
                            type: 'category',
                            name:'',
                            axisTick: {
                                alignWithLabel: true
                            },
                            data:yearData
                        }
                    ],
                    yAxis : [
                        {
                            type: 'value',
                        },
                    ],
                    series : [
                        {
                            name:'方量',
                            type:'bar',
                            barWidth: '10%',
                            itemStyle: {
                                normal: {
                                    color: '#008ae0'
                                }
                            },
                            data:qtyData,

                        }
                    ]
                });
            }
        }
        
    }
</script>
<style lang="less" scoped type="text/less">
    .wrap-div {
        height: 100%;
    }
    .self-table {
        th,td {
            font-weight: normal;
            border: 0px solid #fff;
        }
    }
    .el-table th{
        background-color: #fff;
    }
    .bar-chart {
        /*width: 470px;*/
        /*height: 250px;*/
    }
</style>

