<!--未来七天走势-->
<template>
    <div
        style="padding-left: 15px;
        width: 98%;
        border: 1px solid #F0F1F1;
        margin-left: 14px;margin-top: 10px;
        height: 200px; background-color: white;box-shadow:0px 3px 3px #c8c8c8;border-radius: 7px;


">
        <el-row>
            <el-col :span="20" style="font-size: 14px">
                <span style="font-size: 16px;font-weight: bold;">未来七天发货走势</span>
            </el-col>
        </el-row>
        <div style="text-align: center;color: #A09D98">暂无数据</div>
        <!--<div ref="myChart" :style="{width: '700px', height: '300px'}" class="myChart"></div>-->
    </div>
</template>

<script>
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/line');
    require('echarts/lib/chart/bar');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/legend');

    export default {
        components: {

        },
        data() {
            return {
                isLeeSearchShow: true,
                projectDetails: {},
            }
        },
        mounted(){
            //this.drawLine();

        },

        methods: {
//            drawLine(){
//                this.myChart = echarts.init(this.$refs.myChart);
   //         this.myChart.setOption({
////                    title: { text: '在Vue中使用echarts' },
////                    tooltip: {
////                        trigger:'axis'
////                    },
////                    legend: {
////                        icon: 'rect',
////                        right: '10%',
////
//////                        data: nameList,
//////                        selected: this.selected
////                    },
////                    grid: { //定位位置
////                        left: '5%',
////                        bottom: '10%',
////                        top:'50%',
////                        containLabel: true
////                    },
////                    xAxis: { //y轴标题
////                        data: ["2018-12-24","2018-12-25","2018-12-26","2018-12-27","2018-12-28","2018-12-28"]
////                    },
////                    yAxis:
////                        {
////                            name: '单位(元/吨)',//y轴标题
////                            type: 'value',
////                            show: true,
////                            splitLine:{
////                                show: false
////                            },
////                            nameTextStyle: {
////                                color: '#000'
////                            },
////                            axisLabel: {
////                                color: '#000',
////                                margin: 12
////                            },
////                            axisTick: {
////                                length: 8
////                            },
////                            axisLine: {
////                                lineStyle: {
////                                    color: 'orange',
////                                    width: 3
////                                }
////                            }
////                        },
////
////                    series: [
////                        {
////                            name: '销量',
////                            type: 'bar',
////                            data: [5, 20, 36, 10, 10, 20]
////                        }
////                    ]
////                });
//
//
//
           }

    }
</script>

<style lang="less" type="text/less" scoped>
</style>
