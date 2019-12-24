<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap" @click="handleNotAllowed" v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleAdd">新建</el-button>
                <el-button @click="handleRefresh">重置</el-button>
                <slot name="other-common-btn"></slot>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="searchProp || propData"
                :searchForm="searchForm"
                @getData="getSearchList"
                @changeStatus="changeStatus"
            ></CommonSearch>
            <!--表格区域-->
            <CommonTable
                v-if="isResize&&!isTreeTable"
                ref="commontable"
                :mainHeight="mainHeight"
                :isShowStatus="isShowStatus"
                :propData="propData"
                :otherVariable="otherVariable"
                :tableData="tableData"
                @handleDetail="handleDetail"
            ></CommonTable>
            <!--树形表格-->
            <TreeTable
                v-if="isResize&&isTreeTable"
                ref="treetable"
                :propData="propData"
                :mainHeight="mainHeight"
                :isShowStatus="isShowStatus"
                :tableData="tableData"
                @handleDetail="handleDetail"
            ></TreeTable>
            <!--分页区域-->
            <CommonPagination
                v-if="!treeObject.isNotList"
                :pageObj="pageObj"
                @getData="getInitPage"
            ></CommonPagination>
        </div>
        <div class="common-right" :style="{width: otherVariable.contentWidth + '%'}">
            <!--编辑/详情区域-->
            <CommonDetail
                marginTop="30px"
                :editRules="editRules"
                :isShowStatus="isShowStatus"
                :otherVariable="otherVariable"
                :propData="formProp || propData"
                :detailForm="detailForm"
                @toggleSpread="toggleSpread"
                @handleEdit="handleEdit"
                @handleDelete="handleDelete"
                @handleCancel="handleCancel"
                @handleSave="handleSave"
                @selectChange="selectChange"
            >
                <template slot="head-form-title">
                    <div class="head-form-title">
                        <span>{{otherVariable.detailTitle}}</span>
                    </div>
                </template>
                <template slot="content-other">
                    <slot name="content-other"></slot>
                </template>
            </CommonDetail>
            <!--新增区域-->
            <transition name="popup">
                <CommonAdd
                    marginTop="30px"
                    :addRules="addRules"
                    v-show="isShowStatus.isPopUp"
                    :otherVariable="otherVariable"
                    :propData="formProp || propData"
                    :addForm="addForm"
                    @handleCancel="handleCancel"
                    @handleSave="handleSave"
                    @selectChange="selectChange"
                >
                    <template slot="head-form-title">
                        <div class="head-form-title">
                            <span>{{otherVariable.addTitle}}</span>
                        </div>
                    </template>
                </CommonAdd>
            </transition>
        </div>
    </div>
</template>

