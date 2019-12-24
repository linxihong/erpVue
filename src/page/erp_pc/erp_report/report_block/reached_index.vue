<template>
    <!-- 达成指标 -->
    <div class="heigth-div scrollBar" ref="wrapHeight">
        <table class="el-table self-table adjust-tableI">
            <tr>
                <th class="is-center"><div class="cell"></div></th>
                <td style="text-indent:2em"><div class="cell top-cell">销售达成</div></td>
                <td style="text-indent:2em"><div class="cell top-cell">回款达成</div></td>
            </tr>
            <tr>
                <th class="is-center"><div class="cell">当月:</div></th>
                <td style="text-indent:2em"><div class="cell mon-cell">{{monthlist}}%</div></td>
                <td style="text-indent:2em" ><div class="cell mon-cell">{{monthpaylist}}%</div></td>
            </tr>
            <tr>
                <th class="is-center"><div class="cell">当年:</div></th>
                <td style="text-indent:2em" ><div class="cell year-cell">{{yearlist}}%</div></td>
                <td style="text-indent:2em" ><div class="cell year-cell">{{yearpaylist}}%</div></td>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                monthlist:0,
                monthpaylist:0,
                yearlist:0,
                yearpaylist:0
            }
        },

        mounted() {
            this.init();
        },

        methods: {
            init() {
                this.getlist();
            },

            //获取数据
            getlist(){
                let tempData = [];
                this.getAjax('/mktmfc/forms/getreachtarget')
                .then((result)=>{
                    if(result.status === 200){
                        tempData = result.data
                        this.monthlist = (tempData.nowmonthlist.NOW_MONTH_SEND/tempData.nowmonthlist.NOW_MONTH_ORDER).toFixed(2);
                        this.monthpaylist = (tempData.nowmonthpaylist.NOW_MONTH_SEND_PAY/tempData.nowmonthpaylist.NOW_MONTH_ORDER_PAY).toFixed(2);
                        this.yearlist = (tempData.nowyearlist.NOW_YEAR_SEND/tempData.nowyearlist.NOW_YEAR_ORDER).toFixed(2);
                        this.yearpaylist = (tempData.nowyearpaylist.NOW_YEAR_SEND_PAY/tempData.nowyearpaylist.NOW_YEAR_ORDER_PAY).toFixed(2);
                        if(this.monthlist>=1){
                            this.monthlist = this.monthlist*100;
                        }
                        if(this.monthpaylist >=1){
                            this.monthpaylist = this.monthpaylist*100;
                        }
                        if(this.yearlist >=1){
                            this.yearlist = this.yearlist*100;
                        }
                        if(this.yearpaylist >=1){
                            this.yearpaylist = this.yearpaylist*100;
                        }
                    }else {
                        this.$message({
                            message:this.returnIntercept(result),
                            type: 'error'
                        });
                    }
                })
            },
        }
    }
</script>

<style lang="less" scoped type="text/less">
    .heigth-div {
        height: 100%;
    }
    .self-table {
        th,td {
            font-weight: normal;
            border: 0px solid #fff;
        }
        tr{
           height: 60px;
        }
        // .cell{
        //     @media screen and (max-width: 1500px) {
        //        font-size: 14px;
        //     }
        //     font-size: 16px;
        // }
        .top-cell{
            font-size: 18px;
            font-weight: 550;
        }
        .mon-cell{
            font-size: 20px;
            font-weight: 530;
            color: aqua
        }
        .year-cell{
            font-size: 20px;
            font-weight: 530;
            color: #0094f5;
        }
    }
    .el-table th{
        background-color: #fff;
    }
    .bar-chart {
        width: 420px;
        height: 200px;
    }
</style>