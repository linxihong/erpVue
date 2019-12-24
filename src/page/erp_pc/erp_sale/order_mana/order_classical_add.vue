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
                <template slot="main-btn-wrap" v-if="detailId&&!otherVariable.isChildEdit">
                    <div v-if="isBanOperate" class="xs-icon-confirm" @click="handleConfirm">提交</div>
                    <!--<div v-if="!isBanOperate&&!isAudit" class="xs-icon-confirm" @click="handleCanCelConfirm">撤回</div>-->
                    <i v-if="isBanOperate" class="sm-icon-edit el-icon-edit" title="编辑" @click="handleEdit"></i>
                    <i v-if="isBanOperate" class="sm-icon-edit el-icon-delete" title="删除" @click="handleDelete" style="right: 65px"></i>
                    <!--<i v-if="detailId" class="icon-copy" title="复制新增" @click="copyAdd"></i>-->
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
                        <el-button class="btn-cyan search-btn" @click="handleAddChild()" v-if="detailId&&isBanOperate&&!otherVariable.isChildEdit">增行</el-button>
                        <!--<el-button type="danger" @click="showExcelModule" v-if="isBanOperate&&!otherVariable.isChildEdit&&!tabDataI.length">批量导入</el-button>-->
                        <el-upload
                            v-if="detailId&&isBanOperate&&!otherVariable.isChildEdit&&!tabDataI.length"
                            class="do-upload"
                            ref="uploadExcel"
                            action="doUpload"
                            :before-upload="beforeToUpload"
                            :limit="1"
                            :file-list="fileList"
                            :show-file-list="false">
                            <el-button slot="trigger" size="small" type="primary">导入</el-button>
                        </el-upload>
                        <a class="el-button" download="销售订单明细导入模板.xls" :href="downloadUrl" v-if="detailId&&isBanOperate&&!otherVariable.isChildEdit">下载模板</a>
                        <!--<el-button @click="getExcelModule" v-if="detailId&&isBanOperate&&!otherVariable.isChildEdit" type="warning">下载模板</el-button>-->
                        <el-button @click="handleCancelChild" v-if="otherVariable.isChildEdit">取消</el-button>
                        <el-button class="btn-cyan search-btn" @click="handleSaveChild(0,'down')" v-if="otherVariable.isChildEdit" :disabled="isCanSave">保存</el-button>
                        <el-button class="btn-cyan add-btn" @click="copyAddChild" v-if="otherVariable.isChildEdit&&isShowCopyBtn" :disabled="isCanSave">复制新增明细</el-button>
                        <el-button class="btn-cyan add-btn" @click="UpdataorderList" v-if="otherVariable.isChildEdit" :disabled="isCanSave">批量保存</el-button>
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
                                <el-table-column label="序号" align="center" width="40">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.docItem }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="项目号" prop="itemNo" align="left" width="130" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.itemNo }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="型材型号" :align="otherVariable.isChildEdit?'center':'left'" width="110px" label-class-name="table-valid-head" :show-overflow-tooltip="!otherVariable.isChildEdit">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.matCode }}</span>
                                        <el-select
                                            ref="matCodeSelect"
                                            popper-class="select-table"
                                            clearable
                                            filterable
                                            remote
                                            :remote-method="getMatCodeList"
                                            v-if="scope.row.isEditState"
                                            v-model.trim="scope.row.matCode"
                                            style="width:100%;background:#fff;border-radius: 5px;"
                                            data-index
                                            @focus="setFocus(0)"
                                            @visible-change="banNextFocus"
                                            @blur="blurEvent(scope.row.matCode,'matCode')"
                                            @paste.native="handleCtrlV($event,'matCode')"
                                            @keydown.enter.native="remoteEnterEvent(scope.row.matCode,'matCode')"
                                            @keydown.9.exact.native="tabEvent(scope.row.matCode,'matCode')"
                                            :disabled="Boolean(scope.row.variantId)&&Boolean(scope.row.parentVariantId)"
                                        >
                                            <template>
                                                <div class="select-head">
                                                    <div style="width: 100px;">名称</div>
                                                    <div style="width: 100px;">代码</div>
                                                </div>
                                            </template>
                                            <el-option
                                                @click.native="setMatCode(item.fcode)"
                                                v-for="(item,index) in matCodeList"
                                                :key="index"
                                                :label="item.fcode"
                                                :value="item.fcode">
                                                <template>
                                                    <div class="select-label">
                                                        <div style="width: 100px;" :title="item.fname">{{item.fname}}</div>
                                                        <div style="width: 100px;" :title="item.fcode">{{item.fcode}}</div>
                                                    </div>
                                                </template>
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="颜色代码" :align="otherVariable.isChildEdit?'center':'left'" width="120px" label-class-name="table-valid-head" :show-overflow-tooltip="!otherVariable.isChildEdit">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.cx1Name }}</span>
                                        <el-select
                                            ref="colorSelect"
                                            popper-class="select-table"
                                            clearable
                                            filterable
                                            remote
                                            :remote-method="getColorCodeList"
                                            v-if="scope.row.isEditState"
                                            v-model.trim="scope.row.cx1Name"
                                            style="width:100%;background:#fff;border-radius: 5px;"
                                            data-index
                                            @focus="setFocus(1)"
                                            @visible-change="banNextFocus"
                                            @blur="blurEvent(scope.row.cx1Name,'cx1Name')"
                                            @paste.native="handleCtrlV($event,'cx1Name')"
                                            @keydown.enter.native="remoteEnterEvent(scope.row.cx1Name,'cx1Name')"
                                            @keydown.9.exact.native="tabEvent(scope.row.cx1Name,'cx1Name')"
                                        >
                                            <template>
                                                <div class="select-head">
                                                    <div style="width: 200px;">名称</div>
                                                </div>
                                            </template>
                                            <el-option
                                                @click.native="setColorCode(item.fname)"
                                                v-for="(item,index) in colorCodeList"
                                                :key="index"
                                                :label="item.fname"
                                                :value="item.fname">
                                                <template>
                                                    <div class="select-label">
                                                        <div style="width: 200px;" :title="item.fname">{{item.fname}}</div>
                                                    </div>
                                                </template>
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="颜色名称" prop="colorDescribe" align="left" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column label="材质" :align="otherVariable.isChildEdit?'center':'left'" width="80px" :show-overflow-tooltip="!otherVariable.isChildEdit">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.cx2Name }}</span>
                                        <el-select
                                            ref="matAlloySelect"
                                            popper-class="select-table"
                                            clearable
                                            filterable
                                            remote
                                            :remote-method="getMatAlloy"
                                            v-if="scope.row.isEditState"
                                            v-model.trim="scope.row.cx2Name"
                                            style="width:100%;background:#fff;border-radius: 5px;"
                                            data-index
                                            @focus="setFocus(2)"
                                            @visible-change="banNextFocus"
                                            @blur="blurEvent(scope.row.cx2Name,'cx2Name')"
                                            @paste.native="handleCtrlV($event,'cx2Name')"
                                            @keydown.enter.native="remoteEnterEvent(scope.row.cx2Name,'cx2Name')"
                                            @keydown.9.exact.native="tabEvent(scope.row.cx2Name,'cx2Name')"
                                        >
                                            <template>
                                                <div class="select-head">
                                                    <div style="width: 100px;">名称</div>
                                                    <div style="width: 100px;">代码</div>
                                                </div>
                                            </template>
                                            <el-option
                                                @click.native="setMatAlloy(item.fcode)"
                                                v-for="(item,index) in matAlloyList"
                                                :key="index"
                                                :label="item.fname"
                                                :value="item.fcode">
                                                <template>
                                                    <div class="select-label">
                                                        <div style="width: 100px;" :title="item.fname">{{item.fname}}</div>
                                                        <div style="width: 100px;" :title="item.fcode">{{item.fcode}}</div>
                                                    </div>
                                                </template>
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="长度 m" :align="otherVariable.isChildEdit?'center':'right'" width="80" label-class-name="table-valid-head">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r" v-if="!scope.row.isEditState">{{ scope.row.cx4Name }}</span>
                                        <el-input
                                            style="width: 79px"
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
                                <el-table-column label="膜厚" :align="otherVariable.isChildEdit?'center':'right'" width="80px">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r" v-if="!scope.row.isEditState">{{ scope.row.cx3Name }}</span>
                                        <el-select
                                            ref="matThickSelect"
                                            popper-class="select-table"
                                            clearable
                                            filterable
                                            remote
                                            :remote-method="getMatThick"
                                            v-if="scope.row.isEditState"
                                            v-model.trim="scope.row.cx3Name"
                                            style="width:100%;background:#fff;border-radius: 5px;"
                                            data-index
                                            @focus="setFocus(4)"
                                            @visible-change="banNextFocus"
                                            @blur="blurEvent(scope.row.cx3Name,'cx3Name')"
                                            @paste.native="handleCtrlV($event,'cx3Name')"
                                            @keydown.enter.native="remoteEnterEvent(scope.row.cx3Name,'cx3Name')"
                                            @keydown.9.exact.native="tabEvent(scope.row.cx3Name,'cx3Name')"
                                        >
                                            <template>
                                                <div class="select-head">
                                                    <div style="width: 100px;">名称</div>
                                                    <div style="width: 100px;">代码</div>
                                                </div>
                                            </template>
                                            <el-option
                                                @click.native="setMatThick(item.fname)"
                                                v-for="(item,index) in matThickList"
                                                :key="index"
                                                :label="item.fcode"
                                                :value="item.fname">
                                                <template>
                                                    <div class="select-label">
                                                        <div style="width: 100px;" :title="item.fname">{{item.fname}}</div>
                                                        <div style="width: 100px;" :title="item.fcode">{{item.fcode}}</div>
                                                    </div>
                                                </template>
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单数" width="70px" prop="digit" :align="otherVariable.isChildEdit?'center':'right'" label-class-name="table-valid-head">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r" v-if="!scope.row.isEditState">{{ scope.row.digit }}</span>
                                        <el-input
                                            v-Int
                                            style="width: 69px"
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
                                <el-table-column label="支/扎" width="60px" :align="otherVariable.isChildEdit?'center':'right'">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r" v-if="!scope.row.isEditState">{{ scope.row.perLotQty }}</span>
                                        <el-input
                                            v-Int
                                            style="width: 59px"
                                            @keydown.native.down="goDown(6)"
                                            @keydown.native.up="goUp(6)"
                                            data-index
                                            @keydown.enter.native="nextFocus"
                                            @focus="setFocus(6)"
                                            v-if="scope.row.isEditState"
                                            v-model.trim="scope.row.perLotQty">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="机台级别" align="right">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.machineLevelName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="喷码" :align="otherVariable.isChildEdit?'center':'left'" :show-overflow-tooltip="!otherVariable.isChildEdit">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.usrTxt1Name}}</span>
                                        <el-select
                                            ref="usrTxt1"
                                            remote
                                            filterable
                                            clearable
                                            :remote-method="getUsrTxt1List"
                                            v-if="scope.row.isEditState"
                                            v-model="scope.row.usrTxt1Name"
                                            style="width:100%;background:#fff;border-radius: 5px;"
                                            data-index
                                            @change="_setUsrTxt1"
                                            @focus="setFocus(7)"
                                            @visible-change="banNextFocus"
                                            @keydown.enter.native="remoteEnterEvent(scope.row.usrTxt1Name,'usrTxt1Name')"
                                        >
                                            <el-option
                                                v-for="(item,index) in usrTxt1List"
                                                :key="index"
                                                :label="item.fname"
                                                :value="item.fname">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="禁喷类型">
                                    <el-table-column label="默认">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.banSprayType }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="要求" width="120px" :align="otherVariable.isChildEdit?'center':'left'">
                                        <template slot-scope="scope">
                                            <span v-if="!scope.row.isEditState">{{ scope.row.usrTxt2Name }}</span>
                                            <el-select
                                                :disabled="scope.row.isNotUrsTxt2"
                                                ref="usrTxt2"
                                                remote
                                                filterable
                                                clearable
                                                :remote-method="getUsrTxt2List"
                                                v-if="scope.row.isEditState"
                                                v-model="scope.row.usrTxt2Name"
                                                style="width:100%;background:#fff;border-radius: 5px;"
                                                data-index
                                                @change="_setUsrTxt2"
                                                @focus="setFocus(8)"
                                                @visible-change="banNextFocus"
                                                @keydown.enter.native="remoteEnterEvent(scope.row.usrTxt2Name,'usrTxt2Name')"
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
                                                :disabled="scope.row.isNotTear"
                                                default-first-option
                                                filterable
                                                clearable
                                                placeholder=" "
                                                v-if="scope.row.isEditState"
                                                v-model="scope.row.usrTxt3"
                                                @change="setUsrTxt3Name"
                                                style="width:100%;background:#fff;border-radius: 5px;"
                                                data-index
                                                @focus="setFocus(9)"
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
                                <el-table-column label="备注" width="200" :align="otherVariable.isChildEdit?'center':'left'" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.remark }}</span>
                                        <el-input
                                            style="width:199px"
                                            @keydown.native.down="goDown(8)"
                                            @keydown.native.up="goUp(8)"
                                            data-index
                                            @keydown.native="handleLastCell($event)"
                                            v-if="scope.row.isEditState"
                                            v-model.trim="scope.row.remark">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="isBanOperate&&!otherVariable.isChildEdit" label="操作" align="center" width="55" fixed="right">
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
                >
                    <template slot="head-form-title">
                        <div class="head-form-title">
                            <span>{{otherVariable.popupTitle}}</span>
                        </div>
                    </template>
                    <template slot="custom-add-form">
                        <div class="inline-form-title">基础信息</div>
                        <el-form ref="addOrEditForm" :rules="mainRules" :model="addOrEditForm" :inline="otherVariable.isInlineForm" label-width="120px">
                            <el-form-item label="下单日期" prop="docDate" >
                                <el-date-picker
                                    :readonly="true"
                                    v-model="addOrEditForm.docDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="单据类型" prop="docType">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.docType"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(0)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
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
                                <el-input
                                    v-Int
                                    v-model="addOrEditForm.deliveryDays"
                                    data-index
                                    @keydown.enter.native="nextFocus($event,true,addOrEditForm.deliveryDays,'交货天数')"
                                    @focus="setFocus(1)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="客户" prop="clientCode">
                                <SelectEnter
                                    data-index
                                    @inputFocus="setFocus(2)"
                                    @selected="nextFocus"
                                    ref="clientSelect"
                                    :inputValue="valueObj.clientCode"
                                    :selectTHs="valueObj.clientTHs"
                                    :selectTds="valueObj.orgClientList"
                                    placeholder="输入经客户代码回车搜索"
                                    @getList="getOrgClient"
                                    @setObj="setClient"
                                    selectLabel="fcode"
                                    selectValue="fcode"
                                    selectKey="fid">
                                </SelectEnter>
                            </el-form-item>
                            <el-form-item label="货期等级" prop="deliveryLevel">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.deliveryLevel"
                                    @change="setDelivery"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(3)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in deliveryLevelList"
                                        :key="index"
                                        :label="item.dictText"
                                        :value="item.dictValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="客户PO" prop="clientPo">
                                <el-input
                                    v-model="addOrEditForm.clientPo"
                                    @keydown.enter.native="nextFocus"
                                    data-index
                                    @focus="setFocus(4)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="开票类型" prop="vatTypeCode">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.vatTypeCode"
                                    @change="setVatTypeName"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(5)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in vatTypeNameList"
                                        :key="index"
                                        :label="item.dictText"
                                        :value="item.dictValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="工程项目" prop="projectName">
                                <el-input
                                    v-model="addOrEditForm.projectName"
                                    @keydown.enter.native="nextFocus"
                                    data-index
                                    @focus="setFocus(6)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="备注" class="full-remark">
                                <el-input type="textarea" :rows="3" v-model="addOrEditForm.remark" prop="remark"
                                          @keydown.enter.native="nextFocus"
                                          data-index
                                          @focus="setFocus(7)"
                                ></el-input>
                            </el-form-item>
                            <div class="inline-form-title">生产要求</div>
                            <el-form-item label="包装方式" prop="packMethodName">
                                <SelectEnter
                                    data-index
                                    @inputFocus="setFocus(8)"
                                    @selected="nextFocus"
                                    ref="packMethodSelect"
                                    :inputValue="valueObj.packMethodName"
                                    :selectTHs="valueObj.packMethodTHs"
                                    :selectTds="valueObj.mdmPackList"
                                    placeholder="输入包装方式回车搜索"
                                    @getList="getMdmPackMethod"
                                    @setObj="setPackMethod"
                                    selectLabel="fname"
                                    selectValue="fname"
                                    selectKey="fid">
                                </SelectEnter>
                            </el-form-item>
                            <el-form-item label="贴膜要求" prop="padPastingMethodCode">
                                <el-select
                                    v-model="addOrEditForm.padPastingMethodCode"
                                    @change="setPadPastingMethod"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(9)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in padPastingMethodList"
                                        :key="index"
                                        :label="item.fname"
                                        :value="item.fcode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="喷码" prop="usrTxt1Name">
                                <SelectEnter
                                    data-index
                                    @inputFocus="setFocus(10)"
                                    @selected="nextFocus"
                                    ref="usr1Select"
                                    :inputValue="valueObj.markMethod"
                                    :selectTHs="valueObj.markMethodTHs"
                                    :selectTds="valueObj.markMethodList"
                                    placeholder="输入喷码回车搜索"
                                    @getList="getMarkMethod"
                                    @setObj="setMarkMethod"
                                    selectLabel="fname"
                                    selectValue="fname"
                                    selectKey="fid">
                                </SelectEnter>
                            </el-form-item>
                            <el-form-item label="支数上限(%)" prop="digitUpperRate">
                                <el-input
                                    v-model="addOrEditForm.digitUpperRate"
                                    @keydown.enter.native="nextFocus"
                                    data-index
                                    @focus="setFocus(11)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="支数下限(%)" prop="digitLowerRate">
                                <el-input
                                    v-model="addOrEditForm.digitLowerRate"
                                    @keydown.enter.native="nextFocus"
                                    data-index
                                    @focus="setFocus(12)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="客户标签1" prop="digitLowerRate">
                                <el-input
                                    v-model="addOrEditForm.usrLabelText1"
                                    @keydown.enter.native="nextFocus"
                                    data-index
                                    @focus="setFocus(13)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="客户标签2" prop="digitLowerRate">
                                <el-input
                                    v-model="addOrEditForm.usrLableText2"
                                    @keydown.enter.native="nextFocus"
                                    data-index
                                    @focus="setFocus(14)"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="理重发货">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.isTheory"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(15)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
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
                                    clearable
                                    v-model="addOrEditForm.isBundle"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(16)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in getStaticList('isTrue')"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="锯挂痕">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.isSawTrace"
                                    style="width: 100%"
                                    data-index
                                    @focus="setFocus(17)"
                                    @visible-change="banNextFocus"
                                    @keydown.enter.native="selectEnterEvent"
                                >
                                    <el-option
                                        v-for="(item,index) in getStaticList('isTrue')"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="注胶标记" prop="injectionFlag">
                                <SelectEnter
                                    data-index
                                    @inputFocus="setFocus(18)"
                                    @selected="nextFocus"
                                    ref="injectionFlagSelect"
                                    :inputValue="valueObj.injectionFlag"
                                    :selectTHs="valueObj.injectionFlagTHs"
                                    :selectTds="valueObj.injectionFlagList"
                                    placeholder="输入回车搜索"
                                    @getList="getInjectionFlag"
                                    @setObj="setInjectionFlag"
                                    selectLabel="fname"
                                    selectValue="fname"
                                    selectKey="fid">
                                </SelectEnter>
                            </el-form-item>

                            <el-form-item label="胶条标记" prop="stripFlag">
                                <SelectEnter
                                    data-index
                                    @inputFocus="setFocus(19)"
                                    @selected="nextFocus"
                                    ref="stripFlagSelect"
                                    :inputValue="valueObj.stripFlag"
                                    :selectTHs="valueObj.stripFlagTHs"
                                    :selectTds="valueObj.stripFlagList"
                                    placeholder="输入回车搜索"
                                    @getList="getStripFlag"
                                    @setObj="setStripFlag"
                                    selectLabel="fname"
                                    selectValue="fname"
                                    selectKey="fid">
                                </SelectEnter>
                            </el-form-item>
                        </el-form>
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
            <!--模板-->
            <el-dialog
                :close-on-click-modal="false"
                class="dialogDiv dialogDivII common-dialog"
                :show-close="false"
                :top="dialog_top"
                size="large"
                :visible.sync="moduleVisiable">
                <div class="slideContent">
                    <div class="leftDiv common-left-offset common-dialog-btn" style="top: 27px;">
                        <el-button class="icon-close icon-dialogII" style="" @click="moduleVisiable = false"></el-button>
                        <el-button class="icon-confirm icon-dialogI" style="" @click="multiSaveDetail"></el-button>
                    </div>
                    <div class="slideTop" v-drag1 style="padding: 12px">导入订单明细</div>
                    <div class="slideMid" style="margin-top: 20px;">
                        <div class="choose-wrap">
                            <div class="file-wrap">
                                <input class="file-input" @change="handleUpload" title="" ref="inputer" type="file" />
                                <button class="file-btn">选择文件</button>
                                <span class="file-span">{{ fileName }}</span>
                                <!--<el-button size="small" type="success" @click="submitUpload">导入</el-button>-->
                            </div>
                            <div style="color:red;font-size: 12px">（请在核对订单明细后再点击上方按钮提交保存！）</div>
                        </div>
                        <div class="error-msg">
                            <span style="color: red;">当前错误信息：</span>
                            <span style="color: gray;">{{ errorMessage }}</span>
                        </div>
                        <div class="tableWrap">
                            <el-table
                                ref="moduleTable"
                                tooltip-effect="dark"
                                :data="moduleData"
                                border
                                :height="tableHeight"
                                highlight-current-row
                                @row-click="clickModule"
                            >
                                <el-table-column label="错误信息" align="center" width="200" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <!--<el-input type="textarea" :rows="2" v-model="scope.row.errorMessage"></el-input>-->
                                        <span class="error-span">{{ scope.row.rowErrorMessage }}</span>
                                        <!--:show-overflow-tooltip="true"-->
                                    </template>
                                </el-table-column>
                                <el-table-column label="型材型号" align="center" width="110px" label-class-name="table-valid-head">
                                    <template slot-scope="scope">
                                        <el-select
                                            @change="setMatCodeImport(scope.row.matCode,scope.$index)"
                                            popper-class="select-table"
                                            clearable
                                            filterable
                                            remote
                                            :remote-method="getMatCodeList"
                                            v-model.trim="scope.row.matCode"
                                            style="width:100%;background:#fff;border-radius: 5px;"
                                        >
                                            <template slot="option-header">
                                                <div class="select-head">
                                                    <div style="width: 100px;">名称</div>
                                                    <div style="width: 100px;">代码</div>
                                                </div>
                                            </template>
                                            <el-option
                                                v-for="(item,index) in matCodeList"
                                                :key="index"
                                                :label="item.fcode"
                                                :value="item.fcode">
                                                <template>
                                                    <div class="select-label">
                                                        <div style="width: 100px;" :title="item.fname">{{item.fname}}</div>
                                                        <div style="width: 100px;" :title="item.fcode">{{item.fcode}}</div>
                                                    </div>
                                                </template>
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="颜色代码" align="center" width="120px" label-class-name="table-valid-head">
                                    <template slot-scope="scope">
                                        <el-select
                                            @change="setColorCodeImport(scope.row.cx1Name,scope.$index)"
                                            popper-class="select-table"
                                            clearable
                                            filterable
                                            remote
                                            :remote-method="getColorCodeList"
                                            v-model.trim="scope.row.cx1Name"
                                            style="width:100%;background:#fff;border-radius: 5px;"
                                        >
                                            <template>
                                                <div class="select-head">
                                                    <div style="width: 200px;">名称</div>
                                                </div>
                                            </template>
                                            <el-option
                                                v-for="(item,index) in colorCodeList"
                                                :key="index"
                                                :label="item.fname"
                                                :value="item.fname">
                                                <template>
                                                    <div class="select-label">
                                                        <div style="width: 200px;" :title="item.fname">{{item.fname}}</div>
                                                    </div>
                                                </template>
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="颜色名称" prop="colorDescribe" align="left" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column label="材质" align="center" width="80px">
                                    <template slot-scope="scope">
                                        <el-select
                                            @change="setMatAlloyImport(scope.row.cx2Name,scope.$index)"
                                            popper-class="select-table"
                                            clearable
                                            filterable
                                            remote
                                            :remote-method="getMatAlloy"
                                            v-model.trim="scope.row.cx2Name"
                                            style="width:100%;background:#fff;border-radius: 5px;"
                                        >
                                            <template>
                                                <div class="select-head">
                                                    <div style="width: 100px;">名称</div>
                                                    <div style="width: 100px;">代码</div>
                                                </div>
                                            </template>
                                            <el-option
                                                v-for="(item,index) in matAlloyList"
                                                :key="index"
                                                :label="item.fname"
                                                :value="item.fcode">
                                                <template>
                                                    <div class="select-label">
                                                        <div style="width: 100px;" :title="item.fname">{{item.fname}}</div>
                                                        <div style="width: 100px;" :title="item.fcode">{{item.fcode}}</div>
                                                    </div>
                                                </template>
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="长度 m" align="center" width="80" label-class-name="table-valid-head">
                                    <template slot-scope="scope">
                                        <el-input
                                            style="width: 79px"
                                            v-model.trim="scope.row.cx4Name">
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="膜厚" align="center" width="80px">
                                    <template slot-scope="scope">
                                        <el-select
                                            @change="setMatThickImport(scope.row.cx3Name,scope.$index)"
                                            popper-class="select-table"
                                            clearable
                                            filterable
                                            remote
                                            :remote-method="getMatThick"
                                            v-model.trim="scope.row.cx3Name"
                                            style="width:100%;background:#fff;border-radius: 5px;"
                                        >
                                            <template>
                                                <div class="select-head">
                                                    <div style="width: 100px;">名称</div>
                                                    <div style="width: 100px;">代码</div>
                                                </div>
                                            </template>
                                            <el-option
                                                v-for="(item,index) in matThickList"
                                                :key="index"
                                                :label="item.fcode"
                                                :value="item.fname">
                                                <template>
                                                    <div class="select-label">
                                                        <div style="width: 100px;" :title="item.fname">{{item.fname}}</div>
                                                        <div style="width: 100px;" :title="item.fcode">{{item.fcode}}</div>
                                                    </div>
                                                </template>
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="自定义型号" align="center">
                                    <template slot-scope="scope">
                                        <el-input v-model.trim="scope.row.cltMatCode"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="订单数" width="70px" align="center" label-class-name="table-valid-head">
                                    <template slot-scope="scope">
                                        <el-input
                                            v-Int
                                            style="width: 69px"
                                            v-model.trim="scope.row.digit">
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
                                <el-table-column label="理重 kg" align="right" prop="theoryWght" >
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.theoryWght ? parseFloat(scope.row.theoryWght).toFixed(3) : '' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="支/扎" width="60px" align="center">
                                    <template slot-scope="scope">
                                        <el-input v-Int style="width: 59px" v-model.trim="scope.row.perLotQty"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="机台级别" align="right">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.machineLevelName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="喷码" align="center" label-class-name="table-valid-head">
                                    <template slot-scope="scope">
                                        <el-select
                                            @change="setUsrTxt1Import(scope.row.usrTxt1Name,scope.$index)"
                                            remote
                                            filterable
                                            clearable
                                            :remote-method="getUsrTxt1List"
                                            v-model="scope.row.usrTxt1Name"
                                            style="width:100%;background:#fff;border-radius: 5px;"
                                        >
                                            <el-option
                                                v-for="(item,index) in usrTxt1List"
                                                :key="index"
                                                :label="item.fname"
                                                :value="item.fname">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="禁喷类型">
                                    <el-table-column label="默认">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.banSprayType }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="要求" width="120px" align="center'">
                                        <template slot-scope="scope">
                                            <el-select
                                                @change="setUsrTxt2Import(scope.row.usrTxt2,scope.$index)"
                                                :disabled="scope.row.isNotUrsTxt2"
                                                remote
                                                filterable
                                                clearable
                                                :remote-method="getUsrTxt2List"
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
                                </el-table-column>
                                <el-table-column label="撕筋">
                                    <el-table-column label="默认" width="55" align="center">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.isTear === '1' ? '✔' : '×' }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="要求" width="55" align="center">
                                        <template slot-scope="scope">
                                            <el-select
                                                @change="setUsrTxt3NameImport(scope.row.usrTxt3,scope.$index)"
                                                :disabled="scope.row.isNotTear"
                                                filterable
                                                clearable
                                                placeholder=" "
                                                v-model="scope.row.usrTxt3"
                                                style="width:100%;background:#fff;border-radius: 5px;"
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
                                <el-table-column label="备注" width="200" align="center">
                                    <template slot-scope="scope">
                                        <el-input style="width:199px" v-model.trim="scope.row.remark"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
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
    import OrderMixins from './OrderMixins'
    export default {
        mixins: [CommonMixins,OrderMixins],
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
                //键盘操作
                currentIndex: 0,
                //批量修改数据
                orderDetailDTOList:[],
                enterTimes: 1,
                isBanNextFocus: false,
                //组件配置
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
                    isSaving: false
                },
                //验证规则
                mainRules: {
                    docDate: [
                        { required: true, message: '请选择下单日期', trigger: 'blur' }
                    ],
                    docType: [
                        { required: true, message: '请选择单据类型', trigger: 'blur' }
                    ],
                    deliveryDays: [
                        { required: true, message: '请填写交货天数', trigger: 'blur' }
                    ],
                    deliveryLevel: [
                        { required: true, message: '请选择货期等级', trigger: 'blur' }
                    ],
                    clientCode: [
                        { required: true, message: '请选择客户', trigger: 'blur' }
                    ],
                    packMethodName: [
                        { required: true, message: '请选择包装方式', trigger: 'blur' }
                    ],
                    padPastingMethodCode: [
                        { required: true, message: '请选择贴膜要求', trigger: 'blur' }
                    ],
                    /*brandName: [
                        { required: true, message: '请选择品牌', trigger: 'blur' }
                    ],*/
                    /*loaderMethodName: [
                        { required: true, message: '请选择提货方式', trigger: 'blur' }
                    ],*/
                    prdMethodName: [
                        { required: true, message: '请选择生产方式', trigger: 'blur' }
                    ],
                    supplyCompanyName: [
                        { required: true, message: '请选择生产基地', trigger: 'blur' }
                    ],
                    vatTypeCode: [
                        { required: true, message: '请选择开票类型', trigger: 'blur' }
                    ],
                    usrTxt1Name: [
                        { required: true, message: '请选择喷码', trigger: 'blur' }
                    ],
                    //remark: [
                    //    { required: true, message: '请输入备注', trigger: 'blur' }
                    //],
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
                    {name:'订单编号',prop:'refDocCode',type:'outter'},
                    {name:'下单日期',prop:'docDate',type:'outter'},
                    {name:'交货日期',prop:'deliveryDate',type:'outter'},
                    {name:'单据状态',prop:'docStatusName',type:'outter'},
                    {name:'制单人',prop:'enterName',type:'outter'},
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
                        name1:'订单号/',
                        prop1:'refDocCode',
                        name2:'状态',
                        prop2:'docStatusName',
                        status: 'docStatus',
                        type:'mixinStatus',
                        width: '125'
                    },
                    {
                        name1:'下单日期/',
                        prop1:'docDate',
                        name2:'交货日期',
                        prop2:'deliveryDate',
                        type:'mixin',
                        width: '128'
                    },
                    {
                        name1:'单据类型/',
                        prop1:'docType',
                        name2:'工程名称',
                        prop2:'projectName',
                        type:'mixin',
                        width: '130',
                        tooltip: true
                    },
                    {
                        name1:'录入人/',
                        prop1:'enterName',
                        name2:'录入日期',
                        prop2:'enterTime',
                        type:'mixin',
                        width: '130',
                        tooltip: true
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
                orderId: null,
                usrTxt1Name: null,
                usrTxt1: null,
                docCode: null,
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
                tabLeft: '100px',
                activeName: 'first',
                childDetailRow: {},
                copyChildDetailRow: {},
                clickTimes: 0,
                editIndex: 0,
                isAddDetail: false,
                //订单明细数据
                tabDataI: [],
                copyDataI: [],
                loadingI: false,
                isShowNotAllowed: false,
                //型号
                firstMatCode: null,
                matCodeList: [],
                matCodeTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],

                //颜色
                firstColorName: null,
                colorCodeList: [],
                colorCodeTHs: [
                    //{label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //材质资料
                firstMatAlloy: null,
                matAlloyList: [],
                matAlloyTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //获取膜厚
                firstMatThick: null,
                matThickList: [],
                matThickTHs: [
                    {label:'代码',prop:'fcode'},
                    {label:'名称',prop:'fname'}
                ],
                //单据类型
                orderTypeList: [],
                //货期等级
                deliveryLevelList: [],
                //提货方式
                deliveryMethodList: [],
                //开票类型
                vatTypeNameList: [],
                //喷码
                usrTxt1List: [],
                //禁喷类型
                usrTxt2List: [],
                //贴膜要求
                padPastingMethodList: [],
                //生产方式
                prdMethodList: [],
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
                    //获取喷码
                    markMethod: null,
                    markMethodList: [],
                    markMethodTHs: [
                        {label:'代码',prop:'fcode'},
                        {label:'名称',prop:'fname'}
                    ],

                    //胶注
                    injectionFlag:null,
                    injectionFlagList:[],
                    injectionFlagTHs:[
                        {label:'代码',prop:'fcode'},
                        {label:'名称',prop:'fname'}
                    ],
                    //胶条
                    stripFlag:null,
                    stripFlagList:[],
                    stripFlagTHs:[
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
            this.getDeliveryMethod();
            this.getPrdMethodList();
            this.getVatTypeNameList();
            this.getUsrTxt2List();
            this.getPadPastingMethodList();
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
                            this.pageObj.commonTotal = 0;
                            this.detailId = null;
                            this.orderId = null;
                        }
                    })
            },
            //刷新
            handleRefresh() {
                this.isBanOperate = true;
                this.getData();
                this.detailForm = {};
                this.detailId = null;
                this.orderId = null;
                this.usrTxt1Name = null;
                this.usrTxt1 = null,
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.copyDataI = [];
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
                this.copyDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.handleCancel(this.operateType);
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
                this.orderId = row.orderId;
                this.docCode = row.docCode;
                this.usrTxt1 = row.usrTxt1;
                this.usrTxt1Name = row.usrTxt1Name;
            },
            //主表添加行
            handleAdd() {
                this.operateType = 'add';
                this.addForm = {};
                this.addOrEditForm = {};
                this.clearSelect();
                this.$set(this.addOrEditForm,'docDate',new Date());
                this.defaultOrgClient();
                this.isShowStatus.isPopUp = true;
                this.otherVariable.popupTitle = this.otherVariable.addTitle;
                this.otherVariable.isEdit = false;
            },
            //复制新增
            copyAdd() {
                this.$confirm('是否复制新增?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
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
                })

            },
            //清空选择组件的数据
            clearSelect() {
                this.$refs.clientSelect.inputValueData = '';
                this.$refs.packMethodSelect.inputValueData = '';
                this.$refs.usr1Select.inputValueData = '';
                this.$refs.injectionFlagSelect.inputValueData = '';
                this.$refs.stripFlagSelect.inputValueData = '';
                this.valueObj.clientCode = '';
                this.valueObj.packMethodName = '';
                this.valueObj.markMethod = '';
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
            },
            isSaveChildRow() {
                this.$confirm('是否保存?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleSaveChild(0,'down');
                }).catch(() => {
                    console.log('cancel')
                })
            },
            //主表编辑行
            handleEdit() {
                this.operateType = 'edit';
                this.otherVariable.popupTitle = this.otherVariable.detailTitle;
                this.otherVariable.isEdit = true;
                this.addOrEditForm = this.detailForm;
                if(this.detailForm.fid) {
                    this.isShowStatus.isPopUp = true;
                    //包装方式
                    this.$set(this.addOrEditForm,'packMethodName',this.detailForm.packMethodName);
                    this.valueObj.packMethodName = this.detailForm.packMethodName;
                    //喷码
                    this.$set(this.addOrEditForm,'usrTxt1Name',this.detailForm.usrTxt1Name);
                    this.valueObj.markMethod = this.detailForm.usrTxt1Name;
                    //工程
                    this.$set(this.addOrEditForm,'projectName',this.detailForm.projectName);
                    this.valueObj.projectName = this.detailForm.projectName;
                    //合同编号
                    this.valueObj.contractCode = this.detailForm.contractCode;
                    //客户
                    this.$set(this.addOrEditForm,'clientCode',this.detailForm.clientCode);
                    this.valueObj.clientCode = this.detailForm.clientCode;

                    //注胶  injectionFlag
                    this.$set(this.addOrEditForm,'injectionFlag',this.detailForm.injectionFlag);
                    this.valueObj.injectionFlag = this.detailForm.injectionFlag;

                    //胶条
                    this.$set(this.addOrEditForm,'stripFlag',this.detailForm.stripFlag);
                    this.valueObj.stripFlag = this.detailForm.stripFlag;
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
                this.$refs.addOrEditForm.validate((valid) => {
                    if(valid) {
                        let tempObj;
                        let api;
                        if(type === 'add') {
                            api = '/oms/sls/SalesClientOrder/insertMaster';
                        }else {
                            api = '/oms/sls/SalesClientOrder/updateMaster';
                        }
                        tempObj = this.addOrEditForm;
                        this.otherVariable.isSaving = true;
                        this.fetch(api,tempObj)
                            .then(result => {
                                if(result.status === 200) {
                                    this.topFIds = [];
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    this.topFIds.push(result.data.fid);
                                    this.isShowStatus.isPopUp = false;
                                    this.addForm = {};
                                    type === 'add' ? this.getData() : this.getData(false);
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
                    this.$confirm('是否提交?', '提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.otherVariable.isSaving = true;
                        this.getAjax(`/oms/sls/SalesClientOrder/clientConfirm?orderId=${this.detailForm.fid}&docStatus=${this.detailForm.docStatus}`)
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
                                        message: this.returnErrorMsg(result.message),
                                        type: 'error'
                                    });
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
            //获取从表
            getChildTable(fid,index,type) {
                this.clickTimes = 0;
                this.loadingI = true;
                this.isShowNotAllowed = true;
                this.getAjax(`/oms/sls/SalesClientOrder/getOrderDetail?pageSize=1000&clientOrderMasterId=${fid}`)
                    .then(result => {
                        this.isShowNotAllowed = false;
                        if(result.data && result.data.list) {
                            this.tabDataI = result.data.list;
                            this.copyDataI = this.$lodash.cloneDeep(this.tabDataI);
                        }else {
                            this.tabDataI = [];
                            this.copyDataI = [];
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
            handleAddChild(type = 'up') {
                this._getUsrTxt1List();
                this.editIndex = 0;
                this.clearSelectData();
                this.clearHeadData();
                if(this.detailForm.fid) {
                    this.isShowCopyBtn = false;
                    this.isAddDetail = true;
                    this.childDetailRow.fid = null;
                    if(type === 'up') {
                        this.otherVariable.isChildEdit = true;
                        this.$nextTick(()=>{
                            this.tempForm = {matCode:'',matName:'',cx1:'',cx1Name:'',cx2:'',cx2Name:'',cx3:'',cx3Name:'',usrTxt1Name:this.usrTxt1Name,isEditState:true};
                            this.tabDataI.unshift(this.$lodash.cloneDeep(this.tempForm));
                        });
                        setTimeout(() => {
                            $('.el-table__body-wrapper .el-input__inner')[0].focus();
                        },200)
                    }else {
                        this.otherVariable.isChildEdit = false;
                        this.isAddDetail = false;
                    }
                }else {
                    this.$message({
                        message: '请选择订单',
                        type: 'warning'
                    });
                }
            },
            //复制新增明细
            copyAddChild() {
                this.childDetailRow.masterId = this.detailId;
                this.childDetailRow.docCode = this.docCode;
                this.childDetailRow.usrTxt1 = this.usrTxt1;
                this.childDetailRow.usrTxt1Name = this.usrTxt1Name;
                this.handleSaveChild(0,'down',true);
            },
            //从表保存
            handleSaveChild(index,type,isCopy = false) {
                this.isCanSave = true;
                let isHasId;
                let isSave = true;
                this.childDetailRow.fid ? isHasId = true : isHasId = false;
                if(isCopy) {
                    this.saveUrl = '/oms/sls/SalesClientOrder/insertDetail';
                    this.saveObj = this.$lodash.cloneDeep(this.childDetailRow);
                    delete this.saveObj.fid;
                    delete this.saveObj.variantId;
                    delete this.saveObj.itemNo;
                    this.saveChild(isSave,true,type,isCopy);
                }else {
                    if(!isHasId) {
                        this.saveUrl = '/oms/sls/SalesClientOrder/insertDetail';
                        this.saveObj = this.tabDataI[0];
                        this.saveObj.masterId = this.detailId;
                        this.saveObj.docCode = this.docCode;
                        this.saveObj.usrTxt1 = this.usrTxt1;
                        if(!(this.saveObj['matCode']||this.saveObj['cx1']||this.saveObj['cx2']||this.saveObj['cx3'])) {
                            this.handleCancelChild();
                            isSave = false;
                        }
                        this.saveChild(isSave,true,type);
                    }else {
                        this.saveUrl = '/oms/sls/SalesClientOrder/updateDetail';
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
            saveChild(isSave,isAdd = false,type = 'down',isCopy = false) {
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
                                if(isCopy) {
                                    that.tabDataI = [...that.copyDataI,...result.data];
                                }else {
                                    that.tabDataI.shift();
                                    that.tabDataI = [...result.data,...that.tabDataI];
                                }
                                that.tabDataI = that.giveState(that.tabDataI);
                                that.copyDataI = that.$lodash.cloneDeep(that.tabDataI);
                                that.handleAddChild(type);
                            }else {
                                //that.handleCancelChild();
                                let editId = that.saveObj.parentVariantId || that.saveObj.variantId;
                                let tempIndex = that.$lodash.findIndex(that.copyDataI, ['variantId', editId]);
                                let tempFid;
                                result.data.forEach(item => {
                                    tempFid = item.fid;
                                });
                                let lastArr = that.copyDataI.filter((child)=>{
                                    return tempFid !== child.fid
                                });
                                let resultData = result.data;
                                resultData.unshift(tempIndex,0);
                                Array.prototype.splice.apply(lastArr,resultData);
                                that.tabDataI = that.giveState(lastArr);
                                that.copyDataI = that.$lodash.cloneDeep(that.tabDataI);
                                that.otherVariable.isChildEdit = false;
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
            },
            //从表取消操作
            handleCancelChild() {
                this.isCanSave = false;
                //this.getChildTable(this.detailId);
                this.tabDataI = this.$lodash.cloneDeep(this.copyDataI);
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
                                    this.tabDataI.splice(index,1);
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
                            digit += Number(d.digit || 0);
                            theoryWght += Number(d.theoryWght || 0);
                        }
                    })
                }
                sums[0] = '合计';
                //订单数
                sums[7] = digit;
                //理重
                theoryWght ? sums[10] = theoryWght.toFixed(3) : sums[10] = 0;
                return sums;
            },
            //清空下拉数据
            clearSelectData() {
                this.matCodeList = [];
                this.colorCodeList = [];
                this.matAlloyList = [];
                this.matThickList = [];
            },
            //清空首项
            clearHeadData() {
                this.firstMatCode = null;
                this.firstColorName = null;
                this.firstMatAlloy = null;
                this.firstMatThick = null;
            },
            //从表点击行
            clickDetail(row) {
                if(!this.isAddDetail) {
                    this.clearSelectData();
                    this.isShowCopyBtn = !(Boolean(row.variantId)&&Boolean(row.parentVariantId));
                    this.clickTimes += 1;
                    if(this.isBanOperate) {
                        if(!this.otherVariable.isReadTable) {
                            this.otherVariable.isChildEdit = true;
                            this.tabDataI = this.giveState(this.tabDataI);
                            row.isEditState = true;
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
                }else {
                    this.editIndex = 0
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

            //设置型号
            setMatCode(val,isNext = true) {
                if(val) {
                    this.fetch('/oms/BasedataController/getAluModel',{fcode:val})
                        .then(result => {
                            if(result.data && result.data.list && result.data.list.length) {
                                let item = result.data.list[0];
                                this.$set(this.tabDataI[this.editIndex],'matCode',item.fcode);
                                this.$set(this.tabDataI[this.editIndex],'matName',item.fname);
                                //机台级别
                                this.$set(this.tabDataI[this.editIndex],'machineLevelName',item.machineLevel);
                                //支/扎
                                this.$set(this.tabDataI[this.editIndex],'perLotQty',item.perLotDigit);
                                //禁喷类型
                                if(!item.banSprayType) {
                                    this.$set(this.tabDataI[this.editIndex],'isNotUrsTxt2',true);
                                }else {
                                    this.$set(this.tabDataI[this.editIndex],'isNotUrsTxt2',false);
                                }
                                this.setUsrTxt2(item.banSprayType);
                                //胶条规格
                                this.$set(this.tabDataI[this.editIndex],'usrTxt6',item.pvcCode);
                                this.$set(this.tabDataI[this.editIndex],'usrTxt6Name',item.pvcName);
                                //撕筋
                                if(!item.isTear) {
                                    this.$set(this.tabDataI[this.editIndex],'isNotTear',true);
                                }else {
                                    this.$set(this.tabDataI[this.editIndex],'isNotTear',false);
                                }
                                let isTear;
                                item.isTear ? isTear = '✔' : isTear = 'x';
                                this.$set(this.tabDataI[this.editIndex],'usrTxt3Name',isTear);
                                this.$set(this.tabDataI[this.editIndex],'usrTxt3',item.isTear.toString());
                                this.$set(this.tabDataI[this.editIndex],'isTear',item.isTear);
                            }
                        });
                    if(isNext) {
                        this.nextFocus();
                        this.$nextTick(() => {
                            this.$refs.matCodeSelect.handleClose();
                        })
                    }
                }else {
                    if(isNext) {
                        this.$message({message: '型材型号不能为空', type: 'warning'});
                    }
                    this.$set(this.tabDataI[this.editIndex],'matCode',null);
                    this.$set(this.tabDataI[this.editIndex],'matName',null);
                    //机台级别
                    this.$set(this.tabDataI[this.editIndex],'machineLevelName',null);
                    //支/扎
                    this.$set(this.tabDataI[this.editIndex],'perLotQty',null);
                    //禁喷类型
                    this.setUsrTxt2(null);
                    //胶条规格
                    this.$set(this.tabDataI[this.editIndex],'usrTxt6Name',null);
                    //撕筋
                    this.$set(this.tabDataI[this.editIndex],'usrTxt3Name',null);
                    this.$set(this.tabDataI[this.editIndex],'usrTxt3',null);
                    this.$set(this.tabDataI[this.editIndex],'isTear',null);
                }
            },
            //设置颜色
            setColorCode(val,isNext = true) {
                if(val) {
                    let item = this.colorCodeList.find(item => item.fname === val);
                    if(JSON.stringify(item) !== {}) {
                        this.$set(this.tabDataI[this.editIndex],'colorId',item.fid);
                        this.$set(this.tabDataI[this.editIndex],'cx1',item.fcode);
                        this.$set(this.tabDataI[this.editIndex],'cx1Name',item.fname);
                        //喷码
                        this.setUsrTxt1(item.usrTxt1Name||this.usrTxt1Name);
                    }
                    if(isNext) {
                        this.nextFocus();
                        this.$nextTick(() => {
                            this.$refs.colorSelect.handleClose();
                        })
                    }
                }else {
                    if(isNext) {
                        this.$message({message: '颜色不能为空', type: 'warning'});
                    }
                    this.$set(this.tabDataI[this.editIndex],'colorId',null);
                    this.$set(this.tabDataI[this.editIndex],'cx1',null);
                    this.$set(this.tabDataI[this.editIndex],'cx1Name',null);
                    //喷码
                    this.setUsrTxt1(this.usrTxt1Name);
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
                this.$set(this.addOrEditForm,'projectName',item.fname);
                //this.$set(this.addOrEditForm,'contractCode',item.contractCode);
                //this.$set(this.addOrEditForm,'contractId',item.contractId);
                this.getBrandList(item.fid);
            },

            //客户合同列表
            getClientContract(val) {
                this.$refs.commondata.getClientContract(val)
            },
            setContract(item) {
                this.$set(this.valueObj,'contractCode',item.contractCode);
                this.$set(this.addOrEditForm,'contractCode',item.contractCode);
            },
            setContractVal(val) {
                this.$set(this.valueObj,'contractCode',val);
                this.$set(this.addOrEditForm,'contractCode',val);
            },

            //客户工程列表
            getClientProject(val) {
                this.$refs.commondata.getClientProject(val)
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
                let item;
                item = this.brandList.find(item => item.fname === val);
                if(JSON.stringify(item) !== {} && JSON.stringify(item)) {
                    this.addOrEditForm.brandId = item.fid
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
