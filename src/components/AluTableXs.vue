<!--
  -- @file 表格组件 - 简单页面
  -- @author salonnlee <huanghj199512@163.com>
  -- @copyright 2018 ZL
  --
  -- @props - 父组件传递给子组件的数据
  --
  -- @emit - 子组件触发父组件的事件
  -- @param {Function} handleTableRowChange(row, oldRow) - 表格当前行改变
  -- @param {Function} handleFetchData(queryModel, isValue, this.xsPager) - 抓取表格数据
  --
  -- @slot - 插槽
  -- @template {} table - 表格
  --
  -- @data - 内部状态
  -- @param {Boolean} xsPager - 分页器对象
  -->
<template>
    <div class="comp-alu-table-xs">
        <el-table
                ref="elTable"
                cell-class-name="l-cell-tight"
                class="l-table"
                :max-height="$store.state.screenHei*0.72"
                :data="xsTableData"
                style="width: 100%"
                highlight-current-row
                @current-change="handleTableRowChange"
                :default-sort="{prop: 'sort', order: 'ascending'}">
            <!-- table slot -->
            <!--<el-table-column-->
                    <!--type="index"-->
                    <!--width="50"-->
                    <!--label="序号">-->
            <!--</el-table-column>-->
            <slot name="table" :xsTableData="xsTableData"></slot>
        </el-table>

        <el-pagination
                class="l-pagination"
                @size-change="handlePagerSizeChange"
                @current-change="handlePagerCurrentChange"
                :current-page="xsPager.pageNo"
                :page-sizes="xsPager.pageSizes"
                :page-size="xsPager.pageSize"
                layout="prev, pager, next, total, sizes"
                :total="pageTotal">
        </el-pagination>

    </div>
</template>

<script>

    export default {
        components: {},
        props: {
            'xsTableData': {type: Array},
            pageTotal:{
                type:Number,
                default:0
            }
        },
        data() {
            return {
                currentIndex: 0,
                // 分页器
                xsPager: {
                    pageNo: 1,
                    pageSize: 20,
                    pageSizes: [10, 20, 50, 100]
                },
            }
        },
        methods: {
            // 表格当前行改变
            handleTableRowChange(row, oldRow) {
                this.$emit('handle-table-row-change', row, oldRow)
            },
            // 分页器尺寸改变
            handlePagerSizeChange(val) {
                this.xsPager.pageSize = val;
                this.handleFetchData();
            },
            // 分页器当前页改变
            handlePagerCurrentChange(val) {
                this.xsPager.pageNo = val;
                this.handleFetchData({}, false, { isPagerChange: true });
            },
            // 抓取表格数据
            handleFetchData(queryModel = {}, isValue = false, config = {}) {
                this.$emit('handle-fetch-data', queryModel, isValue, this.xsPager, config)
            }
        },
        mounted() {
            this.handleFetchData()
        }
    }
</script>

<style lang="less" type="text/less">
    .comp-alu-table-xs {
        .l-cell-tight {
            padding: 0;
        }
        .l-table {
            outline: 1px solid #ccc;
        }
        .l-pagination {
            z-index: 100;
        }
        .p-margin0 {
            margin: 0;
        }
        .el-pagination {
            border: 1px solid #ddd;
            margin-top: 50px;
            padding: 10px;
            background-color: #fff;
            position: absolute;
            right: 0;
            bottom: 1px;
        }
    }
</style>
