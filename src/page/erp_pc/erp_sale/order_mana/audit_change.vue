<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap" v-if="isShowNotAllowed" @click="handleNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <!--todo-->
                <!--<el-button class="btn-cyan add-btn" @click="">批量审核</el-button>-->
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
            >
                <!--详情头部-->
                <template slot="header">
                    <div class="header-form" ref="headForm">
                        <template v-for="item in formProp">
                            <div v-if="item.type === 'outter'">
                                <span>{{ item.name ? (item.name + ':') : '' }}</span>
                                <span v-if="!item.isStatus">{{ left_detailForm[item.prop]==='已提交'?'待提交':left_detailForm[item.prop] ==='已确认'?'已提交':left_detailForm[item.prop]}}</span>
                                <span v-if="item.isStatus">{{ left_detailForm[item.prop] >= 100 ? '已经下发生产' : '未下发生产' }}</span>
                            </div>
                        </template>
                    </div>
                </template>
                <!--头部按钮-->
                <template slot="main-btn-wrap">
                    <div class="xs-icon-confirm" v-if="docStatus === 50 && !isNewEdit && isRefuse !== 1" @click="handleAudit" title="审核">审核</div>
                    <!--<div class="xs-icon-confirm" v-if="docStatus === 50 && 80<=orderChangeDocStatus&&orderChangeDocStatus<90&& orderDocStatus >= 100" @click="productConfirm" title="转办生产" style="z-index: 99; line-height: 1; padding-top: 8px;">转办  生产</div>-->
                    <!--<i class="sm-icon-edit el-icon-edit" @click="editMainRefuse" title="编辑" style="right: 100px"></i>-->
                    <div class="xs-icon-confirm" v-if="detailId && !isNewEdit && docStatus < 100 && isRefuse !== 1" @click="editMainRefuse" title="拒批" style="right: 100px;background: #00C26F">拒批</div>
                    <i v-if="detailId && !isNewEdit && isRefuse !== 1" class="icon-print" title="打印" @click="handlePrint" style="right: 45px;"></i>
                    <i class="sm-icon-edit el-icon-close" @click="cancaleMainRefuse" title="取消" v-if="isNewEdit" style="right: 115px"></i>
                    <div class="xs-icon-confirm" v-if="isNewEdit" @click="saveMainRefuse" title="确认拒批" style="right: 40px;line-height: 1; padding-top: 8px;">确认 拒批</div>
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
                    <!--tab区域-->
                    <el-tabs v-model="activeName" class="common-content-tab">
                        <el-tab-pane label="订单抬头变更" name="first">
                            <div v-if="isResize" :style="{height: formHeight + 'px',overflowY: 'auto'}">
                                <div class="tab-form-wrap" style="padding: 30px 0 0 0">
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
                                        <!--<el-form-item label="客户">
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
                                            <el-input v-model="detailForm.orderOldRemark" :disabled="true" style="width: 100%" type="textarea" :rows="2"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <el-form class="tab-form-item" :model="detailForm" label-width="50px">
                                        <h3 style="text-align: center">新值</h3>
                                        <!--下单日期-->
                                        <!--<el-form-item label=" ">
                                            <el-date-picker type="date" v-model="detailForm.orderNewDocDate" :disabled="true" style="width: 100%"></el-date-picker>
                                        </el-form-item>-->
                                        <!--交货日期-->
                                        <!--<el-form-item label=" ">
                                            <el-date-picker type="date" v-model="detailForm.orderNewDeliveryDate" :disabled="true" style="width: 100%"></el-date-picker>
                                        </el-form-item>-->
                                        <!--交货天数-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewDeliveryDays" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--货期等级-->
                                        <el-form-item label=" ">
                                            <el-select v-model="detailForm.orderNewDeliveryLevel" :disabled="true" style="width: 100%">
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
                                            <el-select v-model="detailForm.orderNewDocType" :disabled="true" style="width: 100%">
                                                <el-option
                                                    v-for="(item,index) in orderTypeList"
                                                    :key="index"
                                                    :label="item.dicttext"
                                                    :value="item.dicttext">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!--客户-->
                                        <!-- <el-form-item label=" ">
                                             <el-input v-model="detailForm.orderNewClientCode" :readonly="true" style="width: 100%"></el-input>
                                         </el-form-item>-->
                                        <!--工程-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewProjectName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--包装方式-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewPackMethodName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--喷码-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewUsrTxt1Name" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--客户po-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewClientPo" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--开票类型-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewVatTypeName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--贴膜要求-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewPadPastingMethodName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--提货方式-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewLoaderMethodName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--生产方式-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewPrdMethodName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--支数上限-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewDigitUpperRate" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--支数下限-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewDigitLowerRate" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--生产基地-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewSupplyCompanyName" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--客户标签1-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewUsrLabelText1" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--客户标签2-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewUsrLabelText2" :readonly="true" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <!--理重发货-->
                                        <el-form-item label=" ">
                                            <el-select
                                                placeholder=" "
                                                clearable
                                                :disabled="true"
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
                                                placeholder=" "
                                                clearable
                                                :disabled="true"
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
                                                placeholder=" "
                                                clearable
                                                :disabled="true"
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
                                        <!--备注-->
                                        <el-form-item label=" ">
                                            <el-input v-model="detailForm.orderNewRemark" :disabled="true" style="width: 100%" type="textarea" :rows="2"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <el-form :model="detailForm" label-width="100px" ref="refForm" :rules="mainRules">
                                    <el-form-item label="拒批理由" prop="refuseReason">
                                        <el-input v-model="detailForm.refuseReason" :disabled="!isNewEdit" style="width: 100%" type="textarea" :rows="2"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="订单明细变更" name="second">
                            <el-table
                                v-if="isResize"
                                tooltip-effect="dark"
                                v-loading="loadingI"
                                :data="tabDataI"
                                border
                                show-summary
                                :summary-method="getSummaries"
                                :height="tableHeight"
                                highlight-current-row
                            >
                                <el-table-column label="序号" align="center" width="40">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="变更请求内容" align="left" width="130" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.changeText }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="项目号" align="left" width="130" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.itemNo }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="型材型号" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.matCode }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="颜色代码" align="center" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.cx1Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="颜色名称" align="center" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.colorDescribe }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="颜色类别" align="center" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.colorGroupName }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="材质" align="left" :show-overflow-tooltip="true" width="80">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.cx2Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="长度 m" align="right" width="55">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.cx4Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="膜厚" align="right" width="80">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.cx3Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单数" align="right" width="55">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.digit }}</span>
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
                                <el-table-column label="喷码" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.usrTxt1Name}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="禁喷类型" align="left">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.usrTxt2Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="撕筋" align="center" width="50">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.usrTxt3Name === 'true' ? '✔' : '×' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="胶条规格" align="right" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.usrTxt6Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注" align="left" width="200" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.remark }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="拒批" align="center" width="50">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.isRefuse ? '是':'否' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="拒批理由" align="left" width="100" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.refuseReason }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="55" fixed="right">
                                    <template slot-scope="scope" v-if="scope.row.isRefuse !== 1">
                                        <el-dropdown @command="handleCommand($event,scope.$index,tabDataI)">
                                            <span><i class="el-icon-more"></i></span>
                                            <el-dropdown-menu slot="dropdown" class="del-shadow">
                                                <template>
                                                    <el-dropdown-item command="a">拒批说明</el-dropdown-item>
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
        </div>
        <!--拒批弹框-->
        <el-dialog
            title=""
            :visible.sync="refuseVisible"
            width="30%">
            <el-form :model="refuseForm" ref="refChildForm" :rules="childRules" @submit.native.prevent>
                <el-form-item label="拒批理由" prop="refuseReason">
                    <el-input v-model.trim="refuseForm.refuseReason"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelRefuseItem">取 消</el-button>
                <el-button class="btn-cyan add-btn" @click="refuseItem">确 定</el-button>
            </span>
        </el-dialog>
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
                formHeight: 526,
                tableHeight: this.$store.state.screenHei*0.65,
                mainHeight: 716,
                isResize: true,
                isShowNotAllowed:false,
                operateType: 'add',
                isNewEdit: false,
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    detailTitle: '编辑订单',
                    addTitle: '新建订单',
                    popupTitle: '',
                    isMulSelect: true,
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
                        name:'变更单号状态',
                        prop:'docStatus',
                        type:'select',
                        selectList:[{value:null,label:'全部'},{value:50,label:'已提交'},{value:90,label:'已转办生产'},{value:100,label:'已生效'}],
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
                    {name:'订单状态',prop:'orderDocStatus',type:'outter',isStatus:true},
                    {name:'制单人',prop:'enterName',type:'outter'},
                    {name:'制单时间',prop:'enterTime',type:'outter'},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'经销商',prop:'clientCode2',type:'inner'},
                    {name:'订单号',prop:'orderDocCode',type:'inner'},
                    {name:'备注',prop:'remark',type:'inner',isLong:true}
                ],
                //验证规则
                mainRules: {
                    refuseReason: [
                        {required: true, message: '拒批理由不能为空', trigger: 'blur'}
                    ]
                },
                childRules: {
                    refuseReason: [
                        {required: true, message: '拒批理由不能为空', trigger: 'blur'}
                    ]
                },
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
                        width: '110',

                    },
                    {
                        name1:'订单号/',
                        prop1:'orderDocCode',
                        name2:'变更日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '123'
                    },
                    {
                        name1:'客户/',
                        prop1:'clientCode',
                        name2:'经销商',
                        prop2:'clientCode2',
                        type:'mixin',
                        width: '110'
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
                searchForm: {docStatus: 50},
                detailForm: {},
                left_detailForm: {},
                copyForm: {},
                tempForm: {},
                submitRow: {},
                detailId: null,
                usrTxt1Name: null,
                isRefuse: null,
                orderDocStatus: null,
                orderChangeId: null,
                orderChangeDocStatus: null,
                docCode: null,
                docStatus: null,
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //拒批
                refuseVisible: false,
                refuseForm: {},
                //详情表格内容
                tabLeft: '300px',
                activeName: 'first',
                childDetailRow: {},
                focusTimes: 1,
                editIndex: 0,
                //订单明细数据
                tabDataI: [],
                copyDataI: [],
                loadingI: false,
                //单据类型
                orderTypeList: [],
                //货期等级
                deliveryLevelList: [],
                //包装方式
                packMethodList: [],
            }
        },
        watch: {
            'isNewEdit':{
                handler(val) {
                    this.isShowNotAllowed = val;
                }
            }
        },
        mounted() {
            this.getData();
            this.getOrderType();
            this.getDeliveryLevel();
            // 操作/布局相关
            this.listenResizeII();
            this.changeSizeII();
            this.tempWidth = this.otherVariable.contentWidth;
            this.mainRules = {refuseReason: []}
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
                            this.detailId = null;
                            this.usrTxt1Name = null;
                            this.isRefuse = null;
                            this.tabDataI = [];
                            this.copyDataI = [];
                            this.detailForm = {};
                            this.copyForm = {};
                            this.left_detailForm = {};
                            this.orderDocStatus = null;
                            this.orderChangeId = null;
                            this.orderChangeDocStatus = null;
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
                this.detailForm = {};
                this.copyForm = {};
                this.left_detailForm = {};
                this.getData();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
            },
            //重置
            handleReset() {
                this.searchForm = {docStatus: 50};
                this.handleRefresh();
            },
            //更改后的刷新
            changeRefresh() {
                this.getData(false);
                this.otherVariable.isChildEdit = false;
            },
            //点击主表行
            handleDetail(row) {
                this.mainRules = {};
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.copyDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.copyForm = {};
                this.left_detailForm = row;
                this.copyForm = {};
                this.fetch('/oms/sls/SalesOrderChange/getChangeMaster',{fid:row.fid})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list.length) {
                            this.detailForm = result.data.list[0];
                            this.copyForm = this.$lodash.cloneDeep(result.data.list[0]);
                        }else {
                            this.detailForm = {};
                            this.copyForm = {};
                        }
                    });
                this.getChildTable(row.fid);
                this.detailId = row.fid;
                this.usrTxt1Name = row.orderNewUsrTxt1Name;
                this.isRefuse = row.isRefuse;
                this.orderDocStatus = row.orderDocStatus;
                this.orderChangeId = row.orderChangeId;
                this.orderChangeDocStatus = row.orderChangeDocStatus;
                this.docCode = row.docCode;
                this.docStatus = row.docStatus;
            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
            },
            //拒批
            editMainRefuse() {
                this.isNewEdit = true;
                this.mainRules = {refuseReason: [{required: true, message: '拒批理由不能为空', trigger: 'blur'}]}
            },
            cancaleMainRefuse() {
                this.mainRules = {};
                this.$refs.refForm.resetFields();
                this.isNewEdit = false;
                this.detailForm = this.$lodash.cloneDeep(this.copyForm);
            },
            saveMainRefuse() {
                this.$refs.refForm.validate((valid) => {
                    if(valid) {
                        this.fetch('/oms/sls/SalesOrderChange/refuseOrderChange',this.detailForm)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: result.message,
                                        type: 'success'
                                    });
                                    this.isNewEdit = false;
                                    this.getData(false);
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    })
                                }
                            })
                    }else {
                        this.$message({
                            message: '拒批理由不能为空',
                            type: 'warning'
                        })
                    }
                })
            },
            //主表审核
            handleAudit() {
                let tips = '是否审核？';
                /*if(this.orderDocStatus < 80) {
                    tips = '是否审核<strong><i>并执行订单变更</i></strong>？'
                }*/
                if(this.detailId) {
                    this.$confirm(`${tips}`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        dangerouslyUseHTMLString: true
                    }).then(() => {
                        this.getAjax(`/oms/sls/SalesOrderChange/complaintOrAuditOrderChangeFlowById?orderChangeFlowId=${this.detailId}`)
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
            //打印
            handlePrint() {
                let isReturn = false;
                let resultUrl = '';
                this.getAjax(`/oms/PrintController/isPrintOrderChange?orderChangeFlowId=${this.detailId}`)
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
            //转办生产
            productConfirm() {
                if(this.orderChangeId) {
                    this.$confirm('是否转办生产?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getAjax(`/oms/sls/SalesOrderChange/complaintOrderChangeMasterById?orderChangeMasterId=${this.orderChangeId}`)
                            .then(result => {
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
            //获取从表
            getChildTable(fid) {
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
                            this.copyDataI = this.$lodash.cloneDeep(this.tabDataI);
                        }
                    });
            },
            handleCommand(command,index,rows) {
                switch(command)
                {
                    case 'a':
                        this.refuseForm = rows[index];
                        this.refuseVisible = true;
                        break;
                }
            },
            //明细拒批
            refuseItem() {
                let tempParam = [{
                    fid: this.refuseForm.fid,
                    masterId: this.refuseForm.masterId,
                    refuseReason: this.refuseForm.refuseReason
                }];
                this.$refs.refChildForm.validate((valid) => {
                    if(valid) {
                        this.fetch('/oms/sls/SalesOrderChange/refuseDetail',tempParam)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: result.message,
                                        type: 'success'
                                    });
                                    this.refuseVisible = false;
                                    this.getChildTable(this.detailId);
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'error'
                                    })
                                }
                            })
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            cancelRefuseItem() {
                this.refuseVisible = false;
                this.tabDataI = this.$lodash.cloneDeep(this.copyDataI);
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
                sums[10] = digit;
                //理重
                theoryWght ? sums[13] = theoryWght.toFixed(3) : 0;
                return sums;
            },
            //禁止点击表格提醒
            handleNotAllowed() {
                if(this.isNewEdit) {
                    this.$confirm('此操作将清空已填写的数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.cancaleMainRefuse();
                    }).catch(() => {
                        console.log('cnacel')
                    })
                }
            },

            //------------------- 下拉选择 START -------------------//

            //包装方式
            getMdmPackMethod(val) {
                this.packMethodList = [];
                if(val) {
                    this.fetch('/oms/BasedataController/getMdmPackMethod?pageSize=10',{fname:val})
                        .then(result => {
                            if(result.data && result.data.list) {
                                this.packMethodList = result.data.list;
                            }
                        })
                }
            },

            //获取单据类型
            getOrderType() {
                this.orderTypeList = [];
                this.getAjax('/oms/sys/DataDictionary/getOrderType?pageSize=10')
                    .then(result => {
                        if(result.data) {
                            this.orderTypeList = result.data;
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
            }

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
