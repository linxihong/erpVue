<template>
    <div></div>
    <!--<alu-page-xs
            class="module-area-info"
            :xsCompsCtrl="xsConfig.aluOthers"
            :xsFormSearch="xsConfig.aluSearchXs.queryModel"
            :xsFormCopy="xsConfig.aluFormXs.formModel"
            :xsFormRules="xsConfig.aluFormXs.formRules"
            :xsConfig="xsConfig"
            :xsFormHeader="xsConfig.aluFormXs.formHeader"
    ></alu-page-xs>-->
</template>

<script>
    /*import AluPageXs from '$src/components/AluPageXs.vue'


    var moduleConfig = {
        url: 'Mdm/Area',
        name: '地区'
    };
    export default {
        components: {
            AluPageXs,
        },
        data() {
            return {
                // ------------------- 组件配置 -------------------
                xsConfig: {
                    aluOthers: {
                        components: {
                            AluTreeXs: true
                        },
                        url: {
                            insert: `/basedata/${moduleConfig.url}/insert`,
                            delete: `/basedata/${moduleConfig.url}/deleteByFid`,
                            selectByQueryModel: `/basedata/${moduleConfig.url}/selectByQueryModel`,
                            selectByValue: `/basedata/${moduleConfig.url}/selectByValue`,
                            update: `/basedata/${moduleConfig.url}/update`,
                        },
                    },
                    aluSearchXs: {
                        simpleInput: {
                            placeholder: `请输入${moduleConfig.name}代码/名称`,
                            prop: 'value',
                        },
                        complexInput: [
                            {
                                label: `${moduleConfig.name}代码：`,
                                placeholder: `请输入${moduleConfig.name}代码`,
                                prop: 'fCode'
                            },
                            {
                                label: `${moduleConfig.name}名称：`,
                                placeholder: `请输入${moduleConfig.name}名称`,
                                prop: 'fName'
                            }
                        ],
                        queryModel: {
                            value: '',
                            fName: '',
                            fCode: '',
                        }
                    },
                    aluTableXs: {
                        tableColumns: [
                            {
                                type: 'index'
                            },
                            {
                                prop: 'fcode',
                                label: `${moduleConfig.name}代码`
                            },
                            {
                                prop: 'fname',
                                label: `${moduleConfig.name}名称`
                            }
                        ]
                    },
                    aluFormXs: {
                        formItems: [
                            {
                                span: 12,
                                label: `${moduleConfig.name}代码：`,
                                prop: 'fcode',
                            },
                            {
                                span: 12,
                                label: `${moduleConfig.name}名称：`,
                                prop: 'fname',
                            },
                            {
                                span: 12,
                                prop: 'parentCode',
                                label: '上级地区：'
                            },
                            {
                                span: 24,
                                type: 'textarea',
                                prop: 'memo',
                                label: '备注：'
                            },

                        ],
                        formModel: {
                            fname: '',
                            fcode: '',
                            parentCode: '',
                            memo: ''
                        },
                        formRules: {
                            fname: [
                                {required: true, message: `请输入${moduleConfig.name}名称`, trigger: 'blur'},
                            ],
                            fcode: [
                                {required: true, message: `请输入${moduleConfig.name}代码`, trigger: 'blur'},
                            ],
                        },
                        formHeader: {
                            title: `查看${moduleConfig.name}`,
                            creator: 'admin',
                            createTime: '2017-12-14 9:10:08'
                        }
                    }
                }
            }
        },
        methods: {},
        mounted() {}
    }*/
</script>

<style lang="less" type="text/less" scoped>
    .module-area-info {
    }
</style>
