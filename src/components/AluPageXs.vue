<!--
  -- @file 简单页面
  -- @author salonnlee <huanghj199512@163.com>
  -- @copyright 2018 ZL
  --
  -- @props - 父组件传递给子组件的数据
  -- @param {Object} xsCompsCtrl - 组件控制对象
     xsCompsCtrl: {
        /* 后台接口地址 */
        url: {
            /* 插入 */
            insert: '',
            /* 删除 */
            delete: '',
            /* 模糊查询/简单查询 */
            selectByValue: '',
            /* 复杂查询 */
            selectByQueryModel: '',
            /* 修改/更新 */
            update: ''
        }
     }
  -- @param {Object} xsFormSearch - 搜索组件 查询对象
     xsFormSearch: {
        value: '',
        fname: '',
        fcode: ''
     }
  -- @param {Object} xsFormCopy - 表单组件 提交对象
     xsFormCopy: {
        fname: '',
        fcode: '',
        inactive: '',
        memo: ''
     }
  -- @param {Object} xsFormRules - 表单组件 验证字段对象
     xsFormRules: {
        fname: [
            { required: true, message: '', trigger: 'blur' }
        ],
        fcode: [
            { required: true, message: '', trigger: 'blur' }
        ]
     }
  -- @param {Object} xsFormHeader - 表单组件 头部信息
      xsFormHeader: {
        title: '',
        creator: '',
        createTime: ''
      }
  -- @param {Object} xsConfig - 包裹以上所有对象的对象
     xsConfig: {
        aluOthers: {
            url: {} /* 后台接口地址 */
        },
        aluSearchXs: {
            simpleInput: {}, /* 简单查询配置 */
            complexInput: [], /* 复杂查询配置 */
            queryModel: {} /* 传送给后台的查询对象 */
        },
        aluTableXs: {
            tableColumns: [ /* 表格组件配置项 */
                {
                    prop: 'fname',
                    label: '名称'
                }
            ]
        },
        aluFormXs: {
            formItems: [ /* 表单组件配置项 */
                {
                    span: 12,
                    label: '名称',
                    prop: 'fname'
                }
            ],
            formModel: { /* 传送给后台的表单对象 */
                fname: '',
                fcode: '',
                inactive: '',
                memo: ''
            },
            formRules: { /* 表单字段验证对象 */ },
            formHeader: {
                /* 表单组件 - 表头信息 */
                title: '',
                creator: 'admin',
                createTime: '2017-12-14 9:10:08'
            }
        }
     }
-->

