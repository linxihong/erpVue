<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="5"  v-for="(value,key) in headerRow" :key="key">
                <div >{{key}}：{{value}}</div>
            </el-col>
            <el-col :span="4" >
                <div >{{formData.prdMethodName}}</div>
            </el-col>
        </el-row>
        <header class="green-header">
            <h2 class="f-tac console-mt1 console-mb1">{{formData.projectName}} {{formData.projectCode}}</h2>
            <section>
                <span class="detail-span" v-for="(value,key) in headerMain " :key="key" >
                    {{key}}：{{value}}
                </span>
            </section>
            <article class="ico-item">
                <i class="icon-edit" @click="editFrom" title="修改订单"></i>
                <i class="icon-delete" title="删除订单"></i>
                <i class="icon-copy" title="复制订单"></i>
                <i class="icon-print" title="打印订单"></i>
            </article>
        </header>
        <order-table :doc-code="code">
        </order-table>
    </div>
</template>

<script>
    import orderTable from './order-detail-table'
    export default {
        name: "order-detail",
        components:{

            orderTable
        },
        props:{
            dataDetail:{
                type:Object,
            },
        },
        watch:{
            'dataDetail':{
                handler(val){
                    if(val){
                        //深克隆避免污染
                        this.formData = this.$lodash.cloneDeep(val);
                    }
                }
            },
            'formData'(){
                var params = this.formData;
                this.code = params.docCode
                this.headerRow = {
                    '订单编号':params.docCode,
                    '下单日期':params.docDate,
                    '交货日期':params.deliveryDate,
                    '单据状态':params.docStatusName
                };
                this.headerMain = {
                    '客户':params.cltMatCode,
                    '销售公司':params.companyName,
                    '单据类型':params.docType,
                    '贴膜要求':params.padPastingCode,
                    '货期类型':params.deliveryLevel,
                    '经销商':params.clientCode2,
                    '生产基地':params.supplyCompanyCode,
                    '跟单员':params.followName,
                    '包装方式':params.packMethodCode,
                    '开票类型':params.vatTypeName,
                    '备注':params.memo
                }
            }
        },
        data(){
            return{
                hidden:false,
                headerRow:{},
                headerMain:{},
                formData:{},
                tableDetail:[],
                code:'',
                tableHeader:{
                    table1:[
                        {prop:'code',label:'日期',width:60},
                        {prop:'name',label:'姓名',width:60},
                        {prop:'address',label:'地址'},
                    ],
                }
            }
        },
        mounted(){
        },
        methods:{
            getVal(){
                this.$emit('update',this.tableDetail);
                console.log(this.tableDetail)
            },
            editFrom(){
                this.$emit('handleEdit')
            }
        }
    }
</script>

<style lang="less" >

    .green-header{
        background-color: #46987c;
        color: #fff;
        box-sizing: border-box;
        padding: 10px;
        position: relative;
        .ico-item{
            position: absolute;
            right: 25px;
            bottom: -35px;
            z-index: 99;
        }
    }
    .detail-span{
        width: 20%;
        display: inline-flex;
        box-sizing: border-box;
    }
    .set-icon-opear(){
        width: 45px;
        height:45px;
        cursor: pointer;
        background-size: 45px;
        display: inline-block;
    }
    .icon-copy,.icon-print{
        .set-icon-opear()
    }
</style>
