<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button @click="handleRefresh">刷新</el-button>
                <el-button @click="handleReset">重置</el-button>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="searchProp"
                :searchForm="searchForm"
                @selectChange="selectChange"
                @getData="getSearchList"
            >
            </CommonSearch>
            <!--表格区域-->
            <CommonTable
                v-if="isResize"
                ref="commontable"
                :mainHeight="mainHeight"
                :isShowStatus="isShowStatus"
                :propData="tableProp"
                @getInitPage="getInitPage"
                :otherVariable="otherVariable"
                :tableData="tableData"
                @handleDetail="handleDetail"
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
                                <span>{{ detailForm[item.prop]==='已提交'?'待提交':(detailForm[item.prop])=='已确认'?'已提交':detailForm[item.prop] }}</span>
                            </div>
                        </template>
                    </div>
                </template>
                <!--头部按钮-->
                <template slot="main-btn-wrap" v-if="!otherVariable.isChildEdit">
                    <div v-if="docStatus === 50" class="xs-audit-icon" @click="!otherVariable.isSaving && handleAdudit(100)" :class="otherVariable.isSaving ? 'banClick' : ''" >审核</div>
                    <div v-if="docStatus === 100" class="xs-audit-icon" @click="!otherVariable.isSaving && handleAdudit(50)" :class="otherVariable.isSaving ? 'banClick' : ''" >反审</div>
                </template>
                <!--头部标题-->
                <template slot="head-form-title">
                    <div class="head-form-title">
                        <span>&nbsp;{{ detailForm.projectName }}{{ detailForm.projectCode?("("+ detailForm.projectCode + ")"):"" }}</span>
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
                    <div class="remark-wrap">
                        <div>备注：</div>
                        <div class="headspan scrollBar" :title="detailForm.remark">{{ detailForm.remark }}</div>
                    </div>
                </template>
                <!--详情内容-->
                <template slot="common-content">
                    <!--按钮区域-->
                    <div class="tab-btn-wrap" :style="{left: tabLeft}"></div>
                    <!--tab区域-->
                    <el-tabs v-model="activeName" class="common-content-tab order_style">
                        <el-tab-pane label="报价明细" name="first">
                            <!--:span-method="objectSpanMethod"-->
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
                                <el-table-column label="价格类型" align="left" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ pricetypeList[(scope.row.priceType-1)] }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="报价项目">
                                    <el-table-column label="代码" prop="itemCode" align="left" width="80" :show-overflow-tooltip="true"></el-table-column>
                                    <el-table-column label="名称" prop="itemName" align="left" width="130" :show-overflow-tooltip="true"></el-table-column>
                                </el-table-column>
                                <el-table-column label="项目类型" prop="itemTypeName" align="left" width="120"></el-table-column>
                                <el-table-column label="材质" prop="cx2Name" align="left" width="110"></el-table-column>
                                <el-table-column label="涂层" prop="cx6Name" align="left" width="110"></el-table-column>
                                <el-table-column label="价格(元)" prop="price" align="right" width="70"></el-table-column>
                                <el-table-column label="单位" prop="uom" align="left" width="60"></el-table-column>
                                <el-table-column label="货币" prop="currency" align="left" width="60"></el-table-column>
                                <el-table-column label="备注" prop="remark" align="right" :show-overflow-tooltip="true"></el-table-column>
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
    import SelectEnter from '$src/components/SelectEnter'
    export default {
        mixins: [CommonMixins],
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetailX,
            SelectEnter,
        },
        data() {
            return {
                tableHeight: this.$store.state.screenHei*0.67,
                mainHeight: 716,
                notAllowUpHeight: 0,
                notAllowDownHeight: 0,
                scrollHeight: 0,
                //显示
                isResize: true,
                isBanOperate: true,
                isShowCopyBtn: false,
                operateType: 'add',
                topFIds: [],
                isCanSave: false,
                tempWidth: null,
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                //组件配置
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    detailTitle: '编辑报价',
                    addTitle: '新建报价',
                    popupTitle: '',
                    isInlineForm: true,
                    isEdit: false,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    loading: false,
                    $isCustom: true,
                    isSaving: false
                },
                //搜索映射表
                searchProp: [
                    {
                        name:'报价单号',
                        prop:'docCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入报价单号'
                    },
                    {
                        name:'报价状态',
                        prop:'tempStatus',
                        type:'selectChange',
                        selectList:[{value:1,label:'全部'},{value:2,label:'未审核'},{value:3,label:'已审核'}],
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'报价日期',
                        prop:'docDate',
                        type:'date',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'至',
                        prop:'',
                        type:'date',
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
                    {name:'报价单号',prop:'docCode',type:'outter'},
                    {name:'报价日期',prop:'docDate',type:'outter'},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'报价类型',prop:'offerType',type:'inner'},
                    {name:'计价方式',prop:'pricingModelName',type:'inner'},
                    {name:'经销商',prop:'clientCode2',type:'inner'},
                    {name:'区域',prop:'regionName',type:'inner'},
                    //todo
                    {name:'结算方式',prop:'',type:'inner'},
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
                        name1:'报价单号/',
                        prop1:'docCode',
                        name2:'状态',
                        prop2:'docStatusName',
                        type:'mixinNormal',
                        width: '115'
                    },
                    {
                        name1:'报价类型/',
                        prop1:'offerType',
                        name2:'报价日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '130'
                    },
                    {
                        name1:'客户/',
                        prop1:'clientCode',
                        name2:'区域',
                        prop2:'regionName',
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
                tableData: [],
                searchForm: {tempStatus: 2,minDocStatus: 50, maxDocStatus: 100},
                addOrEditForm: {},
                addForm: {},
                detailForm: {},
                copyForm: {},
                tempForm: {},
                submitRow: {},
                detailId: null,
                docStatus: null,
                //分页
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //详情表格内容
                tabLeft: '100px',
                activeName: 'first',
                childDetailRow: {},
                copyChildDetailRow: {},
                clickTimes: 0,
                isAddDetail: false,
                //订单明细数据
                tabDataI: [],
                copyDataI: [],
                auditData: [],
                spanArr: [],
                position: 0,
                loadingI: false,
                pricetypeList: ['铝加工费','表面加工费','断桥加工费','深加工费','附加费'],
                isShowNotAllowed: false,
                showButton:false
            }
        },
        watch: {
            'isShowStatus.isPopUp':{
                handler(val) {
                    this.isShowNotAllowed = val;
                }
            },
            'otherVariable.isChildEdit':{
                handler(val) {
                    this.isShowNotAllowed = val;
                }
            },
            deep: true
        },
        mounted() {
            // 获取数据
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
            getData(isFirst = true) {
                this.tableData = [];
                this.fetch(`/oms/sls/OfferPrice/getOfferPriceMasterList?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list && result.data.list.length) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            if(isFirst) {
                                this.$nextTick(() => {
                                    this.$refs.commontable.renderRow(this.tableData[0].fid);
                                })
                            }else {
                                this.$nextTick(() => {
                                    this.$refs.commontable.renderRow(this.detailId);
                                })
                            }
                        }else {
                            this.tabDataI = [];
                            this.copyDataI = [];
                            this.detailForm = {};
                            this.detailId = null;
                            this.docStatus = null;
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },
            selectChange(val) {
                if(val === 1) {
                    this.searchForm.minDocStatus = 50;
                    this.searchForm.maxDocStatus = 101;
                }else if(val === 2) {
                    this.searchForm.minDocStatus = 50;
                    this.searchForm.maxDocStatus = 100;
                }else if(val === 3) {
                    this.searchForm.minDocStatus = 100;
                    this.searchForm.maxDocStatus = 101;
                }
            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
            },
            //刷新
            handleRefresh() {
                this.isBanOperate = true;
                this.getData();
                this.detailForm = {};
                this.detailId = null;
                this.docStatus = null;
                this.tabDataI = [];
            },
            //重置
            handleReset() {
                this.searchForm = {tempStatus: 2,minDocStatus: 50, maxDocStatus: 100};
                this.handleRefresh();
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //点击主表行
            handleDetail(row) {
                row.docStatus >= 50 ? this.showButton = true : this.showButton = false;
                this.tabDataI = [];
                this.copyDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.fetch('/oms/sls/OfferPrice/getOfferPriceMasterList',{fid:row.fid})
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
                this.tabDataI = this.giveState(this.tabDataI);
                this.getChildTable(row.fid);
                this.detailId = row.fid;
                this.docStatus = row.docStatus;
            },
            //审批
            handleAdudit(status){
                if(this.detailForm.fid) {
                    this.auditData = [];
                    this.tabDataI.forEach(item => {
                        this.auditData.push({fId:item.fid,price:item.price,priceType:item.priceType,itemCode:item.itemCode})
                    });
                    this.$confirm('是否审批?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.otherVariable.isSaving = true;
                        this.fetch(`/oms/sls/OfferPrice/auditingPrice`,{masterId:this.detailForm.fid,regionId:this.detailForm.regionId,offerPriceDetailList:this.auditData,docStatus:status})
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
            //获取从表
            getChildTable(fid) {
                this.clickTimes = 0;
                this.tabDataI = [];
                this.loadingI = true;
                this.isShowNotAllowed = true;
                this.getAjax(`/oms/sls/OfferPrice/getOfferPriceDetailListByMasterId?pageSize=1000&masterId=${fid}`)
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
                    })
            },
            //合并列表
            rowspan() {
                this.tabDataI.forEach((item,index) => {
                    if(index === 0) {
                        this.spanArr.push(1);
                        this.position = 0;
                    }else {
                        if(this.tabDataI[index].priceType === this.tabDataI[index-1].priceType ) {
                            this.spanArr[this.position] += 1;
                            this.spanArr.push(0);
                        }else {
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
