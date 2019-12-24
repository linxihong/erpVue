<template>
    <div class="chart-div">
        <!--<div class="myChart" ref="myChart"></div>-->
        <div class="bot-arrow"></div>
        <div class="left-arrow"></div>
        <div class="y-text">
            <span>生</span>
            <span>产</span>
            <span>配</span>
            <span>送</span>
            <span>各</span>
            <span>个</span>
            <span>环</span>
            <span>节</span>
        </div>
        <div class="time-wrap">
            <div class="item-div itemI">
                <div class="text">发送生产指令</div>
                <div class="time">{{sendObj.producecommandtime}}分钟</div>
            </div>
            <div class="item-div itemII">
                <div class="text">机楼打料</div>
                <div class="time">{{sendObj.makematerialtime}}分钟</div>
            </div>
            <div class="item-div itemIII">
                <div class="text">质检</div>
                <div class="time">{{sendObj.qualitychecktime}}分钟</div>
            </div>
            <div class="item-div itemIV">
                <div class="text">车辆去工地</div>
                <div class="time">{{sendObj.targetbuildsitetime}}分钟</div>
            </div>
            <div class="item-div itemV">
                <div class="text">工地卸料</div>
                <div class="time">{{sendObj.buildsiteoffloadtime}}分钟</div>
            </div>
            <div class="item-div itemVI">
                <div class="text">车辆回站</div>
                <div class="time">{{sendObj.targetstarttime}}分钟</div>
            </div>
        </div>
        <div class="xtext xtextI">{{sendObj.producecommandtime}}</div>
        <div class="xtext xtextII">{{sendObj.producecommandtime+sendObj.makematerialtime}}</div>
        <div class="xtext xtextIII">{{sendObj.producecommandtime+sendObj.makematerialtime+sendObj.qualitychecktime}}</div>
        <div class="xtext xtextIV">{{sendObj.producecommandtime+sendObj.makematerialtime+sendObj.qualitychecktime+sendObj.targetbuildsitetime}}</div>
        <div class="xtext xtextV">{{sendObj.producecommandtime+sendObj.makematerialtime+sendObj.qualitychecktime+sendObj.targetbuildsitetime+sendObj.buildsiteoffloadtime}}</div>
        <div class="xtext xtextVI">{{sendObj.producecommandtime+sendObj.makematerialtime+sendObj.qualitychecktime+sendObj.targetbuildsitetime+sendObj.buildsiteoffloadtime+sendObj.targetstarttime}}</div>
        <div class="x-text">时间(分钟)</div>
    </div>
</template>

<script>
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/legend');
    export default {
        data() {
            return {
                sendObj: {
                    producecommandtime: 0,
                    makematerialtime: 0,
                    qualitychecktime: 0,
                    targetbuildsitetime: 0,
                    buildsiteoffloadtime: 0,
                    targetstarttime: 0
                }
            }
        },
        methods: {
            //echart
            initEchart(sendnum) {
                //this.myChart = echarts.init(this.$refs.myChart);
                this.fetch('/location/prodsendmonitor/prodsendMonitorInfos',{sendnum:sendnum})
                    .then(result => {
                        if(result.status === 200) {
                            this.sendObj = result.data;
                            //this.setCustomChart(result.data);
                        }else {

                        }
                    })
            },

            //配置echart
            setCustomChart(obj) {
                let lastII = 0, lastIII = 0, lastIV = 0, lastV = 0, lastVI;
                lastII = obj.targetstarttime + obj.buildsiteoffloadtime;
                lastIII = lastII + obj.targetbuildsitetime;
                lastIV = lastIII + obj.qualitychecktime;
                lastV = lastIV + obj.makematerialtime;
                lastVI = lastV + obj.producecommandtime;
                this.myChart.setOption({
                    grid: {
                        left: '15%',
                        top: '10%'
                    },
                    xAxis: {
                        name: '时间(分钟)',
                        type : 'value',
                        axisLine:{
                            symbol: ['none', 'arrow']
                        }
                    },
                    yAxis: {
                        name: '生产配送各个环节',
                        type : 'category',
                        axisTick: false,
                        splitLine: {show:false},
                        data: ['车辆回到拌站耗时','工地卸料时间','车辆去工地时','质检时间','生产打料时间','发送生产指令时间'],
                        axisLine:{
                            symbol: ['none', 'arrow']
                        },
                        nameLocation: 'middle',
                        nameTextStyle: {
                            fontWeight: 500,
                            fontSize: 14
                        },
                        axisLabel: {
                            show: false
                        }
                    },
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            stack:  '总量',
                            itemStyle: {
                                normal: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: 'rgba(0,0,0,0)'
                                },
                                emphasis: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: 'rgba(0,0,0,0)',
                                }
                            },
                            data: [lastVI - obj.targetstarttime,lastVI - lastII,lastVI - lastIII,lastVI- lastIV,lastVI - lastV,0]
                        },
                        {
                            name: '',
                            type: 'bar',
                            stack: '总量',
                            barWidth: 15,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right',
                                    formatter: '{b}\n{c}分钟'
                                }
                            },
                            data:[
                                {value:obj.targetstarttime, itemStyle:{normal:{color:"#670b88"}}},
                                {value:obj.buildsiteoffloadtime, itemStyle:{normal:{color:"#0300fa"}}},
                                {value:obj.targetbuildsitetime, itemStyle:{normal:{color:"#00878c"}}},
                                {value:obj.qualitychecktime, itemStyle:{normal:{color:"#857f00"}}},
                                {value:obj.makematerialtime, itemStyle:{normal:{color:"#ff6500"}}},
                                {value:obj.producecommandtime, itemStyle:{normal:{color:"#fc0000"}}}
                            ]
                        }
                    ]
                });
            }
        }
    }
