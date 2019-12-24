<template>
    <el-pagination
        :class="pageObj.className || 'common-pagination'"
        @size-change="handleSize"
        @current-change="handleCurrent"
        :pager-count="5"
        :current-page="pageObj.commonPage"
        :page-size="pageObj.commonSize"
        :page-sizes="pageObj.commonSizes"
        layout="total, sizes, prev, pager, next"
        :total="pageObj.commonTotal">
    </el-pagination>
</template>

<script>
    export default {
        props: {
            'pageObj': {
                type: Object
            }
        },
        data() {
            return {
            }
        },
        methods: {
            handleSize(val) {
                this.pageObj.commonSize = val;
                this.$emit('getData');
            },
            handleCurrent(val) {
                this.pageObj.commonPage = val;
                this.$emit('getData');
            }
        }
    }
</script>
