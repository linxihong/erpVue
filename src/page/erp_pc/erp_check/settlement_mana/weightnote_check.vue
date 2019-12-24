<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleAdudit(true)">批量审核</el-button>
                <el-button @click="handleRefresh">刷新</el-button>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="searchProp"
                :searchForm="searchForm"
                @getData="getInitPage"
            >
                <template slot="search-other-btn">
                    <el-button @click="handleReset">重置</el-button>
                </template>
            </CommonSearch>
            <!--表格区域-->
            <CommonTable
                ref="commontable"
                :isShowStatus="isShowStatus"
                :propData="tableProp"
                :otherVariable="otherVariable"
                :tableData="tableData"
                @getInitPage="getInitPage"
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
                    <div class="header-form">
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
                    <div class="xs-icon-confirm" @click="handleAdudit()" v-if="detailId && docStatus !== 100" style="right: 220px;">审核</div>
                    <!--<div class="xs-icon-confirm" @click="showChangeClient" v-if="detailId && docStatus < 100" title="维护客户" style="right: 170px;background: #00C26F; line-height: 1; padding-top: 8px;">维护  客户</div>-->
                    <!--<div class="xs-icon-confirm" @click="showCarNum" v-if="detailId && docStatus < 100" title="维护车号" style="right: 110px;background: #c5a063; line-height: 1; padding-top: 8px;">维护  车号</div>-->
                    <div class="xs-icon-confirm" @click="resetPrice" v-if="detailId && docStatus < 100" title="重新计价" style="right: 160px;background: #46987C; line-height: 1; padding-top: 8px;">重新  计价</div>
                    <div class="xs-icon-confirm" @click="returnBack" v-if="detailId && docStatus < 100" style="right: 100px;background: #c5a063;">回滚</div>
                    <i v-if="detailId && docStatus < 100" class="sm-icon-edit el-icon-edit" @click="showChangeClient" title="编辑" style="right: 50px"></i>
                    <i v-if="detailId" class="icon-print" title="打印" @click="handlePrint" style="right: 0"></i>
                </template>
                <!--头部标题-->
                <template slot="head-form-title">
                    <div class="head-form-title">
                        <!--{{ detailForm.projectCode?("("+ detailForm.projectCode + ")"):"" }}-->
                        <span>&nbsp;{{ detailForm.projectName }}</span>
                        <span></span>
                    </div>
                </template>
                <!--头部表单-->
                <template slot="head-form-content">
                    <div class="head-form-content">
                        <template v-for="item in formProp">
                            <div v-if="item.type === 'inner' && !item.isLong">
                                <span>{{ item.name }}：</span>
                                <span :title="detailForm[item.prop]">{{ detailForm[item.prop] }}</span>
                            </div>
                        </template>
                    </div>
                    <!--<div style="padding-left: 20px;">
                        <span style="font-weight: bold;">开票名称：</span>
                        <span>{{ detailForm.refSystemClientName }}</span>
                    </div>-->
                    <div class="remark-wrap">
                        <div>备注：</div>
                        <div class="headspan scrollBar" :title="detailForm.remark">{{ detailForm.remark }}</div>
                    </div>
                </template>
                <!--详情内容-->
                <template slot="common-content">
                    <el-tabs v-model="activeName" class="common-content-tab">
                        <el-tab-pane label="核算明细" name="first">
                            <el-table
                                tooltip-effect="dark"
                                v-loading="loadingI"
                                :data="tabDataI"
                                border
                                show-summary
                                :summary-method="getSummaries"
                                :height="$store.state.screenHei*0.65"
                                highlight-current-row
                            >
                                <el-table-column label="序号" align="center" width="35">
                                    <template slot-scope="scope">
                                        <span>{{ scope.$index + 1 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="项目号" prop="itemNo" align="left" width="130"></el-table-column>
                                <el-table-column label="产品类别" prop="productCode" align="left" width="90"></el-table-column>
                                <el-table-column label="产品名称" prop="productName" align="left" width="90"></el-table-column>
                                <el-table-column label="型材" align="center">
                                    <el-table-column label="型号" align="left" width="120">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.matCode }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="名称" align="left" width="90" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.matName}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="颜色" align="center">
                                    <el-table-column label="名称" align="left" width="120" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.colorName}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="代码" align="left" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.colorCode }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="长度" align="right" width="45">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.length }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="发货数" align="center">
                                    <el-table-column label="总支数" align="right" width="60">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.actDigit }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="实际总重" align="right" width="70" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.actWght}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="理论总重" align="right" width="70" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.theoryWght }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="单位" align="center" width="50">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.uom }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="总方数" align="right" width="60">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.actSqm }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="铝锭价" align="right" width="60">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.refMatPrice }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="结算" align="center">
                                    <el-table-column label="数量" align="right" width="50">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.balanceDigit }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="单价" align="right" width="60" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.balancePrice }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="金额" align="right" width="80" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.balanceTotalMoney }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="开票" align="center">
                                    <el-table-column label="单价" align="right" width="60" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.billPrice}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="金额" align="right" width="80" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.billTotalMoney }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="是否含税" align="center" width="40">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.isTax ? '是':'否' }}</span>
                                    </template>
                                </el-table-column>
                                <!--<el-table-column label="含税" align="center">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.vatRate }}</span>
                                    </template>
                                </el-table-column>-->
                                <el-table-column label="理重结算" align="center" width="40">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.isTheoryWght ? '是':'否' }}</span>
                                    </template>
                                </el-table-column>
                                <!--<el-table-column label="结算方式" align="center">
                                    <el-table-column label="代码" align="center" width="120px">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.settlementMethod }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="名称" align="center" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.settlementMethodName }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>-->
                                <el-table-column label="出库单号" align="center" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.refDocCode }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注" align="center" width="200">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.remark }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" fixed="right">
                                    <template slot-scope="scope">
                                        <el-button size="mini" v-if="scope.row.isLocked" @click="handleLock(scope.row.fid,0)">解锁</el-button>
                                        <el-button size="mini" v-if="!scope.row.isLocked" @click="handleLock(scope.row.fid,1)">锁价</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="核算汇总" name="second">
                            <CommonTable
                                ref="childTable"
                                :isSum="true"
                                :sumParam = {isWeightNote:true}
                                :isCenter="true"
                                :isMulTable="true"
                                :isNotMulSelect="false"
                                :otherVariable="otherVariableI"
                                :formTableData="tabDataII"
                                :formPropTable="tabPropII"
                                :height="$store.state.screenHei*0.65"
                            >
                            </CommonTable>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </CommonDetailX>
        </div>
        <!--绑定客户-->
        <el-dialog
            title="维护客户/车号"
            :visible.sync="clientVisible"
            width="30%">
            <el-form :model="clientForm" @submit.native.prevent>
                <el-form-item label="客户" prop="refuseReason">
                    <SelectEnter
                        ref="clientSelect"
                        :inputValue="valueObj.clientCode"
                        :selectTHs="valueObj.clientTHs"
                        :selectTds="valueObj.clientList"
                        placeholder="输入客户代码回车搜索"
                        @getList="getClient"
                        @setObj="setClient"
                        selectLabel="fcode"
                        selectValue="fcode"
                        selectKey="fid">
                    </SelectEnter>
                    <SelectEnter
                        ref="clientSelectName"
                        :inputValue="valueObj.clientName"
                        :selectTHs="valueObj.clientTHs"
                        :selectTds="valueObj.clientList"
                        placeholder="输入客户名称回车搜索"
                        @getList="_getClient($event,'fname')"
                        @setObj="setClient"
                        selectLabel="fname"
                        selectValue="fname"
                        selectKey="fid">
                    </SelectEnter>
                </el-form-item>
                <el-form-item label="车号">
                    <el-input v-model="clientForm.carNum"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelClientChange">取 消</el-button>
                <el-button class="btn-cyan" @click="saveClientChange">确 定</el-button>
            </span>
        </el-dialog>
        <!--获取公共数据-->
        <CommonData :valueObj="valueObj" ref="commondata"></CommonData>
    </div>
