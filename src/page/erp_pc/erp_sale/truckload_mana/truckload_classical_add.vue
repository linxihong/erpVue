<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap" @click="handleNotAllowed" v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleAdd">新建</el-button>
                <el-button @click="handleRefresh">刷新</el-button>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="searchProp"
                :searchForm="searchForm"
                @getData="getInitPage"
            >
            </CommonSearch>
            <!--表格区域-->
            <CommonTable
                v-if="isResize"
                ref="commontable"
                :mainHeight="mainHeight"
                :isShowStatus="isShowStatus"
                :propData="tableProp"
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
                @handleEdit="handleEdit"
                @handleDelete="handleDelete"
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
                    <div v-if="isBanOperate" class="xs-icon-confirm" @click="handleConfirm">提交</div>
                    <!--<div v-if="detailId&&!isBanOperate" class="xs-icon-confirm" @click="handleUnConfirm">撤回</div>-->
                    <i v-if="isBanOperate" class="sm-icon-edit el-icon-edit" title="编辑" @click="handleEdit"></i>
                    <i v-if="isBanOperate" class="sm-icon-edit el-icon-delete" title="删除" @click="handleDelete" style="right: 65px;"></i>
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
                    <!--<div class="remark-wrap">
                        <div>备注：</div>
                        <div class="headspan scrollBar" :title="detailForm.remark">{{ detailForm.remark }}</div>
                    </div>-->
                </template>
                <!--详情内容-->
                <template slot="common-content">
                    <!--按钮区域-->
                    <div class="tab-btn-wrap" :style="{left: tabLeft}">
                        <el-button v-if="isBanOperate" class="btn-cyan" @click="handleAddChild">增行</el-button>
                        <el-button v-if="isBanOperate" class="btn-cyan" @click="handleMulEdit">批量修改</el-button>
                    </div>
                    <!--tab区域-->
                    <el-tabs v-model="activeName" class="common-content-tab order_style">
                        <el-tab-pane label="装车明细" name="first">
                            <CommonTable
                                v-if="isResize"
                                ref="childTable"
                                v-loading="loadingI"
                                :isCenter="true"
                                :isMulTable="true"
                                :tableHeight="tableHeight"
                                :otherVariable="otherVariable"
                                :formTableData="tabDataI"
                                :formPropTable="tabPropI"
                            >
                                <template slot="operate-btn">
                                    <el-table-column v-if="isBanOperate" label="操作" align="center" width="55" fixed="right">
                                        <template slot-scope="scope">
                                            <i class="el-icon-delete" title="删除" @click.stop="handleDeleteChild(scope.row,scope.$index)"></i>
                                        </template>
                                    </el-table-column>
                                </template>
                            </CommonTable>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </CommonDetailX>
            <!--新增/编辑区域-->
            <transition name="popup">
                <CommonAdd
                    v-show="isShowStatus.isPopUp"
                    :otherVariable="otherVariable"
                    :addForm="addOrEditForm"
                    @handleCancel="handleCancel"
                    @handleSave="handleSave"
                >
                    <template slot="head-form-title">
                        <div class="head-form-title">
                            <span>{{otherVariable.popupTitle}}</span>
                        </div>
                    </template>
                    <template slot="custom-add-form">
                        <el-form ref="addOrEditForm" :model="addOrEditForm" :rules="mainRules" :inline="otherVariable.isInlineForm" label-width="120px">
                            <div class="inline-form-title">基础信息</div>
                            <el-form-item label="装车日期" prop="docDate">
                                <el-date-picker
                                    data-index
                                    @blur="nextFocus"
                                    @focus="setFocus(0)"
                                    v-model="addOrEditForm.docDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="订单" prop="flowOrderId">
                                <el-select
                                    data-index
                                    @blur="nextFocus"
                                    @focus="setFocus(1)"
                                    clearable
                                    filterable
                                    remote
                                    :loading="selectLoading"
                                    v-scroll="selectScroll"
                                    placeholder="请输入订单号进行搜索"
                                    :remote-method="getDocCodeList"
                                    v-model.trim="addOrEditForm.flowOrderId"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="(item,index) in docCodeList"
                                        :key="index"
                                        :label="item.refDocCode"
                                        :value="item.fid">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <!--<el-form-item label="品牌" prop="brandName">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.brandName"
                                    style="width: 100%"
                                    @change="setBrand"
                                    data-index
                                    @focus="setFocus(1)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in brandList"
                                        :key="index"
                                        :label="item.fname"
                                        :value="item.fname">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="单据类型" prop="docType">
                                <el-select
                                    data-index
                                    @focus="setFocus(2)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                    clearable
                                    v-model="addOrEditForm.docType"
                                    style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in orderTypeList"
                                        :key="index"
                                        :label="item.dictText"
                                        :value="item.dictText">
                                    </el-option>
                                </el-select>
                            </el-form-item>-->
                            <!--<el-form-item label="提货方式" prop="loaderMethodName">
                                <el-select
                                    data-index
                                    @focus="setFocus(2)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                    clearable
                                    v-model="addOrEditForm.loaderMethodName"
                                    @change="setDeliveryMethod"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="(item,index) in deliveryMethodList"
                                        :key="index"
                                        :label="item.fname"
                                        :value="item.fname">
                                    </el-option>
                                </el-select>
                            </el-form-item>-->
                            <!--<el-form-item prop="projectName" label="工程项目">
                                <el-input
                                    data-index
                                    @focus="setFocus(3)"
                                    @keydown.enter.native="nextFocus"
                                    placeholder="请输入工程名称"
                                    v-model="addOrEditForm.projectName">
                                </el-input>
                                &lt;!&ndash;<SelectEnter
                                    ref="projectSelect"
                                    v-model="valueObj.projectName"
                                    :inputValue="valueObj.projectName"
                                    :selectTHs="valueObj.projectTHs"
                                    :selectTds="valueObj.projectList"
                                    placeholder="请选择"
                                    @getList="getClientProject"
                                    @setObj="setProject"
                                    selectLabel="projectName"
                                    selectValue="projectCode"
                                    selectKey="fid">
                                </SelectEnter>&ndash;&gt;
                            </el-form-item>
                            <el-form-item prop="destination" label="送往地区">
                                <el-input
                                    data-index
                                    @focus="setFocus(4)"
                                    @keydown.enter.native="nextFocus"
                                    v-model="addOrEditForm.destination">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="备注" class="full-remark">
                                <el-input
                                    data-index
                                    @focus="setFocus(5)"
                                    @keydown.enter.native="nextFocus"
                                    type="textarea"
                                    :rows="2"
                                    v-model="addOrEditForm.remark">
                                </el-input>
                            </el-form-item>-->
                            <!--<div class="inline-form-title">运输信息</div>
                            <el-form-item label="货车车牌">
                                <el-input
                                    data-index
                                    @focus="setFocus(5)"
                                    @keydown.enter.native="nextFocus"
                                    v-model="addOrEditForm.truckNo">
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="destination" label="送往地区">
                                <el-input
                                    data-index
                                    @focus="setFocus(6)"
                                    @keydown.enter.native="nextFocus"
                                    v-model="addOrEditForm.destination">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="货车司机">
                                <el-input
                                    data-index
                                    @focus="setFocus(7)"
                                    @keydown.enter.native="nextFocus"
                                    v-model="addOrEditForm.driver">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="联系电话">
                                <el-input
                                    data-index
                                    @focus="setFocus(8)"
                                    @keydown.enter.native="nextFocus"
                                    v-model="addOrEditForm.linkPhoto">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="驾驶证号">
                                <el-input
                                    data-index
                                    @focus="setFocus(9)"
                                    @keydown.enter.native="nextFocus"
                                    v-model="addOrEditForm.drivingLicence">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="货期可载重(T)">
                                <el-input
                                    data-index
                                    @focus="setFocus(10)"
                                    @keydown.enter.native="nextFocus"
                                    v-model="addOrEditForm.loadWght">
                                </el-input>
                            </el-form-item>-->
                        </el-form>
                    </template>
                </CommonAdd>
            </transition>
            <!--获取公共数据-->
            <CommonData :valueObj="valueObj" ref="commondata"></CommonData>
        </div>
        <!--详情表增改弹框-->
        <el-dialog
            :close-on-click-modal="false"
            class="dialogDiv dialogDivII common-dialog"
            :show-close="false"
            :top="dialog_top"
            size="large"
            :visible.sync="tabTableVisible"
            @close="">
            <div class="slideContent">
                <div class="leftDiv common-left-offset common-dialog-btn">
                    <el-button class="icon-close icon-dialogII" @click="closeDialog"></el-button>
                    <el-button class="icon-confirm icon-dialogI" @click="confirmDialog"></el-button>
                </div>
                <div class="slideTop" v-drag1>{{tabTableTitle}}</div>
                <div class="slideMid">
                    <div class="child-table-search">
                        <div class="child-table-form inline-form-add">
                            <el-form :model="searchChildForm" :inline="true" label-width="100px" @submit.native.prevent @keyup.enter.native="searchChildTable">
                                <el-form-item label="项目号">
                                    <el-input v-model="searchChildForm.itemNo"></el-input>
                                </el-form-item>
                                <el-form-item label="型号">
                                    <el-input v-model="searchChildForm.matCode"></el-input>
                                </el-form-item>
                                <el-form-item label="订单号">
                                    <el-input v-model="searchChildForm.docCode"></el-input>
                                </el-form-item>
                                <el-form-item label="客户代码">
                                    <el-input v-model="searchChildForm.clientCode"></el-input>
                                </el-form-item>
                                <el-form-item label="颜色">
                                    <el-input v-model="searchChildForm.cx1"></el-input>
                                </el-form-item>
                                <el-form-item label="工程名称">
                                    <el-select
                                        clearable
                                        filterable
                                        remote
                                        :remote-method="getProjectList"
                                        v-model.trim="searchChildForm.projectName"
                                        style="width: 100%">
                                        <el-option
                                            v-for="(item,index) in projectList"
                                            :key="index"
                                            :label="item.projectName"
                                            :value="item.projectName">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label=" ">
                                    <el-button class="btn-cyan" @click="searchChildTable">查询</el-button>
                                    <el-button @click="resetChildTable">重置</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="child-table-btn">
                            <!--<el-button class="btn-cyan add-btn" @click="searchChildTable">查询</el-button>-->
                            <!--<el-button @click="resetChildTable">重置</el-button>-->
                            <!--<el-button v-show="!isMoreChildSearch" @click="isMoreChildSearch = true">更多查询</el-button>-->
                            <!--<el-button v-show="isMoreChildSearch" @click="isMoreChildSearch = false">收起</el-button>-->
                        </div>
                    </div>
                    <div class="child-table-wrap">
                        <div class="child-table-item-count">
                            <div>
                                <span>仓库名称:</span>
                                <span>{{storageName}}</span>
                            </div>
                            <div>
                                <span>可载重:</span>
                                <span>{{canLoadWeight?parseFloat(canLoadWeight).toFixed(3):""}}</span>
                            </div>
                            <div>
                                <span>已选装车理重:</span>
                                <span>{{chooseLoadWeight?parseFloat(chooseLoadWeight).toFixed(3):""}}</span>
                            </div>
                            <div>
                                <span>可装车理重:</span>
                                <span>{{canLoadWeight?parseFloat(canLoadWeight).toFixed(3):""-chooseLoadWeight?parseFloat(chooseLoadWeight).toFixed(3):""}}</span>
                            </div>
                            <div>
                                <span>已选记录数: {{childTableDataII.length || 0}}</span>
                            </div>
                            <div><span>单位:吨</span></div>
                        </div>
                        <el-tabs v-model="activeTab">
                            <el-tab-pane label="库存列表" name="first">
                                <CommonTable
                                    ref="choosedChildTableI"
                                    :isCenter="true"
                                    :isMulTable="true"
                                    :isMulSelect="true"
                                    @pureClickRow="pureClickRowI"
                                    :isPureClickRow="isPureClickRow"
                                    :otherVariable="otherVariable"
                                    :formTableData="childTableDataI"
                                    :formPropTable="childTablePropI"
                                    :tableHeight="childTableHeightI"
                                    @handleSelectionChange="chooseAddI"
                                >
                                </CommonTable>
                                <div class="child-pagination">
                                    <el-button class="btn-cyan add-btn" @click="mulChooseChildRowsI">添加</el-button>
                                    <el-pagination
                                        @size-change="handleChildSizeI"
                                        @current-change="handleChildCurrentI"
                                        :pager-count="5"
                                        :current-page="childPageI"
                                        :page-size="childSizeI"
                                        layout="total, sizes, prev, pager, next"
                                        :total="childTotalI">
                                    </el-pagination>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="料框列表" name="second">
                                <CommonTable
                                    ref="choosedChildTable"
                                    :isCenter="true"
                                    :isMulTable="true"
                                    :isMulSelect="true"
                                    @pureClickRow="pureClickRow"
                                    :isPureClickRow="isPureClickRow"
                                    :otherVariable="otherVariable"
                                    :formTableData="childTableData"
                                    :formPropTable="childTableProp"
                                    :tableHeight="childTableHeight"
                                    @handleSelectionChange="chooseAdd"
                                >
                                </CommonTable>
                                <div class="child-pagination">
                                    <el-button class="btn-cyan add-btn" @click="mulChooseChildRows">添加</el-button>
                                    <el-pagination
                                        @size-change="handleChildSize"
                                        @current-change="handleChildCurrent"
                                        :pager-count="5"
                                        :current-page="childPage"
                                        :page-size="childSize"
                                        layout="total, sizes, prev, pager, next"
                                        :total="childTotal">
                                    </el-pagination>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="已选数据" name="third">
                                <CommonTable
                                    ref="chooseChildTable"
                                    :isCenter="true"
                                    :isMulTable=true
                                    :isMulSelect="true"
                                    mainKey="variantId"
                                    @changeCell="changeCell"
                                    @pureClickRow="pureClickRowII"
                                    :isPureClickRow="isPureClickRow"
                                    :otherVariable="otherVariable"
                                    :formTableData="childTableDataII"
                                    :formPropTable="childTablePropII"
                                    :tableHeight="childTableHeightII"
                                    @handleSelectionChange="chooseDelete"
                                >
                                </CommonTable>
                                <div class="child-pagination">
                                    <el-button class="btn-cyan add-btn" @click="mulDeleteChildRows">撤回</el-button>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import CommonMixins from '$src/components/CommonMixins'
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    import CommonDetailX from '$src/components/CommonDetailX'
    import CommonAdd from '$src/components/CommonAdd'
    import CommonData from '$src/components/CommonData'
    import SelectEnter from '$src/components/SelectEnter'
    export default {
        mixins: [CommonMixins],
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetailX,
            CommonAdd,
            CommonData,
            SelectEnter,
        },
        data() {
            return {
                tableHeight: this.$store.state.screenHei*0.70,
                mainHeight: 716,
                activeTab: 'first',
                isBanOperate: false,
                operateType: 'add',
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                isResize: true,
                //键盘操作
                currentIndex: 0,
                enterTimes: 1,
                isBanNextFocus: false,
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    detailTitle: '编辑装车单',
                    addTitle: '新建装车单',
                    popupTitle: '',
                    isInlineForm: true,
                    isEdit: false,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    loading: false,
                    isReadTable: true,
                    $isCustom: true
                },
                mainRules: {
                    docDate: [
                        { required: true, message: '请选择单据日期', trigger: 'blur' }
                    ],
                    flowOrderId: [
                        { required: true, message: '请选择单号', trigger: 'blur' }
                    ],
                    /*docType: [
                        { required: true, message: '请选择单据类型', trigger: 'blur' }
                    ],
                    destination: [
                        { required: true, message: '请填写送往地区', trigger: 'blur' }
                    ],
                    projectName: [
                        { required: true, message: '请选择工程', trigger: 'blur' }
                    ]*/
                },
                tempWidth: null,
                tableData: [],
                //搜索映射表
                searchProp: [
                    {
                        name:'装车单',
                        prop:'refDocCode',
                        type:'date',
                        isMainSearch:true,
                        isMain:false,
                        placeholder: '请输入装车单号'
                    },
                    {
                        name:'下单日期',
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
                    }
                ],
                //详情映射列表
                formProp: [
                    {name:'装车单号',prop:'refDocCode',type:'outter'},
                    {name:'装车日期',prop:'docDate',type:'outter'},
                    {name:'单据状态',prop:'docStatusName',type:'outter'},
                    //{name:'送货地区',prop:'destination',type:'inner'},
                    //{name:'提货方式',prop:'loaderMethodName',type:'inner'},
                    //{name:'理论载重(T)',prop:'loadWght',type:'inner'},
                    //{name:'备注',prop:'remark',type:'inner',isLong:true}
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
                        name1:'装车单号/',
                        prop1:'refDocCode',
                        name2:'状态',
                        prop2:'docStatusName',
                        type:'mixin',
                        width: '110'
                    },
                    {
                        name1:'工程号/',
                        prop1:'projectCode',
                        name2:'装车日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '140'
                    },
                    {
                        name1:'流程单号/',
                        prop1:'docCode',
                        name2:'提货方式',
                        prop2:'loaderMethodName',
                        type:'mixin',
                    }
                ],
                searchForm: {},
                addOrEditForm: {},
                addForm: {},
                detailForm: {},
                copyForm: {},
                tempForm: {},
                submitRow: {},
                detailId: null,
                docCode: null,
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //详情表弹框
                dialog_top: "80px",
                tabTableVisible: false,
                tabTableTitle: '装车列表',
                searchChildForm: {},
                //详情子表格映射表
                childTableProp: [
                    {prop:'itemNo', name:'项目号',type:'itemNo',width:130},
                    {prop:'matCode', name:'型材型号',type:'normal',width:160},
                    {prop:'cx1Name', name:'颜色名称',type:'normal',width:160},
                    {prop:'cx2Name',name:'材质',type:'normal'},
                    {prop:'cx4Name',name:'长度',type:'normal',align:'right',isShort:true},
                    {prop:'cx3Name',name:'膜厚',type:'normal',align:'right',isShort:true},
                    {prop:'stockDigit',name:'库存数量',type:'normal',align:'right',isCellEdit:false,isShort:true},
                    {prop:'stockTheroyWght',name:'理重',type:'keepNum',rule:'keepLength',align:'right',isShort:true},
                    {prop:'boxCode',name:'料框',type:'normal'},
                    {
                        prop:'', name:'已发货',
                        children:[
                            {prop:'deliveryDigit',name:'数量',type:'normal',align:'right',rule:'limitLength',isShort:true},
                            {prop:'deliveryTheroyWght',name:'重量',type:'normal',align:'right',rule:'limitLength',isShort:true},
                        ]
                    },
                    {
                        prop:'', name:'欠发货',
                        children:[
                            {prop:'lackDigit',name:'数量',type:'normal',align:'right',rule:'limitLength',isShort:true},
                            {prop:'lackTheroyWght',name:'重量',type:'normal',align:'right',rule:'limitLength',isShort:true},
                        ]
                    },
                    {prop:'projectName',name:'工程',type:'normal'},
                ],
                childTablePropI: [
                    {prop:'itemNo', name:'项目号',type:'normal',width:130},
                    {prop:'matCode',name:'型材型号',type:'normal',width:160},
                    {prop:'cx1Name',name:'颜色名称',type:'normal',width:160},
                    {prop:'cx2Name',name:'材质',type:'normal'},
                    {prop:'cx4Name',name:'长度',type:'normal',align:'right'},
                    {prop:'cx3Name',name:'膜厚',type:'normal',align:'right'},
                    {prop:'stockDigit',name:'库存数量',type:'normal',isCellEdit:false,align:'right'},
                    {prop:'stockTheroyWght',name:'理重',type:'keepNum',align:'right'},
                    {
                        prop:'', name:'已发货',
                        children:[
                            {prop:'deliveryDigit',name:'数量',type:'normal',rule:'limitLength',align:'right'},
                            {prop:'deliveryTheroyWght',name:'重量',type:'normal',rule:'limitLength',align:'right'},
                        ]
                    },
                    {
                        prop:'', name:'欠发货',
                        children:[
                            {prop:'lackDigit',name:'数量',type:'normal',rule:'limitLength',align:'right'},
                            {prop:'lackTheroyWght',name:'重量',type:'normal',rule:'limitLength',align:'right'},
                        ]
                    },
                    {prop:'projectName',name:'工程',type:'normal'},
                ],
                childTablePropII: [
                    {prop:'itemNo', name:'项目号',type:'normal',width:130},
                    {prop:'matCode',name:'型材型号',type:'normal',width:160},
                    {prop:'cx1Name',name:'颜色名称',type:'normal',width:160},
                    {prop:'cx2Name',name:'材质',type:'normal'},
                    {prop:'cx4Name',name:'长度',type:'normal',align:'right'},
                    {prop:'cx3Name',name:'膜厚',type:'normal',align:'right'},
                    {prop:'stockDigit',name:'库存数量',type:'normal',isCellEdit:false,align:'right'},
                    {prop:'digit',name:'装车数',type:'normal',align:'right',isCellEdit:true,isShort:true},
                    {prop:'stockTheroyWght',name:'理重',type:'normal',align:'right'},
                    {prop:'projectName',name:'工程',type:'normal'},
                ],
                childTableHeight: 350,
                childTableHeightI: 350,
                childTableData: [],
                childTableDataI: [],
                childTableDataII: [],
                childTableHeightII: 350,
                isPureClickRow: true,
                changeIndex: 0,
                changeChildIndex: 0,
                childPage: 1,
                childSize: 100,
                childTotal: 0,
                childPageI: 1,
                childSizeI: 100,
                childTotalI: 0,
                isMoreChildSearch: false,
                storageName: '',
                canLoadWeight: 0,
                chooseLoadWeight: 0,
                chooseAddList: [],
                chooseAddListI: [],
                chooseDeleteList: [],
                //详情表格内容
                tabLeft: '100px',
                activeName: 'first',
                childDetailRow: {},
                editIndex: 0,
                //装车明细数据
                tabDataI: [],
                copyDataI: [],
                loadingI: false,
                isShowNotAllowed: false,
                //装车明细映射表
                tabPropI: [
                    {prop:'docItem', name:'序号',type:'normal',isShort: true,width:'40',align:'center'},
                    {prop:'itemNo', name:'项目号',type:'normal',isShort: true,width:'130'},
                    {prop:'matCode', name:'型材型号',type:'normal'},
                    {prop:'cx1Name', name:'颜色名称',type:'normal'},
                    {prop:'cx2Name',name:'材质',type:'normal'},
                    {prop:'cx4Name',name:'长度',type:'normal',isShort: true,unit:' m',align:'right'},
                    {prop:'cx3Name',name:'膜厚',type:'normal',isShort: true,unit:'',align:'right'},
                    {prop:'digit',name:'装车数',type:'normal',isCellEdit: true,isShort: true,align:'right'},
                    {prop:'meterWght',name:'米重',type:'normal',isShort: true,rule:'limitLength',unit:' kg/m',align:'right'},
                    {prop:'unitWght',name:'支重',type:'normal',isShort: true,rule:'limitLength',unit:' kg/pcs',align:'right'},
                    {prop:'theoryWght',name:'理重',type:'normal',isShort: true,rule:'limitLength',unit:' kg',align:'right'},
                    {prop:'remark',name:'备注',type:'normal',width:140}
                ],
                //型号
                matCode: null,
                matCodeList: [],
                matCodeTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //颜色
                colorCode: null,
                colorCodeList: [],
                colorCodeTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //单据类型
                orderTypeList: [],
                //货期等级
                deliveryLevelList: [],
                //提货方式
                deliveryMethodList: [],
                //品牌列表
                brandList: [],
                //工程列表
                projectList: [],
                //订单列表
                docCodeList: [],
                searchDocCode: null,
                pageIndex: 1,
                selectLoading: true,
                valueObj: {
                    //工程列表
                    projectName: null,
                    projectList: [],
                    projectTHs: [
                        {label:'代码',prop:'projectCode'},
                        {label:'名称',prop:'projectName'}
                    ],
                    //合同编号
                    contractCode: null,
                    contractList: [],
                    contractTHs: [
                        {label:'代码',prop:'fcode'},
                        {label:'名称',prop:'fname'}
                    ],
                }
            }
        },
        watch: {
            'isShowStatus.isPopUp':{
                handler(val) {
                    this.isShowNotAllowed = val;
                }
            },
            'currentIndex':{
                handler(val) {
                    this.enterTimes = 1;
                }
            },
            'isBanNextFocus':{
                handler(val) {
                    if(val) {this.enterTimes = 1;}
                }
            },
            deep: true
        },
        mounted() {
            this.getData();
            this.getBrandList();
            this.getOrderType();
            this.getClientProject('',true);
            this.getDeliveryLevel();
            this.getDeliveryMethod();
            // 操作/布局相关
            this.listenScroll();
            this.listenResize();
            this.changeSize();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                if(this.searchForm.refDocCode) {
                    this.searchForm = {refDocCode:this.searchForm.refDocCode}
                }else {
                    this.searchForm.refDocCode = null;
                }
                this.tableData = [];
                this.fetch(`/oms/sls/ClientSelfHelpOrder/getClientLoaderMaster?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            if(isFirst) {
                                this.$nextTick(() => {
                                    this.$refs.commontable.renderRow(this.tableData[0].fid);
                                })
                            }
                        }else {
                            this.detailId = null;
                            this.docCode = null;
                            this.tabDataI = [];
                            this.detailForm = {};
                            this.copyForm = {};
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },
            //刷新
            handleRefresh() {
                this.searchForm = {};
                this.getData();
                this.tabDataI = [];
                setTimeout(() => {
                    this.$refs['childTable'].initStatus();
                },200)
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //更改后的刷新
            changeRefresh() {
                this.getData(false);
                this.otherVariable.isChildEdit = false;
            },
            //清空选择组件的数据
            clearSelect() {
                //this.$refs.projectSelect.inputValueData = '';
            },
            //禁止点击表格提醒
            handleNotAllowed() {
                if(this.isShowStatus.isPopUp) {
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
            //点击主表行
            handleDetail(row) {
                this.loadingI = true;
                if(row.docStatus >= 50) {
                    this.isBanOperate = false;
                    // 装车数不可编辑
                    this.tabPropI[7].isCellEdit = false;
                }else {
                    this.isBanOperate = true;
                    // 装车数可编辑
                    this.tabPropI[7].isCellEdit = true;
                }
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.copyDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = row;
                this.copyForm = this.$lodash.cloneDeep(row);
                this.handleCancel(this.operateType);
                this.getChildTable(row.fid);
                this.detailId = row.fid;
                this.docCode = row.docCode;
            },
            //批量修改装车数
            handleMulEdit() {
                let tempList = [];
                this.tabDataI.forEach(item => {
                    tempList.push({
                        masterId: this.detailId,
                        variantId: item.variantId,
                        fid: item.fid,
                        digit: Number(item.digit)
                    })
                });
                this.fetch('/oms/sls/LoaderDoc/updateDetailList',tempList)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.getChildTable(this.detailId);
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            })
                        }
                    })
            },
            //主表添加行
            handleAdd() {
                this.docCodeList = [];
                this.searchDocCode = null;
                this.pageIndex = 1;
                this.selectLoading = true;
                this.operateType = 'add';
                this.addForm = {};
                this.addOrEditForm = {};
                this.clearSelect();
                this.$set(this.addOrEditForm,'docDate',new Date());
                this.isShowStatus.isPopUp = true;
                this.otherVariable.popupTitle = this.otherVariable.addTitle;
                this.otherVariable.isEdit = false;
            },
            //主表编辑行
            handleEdit() {
                this.operateType = 'edit';
                this.otherVariable.popupTitle = this.otherVariable.detailTitle;
                this.otherVariable.isEdit = true;
                this.addOrEditForm = this.detailForm;
                if(this.detailForm.fid) {
                    this.isShowStatus.isPopUp = true;
                    //工程
                    this.$set(this.addOrEditForm,'projectName',this.detailForm.projectName);
                    this.$set(this.valueObj,'projectName',this.detailForm.projectName);
                }else {
                    this.$message({
                        message: '请选择装车单',
                        type: 'warning'
                    })
                }
            },
            //主表保存行
            handleSave(type) {
                this.$refs.addOrEditForm.validate((valid) => {
                    if(valid) {
                        let tempObj;
                        let api;
                        if(type === 'add') {
                            api = '/oms/sls/ClientSelfHelpOrder/addClientLoaderMaster';
                        }else {
                            api = '/oms/sls/ClientSelfHelpOrder/updateClientLoaderMaster';
                        }
                        tempObj = this.addOrEditForm;
                        this.fetch(api,tempObj)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    this.isShowStatus.isPopUp = false;
                                    this.addForm = {};
                                    this.searchForm = {};
                                    this.detailId = result.data;
                                    this.getData();
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    });
                                }
                            })
                    }
                    else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            //主表取消操作
            handleCancel(type) {
                this.isShowStatus.isPopUp = false;
                if(type === 'add') {
                    this.addOrEditForm = {};
                }else {
                    this.detailForm = this.$lodash.cloneDeep(this.copyForm);
                    this.addOrEditForm = this.$lodash.cloneDeep(this.copyForm);
                }
                this.$refs.addOrEditForm.resetFields();
            },
            //主表确认
            handleConfirm() {
                if(this.detailForm.fid) {
                    this.$confirm('是否提交?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.tabDataI.forEach(item =>{
                            if(item.digit ==0 || item.digit ===null){
                                this.$message({
                                    message:'装车数数量不能为0',
                                    type:'warning'
                                })
                            }else{
                                this.getAjax(`/oms/sls/ClientSelfHelpOrder/confirmClientLoader?loaderFlowId=${this.detailForm.fid}`)
                                    .then(result => {
                                        if (result.status === 200) {
                                            this.$message({
                                                message: result.message,
                                                type: 'success'
                                            });
                                            this.changeRefresh();
                                            setTimeout(() => {
                                                this.$refs.commontable.renderRow(this.detailId);
                                            }, 500)
                                        }else {
                                            this.$message({
                                                message: this.returnErrorMsg(result.error),
                                                type: 'error'
                                            });
                                        }
                                    })

                            }
                        })
                    })

                }else {
                    this.$message({
                        message: '请选择装车单',
                        type: 'warning'
                    });
                }
            },
            //主表取消确认
            handleUnConfirm() {
                if(this.detailForm.fid) {
                    this.getAjax(`/oms/sls/ClientSelfHelpOrder/unConfirmClientLoader?clientLoaderMasterId=${this.detailForm.fid}`)
                        .then(result => {
                            if (result.status === 200) {
                                this.$message({
                                    message: result.message,
                                    type: 'success'
                                });
                                this.changeRefresh();
                                setTimeout(() => {
                                    this.$refs.commontable.renderRow(this.detailId);
                                }, 500)
                            }else {
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                });
                            }
                        })
                }else {
                    this.$message({
                        message: '请选择装车单',
                        type: 'warning'
                    })
                }
            },
            //主表删除行
            handleDelete() {
                if(this.detailForm.fid) {
                    if(confirm('确定删除？') === true) {
                        this.getAjax(`/oms/sls/ClientSelfHelpOrder/deleteClientLoaderMaster?loaderFlowId=${this.detailForm.fid}`)
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
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    });
                                }
                            })
                    }
                }else {
                    this.$message({
                        message: '请选择装车单',
                        type: 'warning'
                    });
                }
            },
            //获取从表
            getChildTable(masterId) {
                this.tabDataI = [];
                this.loadingI = true;
                this.isShowNotAllowed = true;
                this.getAjax(`/oms/sls/ClientSelfHelpOrder/getClientLoaderDetail?pageSize=1000&clientLoaderMasterId=${masterId}`)
                    .then(result => {
                        this.loadingI = false;
                        this.isShowNotAllowed = false;
                        if(result.data && result.data.list) {
                            this.tabDataI = result.data.list;
                            this.copyDataI = this.$lodash.cloneDeep(this.tabDataI);
                        }
                    })
                    .then(() => {
                        this.$refs['childTable'].initStatus();
                    })
            },
            //弹框-获取表格数据
            getChildTableDataI() {
                this.activeTab = 'first';
                this.childTableData = [];
                this.childTableDataI = [];
                this.childTableDataII = [];
                this.storageName = '';
                this.canLoadWeight = 0;
                this.chooseLoadWeight = 0;
                this.searchChildForm.orderId = this.detailForm.orderId;
                // 获取库存列表
                this.fetch(`/oms/sls/ClientSelfHelpOrder/getClientLoaderList?pageNo=${this.childPage}&pageSize=${this.childSize}`,this.searchChildForm)
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list) {
                            result.data.list.forEach(item => {
                                item.isBox = false
                            });
                            this.childTableDataI = result.data.list;
                            this.childTotalI = result.data.total;
                            //去除已存在的装车单明细
                            let idList = [];
                            this.tabDataI.forEach(item => {
                                idList.push(item.variantId)
                            });
                            idList.forEach(item => {
                                this.childTableDataI = this.childTableDataI.filter(v => v.variantId !== item);
                            });
                        }else {
                            this.childTableDataI = [];
                            this.childTotalI = 0;
                        }
                    }).then(() => {
                        this.$refs.choosedChildTableI.initStatus();
                        this.$refs.chooseChildTable.initStatus();
                    });
                // 获取料框列表
                this.fetch(`/oms/sls/ClientSelfHelpOrder/getClientLoaderList?pageNo=${this.childPage}&pageSize=${this.childSize}`,this.searchChildForm)
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list) {
                            result.data.list.forEach(item => {
                                item.isBox = true
                            });
                            this.childTableData = result.data.list;
                            this.childTotal = result.data.total;
                            //去除已存在的装车单明细
                            let idList = [];
                            this.tabDataI.forEach(item => {
                                idList.push(item.variantId)
                            });
                            idList.forEach(item => {
                                this.childTableData = this.childTableData.filter(v => v.variantId !== item);
                            });
                        }else {
                            this.childTableData = [];
                            this.childTotal = 0;
                        }
                    }).then(() => {
                    this.$refs.choosedChildTable.initStatus();
                    this.$refs.chooseChildTable.initStatus();
                })
            },
            //弹框-分页
            handleChildSize(val) {
                this.childSize = val;
                this.getChildTableDataI();
            },
            handleChildCurrent(val) {
                this.childPage = val;
                this.getChildTableDataI();
            },
            handleChildSizeI(val) {
                this.childSizeI = val;
                this.getChildTableDataI();
            },
            handleChildCurrentI(val) {
                this.childPageI = val;
                this.getChildTableDataI();
            },
            //弹框-查询
            searchChildTable() {
                this.getChildTableDataI();
            },
            //弹框-重置
            resetChildTable() {
                this.searchChildForm = {};
                this.getChildTableDataI();
            },
            //弹框-打开
            openDialog() {
                this.tabTableVisible = true;
                this.searchChildForm = {};
                this.getChildTableDataI();
                this.chooseAddList = [];
                this.chooseAddListI = [];
                this.chooseDeleteList = [];
            },
            //弹框-多选添加
            chooseAdd(rows) {
                this.chooseAddList = rows;
            },
            mulChooseChildRows() {
                this.activeTab = 'third';
                this.chooseLoadWeight = 0;
                this.childTableData = this.$lodash.difference(this.childTableData,this.chooseAddList);
                this.childTableDataII = [...this.chooseAddList,...this.childTableDataII];
                setTimeout(() => {
                    this.$refs['choosedChildTableI'].initStatus();
                    this.$refs['chooseChildTable'].initStatus();
                    this.getChooseLoadWeight();
                },200)
            },
            chooseAddI(rows) {
                this.chooseAddListI = rows;
            },
            mulChooseChildRowsI() {
                this.activeTab = 'third';
                this.chooseLoadWeight = 0;
                this.childTableDataI = this.$lodash.difference(this.childTableDataI,this.chooseAddListI);
                this.childTableDataII = [...this.chooseAddListI,...this.childTableDataII];
                setTimeout(() => {
                    this.$refs['choosedChildTableI'].initStatus();
                    this.$refs['chooseChildTable'].initStatus();
                    this.getChooseLoadWeight();
                },200)
            },
            //弹框-多选撤回
            chooseDelete(rows) {
                this.chooseDeleteList = rows;
            },
            mulDeleteChildRows() {
                //this.activeTab = 'first';
                this.chooseLoadWeight = 0;
                this.childTableDataII = this.$lodash.difference(this.childTableDataII,this.chooseDeleteList);
                let isBoxList = this.chooseDeleteList.filter(item => item.isBox === true);
                let isntBoxList = this.chooseDeleteList.filter(item => item.isBox === false);
                this.childTableData = [...isBoxList,...this.childTableData];
                this.childTableDataI = [...isntBoxList,...this.childTableDataI];
                setTimeout(() => {
                    this.$refs['choosedChildTableI'].initStatus();
                    this.$refs['chooseChildTable'].initStatus();
                    this.getChooseLoadWeight();
                },200)
            },
            //获取已选载重
            getChooseLoadWeight() {
                this.childTableDataII.forEach(item => {
                    this.chooseLoadWeight += item.stockTheroyWght;
                })
            },
            //获取表格I的行数据
            pureClickRow(row,index) {
                //单击选中
            },
            pureClickRowI(row,index) {
                //单击选中
            },
            //获取表格II的行数据
            pureClickRowII(row,index) {
                this.changeIndex = index;
            },
            //弹框-input
            changeCell(prop) {
                if(prop === 'stockDigit') {
                    let tempRow = this.childTableDataII[this.changeIndex];
                    this.childTableDataII[this.changeIndex].stockTheroyWght = tempRow.unitWght * tempRow.stockDigit;
                    this.chooseLoadWeight = 0;
                    this.getChooseLoadWeight();
                    setTimeout(() => {
                        this.$refs['chooseChildTable'].initStatus();
                    },200)
                }
            },
            //弹框-保存
            confirmDialog() {
                let chooseList = [];
                if(!this.childTableDataII.length) {
                    this.$message({
                        message: '已选数据为空,请选择明细并点击左下方的添加按钮进行添加',
                        type: 'warning'
                    })
                }else {
                    let isDigitZero = false;
                    this.childTableDataII.forEach(item => {
                        if(item.digit ==0 || item.digit === null){
                            chooseList =[];
                            isDigitZero = true;
                        }
                        let tempObj = {};
                        tempObj.masterId = this.detailForm.fid;
                        tempObj.matWarehouseId = item.matWarehouseId;
                        tempObj.docCode = this.detailForm.docCode;
                        tempObj.variantId = item.variantId;
                        tempObj.matCode = item.matCode;
                        tempObj.matName = item.matName;
                        tempObj.digit = item.digit;
                        tempObj.remark = item.remark;
                        tempObj.storageCode = item.storageCode;
                        tempObj.allocDigit = item.allocDigit;
                        tempObj.allocTheroyWght = item.allocTheroyWght;
                        chooseList.push(tempObj);
                    });
                    if(!isDigitZero) {
                        this.fetch('/oms/sls/ClientSelfHelpOrder/addClientLoaderDetail', chooseList)
                            .then(result => {
                                if (result.status === 200) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    this.getChildTable(this.detailId);
                                } else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    });
                                }
                                this.tabTableVisible = false;
                            })
                    }else{
                        chooseList = [];
                        this.$message({
                            message: '所选数据中的装车数量不能为0',
                            type: 'warning'
                        })
                    }
                }
            },
            //弹框-关闭
            closeDialog() {
                this.tabTableVisible = false;
            },
            //从表添加行
            handleAddChild() {
                this.canLoadWeight = 0;
                this.storageName = '';
                if(this.detailForm.fid) {
                    this.openDialog();
                    this.canLoadWeight = this.detailForm.loadWght;
                    this.storageName = this.detailForm.storageName;
                }else {
                    this.$message({
                        message: '请选择装车单',
                        type: 'warning'
                    })
                }
            },
            //从表删除行
            handleDeleteChild(row,index) {
                if(row.variantId) {
                    if(confirm('确定删除？') === true) {
                        this.getAjax(`/oms/sls/ClientSelfHelpOrder/deleteClientLoaderDetail?clientLoaderDetailId=${this.tabDataI[index].fid}`)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    this.tabDataI.splice(index,1);
                                }else {
                                    this.$message({
                                        message: '删除失败',
                                        type: 'error'
                                    });
                                }
                            });
                        this.otherVariable.isChildEdit = false;
                    }
                }else {
                    this.$message({
                        message: '请选择装车单',
                        type: 'warning'
                    })
                }
            },
            //从表点击行
            clickDetail(row) {
                if(this.isBanOperate) {
                    if(!this.otherVariable.isReadTable) {
                        this.otherVariable.isChildEdit = true;
                        this.tabDataI = this.giveState(this.tabDataI);
                        row.isEditState = true;
                        this.$nextTick(() => {
                            this.matCode = row.matCode;
                            this.colorCode = row.cx1;
                        })
                    }
                    this.childDetailRow = row || {};
                    this.editIndex = this.$lodash.findIndex(this.tabDataI, ['variantId', row.variantId]);
                    if(this.editIndex < 0) {
                        this.editIndex = 0;
                    }
                }else {
                    this.otherVariable.isChildEdit = false;
                }
            },

            //------------------- 下拉选择 START -------------------//

            //获取订单列表
            getDocCodeList(val) {
                this.docCodeList = [];
                this.searchDocCode = val;
                this.fetch('/oms/sls/SalesClientOrder/getOrderMaster?pageNo=1&pageSize=100',{refDocCode:val,defaultGEMasStatus:100})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.docCodeList = result.data.list;
                            this.selectLoading = false;
                        }
                    })
            },
            selectScroll(param) {
                if(param) {
                    ++this.pageIndex;
                    this.fetch(`/oms/sls/SalesClientOrder/getOrderMaster?pageNo=${this.pageIndex}&pageSize=10`,{refDocCode:this.searchDocCode})
                        .then(result => {
                            if(result.data && result.data.list && result.data.list.length) {
                                this.docCodeList.push(...result.data.list)
                            }
                        })
                }
            },

            //获取子型号列表
            getMatCodeList(val) {
                this.matCodeList = [];
                this.fetch('/oms/BasedataController/getAluModelByValue?pageSize=10000',{fcode:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.matCodeList = result.data.list;
                        }
                    })
            },
            //获取子型号
            setMatCode(item) {
                this.matCode = item.fcode;
                this.$set(this.tabDataI[this.editIndex],'matCode',item.fcode);
                this.$set(this.tabDataI[this.editIndex],'matName',item.fname);
            },
            //获取颜色列表
            getColorCodeList(val) {
                this.colorCodeList = [];
                this.fetch('/oms/BasedataController/getMatColor?pageSize=10',{fcode:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.colorCodeList = result.data.list;
                        }
                    })
            },
            //获取颜色
            setColorCode(item) {
                this.colorCode = item.fcode;
                this.$set(this.tabDataI[this.editIndex],'cx1',item.fcode);
                this.$set(this.tabDataI[this.editIndex],'cx1Name',item.fname);
            },

            //合同
            getContract(val) {
                this.$refs.commondata.getContract(val)
            },
            setContract(item) {
                this.$set(this.valueObj,'contractCode',item.contractCode);
                this.$set(this.addOrEditForm,'contractCode',item.contractCode);
            },
            setContractVal(val) {
                this.$set(this.valueObj,'contractCode',val);
                this.$set(this.addOrEditForm,'contractCode',val);
            },

            //工程列表
            getProjectList(val) {
                this.projectList = [];
                this.getAjax('/oms/sls/SalesClientOrder/getProject?pageSize=100&projectName='+val)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.projectList = result.data.list;
                        }
                    })
            },
            getClientProject(val) {
                this.$refs.commondata.getClientProject(val);
            },
            setProject(item) {
                this.$set(this.valueObj,'projectName',item.projectName);
                this.$set(this.addOrEditForm,'projectName',item.projectName);
                this.$set(this.addOrEditForm,'projectCode',item.projectCode);
            },
            setProjectVal(val) {
                this.$set(this.valueObj,'projectName',val);
                this.$set(this.addOrEditForm,'projectName',val);
            },

            //提货方式
            getDeliveryMethod() {
                this.deliveryMethodList = [];
                    this.fetch('/oms/BasedataController/getDeliveryMethod?pageSize=10',{})
                        .then(result => {
                            if(result.data && result.data.list) {
                                this.deliveryMethodList = result.data.list;
                            }
                        })
            },
            setDeliveryMethod(val) {
                let item;
                item = this.deliveryMethodList.find(item => item.fname === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.loaderMethodCode = item.fcode
                }
            },

            //品牌
            getBrandList() {
                this.brandList = [];
                this.fetch('/oms/mdm/branControl/selectClientBran?pageSize=10',{})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.brandList = result.data.list;
                        }
                    })
            },
            setBrand(val) {
                let item;
                item = this.brandList.find(item => item.fname === val);
                if(JSON.stringify(item) !== {} && JSON.stringify(item)) {
                    this.addOrEditForm.brandId = item.fname
                }
            },

            //获取单据类型
            getOrderType() {
                this.orderTypeList = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30114')
                    .then(result => {
                        if(result.data) {
                            this.orderTypeList = result.data;
                        }else {
                            this.orderTypeList = [];
                        }
                    })
            },

            //货期等级
            getDeliveryLevel() {
                this.deliveryLevelList = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30116')
                    .then(result => {
                        if(result.data) {
                            result.data.forEach(item => {
                                item.dictvalue = Number(item.dictvalue);
                            });
                            this.deliveryLevelList = result.data;
                        }
                    })
            },
            setDelivery(val) {
                let item;
                item = this.deliveryLevelList.find(item => item.dictvalue === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.deliveryLevelName = item.dicttext
                }
            },
            //------------------- 下拉选择 END -------------------//
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
