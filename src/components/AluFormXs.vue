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
            <!-- TODO: 暂时隐藏头部信息 -->
            <el-header class="l-header" :height="'40px'" v-show="false">
                <!-- header slot -->
                <slot name="header" :xsFormHeader="xsFormHeader"></slot>
            </el-header>
            <el-main class="l-form-box">
                <div class="l-form-header">
                    <p>{{xsFormHeader.title}}</p>
                    <i @click="handleClickY"
                       :class="{ 'icon-edit': !status.isEdit, 'icon-confirm': status.isEdit }"></i>
                    <i @click="handleClickX"
                       :class="{ 'icon-delete': !status.isEdit, 'icon-cancel': status.isEdit }"></i>
                </div>
                <el-form class="l-form-content" :rules="xsFormRules" ref="xsForm"
                         :label-position="status.xsFormLabelPosition" label-width="150px" :model="xsForm">
                    <!-- form slot -->
                    <slot name="form"
                          :pvcTypeCode="pvcTypeCode"
                          :isBaseUom="isBaseUom"
                          :inactive="inactive"
                          :xsForm="xsForm"
                          :status="status"
                          :xsFormData="xsFormData"></slot>
                    <!-- tabs slot -->
                    <slot name="tabs" :status="status"></slot>
                </el-form>
            </el-main>
        </el-container>
    </div>

</template>

<script>
    import {mapState} from 'vuex'

    export default {
        components: {},
        props: {
            'xsFormData': {
                type: Object
            },
            'xsForm': {
                type: Object
            },
            'xsFormRules': {
                type: Object
            },
            'xsFormHeader': {
                type: Object
            },
            'isPopUp': {
                type: Boolean
            }
        },
        computed: {
            ...mapState({
                pvcTypeCode: state => state.product.pvcTypeCode,
                inactive: state => state.inactive,
                isBaseUom: state => state.base.isBaseUom
            })
        },
        data() {
            return {
                status: {
                    isEdit: false,
                    isCreateNew: false,
                    xsFormLabelPosition: 'right',
                },
                xsFormCopy: {}
            }
        },
        methods: {
            // ------------------ 下拉框数据 ------------------
            handleIsCreateNew() {
                if (this.status.isCreateNew) {
                    this.status.isCreateNew = false;
                }
            },
            handleFormCopy() {
                this.xsFormCopy = this.$lodash.cloneDeep(this.xsForm);
            },
            handleClickY() {
                // 如果this.xsForm为空则不让aluFormXs编辑操作生效
                // 但是新增的时候可以允许它为空啊
                if (this.mixinIsObjectEmpty(this.xsForm) && !this.status.isCreateNew) {
                    return;
                }

                if (!this.status.isEdit) {
                    // 1-1 深复制表单值
                    // ! 因为实际上只有笔会进入到这里 所以PopUp的√永远也不会到这里除了修改的情况
                    //      所以导致PopUp×的时候带回去的xsFormCopy是{}空对象
                    this.xsFormCopy = this.$lodash.cloneDeep(this.xsForm);
//                    console.log('AluFormXs handleClickY', 'this.xsForm:', this.xsForm, 'this.xsFormCopy', this.xsFormCopy)
//                console.log(this.xsFormCopy, 'this.xsFormCopy')
                    // 笔 - 编辑 显示PopUp
                    this.$emit('handle-click-y')

                } else {
                    // √
                    // 验证表单
                    this.$refs['xsForm'].validate((valid) => {
                        if (valid) {
                            this.$emit('handle-click-y')
                        } else {
                            return false;
                        }
                    });
                }
            },
            handleClickX() {
                if (!this.status.isEdit) {
                    // 垃圾桶 - 删除
                } else {
                    // PopUp
                    // ×
                    // 1-2 将表单值还原 撤销修改
                    this.$emit('update:xsForm', this.$lodash.cloneDeep(this.xsFormCopy));
                    console.log(this.xsFormCopy, 'this.$lodash.cloneDeep(this.xsFormCopy)')
//                     this.handleToggleStatus('isEdit');
                    this.$refs['xsForm'].clearValidate();
                    this.handleIsCreateNew()
                    // 并隐藏popup
                }
                this.$emit('handle-click-x')
            },
            handleToggleStatus(status) {
                this.status[status] = !this.status[status];
            },
        },
        mounted() {
            this.status.isEdit = this.isPopUp
        }
    }
</script>

<style lang="less" type="text/less">
    @import "../assets/css/_variables";

    .comp-alu-form-xs {
        // 弹出编辑框
        .l-popup {
            position: absolute;
            right: 0;
            top: 0
        }
        .l-cell-tight {
            padding: 0;
        }
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
        // 在查看模式下让select下拉选框和span元素看起来一样
        .comp-alu-form-xs-slot-form {
            input.el-input__inner {
                background-color: transparent !important;
                border: none;
                padding: 0;
                color: #000;
            }
            span.el-input__suffix {
                display: none;
            }
        }

    }
</style>