<script>
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    import CommonDetail from '$src/components/CommonDetail'
    import CommonAdd from '$src/components/CommonAdd'
    import TreeTable from '$src/components/TreeTable'
    export default {
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetail,
            CommonAdd,
            TreeTable
        },
        props: {
            // 其他配置
            'otherVariable': {
                type: Object
            },
            // 搜索映射
            'searchProp': {
                type: Array
            },
            // 表格映射
            'propData': {
                type: Array
            },
            // 详情映射
            'formProp': {
                type: Array
            },
            // api配置
            'ajaxConfig': {
                type: Object,
                default: function() {
                    return {
                        defaultParams: {},
                        dataObj: {},
                        addObj: {},
                        updateObj: {},
                        deleteObj: {}
                    }
                }
            },
            // 编辑的校验规则
            'editRules': {
                type: Object
            },
            // 新增的校验规则
            'addRules':{
                type: Object
            },
            // 是否为树形表格
            'isTreeTable': {
                type: Boolean,
                default: false
            },
            // 是否对子级操作
            'isOpenChild': {
                type: Boolean,
                default: false
            },
            // 是否含有子表
            'hasChildTable': {
                type: Boolean,
                default: false
            },
            // 数据接口是否含有list
            'treeObject': {
                type: Object,
                default: function () {
                        return {
                            isNotList: false,
                            parentField:'parentId',
                            childField:'fid'
                        }
                }
            }
        },
        watch: {
            'isShowStatus.isPopUp':{
                handler(val) {
                    this.isShowNotAllowed = val;
                }
            },
            'isShowStatus.isRead':{
                handler(val) {
                    this.isShowNotAllowed = !val;
                }
            },
        },
        data() {
            return {
                mainHeight: 716,
                isResize: true,
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                isShowNotAllowed: false,
                operateType: null,
                tempWidth: null,
                whetherUseList: this.getStaticList('whetherUse'),
                tableData: [],
                searchForm: {},
                addForm: {},
                detailForm: {},
                copyForm: {},
                detailId: null,
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonTotal: 0
                },
                //树的切换相关
                statusValue: 0,
                isChangeTree: false
            }
        },
        created() {
            this.initSearch();
        },
        mounted() {
            this.getData();
            this.listenResize();
            this.changeSize();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            initSearch() {
                this.searchForm = this.ajaxConfig.defaultParams || {};
            },
            //获取数据
            getData() {
                this.tableData = [];
                if(this.isChangeTree) {
                    this.$emit('toggleTree',this.statusValue)
                }
                this[this.ajaxConfig.dataObj.method](`${this.ajaxConfig.dataObj.url}?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(!this.treeObject.isNotList) {
                            if(result.data && result.data.list.length) {
                                result.data.list.forEach(item => {
                                    //状态 inactive
                                    if(item.inactive === null) {
                                        item.inactive = 0
                                    }
                                });
                                this.tableData = result.data.list;
                                this.pageObj.commonTotal = result.data.total;
                                if(this.isTreeTable) {
                                    this.tableData = this.setTreeData(result.data.list,this.treeObject.parentField,this.treeObject.childField);
                                    this.$nextTick(() => {
                                        this.$refs.treetable.renderRow(this.tableData[0].fid);
                                    });
                                }else {
                                    this.$nextTick(() => {
                                        this.$refs.commontable.renderRow(this.tableData[0].fid);
                                    });
                                }
                            }else {
                                this.tableData = [];
                                this.pageObj.commonTotal = 0;
                            }
                        }else {
                            if(result.data && result.data.length) {
                                this.tableData = result.data;
                                if(this.isTreeTable) {
                                    this.tableData = this.setTreeData(result.data,this.treeObject.parentField,this.treeObject.childField);
                                    this.$nextTick(() => {
                                        this.$refs.treetable.renderRow(this.tableData[0].fid);
                                    });
                                }else {
                                    this.$nextTick(() => {
                                        this.$refs.commontable.renderRow(this.tableData[0].fid);
                                    });
                                }
                            }else {
                                this.tableData = [];
                            }
                        }
                    })
                    .then(() => {
                        this.$nextTick(() => {
                            if(this.isTreeTable) {
                                this.$refs.treetable.initStatusData();
                            }
                        })
                    })
            },
            //刷新
            handleRefresh() {
                this.searchForm = {};
                this.initSearch();
                this.getData();
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //获取详情
            handleDetail(row) {
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this[this.ajaxConfig.dataObj.method](this.ajaxConfig.dataObj.url,{fid:row.fid})
                    .then(result => {
                        if(result.status === 200) {
                            if(!this.treeObject.isNotList) {
                                this.detailForm = result.data.list[0];
                                this.copyForm = this.$lodash.cloneDeep(result.data.list[0]);
                            }else {
                                this.detailForm = result.data[0];
                                this.copyForm = this.$lodash.cloneDeep(result.data[0]);
                            }
                        }else {
                            this.$message({
                                message: '请求失败',
                                type: 'warning'
                            });
                            this.detailForm = {};
                            this.copyForm = {};
                        }
                    });
                // 如果含有子表，则调用该方法以获取子表数据
                if(this.hasChildTable) {
                    this.$emit('getChildTable',row)
                }
            },
            //新增
            handleAdd() {
                this.isShowStatus.isPopUp = true;
                this.operateType = 'add';
            },
            //编辑
            handleEdit() {
                this.operateType = 'edit';
                this.$emit('getFid',this.detailForm);
                if(this.detailForm.fid) {
                    this.isShowStatus.isRead = false;
                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    });
                }
            },
            //搜索
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
            },
            //保存
            handleSave(type) {
                let tempObj;
                let api;
                let method;
                if(type === 'add') {
                    api = this.ajaxConfig.addObj.url;
                    method = this.ajaxConfig.addObj.method;
                    delete this.addForm.fid;
                    tempObj = this.addForm;
                }else {
                    api = this.ajaxConfig.updateObj.url;
                    method = this.ajaxConfig.updateObj.method;
                    tempObj = this.detailForm;
                    if(this.isOpenChild && this.detailForm.inactive === 0) {
                        /*this.$confirm(`是否启用${this.detailForm.fcode}组下的所有子级？`, '提示', {
                            confirmButtonText: '保存,启用',
                            cancelButtonText: '保存,不启用',
                            type: 'warning'
                        }).then(() => {
                            this.detailForm.isOpenChild = 1;
                        }).catch(() => {
                            this.detailForm.isOpenChild = 0;
                        });*/
                        if(confirm(`是否启用${this.detailForm.fcode}组下的所有子级？`)) {
                            this.detailForm.isOpenChild = 1
                        }else {
                            this.detailForm.isOpenChild = 0
                        }
                    }
                }
                this[method](api,tempObj)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            type === 'add' ? this.isShowStatus.isPopUp = false : this.isShowStatus.isRead = true;
                            this.addForm = {};
                            this.getData();
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            });
                        }
                    })
            },
            //取消
            handleCancel(type) {
                if(type === 'add') {
                    this.isShowStatus.isPopUp = false;
                    this.addForm = {};
                }else {
                    this.isShowStatus.isRead = true;
                    this.detailForm = this.$lodash.cloneDeep(this.copyForm);
                }
            },
            //删除
            handleDelete() {
                if(this.detailForm.fid) {
                    this.$confirm('是否删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this[this.ajaxConfig.deleteObj.method](this.ajaxConfig.deleteObj.url,{fid:this.detailForm.fid})
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    this.detailForm = {};
                                    this.getData();
                                }else {
                                    this.$message({
                                        message: '删除失败',
                                        type: 'error'
                                    });
                                }

                            }).catch(() => {
                            console.log('cnacel')
                        })
                    })

                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    });
                }
            },
            //禁止点击表格提醒
            handleNotAllowed() {
                if(this.isShowStatus.isPopUp || !this.isShowStatus.isRead) {
                    this.$confirm('此操作将清空已填写的数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.handleCancel(this.operateType);
                    }).catch(() => {
                        console.log('cnacel')
                    })
                }
            },
            toggleSpread() {
                this.otherVariable.isSpread = !this.otherVariable.isSpread;
                if(this.otherVariable.isSpread) {
                    this.otherVariable.contentWidth = 80;
                }else {
                    this.otherVariable.contentWidth = this.tempWidth;
                }
            },
            selectChange(val,paramName,selectList,paramList,reflectList) {
                if(paramName === 'colorType') {
                    let item = selectList.find(item => item[paramList[0]] === val);
                    if(this.operateType === 'add') {
                        this.addForm[reflectList[0]] = item[paramList[0]];
                        this.addForm[reflectList[1]] = item[paramList[1]];
                        this.addForm[reflectList[2]] = item[paramList[2]];
                    }else {
                        this.detailForm[reflectList[0]] = item[paramList[0]];
                        this.detailForm[reflectList[1]] = item[paramList[1]];
                        this.detailForm[reflectList[2]] = item[paramList[2]];
                    }
                }
            },
            //改变状态
            changeStatus(val) {
                this.isChangeTree = true;
                this.statusValue = val;
            },
            //自适应高度
            changeSize() {
                this.isResize = false;
                this.mainHeight = window.innerHeight - 214;
                this.$nextTick(() => {
                    this.isResize = true;
                    setTimeout(() => {
                        if(this.isTreeTable) {
                            this.$refs.treetable.initStatusData();
                        }
                    })
                })
            },
            listenResize() {
                window.onresize = () => {
                    this.changeSize();
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    .popup-enter-active, .popup-leave-active {
        transition: left 0.3s;
        left: 0;
    }
    .popup-enter, .popup-leave-to {
        left: 100%;
    }
</style>
