<!--
    otherVariable: 其他变量，包含标题等
    propData:含有表单字段名称以及字段代码等相关信息的列表
        -- type:表单项的类型，常见的有:normal,select
        -- isMain:是否为主键
        -- selectList:当type为select时的下拉列表
    addForm: 新增对象
    @handleCancel: 取消新建
    @handleSave: 保存新建
-->
<template>
    <div class="common-right-wrap right-wrap-add" :class="otherVariable.isInlineForm? 'inline-form-add' : ''">
        <slot name="header"><div style="width:100%;background:#f5f5f5;">&nbsp;</div></slot>
        <div class="common-right-content">
            <div class="content-head" :style="{height:headHeight}">
                <slot name="head-form-title"></slot>
                <i class="icon-cancel" :class="otherVariable.isSaving ? 'banClick' : ''" @click="handleCancel(otherVariable.isEdit)"></i>
                <i class="icon-confirm" :class="otherVariable.isSaving ? 'banClick' : ''" @click="handleSave(otherVariable.isEdit)"></i>
            </div>
            <div class="content-detail">
                <div class="content-read-form" :style="{'margin-top': marginTop}">
                    <el-form ref="detailForm" :rules="addRules" :model="addForm" :inline="otherVariable.isInlineForm">
                        <template v-for="(item,index) in propData" v-if="!otherVariable.$isCustom">
                            <el-form-item :label="item.name" v-if="!item.isMain&&!item.disabledcolor" :prop="item.prop" :label-width="item.labelwidth?item.labelwidth:'120px'" :style="{float:item.labelPosition,clear:item.both}">
                                <el-input v-if="item.type === 'normal'" v-model.trim="addForm[item.prop]" ></el-input>
                                <el-input v-if="item.type === 'number'" v-model.trim="addForm[item.prop]"></el-input>
                                <el-checkbox v-if="item.type === 'checkbox'" v-model="addForm[item.prop]" :true-label="1" :false-label="0">{{addForm[item.name]}}</el-checkbox>
                                <el-select v-if="item.type==='select'" clearable v-model="addForm[item.prop]" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in item.selectList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-if="item.type==='selectChange'" @change="selectChange($event,item.selectParam,item.selectList,item.paramList,item.reflectList)" clearable v-model="addForm[item.prop]" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in item.selectList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-if="item.type==='selectData'" clearable v-model="addForm[item.prop]" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in item.selectDataList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-input v-if="item.type==='textarea'" v-model.trim="addForm[item.prop]"
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="请输入内容"
                                   >
                                </el-input>
                                <el-date-picker
                                    v-if="item.type === 'date'" v-model="addForm[item.prop]"
                                    type="date"
                                    placeholder="选择日期"
                                    style="width: 100%">
                                </el-date-picker>
                            </el-form-item>
                        </template>
                    </el-form>
                    <slot name="custom-add-form" v-if="otherVariable.$isCustom"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
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
            handleCancel(isEdit) {
                this.$confirm('此操作将清空已填写的数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    isEdit ? this.$emit('handleCancel','edit') : this.$emit('handleCancel','add');
                    if(!this.otherVariable.isNotValidate) {
                        this.$refs.detailForm.resetFields();
                    }
                }).catch(() => {
                    console.log('cnacel')
                })
            },
            handleSave(isEdit) {
                if(!this.otherVariable.isNotValidate) {
                    this.$refs.detailForm.validate((valid) => {
                        if(valid) {
                            if(!this.otherVariable.isSaving) {
                                isEdit ? this.$emit('handleSave','edit') : this.$emit('handleSave','add');
                            }else {
                                this.$message({
                                    message: '正在保存中，请稍后再操作',
                                    type: 'warning'
                                })
                            }
                        }else {
                            console.log('error submit!!');
                            return false;
                        }
                    })
                }else {
                    if(!this.otherVariable.isSaving) {
                        isEdit ? this.$emit('handleSave','edit') : this.$emit('handleSave','add');
                    }else {
                        this.$message({
                            message: '正在保存中，请稍后再操作',
                            type: 'warning'
                        })
                    }
                }
            },
            selectChange(val,paramName,selectList,paramList,reflectList) {
                if(paramName === 'colorType') {
                    this.$emit('selectChange',val,paramName,selectList,paramList,reflectList);
                }
            }
        }
    }
</script>

<style>
    .banClick {
        cursor: not-allowed!important;
    }
</style>
