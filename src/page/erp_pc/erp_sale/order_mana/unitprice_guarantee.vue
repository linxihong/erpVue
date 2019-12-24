<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap" @click="handleNotAllowed" v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" v-if="false">批量计算</el-button>
                <el-button @click="handleRefresh">刷新</el-button>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="searchProp"
                :searchForm="searchForm"
                @selectChange="selectChange"
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
                                <span v-if="!item.isCheck&&!item.isStatus">{{ detailForm[item.prop] }}</span>
                                <span v-if="item.isCheck">{{ detailForm[item.prop] === 1 ? '✔':'×' }}</span>
                                <span v-if="item.isStatus">{{ returnStatusName[detailForm[item.prop]] }}</span>
                            </div>
                        </template>
                    </div>
                </template>
                <!--头部按钮-->
                <template slot="main-btn-wrap">
                    <div class="xs-audit-icon" @click="handlePrice" v-if="showPrice&&!otherVariable.isChildEdit">提交</div>
                    <div class="xs-unaudit-icon" @click="handldUnPrice" v-if="showUnPrice&&!otherVariable.isChildEdit">撤销</div>
                    <div class="xs-icon-confirm menu-icon-finance" v-show="false"></div>
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
                    <div class="tab-btn-wrap" :style="{left: tabLeft}">
                        <el-button @click="handleCancelChild" v-if="otherVariable.isChildEdit">取消</el-button>
                        <el-button class="btn-cyan" @click="handleSaveChild()" v-if="otherVariable.isChildEdit">批量保存</el-button>
                        <!--<el-button class="btn-cyan search-btn" @click="handleLock" v-if="otherVariable.isChildEdit">锁价</el-button>-->
                    </div>
                    <!--tab区域-->
                    <el-tabs v-model="activeName" class="common-content-tab order_style">
                        <el-tab-pane label="价格明细" name="first" ref="pricedetail">
                            <!--<div @click="isSaveChildRow" v-if="otherVariable.isChildEdit" class="not-allowed-tableI" :style="{height:editIndex*34+'px'}"></div>-->
                            <!--<div @click="isSaveChildRow" v-if="otherVariable.isChildEdit" class="not-allowed-tableII" :style="{height:$store.state.screenHei*0.60-102-editIndex*34+'px'}"></div>-->
                            <el-table
                                v-if="isResize"
                                ref="pricetable"
                                tooltip-effect="dark"
                                v-loading="loadingI"
                                :data="tabDataI"
                                @row-click="clickDetail"
                                @header-click="showBatchDialog"
                                border
                                :height="tableHeightI"
                                highlight-current-row
                            >
                                <el-table-column label="项目号" align="left" width="120px" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.itemNo}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="型号" align="left" width="120px">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.matCode }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="颜色" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.cx1Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="型材类别" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.matGroupName }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="颜色类别" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.colorGroupName }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="含税" align="center" width="55">
                                    <template slot-scope="scope">
                                        <!--<span v-if="scope.row.isLocked !== 1 && scope.row.isCheck !== 1">{{ scope.row.contractPrice?parseFloat(scope.row.contractPrice).toFixed(3):'' }}</span>-->
                                        <span class="num-cell-r" v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.isTax==1?'是':scope.row.isTax==0?'否':''}}</span>
                                        <el-select
                                            data-index
                                            @focus="setFocus(0)"
                                            @visible-change="banNextFocus"
                                            @keydown.enter.native="selectEnterEvent"
                                            v-model="scope.row.isTax"
                                            style="width:100%;background:#fff;border-radius: 5px;"
                                            v-if="scope.row.isEditState&&!scope.row.parentVariantId">
                                            <el-option
                                                v-for="(item,index) in isTaxList"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="总加工单价" align="center">
                                    <el-table-column label="单价" align="right" width="100">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.price}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="单位" align="center" width="55">
                                        <template slot-scope="scope">
                                            <!--<span v-if="scope.row.isLocked !== 1 && scope.row.isCheck !== 1">{{ scope.row.contractPrice?parseFloat(scope.row.contractPrice).toFixed(3):'' }}</span>-->
                                            <span v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.priceUom}}</span>
                                            <el-select
                                                data-index
                                                @focus="setFocus(1)"
                                                @visible-change="banNextFocus"
                                                @keydown.enter.native="selectEnterEvent"
                                                v-model="scope.row.priceUom"
                                                style="width:100%;background:#fff;border-radius: 5px;"
                                                v-if="scope.row.isEditState&&!scope.row.parentVariantId">
                                                <el-option
                                                    v-for="(item,index) in priceUomList"
                                                    :key="index"
                                                    :label="item.value"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="总加工单价组成" align="center">
                                    <el-table-column label="铝锭价" :align="otherVariable.isChildEdit?'center':'right'">
                                        <template slot-scope="scope">
                                            <!--<span v-if="scope.row.isLocked !== 1 && scope.row.isCheck !== 1 && !scope.row.isEditState">{{ scope.row.alPrice?parseFloat(scope.row.alPrice).toFixed(3):'' }}</span>-->
                                            <!--<span class="num-cell-r" v-if="scope.row.isTax&&!scope.row.parentVariantId">
                                                {{  aluTaxPrice ? parseFloat(aluTaxPrice).toFixed(3): aluTaxPrice }}
                                            </span>
                                            <span class="num-cell-r" v-if="!scope.row.isTax&&!scope.row.parentVariantId">
                                                {{  aluPrice ? parseFloat(aluPrice).toFixed(3): aluPrice }}
                                            </span>
                                            <span v-if="scope.row.parentVariantId"></span>-->
                                            <span class="num-cell-r" v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.pricePart1?parseFloat(scope.row.pricePart1).toFixed(3):aluTaxPrice }}</span>
                                            <el-input
                                                data-index
                                                @focus="setFocus(2)"
                                                @keydown.enter.native="nextFocus"
                                                @keyup.native="updatePrice(scope.row,scope.$index)"
                                                v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                v-model.trim="scope.row.pricePart1">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="铝加工" prop="pricePart2" label-class-name="table-click-head" :align="otherVariable.isChildEdit?'center':'right'">
                                        <template slot-scope="scope">
                                            <!--<span v-if="scope.row.isLocked !== 1 && scope.row.isCheck !== 1 && !scope.row.isEditState">{{ scope.row.contractPricePart1?parseFloat(scope.row.contractPricePart1).toFixed(3):'' }}</span>-->
                                            <span class="num-cell-r" v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.pricePart2?parseFloat(scope.row.pricePart2).toFixed(3):scope.row.pricePart2 }}</span>
                                            <el-input
                                                data-index
                                                @focus="setFocus(3)"
                                                @keydown.enter.native="nextFocus"
                                                @keyup.native="updatePrice(scope.row,scope.$index)"
                                                v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                v-model.trim="scope.row.pricePart2">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="表面加工" align="right" >
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.pricePart3}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="深加工" align="right">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.pricePart4}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="附加费" align="center">
                                        <el-table-column label="附加合计" align="right">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r">{{ scope.row.pricePart5}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="特殊材质费" prop="usrPricePart1" label-class-name="table-click-head" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r" v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.usrPricePart1?parseFloat(scope.row.usrPricePart1).toFixed(3):scope.row.usrPricePart1 }}</span>
                                                <el-input
                                                    data-index
                                                    @focus="setFocus(4)"
                                                    @keydown.enter.native="nextFocus"
                                                    @keyup.native="updatePrice(scope.row,scope.$index)"
                                                    v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                    v-model.trim="scope.row.usrPricePart1">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="特殊包装费" prop="usrPricePart2" label-class-name="table-click-head" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r" v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.usrPricePart2?parseFloat(scope.row.usrPricePart2).toFixed(3):scope.row.usrPricePart2 }}</span>
                                                <el-input
                                                    data-index
                                                    @focus="setFocus(5)"
                                                    @keydown.enter.native="nextFocus"
                                                    @keyup.native="updatePrice(scope.row,scope.$index)"
                                                    v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                    v-model.trim="scope.row.usrPricePart2">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="长料费" prop="usrPricePart3" label-class-name="table-click-head" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r" v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.usrPricePart3?parseFloat(scope.row.usrPricePart3).toFixed(3):scope.row.usrPricePart3 }}</span>
                                                <el-input
                                                    data-index
                                                    @focus="setFocus(6)"
                                                    @keydown.enter.native="nextFocus"
                                                    @keyup.native="updatePrice(scope.row,scope.$index)"
                                                    v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                    v-model.trim="scope.row.usrPricePart3">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="小料费" prop="usrPricePart4" label-class-name="table-click-head" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r" v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.usrPricePart4?parseFloat(scope.row.usrPricePart4).toFixed(3):scope.row.usrPricePart4 }}</span>
                                                <el-input
                                                    data-index
                                                    @focus="setFocus(7)"
                                                    @keydown.enter.native="nextFocus"
                                                    @keyup.native="updatePrice(scope.row,scope.$index)"
                                                    v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                    v-model.trim="scope.row.usrPricePart4">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="机型费" prop="usrPricePart5" label-class-name="table-click-head" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r" v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.usrPricePart5?parseFloat(scope.row.usrPricePart5).toFixed(3):scope.row.usrPricePart5 }}</span>
                                                <el-input
                                                    data-index
                                                    @focus="setFocus(8)"
                                                    @keydown.enter.native="nextFocus"
                                                    @keyup.native="updatePrice(scope.row,scope.$index)"
                                                    v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                    v-model.trim="scope.row.usrPricePart5">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="锯挂痕费" prop="usrPricePart6" label-class-name="table-click-head" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r" v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.usrPricePart6?parseFloat(scope.row.usrPricePart6).toFixed(3):scope.row.usrPricePart6 }}</span>
                                                <el-input
                                                    data-index
                                                    @focus="setFocus(9)"
                                                    @keydown.enter.native="nextFocus"
                                                    @keyup.native="updatePrice(scope.row,scope.$index)"
                                                    v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                    v-model.trim="scope.row.usrPricePart6">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="撕筋费" prop="usrPricePart7" label-class-name="table-click-head" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r" v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.usrPricePart7?parseFloat(scope.row.usrPricePart7).toFixed(3):scope.row.usrPricePart7}}</span>
                                                <el-input
                                                    data-index
                                                    @focus="setFocus(10)"
                                                    @keydown.enter.native="nextFocus"
                                                    @keyup.native="updatePrice(scope.row,scope.$index)"
                                                    v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                    v-model.trim="scope.row.usrPricePart7">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="禁喷加工费" align="right">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r">{{ scope.row.usrPricePart8 }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="特殊加工费" align="right">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r">{{ scope.row.usrPricePart9 }}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="表面加工" prop="otherPrice" label-class-name="table-click-head" align="center">
                                    <el-table-column label="单价" :align="otherVariable.isChildEdit?'center':'right'">
                                        <template slot-scope="scope">
                                            <!--<span v-if="scope.row.isLocked !== 1 && scope.row.isCheck !== 1 && !scope.row.isEditState">{{ scope.row.contractOtherPrice?parseFloat(scope.row.contractOtherPrice).toFixed(3):'' }}</span>-->
                                            <span class="num-cell-r" v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.otherPrice?parseFloat(scope.row.otherPrice).toFixed(3):scope.row.otherPrice}}</span>
                                            <el-input
                                                data-index
                                                @focus="setFocus(11)"
                                                @keydown.enter.native="nextFocus"
                                                @keyup.native="updatePrice(scope.row,scope.$index)"
                                                v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                v-model.trim="scope.row.otherPrice">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="单位" width="55" align="center">
                                        <template slot-scope="scope">
                                            <!--<span v-if="scope.row.isLocked !== 1 && scope.row.isCheck !== 1">{{ scope.row.contractPrice?parseFloat(scope.row.contractPrice).toFixed(3):'' }}</span>-->
                                            <span class="num-cell-l" v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.areaPriceUom}}</span>
                                            <el-select
                                                clearable
                                                data-index
                                                @focus="setFocus(12)"
                                                @visible-change="banNextFocus"
                                                @keydown.enter.native="selectEnterEvent"
                                                v-model="scope.row.areaPriceUom"
                                                placeholder="请选择"
                                                style="width:100%;background:#fff;border-radius: 5px;"
                                                v-if="scope.row.isEditState&&!scope.row.parentVariantId">
                                                <el-option
                                                    @click.native="updatePrice(scope.row,scope.$index)"
                                                    v-for="(item,index) in areaPriceUomList"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.label">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="深加工费" prop="sjgPrice" label-class-name="table-click-head" align="center">
                                    <el-table-column label="单价" :align="otherVariable.isChildEdit?'center':'right'">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r" v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.sjgPrice }}</span>
                                            <el-input
                                                data-index
                                                @focus="setFocus(13)"
                                                @keydown.enter.native="nextFocus"
                                                @keyup.native="updatePrice(scope.row,scope.$index)"
                                                v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                v-model.trim="scope.row.sjgPrice">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="单位" width="55" align="center">
                                        <template slot-scope="scope">
                                            <span v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.sjgPriceUom }}</span>
                                            <el-select
                                                clearable
                                                data-index
                                                @focus="setFocus(14)"
                                                @visible-change="banNextFocus"
                                                @keydown.enter.native="selectEnterEvent"
                                                v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                v-model="scope.row.sjgPriceUom"
                                                style="width:100%;background:#fff;border-radius: 5px;"
                                            >
                                                <el-option
                                                    @click.native="updatePrice(scope.row,scope.$index)"
                                                    v-for="(item,index) in sjgPriceUomList"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.label">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="特殊加工" prop="specialPrice" label-class-name="table-click-head" align="center">
                                    <el-table-column label="单价" :align="otherVariable.isChildEdit?'center':'right'">
                                        <template slot-scope="scope">
                                            <span v-if="!scope.row.isEditState||scope.row.parentVariantId" class="num-cell-r">{{ scope.row.specialPrice }}</span>
                                            <el-input
                                                data-index
                                                @focus="setFocus(15)"
                                                @keydown.enter.native="nextFocus"
                                                @keyup.native="updatePrice(scope.row,scope.$index)"
                                                v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                v-model.trim="scope.row.specialPrice">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="单位" width="55" align="center">
                                        <template slot-scope="scope">
                                            <span v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.specialPriceUom }}</span>
                                            <el-select
                                                clearable
                                                data-index
                                                @focus="setFocus(16)"
                                                @visible-change="banNextFocus"
                                                @keydown.enter.native="selectEnterEvent"
                                                v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                v-model="scope.row.specialPriceUom"
                                                style="width:100%;background:#fff;border-radius: 5px;"
                                            >
                                                <el-option
                                                    @click.native="updatePrice(scope.row,scope.$index)"
                                                    v-for="(item,index) in specialPriceUomList"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.label">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="禁喷加工费" prop="jpPrice" label-class-name="table-click-head" align="center">
                                    <el-table-column label="单价" :align="otherVariable.isChildEdit?'center':'right'">
                                        <template slot-scope="scope">
                                            <span v-if="!scope.row.isEditState||scope.row.parentVariantId" class="num-cell-r">{{ scope.row.jpPrice }}</span>
                                            <el-input
                                                data-index
                                                @focus="setFocus(17)"
                                                @keydown.enter.native="nextFocus"
                                                @keyup.native="updatePrice(scope.row,scope.$index)"
                                                v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                v-model.trim="scope.row.jpPrice">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="单位" width="55" align="center">
                                        <template slot-scope="scope">
                                            <span v-if="!scope.row.isEditState||scope.row.parentVariantId">{{ scope.row.jpPriceUom }}</span>
                                            <el-select
                                                clearable
                                                data-index
                                                @focus="setFocus(18)"
                                                @visible-change="banNextFocus"
                                                @keydown.enter.native="selectEnterEvent"
                                                v-if="scope.row.isEditState&&!scope.row.parentVariantId"
                                                v-model="scope.row.jpPriceUom"
                                                style="width:100%;background:#fff;border-radius: 5px;"
                                            >
                                                <el-option
                                                    @click.native="updatePrice(scope.row,scope.$index)"
                                                    v-for="(item,index) in jpPriceUomList"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.label">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="材质" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.cx2Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="米重" align="right">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.meterWght }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="长度" align="right">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.cx4Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="膜厚" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.cx3Name }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="机台级别" align="right" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span class="num-cell-r">{{ scope.row.machineLevelName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="胶条规格" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.usrTxt6Name}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="生产要求" align="center">
                                    <el-table-column label="喷码" align="left" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrTxt1Name}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="喷码类型" align="left" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrTxt2Name }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="撕筋" align="center" width="55">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.usrTxt3==1?'√':'x'}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="包装方式" align="center">
                                    <el-table-column label="代码" align="left" width="120px">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.packMethodCode}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="名称" align="left" :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.packMethodName }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="备注" width="200" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.remark }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="!otherVariable.isChildEdit" label="操作" align="center" fixed="right">
                                    <template slot-scope="scope">
                                        <!--<span v-if="scope.row.isLocked">{{ scope.row.isLocked?'已锁价':'' }}</span>-->
                                        <el-button size="mini" v-if="scope.row.isLocked" @click.stop="handleLock(scope.row.priceId,0)">解锁</el-button>
                                        <el-button size="mini" v-if="!scope.row.isLocked" @click.stop="handleLock(scope.row.priceId,1)">锁价</el-button>
                                        <i class="el-icon-tickets" title="查看详情" @click.stop="handleOtherTable(scope.row,scope.$index)"></i>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div v-if="showTable" style="margin-top: 10px;">
                                <CommonTable
                                    v-if="isResize"
                                    ref="tabTableII"
                                    :isCenter="true"
                                    :isMulTable=true
                                    :otherVariable="otherVariable"
                                    :formTableData="tabDataIII"
                                    :formPropTable="tabPropIII"
                                    :tableHeight="tableHeightII"
                                >
                                </CommonTable>
                            </div>
                        </el-tab-pane>
                        <!--<el-tab-pane label="订单明细" name="second" ref="pricedetail">-->
                            <!--&lt;!&ndash;<div @click="isSaveChildRow" v-if="otherVariable.isChildEdit" class="not-allowed-tableI" :style="{height:editIndex*34+'px'}"></div>&ndash;&gt;-->
                            <!--&lt;!&ndash;<div @click="isSaveChildRow" v-if="otherVariable.isChildEdit" class="not-allowed-tableII" :style="{height:$store.state.screenHei*0.60-102-editIndex*34+'px'}"></div>&ndash;&gt;-->
                            <!--<el-table-->
                                <!--v-if="isResize"-->
                                <!--ref="pricetable"-->
                                <!--tooltip-effect="dark"-->
                                <!--v-loading="loadingI"-->
                                <!--:data="tabDataII"-->
                                <!--@row-click="clickDetail"-->
                                <!--@header-contextmenu="handleBatchEdit"-->
                                <!--border-->
                                <!--:height="tableHeightI"-->
                                <!--highlight-current-row-->
                            <!--&gt;-->
                                <!--<el-table-column label="型材" align="center">-->
                                    <!--<el-table-column label="型号" align="left" width="120px">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.matCode}}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column label="名称" align="left" :show-overflow-tooltip="true">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.matName}}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                <!--</el-table-column>-->


                                <!--<el-table-column label="颜色" align="center">-->
                                    <!--<el-table-column label="代码" align="left" width="120px">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.cx1}}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column label="名称" align="left" :show-overflow-tooltip="true">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.cx1Name}}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                <!--</el-table-column>-->


                                <!--<el-table-column label="材质" align="left" :show-overflow-tooltip="true">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.cx2Name}}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="长度" align="right">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span class="num-cell-r">{{ scope.row.cx4Name }}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="膜厚" align="right">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.cx3Name }}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="公差" align="right">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.diffName}}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="订单数" align="right">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.digit }}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="米重" align="right">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.meterWght }}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="支重" align="right">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.unitWght }}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="理论总重" align="right">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.theoryWght }}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="单支方数" align="right">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.unitSqm }}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->


                                <!--<el-table-column label="包装方式" align="center">-->
                                    <!--<el-table-column label="代码" align="left" width="120px">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.packMethodCode}}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column label="说明" align="left" :show-overflow-tooltip="true">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.packMethodName }}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column label="支/扎" align="left" :show-overflow-tooltip="true">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.perLotQty }}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="结算方式" align="center">-->
                                    <!--<el-table-column label="代码" align="left" width="120px">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.settlementMethod}}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column label="名称" align="left" :show-overflow-tooltip="true">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.settlementMethodName }}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="生产要求" align="center">-->
                                    <!--<el-table-column label="喷码" align="left" width="120px">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.usrTxt1Name}}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column label="禁喷类型" align="left" :show-overflow-tooltip="true">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.usrTxt2Name }}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column label="撕筋" align="left" :show-overflow-tooltip="true">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.usrTxt3==1?'√':'x' }}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="型材系列" align="center">-->
                                    <!--<el-table-column label="型号" align="left" width="120px">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.matSeriesCode}}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column label="名称" align="left" :show-overflow-tooltip="true">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.matSeriesName }}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="型材组" align="center">-->
                                    <!--<el-table-column label="代码" align="left" width="120px">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.matGroupCode}}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column label="名称" align="left" :show-overflow-tooltip="true">-->
                                        <!--<template slot-scope="scope">-->
                                            <!--<span>{{ scope.row.matGroupName }}</span>-->
                                        <!--</template>-->
                                    <!--</el-table-column>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="颜色类型" align="left" :show-overflow-tooltip="true">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.colorGroupName }}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="直径" align="left" :show-overflow-tooltip="true">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.usrTxt4Name }}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="机台级别" align="left" :show-overflow-tooltip="true">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.settlementMethodName }}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column label="备注" align="left">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span>{{ scope.row.machineLevelName}}</span>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                                <!--<el-table-column v-if="!otherVariable.isChildEdit" label="操作" align="center" fixed="right">-->
                                    <!--<template slot-scope="scope">-->
                                        <!--<span v-if="scope.row.isLocked">{{ scope.row.isLocked?'已锁价':'' }}</span>-->
                                        <!--<el-button v-if="!scope.row.isLocked" @click="handleLock">锁价</el-button>-->
                                        <!--<i class="el-icon-tickets" title="查看详情" @click.stop="handleOtherTable(scope.row,scope.$index)"></i>-->
                                    <!--</template>-->
                                <!--</el-table-column>-->
                            <!--</el-table>-->
                            <!--<div v-if="showTable" style="margin-top: 10px;">-->
                                <!--<CommonTable-->
                                    <!--v-if="isResize"-->
                                    <!--ref="tabTableII"-->
                                    <!--:isCenter="true"-->
                                    <!--:isMulTable=true-->
                                    <!--:otherVariable="otherVariable"-->
                                    <!--:formTableData="tabDataIII"-->
                                    <!--:formPropTable="tabPropIII"-->
                                    <!--:tableHeight="tableHeightII"-->
                                <!--&gt;-->
                                <!--</CommonTable>-->
                            <!--</div>-->
                        <!--</el-tab-pane>-->
                    </el-tabs>
                </template>
            </CommonDetailX>
        </div>
        <!--批量修改的弹框-->
        <el-dialog
            :title="batchTitle"
            :visible.sync="batchVisible"
            width="30%">
            <el-form :model="batchForm" :inline="true">
                <template v-if="['otherPrice','sjgPrice','specialPrice','jpPrice'].includes(batchType)">
                    <el-form-item>
                        <el-input v-model.trim="batchForm.inputVal"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <!--表面加工-->
                        <el-select
                            v-if="batchType === 'otherPrice'"
                            v-model="batchForm.inputValUom"
                            style="width:100%;">
                            <el-option
                                v-for="(item,index) in areaPriceUomList"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <!--深加工-->
                        <el-select
                            v-if="batchType === 'sjgPrice'"
                            v-model="batchForm.inputValUom"
                            style="width:100%;">
                            <el-option
                                v-for="(item,index) in sjgPriceUomList"
                                :key="index"
                                :label="item.label"
                                :value="item.label">
                            </el-option>
                        </el-select>
                        <!--特殊加工-->
                        <el-select
                            v-if="batchType === 'specialPrice'"
                            v-model="batchForm.inputValUom"
                            style="width:100%;">
                            <el-option
                                v-for="(item,index) in specialPriceUomList"
                                :key="index"
                                :label="item.label"
                                :value="item.label">
                            </el-option>
                        </el-select>
                        <!--禁喷加工-->
                        <el-select
                            v-if="batchType === 'jpPrice'"
                            v-model="batchForm.inputValUom"
                            style="width:100%;">
                            <el-option
                                v-for="(item,index) in jpPriceUomList"
                                :key="index"
                                :label="item.label"
                                :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-if="!['otherPrice','sjgPrice','specialPrice','jpPrice'].includes(batchType)">
                    <el-form-item>
                        <el-input v-model.trim="batchForm.inputVal"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="batchVisible = false">取 消</el-button>
                <el-button class="btn-cyan" @click="handleSaveChild(true)">确 定</el-button>
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
                mainHeight: 716,
                isResize: true,
                loadingI:false,
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                currentIndex: 0,
                enterTimes: 1,
                isBanNextFocus: false,
                clickTimes: 0,
                editIndex: 0,
                tableHeightI: this.$store.state.screenHei*0.62,
                tableHeightII: 150,
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    popupTitle: '',
                    //isMulSelect: true,
                    isInlineForm: true,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    isOtherTable: true
                },
                showTable: false,
                tempWidth: null,
                tableData: [],
                showPrice: false,
                showUnPrice: false,
                isTaxList:[
                    {
                        value: 1,
                        label: '是'
                    },
                    {
                        value: 0,
                        label: '否',
                    }
                ],
                //总加工价
                priceUomList:[
                    {value:'kg',label:'kg'}
                ],
                //表面加工
                areaPriceUomList:[],
                //深加工
                sjgPriceUomList: [],
                //特殊加工
                specialPriceUomList: [],
                //禁喷加工
                jpPriceUomList: [],
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
                        name:'价格状态',
                        prop:'tempStatus',
                        type:'selectChange',
                        selectList:[{value:0,label:'全部'},{value:1,label:'未提交'},{value:2,label:'已提交'},{value:3,label:'已审核'}],
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
                returnStatusName: {
                    '0':'未提交',
                    '50':'已提交',
                    '100':'已审核',
                    'null':'未提交'
                },
                //详情映射列表
                formProp: [
                    {name:'订单编号',prop:'refDocCode',type:'outter'},
                    {name:'下单日期',prop:'docDate',type:'outter'},
                    {name:'交货日期',prop:'deliveryDate',type:'outter'},
                    {name:'单据状态',prop:'priceStatus',type:'outter',isStatus:true},
                    {name:'已审价',prop:'isCheckPrice',type:'outter',isCheck:true},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'经销商',prop:'clientCode2',type:'inner'},
                    {name:'合同号',prop:'contractCode',type:'inner'},
                    {name:'铝锭取价方式',prop:'alPriceMethodName',type:'inner'},
                    {name:'铝锭价',prop:'alPrice',type:'inner'},
                    {name:'销售公司',prop:'companyName',type:'inner'},
                    {name:'取价日期',prop:'alPriceDateContract',type:'inner'},
                    {name:'结算方式',prop:'settlementMethodName',type:'inner'},
                    {name:'铝价日期',prop:'alPriceDate',type:'inner'},
                    {name:'喷码',prop:'usrTxt1Name',type:'inner'},
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
                        prop2:'priceStatus',
                        type:'is_check_price',
                        width: ''
                    },
                    {
                        name1:'单据类型/',
                        prop1:'docType',
                        name2:'下单日期',
                        prop2:'docDate',
                        type:'mixin',
                        width: '120'
                    },
                    {
                        name1:'客户/',
                        prop1:'clientCode',
                        name2:'经销商',
                        prop2:'clientCode2',
                        type:'mixin',
                        width: '100'
                    },
                    {
                        name1:'录入人/',
                        prop1:'enterName',
                        name2:'录入日期',
                        prop2:'enterTime',
                        type:'mixin',
                        width: ''
                    }
                ],
                searchForm: {
                    minPriceStatus: 0,
                    maxPriceStatus: 50
                },
                detailForm: {},
                priceIdsArray:[],
                detailId: null,
                aluTaxPrice: '',
                aluPrice: '',
                refMatPrice: null,
                //refMatProcessPrice: null,
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //详情表格内容
                tabLeft: '179px',
                activeName: 'first',
                //订单明细数据
                tabDataI: [],
                copyDataI: [],
                isShowNotAllowed: false,
                tabPropIII: [
                    {
                        prop:'itemNo', name:'序号',
                    },

                    {prop:'priceItemText', name:'合同条款内容',type:'normal',width:'100'},

                    {
                        prop:'', name:'价格',
                        children:[
                            {prop:'otherPrice',name:'面积(元/m²)',type:'normal'},
                            {prop:'price',name:'重量(元/kg)',type:'normal'},

                        ]
                    },
                    {
                        prop:'', name:'价格组成',
                        children:[
                            {prop:'',name:'加工费'},
                            {prop:'',name:'运算费'},
                            {prop:'',name:'打托费'},
                            {prop:'',name:'附加费'},

                        ]
                    },

                    {
                        prop:'', name:'特批不收费',
                        children:[
                            {prop:'',name:'运输'},
                            {prop:'',name:'打托'},

                        ]
                    },
                ],
                tabDataIII:[],
                tabDataII:[],
                //批量修改
                batchTitle: '',
                batchVisible: false,
                batchType: '',
                batchForm: {},
            }
        },
        watch: {
            'otherVariable.isChildEdit':{
                handler(val) {
                    this.isShowNotAllowed = val;
                }
            }
        },
        mounted() {
            this.getData();
            this.getUnitList();
            // 操作/布局相关
            this.listenResizeIII();
            this.changeSizeIII();
            this.tempWidth = this.otherVariable.contentWidth;
            //表格禁止右键弹出默认浏览器菜单
            this.$refs.pricedetail.$el.oncontextmenu = function() {return false};
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                this.tableData = [];
                this.showTable = false;
                this.fetch(`/oms/sls/SalesOrderPriceController/getOrderAndContractInfo?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list && result.data.list.length) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            if(isFirst) {
                                this.$nextTick(() => {
                                    this.$refs.commontable.renderRow(this.tableData[0].fid);
                                })
                            }
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },
            selectChange(val) {
                if(val === 0) {
                    this.searchForm.minPriceStatus = 0;
                    this.searchForm.maxPriceStatus = 101;
                }else if(val === 1) {
                    this.searchForm.minPriceStatus = 0;
                    this.searchForm.maxPriceStatus = 50;
                }else if(val === 2) {
                    this.searchForm.minPriceStatus = 50;
                    this.searchForm.maxPriceStatus = 100;
                }else if(val === 3) {
                    this.searchForm.minPriceStatus = 100;
                    this.searchForm.maxPriceStatus = 100;
                }
            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData()
            },
            //刷新
            handleRefresh() {
                this.getData();
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.showPrice = false;
                this.showUnPrice = false;
                this.detailForm = {};
            },
            //重置
            handleReset() {
                this.searchForm = {minPriceStatus: 0,maxPriceStatus: 50};
                this.handleRefresh();
            },
            //点击主表行
            handleDetail(row) {
                if(row.priceStatus === 0 || row.priceStatus === null) {
                    this.showPrice = true;
                    this.showUnPrice = false;
                }else if(row.priceStatus === 50){
                    this.showPrice = false;
                    this.showUnPrice = true;
                }else {
                    this.showPrice = false;
                    this.showUnPrice = false;
                }
                this.isShowStatus.isRead = true;
                this.detailForm = row;
                this.refMatPrice = row.alPrice;
                this.showTable = false;
                this.tabDataIII = [];
                this.detailId = row.fid;
                this.getDetailTable(row.fid);
                this.getOrderDetailTable(row.fid);
                this.getPricePart(row.fid);
            },
            //获取从表
            getDetailTable(fid) {
                this.tabDataI = [];
                this.copyDataI = [];
                this.priceIdsArray = [];
                this.loadingI=true;
                this.otherVariable.isChildEdit = false;
                this.isShowNotAllowed = true;
                this.fetch('/oms/sls/SalesOrderPriceController/getMatOrderAndPrice', {flowId: fid})
                    .then(result => {
                        this.isShowNotAllowed = false;
                        if(result.status === 200 && result.data) {
                            result.data.forEach(item => {
                                item.pricePart8 = this.refMatPrice;
                                item.pricePart1 = this.aluTaxPrice;
                                if(!item.parentVariantId) {
                                    !item.isTax ? item.isTax = 0 : '';
                                    !item.priceUom ? item.priceUom = 'kg' : '';
                                }
                                item._curdFlag = 'r';
                                item === null ?item = '' : '';
                                this.priceIdsArray.push(item.priceId);
                            });
                            this.tabDataI = result.data;
                            this.copyDataI = this.$lodash.cloneDeep(this.tabDataI);
                        }else {
                            this.tabDataI = [];
                            this.copyDataI = [];
                        }
                    }).then(()=>{
                    this.loadingI = false;
                })
            },
            getOrderDetailTable(fid) {
                this.tabDataII = [];
                this.fetch('/oms/sls/SalesOrderPriceController/getOrderDetailInPrice', {orderFlowId: fid})
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            this.tabDataII = result.data;
                        }else {
                            this.tabDataII = [];
                        }
                    })
            },
            getPricePart(fid) {
                this.aluPrice = '';
                this.aluTaxPrice = '';
                this.fetch('/oms/MetalPriceController/getMetalPriceByOrder', {orderFlowId: fid})
                    .then(result => {
                        if(result.status === 200 && result.data) {
                            this.aluPrice = result.data.price;
                            this.aluTaxPrice = result.data.taxPrice;
                            this.detailForm.alPrice = this.aluTaxPrice;
                        }
                    })
            },
            //提交
            handlePrice() {
                let resultStatus;
                this.$confirm('是否提交?','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.fetch('/oms/sls/SalesOrderPriceController/submitPrice', {orderFlowId: this.detailId,priceStatus:50,priceIdsArray:this.$lodash.compact(this.priceIdsArray)})
                        .then(result => {
                            resultStatus = result.status;
                            if(result.status === 200) {
                                this.$message({
                                    message:'操作成功',
                                    type:'success'
                                });
                                this.getData();
                            }else {
                                this.$message({
                                    message:this.returnErrorMsg(result.error),
                                    type:'error'
                                })
                            }
                        })
                })
            },
            //撤销
            handldUnPrice() {
                let resultStatus;
                this.fetch('/oms/sls/SalesOrderPriceController/submitPrice', {orderFlowId: this.detailId,priceStatus:0,priceIdsArray:this.$lodash.compact(this.priceIdsArray)})
                    .then(result => {
                        resultStatus = result.status;
                        if(result.status === 200) {
                            this.$message({
                                message:'操作成功',
                                type:'success'
                            });
                            this.getData();
                        }else {
                            this.$message({
                                message:this.returnErrorMsg(result.error),
                                type:'error'
                            })
                        }
                    })
            },
            //从表点击行
            clickDetail(row) {
                if(this.detailForm.isCheckPrice !== 1) {
                    this.showTable = false;
                    if(row.isLocked !== 1 && !this.otherVariable.isReadTable && this.showPrice) {
                        this.otherVariable.isChildEdit = true;
                        this.tabDataI = this.giveState(this.tabDataI);
                        this.copyDataI = this.giveState(this.copyDataI);
                        row.isEditState = true;
                    }
                    this.childDetailRow = row || {};
                    this.clickTimes += 1;
                    /*if(this.clickTimes === 1) {
                        this.refMatProcessPrice = this.$lodash.cloneDeep(this.childDetailRow).pricePart1;
                    }*/
                    this.editIndex = this.$lodash.findIndex(this.tabDataI, ['priceId', row.priceId]);
                    if(this.editIndex < 0) {
                        this.editIndex = 0;
                    }
                }
            },
            //从表保存
            handleSaveChild(isMul = false) {
                const that = this;
                let tempList = [];
                let priceOperateModels = [];
                // old --- 保存有改动的
                /*let oldItem = this.$lodash.cloneDeep(this.copyDataI);
                let newItem = this.$lodash.cloneDeep(this.tabDataI);
                oldItem.forEach(item => {
                    item.isEditState = false;
                });
                newItem.forEach(item => {
                    item.isEditState = false;
                });
                tempList = this.getLastList(oldItem,newItem,'variantId');*/
                // new --- 保存parentVariantId为null的
                this.tabDataI.forEach(item => {
                    if(!item.parentVariantId) {
                        tempList.push(item)
                    }
                });
                let tempObj;
                let api = '/oms/sls/SalesOrderPriceController/updatePcfMatPrice';
                tempList.forEach(item => {
                    let model = {};
                    model = item;
                    //model.itemNo = item.itemNo;
                    //model.areaPriceUom = item.areaPriceUom;
                    //model.priceUom = item.priceUom;
                    //model.sjgPriceUom = item.sjgPriceUom;
                    //model.variantId = item.variantId;
                    //model.sjgPrice = item.sjgPrice;
                    //model.jpPrice= item.jpPrice;
                    //model.jpPriceUom = item.jpPriceUom;
                    model.contractId = null;
                    model.contractCode = null;
                    model.alPriceDate = null;
                    model.fid = item.priceId;
                    //model.usrTxt1Name = item.usrTxt1Name;
                    //model.usrTxt2Name = item.usrTxt2Name;
                    //model.usrTxt3 = item.usrTxt3;
                    //model.usrTxt6Name = item.usrTxt6Name;
                    //model.isTax = item.isTax;
                    //model.specialPrice = item.specialPrice;
                    //model.specialPriceUom = item.specialPriceUom;
                    //model.usrTxt4Name = item.usrTxt4Name;
                    model.isLocked = item.isLocked ? 1 : 0;
                    model.price = Number(item.price);
                    model.refMatPrice = Number(item.pricePart1);
                    model.refMatProcessPrice = Number(item.pricePart2);
                    model.otherPrice = Number(item.otherPrice);
                    model.pricePart1 = Number(item.pricePart1);
                    model.pricePart2 = Number(item.pricePart2);
                    model.pricePart3 = Number(item.pricePart3);
                    model.pricePart4 = Number(item.pricePart4);
                    model.usrPricePart1 = Number(item.usrPricePart1);
                    model.usrPricePart2 = Number(item.usrPricePart2);
                    model.usrPricePart3 = Number(item.usrPricePart3);
                    model.usrPricePart4 = Number(item.usrPricePart4);
                    model.usrPricePart5 = Number(item.usrPricePart5);
                    model.usrPricePart6 = Number(item.usrPricePart6);
                    model.usrPricePart7 = Number(item.usrPricePart7);
                    model.usrPricePart8 = Number(item.usrPricePart8);
                    model.usrPricePart9 = Number(item.usrPricePart9);
                    model.usrPricePart10 = Number(item.usrPricePart10);
                    priceOperateModels.push(model);
                });
                if(isMul) {
                    // 批量改价格
                    switch (this.batchType) {
                        case 'otherPrice':
                            priceOperateModels.forEach(item => {
                                item.otherPrice = Number(that.batchForm.inputVal);
                                item.areaPriceUom = that.batchForm.inputValUom;
                            });
                            break;
                        case 'sjgPrice':
                            priceOperateModels.forEach(item => {
                                item.sjgPrice = Number(that.batchForm.inputVal);
                                item.sjgPriceUom = that.batchForm.inputValUom;
                            });
                            break;
                        case 'specialPrice':
                            priceOperateModels.forEach(item => {
                                item.specialPrice = Number(that.batchForm.inputVal);
                                item.specialPriceUom = that.batchForm.inputValUom;
                            });
                            break;
                        case 'jpPrice':
                            priceOperateModels.forEach(item => {
                                item.jpPrice = Number(that.batchForm.inputVal);
                                item.jpPriceUom = that.batchForm.inputValUom;
                            });
                            break;
                        case 'pricePart2':
                            priceOperateModels.forEach(item => {
                                item.pricePart2 = Number(that.batchForm.inputVal);
                            });
                            break;
                        case 'usrPricePart1':
                            priceOperateModels.forEach(item => {
                                item.usrPricePart1 = Number(that.batchForm.inputVal);
                            });
                            break;
                        case 'usrPricePart2':
                            priceOperateModels.forEach(item => {
                                item.usrPricePart2 = Number(that.batchForm.inputVal);
                            });
                            break;
                        case 'usrPricePart3':
                            priceOperateModels.forEach(item => {
                                item.usrPricePart3 = Number(that.batchForm.inputVal);
                            });
                            break;
                        case 'usrPricePart4':
                            priceOperateModels.forEach(item => {
                                item.usrPricePart4 = Number(that.batchForm.inputVal);
                            });
                            break;
                        case 'usrPricePart5':
                            priceOperateModels.forEach(item => {
                                item.usrPricePart5 = Number(that.batchForm.inputVal);
                            });
                            break;
                        case 'usrPricePart6':
                            priceOperateModels.forEach(item => {
                                item.usrPricePart6 = Number(that.batchForm.inputVal);
                            });
                            break;
                        case 'usrPricePart7':
                            priceOperateModels.forEach(item => {
                                item.usrPricePart7 = Number(that.batchForm.inputVal);
                            });
                            break;
                    }
                }
                tempObj = {
                    orderFlowId: this.detailForm.fid,
                    priceOperateModels: priceOperateModels
                };
                this.fetch(api,tempObj)
                    .then(result => {
                        if(result.status === 200) {
                            let resultData = result.data;
                            let resultArr = [];
                            let resultMsg = '';
                            for(let key in resultData) {
                                if(!resultData[key]) {
                                    resultArr.push(key)
                                }
                            }
                            if(resultArr.length) {
                                resultArr.forEach(item => {
                                    resultMsg += `<p style="color:orange">${item}</p>`
                                })
                            }else {
                                resultMsg = ''
                            }
                            this.$message({
                                dangerouslyUseHTMLString: true,
                                message: `<p>保存成功!</p>${resultMsg}`,
                                type: 'success'
                            });
                            this.otherVariable.isChildEdit = false;
                            this.tabDataI = this.giveState(this.tabDataI);
                            this.getDetailTable(this.detailId);
                            this.clickTimes = 0;
                            if(isMul) {
                                this.batchVisible = false;
                            }
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            });
                            this.tabDataI = this.$lodash.cloneDeep(this.copyDataI);
                        }
                    })
            },
            //从表锁价
            handleLock(priceId,isLocked) {
                this.fetch('/oms/sls/SalesOrderPriceController/doLockPrice',{fid:priceId,isLocked,orderFlowId:this.detailId})
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '锁价成功',
                                type: 'success'
                            });
                            this.otherVariable.isChildEdit = false;
                            this.getDetailTable(this.detailId);
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            })
                        }
                    })
            },
            //从表取消操作
            handleCancelChild() {
                //this.getDetailTable(this.detailId);
                this.tabDataI = this.$lodash.cloneDeep(this.copyDataI);
                this.otherVariable.isChildEdit = false;
                this.clickTimes = 0;
            },
            //禁止点击表格提醒
            handleNotAllowed() {
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
                    this.handleSaveChild();
                }).catch(() => {
                    console.log('cancel')
                    //this.handleCancelChild();
                })
            },
            //批量修改
            showBatchDialog(column, event) {
                if(!this.otherVariable.isChildEdit) {
                    this.batchType = '';
                    const arr = ['pricePart2','usrPricePart1','usrPricePart2','usrPricePart3',
                        'usrPricePart4','usrPricePart5','usrPricePart6','usrPricePart7',
                        'otherPrice','sjgPrice','specialPrice','jpPrice'];
                    if(arr.includes(column.property) && this.showPrice) {
                        this.batchType = column.property;
                        this.batchVisible = true;
                        this.batchForm = {};
                        this.batchTitle = '批量修改价格'
                    }
                }
            },
            handleBatchEdit(column, event) {
                //column.label
            },
            //获取价格明细详情
            handleOtherTable(row) {
                if(this.otherVariable.isChildEdit) {
                    this.$message({
                        message: '编辑状态中',
                        type: 'warning'
                    })
                }else {
                    this.showTable = !this.showTable;
                    if(this.showTable) {
                        this.isResize = false;
                        this.tableHeightI = this.tableHeightI - 150;
                        this.showTable = true;
                        this.$nextTick(() => {
                            this.isResize = true;
                        })
                    }else {
                        this.tableHeightI = this.tableHeightI + 150;
                    }
                    this.tabDataIII = [];
                    //请求数据
                    this.fetch('/oms/sls/SalesOrderPriceController/getMatPriceItem', {matPriceId:row.priceId})
                        .then(result => {
                            if (result.status === 200) {
                                this.tabDataIII = result.data.list;
                            }else {
                                this.tabDataIII = [];
                            }
                        })
                        .then(() => {
                            if(this.showTable) {
                                this.$refs['tabTableII'].initStatus();
                            }
                        })
                }
            },
            //改变价格更新汇总
            updatePrice: _.debounce(function(row,index) {
                let tempObj = {
                    orderFlowId: this.detailForm.fid,
                    priceOperateModels: [row]
                };
                this.fetch('/oms/sls/SalesOrderPriceController/calculatePriceBatch',tempObj)
                    .then(result => {
                        if(result.status === 200) {
                            this.tabDataI[index].price = result.data[0].price;
                            this.tabDataI[index].pricePart3 = result.data[0].pricePart3;
                            this.tabDataI[index].pricePart4 = result.data[0].pricePart4;
                            this.tabDataI[index].pricePart5 = result.data[0].pricePart5;
                            this.tabDataI[index].usrPricePart8 = result.data[0].usrPricePart8;
                            this.tabDataI[index].usrPricePart9 = result.data[0].usrPricePart9;
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            })
                        }
                    })
            },300),
            //获取单位列表
            getUnitList() {
                this.areaPriceUomList = [];
                this.sjgPriceUomList = [];
                this.specialPriceUomList = [];
                this.jpPriceUomList = [];
                // 表面加工
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30131')
                    .then(result => {
                        if(result.data && result.data.length) {
                            result.data.forEach(item => {
                                item.dictValue = Number(item.dictValue)
                            });
                            this.areaPriceUomList = this.formatArray(result.data, 'dictText', 'dictValue');
                        }
                    });
                // 深加工
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30136')
                    .then(result => {
                        if(result.data && result.data.length) {
                            result.data.forEach(item => {
                                item.dictValue = Number(item.dictValue)
                            });
                            this.sjgPriceUomList = this.formatArray(result.data, 'dictText', 'dictValue');
                        }
                    });
                // 特殊加工
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30137')
                    .then(result => {
                        if(result.data && result.data.length) {
                            result.data.forEach(item => {
                                item.dictValue = Number(item.dictValue)
                            });
                            this.specialPriceUomList = this.formatArray(result.data, 'dictText', 'dictValue');
                        }
                    });
                // 禁喷加工
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30135')
                    .then(result => {
                        if(result.data && result.data.length) {
                            result.data.forEach(item => {
                                item.dictValue = Number(item.dictValue)
                            });
                            this.jpPriceUomList = this.formatArray(result.data, 'dictText', 'dictValue');
                        }
                    })
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
    .menu-icon-finance {
        background-size: 27px !important;
        background-position: center;
    }
    .xs-icon-confirm {
        position: absolute;
        bottom: 2px;
        right: 119px;
    }
</style>
