<!--
    otherVariable: 其他变量，包含标题等
    isShowStatus: 状态变量，包含只读/可编辑状态
    propData:含有表单字段名称以及字段代码等相关信息的列表
        -- type:表单项的类型，常见的有:normal,select
        -- isMain:是否为主键
        -- selectList:当type为select时的下拉列表
    detailForm: 对象详情
    @handleEdit: 编辑
    @handleDelete: 删除
    @handleCancel: 取消编辑
    @handleSave: 保存编辑
-->
<template>
    <div class="common-right-wrap">
        <slot name="header">&nbsp;</slot>
        <div class="common-right-content">
            <div class="content-head" :style="{height:headHeight}">
                <slot name="head-form-title"></slot>
                <template v-if="isShowStatus.isRead">
                    <i class="icon-edit" @click="handleEdit"></i>
                    <i class="icon-delete" @click="handleDelete" :class="{active:showicon}" style="right: 30px;"></i>
                </template>
                <template v-if="!isShowStatus.isRead">
                    <i class="icon-cancel" @click="handleCancel('edit')"></i>
                    <i class="icon-confirm" @click="handleSave('edit')"></i>
                </template>
            </div>
            <i class="icon-spread" @click="toggleSpread" v-show="!isSpread"></i>
            <i class="icon-retract" @click="toggleSpread" v-show="isSpread"></i>
            <div class="content-detail">
                <div class="content-read-form" :style="{'margin-top': marginTop}">
                    <el-form ref="detailForm" :rules="editRules" :model="detailForm" label-width="120px" :inline="otherVariable.isInlineForm"  >
                        <template v-for="(item,index) in propData">
                            <el-form-item :label="item.name" v-if="!item.isMain&&!item.disabledcolor" :prop="item.prop" :style="{float:item.labelPosition,clear:item.both}" :class="item.type === 'textarea' ? 'full-remark' : ''">
                                <el-input v-if="item.type === 'normal'" v-model.trim="detailForm[item.prop]" :readonly="isShowStatus.isRead||item.isRead"></el-input>
                                <el-input v-if="item.type === 'number'" v-model.trim="detailForm[item.prop]" :readonly="isShowStatus.isRead" type="number"></el-input>
                                <el-input type="textarea" rows="3" v-if="item.type === 'textarea'" v-model.trim="detailForm[item.prop]" :disabled="isShowStatus.isRead"></el-input>
                                <el-select v-if="item.type==='select'" v-model="detailForm[item.prop]" :disabled="isShowStatus.isRead||item.isRead" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in item.selectList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-if="item.type==='selectChange'" @change="selectChange($event,item.selectParam,item.selectList,item.paramList,item.reflectList)" v-model="detailForm[item.prop]" :disabled="isShowStatus.isRead||item.isRead" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in item.selectList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-if="item.type==='selectMultiple'" multiple v-model="detailForm[item.prop]" :disabled="isShowStatus.isRead||item.isRead" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in item.selectList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-date-picker
                                    v-if="item.type === 'date'"
                                    v-model="detailForm[item.prop]"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                    data-index
                                    style="width: 100%"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </template>
                    </el-form>
                </div>
                <slot name="content-other"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            'isShowStatus': {
                type: Object
            },
            'otherVariable': {
                type: Object
            },
            'propData': {
                type: Array
            },
            'detailForm': {
                type: Object
            },
            'editRules': {
                type: Object
            },
            'showicon':{
                type: Boolean
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
                isSpread: false,
            }
        },
        methods: {
            toggleSpread() {
                this.$emit('toggleSpread');
                this.isSpread = this.otherVariable.isSpread;
            },
            handleEdit() {
                this.$emit('handleEdit');
            },
            handleDelete() {
                this.$emit('handleDelete');
            },
            handleCancel(type) {
                this.$emit('handleCancel',type);
                this.$refs.detailForm.resetFields();
            },
            handleSave(type) {
                this.$refs.detailForm.validate((valid) => {
                    if(valid) {
                        this.$emit('handleSave',type);
                    }
                    else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            selectChange(val,paramName,selectList,paramList,reflectList) {
                if(paramName === 'colorType') {
                    this.$emit('selectChange',val,paramName,selectList,paramList,reflectList);
                }
            }
        }
    }
</script>
<style scoped>
    .active{
        display: none;
    }
</style>
