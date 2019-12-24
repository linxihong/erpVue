<template>
    <!-- 工程类型排行 -->
    <div class="wrap-div" ref="wrapHeight">
        <div ref="bar_chart" class="bar-chart" :style = "{width:wrapWidth+'px',height:wrapHeight+'px'}"></div>
    </div>
</template>
<script>
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/component/tooltip');
    export default {
        data(){
            return {
                projecttypeData:[],
                projectqtyData:[],
                wrapHeight: 183,
                wrapWidth: 366,
            }
        },
        mounted() {
            this.init();
        },
        watch:{
            '$store.state.regionName':'getlist'
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

            //获取数据   工程类型：1-房屋建筑，2-铁路工程，3-公路，4-水利，5-其他
            getlist(){
                let tempData = [];
                this.projecttypeData = [];
                this.projectqtyData = [];
                let dataI = [];
                let area = this.$store.state.regionName;
                this.getAjax('/mktmfc/forms/getprojecttyperanking?area='+area)
                .then((result)=>{
                    if(result.status === 200){
                        tempData = result.data.projectTypeRanking;
                        if(tempData.length === 0){
                            this.projecttypeData = ['房屋建筑','铁路工程','公路工程','水利工程','其他工程'];
                            this.projectqtyData = [0,0,0,0,0];
                        }else {
                            for(let i=0; i<tempData.length; i++){
                                if(tempData[i].projecttype === 1){
                                    tempData[i].projectname = '房屋建筑'
                                }else if (tempData[i].projecttype === 2){
                                    tempData[i].projectname = '铁路工程'
                                }else if (tempData[i].projecttype === 3){
                                    tempData[i].projectname = '公路工程'
                                }else if (tempData[i].projecttype === 4){
                                    tempData[i].projectname = '水利工程'
                                }else if (tempData[i].projecttype === 5){
                                    tempData[i].projectname = '其他工程'
                                }

                                dataI.push({name:tempData[i].projectname,qty:tempData[i].qty})
                            }

                            for(let i=0; i<dataI.length; i++){
                                this.projecttypeData.push(dataI[i].name)
                                this.projectqtyData.push(dataI[i].qty)
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
                    this.setEchart(this.projecttypeData,this.projectqtyData);
                })
                
            },

            initEchart(){
                this.bar_chart = echarts.init(this.$refs.bar_chart);
            },

            setEchart(projecttypeData,projectqtyData) {
                this.bar_chart.setOption({
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    // legend: {
                    //     data:['本月','上月'],
                    //     right: '7%',
                    // },
                    grid: {
                        left: '20%',
                        height:'70%',
                        width:'75%',
                        bottom: '20%'
                    },
                    xAxis : [
                        {   
                            type: 'value',
                            name: '',
                        }
                    ],
                    yAxis : [
                        {
                            type: 'category',
                            name:'',
                            // axisTick: {
                            //     alignWithLabel: true
                            // },
                            data:projecttypeData
                        },
                    ],
                    series : [
                        {
                            name:'方量',
                            type:'bar',
                            barWidth: '20%',
                            itemStyle: {
                                normal: {
                                    color: '#6fbae1'
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right'
                                }
                            },
                            data:projectqtyData
                        },
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
        /*width: 510px;*/
        /*height: 238px;*/
    }
</style>