</template>

<script>
    import CommonData from '$src/components/CommonData'
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    import CommonDetailX from '$src/components/CommonDetailX'
    import SelectEnter from '$src/components/SelectEnter'
    export default {
        components: {
            CommonData,
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetailX,
            SelectEnter,
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
                    contentWidth: 70,
                    popupTitle: '',
                    isMulSelect: true,
                    isInlineForm: true,
                    isEdit: false,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    loading: false,
                    $isCustom: true
                },
                otherVariableI: {
                    isSpread: false,
                    contentWidth: 70,
                    popupTitle: '',
                    isMulSelect: true,
                    isInlineForm: true,
                    isHeadComplex: true,
                    isFormComplex: true,
                    isReadTable: true,
                    isSaving:false,
                },
                tempWidth: null,
                tableData: [],
                //搜索映射表
                searchProp: [
                    {
                        name:'销售结算单号',
                        prop:'docCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入销售结算单号'
                    },
                    {
                        name:'核算日期',
                        prop:'beginDate',
                        type:'date',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'至',
                        prop:'endDate',
                        type:'date',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'单据状态',
                        prop:'docStatus',
                        type:'select',
                        selectList:[{value:null,label:'全部'},{value:0,label:'制单中'},{value:100,label:'已审核'}],
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'客户',
                        prop:'clientCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    }
                ],
                //详情映射列表
                formProp: [
                    {name:'结算单号',prop:'docCode',type:'outter'},
                    {name:'结算日期',prop:'docDate',type:'outter'},
                    {name:'单据状态',prop:'docStatusName',type:'outter'},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'名称',prop:'clientName',type:'inner'},
                    {name:'经销商',prop:'clientCode2',type:'inner'},
                    {name:'名称',prop:'clientName2',type:'inner'},
                    {name:'开票名称',prop:'refSystemClientName',type:'inner'},
                    {name:'核算员',prop:'enterName',type:'inner'},
                    {name:'开票类型',prop:'vatTypeName',type:'inner'},
                    {name:'总金额',prop:'billTotalMoney',type:'inner'},
                    {name:'车号',prop:'carNum',type:'inner'},
                    {name:'磅单号',prop:'poundNum',type:'inner'},
                    {name:'提货人',prop:'consigneeName',type:'inner'},
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
                        name1:'结算单号/',
                        prop1:'docCode',
                        name2:'状态',
                        prop2:'docStatusName',
                        type:'mixinNormal',
                        width: '115',
                        isShort: true
                    },
                    {
                        name1:'装车单单号/',
                        prop1:'refDocCode',
                        name2:'结算日期',
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
                        width: '130'
                    },
                    {
                        name1:'核算员/',
                        prop1:'enterName',
                        name2:'总金额',
                        prop2:'billTotalMoney',
                        type:'mixin',
                        isShort: true
                    }
                ],
                //订单明细映射表
                tabPropII: [
                    {prop:'productName', name:'产品名称',type:'normal'},
                    {prop:'productCode', name:'产品编号',type:'normal'},
                    {prop:'uom', name:'单位',type:'normal',width:60},
                    {prop:'actDigit', name:'支数',type:'normal',align:'right',className:'num-cell-r',width:80},
                    {prop:'balanceDigit', name:'数量',type:'normal',align:'right',className:'num-cell-r',width:80},
                    {
                        prop:'',name:'结算',type:'normal',
                        children: [
                            {prop:'balancePrice',name:'单价',type:'normal',align:'right',className:'num-cell-r',width:100},
                            {prop:'balanceTotalMoney',name:'金额',type:'normal',align:'right',className:'num-cell-r',width:100},
                        ]
                    },
                    {
                        prop:'',name:'开票',type:'normal',
                        children: [
                            {prop:'billPrice',name:'单价',type:'normal',align:'right',className:'num-cell-r',width:100},
                            {prop:'billTotalMoney',name:'金额',type:'normal',align:'right',className:'num-cell-r',width:100},
                        ]
                    },
                    {prop:'docCode', name:'单号',type:'normal',className:'num-cell-l'},
                ],
                searchForm: {docStatus:0},
                addOrEditForm: {},
                docStatus: null,
                detailForm: {},
                refMatPrice: null,
                detailId: null,
                docCode: null,
                //含税
                vatRate: null,
                //结算方式
                settlementMethod: null,
                settlementMethodName: null,
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //维护客户/车号
                clientVisible: false,
                clientForm: {},
                valueObj: {
                    //客户
                    clientCode: null,
                    clientName: null,
                    clientList: [],
                    clientTHs: [
                        {label:'代码',prop:'fcode'},
                        {label:'名称',prop:'fname'}
                    ],
                },
                //详情表格内容
                tabLeft: '100px',
                activeName: 'first',
                editIndex: 0,
                //订单明细数据
                tabDataI: [],
                tabDataII: [],
                loadingI: false,
                //审核
                selectList: [],
            }
        },
        mounted() {
            this.getData();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                if(this.searchForm.docCode) {
                    this.searchForm = {docCode:this.searchForm.docCode};
                }else {
                    this.searchForm.docCode = null;
                }
                this.tableData = [];
                this.fetch(`/oms/sls/OrderBalanceController/getBalanceMasterList?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
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
                            this.tabDataII = [];
                            this.detailForm = {};
                            this.detailId = null;
                            this.vatRate = null;
                            this.docStatus = null;
                            this.settlementMethod = null;
                            this.settlementMethodName = null;
                            this.pageObj.commonTotal = 0;
                            this.$nextTick(() => {
                                this.$refs['childTable'].initStatus();
                            })
                        }
                    })
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //刷新
            handleRefresh() {
                this.getData();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.tabDataII = [];
            },
            //重置
            handleReset() {
                this.searchForm = {docStatus:0};
                this.handleRefresh();
            },
            //点击主表行
            handleDetail(row) {
                this.vatRate = row.vatRate;
                this.settlementMethod = row.settlementMethod;
                this.settlementMethodName = row.settlementMethodName;
                this.detailId = row.fid;
                this.docCode = row.docCode;
                this.otherVariable.isChildEdit = false;
                this.isShowStatus.isRead = true;
                this.detailForm = row;
                this.docStatus = row.docStatus;
                this.getDetailTable(row.fid)
            },
            //获取从表
            getDetailTable(fid) {
                this.fetch('/oms/sls/OrderBalanceController/getBalanceDetailList',{masterId:fid})
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            result.data.forEach(item => {
                                item.vatRate = this.vatRate;
                                item.settlementMethod = this.settlementMethod;
                                item.settlementMethodName = this.settlementMethodName;
                            });
                            this.tabDataI = result.data;
                        }else {
                            this.tabDataI = [];
                        }
                    });
                this.fetch('/oms/sls/OrderBalanceController/getBalanceCollect',{masterId:fid})
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            this.tabDataII = result.data;
                        }else {
                            this.tabDataII = [];
                        }
                    })
                    .then(() => {
                        this.$refs['childTable'].initStatus();
                    })
            },
            //合计
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                let length = null;
                let actDigit = null;
                let actSqm = null;
                let actWght = null;
                let theoryWght = null;
                let balanceTotalMoney = null;
                let billTotalMoney = null;
                let balanceDigit = null;
                if(data.length) {
                    data.forEach((d,i) => {
                        balanceDigit += Number(d.balanceDigit);
                        actSqm += Number(d.actSqm);
                        actDigit += Number(d.actDigit);
                        actWght += Number(d.actWght);
                        theoryWght += Number(d.theoryWght);
                        length += Number(d.length);
                        balanceTotalMoney += Number(d.balanceTotalMoney);
                        billTotalMoney += Number(d.billTotalMoney);
                    })
                }
                sums[0] = '合计';
                //长度
                length ? sums[8] = length.toFixed(2) : sums[8] = 0;
                //总支数
                sums[9] = actDigit||0;
                //实际总重
                actWght ? sums[10] = actWght.toFixed(3) : sums[10] = 0;
                //理论总重
                theoryWght ? sums[11] = theoryWght.toFixed(3) : sums[11] = 0;
                //总方数
                sums[13] = actSqm||0;
                //结算数量
                sums[15] = balanceDigit||0;
                //结算金额
                balanceTotalMoney ? sums[17] = balanceTotalMoney.toFixed(3) : sums[17] = 0;
                //开票金额
                billTotalMoney ? sums[19] = billTotalMoney.toFixed(3) : sums[19] = 0;
                return sums;
            },
            //打印
            handlePrint() {
                let isReturn = false;
                let resultUrl = '';
                this.getAjax(`/oms/PrintController/isPrintOrderBalance?balanceId=${this.detailId}`)
                    .then(result => {
                        if(result.status === 200) {
                            isReturn = true;
                            resultUrl = result.data;
                        }else {
                            isReturn = false;
                            this.$message({
                                type:'error',
                                message: result.error || '请求错误'
                            })
                        }
                    })
                    .then(() => {
                        if(isReturn) {
                            window.open(resultUrl);
                        }
                    })
            },
            handleLock(fid,val) {
                let successText = '';
                let failText = '';
                val ? successText = '锁价成功' : successText = '解锁成功';
                val ? failText = '锁价失败' : failText = '解锁失败';
                this.fetch(`/oms/sls/OrderBalanceController/doLockPrice`,{masterId:this.detailId,fid:fid,isLocked:val})
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: successText,
                                type: 'success'
                            });
                            this.getDetailTable(this.detailId);
                        }else {
                            this.$message({
                                message: failText,
                                type: 'error'
                            });
                        }
                    })
            },
            //重新计价
            resetPrice() {
                let fids = [];
                this.tabDataI.forEach(item => {
                    fids.push(item.fid)
                });
                this.fetch(`/oms/sls/OrderBalanceController/getBalanceRecalculate`,{masterId:this.detailId,fids:fids})
                    .then(result => {
                        if(result.status === 200) {
                            let resultMsg = '';
                            let successMsg = result.data;
                            if(Array.isArray(result.data)) {
                                result.data.forEach(item => {
                                    resultMsg += `<p style="color:orange">${item}</p>`
                                });
                                successMsg = '部分明细重新计价成功!'
                            }
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message: `<div style="text-align:center"><p style="margin-bottom: 5px;">${successMsg}</p>${resultMsg}</div>`,
                                type: 'success'
                            });
                            this.getData(false)
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            })
                        }
                    })
            },
            //回滚
            returnBack() {
                let fids = [];
                this.tabDataI.forEach(item => {
                    fids.push(item.fid)
                });
                this.fetch(`/oms/sls/OrderBalanceController/rollbackBalanceMoney`,{masterId:this.detailId,fids:fids})
                    .then(result => {
                        if(result.status === 200) {
                            let resultMsg = '';
                            let successMsg = result.data;
                            if(Array.isArray(result.data)) {
                                result.data.forEach(item => {
                                    resultMsg += `<p style="color:orange">${item}</p>`
                                });
                                successMsg = '部分明细回滚价格成功!'
                            }
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message: `<div style="text-align:center"><p style="margin-bottom: 5px;">${successMsg}</p>${resultMsg}</div>`,
                                type: 'success'
                            });
                            this.getData(false)
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            })
                        }
                    })
            },
            //维护客户
            getClient(val) {
                this.$refs.commondata.getClient(val);
            },
            _getClient(val,searchParam) {
                this.$refs.commondata.getClient(val,searchParam);
            },
            setClient(item) {
                this.$set(this.clientForm,'clientId',item.fid);
                this.valueObj.clientName = item.fname;
                this.valueObj.clientCode = item.fcode;
            },
            showChangeClient() {
                this.clientVisible = true;
                this.$nextTick(() => {
                    this.clientForm.fId = this.detailId;
                    // 客户
                    this.$refs.clientSelect.inputValueData = this.detailForm.clientCode;
                    this.$refs.clientSelectName.inputValueData = this.detailForm.clientName;
                    this.valueObj.clientCode = this.detailForm.clientCode;
                    this.valueObj.clientName = this.detailForm.clientName;
                    this.clientForm.clientId = this.detailForm.clientId;
                    this.clientForm.clientCode = this.detailForm.clientCode;
                    this.clientForm.clientName = this.detailForm.clientName;
                    // 车号
                    this.clientForm.carNum = this.detailForm.carNum;
                });
            },
            cancelClientChange() {
                this.clientVisible = false;
            },
            saveClientChange() {
                this.fetch('/oms/sls/OrderBalanceController/updateMasterHeader',{fId:this.clientForm.fId,clientId:this.clientForm.clientId,carNum: this.clientForm.carNum})
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: result.message,
                                type: 'success'
                            });
                            this.clientVisible = false;
                            this.getData(false);
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            })
                        }
                    })
            },
            handleSelectionChange(rows) {
                this.selectList = [];
                rows.forEach(item => {
                    this.selectList.push(item.fid)
                })
            },
            //审核
            handleAdudit(isMul = false) {
                const that = this;
                let fIds = [];
                if(isMul) {
                    if(this.selectList.length) {
                        this.$confirm('是否确认审核'+this.selectList.length+'条订单?','提示',{
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            fIds = this.selectList;
                            adudit()
                        })
                    }else {
                        this.$message({
                            message: '请勾选结算单',
                            type: 'warning'
                        })
                    }
                }else {
                    fIds = [this.detailId];
                    this.$confirm('是否确认审核?','提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        adudit()
                    })
                }
                function adudit() {
                    that.fetch('/oms/sls/OrderBalanceController/submitAndAuditingBalance',{fIds})
                        .then(result => {
                            if(result.status === 200) {
                                that.$message({
                                    message: result.data,
                                    type: 'success'
                                });
                                that.selectList = [];
                                isMul ? that.getInitPage() : that.getData(false);
                            }else {
                                that.$message({
                                    message: that.returnErrorMsg(result.error),
                                    type: 'warning'
                                })
                            }
                        })
                }
            },
            //切换布局
            toggleSpread() {
                this.otherVariable.isSpread = !this.otherVariable.isSpread;
                if(this.otherVariable.isSpread) {
                    this.otherVariable.contentWidth = 100;
                }else {
                    this.otherVariable.contentWidth = this.tempWidth;
                }
            }
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
    .exportCount {
        z-index: 99;
        position: absolute;
        right: 100px;
        bottom: 3px;
        transform: translateY(50%);
        cursor: pointer;
        border-radius: 50%;
        width: 55px;
        height: 55px;
        line-height: 55px;
        text-align: center;
        font-size: 18px;
        color: #fff;
        background: #FF7F00;
    }
</style>
