<template>
    <!-- 销售方量 -->
    <div class="wrap-div" ref="wrapHeight">
        <div ref="bar_chart" class="bar-chart" :style = "{width:wrapWidth+'px',height:wrapHeight+'px'}"></div>
    </div>
</template>
<script>
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/line');
    require('echarts/lib/component/tooltip');
    export default {
        data(){
            return {
                sendqtyData:[],
                wrapHeight: 157,
                wrapWidth: 842,
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
                let dataI = [];
                let dataII = [];
                this.fetch('/mktmfc/forms/getyieldmsg?datetype=2', {})
                .then((result)=>{
                    if(result.status === 200){
                        tempData = result.data;
                        if(tempData.length === 0){
                            this.sendqtyData = [100,200,300,452,620,410,952,400,320,456,852,123];
                        }else {
                            for(let i=0; i<tempData.length; i++){
                                dataI.push(tempData[i].senddate);
                                dataII.push(tempData[i].sendqty);
                            }
                            this.sendqtyData = this.returnReconstruction(dataI,dataII,this.returnWeek('year'))[1]
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
                    this.setEchart(this.sendqtyData);
                })
            },

            initEchart(){
                this.bar_chart = echarts.init(this.$refs.bar_chart);
            },

            setEchart(sendqtyData) {
                this.bar_chart.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '10%',
                        height:'70%',
                        width:'85%',
                        bottom: '20%'
                    },
                    xAxis:  {
                        type: 'category',
                        name:'',
                        boundaryGap: false,
                        data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                    },
                    yAxis: {
                        name:"",
                        type: 'value',
                        //interval: 200,
                        axisLabel: {
                            // formatter: '{value} °C'
                        }
                    },
                    series: [
                        {
                            name:'订单方量',
                            type:'line',
                            itemStyle:{normal:{color: '#00c26f'}},
                            data:sendqtyData,
                            symbolSize: 12,
                            smooth: true,
                            areaStyle: {
                                normal: {
                                    color: '#c5f0bb'
                                }
                            },
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
    .bar-chart {
        /*width: 1100px;*/
        /*height: 203px;*/
    }
</style>
