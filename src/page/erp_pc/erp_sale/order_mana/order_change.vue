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
                @getData="getSearchList"
            >
                <template slot="search-other-btn">
                    <el-button @click="handleReset">重置</el-button>
                </template>
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
                @getInitPage="getInitPage"
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
                @handleDelete="handleDelete"
            >
                <!--详情头部-->
                <template slot="header">
                    <div class="header-form" ref="headForm">
                        <template v-for="item in formProp">
                            <div v-if="item.type === 'outter'">
                                <span>{{ item.name ? (item.name + ':') : '' }}</span>
                                <span>{{ left_detailForm[item.prop]==='已提交'?'待提交':left_detailForm[item.prop] ==='已确认'?'已提交':left_detailForm[item.prop]}}</span>
                            </div>
                        </template>
                    </div>
                </template>
                <!--头部按钮-->
                <template slot="main-btn-wrap" v-if="!otherVariable.isChildEdit">
                    <div class="xs-icon-confirm" v-if="detailId && docStatus < 50 && !isNewEdit" @click="handleConfirm">提交</div>
                    <div class="xs-icon-confirm" v-if="detailId && docStatus === 50 && !isNewEdit" @click="handleUnConfirm">撤销</div>
                    <i class="sm-icon-edit el-icon-edit" @click="handleEditNew" title="编辑" v-if="detailId && docStatus < 50 && !isNewEdit" style="right: 100px"></i>
                    <i class="sm-icon-edit el-icon-close" @click="handleCancelNew" title="取消" v-if="docStatus < 50 && isNewEdit" style="right: 130px"></i>
                    <i class="sm-icon-edit el-icon-check" @click="handleEditSave" title="保存" v-if="docStatus < 50 && isNewEdit" style="right: 85px"></i>
                    <i class="sm-icon-edit el-icon-news" title="作废" @click="cancelOrder" v-if="detailId && !isNewEdit" style="right: 52px"></i>
                    <i class="sm-icon-edit el-icon-delete" title="删除" @click="handleDelete" v-if="detailId && !isNewEdit" style="right: 5px"></i>
                </template>
                <!--头部标题-->
                <template slot="head-form-title">
                    <div class="head-form-title">
                        <span>&nbsp;{{ left_detailForm.projectName }}{{ left_detailForm.projectCode?("("+ left_detailForm.projectCode + ")"):"" }}</span>
                        <span></span>
                    </div>
                </template>
                <!--头部表单-->
                <template slot="head-form-content">
                    <div class="head-form-content">
                        <template v-for="item in formProp">
                            <div v-if="item.type === 'inner' && !item.isLong">
                                <span>{{ item.name }}：</span>
                                <span>{{ left_detailForm[item.prop] }}</span>
                            </div>
                        </template>
                    </div>
                    <div class="remark-wrap">
                        <div>备注：</div>
                        <div class="headspan scrollBar" :title="left_detailForm.remark">{{ left_detailForm.remark }}</div>
                    </div>
                </template>
                <!--详情内容-->
                <template slot="common-content">
                    <!--按钮区域-->
                    <div class="tab-btn-wrap" :style="{left: tabLeft}"  v-if="activeName === 'second'">
                        <el-button class="btn-cyan" @click="handleAddChild" v-if="left_detailForm.docStatus < 50&&!otherVariable.isChildEdit">增行</el-button>
                        <el-button @click="handleCancelChild" v-if="otherVariable.isChildEdit">取消</el-button>
                        <el-button class="btn-cyan search-btn" @click="handleSaveChild" v-if="otherVariable.isChildEdit">保存</el-button>
                    </div>
                    <!--tab区域-->
                    <el-tabs v-model="activeName" class="common-content-tab">
                        <el-tab-pane label="订单抬头变更" name="first" :disabled="otherVariable.isChildEdit">
                            <div v-if="isResize" :style="{height: formHeight + 'px',overflowY: 'auto'}">
                                <el-form :model="detailForm" label-width="100px" style="margin-top: 30px;">
                                    <el-form-item label="变更请求内容">
                                        <el-input v-model="detailForm.changeText" :disabled="true" style="width: 96%" type="textarea" :rows="2"></el-input>
                                    </el-form-item>
                                </el-form>
                                <div class="tab-form-wrap" style="padding:0">
                                    <el-form class="tab-form-item" :model="detailForm" label-width="100px">
                                        <h3 style="text-align: center">原值</h3>
                                        <!--<el-form-item label="下单日期">
                                            <el-date-picker type="date" v-model="detailForm.orderOldDocDate" :disabled="true" style="width: 100%"></el-date-picker>
                                        </el-form-item>-->
                                        <!--<el-form-item label="交货日期">
                                            <el-date-picker type="date" v-model="detailForm.orderOldDeliveryDate" :disabled="true" style="width: 100%"></el-date-picker>
                                        </el-form-item>-->
                                        <el-form-item label="交货天数">
                                            <el-input v-model="detailForm.orderOldDeliveryDays" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="货期等级">
                                            <el-select v-model="detailForm.orderOldDeliveryLevel" :disabled="true" style="width: 100%">
                                                <el-option
                                                    v-for="(item,index) in deliveryLevelList"
                                                    :key="index"
                                                    :label="item.dictText"
                                                    :value="item.dictValue">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="单据类型">
                                            <el-select v-model="detailForm.orderOldDocType" :disabled="true" style="width: 100%">
                                                <el-option
                                                    v-for="(item,index) in orderTypeList"
                                                    :key="index"
                                                    :label="item.dictText"
                                                    :value="item.dictText">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- <el-form-item label="客户">
                                             <el-input v-model="detailForm.orderOldClientCode" :readonly="true" style="width: 100%"></el-input>
                                         </el-form-item>-->
                                        <el-form-item label="工程名称">
                                            <el-input v-model="detailForm.orderOldProjectName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="包装方式">
                                            <el-input v-model="detailForm.orderOldPackMethodName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="喷码">
                                            <el-input v-model="detailForm.orderOldUsrTxt1Name" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="客户po">
                                            <el-input v-model="detailForm.orderOldClientPo" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="开票类型">
                                            <el-input v-model="detailForm.orderOldVatTypeName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="贴膜要求">
                                            <el-input v-model="detailForm.orderOldPadPastingMethodName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="提货方式">
                                            <el-input v-model="detailForm.orderOldLoaderMethodName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="生产方式">
                                            <el-input v-model="detailForm.orderOldPrdMethodName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="支数上限">
                                            <el-input v-model="detailForm.orderOldDigitUpperRate" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="支数下限">
                                            <el-input v-model="detailForm.orderOldDigitLowerRate" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="生产基地">
                                            <el-input v-model="detailForm.orderOldSupplyCompanyName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="客户标签1">
                                            <el-input v-model="detailForm.orderOldUsrLabelText1" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="客户标签2">
                                            <el-input v-model="detailForm.orderOldUsrLabelText2" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-form-item label="理重发货">
                                            <el-select
                                                placeholder=" "
                                                clearable
                                                :disabled="true"
                                                v-model="detailForm.orderOldIsTheory"
                                                style="width: 100%"
                                            >
                                                <el-option
                                                    v-for="(item,index) in getStaticList('isTrue')"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="打捆发货">
                                            <el-select
                                                placeholder=" "
                                                clearable
                                                :disabled="true"
                                                v-model="detailForm.orderOldIsBundle"
                                                style="width: 100%"
                                            >
                                                <el-option
                                                    v-for="(item,index) in getStaticList('isTrue')"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="据挂痕">
                                            <el-select
                                                placeholder=" "
                                                clearable
                                                :disabled="true"
                                                v-model="detailForm.orderOldIsSawTrace"
                                                style="width: 100%"
                                            >
                                                <el-option
                                                    v-for="(item,index) in getStaticList('isTrue')"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="备注说明">
                                            <el-input v-model.trim="detailForm.orderOldRemark" :disabled="true" style="width: 100%" type="textarea" :rows="2"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <el-form class="tab-form-item" :model="addOrEditForm" label-width="50px">
                                        <h3 style="text-align: center">新值</h3>
                                        <!--下单日期-->
                                        <!--<el-form-item label=" ">
                                            <el-date-picker type="date" value-format="yyyy-MM-dd" :readonly="!isNewEdit" v-model="addOrEditForm.orderNewDocDate" placeholder="选择日期" style="width: 100%"></el-date-picker>
                                        </el-form-item>-->
                                        <!--交货日期-->
                                        <!--<el-form-item label=" ">
                                            <el-date-picker type="date" value-format="yyyy-MM-dd" :readonly="true" v-model="addOrEditForm.orderNewDeliveryDate" placeholder="选择日期" style="width: 100%"></el-date-picker>
                                        </el-form-item>-->
                                        <!--交货天数-->
                                        <el-form-item label=" ">
                                            <el-input v-Int v-model="detailForm.orderNewDeliveryDays" :readonly="!isNewEdit" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--货期等级-->
                                        <el-form-item label=" ">
                                            <el-select clearable v-model="addOrEditForm.orderNewDeliveryLevel" :disabled="!isNewEdit" @change="setDelivery" style="width: 100%">
                                                <el-option
                                                    v-for="(item,index) in deliveryLevelList"
                                                    :key="index"
                                                    :label="item.dictText"
                                                    :value="item.dictValue">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!--单据类型-->
                                        <el-form-item label=" ">
                                            <el-select clearable v-model="addOrEditForm.orderNewDocType" :disabled="!isNewEdit" style="width: 100%">
                                                <el-option
                                                    v-for="(item,index) in orderTypeList"
                                                    :key="index"
                                                    :label="item.dictText"
                                                    :value="item.dictText">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!--客户-->
                                        <!--<el-form-item label=" ">
                                            <SelectEnter
                                                ref="clientSelect"
                                                :disabled="!isNewEdit"
                                                :inputValue="valueObj.clientCode"
                                                :selectTHs="valueObj.clientTHs"
                                                :selectTds="valueObj.clientList"
                                                placeholder="请选择"
                                                @getList="getClient"
                                                @setObj="setClient"
                                                selectLabel="fcode"
                                                selectValue="fcode"
                                                selectKey="fid">
                                            </SelectEnter>
                                        </el-form-item>-->
                                        <!--工程-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewProjectName" :readonly="!isNewEdit" style="width: 100%"></el-input>
                                            <!--<SelectEnter
                                                ref="projectSelect"
                                                :disabled="!isNewEdit"
                                                v-model="valueObj.projectName"
                                                :inputValue="valueObj.projectName"
                                                :selectTHs="valueObj.projectTHs"
                                                :selectTds="valueObj.projectList"
                                                placeholder="请回车搜索并选择"
                                                @getList="getProject"
                                                @setObj="setProject"
                                                selectLabel="projectName"
                                                selectValue="projectCode"
                                                selectKey="fid">
                                            </SelectEnter>-->
                                        </el-form-item>
                                        <!--包装方式-->
                                        <el-form-item label=" ">
                                            <SelectEnter
                                                :disabled="!isNewEdit"
                                                ref="packMethodSelect"
                                                :inputValue="valueObj.packMethodName"
                                                :selectTHs="valueObj.packMethodTHs"
                                                :selectTds="valueObj.mdmPackList"
                                                placeholder="请回车搜索并选择"
                                                @getList="getMdmPackMethod"
                                                @setObj="setPackMethod"
                                                selectLabel="fname"
                                                selectValue="fname"
                                                selectKey="fid">
                                            </SelectEnter>
                                        </el-form-item>
                                        <!--喷码-->
                                        <el-form-item label=" ">
                                            <SelectEnter
                                                :disabled="!isNewEdit"
                                                ref="usr1Select"
                                                :inputValue="valueObj.markMethod"
                                                :selectTHs="valueObj.markMethodTHs"
                                                :selectTds="valueObj.markMethodList"
                                                placeholder="请回车搜索并选择"
                                                @getList="getMarkMethod"
                                                @setObj="setMarkMethod"
                                                selectLabel="fname"
                                                selectValue="fname"
                                                selectKey="fid">
                                            </SelectEnter>
                                        </el-form-item>
                                        <!--客户po-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewClientPo" :readonly="!isNewEdit" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--开票类型-->
                                        <el-form-item label=" ">
                                            <el-select
                                                clearable
                                                :disabled="!isNewEdit"
                                                v-model="detailForm.orderNewVatTypeCode"
                                                @change="setVatTypeName"
                                                style="width: 100%"
                                            >
                                                <el-option
                                                    v-for="(item,index) in vatTypeNameList"
                                                    :key="index"
                                                    :label="item.dictText"
                                                    :value="item.dictValue">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!--贴膜要求-->
                                        <el-form-item label=" ">
                                            <el-select
                                                clearable
                                                :disabled="!isNewEdit"
                                                v-model="detailForm.orderNewPadPastingMethodCode"
                                                @change="setPadPastingMethod"
                                                style="width: 100%"
                                            >
                                                <el-option
                                                    v-for="(item,index) in padPastingMethodList"
                                                    :key="index"
                                                    :label="item.fname"
                                                    :value="item.fcode">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!--提货方式-->
                                        <el-form-item label=" ">
                                            <el-select
                                                clearable
                                                :disabled="!isNewEdit"
                                                v-model="detailForm.orderNewLoaderMethodName"
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
                                        </el-form-item>
                                        <!--生产方式-->
                                        <el-form-item label=" ">
                                            <el-select
                                                clearable
                                                :disabled="!isNewEdit"
                                                v-model="detailForm.orderNewPrdMethodCode"
                                                @change="setPrdMethod"
                                                style="width: 100%"
                                            >
                                                <el-option
                                                    v-for="(item,index) in prdMethodList"
                                                    :key="index"
                                                    :label="item.fname"
                                                    :value="item.fcode">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!--支数上限-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewDigitUpperRate" :readonly="!isNewEdit" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--支数下限-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewDigitLowerRate" :readonly="!isNewEdit" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--生产基地-->
                                        <el-form-item label=" ">
                                            <el-select
                                                clearable
                                                :disabled="!isNewEdit"
                                                v-model="detailForm.orderNewSupplyCompanyCode"
                                                @change="setSupplyCompany"
                                                style="width: 100%"
                                            >
                                                <el-option
                                                    v-for="(item,index) in supplyCompanyList"
                                                    :key="index"
                                                    :label="item.fName"
                                                    :value="item.fCode">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!--客户标签1-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewUsrLabelText1" :readonly="!isNewEdit" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--客户标签2-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewUsrLabelText2" :readonly="!isNewEdit" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--理重发货-->
                                        <el-form-item label=" ">
                                            <el-select
                                                clearable
                                                :disabled="!isNewEdit"
                                                v-model="detailForm.orderNewIsTheory"
                                                style="width: 100%"
                                            >
                                                <el-option
                                                    v-for="(item,index) in getStaticList('isTrue')"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!--打捆发货-->
                                        <el-form-item label=" ">
                                            <el-select
                                                clearable
                                                :disabled="!isNewEdit"
                                                v-model="detailForm.orderNewIsBundle"
                                                style="width: 100%"
                                            >
                                                <el-option
                                                    v-for="(item,index) in getStaticList('isTrue')"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!--据挂痕-->
                                        <el-form-item label=" ">
                                            <el-select
                                                clearable
                                                :disabled="!isNewEdit"
                                                v-model="detailForm.orderNewIsSawTrace"
                                                style="width: 100%"
                                            >
                                                <el-option
                                                    v-for="(item,index) in getStaticList('isTrue')"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!--备注说明-->
                                        <el-form-item label=" ">
                                            <el-input v-model.trim="detailForm.orderNewRemark" :disabled="!isNewEdit" style="width: 100%" type="textarea" :rows="2"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="订单明细变更" name="second" :disabled="isNewEdit">
                            <el-table
                                v-if="isResize"
                                tooltip-effect="dark"
                                v-loading="loadingI"
                                :data="tabDataI"
                                @row-click="clickDetail"
                                border
                                show-summary
                                :summary-method="getSummaries"
                                :height="tableHeight"
                                highlight-current-row
                                @header-click="clickHeader"
                                @selection-change="handleSelectionChange"
                            >
                                <el-table-column type="selection" width="40"></el-table-column>
                                <el-table-column label="序号" align="center" width="40">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="变更请求内容"  align="left" width="150" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.changeText }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="项目号" align="left" width="130">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.itemNo }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="型材型号" :align="otherVariable.isChildEdit?'center':'left'" width="110px" label-class-name="table-valid-head" :show-overflow-tooltip="!otherVariable.isChildEdit">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.matCode }}</span>
                                        <SelectEnter
                                            v-if="scope.row.isEditState"
                                            data-index
                                            @inputFocus="setFocus(0)"
                                            @selected="nextFocus"
                                            :inputWidth="109+'px'"
                                            :inputValue="matCode"
                                            :selectTHs="matCodeTHs"
                                            :selectTds="matCodeList"
                                            @getList="getMatCodeList"
                                            @setObj="setMatCode"
                                            selectLabel="fcode"
                                            selectValue="fcode"
                                            selectKey="fid"
                                            :disabled="Boolean(scope.row.itemNo && scope.row.itemNo.includes('.'))||(scope.row.isCombine === 1)">
                                        </SelectEnter>
                                    </template>
                                </el-table-column>
                                <el-table-column label="颜色代码" :align="otherVariable.isChildEdit?'center':'left'" width="120px" label-class-name="table-valid-head" :show-overflow-tooltip="!otherVariable.isChildEdit">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.cx1Name }}</span>
                                        <SelectEnter
                                            v-if="scope.row.isEditState"
                                            data-index
                                            @inputFocus="setFocus(1)"
                                            @selected="nextFocus"
                                            :inputWidth="119+'px'"
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
                                <el-table-column label="颜色名称" prop="colorDescribe" align="left" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column label="颜色类别" prop="colorGroupName" align="left" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column label="材质" :align="otherVariable.isChildEdit?'center':'left'" width="80px" :show-overflow-tooltip="!otherVariable.isChildEdit">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.cx2Name }}</span>
                                        <SelectEnter
                                            v-if="scope.row.isEditState"
                                            data-index
                                            @inputFocus="setFocus(2)"
                                            @selected="nextFocus"
                                            :inputWidth="79+'px'"
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
                                <el-table-column label="长度 m" :align="otherVariable.isChildEdit?'center':'right'" width="80" label-class-name="table-valid-head">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r" v-if="!scope.row.isEditState">{{ scope.row.cx4Name }}</span>
                                        <el-input
                                            style="width: 79px"
                                            v-if="scope.row.isEditState"
                                            data-index
                                            @keydown.enter.native="nextFocus($event,true,scope.row.cx4Name,'长度')"
                                            @focus="setFocus(3)"
                                            v-model="scope.row.cx4Name"
                                            :disabled="Boolean(scope.row.itemNo && scope.row.itemNo.includes('.'))||(scope.row.isCombine === 1)">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="膜厚" :align="otherVariable.isChildEdit?'center':'right'" width="80px">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.cx3Name }}</span>
                                        <SelectEnter
                                            v-if="scope.row.isEditState"
                                            data-index
                                            @inputFocus="setFocus(4)"
                                            @selected="nextFocus"
                                            :inputWidth="79+'px'"
                                            :inputValue="matThick"
                                            :selectTHs="matThickTHs"
                                            :selectTds="matThickList"
                                            @getList="getMatThick"
                                            @setObj="setMatThick"
                                            selectLabel="fcode"
                                            selectValue="fcode"
                                            selectKey="fid">
                                        </SelectEnter>
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单数" width="70px" prop="digit" :align="otherVariable.isChildEdit?'center':'right'" label-class-name="table-valid-head">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r" v-if="!scope.row.isEditState">{{ scope.row.digit }}</span>
                                        <el-input
                                            v-Int
                                            style="width: 69px"
                                            data-index
                                            @keydown.enter.native="nextFocus($event,true,scope.row.digit,'订单数')"
                                            @focus="setFocus(5)"
                                            v-if="scope.row.isEditState"
                                            v-model="scope.row.digit"
                                            :disabled="Boolean(scope.row.itemNo && scope.row.itemNo.includes('.'))||(scope.row.isCombine === 1)">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="米重 kg/m" align="right">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.meterWght ? parseFloat(scope.row.meterWght).toFixed(3) : '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="支重 kg/pcs" align="right">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.unitWght ? parseFloat(scope.row.unitWght).toFixed(3) : '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="理重 kg" align="right" prop="theoryWght">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.theoryWght ? parseFloat(scope.row.theoryWght).toFixed(3) : '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="喷码" :align="otherVariable.isChildEdit?'center':'left'" width="80px" :show-overflow-tooltip="!otherVariable.isChildEdit">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.usrTxt1Name}}</span>
                                        <SelectEnter
                                            v-if="scope.row.isEditState"
                                            data-index
                                            @inputFocus="setFocus(6)"
                                            @selected="nextFocus"
                                            :inputWidth="79+'px'"
                                            :inputValue="markMethod"
                                            :selectTHs="markMethodTHs"
                                            :selectTds="markMethodList"
                                            @getList="_getMarkMethod"
                                            @setObj="_setMarkMethod"
                                            selectLabel="fname"
                                            selectValue="fname"
                                            selectKey="fid">
                                        </SelectEnter>
                                    </template>
                                </el-table-column>
                                <el-table-column label="禁喷类型" width="120px" align="left">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.usrTxt2Name }}</span>
                                        <el-select
                                            clearable
                                            v-if="scope.row.isEditState"
                                            v-model="scope.row.usrTxt2Name"
                                            style="width:100%;background:#fff;border-radius: 5px;"
                                            data-index
                                            @focus="setFocus(7)"
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
                                <el-table-column label="撕筋" width="55" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.usrTxt3 === '1' ? '✔' : '×' }}</span>
                                        <el-select
                                            clearable
                                            placeholder=" "
                                            v-if="scope.row.isEditState"
                                            v-model="scope.row.usrTxt3"
                                            style="width:100%;background:#fff;border-radius: 5px;"
                                            data-index
                                            @focus="setFocus(8)"
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
                                <el-table-column label="胶条规格" :align="otherVariable.isChildEdit?'center':'left'" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.usrTxt6Name }}</span>
                                        <el-input
                                            data-index
                                            @keydown.enter.native="nextFocus"
                                            @focus="setFocus(9)"
                                            v-if="scope.row.isEditState"
                                            v-model="scope.row.usrTxt6Name">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注" width="200" :align="otherVariable.isChildEdit?'center':'left'" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.remark }}</span>
                                        <el-input
                                            style="width:199px"
                                            data-index
                                            @keydown.native="handleLastCell($event)"
                                            v-if="scope.row.isEditState"
                                            v-model.trim="scope.row.remark">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="55" fixed="right" v-if="left_detailForm.docStatus < 50 &&!otherVariable.isChildEdit">
                                    <template slot-scope="scope">
                                        <i class="el-icon-delete" title="删除" @click.stop="handleRealDeleteChild(scope.row,scope.$index)" v-if="scope.row.changType === 1"></i>
                                        <el-dropdown @command="handleCommand($event,scope.$index,tabDataI)" v-if="scope.row.changType !== 1">
                                            <span><i class="el-icon-more"></i></span>
                                            <el-dropdown-menu slot="dropdown" class="del-shadow">
                                                <template v-if="scope.row.changType !== 3">
                                                    <el-dropdown-item v-if="scope.row.orderDetailId && scope.row.isCombine !== 1" command="j">变更型材型号</el-dropdown-item>
                                                    <el-dropdown-item command="a">变更颜色</el-dropdown-item>
                                                    <el-dropdown-item command="k">变更材质</el-dropdown-item>
                                                    <el-dropdown-item command="l">变更膜厚</el-dropdown-item>
                                                    <el-dropdown-item v-if="scope.row.orderDetailId" command="b">变更长度</el-dropdown-item>
                                                    <!--<el-dropdown-item command="c">变更喷码</el-dropdown-item>-->
                                                    <el-dropdown-item command="d">变更禁喷类型</el-dropdown-item>
                                                    <el-dropdown-item command="e">变更撕筋要求</el-dropdown-item>
                                                    <el-dropdown-item command="f">变更明细备注</el-dropdown-item>
                                                    <el-dropdown-item v-if="scope.row.orderDetailId" command="g">变更订购支数</el-dropdown-item>
                                                    <el-dropdown-item command="h">删除订单明细</el-dropdown-item>
                                                </template>
                                                <template v-if="scope.row.changType === 3">
                                                    <el-dropdown-item command="i">取消删除订单明细</el-dropdown-item>
                                                </template>
                                            </el-dropdown-menu>
                                        </el-dropdown>
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
                    @handleCancel="handleCancel"
                    @handleSave="handleSave"

                >
                    <template slot="head-form-title">
                        <div class="head-form-title">
                            <span>{{otherVariable.popupTitle}}</span>
                        </div>
                    </template>
                    <template slot="custom-add-form">
                        <div>
                            <el-form :model="searchChooseForm" :inline="true">
                                <el-form-item label="下单日期">
                                    <el-date-picker
                                        v-model="searchChooseForm.orderDocDateStart"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="至：">
                                    <el-date-picker
                                        v-model="searchChooseForm.orderDocDateEnd"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="订单号">
                                    <el-input v-model.trim="searchChooseForm.refDocCode"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button class="btn-cyan add-btn" @click="getChooseTableData">查询</el-button>
                                    <el-button @click="resetChooseTable">重置</el-button>
                                </el-form-item>
                            </el-form>
                            <el-table border highlight-current-row :data="chooseTableData" @row-click="chooseRow" :height="$store.state.screenHei*0.60">
                                <el-table-column prop="refDocCode" label="订单号"></el-table-column>
                                <el-table-column prop="docStatusName" label="状态"></el-table-column>
                                <el-table-column prop="docType" label="单据类型"></el-table-column>
                                <el-table-column prop="docDate" label="下单日期"></el-table-column>
                                <el-table-column prop="deliveryDate" label="交货日期"></el-table-column>
                                <el-table-column prop="clientCode" label="客户代码"></el-table-column>
                                <el-table-column prop="clientCode2" label="经销商代码"></el-table-column>
                                <el-table-column prop="projectName" label="工程名称" :show-overflow-tooltip="true"></el-table-column>
                            </el-table>
                            <!--分页区域-->
                            <CommonPagination
                                :pageObj="pageDialog"
                                @getData="getChooseTableData"
                            ></CommonPagination>
                        </div>
                    </template>
                </CommonAdd>
            </transition>
            <!--变更弹框-->
            <el-dialog
                :title="changeTitle"
                :visible.sync="changeVisible"
                width="30%">
                <el-form :model="changeForm" @submit.native.prevent :inline="true">
                    <el-form-item label="原值：" v-if="['length','txt1','txt2','remark','color','digit'].includes(changeType)">
                        <!--<el-input v-model.trim="changeForm.oldName" :disabled="true" style="width: 100px"></el-input>-->
                        <span style="width: 150px; font-weight: bold">{{changeForm.oldName}}</span>
                    </el-form-item>
                    <el-form-item label="原值：" v-if="['matCode','cx2Name','cx3Name'].includes(changeType)">
                        <!--<el-input v-model.trim="changeForm.oldCode" :disabled="true" style="width: 100px"></el-input>-->
                        <span style="width: 150px; font-weight: bold">{{changeForm.oldCode}}</span>
                    </el-form-item>
                    <el-form-item label="原值：" v-if="changeType === 'txt3'">
                        <span style="width: 100px">{{ changeForm.oldCode ? (changeForm.oldCode == 0 ? 'x' : '✔') : 'x'}}</span>
                    </el-form-item>
                    <el-form-item label="新值：" v-if="changeType === 'color'">
                        <SelectEnter
                            v-if="isShowNew"
                            ref="changeColorRef"
                            inputWidth="100%"
                            placeholder="请输入颜色名称回车搜索"
                            :inputValue="changeColorName"
                            :selectTHs="colorCodeTHs"
                            :selectTds="colorCodeList"
                            @getList="getColorCodeList"
                            @setObj="setChangeColor"
                            selectLabel="fname"
                            selectValue="fname"
                            selectKey="fid">
                        </SelectEnter>
                    </el-form-item>
                    <el-form-item label="新值：" v-if="changeType === 'cx2Name'">
                        <SelectEnter
                            v-if="isShowNew"
                            ref="changeCx2CodeRef"
                            inputWidth="100%"
                            placeholder="请输入材质代码回车搜索"
                            :inputValue="changeCx2Code"
                            :selectTHs="matAlloyTHs"
                            :selectTds="matAlloyList"
                            @getList="getMatAlloy"
                            @setObj="setChangeMatAlloy"
                            selectLabel="fcode"
                            selectValue="fcode"
                            selectKey="fid">
                        </SelectEnter>
                    </el-form-item>
                    <el-form-item label="新值：" v-if="changeType === 'cx3Name'">
                        <SelectEnter
                            v-if="isShowNew"
                            ref="changeCx3CodeRef"
                            inputWidth="100%"
                            placeholder="请输入膜厚名称回车搜索"
                            :inputValue="changeCx3Code"
                            :selectTHs="matThickTHs"
                            :selectTds="matThickList"
                            @getList="getMatThick"
                            @setObj="setChangeThick"
                            selectLabel="fname"
                            selectValue="fname"
                            selectKey="fid">
                        </SelectEnter>
                    </el-form-item>
                    <el-form-item label="新值：" v-if="changeType === 'matCode'">
                        <SelectEnter
                            v-if="isShowNew"
                            ref="changeMatCodeRef"
                            inputWidth="100%"
                            placeholder="请输入型材型号回车搜索"
                            :inputValue="changeMatCode"
                            :selectTHs="matCodeTHs"
                            :selectTds="matCodeList"
                            @getList="getMatCodeList"
                            @setObj="setChangeMatCode"
                            selectLabel="fcode"
                            selectValue="fcode"
                            selectKey="fid">
                        </SelectEnter>
                    </el-form-item>
                    <el-form-item label="新值：" v-if="changeType === 'length'">
                        <el-input v-if="isShowNew" v-model.trim="changeForm.newName"></el-input>
                    </el-form-item>
                    <el-form-item label="新值：" v-if="changeType === 'txt1'">
                        <el-input v-if="isShowNew" v-model.trim="changeForm.newName"></el-input>
                    </el-form-item>
                    <el-form-item label="新值：" v-if="changeType === 'txt2'">
                        <el-select v-if="isShowNew" clearable v-model="usrTxt2Name" @change="setChangeUsrTxt2">
                            <el-option
                                v-for="(item,index) in usrTxt2List"
                                :key="index"
                                :label="item.dictText"
                                :value="item.dictText">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="新值：" v-if="changeType === 'txt3'">
                        <el-checkbox v-if="isShowNew" v-model="tempSelect" :true-label="1" :false-label="0" @change="setChangeSelect"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="新值：" v-if="changeType === 'remark'">
                        <el-input v-if="isShowNew" type="textarea" :rows="2" v-model.trim="changeForm.newName"></el-input>
                    </el-form-item>
                    <el-form-item label="新值：" v-if="changeType === 'digit'">
                        <el-input v-if="isShowNew" v-model.trim="changeForm.newName"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="returnOldVal">还原</el-button>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="changeVisible = false">取 消</el-button>
                    <el-button class="btn-cyan add-btn" @click="_saveChange(changeType,false)">确 定</el-button>
                </span>
            </el-dialog>
            <!--批量变更弹框-->
            <el-dialog
                :title="changeTitle"
                :visible.sync="multiChangeVisible"
                width="30%">
                <el-form :model="multiChangeForm" @submit.native.prevent>
                    <el-form-item label="型材型号" v-if="changeType === 'matCode'">
                        <SelectEnter
                            ref="changeMatCodeRef"
                            inputWidth="100%"
                            placeholder="请输入型材型号回车搜索"
                            :inputValue="changeMatCode"
                            :selectTHs="matCodeTHs"
                            :selectTds="matCodeList"
                            @getList="getMatCodeList"
                            @setObj="_setChangeMatCode"
                            selectLabel="fcode"
                            selectValue="fcode"
                            selectKey="fid">
                        </SelectEnter>
                    </el-form-item>
                    <el-form-item label="颜色" v-if="changeType === 'color'">
                        <SelectEnter
                            ref="changeColorRef"
                            inputWidth="100%"
                            placeholder="请输入颜色名称回车搜索"
                            :inputValue="changeColorName"
                            :selectTHs="colorCodeTHs"
                            :selectTds="colorCodeList"
                            @getList="getColorCodeList"
                            @setObj="_setChangeColor"
                            selectLabel="fname"
                            selectValue="fname"
                            selectKey="fid">
                        </SelectEnter>
                    </el-form-item>
                    <el-form-item label="材质" v-if="changeType === 'cx2Name'">
                        <SelectEnter
                            ref="changeCx2CodeRef"
                            inputWidth="100%"
                            placeholder="请输入材质代码回车搜索"
                            :inputValue="changeCx2Code"
                            :selectTHs="matAlloyTHs"
                            :selectTds="matAlloyList"
                            @getList="getMatAlloy"
                            @setObj="_setChangeMatAlloy"
                            selectLabel="fcode"
                            selectValue="fcode"
                            selectKey="fid">
                        </SelectEnter>
                    </el-form-item>
                    <el-form-item label="膜厚" v-if="changeType === 'cx3Name'">
                        <SelectEnter
                            ref="changeCx2CodeRef"
                            inputWidth="100%"
                            placeholder="请输入膜厚名称回车搜索"
                            :inputValue="changeCx3Code"
                            :selectTHs="matThickTHs"
                            :selectTds="matThickList"
                            @getList="getMatThick"
                            @setObj="_setChangeThick"
                            selectLabel="fname"
                            selectValue="fname"
                            selectKey="fid">
                        </SelectEnter>
                    </el-form-item>
                    <el-form-item label="长度" v-if="changeType === 'length'">
                        <el-input v-model.trim="multiChangeForm.newName"></el-input>
                    </el-form-item>
                    <el-form-item label="禁喷类型" v-if="changeType === 'txt2'">
                        <el-select clearable v-model="multiUsrTxt2Name" @change="_setChangeUsrTxt2">
                            <el-option
                                v-for="(item,index) in usrTxt2List"
                                :key="index"
                                :label="item.dictText"
                                :value="item.dictText">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="撕筋要求" v-if="changeType === 'txt3'">
                        <el-checkbox v-model="multiTempSelect" :true-label="1" :false-label="0" @change="_setChangeSelect"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="明细备注" v-if="changeType === 'remark'">
                        <el-input type="textarea" :rows="2" v-model.trim="multiChangeForm.newName"></el-input>
                    </el-form-item>
                    <el-form-item label="订购支数" v-if="changeType === 'digit'">
                        <el-input v-model.trim="multiChangeForm.newName"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="multiChangeVisible = false">取 消</el-button>
                    <el-button class="btn-cyan add-btn" @click="_saveChange(changeType,true)">确 定</el-button>
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
                formHeight: 526,
                tableHeight: this.$store.state.screenHei*0.65,
                mainHeight: 716,
                isResize: true,
                operateType: 'add',
                isNewEdit: false,
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                //键盘操作
                currentIndex: 0,
                enterTimes: 1,
                isBanNextFocus: false,
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    detailTitle: '编辑订单',
                    addTitle: '新建订单',
                    popupTitle: '',
                    isInlineForm: true,
                    isEdit: false,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    loading: false,
                    $isCustom: true,
                    isNotValidate: true,
                    isReadTable: true
                },
                tempWidth: null,
                tableData: [],
                //搜索映射表
                searchProp: [
                    {
                        name:'订单号',
                        prop:'orderDocCode',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入订单单号'
                    },
                    {
                        name:'变更单号',
                        prop:'orderChangeCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false,
                        placeholder:'请输入变更单号'
                    },
                    {
                        name:'客户代码',
                        prop:'clientCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'客户名称',
                        prop:'clientName',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'变更状态',
                        prop:'docStatus',
                        type:'select',
                        selectList:[{value:null,label:'全部'},{value:0,label:'未提交'},{value:50,label:'已提交'}],
                        isMainSearch:false,
                        isMain:false
                    },
                    {
                        name:'变更日期',
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
                    {name:'变更单号',prop:'orderChangeCode',type:'outter'},
                    {name:'变更日期',prop:'docDate',type:'outter'},
                    {name:'单据状态',prop:'docStatusName',type:'outter'},
                    {name:'制单人',prop:'enterName',type:'outter'},
                    {name:'制单时间',prop:'enterTime',type:'outter'},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'经销商',prop:'clientCode2',type:'inner'},
                    {name:'订单号',prop:'orderDocCode',type:'inner'},
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
                        prop1:'orderChangeCode',
                        name2:'状态',
                        prop2:'docStatusName',
                        status: 'docStatus',
                        type:'mixinStatus',
                        width: '125',
                    },
                    {
                        name1:'订单号/',
                        prop1:'orderDocCode',
                        name2:'变更日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '128'
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
                        name1:'流程单号/',
                        prop1:'docCode',
                        name2:'工程名称',
                        prop2:'projectName',
                        type:'mixin',
                        width: '130',
                        tooltip: true
                    }
                ],
                searchForm: {docStatus: 0},
                addOrEditForm: {},
                detailForm: {},
                left_detailForm: {},
                copyForm: {},
                tempForm: {},
                submitRow: {},
                detailId: null,
                usrTxt1Name: null,
                orderDocStatus: null,
                orderChangeDocStatus: null,
                docCode: null,
                docStatus: null,
                pageObj: {
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
                //选择订单
                searchChooseForm: {minStatus:100,minStatusOperator:'>='},
                chooseTableData: [],
                //详情表格内容
                tabLeft: '300px',
                activeName: 'first',
                childDetailRow: {},
                editIndex: 0,
                //订单明细数据
                tabDataI: [],
                loadingI: false,
                isShowNotAllowed: false,
                selectDetailList: [],
                //变更
                changeVisible: false,
                changeType: '',
                changeForm: {},
                changeTitle: '',
                changeColorName: '',
                changeCx2Code: '',
                changeCx3Code: '',
                changeMatCode: '',
                tempSelect: false,
                isShowNew: true,
                //批量变更
                multiChangeVisible: false,
                multiChangeForm: {},
                multiTempSelect: false,
                //型号
                matCode: '',
                matCodeList: [],
                matCodeTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //颜色
                colorName: '',
                colorCodeList: [],
                colorCodeTHs: [
                    //{label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //材质资料
                matAlloy: '',
                matAlloyList: [],
                matAlloyTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //获取膜厚
                matThick: '',
                matThickList: [],
                matThickTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //获取喷码
                markMethod: '',
                markMethodTHs: [],
                markMethodList: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //销售类型
                sellTypeList: [],
                //单据类型
                orderTypeList: [],
                //货期等级
                deliveryLevelList: [],
                //包装方式
                packMethodList: [],
                //提货方式
                deliveryMethodList: [],
                //开票类型
                vatTypeNameList: [],
                //贴膜要求
                padPastingMethodList: [],
                //生产方式
                prdMethodList: [],
                //生产基地
                supplyCompanyList: [],
                //禁喷类型
                usrTxt2Name: '',
                multiUsrTxt2Name: '',
                usrTxt2List: [],
                valueObj: {
                    //工程列表
                    projectName: null,
                    projectList: [],
                    projectTHs: [
                        {label:'代码',prop:'projectCode'},
                        {label:'名称',prop:'projectName'}
                    ],
                    //包装方式
                    packMethodName: null,
                    mdmPackList: [],
                    packMethodTHs: [
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
                    //合同编号
                    contractCode: null,
                    contractList: [],
                    contractTHs: [
                        {label:'代码',prop:'fcode'},
                        {label:'名称',prop:'fname'}
                    ],
                    //客户
                    clientCode: null,
                    clientList: [],
                    clientTHs: [
                        {label:'代码',prop:'fcode'},
                        //{label:'名称',prop:'fname'}
                    ]
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
            'isNewEdit':{
                handler(val) {
                    this.isShowNotAllowed = val;
                }
            },
        },
        mounted() {
            this.getData();
            this.getOrderType();
            this.getDeliveryLevel();
            this.getUsrTxt2List();
            this.getDeliveryMethod();
            this.getVatTypeNameList();
            this.getPadPastingMethodList();
            this.getPrdMethodList();
            this.getSupplyCompanyList();
            // 操作/布局相关
            this.listenResizeII();
            this.changeSizeII();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                if(this.searchForm.orderDocCode) {
                    this.searchForm = {orderDocCode:this.searchForm.orderDocCode}
                }else if(this.searchForm.orderChangeCode){
                    this.searchForm = {orderChangeCode:this.searchForm.orderChangeCode}
                }else {
                    this.searchForm.orderDocCode = null;
                    this.searchForm.orderChangeCode = null;
                }
                this.tableData = [];
                this.fetch(`/oms/sls/SalesOrderChange/getChangeMasterFlow?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list.length) {
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
                            this.pageObj.commonTotal = 0;
                            this.tabDataI = [];
                            this.detailForm = {};
                            this.left_detailForm = {};
                            this.addOrEditForm = {};
                            this.detailId = null;
                            this.usrTxt1Name = null;
                            this.orderDocStatus = null;
                            this.orderChangeDocStatus = null;
                        }
                    });
            },
            //刷新
            handleRefresh() {
                this.detailForm = {};
                this.left_detailForm = {};
                this.addOrEditForm = {};
                this.getData();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.clearSelect();
            },
            //重置
            handleReset() {
                this.searchForm = {docStatus: 0};
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
                this.handleCancelNew();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.selectDetailList = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.left_detailForm = row;
                this.addOrEditForm = {};
                this.copyForm = {};
                this.handleCancel(this.operateType);
                this.fetch('/oms/sls/SalesOrderChange/getChangeMaster',{fid:row.fid})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list.length) {
                            this.detailForm = result.data.list[0];
                            this.addOrEditForm = result.data.list[0];
                            this.copyForm = this.$lodash.cloneDeep(result.data.list[0]);
                            this.$nextTick(() => {
                                //this.$refs.clientSelect.inputValueData = this.addOrEditForm.orderNewClientCode;
                                //this.$refs.projectSelect.inputValueData = this.addOrEditForm.orderNewProjectName;
                                this.$refs.packMethodSelect.inputValueData = this.addOrEditForm.orderNewPackMethodName;
                                this.$refs.usr1Select.inputValueData = this.addOrEditForm.orderNewUsrTxt1Name;
                                //this.$set(this.valueObj,'clientCode',this.addOrEditForm.orderNewClientCode);
                                this.$set(this.valueObj,'projectName',this.addOrEditForm.orderNewProjectName);
                                this.$set(this.valueObj,'packMethodName',this.addOrEditForm.orderNewPackMethodName);
                                this.$set(this.valueObj,'markMethod',this.addOrEditForm.orderNewUsrTxt1Name);
                            })
                        }else {
                            this.detailForm = {};
                            this.copyForm = {};
                        }
                    });
                this.getChildTable(row.fid);
                this.detailId = row.fid;
                this.usrTxt1Name = row.orderOldUsrTxt1Name;
                this.orderDocStatus = row.orderDocStatus;
                this.orderChangeDocStatus = row.orderChangeDocStatus;
                this.docCode = row.docCode;
                this.docStatus = row.docStatus;
            },
            //主表添加行
            handleAdd() {
                this.operateType = 'add';
                this.addOrEditForm = {};
                this.isShowStatus.isPopUp = true;
                this.otherVariable.popupTitle = '选择订单';
                this.otherVariable.isEdit = false;
                this.getChooseTableData();
            },
            //清空选择组件的数据
            clearSelect() {
                //this.$refs.clientSelect.inputValueData = '';
                //this.$refs.projectSelect.inputValueData = '';
                this.$refs.packMethodSelect.inputValueData = '';
                this.$refs.usr1Select.inputValueData = '';
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
                if(this.isNewEdit) {
                    this.$confirm('此操作将清空已填写的数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.handleCancelNew();
                    }).catch(() => {
                        console.log('cnacel')
                    })
                }
            },
            //主表新增时获取数据
            getChooseTableData() {
                this.chooseTableData = [];
                this.fetch(`/oms/sls/SalesOrderMaster/getOrderMaster?pageNo=${this.pageDialog.commonPage}&pageSize=${this.pageDialog.commonSize}`,this.searchChooseForm)
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            this.chooseTableData = result.data.list;
                            this.pageDialog.commonTotal = result.data.total;
                        }else{
                            this.pageDialog.commonTotal = 0;
                        }
                    })
            },
            resetChooseTable() {
                this.searchChooseForm = {minStatus:100,minStatusOperator:'>='};
                this.getChooseTableData();
            },
            //选择新增的行
            chooseRow(row) {
                this.addOrEditForm = row;
            },
            //主表编辑行
            handleEdit() {
                this.operateType = 'edit';
                this.otherVariable.popupTitle = this.otherVariable.detailTitle;
                this.otherVariable.isEdit = true;
                this.addOrEditForm = this.detailForm;
                if(this.detailId) {
                    this.isShowStatus.isPopUp = true;
                    //客户
                    //this.$set(this.addOrEditForm,'orderNewClientCode',this.detailForm.orderNewClientCode);
                    //this.$set(this.valueObj,'clientCode',this.detailForm.orderNewClientCode);
                    //工程
                    this.$set(this.addOrEditForm,'orderNewProjectName',this.detailForm.orderNewProjectName);
                    this.valueObj.projectName = this.detailForm.orderNewProjectName;
                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    })
                }
            },
            //主表新增保存行
            handleSave() {
                if(this.addOrEditForm.fid) {
                    this.fetch('/oms/sls/SalesOrderChange/addChangeMaster?orderMasterId='+this.addOrEditForm.fid)
                        .then(result => {
                            if(result.status === 200) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.isShowStatus.isPopUp = false;
                                this.handleRefresh();
                            }else {
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                })
                            }
                        })
                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    })
                }
            },
            //主表编辑保存行
            handleEditSave() {
                this.addOrEditForm.fid = this.detailId;
                this.addOrEditForm.docCode = this.docCode;
                this.addOrEditForm.orderNewSellType = 1;
                this.addOrEditForm.orderNewProjectCode = this.detailForm.orderOldProjectCode;
                let resultStatus;
                this.fetch('/oms/sls/SalesOrderChange/updateMaster',this.addOrEditForm)
                    .then(result => {
                        resultStatus = result.status;
                        if(result.status === 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.getData(false);
                            this.isNewEdit = false;
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            });
                        }
                    })
            },
            handleEditNew() {
                this.isNewEdit = true;
            },
            handleCancelNew() {
                this.isNewEdit = false;
                this.handleCancel();
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
            },
            //主表确认
            handleConfirm() {
                let tips = '是否提交？';
                if(this.orderChangeDocStatus < 80) {
                    tips = '是否提交<strong>并执行审核</strong>？'
                }
                if(this.detailId) {
                    this.$confirm(`${tips}`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        dangerouslyUseHTMLString: true
                    }).then(() => {
                        let resultStatus;
                        this.getAjax(`/oms/sls/SalesOrderChange/confirmChangeOrder?orderChangeMasterId=${this.detailId}`)
                            .then(result => {
                                resultStatus = result.status;
                                if (result.status === 200) {
                                    this.$message({
                                        message: result.message,
                                        type: 'success'
                                    });
                                    this.getInitPage();
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    })
                                }
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
            //主表撤销
            handleUnConfirm() {
                if(this.detailId) {
                    this.$confirm('是否撤销?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let resultStatus;
                        this.getAjax(`/oms/sls/SalesOrderChange/unConfirmChangeOrder?orderChangeMasterId=${this.detailForm.fid}`)
                            .then(result => {
                                resultStatus = result.status;
                                if (result.status === 200) {
                                    this.$message({
                                        message: result.message,
                                        type: 'success'
                                    });
                                    this.getInitPage();
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    })
                                }
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
            //主表删除行
            handleDelete() {
                if(this.detailId) {
                    this.$confirm('是否删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getAjax(`/oms/sls/SalesOrderChange/deleteOrderChangeMaster?orderChangeMasterId=${this.detailId}`)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    this.detailForm = {};
                                    this.tabDataI = [];
                                    this.getInitPage();
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    });
                                }
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
            //主表作废行
            cancelOrder() {
                if(this.detailId) {
                    this.$confirm('是否作废?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getAjax(`/oms/sls/SalesOrderChange/cancelOrderChangeMasterById?orderChangeMasterId=${this.detailForm.fid}`)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '作废成功',
                                        type: 'success'
                                    });
                                    this.detailForm = {};
                                    this.tabDataI = [];
                                    this.getInitPage();
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    });
                                }
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
                this.childDetailRow.fid = null;
                this.loadingI = true;
                this.isShowNotAllowed = true;
                this.getAjax(`/oms/sls/SalesOrderChange/getOrderChangeDetail?pageSize=1000&orderChangeMasterId=${fid}`)
                    .then(result => {
                        this.loadingI = false;
                        this.isShowNotAllowed = false;
                        if(result.data && result.data.list) {
                            result.data.list.forEach(item => {
                                if(item.usrTxt3Name) {
                                    item.usrTxt3Name = item.usrTxt3Name.toLowerCase();
                                    item.usrTxt1Name = this.usrTxt1Name;
                                }
                            });
                            this.tabDataI = result.data.list;
                        }
                    })
            },
            //从表添加行
            handleAddChild() {
                this._getMarkMethod();
                this.editIndex = 0;
                if(this.detailId) {
                    this.matCode = '';
                    this.colorName = '';
                    this.matAlloy = '';
                    this.matThick = '';
                    this.markMethod = this.usrTxt1Name;
                    this.otherVariable.isChildEdit = true;
                    this.$nextTick(()=>{
                        this.tempForm = {matCode:'',matName:'',cx1:'',cx1Name:'',cx2:'',cx2Name:'',cx3:'',cx3Name:'',usrTxt1Name:this.usrTxt1Name,isEditState:true};
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
            //从表保存
            handleSaveChild() {
                let api;
                let tempObj;
                let isSave = true;
                let operate = 'edit';
                if(!this.childDetailRow.fid) {
                    operate = 'add';
                    api = '/oms/sls/SalesOrderChange/insertDetail';
                    tempObj = this.tabDataI[0];
                    tempObj.masterId = this.detailId;
                    //tempObj.usrTxt1Name = this.usrTxt1Name;
                    tempObj.docCode = this.docCode;
                    if(!(tempObj['matCode']||tempObj['cx1']||tempObj['cx2']||tempObj['cx3']||tempObj['usrTxt1Name'])) {
                        this.handleCancelChild();
                        isSave = false;
                    }
                }else {
                    operate = 'edit';
                    api = '/oms/sls/SalesOrderChange/updateDetailItem';
                    tempObj = this.childDetailRow;
                    tempObj.orderNewUsrTxt1 = this.childDetailRow.usrTxt1;
                    tempObj.orderNewUsrTxt1Name = this.childDetailRow.usrTxt1Name;
                    tempObj.orderNewUsrTxt2 = this.childDetailRow.usrTxt2;
                    tempObj.orderNewUsrTxt2Name = this.childDetailRow.usrTxt2Name;
                    tempObj.orderNewUsrTxt3 = this.childDetailRow.usrTxt3;
                    tempObj.orderNewUsrTxt3Name = this.childDetailRow.usrTxt3Name;
                    tempObj.orderNewUsrTxt6 = this.childDetailRow.usrTxt6;
                    tempObj.orderNewUsrTxt6Name = this.childDetailRow.usrTxt6Name;
                    tempObj.orderNewDigit = this.childDetailRow.digit;
                    tempObj.orderNewRemark = this.childDetailRow.remark;
                    tempObj.orderNewMatCode = this.childDetailRow.matCode;
                    tempObj.orderNewMatName = this.childDetailRow.matName;
                    tempObj.orderNewCx1 = this.childDetailRow.cx1;
                    tempObj.orderNewCx1Name = this.childDetailRow.cx1Name;
                    tempObj.orderNewCx2 = this.childDetailRow.cx2;
                    tempObj.orderNewCx2Name = this.childDetailRow.cx2Name;
                    tempObj.orderNewCx3 = this.childDetailRow.cx3;
                    tempObj.orderNewCx3Name = this.childDetailRow.cx3Name;
                    tempObj.orderNewCx4 = this.childDetailRow.cx4;
                    tempObj.orderNewCx4Name = this.childDetailRow.cx4Name;
                    tempObj.detailId = this.childDetailRow.fid;
                    //tempObj.usrTxt1Name = this.usrTxt1Name;
                }
                isSave && this.fetch(api,tempObj)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.childDetailRow.fid = null;
                            if(operate === 'edit') {
                                this.handleCancelChild();
                            }else {
                                this.getChildTable(this.detailId);
                                this.otherVariable.isChildEdit = false;
                            }
                        }else {
                            this.tabDataI[this.editIndex].isEditState = true;
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            });
                        }
                    });
                this.tabDataI = this.giveState(this.tabDataI)
            },
            //从表取消操作
            handleCancelChild() {
                this.getChildTable(this.detailId);
                this.otherVariable.isChildEdit = false;
            },
            //从表删除行
            handleRealDeleteChild(row,index) {
                if(confirm('是否确定删除?') === true) {
                    this.fetch('/oms/sls/SalesOrderChange/deleteDetail',[{fid:row.fid}])
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
            },
            //从表变更删除行
            handleDeleteChild(index,rows,isDelete = true) {
                let tempObj = {
                    orderDetailId: rows[index].orderDetailId,
                    masterId: rows[index].masterId,
                    variantId: rows[index].variantId,
                    changeDetailItemId: rows[index].changeDetailItemId
                };
                let apiUrl;
                let confirmText;
                let successText;
                if(isDelete) {
                    apiUrl = '/oms/sls/SalesOrderChange/deleteOrderChangeDetail';
                    confirmText = '是否确定删除?';
                    successText = '删除成功';
                }else {
                    apiUrl = '/oms/sls/SalesOrderChange/cancelDeleteOrderChangeDetail';
                    confirmText = '是否取消删除?';
                    successText = '取消删除成功';
                }
                if(rows[index].masterId) {
                    if(confirm(confirmText) === true) {
                        this.fetch(apiUrl,tempObj)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: successText,
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
                }else {
                    this.$message({
                        message: '新增的明细不可删除',
                        type: 'warning'
                    })
                }
            },
            handleSelectionChange(rows) {
                this.selectDetailList = rows;
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
                            digit += Number(d.digit || 0);
                            theoryWght += Number(d.theoryWght || 0);
                        }
                    })
                }
                sums[0] = '合计';
                //订单数
                sums[10] = digit;
                //理重
                theoryWght ? sums[13] = theoryWght.toFixed(3) : sums[13] = 0;
                return sums;
            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
            },
            //从表点击行
            clickDetail(row) {
                if(this.docStatus < 50 && row.changType === 1) {
                    this.otherVariable.isChildEdit = true;
                    this.tabDataI = this.giveState(this.tabDataI);
                    row.isEditState = true;
                    this.$nextTick(() => {
                        this.matCode = row.matCode;
                        this.colorName = row.cx1Name;
                        this.matAlloy = row.cx2;
                        this.matThick = row.cx3;
                        this.markMethod = row.usrTxt1Name;
                    })
                }
                this.childDetailRow = row || {};
                this.editIndex = this.$lodash.findIndex(this.tabDataI, ['fid', row.fid]);
                if(this.editIndex < 0) {
                    this.editIndex = 0;
                }
            },
            //点击表头
            clickHeader(column, event) {
                const canOperateHeadList = ['型材型号','颜色代码','材质','膜厚','长度 m','禁喷类型','撕筋','备注','订单数'];
                if(canOperateHeadList.includes(column.label)) {
                    if(this.selectDetailList.length) {
                        this.multiChangeForm.newName = '';
                        this.multiChangeForm.newCode = '';
                        switch(column.label)
                        {
                            case '型材型号':
                                this.changeType = 'matCode';
                                this.changeTitle = "变更型材型号";
                                this.$nextTick(() => {
                                    this.changeMatCode = '';
                                    this.$refs.changeMatCodeRef.inputValueData = '';
                                });
                                break;
                            case '颜色代码':
                                this.changeType = 'color';
                                this.changeTitle = "变更颜色";
                                this.$nextTick(() => {
                                    this.changeColorName = '';
                                    this.$refs.changeColorRef.inputValueData = '';
                                });
                                break;
                            case '材质':
                                this.changeType = 'cx2Name';
                                this.changeTitle = "变更材质";
                                this.$nextTick(() => {
                                    this.changeCx2Code = '';
                                    this.$refs.changeCx2CodeRef.inputValueData = '';
                                });
                                break;
                            case '膜厚':
                                this.changeType = 'cx3Name';
                                this.changeTitle = "变更膜厚";
                                this.$nextTick(() => {
                                    this.changeCx3Code = '';
                                    this.$refs.changeCx3CodeRef.inputValueData = '';
                                });
                                break;
                            case '长度 m':
                                this.changeType = 'length';
                                this.changeTitle = "变更长度";
                                break;
                            case '禁喷类型':
                                this.changeType = 'txt2';
                                this.changeTitle = "变更禁喷类型";
                                this.$nextTick(() => {
                                    this.multiUsrTxt2Name = ''
                                });
                                break;
                            case '撕筋':
                                this.changeType = 'txt3';
                                this.changeTitle = "变更撕筋要求";
                                this.$nextTick(() => {
                                    this.multiTempSelect = false
                                });
                                break;
                            case '备注':
                                this.changeType = 'remark';
                                this.changeTitle = "变更明细备注";
                                break;
                            case '订单数':
                                this.changeType = 'digit';
                                this.changeTitle = "变更订购支数";
                                break;
                            default:
                                return false
                        }
                        this.multiChangeVisible = true;
                        this.$nextTick(() => {
                            // focus
                            if(document.querySelector('.el-dialog__body').querySelectorAll('input').length) {
                                document.querySelector('.el-dialog__body').querySelectorAll('input')[0].focus()
                            }
                            if(document.querySelector('.el-dialog__body').querySelectorAll('textarea').length) {
                                document.querySelector('.el-dialog__body').querySelectorAll('textarea')[0].focus()
                            }
                        })
                    }else {
                        this.$message({
                            message: '请勾选要变更的明细',
                            type: 'warning'
                        })
                    }
                }
            },
            handleCommand(command,index,rows) {
                let fieldName = '';
                let fieldCode = '';
                switch(command)
                {
                    case 'a':
                        this.showChangeDialog(index,rows,'color');
                        this.changeTitle = "变更颜色";
                        this.changeForm.oldName = rows[index].cx1Name;
                        this.changeForm.oldCode = rows[index].cx1;
                        this.changeForm.newName = rows[index].orderNewCx1Name;
                        this.changeForm.newCode = rows[index].orderNewCx1;
                        fieldName = 'cx1Name';
                        fieldCode = 'cx1';
                        break;
                    case 'j':
                        this.showChangeDialog(index,rows,'matCode');
                        this.changeTitle = "变更型材型号";
                        this.changeForm.oldName = rows[index].matName;
                        this.changeForm.oldCode = rows[index].matCode;
                        this.changeForm.newName = rows[index].orderNewMatName;
                        this.changeForm.newCode = rows[index].orderNewMatCode;
                        fieldName = 'matName';
                        fieldCode = 'matCode';
                        break;
                    case 'k':
                        this.showChangeDialog(index,rows,'cx2Name');
                        this.changeTitle = "变更材质";
                        this.changeForm.oldName = rows[index].cx2Name;
                        this.changeForm.oldCode = rows[index].cx2;
                        this.changeForm.newName = rows[index].orderNewCx2Name;
                        this.changeForm.newCode = rows[index].orderNewCx2;
                        fieldName = 'cx2Name';
                        fieldCode = 'cx2';
                        break;
                    case 'l':
                        this.showChangeDialog(index,rows,'cx3Name');
                        this.changeTitle = "变更膜厚";
                        this.changeForm.oldName = rows[index].cx3Name;
                        this.changeForm.oldCode = rows[index].cx3;
                        this.changeForm.newName = rows[index].orderNewCx3Name;
                        this.changeForm.newCode = rows[index].orderNewCx3;
                        fieldName = 'cx3Name';
                        fieldCode = 'cx3';
                        break;
                    case 'b':
                        this.showChangeDialog(index,rows,'length');
                        this.changeTitle = "变更长度";
                        this.changeForm.oldName = rows[index].cx4Name;
                        this.changeForm.oldCode = '';
                        this.changeForm.newName = rows[index].orderNewCx4Name;
                        this.changeForm.newCode = rows[index].orderNewCx4;
                        fieldName = 'cx4Name';
                        break;
                    case 'c':
                        this.showChangeDialog(index,rows,'txt1');
                        this.changeTitle = "变更喷码";
                        this.changeForm.oldName = rows[index].usrTxt1Name;
                        this.changeForm.oldCode = '';
                        this.changeForm.newName = rows[index].orderNewUsrTxt1Name;
                        this.changeForm.newCode = rows[index].orderNewUsrTxt1;
                        fieldName = 'usrTxt1Name';
                        break;
                    case 'd':
                        this.showChangeDialog(index,rows,'txt2');
                        this.changeTitle = "变更禁喷类型";
                        this.changeForm.oldName = rows[index].usrTxt2Name;
                        this.changeForm.oldCode = '';
                        this.changeForm.newName = '';
                        this.changeForm.newCode = '';
                        fieldName = 'usrTxt2Name';
                        break;
                    case 'e':
                        this.showChangeDialog(index,rows,'txt3');
                        this.changeTitle = "变更撕筋要求";
                        this.changeForm.oldName = rows[index].usrTxt3Name;
                        this.changeForm.oldCode = rows[index].usrTxt3;
                        this.changeForm.newName = rows[index].orderNewUsrTxt3Name;
                        this.changeForm.newCode = rows[index].orderNewUsrTxt3;
                        fieldName = 'usrTxt3Name';
                        break;
                    case 'f':
                        this.showChangeDialog(index,rows,'remark');
                        this.changeTitle = "变更明细备注";
                        this.changeForm.oldName = rows[index].remark;
                        this.changeForm.oldCode = null;
                        this.changeForm.newName = rows[index].orderNewRemark;
                        this.changeForm.newCode = '';
                        fieldName = 'remark';
                        break;
                    case 'g':
                        this.showChangeDialog(index,rows,'digit');
                        this.changeTitle = "变更订购支数";
                        this.changeForm.oldName = rows[index].digit;
                        this.changeForm.oldCode = '';
                        this.changeForm.newName = rows[index].orderNewDigit;
                        this.changeForm.newCode = '';
                        fieldName = 'digit';
                        break;
                    case 'h':
                        //删除订单明细
                        this.handleDeleteChild(index,rows,true);
                        break;
                    case 'i':
                        //取消删除订单明细
                        this.handleDeleteChild(index,rows,false);
                        break;
                    default:
                        this.$message(index);
                }
                this.changeForm.docCode = this.docCode;
                this.changeForm.fid = rows[index].fid;
                this.changeForm.orderDetailId = rows[index].orderDetailId;
                this.changeForm.masterId = rows[index].masterId;
                this.changeForm.variantId = rows[index].variantId;
                this.changeForm.parentVariantId = rows[index].parentVariantId;
                this.changeForm.fieldName = fieldName;
                fieldCode ? this.changeForm.fieldCode = fieldCode : '';
            },

            //显示变更弹框
            showChangeDialog(index,rows,type) {
                this.changeType = type;
                this.changeVisible = true;
                /*this.changeForm.newName = null;
                this.changeForm.newCode = null;*/
                this.$nextTick(() => {
                    if(this.changeType === 'matCode') {
                        this.changeMatCode = rows[index].orderNewMatCode;
                        this.$refs.changeMatCodeRef = rows[index].orderNewMatCode;
                    }
                    if(this.changeType === 'color') {
                        this.changeColorName = rows[index].orderNewCx1Name;
                        this.$refs.changeColorRef = rows[index].orderNewCx1Name;
                    }
                    if(this.changeType === 'cx2Name') {
                        this.changeCx2Code = rows[index].orderNewCx2;
                        this.$refs.changeCx2CodeRef = rows[index].orderNewCx2;
                    }
                    if(this.changeType === 'cx3Name') {
                        this.changeCx3Code = rows[index].orderNewCx3Name;
                        this.$refs.changeCx3CodeRef = rows[index].orderNewCx3Name;
                    }
                    if(this.changeType === 'txt2') {
                        this.usrTxt2Name = '';
                    }
                    if(this.changeType === 'txt3') {
                        this.tempSelect = Number(this.changeForm.newCode);
                    }
                    // focus
                    if(document.querySelector('.el-dialog__body').querySelectorAll('input').length > 1) {
                        document.querySelector('.el-dialog__body').querySelectorAll('input')[1].focus()
                    }
                    if(document.querySelector('.el-dialog__body').querySelectorAll('textarea').length) {
                        document.querySelector('.el-dialog__body').querySelectorAll('textarea')[0].focus()
                    }
                })
            },

            //设置变更型材型号
            setChangeMatCode(item) {
                this.changeMatCode = item.fcode;
                this.changeForm.newName = item.fname;
                this.changeForm.newCode = item.fcode;
            },
            _setChangeMatCode(item) {
                this.changeMatCode = item.fcode;
                this.multiChangeForm.newName = item.fname;
                this.multiChangeForm.newCode = item.fcode;
            },

            //设置变更颜色
            setChangeColor(item) {
                this.changeColorName = item.fname;
                this.changeForm.newName = item.fname;
                this.changeForm.newCode = item.fcode;
            },
            _setChangeColor(item) {
                this.changeColorName = item.fname;
                this.multiChangeForm.newName = item.fname;
                this.multiChangeForm.newCode = item.fcode;
            },

            //设置变更材质
            setChangeMatAlloy(item) {
                this.changeCx2Code = item.fcode;
                this.changeForm.newName = item.fname;
                this.changeForm.newCode = item.fcode;
            },
            _setChangeMatAlloy(item) {
                this.changeCx2Code = item.fcode;
                this.multiChangeForm.newName = item.fname;
                this.multiChangeForm.newCode = item.fcode;
            },

            //设置变更膜厚
            setChangeThick(item) {
                this.changeCx3Code = item.fname;
                this.changeForm.newName = item.fname;
                this.changeForm.newCode = item.fcode;
            },
            _setChangeThick(item) {
                this.changeCx3Code = item.fname;
                this.multiChangeForm.newName = item.fname;
                this.multiChangeForm.newCode = item.fcode;
            },

            //设置变更禁喷类型
            setChangeUsrTxt2(val) {
                if(val) {
                    this.changeForm.newName = val;
                }else {
                    this.changeForm.newName = '';
                }
            },
            _setChangeUsrTxt2(val) {
                if(val) {
                    this.multiChangeForm.newName = val;
                }else {
                    this.multiChangeForm.newName = '';
                }
            },

            //设置变更撕筋
            setChangeSelect(val) {
                this.changeForm.newCode = val.toString();
            },
            _setChangeSelect(val) {
                this.multiChangeForm.newCode = val.toString();
            },

            //还原
            returnOldVal() {
                switch (this.changeType) {
                    case 'matCode':
                        this.isShowNew = false;
                        this.changeForm.newCode = this.changeForm.oldCode;
                        this.changeForm.newName = this.changeForm.oldName;
                        this.changeMatCode = this.changeForm.oldCode;
                        this.isShowNew = true;
                        break;
                    case 'color':
                        this.isShowNew = false;
                        this.changeForm.newName = this.changeForm.oldName;
                        this.changeColorName = this.changeForm.oldName;
                        this.isShowNew = true;
                        break;
                    case 'cx2Name':
                        this.isShowNew = false;
                        this.changeForm.newCode = this.changeForm.oldCode;
                        this.changeForm.newName = this.changeForm.oldName;
                        this.changeCx2Code = this.changeForm.oldCode;
                        this.isShowNew = true;
                        break;
                    case 'cx3Name':
                        this.isShowNew = false;
                        this.changeForm.newCode = this.changeForm.oldCode;
                        this.changeForm.newName = this.changeForm.oldName;
                        this.changeCx3Code = this.changeForm.oldName;
                        this.isShowNew = true;
                        break;
                    case 'length':
                        this.isShowNew = false;
                        this.changeForm.newName = this.changeForm.oldName;
                        this.isShowNew = true;
                        break;
                    case 'txt1':
                        this.isShowNew = false;
                        this.changeForm.newName = this.changeForm.oldName;
                        this.isShowNew = true;
                        break;
                    case 'txt2':
                        this.isShowNew = false;
                        this.changeForm.newName = this.changeForm.oldName;
                        this.isShowNew = true;
                        break;
                    case 'txt3':
                        this.isShowNew = false;
                        this.tempSelect = Number(this.changeForm.oldCode);
                        this.changeForm.newCode = this.changeForm.oldCode;
                        this.changeForm.newName = this.changeForm.oldName;
                        this.isShowNew = true;
                        break;
                    case 'remark':
                        this.isShowNew = false;
                        this.changeForm.newName = this.changeForm.oldName;
                        this.isShowNew = true;
                        break;
                    case 'digit':
                        this.isShowNew = false;
                        this.changeForm.newName = this.changeForm.oldName;
                        this.isShowNew = true;
                        break;
                    default:
                        console.log('error');
                        break;
                }
            },

            //保存变更
            _saveChange(type,isMulti = false) {
                let fieldName = '';
                let fieldCode = '';
                let multiList = [];
                let isDigitLength = false;
                let isEmpty = true;
                switch (type) {
                    case 'matCode':
                        fieldName = 'matName';
                        fieldCode = 'matCode';
                        break;
                    case 'color':
                        fieldName = 'cx1Name';
                        fieldCode = 'cx1';
                        break;
                    case 'cx2Name':
                        fieldName = 'cx2Name';
                        fieldCode = 'cx2';
                        break;
                    case 'cx3Name':
                        fieldName = 'cx3Name';
                        fieldCode = 'cx3';
                        break;
                    case 'length':
                        fieldName = 'cx4Name';
                        isDigitLength = true;
                        break;
                    case 'txt1':
                        fieldName = 'usrTxt1Name';
                        break;
                    case 'txt2':
                        fieldName = 'usrTxt2Name';
                        break;
                    case 'txt3':
                        fieldName = 'usrTxt3Name';
                        fieldCode = 'usrTxt3';
                        break;
                    case 'remark':
                        fieldName = 'remark';
                        break;
                    case 'digit':
                        fieldName = 'digit';
                        isDigitLength = true;
                        break;
                    default:
                        console.log('error');
                        break;
                }
                if(!isMulti) {
                    multiList.push(this.changeForm);
                    if(!['color','length','digit','matCode'].includes(type)) {
                        isEmpty = false;
                    }else {
                        if(this.changeForm.newName || this.changeForm.newCode) {
                            isEmpty = false;
                        }else {
                            isEmpty = true;
                        }
                    }
                }else {
                    this.selectDetailList.forEach(item => {
                        let tempObj = {};
                        tempObj.changType = item.changType;
                        tempObj.docCode = this.docCode;
                        tempObj.fid = item.fid;
                        tempObj.orderDetailId = item.orderDetailId;
                        tempObj.masterId = item.masterId;
                        tempObj.variantId = item.variantId;
                        tempObj.parentVariantId = item.parentVariantId;
                        tempObj.newName = this.multiChangeForm.newName;
                        fieldCode ? tempObj.newCode = this.multiChangeForm.newCode : '';
                        fieldCode ? tempObj.oldCode = item[fieldCode] : '';
                        if(fieldCode === 'usrTxt3') {
                            if(item[fieldCode]) {
                                tempObj.oldCode = item[fieldCode]
                            }else {
                                tempObj.oldCode = '0'
                            }
                        }
                        tempObj.oldName = item[fieldName];
                        tempObj.fieldName = fieldName;
                        multiList.push(tempObj)
                    });
                    if(isDigitLength) {
                        multiList = multiList.filter(item => Boolean(item.orderDetailId) === true);
                    }
                    multiList = multiList.filter(item => item.changType !== 1);
                    if(!['color','length','digit','matCode'].includes(type)) {
                        isEmpty = false;
                    }else {
                        if(this.multiChangeForm.newName || this.multiChangeForm.newCode) {
                            isEmpty = false;
                        }else {
                            isEmpty = true;
                        }
                    }
                }
                if(!isEmpty) {
                    this.fetch(`/oms/sls/SalesOrderChange/listSet`,multiList)
                        .then(result => {
                            if(result.status === 200) {
                                this.$message({
                                    message: '变更成功',
                                    type: 'success'
                                });
                                if(!isMulti) {
                                    this.changeVisible = false;
                                }else {
                                    this.multiChangeVisible = false;
                                }
                                this.getChildTable(this.detailId);
                            }else {
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                })
                            }
                        })
                }else {
                    this.$message({
                        message: '该项的值不能为空',
                        type: 'warning'
                    })
                }
            },

            //------------------- 下拉选择 START -------------------//

            //获取子型号列表
            getMatCodeList(val) {
                this.matCodeList = [];
                this.fetch('/oms/BasedataController/getAluModelByValue?pageSize=10',{fcode:val})
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
                this.fetch('/oms/BasedataController/getMatColor?pageSize=10',{fname:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.colorCodeList = result.data.list;
                        }
                    })
            },
            //获取颜色
            setColorCode(item) {
                this.colorName = item.fname;
                this.$set(this.tabDataI[this.editIndex],'colorId',item.fid);
                this.$set(this.tabDataI[this.editIndex],'cx1',item.fcode);
                this.$set(this.tabDataI[this.editIndex],'cx1Name',item.fname);
                this._getMarkMethod(item.usrTxt1Name||this.usrTxt1Name,true);
            },
            //禁喷类型
            getUsrTxt2List() {
                this.usrTxt2List = [];
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30119')
                    .then(result => {
                        if(result.data) {
                            this.usrTxt2List = result.data;
                            this.usrTxt2List.unshift({dictText:'',dictCode:'',fId:null})
                        }else {
                            this.usrTxt2List = [];
                        }
                    })
            },
            //获取材质资料列表
            getMatAlloy(val) {
                this.matAlloyList = [];
                this.fetch('/oms/BasedataController/getMatAlloy',{fcode:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.matAlloyList = result.data.list;
                            this.matAlloyList.unshift({fname:'',fcode:'',fid:null});
                        }
                    })
            },
            //获取材质资料
            setMatAlloy(item) {
                this.matAlloy = item.fcode;
                this.$set(this.tabDataI[this.editIndex],'cx2',item.fcode);
                this.$set(this.tabDataI[this.editIndex],'cx2Name',item.fname);
            },
            //获取膜厚列表
            getMatThick(val) {
                this.matThickList = [];
                this.fetch('/oms/BasedataController/getMatThick',{fname:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.matThickList = result.data.list;
                            this.matThickList.unshift({fname:'',fcode:'',fid:null});
                        }
                    })
            },
            //获取膜厚
            setMatThick(item) {
                this.matThick = item.fname;
                this.$set(this.tabDataI[this.editIndex],'cx3',item.fcode);
                this.$set(this.tabDataI[this.editIndex],'cx3Name',item.fname);
            },

            //客户
            getClient(val) {
                this.$refs.commondata.getClient(val);
            },
            setClient(item) {
                //客户
                this.$set(this.valueObj,'clientCode',item.fcode);
                this.$set(this.addOrEditForm,'orderNewClientName',item.fname);
                this.$set(this.addOrEditForm,'orderNewClientCode',item.fcode);
                this.$set(this.addOrEditForm,'orderNewClientId',item.fid);
            },

            //工程列表
            getProject(val) {
                this.$refs.commondata.getProject(val)
            },
            setProject(item) {
                this.$set(this.valueObj,'projectName',item.projectName);
                this.$set(this.addOrEditForm,'orderNewProjectName',item.projectName);
                this.$set(this.addOrEditForm,'orderNewProjectCode',item.projectCode);
            },
            setProjectVal(val) {
                this.$set(this.valueObj,'orderNewProjectName',val);
                this.$set(this.addOrEditForm,'orderNewProjectName',val);
            },

            //喷码
            getMarkMethod(val) {
                this.$refs.commondata.getMarkMethod(val);
            },
            _getMarkMethod(val,isChange=false) {
                this.markMethodList = [];
                this.fetch('/oms/BasedataController/getMdmMarkMethod?pageSize=100',{fname:val})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.markMethodList = result.data.list;
                            if(isChange) {
                                this.changeMarkMethod(val)
                            }
                        }
                    })
            },
            setMarkMethod(item) {
                this.$set(this.valueObj,'markMethod',item.fname);
                this.$set(this.addOrEditForm,'orderNewUsrTxt1Name',item.fname);
                this.$set(this.addOrEditForm,'orderNewUsrTxt1',item.fcode);
            },
            _setMarkMethod(item) {
                this.markMethod = item.fname;
                this.$set(this.tabDataI[this.editIndex],'usrTxt1',item.fcode);
                this.$set(this.tabDataI[this.editIndex],'usrTxt1Name',item.fname);
            },
            changeMarkMethod(val) {
                if(val) {
                    let item;
                    item = this.markMethodList.find(item => item.fname === val);
                    if(JSON.stringify(item) !== {}) {
                        this.$set(this.tabDataI[this.editIndex],'usrTxt1Name',item.fname);
                        this.$set(this.tabDataI[this.editIndex],'usrTxt1',item.fcode);
                        this.$nextTick(() => {
                            this.markMethod = item.fname;
                        })
                    }
                }
            },

            //包装方式
            getMdmPackMethod(val) {
                this.$refs.commondata.getMdmPackMethod(val);
            },
            setPackMethod(item) {
                this.$set(this.valueObj,'packMethodName',item.fname);
                this.$set(this.addOrEditForm,'orderNewPackMethodName',item.fname);
                this.$set(this.addOrEditForm,'orderNewPackMethodCode',item.fcode);
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
                    this.addOrEditForm.orderNewDeliveryLevelName = item.dictText
                }
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
                    this.addOrEditForm.orderNewLoaderMethodCode = item.fcode;
                    this.addOrEditForm.orderNewLoaderMethodName = item.fname;
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
                    this.addOrEditForm.orderNewVatTypeName = item.dictText;
                    this.addOrEditForm.orderNewVatTypeCode = item.dictValue;
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
                    this.addOrEditForm.orderNewPadPastingMethodName = item.fname;
                    this.addOrEditForm.orderNewPadPastingMethodCode = item.fcode;
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
                    this.addOrEditForm.orderNewPrdMethodName = item.fname;
                    this.addOrEditForm.orderNewPrdMethodCode = item.fcode;
                }
            },

            //生产基地
            getSupplyCompanyList() {
                this.supplyCompanyList = [];
                this.fetch('/oms/org/PlantCompanyController/getPlantCompany',{})
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.supplyCompanyList = result.data.list;
                        }else {
                            this.supplyCompanyList = [];
                        }
                    })
            },
            setSupplyCompany(val) {
                let item;
                item = this.supplyCompanyList.find(item => item.fCode === val);
                if(JSON.stringify(item) !== {}) {
                    this.detailForm.orderNewSupplyCompanyCode = item.fCode;
                    this.detailForm.orderNewSupplyCompanyName = item.fName;
                    this.detailForm.orderNewSupplyCompanyId = item.fId
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
    .el-tabs .el-tabs__active-bar{
        background-color:transparent !important;
    }

</style>
