<template>
    <el-select :disabled="disabled" filterable placeholder="" clearable v-model="xsSelectValueCopy">
        <el-option
                v-for="item in xsSelectOptions"
                :key="item[xsSelectConfig.xsSelectProps.key]"
                :label="item[xsSelectConfig.xsSelectProps.label]"
                :value="item[xsSelectConfig.xsSelectProps.value]"
        ></el-option>
    </el-select>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        props: {
            'disabled': {
                type: Boolean
            },
            'xsSelectConfig': {
                type: Object
            },
            'xsSelectValue': {},

        },
        components: {},
        watch: {
            xsSelectValue(val) {
                this.xsSelectValueCopy = val
            },
            xsSelectValueCopy(val) {
                this.$emit('update:xsSelectValue', val)
                return val
            }
        },
        computed: {
            ...mapState({
                xsSelectOptions(state) {
                    return state[this.xsSelectConfig.xsModuleName][this.xsSelectConfig.xsSelectOptionsName]
                }
            })
        },
        data() {
            return {
                xsSelectValueCopy: ''
//                xsSelectConfig: {
//                    xsModuleName: 'product',
//                    xsSelectValue: 'JKJ',
//                    xsSelectOptionsName: 'pvcType',
//                    xsSelectProps: {
//                        key: 'fcode',
//                        label: 'fname',
//                        value: 'fcode'
//                    }
//                }
            }
        },
        methods: {},
        mounted() {
            this.$nextTick(() => {
                this.xsSelectValueCopy = this.xsSelectValue
                this.$store.dispatch(this.xsSelectConfig.xsModuleName + '/fetch' + this.$lodash.upperFirst(this.xsSelectConfig.xsSelectOptionsName), this)
            })
        }
    }
</script>

<style lang="less" type="text/less" scoped>
</style>
