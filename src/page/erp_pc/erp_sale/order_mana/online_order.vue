<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap" @click="handleNotAllowed" v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleAdd">新建</el-button>
                <el-button @click="handleRefresh">刷新</el-button>
                <el-button @click="handleReset">重置</el-button>
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
                @handleEdit="handleEdit"
                @handleDelete="handleDelete"
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
                    <div v-if="isBanOperate" class="xs-icon-confirm" @click="handleConfirm">提交</div>
                    <!--<div v-if="detailId&&!isBanOperate" class="xs-icon-confirm" @click="handleCanCelConfirm">撤回</div>-->
                    <i v-if="isBanOperate" class="sm-icon-edit el-icon-edit" title="编辑" @click="handleEdit"></i>
                    <i v-if="isBanOperate" class="icon-delete" title="删除" @click="handleDelete"></i>
                    <i v-if="isBanOperate" class="icon-copy" title="复制新增" @click="copyAdd"></i>
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
                    <div class="remark-wrap">
                        <div>供应商备注：</div>
                        <div class="headspan scrollBar" :title="detailForm.supplyCompanyRemark">{{ detailForm.supplyCompanyRemark }}</div>
                    </div>
                </template>
                <!--详情内容-->
                <template slot="common-content">
                    <!--按钮区域-->
                    <div class="tab-btn-wrap" :style="{left: tabLeft}">
                        <el-button class="btn-cyan search-btn" @click="handleAddChild" v-if="isBanOperate&&!otherVariable.isChildEdit">增行</el-button>
                        <el-button @click="handleCancelChild" v-if="otherVariable.isChildEdit">取消</el-button>
                        <el-button class="btn-cyan search-btn" @click="handleSaveChild(0,'first')" v-if="otherVariable.isChildEdit">保存</el-button>
                        <el-button class="btn-cyan add-btn" @click="copyAddChild" v-if="otherVariable.isChildEdit&&isShowCopyBtn">复制新增明细</el-button>
                        <el-button class="btn-cyan add-btn" @click="UpdataorderList" v-if="otherVariable.isChildEdit&&isShowCopyBtn">批量修改</el-button>
                    </div>
                    <!--tab区域-->
                    <el-tabs v-model="activeName" class="common-content-tab order_style">
                        <el-tab-pane label="订单明细" name="first">
                            <!--<div @click="isSaveChildRow" v-if="otherVariable.isChildEdit&&!$store.state.isShowDetailBan" class="not-allowed-tableI" :style="{height:notAllowUpHeight}"></div>-->
                            <!--<div @click="isSaveChildRow" v-if="otherVariable.isChildEdit&&!$store.state.isShowDetailBan" class="not-allowed-tableII" :style="{height:notAllowDownHeight}"></div>-->
                            <el-table
                                v-if="isResize"
                                ref="childTable"
                                tooltip-effect="dark"
                                v-loading="loadingI"
                                :data="tabDataI"
                                @row-click="clickDetail"
                                border
                                show-summary
                                :summary-method="getSummaries"
                                :height="tableHeight"
                                highlight-current-row
                            >
                                <el-table-column label="序号"  align="right" width="50">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="项目号"  align="left" width="130" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.itemNo }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="型材型号" align="left" width="110px" label-class-name="table-valid-head" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.matCode }}</span>
                                        <SelectEnter
                                            v-if="scope.row.isEditState"
                                            @goDown="goDown(0)"
                                            @goUp="goUp(0)"
                                            data-index
                                            @inputFocus="setFocus(0)"
                                            @selected="nextFocus"
                                            :inputWidth="100+'px'"
                                            :inputValue="matCode"
                                            :selectTHs="matCodeTHs"
                                            :selectTds="matCodeList"
                                            @getList="getMatCodeList"
                                            @setObj="setMatCode"
                                            selectLabel="fcode"
                                            selectValue="fcode"
                                            selectKey="fid"
                                            :disabled="Boolean(scope.row.variantId)&&Boolean(scope.row.parentVariantId)">
                                        </SelectEnter>
                                    </template>
                                </el-table-column>
                                <el-table-column label="颜色名称" align="left" width="120px" label-class-name="table-valid-head" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.cx1Name }}</span>
                                        <SelectEnter
                                            v-if="scope.row.isEditState"
                                            @goDown="goDown(1)"
                                            @goUp="goUp(1)"
                                            data-index
                                            @inputFocus="setFocus(1)"
                                            @selected="nextFocus"
                                            :inputWidth="100+'px'"
                                            :inputValue="colorName"
                                            :selectTHs="colorCodeTHs"
                                            :selectTds="colorCodeList"
                                            @getList="getColorCodeList"
                                            @setObj="setColorCode"
                                            selectLabel="fname"
                                            selectValue="fname"
                                            selectKey="fid">
                                        </SelectEnter>
                                    </template>
                                </el-table-column>
                                <el-table-column label="材质" align="left" width="80px" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.cx2Name }}</span>
                                        <SelectEnter
                                            v-if="scope.row.isEditState"
                                            @goDown="goDown(2)"
                                            @goUp="goUp(2)"
                                            data-index
                                            @inputFocus="setFocus(2)"
                                            @selected="nextFocus"
                                            :inputWidth="60+'px'"
                                            :inputValue="matAlloy"
                                            :selectTHs="matAlloyTHs"
                                            :selectTds="matAlloyList"
                                            @getList="getMatAlloy"
                                            @setObj="setMatAlloy"
                                            selectLabel="fcode"
                                            selectValue="fcode"
                                            selectKey="fid">
                                        </SelectEnter>
                                    </template>
                                </el-table-column>
                                <el-table-column label="长度 m" align="right" width="80" label-class-name="table-valid-head">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.cx4Name }}</span>
                                        <el-input
                                            @keydown.native.down="goDown(3)"
                                            @keydown.native.up="goUp(3)"
                                            data-index
                                            @keydown.enter.native="nextFocus($event,true,scope.row.cx4Name,'长度')"
                                            @focus="setFocus(3)"
                                            v-if="scope.row.isEditState"
                                            v-model.trim="scope.row.cx4Name"
                                            :disabled="Boolean(scope.row.variantId)&&Boolean(scope.row.parentVariantId)">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="膜厚" align="right" width="80px">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.cx3Name }}</span>
                                        <SelectEnter
                                            v-if="scope.row.isEditState"
                                            @goDown="goDown(4)"
                                            @goUp="goUp(4)"
                                            data-index
                                            @inputFocus="setFocus(4)"
                                            @selected="nextFocus"
                                            :inputWidth="60+'px'"
                                            :inputValue="matThick"
                                            :selectTHs="matThickTHs"
                                            :selectTds="matThickList"
                                            @getList="getMatThick"
                                            @setObj="setMatThick"
                                            selectLabel="fname"
                                            selectValue="fcode"
                                            selectKey="fid">
                                        </SelectEnter>
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单数" prop="digit" align="right" label-class-name="table-valid-head">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.digit }}</span>
                                        <el-input
                                            @keydown.native.down="goDown(5)"
                                            @keydown.native.up="goUp(5)"
                                            data-index
                                            @keydown.enter.native="nextFocus($event,true,scope.row.digit,'订单数')"
                                            @focus="setFocus(5)"
                                            v-if="scope.row.isEditState"
                                            v-model.trim="scope.row.digit"
                                            :disabled="Boolean(scope.row.variantId)&&Boolean(scope.row.parentVariantId)">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="米重 kg/m" align="right">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.meterWght ? parseFloat(scope.row.meterWght).toFixed(3) : '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="支重 kg/pcs" align="right">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.unitWght ? parseFloat(scope.row.unitWght).toFixed(3) : '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="理重 kg" align="right"  prop="theoryWght">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.theoryWght ? parseFloat(scope.row.theoryWght).toFixed(3) : '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="禁喷类型">
                                    <el-table-column label="默认">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.banSprayType }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="要求" width="120px" align="left">
                                        <template slot-scope="scope">
                                            <span v-if="!scope.row.isEditState">{{ scope.row.usrTxt2Name }}</span>
                                            <el-select
                                                clearable
                                                v-if="scope.row.isEditState"
                                                v-model="scope.row.usrTxt2Name"
                                                style="width:100%;background:#fff;border-radius: 5px;"
                                                data-index
                                                @focus="setFocus(6)"
                                                @visible-change="banNextFocus"
                                                @keydown.enter.native="selectEnterEvent"
                                            >
                                                <el-option
                                                    v-for="(item,index) in usrTxt2List"
                                                    :key="index"
                                                    :label="item.dictText"
                                                    :value="item.dictText">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="撕筋">
                                    <el-table-column label="默认" width="55" align="center">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.isTear === '1' ? '✔' : '×' }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="要求" width="55" align="center">
                                        <template slot-scope="scope">
                                            <span v-if="!scope.row.isEditState">{{ scope.row.usrTxt3 === '1' ? '✔' : '×' }}</span>
                                            <el-select
                                                clearable
                                                v-if="scope.row.isEditState"
                                                v-model="scope.row.usrTxt3"
                                                @change="setUsrTxt3Name"
                                                style="width:100%;background:#fff;border-radius: 5px;"
                                                data-index
                                                @focus="setFocus(7)"
                                                @visible-change="banNextFocus"
                                                @keydown.enter.native="selectEnterEvent"
                                            >
                                                <el-option
                                                    v-for="(item,index) in getStaticList('isTrueString')"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="备注" width="200" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.remark }}</span>
                                        <el-input
                                            style="width:190px"
                                            @keydown.native.down="goDown(7)"
                                            @keydown.native.up="goUp(7)"
                                            data-index
                                            @keydown.native="handleLastCell($event)"
                                            v-if="scope.row.isEditState"
                                            v-model.trim="scope.row.remark">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="isBanOperate" label="操作" align="center" width="55" fixed="right">
                                    <template slot-scope="scope">
                                        <i v-if="!(Boolean(scope.row.variantId)&&Boolean(scope.row.parentVariantId))" class="el-icon-delete expand-delete" title="删除" @click.stop="handleDeleteChild(scope.row,scope.$index)"></i>
                                    </template>
                                </el-table-column>
                            </el-table>
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
                    headHeight="60px"
                >
                    <template slot="head-form-title">
                        <div class="head-form-title">
                            <span>{{otherVariable.popupTitle}}</span>
                        </div>
                    </template>
                    <template slot="custom-add-form">
                        <el-form ref="addOrEditForm" :rules="mainRules" :model="addOrEditForm" :inline="otherVariable.isInlineForm" label-width="80px">
                            <el-form-item label="工程项目" prop="projectName">
                                <el-input v-model="addOrEditForm.projectName"></el-input>
                            </el-form-item>
                            <el-form-item label="单据类型" prop="docType">
                                <el-select
                                    class="lg-size"
                                    clearable
                                    v-model="addOrEditForm.docType"
                                >
                                    <el-option
                                        v-for="(item,index) in orderTypeList"
                                        :key="index"
                                        :label="item.dictText"
                                        :value="item.dictText">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="交货天数" prop="deliveryDays">
                                <el-input v-Int class="sm-size" v-model="addOrEditForm.deliveryDays"></el-input>
                            </el-form-item>
                            <el-form-item label="货期等级" prop="deliveryLevel">
                                <el-select
                                    class="lg-size"
                                    clearable
                                    v-model="addOrEditForm.deliveryLevel"
                                    @change="setDelivery"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="(item,index) in deliveryLevelList"
                                        :key="index"
                                        :label="item.dictText"
                                        :value="item.dictValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="客户" prop="clientCode">
                                <SelectEnter
                                    ref="clientSelect"
                                    :inputValue="valueObj.clientCode"
                                    :selectTHs="valueObj.clientTHs"
                                    :selectTds="valueObj.orgClientList"
                                    placeholder="请输入客户代码"
                                    @getList="getOrgClient"
                                    @setObj="setClient"
                                    selectLabel="fcode"
                                    selectValue="fcode"
                                    selectKey="fid">
                                </SelectEnter>
                            </el-form-item>
                        </el-form>
                        <div class="detail-edit-wrap">
                            <div class="detail-edit-left">
                                <div class="detail-item">
                                    <span class="title">&nbsp;&nbsp;品牌</span>
                                    <el-radio-group v-model="chooseBrand" @change="setBrand">
                                        <el-radio-button v-for="(item,index) in brandList" :label="item.fname" :key="index">{{item.fname}}</el-radio-button>
                                    </el-radio-group>
                                </div>
                                <div class="detail-item">
                                    <span class="title">&nbsp;&nbsp;系列</span>
                                    <el-checkbox-group v-model="chooseSeries">
                                        <el-checkbox-button v-for="(item,index) in detailSeriesList" :label="item.fcode" :key="index">{{item.fcode}}</el-checkbox-button>
                                    </el-checkbox-group>
                                </div>
                                <div class="detail-item">
                                    <span class="title required">型号</span>
                                    <div>
                                        <SelectEnter
                                            ref="searchMatCode"
                                            :inputValue="searchMatCode"
                                            :selectTHs="matCodeTHs"
                                            :selectTds="matCodeList"
                                            @getList="getMatCodeList"
                                            @setObj="handleMatCode"
                                            selectLabel="fcode"
                                            selectValue="fcode"
                                            selectKey="fid">
                                        </SelectEnter>
                                        <el-checkbox-group v-model="chooseMatCode">
                                            <el-checkbox-button v-for="(item,index) in detailMatCodeList" :label="item.fcode" :key="index">{{item.fcode}}</el-checkbox-button>
                                        </el-checkbox-group>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <span class="title required">颜色</span>
                                    <div>
                                        <SelectEnter
                                            ref="searchColor"
                                            :inputValue="searchColor"
                                            :selectTHs="colorCodeTHs"
                                            :selectTds="colorCodeList"
                                            @getList="getColorCodeList"
                                            @setObj="handleColorCode"
                                            selectLabel="fname"
                                            selectValue="fname"
                                            selectKey="fid">
                                        </SelectEnter>
                                        <el-checkbox-group v-model="chooseColor">
                                            <el-checkbox-button v-for="(item,index) in detailColorList" :label="item.fname" :key="index">{{item.fname}}</el-checkbox-button>
                                        </el-checkbox-group>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <span class="title required">材质</span>
                                    <div>
                                        <SelectEnter
                                            ref="searchAlloy"
                                            :inputValue="searchAlloy"
                                            :selectTHs="matAlloyTHs"
                                            :selectTds="matAlloyList"
                                            @getList="getMatAlloy"
                                            @setObj="handleMatAlloy"
                                            selectLabel="fcode"
                                            selectValue="fcode"
                                            selectKey="fid">
                                        </SelectEnter>
                                        <el-checkbox-group v-model="chooseAlloy">
                                            <el-checkbox-button v-for="(item,index) in detailAlloyList" :label="item.fname" :key="index">{{item.fname}}</el-checkbox-button>
                                        </el-checkbox-group>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <span class="title required">喷码</span>
                                    <div>
                                        <SelectEnter
                                            ref="searchMark"
                                            :inputValue="searchMark"
                                            :selectTHs="markMethodTHs"
                                            :selectTds="markMethodList"
                                            @getList="getMarkMethod"
                                            @setObj="handleMarkMethod"
                                            selectLabel="fname"
                                            selectValue="fname"
                                            selectKey="fid">
                                        </SelectEnter>
                                        <el-checkbox-group v-model="chooseMark">
                                            <el-checkbox-button v-for="(item,index) in detailMarkList" :label="item.fname" :key="index">{{item.fname}}</el-checkbox-button>
                                        </el-checkbox-group>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <span class="title">&nbsp;&nbsp;膜厚</span>
                                    <div>
                                        <SelectEnter
                                            ref="searchThick"
                                            :inputValue="searchThick"
                                            :selectTHs="matThickTHs"
                                            :selectTds="matThickList"
                                            @getList="_getMatThick"
                                            @setObj="handleMatThick"
                                            selectLabel="fname"
                                            selectValue="fcode"
                                            selectKey="fid">
                                        </SelectEnter>
                                        <el-checkbox-group v-model="chooseThick">
                                            <el-checkbox-button v-for="(item,index) in detailThickList" :label="item.fname" :key="index">{{item.fname}}</el-checkbox-button>
                                        </el-checkbox-group>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <div>
                                        <span class="title required inline-title">长度</span>
                                        <el-input v-model="detailLength"></el-input>
                                    </div>
                                    <div>
                                        <span class="title required inline-title">支数</span>
                                        <el-input v-model="detailDigit"></el-input>
                                    </div>
                                    <div>
                                        <span class="title inline-title">备注</span>
                                        <el-input class="xl-size" v-model="detailRemark" type="textarea"></el-input>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <el-button class="btn-cyan search-btn" @click="addToDetail">添加</el-button>
                                <el-button class="search-btn" @click="resetChoose">重置</el-button>
                            </div>
                            <div class="detail-edit-right">
                                <CommonTable
                                    v-if="false"
                                    ref="detailTable"
                                    :isCenter="true"
                                    :isMulTable="true"
                                    :isNotMulSelect="false"
                                    :otherVariable="detailVariable"
                                    :formTableData="detailData"
                                    :formPropTable="detailTableProp"
                                    :tableHeight="tableHeightII"
                                >
                                </CommonTable>
                                <el-table
                                    ref="detailTable"
                                    tooltip-effect="dark"
                                    :data="detailData"
                                    border
                                    :height="280"
                                    @row-click="handleClickDetail"
                                >
                                    <el-table-column label="型材型号" width="110px" label-class-name="table-valid-head" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <SelectEnter
                                                :inputWidth="100+'px'"
                                                :inputValue="scope.row.matCode"
                                                :selectTHs="matCodeTHs"
                                                :selectTds="matCodeList"
                                                @getList="getMatCodeList"
                                                @setObj="_setMatCode"
                                                selectLabel="fcode"
                                                selectValue="fcode"
                                                selectKey="fid">
                                            </SelectEnter>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="颜色代码" width="120px" align="center">
                                        <template slot-scope="scope">
                                            <SelectEnter
                                                :inputWidth="110+'px'"
                                                :inputValue="scope.row.cx1Name"
                                                :selectTHs="colorCodeTHs"
                                                :selectTds="colorCodeList"
                                                @getList="getColorCodeList"
                                                @setObj="_setColorCode"
                                                selectLabel="fname"
                                                selectValue="fname"
                                                selectKey="fid">
                                            </SelectEnter>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="颜色名称" prop="colorDescribe" align="left" :show-overflow-tooltip="true"></el-table-column>
                                    <el-table-column label="材质" width="80px" align="center">
                                        <template slot-scope="scope">
                                            <SelectEnter
                                                :inputWidth="60+'px'"
                                                :inputValue="scope.row.cx2"
                                                :selectTHs="matAlloyTHs"
                                                :selectTds="matAlloyList"
                                                @getList="_getMatAlloy"
                                                @setObj="_setMatAlloy"
                                                selectLabel="fcode"
                                                selectValue="fcode"
                                                selectKey="fid">
                                            </SelectEnter>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="长度 m" width="80" label-class-name="table-valid-head" align="center">
                                        <template slot-scope="scope">
                                            <el-input v-model.trim="scope.row.cx4Name"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="膜厚" width="80px" label-class-name="table-valid-head" align="center">
                                        <template slot-scope="scope">
                                            <SelectEnter
                                                :inputWidth="60+'px'"
                                                :inputValue="scope.row.cx3Name"
                                                :selectTHs="matThickTHs"
                                                :selectTds="matThickList"
                                                @getList="getMatThick"
                                                @setObj="_setMatThick"
                                                selectLabel="fname"
                                                selectValue="fcode"
                                                selectKey="fid">
                                            </SelectEnter>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="订单数" width="70px" label-class-name="table-valid-head" align="center">
                                        <template slot-scope="scope">
                                            <el-input v-model.trim="scope.row.digit" style="width: 60px;"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="喷码" width="80px" align="center">
                                        <template slot-scope="scope">
                                            <SelectEnter
                                                :inputWidth="60+'px'"
                                                :inputValue="scope.row.usrTxt1Name"
                                                :selectTHs="markMethodTHs"
                                                :selectTds="markMethodList"
                                                @getList="getMarkMethod"
                                                @setObj="_setMarkMethod"
                                                selectLabel="fname"
                                                selectValue="fname"
                                                selectKey="fid">
                                            </SelectEnter>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="禁喷类型" width="120px" align="center">
                                        <template slot-scope="scope">
                                            <el-select
                                                clearable
                                                v-model="scope.row.usrTxt2Name"
                                                style="width:100%;background:#fff;border-radius: 5px;"
                                            >
                                                <el-option
                                                    v-for="(item,index) in usrTxt2List"
                                                    :key="index"
                                                    :label="item.dictText"
                                                    :value="item.dictText">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="撕筋" width="55" align="center">
                                        <template slot-scope="scope">
                                            <el-select
                                                clearable
                                                v-model="scope.row.usrTxt3"
                                                @change="_setUsrTxt3Name"
                                                style="width:100%;background:#fff;border-radius: 5px;"
                                            >
                                                <el-option
                                                    v-for="(item,index) in getStaticList('siJin')"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="备注" align="center">
                                        <template slot-scope="scope">
                                            <el-input style="width:100%" v-model.trim="scope.row.remark"></el-input>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </template>
                </CommonAdd>
            </transition>
            <el-dialog
                title="提示"
                :visible.sync="tipVisible"
                width="30%">
                <p>更改型材型号，跟型号关联的属性会变成默认值，是否继续保存?</p>
                <el-checkbox v-model="isShowTip" @change="notShowTip">不再提示</el-checkbox>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="tipVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveChild(true)">确 定</el-button>
                </span>
            </el-dialog>
            <!--获取公共数据-->
            <CommonData :valueObj="valueObj" ref="commondata"></CommonData>
        </div>
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
                tableHeight: this.$store.state.screenHei*0.67,
                mainHeight: 716,
                notAllowUpHeight: 0,
                notAllowDownHeight: 0,
                scrollHeight: 0,
                //显示
                isResize: true,
                isBanOperate: false,
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
                //键盘操作
                currentIndex: 0,
                enterTimes: 1,
                isBanNextFocus: false,
                //组件配置
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    detailTitle: '编辑订单以及订单明细',
                    addTitle: '新建订单以及订单明细',
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
                //验证规则
                mainRules: {
                    docType: [
                        { required: true, message: '请选择单据类型', trigger: 'blur' }
                    ],
                    deliveryDays: [
                        { required: true, message: '请填写', trigger: 'blur' }
                    ],
                    clientCode: [
                        { required: true, message: '请选择客户', trigger: 'blur' }
                    ],
                    deliveryLevel: [
                        { required: true, message: '请选择货期等级', trigger: 'blur' }
                    ]
                },
                //搜索映射表
                searchProp: [
                    {
                        name:'订单号',
                        prop:'refDocCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入订单号'
                    },
                    {
                        name:' ',
                        name1:'取消',
                        name2:'关闭',
                        prop1:'isCancel',
                        prop2:'isClose',
                        type:'mixincheckbox',
                        isMainSearch:false,
                        isMain:false
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
                    },
                    {
                        name:'销售公司',
                        prop:'companyName',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'供货公司',
                        prop:'supplyCompanyName',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                ],
                //详情映射列表
                formProp: [
                    {name:'订购单号',prop:'refDocCode',type:'outter'},
                    {name:'下单日期',prop:'docDate',type:'outter'},
                    {name:'交货日期',prop:'deliveryDate',type:'outter'},
                    {name:'单据状态',prop:'docStatusName',type:'outter'},
                    {name:'制单人',prop:'enterName',type:'outter'},
                    {name:'',prop:'prdMethodName',type:'outter'},
                    {name:'合同号',prop:'contractCode',type:'inner'},
                    {name:'单据类型',prop:'docType',type:'inner'},
                    {name:'包装方式',prop:'packMethodName',type:'inner'},
                    {name:'喷码',prop:'usrTxt1Name',type:'inner'},
                    {name:'提货方式',prop:'loaderMethodName',type:'inner'},
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
                        name1:'订购单号/',
                        prop1:'refDocCode',
                        name2:'状态',
                        prop2:'docStatusName',
                        status: 'docStatus',
                        type:'mixinStatus',
                        width: '115',

                    },
                    {
                        name1:'下单日期/',
                        prop1:'docDate',
                        name2:'交货日期',
                        prop2:'deliveryDate',
                        type:'mixin',
                        width: '120'
                    },
                    {
                        name1:'单据类型/',
                        prop1:'docType',
                        name2:'合同号',
                        prop2:'contractCode',
                        type:'mixin',
                        width: '130'
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
                searchForm: {isCancel:0,isClose:0},
                addOrEditForm: {},
                addForm: {},
                detailForm: {},
                copyForm: {},
                tempForm: {},
                submitRow: {},
                detailId: null,
                docCode: null,
                //配置明细
                detailTableProp: [
                    {prop:'docItem', name:'序号',type:'normal',isShort: true,width:'40',align:'center'},
                    {prop:'matCode',name:'型材型号',type:'normal'},
                    {prop:'cx1Name',name:'颜色名称',type:'normal'},
                    {prop:'cx2Name',name:'材质',type:'normal'},
                    {prop:'cx4Name',name:'长度',type:'normal',rule:'limitLength',unit:' m',isShort: true,align:'right'},
                    {prop:'cx3Name',name:'膜厚',type:'normal',unit:'',isShort: true,align:'right'},
                    {prop:'digit',name:'支数',type:'normal',isShort: true,align:'right'},
                    {prop:'meterWght',name:'米重',type:'normal',rule:'limitLength',unit:' kg/m',isShort: true,align:'right'},
                    {prop:'unitWght',name:'支重',type:'normal',rule:'limitLength',unit:' kg/pcs',isShort: true,align:'right'},
                    {prop:'theoryWght',name:'理重',type:'normal',rule:'limitLength',unit:' kg',isShort: true,align:'right'},
                    //{prop:'usrTxt1Name',name:'喷码',type:'normal'},
                    {prop:'usrTxt2Name',name:'禁喷类型',type:'normal'},
                    {prop:'usrTxt3Name',name:'撕筋',type:'checkbox',width: 55, align:'center'},
                    {prop:'remark',name:'备注',type:'normal',width:200},
                ],
                _editIndex: 0,
                favoriteType: null,
                dialogTableData: [],
                _dialogTableData: [],
                chooseTableData: [],
                chooseList: [],
                cancelList: [],
                _cancelList: [],
                searchMatCode: '',
                searchColor: '',
                searchAlloy: '',
                searchMark: '',
                searchThick: '',
                chooseBrand: [],
                chooseSeries: [],
                chooseMatCode: [],
                chooseColor: [],
                chooseAlloy: [],
                chooseMark: [],
                chooseThick: [],
                collectSeries: [],
                collectMatCode: [],
                collectColor: [],
                collectAlloy: [],
                collectMark: [],
                collectThick: [],
                detailSeriesList: [],
                detailMatCodeList: [],
                detailColorList: [],
                detailAlloyList: [],
                detailMarkList: [],
                detailThickList: [],
                detailLength: null,
                detailDigit: null,
                detailRemark: null,
                detailVisible: false,
                addDetailList: [],
                chooseTitle: '',
                tableHeightII: 320,
                detailVariable: {},
                detailData: [],
                //提示
                tipVisible: false,
                isShowTip: false,
                saveUrl: null,
                saveObj: {},
                //分页
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //详情表格内容
                tabLeft: '120px',
                activeName: 'first',
                childDetailRow: {},
                clickTimes: 0,
                editIndex: 0,
                isAddDetail: false,
                //订单明细数据
                tabDataI: [],
                loadingI: false,
                isShowNotAllowed: false,
                //型号
                matCode: null,
                matCodeList: [],
                matCodeTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //颜色
                colorName: null,
                colorCodeList: [],
                colorCodeTHs: [
                    //{label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //材质资料
                matAlloy: null,
                matAlloyList: [],
                matAlloyTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //获取膜厚
                matThick: null,
                matThickList: [],
                matThickTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //获取喷码
                markMethod: null,
                markMethodList: [],
                markMethodTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //批量修改数据
                orderDetailDTOList:[],
                //单据类型
                orderTypeList: [],
                //货期等级
                deliveryLevelList: [],
                //提货方式
                deliveryMethodList: [],
                //开票类型
                vatTypeNameList: [],
                //禁喷类型
                usrTxt2List: [],
                //贴膜要求
                padPastingMethodList: [],
                //生产方式
                prdMethodList: [],
                //生产基地
                supplyCompanyList: [],
                //品牌列表
                brandList: [],
                valueObj: {
                    //包装方式
                    packMethodName: null,
                    mdmPackList: [],
                    packMethodTHs: [
                        {label:'代码',prop:'fcode'},
                        {label:'名称',prop:'fname'}
                    ],
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
                    //客户
                    clientCode: null,
                    orgClientList: [],
                    clientTHs: [
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
            'otherVariable.isChildEdit':{
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
            'editIndex': {
                handler(val,oldValue) {
                    if(this.otherVariable.isChildEdit) {
                        if(val !== oldValue) {
                            this.clickTimes = 1
                        }
                    }
                }
            },
            deep: true
        },
        mounted() {
            // 获取数据
            this.getData();
            this.getOrderType();
            this.getDeliveryLevel();
            this.getPrdMethodList();
            this.getVatTypeNameList();
            this.getUsrTxt2List();
            this.getPadPastingMethodList();
            this.getSupplyCompanyList();
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
                    this.searchForm = {refDocCode:this.searchForm.refDocCode};
                }else {
                    this.searchForm.refDocCode = null;
                }
                this.tableData = [];
                this.fetch(`/oms/sls/SalesClientOrder/getOrderMaster?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list) {
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
                            this.pageObj.commonTotal = 0
                        }
                    })
            },
            //刷新
            handleRefresh() {
                this.isBanOperate = true;
                this.getData();
                this.detailForm = {};
                this.detailId = null;
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },
            //重置
            handleReset() {
                this.searchForm = {isCancel:0,isClose:0};
                this.handleRefresh();
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
            //点击主表行
            handleDetail(row) {
                this.orderDetailDTOList = [];
                row.docStatus > 0 ? this.isBanOperate = false : this.isBanOperate = true;
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.handleCancel(this.operateType,false);
                this.fetch('/oms/sls/SalesClientOrder/getOrderMaster',{fid:row.fid})
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
                this.getChildTable(row.fid);
                this.detailId = row.fid;
                this.docCode = row.docCode;
            },
            //主表添加行
            handleAdd() {
                this.resetChoose();
                this.clearSearchInput();
                this.toggleSpread();
                this.operateType = 'add';
                this.addForm = {};
                this.addOrEditForm = {};
                this.$set(this.addOrEditForm,'docDate',new Date());
                this.defaultOrgClient();
                this.chooseBrand = '广亚';
                this.setBrand('广亚');
                this.clearSelect();
                this.isShowStatus.isPopUp = true;
                this.otherVariable.popupTitle = this.otherVariable.addTitle;
                this.otherVariable.isEdit = false;
            },
            //复制新增
            copyAdd() {
                this.getAjax('/oms/sls/SalesOrderMaster/copy?id='+this.detailId)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '复制新增成功',
                                type: 'success'
                            });
                            this.handleRefresh()
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            })
                        }
                    })
            },
            //清空选择组件的数据
            clearSelect() {
                this.$refs.clientSelect.inputValueData = '';
                this.valueObj.clientCode = '';
            },
            clearCellSelect() {
                this.matCode = '';
                this.colorName = '';
                this.matAlloy = '';
                this.matThick = '';
                this.markMethod = '';
            },
            //禁止点击表格提醒
            handleNotAllowed() {
                if(this.isShowStatus.isPopUp) {
                    this.$confirm('此操作将清空已填写的数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.handleCancel(this.operateType,false);
                    }).catch(() => {
                        console.log('cnacel')
                    })
                }
                if(this.otherVariable.isChildEdit) {
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
            isSaveChildRow() {
                this.$confirm('是否保存?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleSaveChild(0,'first');
                }).catch(() => {
                    console.log('cancel')
                    //this.handleCancelChild();
                })
            },
            //主表编辑行
            handleEdit() {
                this.resetChoose();
                this.clearSearchInput();
                this.toggleSpread();
                this.operateType = 'edit';
                this.otherVariable.popupTitle = this.otherVariable.detailTitle;
                this.otherVariable.isEdit = true;
                this.addOrEditForm = this.detailForm;
                this.chooseBrand =  this.detailForm.brandName;
                this.setBrand(this.detailForm.brandName);
                if(this.detailForm.fid) {
                    this.isShowStatus.isPopUp = true;
                    this.valueObj.clientParentId = null;
                    //包装方式
                    this.$set(this.addOrEditForm,'packMethodName',this.detailForm.packMethodName);
                    this.valueObj.packMethodName = this.detailForm.packMethodName;
                    //客户
                    this.$set(this.addOrEditForm,'clientCode',this.detailForm.clientCode);
                    this.valueObj.clientCode = this.detailForm.clientCode;
                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    })
                }
            },
            //主表保存行
            handleSave(type) {
                this.addOrEditForm.sellType = 1;
                let tipMsg = '订单添加成功';
                this.$refs.addOrEditForm.validate((valid) => {
                    if(valid) {
                        let tempObj;
                        let api = '/oms/sls/SalesClientOrder/merge-order-combine';
                        if(type === 'add') {
                            //api = '/oms/sls/SalesClientOrder/insertMaster';
                            tipMsg = '订单添加成功';
                        }else {
                            this.addOrEditForm.masterFid = this.detailForm.fid;
                            //api = '/oms/sls/SalesClientOrder/updateMaster';
                            tipMsg = '订单修改成功';
                        }
                        tempObj = {main:this.addOrEditForm,children:this.detailData};
                        this.otherVariable.isSaving = true;
                        this.fetch(api,tempObj)
                            .then(result => {
                                if(result.status === 200) {
                                    this.topFIds = [];
                                    this.$message({
                                        message: tipMsg,
                                        type: 'success'
                                    });
                                    if(type === 'add') {
                                        this.topFIds.push(result.data.fid);
                                        this.batchSaveDetail(result.data.fid,result.data.docCode);
                                    }else {
                                        this.topFIds.push(this.addOrEditForm.fid);
                                        if(this.addDetailList.length) {
                                            this.batchSaveDetail(this.addOrEditForm.fid,this.addOrEditForm.docCode);
                                        }
                                    }
                                    this.isShowStatus.isPopUp = false;
                                    this.addForm = {};
                                    this.searchForm = {};
                                    this.toggleSpread();
                                    this.getData();
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    });
                                }
                            })
                            .then(() => {
                                this.otherVariable.isSaving = false;
                            })
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            //批量保存订单明细
            batchSaveDetail(masterId,docCode) {
                this.addDetailList.forEach(item => {
                    item.masterId = masterId;
                    item.docCode = docCode;
                });
                this.fetch('/oms/sls/SalesClientOrder/insertDetailBatch',this.addDetailList)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '订单明细添加成功',
                                type: 'success'
                            })
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            })
                        }
                    })
            },
            //主表取消操作
            handleCancel(type,isFirst=true) {
                if(isFirst) {
                    this.toggleSpread();
                }
                this.isShowStatus.isPopUp = false;
                if(type === 'add') {
                    this.addOrEditForm = {};
                }else {
                    this.detailForm = this.$lodash.cloneDeep(this.copyForm);
                    this.addOrEditForm = this.$lodash.cloneDeep(this.copyForm);
                }
            },
            //主表确认
            handleConfirm() {
                if(this.detailForm.fid) {
                    this.$confirm('是否提交?', '提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.getAjax(`/oms/sls/SalesClientOrder/clientConfirm?orderId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
                            .then(result => {
                                this.otherVariable.isSaving = true;
                                if (result.status === 200) {
                                    this.$message({
                                        message: result.message,
                                        type: 'success'
                                    });
                                    this.getData(false);
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    })
                                }
                            })
                            .then(() => {
                                this.otherVariable.isSaving = false;
                            })
                    })
                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    });
                }
            },
            //主表取消确认
            handleCanCelConfirm() {
                if(this.detailForm.fid) {
                    this.otherVariable.isSaving = true;
                    this.getAjax(`/oms/sls/SalesClientOrder/unConfirmOrder?orderId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
                        .then(result => {
                            if (result.status === 200) {
                                this.$message({
                                    message: result.message,
                                    type: 'success'
                                });
                                this.getData(false);
                            }else {
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                })
                            }
                        })
                        .then(() => {
                            this.otherVariable.isSaving = false;
                        })
                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    })
                }
            },
            //主表删除行
            handleDelete() {
                if(this.detailForm.fid) {
                    if(confirm('确定删除？') === true) {
                        this.getAjax(`/oms/sls/SalesClientOrder/deleteOrder?orderId=${this.detailForm.fid}`)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    this.detailForm = {};
                                    this.getInitPage();
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    })
                                }
                            })
                    }
                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    })
                }
            },
            //添加
            addToDetail() {
                if(this.chooseMatCode.length) {
                    if(this.chooseColor.length) {
                        if(this.chooseAlloy.length) {
                            if(this.chooseMark.length) {
                                if(this.detailLength) {
                                    if(this.detailDigit) {
                                        this.generateToDetail()
                                    }else {this.$message({message: '支数不能为空,请填写', type: 'warning'})}
                                }else {this.$message({message: '长度不能为空,请填写', type: 'warning'})}
                            }else {this.$message({message: '喷码不能为空,请选择', type: 'warning'})}
                        }else {this.$message({message: '材质不能为空,请选择', type: 'warning'})}
                    }else {this.$message({message: '颜色不能为空,请选择', type: 'warning'})}
                }else {this.$message({message: '型号不能为空,请选择', type: 'warning'})}
            },
            //生成
            generateToDetail() {
                this.addOrEditForm.digit = this.detailDigit;
                this.addOrEditForm.cx4Name = this.detailLength;
                this.addOrEditForm.listMatCode = this.chooseMatCode;
                this.addOrEditForm.listColorId = [];
                this.addOrEditForm.listAlloyId = [];
                this.addOrEditForm.listCx3 = [];
                this.addOrEditForm.listUsrTxt1 = [];
                this.chooseColor.forEach(item => {
                    let newItem = this.detailColorList.find(v => v.fname === item)['fid'] || null;
                    this.addOrEditForm.listColorId.push(newItem)
                });
                this.chooseAlloy.forEach(item => {
                    let newItem = this.detailAlloyList.find(v => v.fname === item)['fid'] || null;
                    this.addOrEditForm.listAlloyId.push(newItem)
                });
                this.chooseMark.forEach(item => {
                    let newItem = this.detailMarkList.find(v => v.fname === item)['fcode'] || null;
                    this.addOrEditForm.listUsrTxt1.push(newItem)
                });
                this.chooseThick.forEach(item => {
                    let newItem = this.detailThickList.find(v => v.fname === item)['fcode'] || null;
                    this.addOrEditForm.listCx3.push(newItem)
                });
                this.detailData = [];
                this.fetch('/oms/sls/SalesClientOrder/preview-combine-order-details',this.addOrEditForm)
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            this.detailData = result.data
                        }
                    })
            },
            //重置
            resetChoose() {
                this.addDetailList = [];
                this.detailData = [];
                this.searchMatCode = '';
                this.searchColor = '';
                this.searchAlloy = '';
                this.searchMark = '';
                this.searchThick = '';
                this.chooseSeries = [];
                this.chooseMatCode = [];
                this.chooseColor = [];
                this.chooseAlloy = [];
                this.chooseMark = [];
                this.chooseThick = [];
                this.detailMatCodeList = [];
                this.detailColorList = [];
                this.detailAlloyList = [];
                this.detailMarkList = [];
                this.detailThickList = [];
                this.detailLength = null;
                this.detailDigit = null;
                this.detailRemark = null;
            },
            handleClickDetail(row) {
                this._editIndex = this.$lodash.findIndex(this.detailData, row);
            },
            clearSearchInput() {
                this.searchMatCode = '';
                this.$refs.searchMatCode.inputValueData = '';
                this.searchColor = '';
                this.$refs.searchColor.inputValueData = '';
                this.searchAlloy = '';
                this.$refs.searchAlloy.inputValueData = '';
                this.searchMark = '';
                this.$refs.searchMark.inputValueData = '';
                this.searchThick = '';
                this.$refs.searchThick.inputValueData = '';
            },
            handleMatCode(item) {
                this.detailMatCodeList.push(item);
                this.chooseMatCode.push(item.fcode);
                this.detailMatCodeList = this.reduceObj(this.detailMatCodeList,'fcode');
                this.chooseMatCode = Array.from(new Set(this.chooseMatCode));
                this.$nextTick(() => {
                    this.searchMatCode = '';
                    this.$refs.searchMatCode.inputValueData = '';
                })
            },
            handleColorCode(item) {
                this.detailColorList.push(item);
                this.chooseColor.push(item.fname);
                this.detailColorList = this.reduceObj(this.detailColorList,'fcode');
                this.chooseColor = Array.from(new Set(this.chooseColor));
                this.$nextTick(() => {
                    this.searchColor = '';
                    this.$refs.searchColor.inputValueData = '';
                })
            },
            handleMatAlloy(item) {
                this.detailAlloyList.push(item);
                this.chooseAlloy.push(item.fname);
                this.detailAlloyList = this.reduceObj(this.detailAlloyList,'fcode');
                this.chooseAlloy = Array.from(new Set(this.chooseAlloy));
                this.$nextTick(() => {
                    this.searchAlloy = '';
                    this.$refs.searchAlloy.inputValueData = '';
                })
            },
            handleMarkMethod(item) {
                this.detailMarkList.push(item);
                this.chooseMark.push(item.fname);
                this.detailMarkList = this.reduceObj(this.detailMarkList,'fcode');
                this.chooseMark = Array.from(new Set(this.chooseMark));
                this.$nextTick(() => {
                    this.searchMark = '';
                    this.$refs.searchMark.inputValueData = '';
                })
            },
            handleMatThick(item) {
                this.detailThickList.push(item);
                this.chooseThick.push(item.fname);
                this.detailThickList = this.reduceObj(this.detailThickList,'fcode');
                this.chooseThick = Array.from(new Set(this.chooseThick));
                this.$nextTick(() => {
                    this.searchThick = '';
                    this.$refs.searchThick.inputValueData = '';
                })
            },
            _setMatCode(item) {
                this.$set(this.detailData[this._editIndex],'matCode',item.fcode);
                this.$set(this.detailData[this._editIndex],'matName',item.fname);
                this.$set(this.detailData[this._editIndex],'machineLevelName',item.machineLevel);
                this.$set(this.detailData[this._editIndex],'perLotQty',item.perLotDigit);
                this._setUsrTxt2(item.banSprayType);
                this.$set(this.detailData[this.editIndex],'usrTxt6',item.pvcCode);
                this.$set(this.detailData[this.editIndex],'usrTxt6Name',item.pvcName);
                let isTear;
                item.isTear ? isTear = '✔' : isTear = '';
                this.$set(this.detailData[this.editIndex],'usrTxt3Name',isTear);
                this.$set(this.detailData[this.editIndex],'usrTxt3',item.isTear.toString());
                this.$set(this.detailData[this.editIndex],'isTear',isTear);
            },
            _setColorCode(item) {
                this.$set(this.detailData[this._editIndex],'colorId',item.fid);
                this.$set(this.detailData[this._editIndex],'cx1',item.fcode);
                this.$set(this.detailData[this._editIndex],'cx1Name',item.fname);
            },
            _setMatAlloy(item) {
                this.$set(this.detailData[this._editIndex],'cx2',item.fcode);
                this.$set(this.detailData[this._editIndex],'cx2Name',item.fname);
            },
            _setMatThick(item) {
                this.$set(this.detailData[this._editIndex],'cx3',item.fcode);
                this.$set(this.detailData[this._editIndex],'cx3Name',item.fname);
            },
            _setMarkMethod(item) {
                this.$set(this.detailData[this._editIndex],'usrTxt1Name',item.fname);
                this.$set(this.detailData[this._editIndex],'usrTxt1',item.fcode);
            },
            _setUsrTxt3Name(val) {
                if(val === '1') {
                    this.$set(this.detailData[this.editIndex],'usrTxt3Name','✔');
                    this.$set(this.detailData[this.editIndex],'usrTxt3','1');
                }else {
                    this.$set(this.detailData[this.editIndex],'usrTxt3Name','');
                    this.$set(this.detailData[this.editIndex],'usrTxt3','0');
                }
            },

            //获取从表
            getChildTable(fid,index,type) {
                this.clickTimes = 0;
                this.tabDataI = [];
                this.loadingI = true;
                this.isShowNotAllowed = true;
                this.getAjax(`/oms/sls/SalesClientOrder/getOrderDetail?pageSize=1000&clientOrderMasterId=${fid}`)
                    .then(result => {
                        this.isShowNotAllowed = false;
                        if(result.data && result.data.list) {
                            result.data.list.forEach(item => {
                                if(item.usrTxt3Name) {
                                    item.usrTxt3Name = item.usrTxt3Name.toLowerCase();
                                }
                            });
                            this.tabDataI = result.data.list;
                        }else {
                            this.tabDataI = [];
                        }
                    })
                    .then(() => {
                        this.loadingI = false;
                        if(!this.isCansave) {
                            this.goTemp(index,type);
                        }
                    })
            },
            //从表添加行
            handleAddChild() {
                if(this.detailForm.fid) {
                    this.isShowCopyBtn = false;
                    this.isAddDetail = true;
                    this.clearCellSelect();
                    this.otherVariable.isChildEdit = true;
                    this.childDetailRow.fid = null;
                    this.$nextTick(()=>{
                        this.tempForm = {matCode:'',matName:'',cx1:'',cx1Name:'',cx2:'',cx2Name:'',cx3:'',cx3Name:'',usrTxt1Name:'',usrTxt1:'',isEditState:true};
                        this.tabDataI.unshift(this.$lodash.cloneDeep(this.tempForm));
                    });
                    setTimeout(() => {
                        $('.el-table__body-wrapper .el-input__inner')[0].focus();
                    },200)
                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    });
                }
            },
            //复制新增明细
            copyAddChild() {
                delete this.childDetailRow.fid;
                delete this.childDetailRow.variantId;
                delete this.childDetailRow.itemNo;
                this.childDetailRow.masterId = this.detailId;
                this.childDetailRow.docCode = this.docCode;
                this.handleSaveChild(0,'first',true);
            },
            //从表保存
            handleSaveChild(index,type,isCopy = false) {
                this.isCanSave = true;
                let isHasId;
                let isSave = true;
                this.childDetailRow.fid ? isHasId = true : isHasId = false;
                if(isCopy) {
                    this.saveUrl = '/oms/sls/SalesOrderDetail/insert';
                    this.saveObj = this.$lodash.cloneDeep(this.childDetailRow);
                    this.saveChild(isSave);
                }else {
                    if(!isHasId) {
                        this.saveUrl = '/oms/sls/SalesOrderDetail/insert';
                        this.saveObj = this.tabDataI[0];
                        this.saveObj.masterId = this.detailId;
                        this.saveObj.docCode = this.docCode;
                        this.saveObj.usrTxt1 = this.usrTxt1;
                        this.saveObj.usrTxt1Name = this.usrTxt1Name;
                        if(!(this.saveObj['matCode']||this.saveObj['cx1']||this.saveObj['cx2']||this.saveObj['cx3']||this.saveObj['usrTxt1'])) {
                            this.handleCancelChild();
                            isSave = false;
                        }
                        this.saveChild(isSave,true);
                    }else {
                        this.saveUrl = '/oms/sls/SalesOrderDetail/update';
                        this.saveObj = this.childDetailRow;
                        if(this.copyChildDetailRow.matCode !== this.childDetailRow.matCode) {
                            if(localStorage.getItem('isShowDetailBan') !== 'true') {
                                this.tipVisible = true;
                            }else {
                                this.saveChild(true);
                            }
                        }else {
                            this.saveChild(isSave);
                        }
                    }
                }
            },
            saveChild(isSave,isAdd = false) {
                const that = this;
                isSave && that.fetch(that.saveUrl,that.saveObj)
                    .then(result => {
                        if(result.status === 200) {
                            that.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            that.isCanSave = false;
                            that.childDetailRow.fid = null;
                            if(isAdd) {
                                that.handleAddChild();
                            }else {
                                that.handleCancelChild();
                            }
                        }else {
                            that.tabDataI[that.editIndex].isEditState = true;
                            that.$message({
                                message: that.returnErrorMsg(result.error),
                                type: 'error'
                            });
                            that.isCanSave = false;
                        }
                    });
                that.tipVisible = false;
                that.tabDataI = that.giveState(that.tabDataI)
            },
            //从表取消操作
            handleCancelChild() {
                this.getChildTable(this.detailId);
                this.scrollHeight = 0;
                this.otherVariable.isChildEdit = false;
                this.isAddDetail = false;
            },
            //从表删除行
            handleDeleteChild(row,index) {
                if(row.fid) {
                    if(confirm('确定删除？') === true) {
                        this.getAjax(`/oms/sls/SalesClientOrder/deleteDetail?fid=${this.tabDataI[index].fid}&variantId=${this.tabDataI[index].variantId}`)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    this.getChildTable(this.detailId);
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    });
                                }
                            });
                        this.otherVariable.isChildEdit = false;
                    }
                }
            },
            //合计
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                let digit = null;
                let theoryWght = null;
                if(data.length) {
                    data.forEach((d,i) => {
                        if(!d.parentVariantId) {
                            digit += Number(d.digit);
                            theoryWght += Number(d.theoryWght);
                        }
                    })
                }
                sums[0] = '合计';
                //订单数
                sums[7] = digit;
                //理重
                theoryWght ? sums[10] = theoryWght.toFixed(3) : 0;
                return sums;
            },
            //从表点击行
            clickDetail(row) {
                this.isShowCopyBtn = !(Boolean(row.variantId)&&Boolean(row.parentVariantId));
                this.clickTimes += 1;
                if(this.isBanOperate) {
                    if(!this.otherVariable.isReadTable) {
                        this.otherVariable.isChildEdit = true;
                        this.tabDataI = this.giveState(this.tabDataI);
                        row.isEditState = true;
                        this.$nextTick(() => {
                            this.matCode = row.matCode;
                            this.colorName = row.cx1Name;
                            this.matAlloy = row.cx2;
                            this.matThick = row.cx3Name;
                            this.markMethod = row.usrTxt1Name;
                        });
                        this.orderDetailDTOList.push(row);
                    }
                    this.childDetailRow = row || {};
                    this.$nextTick(() => {
                        if(this.clickTimes === 1) {
                            this.copyChildDetailRow = this.$lodash.cloneDeep(this.childDetailRow);
                        }
                    });
                    this.editIndex = this.$lodash.findIndex(this.tabDataI, ['variantId', row.variantId]);
                    if(this.editIndex < 0) {
                        this.editIndex = 0;
                    }
                    //根据滚动条位置调整禁止区域
                    if(this.scrollHeight) {
                        this.notAllowUpHeight = this.editIndex*34 - this.scrollHeight + 'px';
                        this.notAllowDownHeight = this.tableHeight - 121 + this.scrollHeight - this.editIndex*34 + 'px';
                    }else {
                        this.notAllowUpHeight = this.editIndex*34+'px';
                        this.notAllowDownHeight = this.tableHeight - 121 - this.editIndex*34 + 'px';
                    }
                }else {
                    this.otherVariable.isChildEdit = false;
                }
            },
            //批量修改明细
            UpdataorderList(){
                if(this.orderDetailDTOList.length) {
                    this.orderDetailDTOList = this.deletePardon(this.orderDetailDTOList,'variantId');
                    this.fetch('/oms/sls/SalesOrderDetail/updateList',this.orderDetailDTOList)
                        .then(result => {
                            if(result.status ===200){
                                this.$message({
                                    message:result.message,
                                    type:'success'
                                });
                                this.isShowCopyBtn = false;
                                this.otherVariable.isChildEdit=false;
                                this.isShowNotAllowed = false;
                                this.isBanOperate = true;
                                this.tabDataI[this.editIndex].isEditState = false;
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
                }else {
                    this.$message({
                        message: '请选择修改项',
                        type:'warning'
                    })
                }
            },

            //------------------- 下拉选择 START -------------------//

            //获取子型号列表
            getMatCodeList(val) {
                this.matCodeList = [];
                this.fetch('/oms/BasedataController/getAluModelByValue?pageSize=10',{fcode:val})
                    .then(result => {
                        if(result.data && result.data.list && result.data.list.length) {
                            this.matCodeList = result.data.list;
                        }
                    })
            },
            //获取子型号
            setMatCode(tempItem) {
                this.fetch('/oms/BasedataController/getAluModel',{fcode:tempItem.fcode})
                    .then(result => {
                        if(result.data && result.data.list && result.data.list.length) {
                            let item = result.data.list[0];
                            this.matCode = item.fcode;
                            this.$set(this.tabDataI[this.editIndex],'matCode',item.fcode);
                            this.$set(this.tabDataI[this.editIndex],'matName',item.fname);
                            //机台级别
                            this.$set(this.tabDataI[this.editIndex],'machineLevelName',item.machineLevel);
                            //支/扎
                            this.$set(this.tabDataI[this.editIndex],'perLotQty',item.perLotDigit);
                            //禁喷类型
                            this.setUsrTxt2(item.banSprayType);
                            //胶条规格
                            this.$set(this.tabDataI[this.editIndex],'usrTxt6',item.pvcCode);
                            this.$set(this.tabDataI[this.editIndex],'usrTxt6Name',item.pvcName);
                            //撕筋
                            let isTear;
                            item.isTear ? isTear = '✔' : isTear = 'x';
                            this.$set(this.tabDataI[this.editIndex],'usrTxt3Name',isTear);
                            this.$set(this.tabDataI[this.editIndex],'usrTxt3',item.isTear.toString());
                            this.$set(this.tabDataI[this.editIndex],'isTear',item.isTear);
                        }
                    })
            },
            //获取颜色列表
            getColorCodeList(val) {
                this.colorCodeList = [];
                this.fetch('/oms/BasedataController/getMatColor?pageSize=100',{fname:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.colorCodeList = result.data.list;
                        }
                    });
            },
            //获取颜色
            setColorCode(item) {
                this.colorName = item.fname;
                this.$set(this.tabDataI[this.editIndex],'colorId',item.fid);
                this.$set(this.tabDataI[this.editIndex],'cx1',item.fcode);
                this.$set(this.tabDataI[this.editIndex],'cx1Name',item.fname);
            },
            //获取材质资料列表
            _getMatAlloy(val) {
                this.getMatAlloy(val,true)
            },
            getMatAlloy(val,isNull = false) {
                this.matAlloyList = [];
                this.dialogTableData = [];
                this._dialogTableData = [];
                this.fetch('/oms/BasedataController/getMatAlloy?pageSize=100',{fcode:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.matAlloyList = this.$lodash.cloneDeep(result.data.list);
                            if((!isNull)&&!val) {
                                this.matAlloyList.unshift({fname:null,fcode:null,fid:null})
                            }
                            result.data.list.forEach(item => {
                                this.dialogTableData.push({docCode:item.fcode,docName:item.fname,docId:item.fid})
                            });
                            this._dialogTableData = this.$lodash.cloneDeep(this.dialogTableData);
                        }
                    });
            },
            //获取材质资料
            setMatAlloy(item) {
                this.matAlloy = item.fcode;
                this.$set(this.tabDataI[this.editIndex],'cx2',item.fcode);
                this.$set(this.tabDataI[this.editIndex],'cx2Name',item.fname);
            },
            //获取膜厚列表
            getMatThick(val,isNull = false) {
                this.matThickList = [];
                this.dialogTableData = [];
                this._dialogTableData = [];
                this.fetch('/oms/BasedataController/getMatThick?pageSize=100',{fname:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.matThickList = result.data.list;
                            if((!isNull)&&(!val)) {
                                this.matThickList.unshift({fname:null,fcode:null,fid:null})
                            }
                            result.data.list.forEach(item => {
                                this.dialogTableData.push({docCode:item.fcode,docName:item.fname,docId:item.fid})
                            });
                            this._dialogTableData = this.$lodash.cloneDeep(this.dialogTableData);
                        }
                    });
            },
            _getMatThick(val) {
                this.getMatThick(val,true)
            },
            //获取膜厚
            setMatThick(item) {
                this.matThick = item.fname;
                this.$set(this.tabDataI[this.editIndex],'cx3',item.fcode);
                this.$set(this.tabDataI[this.editIndex],'cx3Name',item.fname);
            },

            _getMarkMethod(val) {
                this.getMarkMethod(val)
            },
            //获取喷码列表
            getMarkMethod(val) {
                this.markMethodList = [];
                this.dialogTableData = [];
                this._dialogTableData = [];
                this.fetch('/oms/BasedataController/getMdmMarkMethod?pageSize=100',{fname:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.markMethodList = this.$lodash.cloneDeep(result.data.list);
                            result.data.list.forEach(item => {
                                this.dialogTableData.push({docCode:item.fcode,docName:item.fname,docId:item.fid})
                            });
                            this._dialogTableData = this.$lodash.cloneDeep(this.dialogTableData);
                        }
                    })
            },
            //获取喷码
            setMarkMethod(item) {
                this.markMethod = item.fname;
                this.$set(this.tabDataI[this.editIndex],'usrTxt1Name',item.fname);
                this.$set(this.tabDataI[this.editIndex],'usrTxt1',item.fcode);
            },

            //获取撕筋
            setUsrTxt3Name(val) {
                if(val === '1') {
                    this.$set(this.tabDataI[this.editIndex],'usrTxt3Name','✔');
                    this.$set(this.tabDataI[this.editIndex],'usrTxt3','1');
                }else {
                    this.$set(this.tabDataI[this.editIndex],'usrTxt3Name','');
                    this.$set(this.tabDataI[this.editIndex],'usrTxt3','0');
                }
            },

            //默认门户客户
            defaultOrgClient() {
                this.fetch('/oms/BasedataController/getOrgClientCompany',{})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.valueObj.orgClientList = result.data.list;
                            let itemObj = result.data.list[0];
                            this.$nextTick(() => {
                                this.$refs.clientSelect.inputValueData = itemObj.fcode;
                                this.valueObj.clientCode = itemObj.fcode;
                                this.setClient(itemObj)
                            })
                        }
                    })
            },

            //客户
            getOrgClient(val) {
                this.$refs.commondata.getOrgClient(val);
            },
            setClient(item) {
                this.$set(this.valueObj,'clientCode',item.fcode);
                this.$set(this.addOrEditForm,'clientName',item.fname);
                this.$set(this.addOrEditForm,'clientCode',item.fcode);
                this.$set(this.addOrEditForm,'clientId',item.fid);
                this.$set(this.addOrEditForm,'clientType',item.clientType);
                this.$set(this.addOrEditForm,'clientTypeName',item.clientTypeName);
                this.getBrandList(item.fid);
            },

            //工程列表
            getProject(val) {
                this.$refs.commondata.getProject(val)
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

            //包装方式
            getMdmPackMethod(val) {
                this.$refs.commondata.getMdmPackMethod(val);
            },
            setPackMethod(item) {
                this.$set(this.valueObj,'packMethodName',item.fname);
                this.$set(this.addOrEditForm,'packMethodName',item.fname);
                this.$set(this.addOrEditForm,'packMethodCode',item.fcode);
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
            getBrandList(clientId) {
                this.brandList = [];
                this.getAjax('/oms/mdm/branControl/selectBran?clientId='+clientId)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.brandList = result.data.list;
                            if(this.brandList.length === 1) {
                                let tempObj = this.brandList[0];
                                this.addOrEditForm.brandName = tempObj.fname;
                                this.addOrEditForm.brandId = tempObj.fid;
                            }
                        }
                    })
            },
            setBrand(val) {
                this.addOrEditForm.brandName = val;
                if(val) {
                    let item;
                    item = this.brandList.find(item => item.fname === val);
                    if(JSON.stringify(item) !== {} && JSON.stringify(item)) {
                        this.addOrEditForm.brandId = item.fid
                    }
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
                                item.dictValue = Number(item.dictValue)
                            });
                            this.deliveryLevelList = result.data;
                        }else {
                            this.deliveryLevelList = [];
                        }
                    })
            },
            setDelivery(val) {
                let item;
                item = this.deliveryLevelList.find(item => item.dictValue === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.deliveryLevelName = item.dictText
                }
            },

            //开票类型
            getVatTypeNameList() {
                this.vatTypeNameList = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30118')
                    .then(result => {
                        if(result.data) {
                            this.vatTypeNameList = result.data;
                        }else {
                            this.vatTypeNameList = [];
                        }
                    })
            },
            setVatTypeName(val) {
                let item;
                item = this.vatTypeNameList.find(item => item.dictValue === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.vatTypeName = item.dictText
                }
            },

            //禁喷类型
            getUsrTxt2List() {
                this.usrTxt2List = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30119')
                    .then(result => {
                        if(result.data) {
                            this.usrTxt2List = result.data;
                        }else {
                            this.usrTxt2List = [];
                        }
                    })
            },
            setUsrTxt2(val) {
                if(val) {
                    let item;
                    item = this.usrTxt2List.find(item => item.dictText === val);
                    if(JSON.stringify(item) !== {}) {
                        this.$set(this.tabDataI[this.editIndex],'usrTxt2Name',item.dictText);
                        this.$set(this.tabDataI[this.editIndex],'banSprayType',item.dictText);
                    }
                }
            },
            _setUsrTxt2(val) {
                if(val) {
                    let item;
                    item = this.usrTxt2List.find(item => item.dictText === val);
                    if(JSON.stringify(item) !== {}) {
                        this.$set(this.detailData[this.editIndex],'usrTxt2Name',item.dictText);
                        this.$set(this.detailData[this.editIndex],'banSprayType',item.dictText);
                    }
                }
            },

            //贴膜要求
            getPadPastingMethodList() {
                this.padPastingMethodList = [];
                this.fetch('/oms/BasedataController/getMdmPadpastingMethod',{})
                    .then(result => {
                        if(result.data&&result.data.list) {
                            this.padPastingMethodList = result.data.list;
                        }else {
                            this.padPastingMethodList = [];
                        }
                    })
            },
            setPadPastingMethod(val) {
                let item;
                item = this.padPastingMethodList.find(item => item.fcode === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.padPastingMethodName = item.fname
                }
            },

            //生产方式
            getPrdMethodList() {
                this.prdMethodList = [];
                this.fetch('/oms/BasedataController/getProductionMethodList',{})
                    .then(result => {
                        if(result.data&&result.data.list) {
                            this.prdMethodList = result.data.list;
                        }else {
                            this.prdMethodList = [];
                        }
                    })
            },
            setPrdMethod(val) {
                let item;
                item = this.prdMethodList.find(item => item.fcode === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.prdMethodName = item.fname;
                    this.addOrEditForm.prdMethodCode = item.fcode;
                }
            },

            //生产基地
            getSupplyCompanyList() {
                this.supplyCompanyList = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30124')
                    .then(result => {
                        if(result.data) {
                            this.supplyCompanyList = result.data;
                        }else {
                            this.supplyCompanyList = [];
                        }
                    })
            },
            setSupplyCompany(val) {
                let item;
                item = this.supplyCompanyList.find(item => item.dictValue === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.supplyCompanyName = item.dictText
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
    .detail-table-wrap {
        display: flex;
    }
    .operate-btn-wrap {
        width: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        button {
            width: 80px;
            margin-left: 0;
            margin-bottom: 30px;
        }
    }
</style>
