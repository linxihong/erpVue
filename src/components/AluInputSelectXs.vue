<!--
  -- @file ...Input输入框
  --
  -- @props - 父组件传递给子组件的数据
  -- @params {*} xsInputModel.sync - 输入框值
  --
  -- @emit - 子组件触发父组件的事件
  -- @params {Function} handleInputSelect - 点击...弹框选择
  --
  -- @notice - 需要给el-form-item父元素添加height: 32px控制布局稳定
  -- @desc - <el-form-item style="height: 32px">
  -->
<template>
    <el-input class="comp-alu-input-select-xs" v-model="xsInputModelCopy" @click.native="handleInputSelect">
        <template slot="append">
            <i class="el-icon-more"></i>
        </template>
    </el-input>
</template>

<script>

    export default {
        props: {
            xsInputModel: {
                type: null
            }
        },
        watch: {
            xsInputModelCopy: function (val, oldVal) {
                // 1-2 输入框值改变时同步修改父组件绑定值
                this.$emit('update:xsInputModel', val)
            }
        },
        components: {},
        data() {
            return {
                xsInputModelCopy: ''
            }
        },
        methods: {
            handleInputSelect(e) {
                if (event.target.tagName != 'INPUT') {
                    this.$emit('handleInputSelect')
                }
            }
        },
        mounted() {
            // 1-1 输入框值拷贝
            this.xsInputModelCopy = this.$lodash.cloneDeep(this.xsInputModel)
        }
    }
</script>

<style lang="less" type="text/less" scoped>
</style>
