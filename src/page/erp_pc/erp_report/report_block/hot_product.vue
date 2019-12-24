<template>
    <!-- 热门产品 -->
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
                productnameData:[],
                productData:[],
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

            //获取数据
            getlist(){
                let tempData = [];
                this.productnameData = [];
                this.productData = [];
                let area = this.$store.state.regionName;
                this.getAjax('/mktmfc/forms/gethotgoods?area='+area)
                .then((result)=>{
                    if(result.status === 200){
                        tempData = result.data.hotGoodsList;
                        if(tempData.length === 0){
                            this.productnameData = ['C30','C25','C15','C10'];
                            this.productData = [0,0,0,0];
                        }else {
                            for(let i=0; i<tempData.length; i++){
                                this.productnameData.push(tempData[i].goodscode);
                                this.productData.push(tempData[i].sendqty);
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
                    this.setEchart(this.productnameData,this.productData);
                })
            },

            initEchart(){
                this.bar_chart = echarts.init(this.$refs.bar_chart);
            },

            setEchart(productnameData,productData) {
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
                        left: '16%',
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
                            data:productnameData
                        },
                    ],
                    series : [
                        {
                            name:'方量',
                            type:'bar',
                            barWidth: '20%',
                            itemStyle: {
                                normal: {
                                    color: '#e58dc2'
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right'
                                }
                            },
                            data:productData
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
