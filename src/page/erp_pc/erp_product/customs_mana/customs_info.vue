<template>
    <div></div>
    <!--<alu-page-xs
        class="module-model-input"
        :xsCompsCtrl="xsConfig.aluOthers"
        :xsFormSearch="xsConfig.aluSearchXs.queryModel"
        :xsFormCopy="xsConfig.aluFormXs.formModel"
        :xsFormRules="xsConfig.aluFormXs.formRules"
        :xsConfig="xsConfig"
        :xsFormHeader="xsConfig.aluFormXs.formHeader"
        @handleFetchChildTableData="handleFetchChildTableData">
        <template slot="child-tabs" slot-scope="childTabs">
            <el-tabs class="tab-submodel" v-model="xsTabs.model" @tab-click="handleTabsClick">
                <el-button class="btn-cyan add-btn" @click="handleSubModelCreate">新建</el-button>
                <el-tab-pane label="子型号明细" name="childModel">
                    <el-table
                        class="table-cell-tight"
                        cell-class-name="cell-tight"
                        :data="xsTabs.tableData">
                        <template v-for="item in xsTabs.tableHeader">
                            <el-table-column
                                v-if="item.type=='operate'"
                                fixed="right"
                                :prop="item.prop"
                                :label="item.label">
                                <template slot-scope="scope">
                                    <span class="blue-txt"
                                          @click="handleSubModelEdit(scope.row)">{{scope.row.editable ? '完成' : '编辑'}}</span>
                                    <span class="blue-txt"
                                          @click="handleSubModelDel(scope.row)">{{scope.row.editable ? '取消' : '删除'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                v-else-if="item.type=='checkbox'"
                                :prop="item.prop"
                                :label="item.label">
                                <template slot-scope="scope">
                                    <el-checkbox :disabled="!scope.row.editable" v-model="scope.row[item.prop]"
                                                 :true-label="1"
                                                 :false-label="0"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column
                                v-else-if="item.prop == 'sequence'"
                                fixed="left"
                                :prop="item.prop"
                                :label="item.label">
                                <template slot-scope="scope">
                                    <el-input class="input-sequence"
                                              v-if="scope.row.editable"
                                              type="number"
                                              v-model.number="scope.row[item.prop]"></el-input>
                                    <span v-else>{{scope.row[item.prop]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                v-else
                                :prop="item.prop"
                                :label="item.label">
                                <template slot-scope="scope">
                                    <el-input v-if="scope.row.editable" v-model="scope.row[item.prop]"></el-input>
                                    <span v-else>{{scope.row[item.prop]}}</span>
                                </template>
                            </el-table-column>
                        </template>

                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </template>
    </alu-page-xs>-->
</template>

<script>
    /*import AluPageXs from '$src/components/AluPageXs.vue'

    var moduleConfig = {
        url: 'Mat/AluModel',
    };

    export default {
        components: {
            AluPageXs,
        },
        data() {
            return {
                xsTabs: {
                    xsForm: {},
                    model: 'childModel',
                    tableData: [],
                    tableHeader: [
                        {
                            prop: 'sequence',
                            label: '序号',
                            width: 100
                        },
                        {
                            prop: '',
                            label: '物料代码',
                            width: 150
                        },
                        {
                            prop: '',
                            label: '物料名称',
                            width: 150
                        },
                        {
                            prop: 'isProfile',
                            label: '型材',
                            type: 'checkbox'
                        },
                        {
                            prop: 'isPvc',
                            label: '胶条',
                            type: 'checkbox'
                        },
                        {
                            prop: 'inactive',
                            label: '失效',
                            type: 'checkbox'
                        },
                        {
                            prop: '',
                            label: '支重',
                        },
                        {
                            prop: 'unitDigit',
                            label: '单位数量'
                        },
                        {
                            prop: 'unitWght',
                            label: '单位重量'
                        },
                        {
                            prop: 'memo',
                            label: '备注',
                            width: 300
                        },
                        {
                            prop: 'operate',
                            label: '操作',
                            type: 'operate'
                        }
                    ]
                },
                // ------------------- 组件配置 -------------------
                xsConfig: {
                    aluOthers: {
                        url: {
                            insert: `/basedata/Mat/AluModel/addAluModel`,
                            delete: `/basedata/Mat/AluModel/deleteAluModel`,
                            selectByQueryModel: `/basedata/Mat/AluModel/selectByQueryModel`,
                            selectByValue: `/basedata/Mat/AluModel/selectByQueryModel`,
                            update: `/basedata/Mat/AluModel/updateAluModel`,
                        },
                    },
                    aluSearchXs: {
                        simpleInput: {
                            placeholder: `请输入型号代码/名称`,
                            prop: 'fcode',
                        },
                        complexInput: [
                            {
                                label: '型材系列：',
                                type: 'select',
                                prop: 'a'
                            },
                            {
                                label: '型材分组：',
                                type: 'select',
                                prop: 'b'
                            },
                            {
                                label: '组合型材',
                                prop: 'c',
                                type: 'checkbox'
                            }
                        ],
                        queryModel: {
                            value: '',
                            a: '',
                            b: '',
                            c: ''
                        }
                    },
                    aluTableXs: {
                        tableColumns: [
                            {
                                type: 'selection',
                            },
                            {
                                prop: 'fname',
                                label: `型号`,
                                type: 'arr',
                                props: ['fcode', 'fname'],
                            },
                            {
                                prop: 'matGroupName',
                                label: `型材分组`,
                                type: 'arr',
                                props: ['matGroupCode', 'matGroupName']
                            },
                            {
                                prop: '',
                                label: '型材系列',
                                type: 'arr',
                                props: []
                            },
                            {
                                prop: 'isCombine',
                                label: '组合型材',
                                type: 'checkbox'
                            },
                            {
                                prop: 'isTear',
                                label: '撕筋',
                                type: 'checkbox'
                            },
                            {
                                prop: 'inactive',
                                label: '失效',
                                type: 'checkbox'
                            },
                        ]
                    },
                    aluFormXs: {
                        formItems: [
                            {
                                span: 12,
                                label: '型号代码：',
                                prop: 'fcode',
                            },
                            {
                                span: 12,
                                label: '型号状态：',
                                prop: 'h',
                                type: 'select',
                                module: 'base',
                                options: 'inactive',
                                props: {
                                    key: 'value',
                                    label: 'label',
                                    value: 'value'
                                }
                            },
                            {
                                span: 12,
                                label: '型号名称：',
                                prop: 'fname',

                            },
                            {
                                span: 12,
                                label: '形状类型：',
                                prop: 'shapeType',
                                type: 'select',
                                module: 'base',
                                options: 'inactive',
                                props: {
                                    key: 'value',
                                    label: 'label',
                                    value: 'value'
                                }
                            },
                            {
                                span: 12,
                                label: '型材分组：',
                                prop: 'a',
                                type: 'select',
                                module: 'base',
                                options: 'inactive',
                                props: {
                                    key: 'value',
                                    label: 'label',
                                    value: 'value'
                                }
                            },
                            {
                                span: 12,
                                label: '报关名称：',
                                prop: 'ciqCode',
                                type: 'select',
                                module: 'base',
                                options: 'inactive',
                                props: {
                                    key: 'value',
                                    label: 'label',
                                    value: 'value'
                                }
                            },
                            {
                                span: 12,
                                label: '型材系列：',
                                prop: 'b',
                                type: 'select',
                                module: 'base',
                                options: 'inactive',
                                props: {
                                    key: 'value',
                                    label: 'label',
                                    value: 'value'
                                }
                            },
                            {
                                span: 12,
                                label: '专利所属公司：',
                                prop: 'patentCompanyCode',
                                type: 'select',
                                module: 'base',
                                options: 'inactive',
                                props: {
                                    key: 'value',
                                    label: 'label',
                                    value: 'value'
                                }
                            },
                            {
                                span: 12,
                                label: '价格分组：',
                                prop: 'c',
                                type: 'select',
                                module: 'base',
                                options: 'inactive',
                                props: {
                                    key: 'value',
                                    label: 'label',
                                    value: 'value'
                                }
                            },
                            {
                                span: 3,
                                label: '组合型材',
                                prop: 'isCombine',
                                type: 'checkbox',
                            },
                            {
                                span: 2,
                                label: '撕筋',
                                prop: 'isTear',
                                type: 'checkbox'
                            },
                            {
                                span: 3,
                                label: '失效',
                                prop: 'inactive',
                                type: 'checkbox'
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
                                span: 8,
                                label: '壁厚:',
                                prop: 'thick',
                                type: 'number'
                            },
                            {
                                span: 8,
                                type: 'number',
                                label: '单支面积:',
                                prop: 'unitArea'
                            },
                            {
                                span: 8,
                                type: 'number',
                                label: '米重:',
                                prop: 'meterWght'
                            },
                            {
                                span: 8,
                                type: 'number',
                                label: '长度:',
                                prop: 'lengthx'
                            },
                            {
                                span: 8,
                                type: 'number',
                                label: '直径:',
                                prop: 'd'
                            },
                            {
                                span: 8,
                                type: 'number',
                                label: '装饰面积:',
                                prop: 'unitDecorateArea'
                            },
                            {
                                span: 8,
                                type: 'number',
                                label: '支重:',
                                prop: 'unitWght'
                            },
                            {
                                span: 8,
                                type: 'number',
                                label: '周长:',
                                prop: 'grith'
                            },
                            {
                                span: 8,
                                type: 'number',
                                label: '损耗率(%):',
                                prop: 'lossRate'
                            },
                            {
                                span: 12,
                                type: 'select',
                                label: '难度等级:',
                                prop: 'hardLevel',
                                module: 'base',
                                options: 'inactive',
                                props: {
                                    key: 'value',
                                    label: 'label',
                                    value: 'value'
                                }
                            },
                            {
                                span: 12,
                                type: 'select',
                                label: '禁喷类型:',
                                prop: 'e',
                                module: 'base',
                                options: 'inactive',
                                props: {
                                    key: 'value',
                                    label: 'label',
                                    value: 'value'
                                }
                            },
                            {
                                span: 12,
                                label: '机台级别:',
                                prop: 'machineLevel'
                            },
                            {
                                span: 12,
                                label: '包装方式:',
                                prop: 'packCode'
                            },
                            {
                                span: 12,
                                type: 'select',
                                label: '机台棒径:',
                                prop: 'f',
                                module: 'base',
                                options: 'inactive',
                                props: {
                                    key: 'value',
                                    label: 'label',
                                    value: 'value'
                                }
                            },
                            {
                                span: 12,
                                type: 'select',
                                label: '质量要求:',
                                prop: 'g',
                                module: 'base',
                                options: 'inactive',
                                props: {
                                    key: 'value',
                                    label: 'label',
                                    value: 'value'
                                }
                            },
                            {
                                span: 24,
                                label: '备注：',
                                prop: 'memo',
                                type: 'textarea'
                            }
                        ],
                        formModel: {
                            fname: '',
                            fcode: '',
                            shapeType: '',
                            ciqCode: '',
                            patentCompanyCode: '',
                            isCombine: 0,
                            isTear: 0,
                            inactive: 0,
                            thick: 0,
                            unitArea: 0,
                            meterWght: 0,
                            // TODO：长度字段不能为length 和js冲突
                            lengthx: 0,
                            unitDecorateArea: 0,
                            unitWght: 0,
                            grith: 0,
                            lossRate: 0,
                            hardLevel: 0,
                            machineLevel: 0,
                            packCode: '',
                            memo: '',
                            // TODO: delete later
                            a: '',
                            b: '',
                            c: '',
                            d: 0,
                            e: '',
                            f: '',
                            g: '',
                            h: ''
                        },
                        formRules: {
                            fname: [
                                {required: true, message: `请输入型号名称`, trigger: 'blur'},
                            ],
                            fcode: [
                                {required: true, message: `请输入型号代码`, trigger: 'blur'},
                            ],
                        },
                        formHeader: {
                            title: '型号资料',
                            creator: '',
                            createTime: ''
                        }
                    }
                }
            }
        },
        methods: {
            // 新建
            handleSubModelCreate() {
                this.$set(this.xsTabs.tableData, this.xsTabs.tableData.length, {
                    editable: true,
                    create: true,
                    modelCode: this.xsForm.fcode
                })
            },
            // 编辑
            handleSubModelEdit(row) {
                var index = this.$lodash.findIndex(this.xsTabs.tableData, {
                    fid: row.fid
                })
                if (row.create) {
                    index = this.xsTabs.tableData.length - 1
                }
                if (row.editable) {
                    // 更新
                    var url = row.create ? 'insert' : 'update'
                    this.$lodash.unset(this.xsTabs.tableData[index], 'editable')
                    this.$lodash.unset(this.xsTabs.tableData[index], 'create')
                    this.fetch(`basedata/Mat/AluModelCombine/${url}`, this.xsTabs.tableData[index])
                        .then((res) => {
                            this.mixinEleMessage(res, () => {
                                this.handleFetchChildTableData({xsForm: false})
                            })
                        })
                } else {

                    this.xsTabs.tableData[index].editable = true
                    this.$set(this.xsTabs.tableData, index, this.xsTabs.tableData[index])
                }
            },
            // 删除
            handleSubModelDel(row) {
                if (row.editable) {
                    // 进入编辑
                    var index = this.$lodash.findIndex(this.xsTabs.tableData, {
                        fid: row.fid
                    })
                    // 退出编辑
                    this.xsTabs.tableData[index].editable = false
                    this.$set(this.xsTabs.tableData, index, this.xsTabs.tableData[index])
                } else {

                    this.fetch('basedata/Mat/AluModelCombine/deleteByFid', {
                        fid: row.fid
                    }).then((res) => {
                        this.mixinEleMessage(res, () => {
                            this.handleFetchChildTableData({xsForm: false})
                        })
                    })
                }

            },
            // 点击tabs事件
            handleTabsClick(tab, event) {
                console.log(tab, event)
            },
            // 拿到子表格数据
            handleFetchChildTableData({xsForm = {}, setEmpty = false}) {
                if (xsForm) {
                    this.xsForm = this.$lodash.cloneDeep(xsForm)
                }
                if (setEmpty || !this.xsForm.fcode) {
                    this.xsTabs.tableData = []
                } else {
                    this.getAjax(`basedata/Mat/AluModel/selectByQueryModel?pageSize=100&modelCode=${this.xsForm.fcode}`)
                        .then((res) => {
                            this.mixinEleMessage(res, () => {
                                this.xsTabs.tableData = this.$lodash.cloneDeep(res.data.list)
                                for (let i = 0; i < this.xsTabs.tableData.length; i++) {
                                    this.xsTabs.tableData[i].editable = false
                                }
                            }, () => {
                                this.xsTabs.tableData = []
                            }, {noSuccMsg: true, noFailMsg: true})
                        })
                }

            }
        },
        mounted() {
        }
    }*/
</script>

<style lang="less" type="text/less">
    .module-model-input {
        .tab-submodel {
            .blue-txt {
                color: #2d8cf0;
            }
        }
        .el-input__inner {
            padding: 0 ;
            padding-left: 5px;
        }
        .input-sequence {
            input.el-input__inner {
                padding: 0;
                padding-left: 5px;
            }
        }
    }
</style>
