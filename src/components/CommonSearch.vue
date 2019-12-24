<!--
    isShowStatus: 包含多个控制是否显示的属性的对象
    propData:含有表单字段名称以及字段代码等相关信息的列表
        -- type:表单项的类型，常见的有:normal,select
        -- isMainSearch:是否为主搜索
        -- isMain:是否为主键
        -- selectList:当type为select时的下拉列表
    searchForm: 搜索对象
-->
<template>
    <div>
        <div class="common-search-wrap">
            <template v-for="(item,index) in propData">
                <el-input
                    v-if="item.isMainSearch"
                    class="search-input"
                    :style="{width: inputWidth}"
                    v-model.trim="searchForm[item.prop]"
                    :placeholder='item.placeholder'
                    @keyup.enter.native="handleSearch"
                ></el-input>
            </template>
            <el-button class="search-more" @click="toggleSearch">
                <span>更多查询</span>
                <i class="el-icon--right" :class="isShowStatus.isMore?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
            </el-button>
            <slot name="search-other-btn"></slot>
        </div>
        <transition name="fade">
            <div class="common-more-search" v-show="isShowStatus.isMore">
                <el-form :model="searchForm" label-width="120px" @submit.native.prevent @keyup.enter.native="handleSearch" :inline="isInLine" :class="isInLine?'inline-form-add':''">
                    <template v-for="(item,index) in propData">
                        <el-form-item :label="item.name" v-if="!item.isMainSearch&&!item.isMain&&!item.showRemark">
                            <el-input v-if="item.type === 'normal'" v-model.trim="searchForm[item.prop]"></el-input>
                            <el-input v-if="item.type === 'number'" v-model.trim="searchForm[item.prop]"></el-input>
                            <el-select v-if="item.type === 'select'" v-model="searchForm[item.prop]" style="width: 100%">
                                <el-option
                                    v-for="(item,index) in item.selectList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-if="item.type === 'selectChange'" v-model="searchForm[item.prop]" @change="selectChange" style="width: 100%">
                                <el-option
                                    v-for="(item,index) in item.selectList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-if="item.type === 'changeStatus'" v-model="searchForm[item.prop]" @change="changeStatus" style="width: 100%">
                                <el-option
                                    v-for="(item,index) in item.selectList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-date-picker
                                style="width: 100%"
                                v-if="item.type === 'date'"
                                v-model="searchForm[item.prop]"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                            <el-checkbox v-if="item.type=='checkbox'" :true-label="1" :false-label="0" v-model="searchForm[item.prop]"></el-checkbox>
                            <template v-if="item.type=='mixincheckbox'">
                                <el-checkbox :true-label="1" :false-label="0" v-model="searchForm[item.prop1]">{{item.name1}}</el-checkbox>
                                <el-checkbox :true-label="1" :false-label="0" v-model="searchForm[item.prop2]">{{item.name2}}</el-checkbox>
                            </template>
                        </el-form-item>
                    </template>
                    <el-form-item label=" " style="margin-bottom: 0">
                        <el-button @click="isShowStatus.isMore = false">取消</el-button>
                        <el-button class="btn-cyan search-btn" @click="handleSearch">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        props: {
            'isShowStatus': {
                type: Object
            },
            'propData': {
                type: Array
            },
            'searchForm': {
                type: Object
            },
            'isInLine': {
                type: Boolean,
                default: false
            },
            'inputWidth': {
                type: String,
                default: ''
            }
        },
        data() {
            return {

            }
        },
        methods: {
            toggleSearch() {
                this.isShowStatus.isMore = !this.isShowStatus.isMore;
            },
            handleSearch() {
                this.isShowStatus.isMore = false;
                this.$emit('getData');
            },
            selectChange(val) {
                this.$emit('selectChange',val);
            },
            changeStatus(val) {
                this.$emit('changeStatus',val);
            }
        }
    }
</script>
<style lang="less" scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
