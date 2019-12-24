<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}"
             v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap" @click="handleNotAllowed" v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button @click="handleRefresh">刷新</el-button>
                <el-button @click="handleReset">重置</el-button>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="formProp"
                :searchForm="searchForm"
                @getData="getInitPage"
            >
            </CommonSearch>
            <!--表格区域-->
            <TreeTable
                v-if="isResize"
                ref="treetable"
                :propData="propData"
                :mainHeight="mainHeight"
                :isShowStatus="isShowStatus"
                :tableData="tableData"
                @handleDetail="handleDetail"
            ></TreeTable>
        </div>
        <div class="common-right" :style="{width: otherVariable.contentWidth + '%'}">
            <!--编辑/详情区域-->
            <CommonDetailX
                marginTop="30px"
                :otherVariable="otherVariable"
                :detailForm="detailForm"
                :hasSimpleHead="true"
                @toggleSpread="toggleSpread"
                @handleEdit="handleEdit"
            >
                <!--头部按钮-->
                <template slot="main-btn-wrap">
                    <div class="btnhanle" style="position: absolute;top: 127px;">
                        <el-button  @click="handleCancelChild" v-if="otherVariable.isChildEdit">取消</el-button>
                        <el-button class="btn-cyan add-btn" @click="UpdataorderList" v-if="otherVariable.isChildEdit">保存</el-button>
                    </div>
                </template>
                <!--头部表单-->
                <template slot="head-form-content">
                    <div class="head-form-content">
                        <div>
                            <span style="font-size: 27px; font-weight: normal">销售组-价格区域</span>
                        </div>
                    </div>
                </template>
                <template slot="common-content">
                    <el-table
                        key='firstTable'
                        style="margin-top: 50px;"
                        border
                        @row-click="clickDetail"
                        highlight-current-row
                        :data="childTableData"
                        @selection-change="selsChange"
                        :height="$store.state.screenHei*0.67">
                        <!--<el-table-column  type="selection"  v-if="!isChildEdit"  :selectable='checkboxInit' width="55"></el-table-column>-->
                        <el-table-column v-if="isChildEdit"  label=" " align="center" width="55">
                            <template slot-scope="scope">
                                <el-checkbox :true-label="1" :false-label="0"  v-model="scope.row.isDefaultRegion" ></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="!isChildEdit"  label=" " align="center" width="55" key="new_confirmqty">
                            <template slot-scope="scope">
                                <span>{{ scope.row.isDefaultRegion === 1 ? '√':'x'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="价格区域" prop="regionName" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="生效日期" width="140" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span v-if="!isChildEdit">{{scope.row.beginDate}}</span>
                                <el-date-picker
                                    v-if="isChildEdit"
                                    v-model="scope.row.beginDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                    style="width: 100%"
                                >
                                </el-date-picker>
                            </template>
                        </el-table-column>
                        <el-table-column label="失效日期" width="140" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span v-if="!isChildEdit">{{scope.row.endDate}}</span>
                                <el-date-picker
                                    v-if="isChildEdit"
                                    v-model="scope.row.endDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                    style="width: 100%"
                                >
                                </el-date-picker>
                            </template>
                        </el-table-column>
                        <!--<el-table-column label="货币" prop="currency"></el-table-column>-->
                        <el-table-column label="说明" >
                            <template slot-scope="scope">
                                <span v-if="!isChildEdit">{{scope.row.remark}}</span>
                                <el-input
                                    v-if="isChildEdit"
                                    v-model="scope.row.remark"
                                >
                                </el-input>
                            </template>
                        </el-table-column>


                        <el-table-column label="创建人" prop="enterName"></el-table-column>
                        <el-table-column label="创建日期" prop="enterTime" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="修改人" prop="modifyName"></el-table-column>
                        <el-table-column label="修改日期" prop="modifyTime" :show-overflow-tooltip="true"></el-table-column>
                    </el-table>
                </template>
            </CommonDetailX>
        </div>
    </div>
</template>

<script>
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonDetailX from '$src/components/CommonDetailX'
    import TreeTable from '$src/components/TreeTable'
    export default {
        components: {
            CommonSearch,
            CommonTable,
            CommonDetailX,
            TreeTable
        },
        data() {
            return {
                mainHeight: 716,
                isChildEdit: false,
                isResize: true,
                checked:false,
                isShowNotAllowed: false,
                tableId:'',
                treeObject: {
                    isNotList: true,
                    parentId: 'parentCode'
                },
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                searchForm: {},
                tableData: [],
                detailForm: {},
                otherVariable: {
                    isSpread: false,
                    isInlineForm: true,
                    isEdit: false,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    loading: false,
                    $isCustom: true
                },
                tempWidth: null,
                childVariable: {
                    isReadTable: true
                },
                childTableData: [],
                editRules: {
                    'fname':[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                },
                addRules: {
                    'fcode':[
                        { required: true, message: '请输入代码', trigger: 'blur' }
                    ],

                    'fname':[
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],

                },
                ajaxConfig: {
                    dataObj: {
                        url: '/oms/org/OrgSalesGroupController/selectSalesGroupList',
                        method: 'fetch'
                    },
                    addObj: {
                        url: '/basedata/Mat/MatSeriesController/addMatSeries',
                        method: 'fetch'
                    },
                    updateObj: {
                        url: '/basedata/Mat/MatSeriesController/updateMatSeries',
                        method: 'fetch'
                    },
                    deleteObj: {
                        url: '/basedata/Mat/MatSeriesController/deleteMatSeries',
                        method: 'fetch'
                    }
                },
                childTableProp: [
                    {prop:'demo', name:'价格区域',type:'normal'},
                    {prop:'demo', name:'生效日期',type:'normal'},
                    {prop:'demo', name:'失效日期',type:'normal'},
                    {prop:'demo', name:'货币',type:'normal'},
                    {prop:'demo', name:'说明',type:'normal'},
                    {prop:'demo', name:'创建人',type:'normal'},
                    {prop:'demo', name:'创建日期',type:'normal'},
                    {prop:'demo', name:'修改人',type:'normal'},
                    {prop:'demo', name:'修改日期',type:'normal'}
                ],
                formProp: [
                    {
                        'name':'fid',
                        'prop':'fid',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':true,
                    },
                    {
                        'name':'代码',
                        'prop':'fcode',
                        'type':'normal',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'请输入销售组代码',
                        'width':'180'
                    },
                    {
                        'name':'名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'负责人',
                        'prop':'remark',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'showRemark':true,
                    }
                ],
                propData: [
                    {
                        'name':'fid',
                        'prop':'fid',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':true,
                    },
                    {
                        'name':'代码',
                        'prop':'fcode',
                        'type':'first',
                        'isRead':true,
                        'isMainSearch':true,
                        'isMain':false,
                        'placeholder':'请输入销售组代码',
                        'width':'180'
                    },
                    {
                        'name':'名称',
                        'prop':'fname',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                    },
                    {
                        'name':'负责人',
                        'prop':'remark',
                        'type':'normal',
                        'isMainSearch':false,
                        'isMain':false,
                        'showRemark':true,
                    }
                ]
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                this.tableData = [];
                this[this.ajaxConfig.dataObj.method](`${this.ajaxConfig.dataObj.url}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.length) {
                            this.tableData = this.setTreeData(result.data,'parentId','fid');
                            if(isFirst) {
                                this.$nextTick(() => {
                                    this.$refs.treetable.renderRow(this.tableData[0].fid);
                                })
                            }
                        }else {
                            this.tableData = [];
                        }
                    })
                    .then(() => {
                        this.$nextTick(() => {
                            this.$refs.treetable.initStatusData();
                        })
                    })
            },
            handleRefresh() {
                this.getData();
            },
            handleReset() {
                this.searchForm = {};
                this.getData();
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            handleDetail(row) {
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.tableId = row.fid;
                this.fetch('oms/mdm/MdmSalesGroupPriceRegionController/selectMdmSalesGroupPriceRegionListNoPage',{salesGroupId:row.fid})
                    .then(result => {
                        if(result.data && result.data.length) {
                            //默认 isDefaultRegion =0

                            result.data.forEach(item => {
                                if(item.isDefaultRegion === null){
                                    item.isDefaultRegion = 0;


                                }
                            });
                            console.log(result.data)
                            this.childTableData = result.data;
                            console.log(this.childTableData);

                        }else {
                            this.$message({
                                message: '请求失败',
                                type: 'warning'
                            });
                            this.detailForm = {};
                            this.copyForm = {};
                        }
                    });
                this.getChildTable(row)
            },
            getChildTable(row) {
                this.childTableData = [];
                this.$nextTick(() => {
                    this.childTableData = [{demo: row.fcode, status: 1}];
                })
            },
            //批量保存
            UpdataorderList(){
                this.childTableData.forEach(item => {
                    console.log(item.regionId)
                    item.salesGroupId = this.tableId;
                    item.priceRegionId = item.regionId;

                });
                this.fetch('/oms/mdm/MdmSalesGroupPriceRegionController/updateMdmSalesGroupPriceRegionList',{mdmSalesGroupPriceRegionQueryModelList:this.childTableData})
                    .then(result => {
                        if(result.status ===200){
                            this.$message({
                                message:result.message,
                                type:'success'
                            });
                            this.isChildEdit=false;
                            this.isShowCopyBtn = false;
                            this.otherVariable.isChildEdit=false;
                            this.isShowNotAllowed = false;
                            this.isBanOperate = true;

                        }else{
                            this.$message({
                                message:this.returnErrorMsg(result.error),
                                type:'error'
                            })
                        }
                    })
                    .then(() => {
                        this.otherVariable.isSaving = false;
                    })
            },
            select(row){
                console.log('1111',row);
                this.childTableData.isDefaultRegion = 1

            },
            //从表点击行
            clickDetail(row){
                this.otherVariable.isChildEdit = true;
                this.isShowNotAllowed=true,
                this.clickTimes += 1;
                this.isChildEdit = true;
                this.$nextTick(()=>{
                    this.diffPrice=row.diffPrice;
                    this.beginDate=row.beginDate;
                    this.endDate=row.endDate;

                });
            },
            //取消修改
            handleCancelChild(){
                this.isShowNotAllowed=false,
                    this.otherVariable.isChildEdit = false;
                this.isChildEdit = false;
                this.handleDetail(this.listId);
            },
            handleNotAllowed(){
                if(this.isChildEdit){
                    this.$confirm('此操作将清空已填写的数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.handleCancelChild();
                    }).catch(() => {
                        console.log('cnacel')
                    })

                }

            },
            //是否勾选
            selsChange(row){
                row.forEach(item => {
                    item.isDefaultRegion = 1;
                });
            },
//            checkboxInit(row,index){
//                console.log('111',row)
//                if(row.isDefaultRegion){
//                    return 1;
//                }else{
//                    return 0;
//                }
//
//            },
            handleEdit() {
                this.isChildEdit = true;
            },
            handleCancel() {
                this.isChildEdit = false;
            },
            handleSave() {
                this.isChildEdit = false;
            },
            toggleSpread() {
                this.otherVariable.isSpread = !this.otherVariable.isSpread;
                if(this.otherVariable.isSpread) {
                    this.otherVariable.contentWidth = 80;
                }else {
                    this.otherVariable.contentWidth = this.tempWidth;
                }
            },
        }
    }
</script>
