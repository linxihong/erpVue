<!--
  -- @file 搜索组件 - 简单页面
  -- @author salonnlee <huanghj199512@163.com>
  -- @copyright 2018 ZL
  --
  -- @props - 父组件传递给子组件的数据
  -- @param {Object} xsFormSearch - 搜索表单对象
  --
  -- @emit - 子组件触发父组件的事件
  -- @param {Function} handleCreateNew - 新建
  -- @param {Function} handleSearchSimple - 查询
  -- @param {Function} handleSearchComplex - 查询 - 更多查询
  --
  -- @slot - 插槽
  -- @template {} simple - 简单查询
  -- @template {} complex - 复杂查询
  --
  -- @data - 内部状态
  -- @param {Boolean} status.isShowSearchComplex - 是否显示复杂查询框
  -->

<template>
    <div class="comp-alu-form-xs">
        <div class="l-search-simple">
            <el-button class="btn-cyan" @click="handleCreateNew">新建</el-button>
            <el-row>
                <el-col class="u-mr16" :span="12">
                    <!-- simple slot -->
                    <slot name="simple" :xsFormSearch="xsFormSearch" :handleSearchSimple="handleSearchSimple"></slot>
                </el-col>
                <el-button @click="handleSearchSimple" class="btn-h32">查询</el-button>
                <el-button @click="handleToggleShowComplex" class="btn-cyan-plain btn-h32">
                    <span>更多查询</span>
                    <i class="el-icon--right" :class="status.isShowSearchComplex?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                </el-button>
            </el-row>
            <div class="l-search-complex u-pad20" v-show="status.isShowSearchComplex">
                <el-form ref="xsFormSearch" :model="xsFormSearch" label-width="8.5em">
                    <!-- complex slot -->
                    <slot name="complex" :xsFormSearch="xsFormSearch" :handleSearchComplex="handleSearchComplex"></slot>
                    <el-form-item>
                        <el-button @click="handleSearchComplex" class="btn-search btn-cyan">查询</el-button>
                        <el-button @click="handleSearchReset" class="btn-search">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        components: {},
        props: {
            'xsFormSearch': {
                type: Object
            },
            invokingReset:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                status: {
                    isShowSearchComplex: false
                },
            }
        },
        methods: {
            // 更多查询
            handleToggleShowComplex() {
                this.status.isShowSearchComplex = !this.status.isShowSearchComplex;
            },
            // 新建
            handleCreateNew() {
                this.$emit('handle-create-new');
            },
            // 查询
            handleSearchSimple() {
                this.$emit('handle-search-simple');
            },
            // 查询 - 更多查询
            handleSearchComplex() {
                this.$emit('handle-search-complex');
            },
            // 重置 - 更多查询
            handleSearchReset() {
                if(this.invokingReset){
                    this.$emit('resetFrom');
                    return
                }
                this.$refs['xsFormSearch'].resetFields();
            }
        }
    }
</script>

<style lang="less" type="text/less" scoped>
    .comp-alu-form-xs {
        .l-search-simple {
            position: relative;
            .btn-cyan {
                width: 70px;
                height: 30px;
            }
        }
        .l-search-complex {
            z-index: 100;
            position: absolute;
            left: -1px;
            right: -1px;
            background-color: #FFFFFF;
            border: 1px solid #ddd;
            border-top: 0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            .btn-search {
                width: 90px;
                height: 30px;
            }
        }
    }
</style>
