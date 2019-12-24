/**
* @date 2017/11/22
* @desc 图标 选择器
**/
<template>
    <div class="icon-menu" style="display: inline-block;">

        <el-button class="btn-color" type="text" @click="dialogFormVisible = true">选择图标</el-button>

        <el-dialog class="dialogDiv dialogDivII" :show-close="false" :visible.sync="dialogFormVisible">
            <div class="slideContent">
                <div class="leftDiv aloneDiv topDiv">
                    <el-button class="icon-setting-2 icon-close" @click="dialogFormVisible = false"></el-button>
                </div>
                <div class="slideTop">子系统图标选择</div>
                <div class="slideMid">
                    <div class="icon-menu">
                        <i v-for="item in icons" :item="item" :class="[item,'hoverClass']" @click="handleIconSelect(item)"></i>
                    </div>
                </div>
            </div>
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button @click="dialogFormVisible = false">关闭</el-button>-->
            <!--</div>-->
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'iconmenu',
        data () {
            return {
                myresult:this.result,
                dialogFormVisible: false,
                icons:[
                    'menu-icons-setting menu-icons-1',
                    'menu-icons-setting menu-icons-2',
                    'menu-icons-setting menu-icons-3',
                    'menu-icons-setting menu-icons-4',
                    'menu-icons-setting menu-icons-5',
                    'menu-icons-setting menu-icons-6',
                    'menu-icons-setting menu-icons-7',
                    'menu-icons-setting menu-icons-8',
                    'menu-icons-setting menu-icons-9',
                    'menu-icons-setting menu-icons-10',
                    'menu-icons-setting menu-icons-11',
                    'menu-icons-setting menu-icons-12',
                    'menu-icons-setting menu-icons-13',
                    'menu-icons-setting menu-icons-14',
                    'menu-icons-setting menu-icons-15',
                    'menu-icons-setting menu-icons-16',
                    'menu-icons-setting menu-icons-17',
                    'menu-icons-setting menu-icons-18',
                    'menu-icons-setting menu-icons-19',
                    'menu-icons-setting menu-icons-20',
                    'menu-icons-setting menu-icons-23',
                    'menu-icons-setting menu-icons-24',
                    'menu-icons-setting menu-icons-25',
                    'menu-icons-setting menu-icons-26',
                    'menu-icons-setting menu-icons-27',
                    'menu-icons-setting menu-icons-28',
                    'menu-icons-setting menu-icons-29',
                    'menu-icons-setting menu-icons-291',
                    'menu-icons-setting menu-icons-30',
                    'menu-icons-setting menu-icons-301',
                    'menu-icons-setting menu-icons-302',
                    'menu-icons-setting menu-icons-303',
                    'menu-icons-setting menu-icons-31',
                    'menu-icons-setting menu-icons-32',
                    'menu-icons-setting menu-icons-33',
                    'menu-icons-setting menu-icons-34',
                    'menu-icons-setting menu-icons-35',
                    'menu-icons-setting menu-icons-36',
                    'menu-icons-setting menu-icons-37',
                    'menu-icons-setting menu-icons-38',
                    'menu-icons-setting menu-icons-39',
                    'menu-icons-setting menu-icons-40',
                    'menu-icons-setting menu-icons-41',
                    'menu-icons-setting menu-icons-42',
                    'menu-icons-setting menu-icons-43',
                    'menu-icons-setting menu-icons-44',
                    'menu-icons-setting menu-icons-45',
                    'menu-icons-setting menu-icons-46',
                    'menu-icons-setting menu-icons-47',
                    'menu-icons-setting menu-icons-48',
                    'menu-icons-setting menu-icons-49',
                    'menu-icons-setting menu-icons-50',
                    'menu-icons-setting menu-icons-51',
                    'menu-icons-setting menu-icons-52',
                    'menu-icons-setting menu-icons-53',
                    'menu-icons-setting menu-icons-54',
                    'menu-icons-setting menu-icons-55',
                    'menu-icons-setting menu-icons-56',
                    'menu-icons-setting menu-icons-57',
                    'menu-icons-setting menu-icons-58',
                    'menu-icons-setting menu-icons-59',
                    'menu-icons-setting menu-icons-60',
                    'menu-icons-setting menu-icons-61',
                    'menu-icons-setting menu-icons-62',
                    'menu-icons-setting menu-icons-63',
                    'menu-icons-setting menu-icons-64',
                    'menu-icons-setting menu-icons-65',
                    'menu-icons-setting menu-icons-66',
                    'menu-icons-setting menu-icons-67',
                    'menu-icons-setting menu-icons-68',
                    'menu-icons-setting menu-icons-69',
                    'menu-icons-setting menu-icons-70',
                    'menu-icons-setting menu-icons-71',
                    'menu-icons-setting menu-icons-72',
                    'menu-icons-setting menu-icons-73',
                    'menu-icons-setting menu-icons-74',
                    'menu-icons-setting menu-icons-75',
                    'menu-icons-setting menu-icons-76',
                    'menu-icons-setting menu-icons-77',
                    'menu-icons-setting menu-icons-78',
                    'menu-icons-setting menu-icons-79',
                    'menu-icons-setting menu-icons-80',
                    'menu-icons-setting menu-icons-81',
                    'menu-icons-setting menu-icons-82',
                    'menu-icons-setting menu-icons-83',
                    'menu-icons-setting menu-icons-84',
                    'menu-icons-setting menu-icons-85',
                    'menu-icons-setting menu-icons-86',
                    'menu-icons-setting menu-icons-87',
                    'menu-icons-setting menu-icons-88',
                    'menu-icons-setting menu-icons-89',
                    'menu-icons-setting menu-icons-90',
                    'menu-icons-setting menu-icons-91',
                    'menu-icons-setting menu-icons-92',
                    'menu-icons-setting menu-icons-93',
                    'menu-icons-setting menu-icons-94',
                    'menu-icons-setting menu-icons-95',
                    'menu-icons-setting menu-icons-96',
                    'menu-icons-setting menu-icons-99',
                    'menu-icons-setting menu-icon-product',
                    'menu-icons-setting menu-icon-base',
                    'menu-icons-setting menu-icon-client',
                    'menu-icons-setting menu-icon-price',
                    'menu-icons-setting menu-icon-sale',
                    'menu-icons-setting menu-icon-check',
                    'menu-icons-setting menu-icon-finance',
                    'menu-icons-setting menu-icon-logistics',
                    'menu-icons-setting menu-icon-report',
                ],
            }
        },
        props: ['result'],
        watch: {
            foldstatus(val){

            },
        },
        mounted () {

        },
        methods: {
            handleIconSelect(logo){
                this.myresult=logo;
                this.$emit('input', logo)
                this.dialogFormVisible = false;
            },
        }
    }
</script>

<style lang="less" scoped type="text/less">
    .btn-color {
        //应用：列表-列、操作
        &.el-button {
            padding: 0;
            font-size: 14px;
        }
        &.el-button--text {
            color: #00C26F;
        }
        &.el-button--text.is-disabled,.el-button.is-disabled:hover {
            color: #bfcbd9;
        }
    }
    .icon-menu {
        i {

        }
    }
</style>