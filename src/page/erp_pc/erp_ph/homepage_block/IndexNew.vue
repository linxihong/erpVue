<!--未来七天走势-->
<template>
    <div style="padding-left: 10px;border: 1px solid #F0F1F1;margin-left: 14px;margin-top: 20px;height: 160px; background-color: white;box-shadow:0px 3px 3px #c8c8c8;border-radius: 7px;">
        <el-row style="border-bottom: 1px solid #e8dfdf7d; height: 32px;line-height: 32px">
            <el-col :span="20" style="font-size: 14px;">
                <i class="el-icon-bell"></i> <span style="font-size: 15px;font-weight: bold;">消息通知</span>
            </el-col>

        </el-row>

        <div style="text-align: center;color: #A09D98">暂无数据</div>
    </div>
</template>

<script>


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


        },

        methods: {
//
        }

    }
</script>

<style lang="less" type="text/less" scoped>
</style>
