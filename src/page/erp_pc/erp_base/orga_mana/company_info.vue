<template>
    <div></div>
    <!--<alu-page-xs
            class="module-strip-model"
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
        url: 'Org/Company',
        name: '公司'
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
                            },
                            {
                                type: 'checkbox',
                                prop: 'isPlantOrg',
                                label: '生产公司',
                            },
                            {
                                type: 'checkbox',
                                prop: 'isSaleOrg',
                                label: '销售公司'
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
                                label: '英文：',
                                prop: 'enName'
                            },
                            {
                                span: 12,
                                label: '别名：',
                                prop: 'aliasName'
                            },

                            {
                                span: 7,
                                type: 'checkbox',
                                prop: 'isPlantOrg',
                                label: '生产公司',
                            },
                            {
                                span: 7,
                                type: 'checkbox',
                                prop: 'isSaleOrg',
                                label: '销售公司',
                            },
                            {
                                span: 7,
                                type: 'checkbox',
                                prop: 'inactive',
                                label: '失效',
                            },
                            {
                                type: 'line',
                                style: {
                                    display: 'block',
                                    margin: '10px auto',
                                    height: '1px',
                                    width: '100%',
                                    backgroundColor: '#cecece'
                                }
                            },
                            {
                                span: 12,
                                prop: 'countryName',
                                label: '国家：'
                            },
                            {
                                span: 12,
                                prop: 'areaName',
                                label: '省区：'
                            },
                            {
                                span: 12,
                                prop: 'linkMan',
                                label: '联系人：'
                            },
                            {
                                span: 12,
                                prop: 'mobile',
                                label: '手机：'
                            },
                            {
                                span: 12,
                                prop: 'tel',
                                label: '电话：'
                            },
                            {
                                span: 12,
                                prop: 'fax',
                                label: '传真：'
                            },
                            {
                                span: 12,
                                prop: 'email',
                                label: '邮箱：'
                            },
                            {
                                span: 12,
                                prop: 'address',
                                label: '地址：'
                            },
                            {
                                span: 24,
                                prop: 'url',
                                label: '网址：'
                            },
                            {
                                span: 24,
                                prop: 'memo',
                                type: 'textarea',
                                label: '备注：'
                            }
                        ],
                        formModel: {
                            fname: '',
                            fcode: '',
                            inactive: '',
                            memo: '',
                            tel: ''
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
                            title: `查看公司资料`,
                            creator: 'admin',
                            createTime: '2017-12-14 9:10:08'
                        }
                    }
                }
            }
        },
        methods: {},
        mounted() {
        }
    }*/
</script>

<style lang="less" type="text/less" scoped>
    .module-strip-model {
    }
</style>
