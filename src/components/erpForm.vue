<!--
  -- @file 表单组件 - 简单页面
  -- @author salonnlee <huanghj199512@163.com>
  -- @copyright 2018 ZL
  --
  -- @props - 父组件传递给子组件的数据
  -- @param {Object} xsForm - 表单字段
  -- @param {Object} xsFormData - 表单数据
  -- @param {Object} xsFormRules - 表单验证
  -- @param {Object} xsFormHeader - 表头信息
  --
  -- @emit - 子组件触发父组件的事件
  -- @param {Function} handleClickY - √
  -- @param {Function} handleClickX - ×
  --
  -- @slot - 插槽
  -- @template {} header - 表头个人信息
  -- @template {} form - 表单
  --
  -- @data - 内部状态
  -- @param {Boolean} status.isEdit - 编辑状态
  -- @param {Boolean} stauts.isCreateNew - 新建状态
  -->

<template>
    <div class="comp-alu-form-xs l-comp-spa">
        <el-container>
            <el-main class="l-form-box">
                <div class="l-form-header">
                    <p>{{xsFormHeader}}</p>
                    <i @click="handleClickY"
                       class='icon-confirm'></i>
                    <i @click="handleClickX"
                       class='icon-cancel'></i>
                </div>
                <el-form class="l-form-content" :rules="xsFormRules" ref="xsForm" :inline="FormInline"
                         :label-position="status.xsFormLabelPosition" label-width="150px" :model="xsForm">
                   <slot name="formContent">
                       <slot name="formHeader"></slot>
                   </slot>

                </el-form>
            </el-main>
        </el-container>
    </div>

</template>

<script>
    export default {
        props: {
            'FormInline': {
                type: Boolean,
                default: true
            },
            'xsForm': {
                type: Object
            },
            'xsFormRules': {
                type: Object
            },
            'xsFormHeader': {
                type: String
            },
            'isCreate':{
                type:Boolean,
                default:true
            }
        },

        data() {
            return {
                status: {
                    isEdit: true,
                    xsFormLabelPosition: 'right',
                },
                xsFormCopy: {}
            }
        },
        methods: {
            // ------------------ 下拉框数据 ------------------
            handleClickY() {

                // 如果this.xsForm为空则不让aluFormXs编辑操作生效
                var emptyFlag = this.mixinIsObjectEmpty(this.xsForm)
                if (emptyFlag) {
                    this.$message({
                        message: '当前数据为空',
                        type: 'warning'
                    })
                    return;
                }
                    // √
                    // 验证表单
                    this.$refs['xsForm'].validate((valid) => {
                        if (valid) {
                            this.$emit('handle-click-y')
                        } else {
                            return false;
                        }
                    });

            },
            handleClickX() {
                    this.$emit('handle-click-x');
                    this.$refs['xsForm'].clearValidate();

            },
            handleToggleStatus(status) {
                this.status[status] = !this.status[status];
            },
        },
        mounted() {
        }
    }
</script>

<style lang="less" type="text/less" scoped>
    @color-grey-border-1:#eee;
    @color-green-form-header: #45977C;
    .comp-alu-form-xs {
        .l-form-box {
            padding: 0;
            background-color: #fff;
            border: 1px solid @color-grey-border-1;
        }
        .l-form-header {
            position: relative;
            p {
                color: #fff;
                font-size: 18px;
                padding: 10px 20px;
                margin-top: 0;
                margin-bottom: 25px;
                background-color: @color-green-form-header;
            }
        }
        .l-form-content {
            padding: 0 15px;
        }
        .icon-delete, .icon-cancel {
            position: absolute;
            right: 30px;
            bottom: 0;
            transform: translateY(50%);
        }
        .icon-edit, .icon-confirm {
            position: absolute;
            right: 85px;
            bottom: 0;
            transform: translateY(50%);
        }
    }
</style>
