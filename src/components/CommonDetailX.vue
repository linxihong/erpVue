<!--
    otherVariable: 其他变量，包含标题等
    propData:含有表单字段名称以及字段代码等相关信息的列表
        -- type:表单项的类型，常见的有:normal,select
        -- isMain:是否为主键
        -- selectList:当type为select时的下拉列表
    detailForm: 对象详情
    @handleEdit: 编辑
    @handleDelete: 删除
-->
<template>
    <div class="common-right-wrap">
        <slot name="header">&nbsp;</slot>
        <div class="common-right-content">
            <div class="content-head" :style="{height:headHeight}" v-if="!otherVariable.isHeadComplex">
                <span>{{otherVariable.detailTitle}}</span>
                <slot name="main-btn-wrap"></slot>
            </div>
            <div class="content-head-x" :class="hasSimpleHead?'content-head-simple':''" v-if="otherVariable.isHeadComplex" ref="contentHead">
                <slot name="head-form-title"></slot>
                <slot name="head-form-content"></slot>
                <slot name="main-btn-wrap"></slot>
            </div>
            <i class="icon-spread" @click="toggleSpread" v-show="!isSpread"></i>
            <i class="icon-retract" @click="toggleSpread" v-show="isSpread"></i>
            <!--明细-->
            <slot name="model-input"></slot>
            <div class="content-detail">
                <div class="content-read-form" v-if="!otherVariable.isFormComplex" :style="{'margin-top': marginTop}">
                    <el-form :model="detailForm" label-width="120px" :inline="otherVariable.isInlineForm">
                        <template v-for="(item,index) in propData">
                            <div v-if="item.type === 'title'" class="inline-form-title" :style="{width: item.width || '80px'}">{{item.name}}</div>
                            <el-form-item :label="item.name" v-if="!item.isMain" :class="item.isLong?'full-remark':''">
                                <el-input v-if="item.type === 'normal'" v-model.trim="detailForm[item.prop]" :readonly="true"></el-input>
                                <el-select v-if="item.type==='select'" v-model="detailForm[item.prop]" :disabled="true" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in item.selectList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-if="item.type==='selectChange'" @change="selectChange($event,item.selectParam)" v-model="detailForm[item.prop]" :disabled="isShowStatus.isRead||item.isRead" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in item.selectList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-input v-if="item.type === 'date'" v-model.trim="detailForm[item.prop]" :readonly="true"></el-input>
                            </el-form-item>
                        </template>
                    </el-form>
                </div>
                <div class="content-read-form-x" v-if="otherVariable.isFormComplex" :style="{'margin-top': marginTop}">
                    <slot name="common-content"></slot>
                </div>
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
            'hasSimpleHead': {
                type: Boolean,
                default: false
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
        mounted() {
            this.otherVariable.contentHead = this.$refs.contentHead.offsetHeight;
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
            selectChange(val,paramName) {
                this.$emit('selectChange',val,paramName);
            }
        }
    }
</script>
