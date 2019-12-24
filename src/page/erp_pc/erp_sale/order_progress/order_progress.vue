<template>
    <div class="common-table flex-column">
        <el-form :model="searchForm" :inline="true"  @submit.native.prevent @keyup.enter.native="getData">
            <el-form-item  label="下单日期:" >
                <el-date-picker
                    v-model="searchForm.beginDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item  label="至" >
                <el-date-picker
                    v-model="searchForm.overDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="订单编号:" >
                <el-input
                    v-model.trim="searchForm.docCode"
                    width="70"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="订单状态" prop="docStatus">
                <el-select v-model="searchForm.docStatus"  >
                    <el-option
                        v-for="(item,index) in OrderList"
                        :key="index"
                        :label="item.dictText"
                        :value="item.dictValue">
                    </el-option>
                </el-select>
            </el-form-item>
           <el-form-item>
                   <el-checkbox :true-label="1" :false-label="0" v-model="searchForm.isCancel">取消</el-checkbox>
                   <el-checkbox :true-label="1" :false-label="0" v-model="searchForm.isClose">关闭</el-checkbox>
           </el-form-item>
            <br/>
            <el-form-item label="进度状态" prop="ledgerStatus">
                <el-select v-model="searchForm.ledgerStatus" >
                    <el-option
                        v-for="(item,index) in ledgerList"
                        :key="index"
                        :label="item.dictText"
                        :value="item.dictValue">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户:"  v-if="showSearchInput">
                <el-input
                    v-model.trim="searchForm.clientCode"
                    class="search-input"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="工程:"  v-if="showSearchInput">
                <el-input
                    v-model.trim="searchForm.projectName"
                    class="search-input"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="单据类型:"  v-if="showSearchInput">
                <el-input
                    v-model.trim="searchForm.docType"
                    class="search-input"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="经销商:"  v-if="showSearchInput">
                <el-input
                    v-model.trim="searchForm.clientCode2"
                    class="search-input"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="生产基地:"  v-if="showSearchInput">
                <el-input
                    v-model.trim="searchForm.supplyCompanyName"
                    class="search-input"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="货期类型:"  v-if="showSearchInput">
                <el-input
                    v-model.trim="searchForm.deliveryLevelName"
                    class="search-input"
                >
                </el-input>
            </el-form-item>
            <el-button class="btn-cyan search-btn" @click="handleSearch">查询</el-button>
            <el-button class="search-more" @click="toggleSearch">
                <span>更多查询</span>
                <i class="el-icon--right" :class="showSearch?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
            </el-button>
            <el-button @click="handleRefresh">刷新</el-button>
            <el-button @click="handleReset">重置</el-button>
        </el-form>

        <el-table
            :data="orders"
            highlight-current-row
            style="width: 100%"
            :height="$store.state.screenHei*0.74"
            ref="moviesTable"
            @selection-change="handleSelectionChange"
        >
            <el-table-column  type="index" width="55"></el-table-column>
            <el-table-column label="订单编号" width="120" align="center">
                <template slot-scope="scope">
                    <span @click="handleOrder(scope.$index,scope.row)" style="color: blue">{{scope.row.docCode}}</span>
                </template>
            </el-table-column>
            <el-table-column  label="订单进度" align="center" >
                <el-table-column prop="orderMatchRate" label="配套率"></el-table-column>
                <el-table-column prop="docStatusName" label="订单状态"></el-table-column>
                <el-table-column prop="ledgerStatusName" label="进度状态"></el-table-column>
            </el-table-column>
            <el-table-column prop="docType" label="单据类型" :show-overflow-tooltip="true"  align="center"></el-table-column>
            <el-table-column prop="docDate" label="单据日期" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>
            <el-table-column prop="deliveryDate" label="交货日期" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>
            <el-table-column prop="alPriceDate" label="铝价日期" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>
            <!--<el-table-column prop="stripPvcBrandName" label="胶条标记" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>-->
            <!--<el-table-column prop="injectionPvcBrandName" label="注胶标记" :show-overflow-tooltip="true" align="center" width="90"></el-table-column>-->
            <el-table-column prop="clientCode2" label="经销商代码"   width="120" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="clientCode" label="客户代码"  :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="projectName" label="工程名称" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="deliveryLevelName" label="货期类型"  :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="plantPo" label="生产基地代码" width="120"   :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="followName" label="跟单员姓名"   width="120"  :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column  label="包装方式" align="center" >
                <el-table-column prop="packMethodCode" label="代码" :show-overflow-tooltip="true" align="center"></el-table-column>
                <el-table-column prop="packMethodName" label="名称" :show-overflow-tooltip="true" align="center"></el-table-column>
            </el-table-column>
            <el-table-column  label="录入"  align="center">
                <el-table-column prop="enterName" label="人员" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="enterTime" label="日期" :show-overflow-tooltip="true" width="100"></el-table-column>
            </el-table-column>
            <el-table-column  label="签批" align="center" >
                <el-table-column prop="refOperator" label="人员" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="refTime" label="日期" :show-overflow-tooltip="true" width="100"></el-table-column>
            </el-table-column>
            <el-table-column  label="审批"  align="center">
                <el-table-column prop="postName" label="人员" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="postTime" label="日期" :show-overflow-tooltip="true" width="100"></el-table-column>
            </el-table-column>
        </el-table>

        <!--分页区域-->
        <CommonPagination
            :pageObj="pageObj"
            @getData="getData"
        ></CommonPagination>

        <!--订单详情界面-->
        <!-- 编辑界面 -->
        <el-dialog :visible.sync="editFormVisible" class="orderdialog" fullscreen :modal="false">
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-row :gutter="20">
                        <el-col :span="4" style="margin: 5px"><span>订单号:{{editForm.docCode}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>下单日期:{{editForm.docDate}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>交货日期:{{editForm.deliveryDate}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>单据类型:{{editForm.docType}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>进度状态:{{editForm.ledgerStatusName}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>客户: {{editForm.clientCode}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>经销商: {{editForm.clientCode2}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>品牌: {{editForm.brandName}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>生产方式: {{editForm.prdMethodName}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>生产基地: {{editForm.plantPo}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>包装方式: {{editForm.packMethodName}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>开票类型: {{editForm.vatTypeName}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>贴膜方式: {{editForm.padPastingMethodName}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>支数上限(%): {{editForm.digitUpperRate}}</span></el-col>
                        <el-col :span="4" style="margin: 5px"><span>支数下限(%): {{editForm.digitLowerRate}}</span></el-col>
                        <el-col :span="13" style="margin: 5px"><span>工程名称:{{editForm.projectName}}</span></el-col>
                        <el-col :span="10" style="margin: 5px"><span>
                            <span style="margin-right: 5px"> <i class="icon iconfont" :class="editForm.isTheory==1?'icon-check':'icon-zhengfangxing'"></i> 理重发货</span>
                             <span style="margin-right: 5px"> <i class="icon iconfont" :class="editForm.isBundle==1?'icon-check':'icon-zhengfangxing'"></i> 打捆发货</span>
                             <span> <i class="icon iconfont" :class="editForm.isSawTrace==1?'icon-check':'icon-zhengfangxing'"></i> 锯挂痕</span>
                            <!--<el-checkbox :true-label="1" :false-label="0" disabled v-model="editForm.isTheory" >理重发货</el-checkbox>-->
                            <!--<el-checkbox :true-label="1" :false-label="0" disabled v-model="editForm.isBundle">打捆发货</el-checkbox>-->
                            <!--<el-checkbox :true-label="1" :false-label="0" disabled v-model="editForm.isSawTrace">锯挂痕</el-checkbox>-->
                        </span></el-col>
                        <el-col :span="15" style="margin: 5px"><span>客户标签1:{{editForm.usrLabelText1}}</span></el-col>
                        <el-col :span="9" style="margin: 5px"><span>客户标签2:{{editForm.usrLableText2}}</span></el-col>
                        <br>
                        <el-col :span="24" style="margin: 5px"><span>备注:{{editForm.remark}}</span></el-col>
                    </el-row>
                </el-col>
                <el-col :span="4" style="text-align: -webkit-right;">
                    <span style="position: absolute;top: 46px;right: 120px;font-size: 16px;font-weight: bold;">订单配套率</span>
                    <el-progress type="circle" :percentage="editForm.orderMatchRate || 0" class="circleProgress" :width="100"></el-progress>
                </el-col>
            </el-row>
            <!--tab区域-->
            <div class="tab-wrap">
                <el-button v-if="false" class="print-btn btn-cyan search-btn" @click="handlePrint">打印</el-button>
                <el-tabs v-model="activeName" class="common-content-tab">
                    <el-tab-pane label="项目进度明细" name="first">
                        <el-table
                            :data="ordersDatilList"
                            heihlight-current-row
                            :height="$store.state.screenHei*0.60"
                            border
                        >
                            <el-table-column prop="itemNo" label="项目号" fixed="left"  width="120" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="matCode" label="型号"  fixed="left" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="cx1Name" label="颜色"  fixed="left" align="left" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="produceProgressText" label="任务进度"  fixed="left" width="250" class="produceText" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="isFinish" label="完工" fixed="left" align="center" width="55">
                                <template slot-scope="scope"  >
                                    <div>{{scope.row.isFinish ==1?"√":(scope.row.isFinish==0)?" ":""}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="终止" fixed="left" align="center" width="55">
                                <template slot-scope="scope" >
                                    <div>{{scope.row.isStop ==1?"√":(scope.row.isStop ==0)?"":''}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="cx2" label="材质"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="cx4Name" label="长度"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="cx3Name" label="膜厚"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="usrTxt1Name" label="喷码"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="stripPvcBrandName" label="胶条标记"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="injectionPvcBrandName" label="注胶标记"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="unitWght" label="支重"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="" label="订单数据"  align="center">
                                <el-table-column prop="digit" label="支数" align="right" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="digitUpperRate" label="支数上限" align="right" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="digitLowerRate" label="支数下限" align="right" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="theoryWght" label="理重" align="right" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>
                            <el-table-column  label="取消数据"  align="center">
                                <el-table-column prop="cancelDigit" label="支数" align="right" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="cancelTheroyWght" label="理重" align="right" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>
                            <!--<el-table-column  label="计划数据"  align="center">
                                <el-table-column prop="planDigit" label="支数" align="right" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="planTheroyWght" label="理重" align="right" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>-->
                            <el-table-column  label="库存数据"  align="center">
                                <el-table-column prop="stockDigit" label="支数" align="right" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="stockTheroyWght" label="理重" align="right" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>
                            <el-table-column  label="锁定数据"  align="center">
                                <el-table-column prop="lockDigit" label="支数" align="right" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="lockTheroyWght" label="理重" align="right" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>
                            <el-table-column  label="已发货数据"  align="center">
                                <el-table-column prop="deliveryDigit" label="支数" align="right" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="deliveryTheroyWght" label="理重" align="right" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>
                            <el-table-column  label="退货数据"  align="center">
                                <el-table-column prop="returnDigit" label="支数" align="right" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="returnTheroyWght" label="理重" align="right" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>
                            <el-table-column  label="欠缺数据" align="center" >
                                <el-table-column prop="lackDigit" label="支数" align="right" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="lackTheroyWght" label="理重" align="right" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>
                            <el-table-column  label="入库日期" align="center" >
                                <el-table-column prop="firstStockInDate" label="首次" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="lastStockInDate" label="最近" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>
                            <el-table-column  label="出库日期"  align="center">
                                <el-table-column prop="firstStockOutDate" label="首次" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="lastStockOutDate" label="最近" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>
                            <el-table-column prop="usrTxt4" label="直径"  :show-overflow-tooltip="true" align="center"></el-table-column>
                            <el-table-column prop="usrTxt6" label="胶条型号"  :show-overflow-tooltip="true" align="center"></el-table-column>
                            <el-table-column prop="usrTxt2Name" label="禁喷类型"  :show-overflow-tooltip="true" align="center"></el-table-column>
                            <el-table-column prop="usrTxt3" label="撕筋" :show-overflow-tooltip="true" width="55" align="center">
                                <template slot-scope="scope">
                                    <div>{{scope.row.usrTxt3==1?"√":" "}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="isCombine" label="隔热"  align="center" width="55">
                                <template slot-scope="scope">
                                    <div>{{scope.row.isCombine==1?"√":" "}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column  label="包装方式"  align="center">
                                <el-table-column prop="packMethodCode" label="代码" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="packMethodName" label="名称" :show-overflow-tooltip="true"></el-table-column>
                            </el-table-column>
                            <el-table-column prop="perLotQty" label="支/扎" :show-overflow-tooltip="true" align="center" ></el-table-column>
                            <el-table-column prop="remark" label="备注"  :show-overflow-tooltip="true"  align="center"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="项目变更历史" name="second">
                        <el-table
                            :data="ordersChandList"
                            heihlight-current-row
                            :height="$store.state.screenHei*0.60"
                            border
                            :header-cell-style="tableHeaderColor"
                        >
                            <el-table-column prop="orderChangeCode" label="变更单号" fixed="left"  width="120" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="docDate" label="变更日期"  fixed="left" :show-overflow-tooltip="true" width="120"></el-table-column>
                            <el-table-column prop="docStatusName" label="状态"  fixed="left" align="left" :show-overflow-tooltip="true" width="100"></el-table-column>
                            <el-table-column prop="itemNo" label="项目号"  fixed="left"  width="120" class="produceText" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="matCode" label="型号"  :show-overflow-tooltip="true" width="100"></el-table-column>
                            <el-table-column prop="changeText" label="变更请求内容"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="isRefuse" label="拒批"  :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <div>{{scope.row.isRefuse==1?"是":"否"}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="refuseReason" label="拒批理由"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="enterName" label="录入人"  :show-overflow-tooltip="true" width="100"></el-table-column>
                            <el-table-column prop="enterTime" label="录入时间"  :show-overflow-tooltip="true" width="100"></el-table-column>
                            <el-table-column prop="postName" label="审核人"  :show-overflow-tooltip="true" width="100"></el-table-column>
                            <el-table-column prop="postTime" label="审核时间"  :show-overflow-tooltip="true" width="100"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="进出仓库明细" name="three">
                        <el-table
                            :data="ordersSatiList"
                            heihlight-current-row
                            :height="$store.state.screenHei*0.60"
                            border
                            :header-cell-style="tableHeaderColor"
                        >
                            <el-table-column prop="docCode" label="单据编号" fixed="left"  width="120" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="docDate" label="单据日期"  fixed="left" :show-overflow-tooltip="true" width="120"></el-table-column>
                            <el-table-column prop="docType" label="单据类型"  fixed="left" align="left" :show-overflow-tooltip="true" width="120"></el-table-column>
                            <el-table-column prop="refDocId" label="项目号"  fixed="left" width="120" class="produceText" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="matCode" label="型号"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="digit" label="支数"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="actualWght" label="重量"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="enterName" label="录入人"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="enterTime" label="录入时间"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="postName" label="审核人"  :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="postTime" label="审核时间"  :show-overflow-tooltip="true"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    export default {
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination
        },
        data() {
            return {
                tableHeaderColor: {
                    'background-color':'#f5f7fa'
                },
                checked:true,
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                otherVariable: {
                    isReadTable: true,
                    isMulSelect:true,
                },
                showOverflowTooltip:true,
                isMulSelect:true,
                isNotMulSelect:true,
                editFormVisible:false,
                showSearch:false,
                showSearchInput:false,
                currentRow: null,
                orderId: null,
                flowId: null,
                activeName: 'first',
                //分页
                pageObj: {
                    className: 'custom-pagination',
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                pageDialog:{
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                orders:[],
                ordersDatilList:[],
                //仓库进度
                ordersSatiList:[],
                ordersChandList:[],
                editForm:{},
                //订单状态
                OrderList:[],
                ledgerList:[],
                //搜索映射表
                searchProp: [
                    {
                        name:'订单号',
                        prop:'docCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder: '请输入订单号'
                    },
                ],
                //表格映射列表
                tableProp: [

                    {prop:'refDocCode', name:'订单编号',type:'normal',align:'left',fixed:'left' },
                    {prop:'itemNo', name:'订单进度',
                        children:[
                            {prop:'',name:'配套率',type:'normal',align:'right'},
                            {prop:'',name:'单据状态',type:'normal',align:'right'},

                        ]

                    },
                    {prop:'', name:'单据类型',type:'normal',align:'left'},
                    {prop:'', name:'单据日期',type:'normal',align:'left'},
                    {prop:'', name:'交货日期',type:'normal',align:'left'},
                    {prop:'', name:'经销商代码',type:'normal',align:'right'},
                    {prop:'', name:'客户代码',type:'normal',align:'right'},
                    {prop:'', name:'工程名称',type:'normal',align:'right'},
                    {prop:'', name:'货期类型',type:'normal',align:'right'},
                    {prop:'', name:'生产基地代码',type:'normal',align:'right'},
                    {prop:'', name:'跟单员姓名',type:'normal',align:'right'},

                    {
                        prop:'', name:'包装方式',
                        children:[
                            {prop:'',name:'代码',type:'normal',align:'right'},
                            {prop:'',name:'名称',type:'normal',align:'right'},
                        ]
                    },
                    {
                        prop:'', name:'录入',
                        children:[
                            {prop:'',name:'人员',type:'normal',align:'right'},
                            {prop:'',name:'日期',type:'normal',align:'right'},

                        ]
                    },
                    {
                        prop:'', name:'签批',
                        children:[
                            {prop:'',name:'人员',type:'normal',align:'right'},
                            {prop:'',name:'日期',type:'normal',align:'right'},

                        ]
                    },
                    {
                        prop:'', name:'审核',
                        children:[
                            {prop:'',name:'人员',type:'normal',align:'right'},
                            {prop:'',name:'日期',type:'normal',align:'right'},

                        ]
                    },
                ],
                searchForm: {
                    isCancel:0,isClose:0

                },
                tableData: [],
            }
        },
        mounted() {
            this.getData();
            this.getdocType();
            this. getledgerList();
        },
        methods: {
            getData() {
                this.orders=[];
                this.fetch(`/oms/sls/OrderSchedule/getOrderSchedule?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data) {
                            this.orders = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })

            },
            handleRefresh() {
                this.getData();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },
            handleReset() {
                this.searchForm = {isCancel:0,isClose:0};
                this.handleRefresh();
            },
            handleSearch() {
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.pageObj.commonTotal = 0;
                this.getData();
            },
            handlePrint() {
                let isReturn = false;
                let resultUrl = '';
                this.getAjax(`/oms/PrintController/isPrint?fId=${this.flowId}`)
                    .then(result => {
                        if(result.status === 200) {
                            isReturn = true;
                            resultUrl = result.data;
                        }else {
                            isReturn = false;
                            this.$message({
                                type:'error',
                                message: result.error
                            })
                        }
                    })
                    .then(() => {
                        if(isReturn) {
                            window.open(resultUrl);
                        }
                    })
            },
            //更多查询
            toggleSearch(){
                this.showSearchInput=!this.showSearchInput;
                this.showSearch = !this.showSearch;
            },

            //订单编号点击
            handleOrder(index,row){
                this.editForm = row;
                this.editFormVisible=true;
                this.ordersDatilList=[];
                this.$refs.moviesTable.setCurrentRow(row);
                this.getDialog();
                this.getState();
                this.getChande();
            },

            //弹框接口
            getDialog() {
                this.orderId = this.editForm.fId;
                this.flowId = this.editForm.flowId;
                this.fetch(`/oms/sls/OrderSchedule/getOrderScheduleDetail?pageNo=${this.pageDialog.commonPage}&pageSize=1000`,{fId:this.editForm.fId})
                    .then(result => {
                        if(result.data) {
                            this.ordersDatilList = result.data.list;
                            this.pageDialog.commonTotal = result.data.total;
                        }else {
                            this.pageDialog.commonTotal = 0;
                        }
                    })
            },
            //仓库
            getState(){
                this.orderId = this.editForm.fId;
                this.flowId = this.editForm.flowId;
                this.fetch(`/oms/sls/OrderSchedule/getOrderScheduleStockDetail?pageNo=${this.pageDialog.commonPage}&pageSize=1000`,{fId: this.orderId})
                    .then(result => {

                        if(result.data) {

                            this.ordersSatiList = result.data;

                            this.pageDialog.commonTotal = result.data.total;
                        }else {
                            this.pageDialog.commonTotal = 0;
                        }
                    })

            },
            //变更
            getChande(){
                this.orderId = this.editForm.fId;
                this.flowId = this.editForm.flowId;
                this.fetch(`/oms/sls/SalesOrderChange/getChangeHistory?pageNo=${this.pageDialog.commonPage}&pageSize=1000`,{orderId :this.orderId})
                    .then(result => {

                        if(result.data) {
                            this.ordersChandList = result.data.list;

                            this.pageDialog.commonTotal = result.data.total;
                        }else {
                            this.pageDialog.commonTotal = 0;
                        }
                    })

            },

            clickRow(row){
                this.editForm = row;
                this.editFormVisible=true;
                this.ordersDatilList=[];
                this.$refs.moviesTable.setCurrentRow(row);
                this.getDialog();
                this.$refs.moviesTable.toggleRowSelection(row);
            },
            //获取订单状态
            getdocType() {
                this.OrderList = [];
                this.getAjax(`/basedata/sys/DataDictionary/getDataDictionary?docCode=${30127}`)
                    .then(result => {
                        if(result.data) {
                            this.OrderList = result.data;
                        }else {
                            this.OrderList = [];
                        }
                    })
            },



            //获取订单进度状态
            getledgerList(){
                this.ledgerList = [];
                this.getAjax(`/basedata/sys/DataDictionary/getDataDictionary?docCode=${30128}`)
                    .then(result => {
                        if(result.data) {
                            this.ledgerList = result.data;
                           // console.log(this.ledgerList)
                        }else {
                            this.ledgerList = [];
                        }
                    })

            }
        }
    }
</script>
<style>
    .searchInput{
        width: 10%;
    }
    .orderdialog .el-dialog{
        margin-top: 0vh !important;
        width: 91%;
        height: 100%;
        margin-left: 8.6%;
    }
    .el-table_2_column_30  .cell{
        text-align: center;
    }

    .common-table {
        padding: 10px;
        /* display: flex; */
        height: 100%;
    }
    .common-table.flex-column {
        flex-direction: column;
    }
    .tab-wrap {
        position: relative;
    }
    .print-btn {
        z-index: 100;
        position: absolute;
        left: 130px;
        top: 6px;
    }

</style>
