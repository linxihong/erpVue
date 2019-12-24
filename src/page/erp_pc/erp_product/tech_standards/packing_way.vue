<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleAdd">新建</el-button>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="searchProp"
                :searchForm="searchForm"
                @getData="getInitPage"
            ></CommonSearch>
            <!--表格区域-->
            <CommonTable
                ref="refTable"
                :isCenter="true"
                :isMulCommonTable="true"
                :tableHeight="$store.state.screenHei*0.76"
                :isShowStatus="isShowStatus"
                :propData="tableProp"
                :otherVariable="otherVariable"
                :tableData="tableData"
                @handleDetail="handleDetail"
            ></CommonTable>
            <!--分页区域-->
            <CommonPagination
                :pageObj="pageObj"
                @getData="getData"
            ></CommonPagination>
        </div>
        <div class="common-right" :style="{width: otherVariable.contentWidth + '%'}">
            <!--编辑/详情区域-->
            <CommonDetail
                :isShowStatus="isShowStatus"
                :otherVariable="otherVariable"
                :propData="formProp"
                :detailForm="detailForm"
                @toggleSpread="toggleSpread"
                @handleEdit="handleEdit"
                @handleDelete="handleDelete"
                @handleCancel="handleCancel"
                @handleSave="handleSave"
            >
                <template slot="head-form-title">
                    <div class="head-form-title">
                        <span>{{otherVariable.detailTitle}}</span>
                    </div>
                </template>
            </CommonDetail>
            <!--新增区域-->
            <transition name="popup">
                <CommonAdd
                    v-show="isShowStatus.isPopUp"
                    :otherVariable="otherVariable"
                    :propData="formProp"
                    :addForm="addForm"
                    @handleCancel="handleCancel"
                    @handleSave="handleSave"
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
    export default {
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetail,
            CommonAdd
        },
        data() {
            return {
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                otherVariable: {
                    isSpread: false,
                    contentWidth: 50,
                    detailTitle: '包装方式',
                    addTitle: '新建包装方式'
                },
                tempWidth: null,
                whetherUseList: this.getStaticList('whetherUse'),
                tableData: [],
                //搜索映射列表
                searchProp: [
                    {prop:'fcode', name:'包装代码',type:'normal','isMainSearch':true, 'placeholder':'请输入包装代码'},
                    {prop:'fname', name:'包装名称',type:'normal'},
                ],
                //详情映射列表
                formProp: [
                    {prop:'fcode', name:'包装代码',type:'normal'},
                    {prop:'fname', name:'包装名称',type:'normal'},
                    {prop:'matTypeId', name:'物料类型',type:'select',selectList:[]},
                    {prop:'perLotQty', name:'支/扎',type:'normal'},
                    {prop:'perBoxQty', name:'扎/托',type:'normal'},
                    {prop:'filmWidth1',name:'保护膜宽1',type:'normal'},
                    {prop:'filmWidth2',name:'保护膜宽2',type:'normal'},
                    {prop:'filmWidth3',name:'保护膜宽3',type:'normal'},
                    {prop:'filmWidth4',name:'保护膜宽4',type:'normal'},
                ],
                //表格映射列表
                tableProp: [
                    {
                        prop:'', name:'包装方式',
                        children:[
                            {prop:'fcode',name:'代码',type:'normal'},
                            {prop:'fname',name:'名称',type:'normal'}
                        ]
                    },
                    {prop:'matTypeId', name:'物料类型',type:'select',selectList:[]},
                    {prop:'perLotQty', name:'支/扎',type:'normal'},
                    {prop:'perBoxQty', name:'扎/托',type:'normal'},
                    {
                        prop:'', name:'保护膜宽',
                        children:[
                            {prop:'filmWidth1',name:'参数1',type:'normal'},
                            {prop:'filmWidth2',name:'参数2',type:'normal'},
                            {prop:'filmWidth3',name:'参数3',type:'normal'},
                            {prop:'filmWidth4',name:'参数4',type:'normal'},
                        ]
                    },
                    {prop:'inactive',name:'失效',type:'checkbox'}
                ],
                searchForm: {},
                addForm: {},
                detailForm: {},
                copyForm: {},
                detailId: null,
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                }
            }
        },
        mounted() {
            this.getData();
            this.getMatType();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            getData() {
                this.tableData = [];
                this.fetch(`/basedata/Mdm/MdmPackMethodController/selectByQueryModel?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            handleDetail(row) {
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.fetch('/basedata/Mdm/MdmPackMethodController/selectByQueryModel',{fid:row.fid})
                    .then(result => {
                        if(result.status === 200) {
                            this.detailForm = result.data.list[0];
                            this.copyForm = this.$lodash.cloneDeep(result.data.list[0]);
                        }else {
                            this.$message({
                                message: '请求失败',
                                type: 'warning'
                            });
                            this.detailForm = {};
                            this.copyForm = {};
                        }
                    })
            },
            handleAdd() {
                this.isShowStatus.isPopUp = true;
            },
            handleEdit() {
                if(this.detailForm.fid) {
                    this.isShowStatus.isRead = false;
                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    });
                }
            },
            handleSave(type) {
                let tempObj;
                let api;
                if(type === 'add') {
                    api = '/basedata/Mdm/MdmPackMethodController/addMdmPackMethod';
                    tempObj = this.addForm;
                }else {
                    api = '/basedata/Mdm/MdmPackMethodController/updateMdmPackMethod';
                    tempObj = this.detailForm;
                }
                this.fetch(api,tempObj)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            type === 'add' ? this.isShowStatus.isPopUp = false : this.isShowStatus.isRead = true;
                            this.addForm = {};
                            this.searchForm = {};
                            this.detailForm = {};
                            this.copyForm = {};
                            this.getData();
                        }else if(result.status === 500){
                            this.$message({
                                message:result.error.substring(result.error.indexOf(":")+2,result.error.indexOf('\n'))
                            })
                        }else {
                            this.$message({
                                message: '保存失败',
                                type: 'error'
                            });
                        }
                    })
            },
            handleCancel(type) {
                if(type === 'add') {
                    this.isShowStatus.isPopUp = false;
                    this.addForm = {};
                }else {
                    this.isShowStatus.isRead = true;
                    this.detailForm = this.$lodash.cloneDeep(this.copyForm);
                }
            },
            handleDelete() {
                if(this.detailForm.fid) {
                    this.$confirm('是否删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.fetch('/basedata/Mdm/MdmPackMethodController/deleteMdmPackMethod',{fid:this.detailForm.fid})
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    this.searchForm = {};
                                    this.detailForm = {};
                                    this.getData();
                                }else {
                                    this.$message({
                                        message: '删除失败',
                                        type: 'error'
                                    });
                                }
                            })
                    }).catch(() => {
                        console.log('cnacel')
                    })
                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    })
                }
            },
            toggleSpread() {
                this.otherVariable.isSpread = !this.otherVariable.isSpread;
                if(this.otherVariable.isSpread) {
                    this.otherVariable.contentWidth = 100;
                }else {
                    this.otherVariable.contentWidth = this.tempWidth;
                }
            },
            getMatType() {
                this.fetch('/basedata/Mat/MatType/selectByQueryModel?pageSize=100',{})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list) {
                            this.tableProp[1].selectList = this.formatArray(result.data.list,'fname','fid');
                            this.formProp[2].selectList = this.formatArray(result.data.list,'fname','fid');
                        }else {
                            this.tableProp[1].selectList = [];
                            this.formProp[2].selectList = [];
                        }
                    })
            }
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
