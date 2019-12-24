
<template>
    <div>
        <div class="todoList" style="height: 407px;" >
            <el-row>
                <el-col :span="20" style="font-size: 14px">
                    <span style="font-size: 15px;font-weight: bold;">到账提醒</span>
                </el-col>

            </el-row>

            <div style="text-align: center;color: #A09D98">暂无数据</div>

            <!--<el-row style="border-bottom: 1px solid #e8dfdf7d;" v-for="(item,index) in TodoList" :key="index">-->
                <!--<el-col :span="3">{{item.docTime}}</el-col>-->
                <!--<el-col :span="5">{{item.title}}</el-col>-->
                <!--<el-col :span="6">{{item.refDocType}}:{{item.refDocCode}}</el-col>-->
                <!--<el-col :span="8">客户名称:{{item.attribute2}}</el-col>-->
            <!--</el-row>-->

        </div>
    </div>
</template>

<script>
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

            }
        },
        methods: {

        }
    }
</script>

<style>
    .todoList{
        width: 100%;
        height: 250px;
        border: 1px solid  #F0F1F1;
        padding-left: 10px;
        padding-right: 8px;
        background-color: white;
        box-shadow:0px 3px 3px #c8c8c8;
        border-radius: 7px;

    }


</style>