</script>

<style lang="less" scoped type="text/less">
    .chart-wrap {
        width: 600px;
        height: 720px;
        @media screen and (max-width: 1500px) {
            height: 550px;
        }
        @media screen and (min-width: 1200px) and (max-width: 1500px) {
            height: 470px;
        }
    }
    .myChart {
        width: 800px;
        height: 400px;
    }
    .chart-div {
        position: relative;
    }
    .x-text {
        position: absolute;
        right: 6%;
        bottom: -5%;
        color: #000;
        font-weight: 600;
    }
    .y-text {
        left: 5%;
        top: 35%;
        position: absolute;
        color: #000;
        font-weight: 600;
        display: inline-flex;
        flex-direction: column;
    }
    .left-arrow {
        position: absolute;
        left: 6%;
        top: -5%;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-bottom-color: #000;
    }
    .bot-arrow {
        position: absolute;
        right: 6%;
        bottom: -2%;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-left-color: #000;
    }
    .time-wrap {
        width: 700px;
        height: 400px;
        border-left: 2px solid #000;
        border-bottom: 2px solid #000;
        margin: 20px 70px 20px auto;
        position: relative;
        .item-div {
            position: absolute;
            text-align: center;
            border-right: 1px dashed #ccc;
            height: 100%;
        }
        .text {
            color: #ae1d3a;
            line-height: 1.2;
            font-weight: 600;
        }
        .time {
            height: 20px;
            color: white;
            text-align: center;
            border: 1px solid #000;
        }
        .itemI {
            left: 0;
            top: 10%;
            width: 7%;
            .time {
                background: #fc0000;
            }
        }
        .itemII {
            left: 7%;
            top: 25%;
            width: 13%;
            .time {
                background: #ff6500;
            }
        }
        .itemIII {
            left: 20%;
            top: 40%;
            width: 9%;
            .time {
                background: #857f00;
            }
        }
        .itemIV {
            left: 29%;
            top: 55%;
            width: 22%;
            .time {
                background: #00878c;
            }
        }
        .itemV {
            left: 51%;
            top: 70%;
            width: 18%;
            .time {
                background: #0300fa;
            }
        }
        .itemVI {
            left: 69%;
            top: 85%;
            width: 22%;
            .time {
                background: #670b88;
            }
        }
    }
    .xtext {
        position: absolute;
        bottom: -5%;
        font-weight: 600;
        color: #000;
    }
    .xtextI {
        left: 12%;
    }
    .xtextII {
        left: 23%;
    }
    .xtextIII {
        left: 30%;
    }
    .xtextIV {
        left: 49%;
    }
    .xtextV {
        left: 64%;
    }
    .xtextVI {
        left: 82%;
    }
</style>