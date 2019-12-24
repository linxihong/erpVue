<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap"  v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleMulAudit" :disabled="otherVariable.isSaving">批量审核</el-button>
                <el-button @click="handleRefresh">刷新</el-button>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="searchProp"
                :searchForm="searchForm"
                @selectChange="selectChange"
                @getData="getInitPage"
            >
                <template slot="search-other-btn">
                    <el-button @click="handleReset">重置</el-button>
                </template>
            </CommonSearch>
            <!--表格区域-->
            <CommonTable
                v-if="isResize"
                ref="commontable"
                v-loading="loadingI"
                :mainHeight="mainHeight"
                :isShowStatus="isShowStatus"
                :propData="tableProp"
                :otherVariable="otherVariable"
                :tableData="tableData"
                @handleDetail="handleDetail"
                @handleSelectionChange="handleSelectionChange"
            >
            </CommonTable>
            <!--分页区域-->
            <CommonPagination
                :pageObj="pageObj"
                @getData="getData"
            >
            </CommonPagination>
        </div>
        <div class="common-right" :style="{width: otherVariable.contentWidth + '%'}">
            <!--编辑/详情区域-->
            <CommonDetailX
                :otherVariable="otherVariable"
                :propData="formProp"
                :detailForm="detailForm"
                @toggleSpread="toggleSpread"
            >
                <!--详情头部-->
                <template slot="header">
                    <div class="header-form" ref="headForm">
                        <template v-for="item in formProp">
                            <div v-if="item.type === 'outter'">
                                <span>{{ item.name ? (item.name + ':') : '' }}</span>
                                <span>{{ detailForm[item.prop] }}</span>
                            </div>
                        </template>
                    </div>
                </template>
                <!--头部按钮-->
                <template slot="main-btn-wrap">
                    <div v-if="showButton" class="xs-audit-icon" @click="!otherVariable.isSaving && handleAudit()" :class="otherVariable.isSaving ? 'banClick' : ''">审核</div>
                    <div v-if="showUnAudit" class="xs-unaudit-icon" @click="handleUnAudit">反审</div>
                    <el-dropdown v-if="detailId" @command="handlePrint($event)">
                        <i class="icon-print" title="打印" style="right: 30px;"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="parentId" command="a">本公司打印格式</el-dropdown-item>
                            <el-dropdown-item command="b">经销商打印格式</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
                <!--头部标题-->
                <template slot="head-form-title">
                    <div class="head-form-title">
                        <span>&nbsp;{{ detailForm.clientName }}</span>
                        <span></span>
                    </div>
                </template>
                <!--头部表单-->
                <template slot="head-form-content">
                    <div class="head-form-content">
                        <template v-for="item in formProp">
                            <div v-if="item.type === 'inner' && !item.isLong">
                                <span>{{ item.name }}：</span>
                                <span>{{ detailForm[item.prop] }}</span>
                            </div>
                        </template>
                    </div>
                    <div class="project-wrap">
                        <div>工程名称：</div>
                        <div class="scrollBar" :title="detailForm.projectName">
                            &nbsp;{{ detailForm.projectName }}{{ detailForm.projectCode?("("+ detailForm.projectCode + ")"):"" }}
                        </div>
                    </div>
                    <div class="remark-wrap scrollBar">
                        <div>备注：</div>
                        <div class="headspan" :title="detailForm.remark">{{ detailForm.remark }}</div>
                    </div>
                </template>
                <!--详情内容-->
                <template slot="common-content">
                    <!--tab区域-->
                    <el-tabs v-model="activeName" class="common-content-tab">
                        <el-tab-pane label="合同明细" name="first">
                            <el-table
                                v-if="isResize"
                                class="childtable"
                                ref="childTable"
                                :span-method="objectSpanMethod"
                                tooltip-effect="dark"
                                v-loading="loadingI"
                                :data="tabDataI"
                                border
                                :height="tableHeight"
                                highlight-current-row
                            >
                                <el-table-column label="价格类型"  align="left" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="报价项目">
                                    <el-table-column label="代码" align="left" width="80px" label-class-name="table-valid-head" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrcode }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="名称" align="left" width="80px" label-class-name="table-valid-head" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrTxt1Name }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="项目类型" align="left" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem1 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="材质" align="left" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem2 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="涂层" align="left" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem3 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="价格(元)" align="right" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem4 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位" align="left" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem5 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注" width="200" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span >{{ scope.row.remark }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="附加条款" name="second">
                            <el-table
                                v-if="isResize"
                                class="childtable"
                                ref="childTable"
                                tooltip-effect="dark"
                                v-loading="loadingI"
                                :data="tabDataI"
                                border
                                :height="tableHeight"
                                highlight-current-row
                            >
                                <el-table-column type="selection" width="55"></el-table-column>
                                <el-table-column label="序号" type="index" align="center">
                                </el-table-column>
                                <el-table-column label="描述" align="left">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </CommonDetailX>
        </div>
    </div>
</template>

<script>
    import CommonMixins from '$src/components/CommonMixins'
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    import CommonDetailX from '$src/components/CommonDetailX'
    export default {
        mixins: [CommonMixins],
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetailX
        },
        data() {
            return {
                tableHeight: this.$store.state.screenHei*0.60,
                mainHeight: 716,
                isShowNotAllowed: false,
                loadingI:false,
                isShowStatus: {
                    isMore: false,
                    isRead: true
                },
                isResize: true,
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    popupTitle: '',
                    isMulSelect: true,
                    isInlineForm: true,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    isReadTable: true,
                    isSaving:false,
                },
                tempWidth: null,
                tableData: [],
                showButton: false,
                showUnAudit: false,
                //搜索映射表
                searchProp: [
                    {
                        name:'合同号',
                        prop:'refDocCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入合同号'
                    },
                    {
                        name:'合同日期',
                        prop:'orderDocDateStart',
                        type:'date',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'至',
                        prop:'orderDocDateEnd',
                        type:'date',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'合同号',
                        prop:'contractCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'客户',
                        prop:'clientCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'经销商',
                        prop:'clientCode2',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                ],
                //详情映射列表
                formProp: [
                    {name:'合同号',prop:'contractCode',type:'outter'},
                    {name:'合同日期',prop:'docDate',type:'outter'},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'经销商',prop:'clientCode2',type:'inner'},
                    {name:'合同类型',prop:'',type:'inner'},
                    {name:'支付方式',prop:'',type:'inner'},
                    {name:'生效日期',prop:'',type:'inner'},
                    {name:'失效日期',prop:'',type:'inner'},
                    {name:'结算方式',prop:'',type:'inner'},
                    {name:'开票方式',prop:'',type:'inner'},
                    {name:'备注',prop:'remark',type:'inner',isLong:true}
                ],
                //表格映射列表
                tableProp: [
                    {
                        name:'fid',
                        prop:'fid',
                        type:'normal',
                        isMain:true
                    },
                    {
                        name1:'变更单号/',
                        prop1:'refDocCode',
                        name2:'状态',
                        prop2:'docStatusName',
                        type:'mixin',
                        width: '115'
                    },
                    {
                        name1:'合同号/',
                        prop1:'contractCode',
                        name2:'合同日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '130'
                    },
                    {
                        name1:'客户/',
                        prop1:'clientCode',
                        name2:'经销商',
                        prop2:'clientCode2',
                        type:'mixin',
                        width: '120'
                    },
                    {
                        name1:'录入人/',
                        prop1:'enterName',
                        name2:'录入日期',
                        prop2:'enterTime',
                        type:'mixin',
                        width: '148'
                    }
                ],
                searchForm: {minStatus:50,minStatusOperator:'>=',maxStatus:100,maxStatusOperator:'<'},
                detailForm: {},
                copyForm: {},
                detailId: null,
                parentId: null,
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //详情表格内容
                tabLeft: '200px',
                activeName: 'first',
                //订单明细数据
                tabDataI: [
                    {
                        docItem:'铝加工费用',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'铝加工费用',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'铝加工费用',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'表面加工',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'表面加工',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'表面加工',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'隔条加热',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'隔条加热',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    },
                    {
                        docItem:'隔条加热',
                        usrcode:'MC01',
                        usrTxt1Name:'门窗类',
                        docItem4:'350'
                    }
                ],
                copyDataI: [],
                spanArr: [],
                position: 0,
                //所选订单
                selectOrderList: []
            }
        },
        mounted() {
            this.getData();
            this.rowspan();
            // 操作/布局相关
            this.listenScroll();
            this.listenResize();
            this.changeSize();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取主表数据
            getData() {
                this.tableData = [];
                this.fetch(`/oms/sls/SalesOrderMaster/getOrderMaster?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            this.$nextTick(() => {
                                this.$refs.commontable.renderRow(this.tableData[0].fid);
                            })
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },
            selectChange(val) {
                if(val === 1) {
                    this.searchForm.minStatus = 50;
                    this.searchForm.minStatusOperator = '>=';
                    delete this.searchForm.maxStatus;
                    delete this.searchForm.maxStatusOperator;
                }else if(val === 2) {
                    this.searchForm.minStatus = 50;
                    this.searchForm.minStatusOperator = '>=';
                    this.searchForm.maxStatus = 100;
                    this.searchForm.maxStatusOperator = '<';
                }else if(val === 3) {
                    this.searchForm.minStatus = 100;
                    this.searchForm.minStatusOperator = '>=';
                    delete this.searchForm.maxStatus;
                    delete this.searchForm.maxStatusOperator;
                }
            },
            //点击主表行
            handleDetail(row) {
                this.loadingI = true;
                this.isShowNotAllowed = true;
                if(row.docStatus !== 50) {
                    this.showUnAudit = true;
                    this.showButton = false
                }else {
                    this.showUnAudit = false;
                    this.showButton = true
                }
                //this.tabDataI = [];
                this.copyDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.fetch('/oms/sls/SalesOrderMaster/getOrderMaster',{fid:row.fid})
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
                    });
                this.loadingI = false;
                this.isShowNotAllowed = false;
                /* this.getAjax(`/oms/sls/SalesOrderDetail/getOrderDetail?pageSize=1000&orderMasterId=${row.fid}`)
                     .then(result => {
                         this.loadingI = false;
                         this.isShowNotAllowed = false;
                         if(result.data && result.data.list) {
                             this.tabDataI = result.data.list;
                             this.copyDataI = this.$lodash.cloneDeep(this.tabDataI);
                         }
                     })
                     .then(() => {
                         this.loadingI = false;
                         this.$refs['childTable'].initStatus();
                     });*/
                this.detailId = row.fid;
                this.parentId = row.parentId;
            },
            handleSelectionChange(rows) {
                this.selectOrderList = [];
                rows.forEach(item => {
                    this.selectOrderList.push(item.fid)
                })
            },
            //批量审核
            handleMulAudit() {
                if(this.selectOrderList.length) {
                    this.fetch('/oms/sls/SalesOrderMaster/batchAuditOrder',this.selectOrderList)
                        .then(result => {
                            if(result.status ===200){
                                this.$message({
                                    message:result.message,
                                    type:'success'
                                });
                                this.getData();
                            }else{
                                this.$message({
                                    message:this.returnErrorMsg(result.error),
                                    type:'error'
                                })
                            }
                        })
                }else {
                    this.$message({
                        message: '请勾选订单',
                        type:'warning'
                    })
                }
            },
            //刷新
            handleRefresh() {
                this.getData();
                this.detailForm = {};
                this.detailId = null;
                this.parentId = null;
                //this.tabDataI = [];
                this.copyDataI = [];
            },
            //重置
            handleReset() {
                this.searchForm = {minStatus:50,minStatusOperator:'>=',maxStatus:100,maxStatusOperator:'<'};
                this.handleRefresh();
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //更改后的刷新
            changeRefresh() {
                this.detailForm = {};
                this.copyForm = {};
                //this.tabDataI = [];
                this.copyDataI = [];
                this.getData();
                this.otherVariable.isChildEdit = false;
            },
            //审核
            handleAudit() {
                if(this.detailForm.fid) {
                    this.$confirm('是否审批?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.otherVariable.isSaving = true;
                        this.getAjax(`/oms/sls/SalesOrderMaster/auditOrder?orderId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message:result.message,
                                        type:'success'
                                    });
                                    this.getData();
                                }else {
                                    this.$message({
                                        message:this.returnErrorMsg(result.error,'second'),
                                        type:'error'
                                    })
                                }
                            })
                            .then(() => {
                                this.otherVariable.isSaving = false;
                            })


                    }).catch(() => {
                        console.log('cnacel')
                    })

                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    })
                }
            },
            //反审
            handleUnAudit() {
                this.getAjax(`/oms/sls/SalesOrderMaster/unAuditOrder?orderId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
                    .then(result => {
                        if(result.status ===200){
                            this.$message({
                                message:result.message,
                                type:'success'
                            });
                            this.getData();
                        }else{
                            this.$message({
                                message:this.returnErrorMsg(result.error,'second'),
                                type:'error'
                            })
                        }
                    });
            },
            //合并列表
            rowspan() {
                this.tabDataI.forEach((item,index) => {
                    if( index === 0){
                        this.spanArr.push(1);
                        this.position = 0;
                    }else{
                        if(this.tabDataI[index].docItem === this.tabDataI[index-1].docItem ){
                            this.spanArr[this.position] += 1;
                            this.spanArr.push(0);
                        }else{
                            this.spanArr.push(1);
                            this.position = index;
                        }
                    }
                })
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {  //表格合并行
                if (columnIndex === 0) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row>0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            // 打印
            handlePrint(command) {
                let isReturn = false;
                let resultUrl = '';
                let switchFid = '';
                command === 'a' ? switchFid = this.parentId : switchFid = this.detailId;
                this.getAjax(`/oms/PrintController/isPrint?fId=${switchFid}`)
                    .then(result => {
                        if(result.status === 200) {
                            isReturn = true;
                            resultUrl = result.data;
                        }else {
                            isReturn = false;
                            this.$message({
                                type:'error',
                                message: result.error || 'Bad Request'
                            })
                        }
                    })
                    .then(() => {
                        if(isReturn) {
                            window.open(resultUrl);
                        }
                    })
            },
        }
    }
</script>

<style lang="less" scoped>
    .popup-enter-active, .popup-leave-active {
        transition: left 0.1s;
        left: 0;
    }
    .popup-enter, .popup-leave-to {
        left: 100%;
    }
</style>
