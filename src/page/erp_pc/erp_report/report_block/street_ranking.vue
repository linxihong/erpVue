<template>
    <!-- 各镇街排名 -->
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
                regionnameData:['狮山镇','里水镇','大沥镇','罗村街道','丹灶镇','桂城街道','西樵镇','九江镇'],
                regionData:[],
                wrapHeight: 183,
                wrapWidth: 366,
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
                let a = 0;
                let b = 0
                this.regionData = [],
                this.getAjax('/mktmfc/forms/getarearanking')
                .then((result)=>{
                    if(result.status === 200){
                        tempData = result.data.clientOrderAreaSum;
                        if(tempData.length === 0){
                            this.regionData = [0,0,0,0,0,0,0,0]
                        }else {
                            if(this.regionnameData.length > tempData.length){
                                a = this.regionnameData.length;
                                b = tempData.length;
                            }else {
                                a = tempData.length;
                                b = this.regionnameData.length;
                            }
                            for(let i=0; i<a; i++){
                                var isEquals=false;
                                for(let j=0; j<b; j++){
                                    if(this.regionnameData[i] === tempData[j].buildsite){
                                        isEquals=true;
                                        dataI.push({name:this.regionnameData[i],qty:tempData[j].qtyorder})
                                    }
                                }
                                if(!isEquals){
                                    dataI.push({name:this.regionnameData[i],qty:0});
                                }
                            }

                            for(let i=0; i<dataI.length; i++){
                                this.regionData.push(dataI[i].qty)
                            }
                        }
                        //console.log(456,this.regionData)
                        //console.log(456,this.reduceObj(this.regionData,'name'))
                    }else {
                        this.$message({
                            message:this.returnIntercept(result),
                            type: 'error'
                        });
                    }
                })
                .then(()=>{
                    this.initEchart();
                    this.setEchart(this.regionData);
                })
                
            },

            initEchart(){
                this.bar_chart = echarts.init(this.$refs.bar_chart);
            },

            setEchart(regionData) {
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
                        height:'60%',
                        width:'75%',
                        bottom: '20%'
                    },
                    xAxis : [
                        {
                            type: 'category',
                            name:'',
                            // axisTick: {
                            //     alignWithLabel: true
                            // },
                            data:['狮山','里水','大沥','罗村','丹灶','桂城','西樵','九江']
                        }
                    ],
                    yAxis : [
                        {   
                            name: '',
                            type: 'value',
                        },
                    ],
                    series : [
                        {
                            name:'方量',
                            type:'bar',
                            barWidth: '20%',
                            itemStyle: {
                                normal: {
                                    color: '#fbb8a1'
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data:regionData
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