<template>
    <div class="comp-alu-page-xs l-spa">
        <el-row :gutter="10" justify="space-around" type="flex">
            <el-col style="margin-left: 10px" :span="9">
                <!---------------------- Alu-Search-Xs ---------------------->
                <alu-search-xs ref="aluSearchXs"
                               :xsFormSearch="xsFormSearch"
                               @handle-search-complex="handleSearchComplex"
                               @handle-search-simple="handleSearchSimple"
                               @handle-create-new="handleCreateNew">
                    <template slot="simple" slot-scope="simpleSlot">
                        <el-input :placeholder="xsConfig.aluSearchXs.simpleInput.placeholder" clearable
                                  @keyup.native.enter="simpleSlot.handleSearchSimple" @focus="handleShowComplex"
                                  v-model="simpleSlot.xsFormSearch[xsConfig.aluSearchXs.simpleInput.prop]"></el-input>
                    </template>
                    <template slot="complex" slot-scope="complexSlot">
                        <el-form-item v-for="(item, index) in xsConfig.aluSearchXs.complexInput"
                                      :key="index"
                                      :label="item.type == 'checkbox' ? '' : item.label"
                                      :prop="item.prop">
                            <el-checkbox v-if="item.type=='checkbox'"
                                         :true-label="1" :false-label="0"
                                         v-model="complexSlot.xsFormSearch[item.prop]">{{item.label}}
                            </el-checkbox>
                            <el-input v-else :placeholder="item.placeholder" clearable
                                      @keyup.native.enter="complexSlot.handleSearchComplex"
                                      v-model="complexSlot.xsFormSearch[item.prop]"></el-input>
                        </el-form-item>
                    </template>
                </alu-search-xs>
                <!---------------------- Alu-Search-Xs ---------------------->
                <!----------------------- Alu-Table-Xs ---------------------->
                <alu-grid-xs
                        v-if="xsConfig.aluOthers.components && xsConfig.aluOthers.components.AluGridXs"
                        ref="aluGridXs"
                        @handle-fetch-data="handleFetchData"
                        @handle-grid-change="handleTableRowChange"
                        :xsGridData="xsTableData">
                </alu-grid-xs>
                <alu-tree-xs
                        ref="aluTreeXs"
                        v-else-if="xsConfig.aluOthers.components && xsConfig.aluOthers.components.AluTreeXs"
                        @handle-fetch-data="handleFetchData"
                        @handle-tree-change="handleTableRowChange"
                        :xsTreeData="xsTableData">
                </alu-tree-xs>
                <alu-table-xs
                        v-else
                        ref="aluTableXs"
                        :xsCompsCtrl="xsCompsCtrl"
                        :xsTableData="xsTableData"
                        :pageTotal="xsPageTotal"
                        @handle-fetch-data="handleFetchData"
                        @handle-table-row-change="handleTableRowChange">
                    <template slot="table" slot-scope="tableSlot">
                        <template v-for="(item, index) in xsConfig.aluTableXs.tableColumns">
                            <el-table-column
                                    v-if="item.type == 'selection'"
                                    type="selection"
                                    width="55">
                            </el-table-column>
                            <el-table-column
                                    v-else-if="item.type == 'index'"
                                    type="index"
                                    label="序号"
                                    width="55">
                            </el-table-column>
                            <el-table-column
                                    v-else-if="item.type == 'checkbox'"
                                    type="index"
                                    :label="item.label"
                                    :prop="item.prop"
                                    width="55">
                                <template slot-scope="scope">
                                    <el-checkbox :true-label="1" :false-label="0" v-model="scope.row[item.prop]" disabled></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    v-else-if="item.prop == 'inactive'"
                                    :prop="item.prop"
                                    :label="item.label"
                                    width="55">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.inactive == 0 ? '启用' : '失效' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    v-else-if="item.type == 'arr'"
                                    :prop="item.prop"
                                    :label="item.label"
                                    :min-width="item.width">
                                <template slot-scope="scope">
                                    <p v-for="(p, index) in item.props" :key="index" style="margin: 0">{{ scope.row[p] }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    v-else
                                    :prop="item.prop"
                                    :label="item.label"
                                    :min-width="item.width">
                            </el-table-column>
                        </template>
                    </template>
                </alu-table-xs>
                <!----------------------- Alu-Table-Xs ---------------------->
            </el-col>
            <el-col style="margin-right: 10px" :span="15">
                <!------------------------ Alu-Form-Xs ---------------------->
                <alu-form-xs ref="aluFormXs"
                             :isPopUp="false"
                             :xsFormHeader="xsFormHeader"
                             :xsForm.sync="xsForm"
                             :xsFormData="xsFormData"
                             :xsFormRules="xsFormRules"
                             @handle-click-y="handleClickY"
                             @handle-click-x="handleClickX">
                    <template slot="header" slot-scope="headerSlot">
                        <span>创建人：{{headerSlot.xsFormHeader.creator}}</span>
                        <span>创建时间：{{headerSlot.xsFormHeader.createTime}}</span>
                    </template>
                    <template slot="form" slot-scope="formSlot">
                        <el-row class="comp-alu-form-xs-slot-form"
                                :class="{'comp-alu-form-xs-readable': !formSlot.status.isEdit }">
                            <el-col :key="index" v-for="(item,index) in xsConfig.aluFormXs.formItems" :span="item.span">

                                <el-form-item v-if="item.type && item.type == 'select'" :label="item.label"
                                              :prop="item.prop">
                                    <alu-select-xs
                                            :disabled="!formSlot.status.isEdit"
                                            :xsSelectValue.sync="formSlot.xsForm[item.prop]"
                                            :xsSelectConfig="{
                                                xsModuleName: item.module,
                                                xsSelectValue: formSlot.xsForm[item.prop],
                                                xsSelectOptionsName: item.options,
                                                xsSelectProps: {
                                                    key: item.props.key,
                                                    label: item.props.label,
                                                    value: item.props.value
                                                }
                                            }"
                                    ></alu-select-xs>
                                </el-form-item>

                                <i :style="item.style" v-else-if="item.type == 'line'"></i>

                                <el-form-item v-else-if="item.type == 'checkbox'" label="" :prop="item.prop">
                                    <el-checkbox :disabled="!formSlot.status.isEdit"
                                                 :true-label="1" :false-label="0" v-model="formSlot.xsForm[item.prop]">
                                        {{item.label}}
                                    </el-checkbox>
                                </el-form-item>
                                <el-form-item v-else :label="item.label" :prop="item.prop">
                                    <span>{{formSlot.xsForm[item.prop]}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                    <template v-if="!tabsSlot.status.isEdit" slot="tabs" slot-scope="tabsSlot">
                        <slot name="child-tabs"></slot>
                    </template>
                </alu-form-xs>
                <!------------------------ Alu-Form-Xs ---------------------->
                <!------------------------ Alu-Form-Xs PopUp ------------------------>
                <transition name="popup">
                    <alu-form-xs ref="aluFormXsPop"
                                 id="alu-form-xs-pop"
                                 v-show="isPopUpShow"
                                 :isPopUp="true"
                                 :xsFormHeader="xsFormHeader"
                                 :xsForm.sync="xsForm"
                                 :xsFormData="xsFormData"
                                 :xsFormRules="xsFormRules"
                                 @handle-click-y="handleClickYPop"
                                 @handle-click-x="handleClickXPop">
                        <template slot="header" slot-scope="headerSlot">
                            <span>创建人：{{headerSlot.xsFormHeader.creator}}</span>
                            <span>创建时间：{{headerSlot.xsFormHeader.createTime}}</span>
                        </template>
                        <template slot="form" slot-scope="formSlot">
                            <el-row :class="{'comp-alu-form-xs-readable': !formSlot.status.isEdit }">
                                <el-col :key="index" v-for="(item, index) in xsConfig.aluFormXs.formItems" :span="item.span">

                                    <el-form-item v-if="item.type && item.type == 'select'" :label="item.label"
                                                  :prop="item.prop">
                                        <alu-select-xs
                                                v-if="formSlot.status.isEdit"
                                                :xsSelectValue.sync="formSlot.xsForm[item.prop]"
                                                :xsSelectConfig="{
                                                xsModuleName: item.module,
                                                xsSelectValue: formSlot.xsForm[item.prop],
                                                xsSelectOptionsName: item.options,
                                                xsSelectProps: {
                                                    key: item.props.key,
                                                    label: item.props.label,
                                                    value: item.props.value
                                                }
                                            }"
                                        ></alu-select-xs>
                                        <span v-else>{{formSlot.xsForm[item.prop]}}</span>
                                    </el-form-item>

                                    <i :style="item.style" v-else-if="item.type == 'line'"></i>

                                    <el-form-item v-else-if="item.type == 'checkbox'" label="" :prop="item.prop">
                                        <el-checkbox :disabled="!formSlot.status.isEdit"
                                                     :true-label="1" :false-label="0"
                                                     v-model="formSlot.xsForm[item.prop]">
                                            {{item.label}}
                                        </el-checkbox>
                                    </el-form-item>

                                    <el-form-item v-else-if="item.type && item.type == 'number'" :label="item.label"
                                                  :prop="item.prop">
                                        <el-input-number
                                                v-if="formSlot.status.isEdit"
                                                v-model="formSlot.xsForm[item.prop]"
                                                controls-position="right"></el-input-number>
                                        <span v-else>{{formSlot.xsForm[item.prop]}}</span>
                                    </el-form-item>

                                    <el-form-item v-else-if="item.type && item.type == 'textarea'" :label="item.label"
                                                  :prop="item.prop">
                                        <el-input
                                                v-if="formSlot.status.isEdit"
                                                type="textarea"
                                                :rows="2"
                                                v-model="formSlot.xsForm[item.prop]"></el-input>
                                        <span v-else>{{formSlot.xsForm[item.prop]}}</span>
                                    </el-form-item>

                                    <el-form-item v-else :label="item.label" :prop="item.prop">
                                        <el-input v-if="formSlot.status.isEdit" clearable
                                                  v-model="formSlot.xsForm[item.prop]"></el-input>
                                        <span v-else>{{formSlot.xsForm[item.prop]}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </template>
                    </alu-form-xs>
                </transition>
                <!---------------------- END Alu-Form-Xs PopUp ---------------------->
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import AluFormXs from '$src/components/AluFormXs.vue'
    import AluSearchXs from '$src/components/AluSearchXs.vue'
    import AluTableXs from '$src/components/AluTableXs.vue'
    import AluGridXs from '$src/components/AluGridXs.vue'
    import AluTreeXs from '$src/components/AluTreeXs.vue'
    import AluSelectXs from '$src/components/AluSelectXs.vue'
    import {mapState} from 'vuex'

    export default {
        props: {
            'xsCompsCtrl': {
                type: Object
            },
            'xsFormSearch': {
                type: Object
            },
            'xsFormCopy': {
                type: Object
            },
            'xsFormRules': {
                type: Object
            },
            'xsFormHeader': {
                type: Object
            },
            'xsConfig': {
                type: Object
            },
        },
        components: {
            AluSelectXs,
            AluTreeXs,
            AluGridXs,
            AluFormXs,
            AluSearchXs,
            AluTableXs,
        },
        computed: {
            ...mapState({
                pvcTypeCode: state => state.product.pvcTypeCode
            })
        },
        data() {
            return {
                isPopUpShow: false,
                xsFormData: {},
                xsTableData: [],
                xsForm: {},
                xsPageTotal: 0,
                xsTableRowIndex: 0
            }
        },
        methods: {
            // ------------------- 搜索组件 -------------------
            // 查询
            handleSearchSimple() {
                // 抓取ALuTableXs表格数据
                if (this.$refs.aluTableXs) {
                    this.$refs.aluTableXs.handleFetchData(this.xsFormSearch, true)
                } else if (this.$refs.aluGridXs) {
                    this.$refs.aluGridXs.handleFetchData(this.xsFormSearch, true)
                }
                // 将更多查询弹出框隐藏
                this.$refs.aluSearchXs.status.isShowSearchComplex = false;
            },
            // 查询 - 更多查询
            handleSearchComplex() {
                // 抓取ALuTableXs表格数据
                if (this.$refs.aluTableXs) {
                    this.$refs.aluTableXs.handleFetchData(this.xsFormSearch)
                } else if (this.$refs.aluGridXs) {
                    this.$refs.aluGridXs.handleFetchData(this.xsFormSearch)
                }
                // 将更多查询弹出框隐藏
                this.$refs.aluSearchXs.status.isShowSearchComplex = false;
            },
            handleShowComplex() {
                this.$refs.aluSearchXs.status.isShowSearchComplex = true;
            },
            handlePopUpToggle(isShow = true) {
                this.isPopUpShow = isShow
            },
            // 新建
            handleCreateNew() {
                this.handlePopUpToggle();
                // 将AluFormXs表单组件设置为新建状态
                if (!this.$refs.aluFormXsPop.status.isCreateNew) {
                    this.$refs.aluFormXsPop.status.isCreateNew = true
                    // ! 只有isCreateNew为false时才去触发点击Y事件
                    this.$refs.aluFormXsPop.status.isEdit = true;
                }
                // 置空AluFormXs表单值
                this.$refs.aluFormXsPop.handleFormCopy()
                this.mixinSetObjectEmpty(this.xsForm)
            },
            // ------------------- 表单组件 -------------------
            // √
            handleClickY() {
                this.handlePopUpToggle(true)
                this.$refs.aluFormXsPop.handleFormCopy()
            },
            // ×
            handleClickX() {
                // 如果this.xsForm为空则不让aluFormXs编辑操作生效
                if (this.mixinIsObjectEmpty(this.xsForm)) {
                    return;
                }
                /* TODO：冗余 只需传fid即可 */
                this.fetch(this.xsCompsCtrl.url.delete, this.xsForm).then(res => {
                    this.mixinEleMessage(res, () => {
                        this.handleCompsCtrl()
                    })
                })
            },
            handleClickYPop() {
                let url;
                if (this.$refs.aluFormXsPop.status.isCreateNew) {
                    url = 'insert';
                } else {
                    url = 'update';
                }
                this.fetch(this.xsCompsCtrl.url[url], this.xsForm).then(res => {
                    this.mixinEleMessage(res, () => {
                        // this.$refs.aluFormXs.handleToggleStatus('isEdit');
                        this.handleCompsCtrl()
                        this.handlePopUpToggle(false)
                    });
                    this.$refs.aluFormXsPop.handleIsCreateNew()
                })
            },
            handleClickXPop() {
                this.handlePopUpToggle(false)
            },
            handleCompsCtrl() {
                if(this.$refs.aluTableXs) {
                    this.$refs.aluTableXs.handleFetchData()
                }else if(this.$refs.aluGridXs) {
                    this.$refs.aluGridXs.handleFetchData()
                }else if(this.$refs.aluTreeXs) {
                    this.$refs.aluTreeXs.handleFetchData()
                }
            },
            // ------------------- 表格组件 -------------------
            // 表格当前行改变
            handleTableRowChange(row, oldRow) {
                // 表格抓取数据改变时，都会触发表格当前行变化事件，这时候不应该记录row的index，
                // 所以当表格当前行row是null时，跳过设置xsTableRowIndex的值
                if(row !== null) {
                    this.xsTableRowIndex = this.$lodash.findIndex(this.xsTableData, row)
                }
                // 但是当xsTableData的长度小于当前索引值时，也需要把xsTableRowIndex设置为0
                if(this.xsTableData.length - 1 <= this.xsTableRowIndex) {
                    this.xsTableRowIndex = 0
                }
                if(!row) {
                    // 如果当前行为空 则置空xsForm属性值
                    this.mixinSetObjectEmpty(this.xsForm)
                }else {
                    this.xsForm = this.$lodash.cloneDeep(row)
                }
                this.$emit('handleFetchChildTableData', {xsForm: this.xsForm})
            },
            // 表格数据改变
            handleTableDataChange: function (res) {
                this.xsTableData = res.data.list;
                // 把请求回来的数据做分页数总大小设置
                this.xsPageTotal = res.data.total;
                this.$nextTick(() => {
                    if(this.$refs.aluGridXs) {
                        // 设置Grid第一格为选中格
                        this.$refs.aluGridXs.handleClickCountry({
                            item: this.xsTableData[0],
                            index: 0
                        })
                    }else if(this.$refs.aluTableXs) {
                        // 设置表格第一行为选中行
                        this.$refs.aluTableXs.$refs.elTable.setCurrentRow(this.xsTableData[this.xsTableRowIndex])
                    }else if(this.$refs.aluTreeXs) {
                        this.$refs.aluTreeXs.handleCreateTreeStructure(this.xsTableData);
                    }
                })
            },
            // 抓取表格数据
            handleFetchData(queryModel, isValue, xsPager, config) {
                // 当是分页器的页数改变时，就需要将表格索引重新设置为0了
                if(config && config.isPagerChange) {
                    this.xsTableRowIndex = 0
                }
                let prop = '';
                isValue ? prop = 'selectByValue' : prop = 'selectByQueryModel';
                this.getAjax(this.xsCompsCtrl.url[prop] + `?pageNo=${xsPager.pageNo}&pageSize=${xsPager.pageSize}`
                    + this.mixinToQueryString(queryModel)).then(res => {
                    this.mixinEleMessage(res, () => {
                        this.handleTableDataChange(res)
                    }, () => {
                        this.handleTableDataChange({data: {list: []}})
                        this.$emit('handleFetchChildTableData', {
                            setEmpty: true
                        })
                    }, {
                        noSuccMsg: true
                    })

                })
            },
        },
        mounted() {
            this.xsForm = this.$lodash.cloneDeep(this.xsFormCopy)
        }
    }
</script>

<style lang="less" type="text/less" scoped>
    .comp-alu-page-xs {
        #alu-form-xs-pop {
            position: absolute;
            z-index: 1500;
            top: 0;
            width: 100%;
            margin-right: 5px;
        }
        .popup-enter-active, .popup-leave-active {
            transition: left 0.3s;
            left: 0;
        }
        .popup-enter, .popup-leave-to {
            left: 100%;
        }
    }
</style>
