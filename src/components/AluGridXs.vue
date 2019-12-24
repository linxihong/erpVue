<template>
    <el-row class="comp-alu-grid-xs" :gutter="20">
        <el-col :span="6" v-for="(item, index) in xsGridData" :key="index">
            <div @click="handleClickCountry({item, index})" :class="{isCurrent: index == currentIndex}" class="item-country">{{item.fname}}</div>
        </el-col>
    </el-row>
</template>

<script>

    export default {
        props: {
            'xsGridData': {
                type: Array
            }
        },
        components: {},
        data() {
            return {
                currentIndex: -1
            }
        },
        methods: {
            handleClickCountry({item, index}) {
                this.currentIndex = index;
                this.$emit('handle-grid-change', item)
            },
            // 抓取表格数据
            handleFetchData(queryModel = {}, isValue = false) {
                this.$emit('handle-fetch-data', queryModel, isValue, {
                    pageNo: 1,
                    pageSize: 200,
                })
            }
        },
        mounted() {
            this.handleFetchData()
            console.log(this.xsGridData)
        }
    }
</script>

<style lang="less" type="text/less" scoped>
    .comp-alu-grid-xs {
        .item-country {
            border: 1px solid #DFE6EC;
            cursor: pointer;
            text-align: center;
            padding: 10px 15px;
            margin-bottom: 15px;
            background-color: #fff;
            transition: 0.1s;
            &:hover {
                color: #fff;
                background-color: rgba(1, 194, 111, 0.85);
                box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
            }
            &.isCurrent {
                color: #fff;
                background-color: #01C26F;
            }
        }
    }
</style>
