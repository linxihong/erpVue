<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap"  v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btn" @click="handleAdudit('multi')" :disabled="otherVariable.isSaving">批量审核</el-button>
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
                                <span v-if="!item.isCheck">{{ detailForm[item.prop] }}</span>
                                <span v-if="item.isCheck">{{ detailForm[item.prop] === 1 ? '✔':'×' }}</span>
                            </div>
                        </template>
                    </div>
                </template>
                <!--头部按钮-->
                <template slot="main-btn-wrap">
                    <div v-if="showButton" class="xs-audit-icon" @click="!otherVariable.isSaving && handleAdudit('alone')"  :class="otherVariable.isSaving ? 'banClick' : ''" >审核</div>
                    <div v-if="showUnAudit" class="xs-unaudit-icon" @click="handleUnAudit">反审</div>
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
                <!--<template slot="common-content">-->
                    <!--<el-tabs v-model="activeName" class="common-content-tab order_style ">-->
                        <!--<el-tab-pane label="价格明细" name="first">-->
                            <!--<CommonTable-->
                                <!--v-if="isResize"-->
                                <!--v-loading="loadingI"-->
                                <!--ref="tabTableI"-->
                                <!--:isCenter="true"-->
                                <!--:isMulTable="true"-->
                                <!--:isNotMulSelect="false"-->
                                <!--@handleOtherTable="handleOtherTable"-->
                                <!--:otherVariable="otherVariable"-->
                                <!--:formTableData="tabDataI"-->
                                <!--:formPropTable="tabPropI"-->
                                <!--:tableHeight="tableHeightI"-->
                            <!--&gt;-->
                            <!--</CommonTable>-->
                        <!--</el-tab-pane>-->
                    <!--</el-tabs>-->
                    <!--<div v-if="showTable" style="margin-top: 10px;">-->
                        <!--<CommonTable-->
                            <!--v-if="isResize"-->
                            <!--ref="tabTableII"-->
                            <!--:isCenter="true"-->
                            <!--:isMulTable="true"-->
                            <!--:isNotMulSelect="false"-->
                            <!--:otherVariable="otherVariable"-->
                            <!--:formTableData="tabDataIII"-->
                            <!--:formPropTable="tabPropIII"-->
                            <!--:tableHeight="tableHeightII"-->
                        <!--&gt;-->
                        <!--</CommonTable>-->
                    <!--</div>-->
                <!--</template>-->
                <template slot="common-content">
                    <!--按钮区域-->
                    <!--tab区域-->
                    <el-tabs v-model="activeName" class="common-content-tab order_style">
                        <el-tab-pane label="价格明细" name="first" ref="pricedetail">
                            <!--<div @click="isSaveChildRow" v-if="otherVariable.isChildEdit" class="not-allowed-tableI" :style="{height:editIndex*34+'px'}"></div>-->
                            <!--<div @click="isSaveChildRow" v-if="otherVariable.isChildEdit" class="not-allowed-tableII" :style="{height:$store.state.screenHei*0.60-102-editIndex*34+'px'}"></div>-->
                            <el-table
                                ref="pricetable"
                                tooltip-effect="dark"
                                v-loading="loadingI"
                                :data="tabDataI"
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
                                        <span class="num-cell-r">{{ scope.row.isTax==1?'是':scope.row.isTax==0?'否':''}}</span>
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
                                            <span>{{ scope.row.priceUom}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="总加工单价组成" align="center">
                                    <el-table-column label="铝锭价" :align="otherVariable.isChildEdit?'center':'right'">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r" v-if="scope.row.isTax">
                                                {{  aluTaxPrice ? parseFloat(aluTaxPrice).toFixed(3): aluTaxPrice }}
                                            </span>
                                            <span class="num-cell-r" v-if="!scope.row.isTax">
                                                {{  aluPrice ? parseFloat(aluPrice).toFixed(3): aluPrice }}
                                            </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="铝加工" :align="otherVariable.isChildEdit?'center':'right'">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.pricePart2?parseFloat(scope.row.pricePart2).toFixed(3):scope.row.pricePart2 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="表面加工" align="right">
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
                                        <el-table-column label="特殊材质费" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r">{{ scope.row.usrPricePart1?parseFloat(scope.row.usrPricePart1).toFixed(3):scope.row.usrPricePart1 }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="特殊包装费" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r">{{ scope.row.usrPricePart2?parseFloat(scope.row.usrPricePart2).toFixed(3):scope.row.usrPricePart2 }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="长料费" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r">{{ scope.row.usrPricePart3?parseFloat(scope.row.usrPricePart3).toFixed(3):scope.row.usrPricePart3 }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="小料费" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r">{{ scope.row.usrPricePart4?parseFloat(scope.row.usrPricePart4).toFixed(3):scope.row.usrPricePart4 }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="机型费" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r">{{ scope.row.usrPricePart5?parseFloat(scope.row.usrPricePart5).toFixed(3):scope.row.usrPricePart5 }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="锯挂痕费" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r">{{ scope.row.usrPricePart6?parseFloat(scope.row.usrPricePart6).toFixed(3):scope.row.usrPricePart6 }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="撕筋费" :align="otherVariable.isChildEdit?'center':'right'">
                                            <template slot-scope="scope">
                                                <span class="num-cell-r">{{ scope.row.usrPricePart7?parseFloat(scope.row.usrPricePart7).toFixed(3):scope.row.usrPricePart7}}</span>
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
                                <el-table-column label="表面加工" align="center">
                                    <el-table-column label="单价" :align="otherVariable.isChildEdit?'center':'right'">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.otherPrice?parseFloat(scope.row.otherPrice).toFixed(3):scope.row.otherPrice}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="单位" width="55" align="center">
                                        <template slot-scope="scope">
                                            <span class="num-cell-l">{{ scope.row.areaPriceUom}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="深加工费" align="center">
                                    <el-table-column label="单价" :align="otherVariable.isChildEdit?'center':'right'">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.sjgPrice }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="单位" width="55" align="center">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.sjgPriceUom }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="特殊加工" align="center">
                                    <el-table-column label="单价" :align="otherVariable.isChildEdit?'center':'right'">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.specialPrice }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="单位" width="55" align="center">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.specialPriceUom }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column label="禁喷加工费" align="center">
                                    <el-table-column label="单价" :align="otherVariable.isChildEdit?'center':'right'">
                                        <template slot-scope="scope">
                                            <span class="num-cell-r">{{ scope.row.jpPrice }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="单位" width="55" align="center">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.jpPriceUom }}</span>
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
                                <el-table-column label="机台级别" align="left" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.machineLevelName}}</span>
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
                            </el-table>
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
                isShowNotAllowed:false,
                loadingI:false,
                hanleNo:'',
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
                priceUomList:[
                    {
                        value: 'kg',
                        label: 'kg'
                    }
                ],
                areaPriceUomList:[
                    {
                        value: 'kg',
                        label: 'kg'
                    },
                    {
                        value: 'm²',
                        label: 'm²'
                    },
                ],
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                tableHeightI: this.$store.state.screenHei*0.62,
                tableHeightII: 150,
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
                    isOtherTable: true,
                    isSaving:false,
                },
                showButton:false,
                showUnAudit:false,
                showTable: false,
                tempWidth: null,
                tableData: [],
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
                        selectList:[{value:1,label:'全部'},{value:2,label:'未审核'},{value:3,label:'已审核'}],
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
                    /*{
                        name:'客户网单单号',
                        prop:'docCode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false
                    },*/
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
                    }
                ],
                //详情映射列表
                formProp: [
                    {name:'订单编号',prop:'refDocCode',type:'outter'},
                    {name:'下单日期',prop:'docDate',type:'outter'},
                    {name:'交货日期',prop:'deliveryDate',type:'outter'},
                    {name:'单据状态',prop:'docStatusName',type:'outter'},
                    {name:'已审价',prop:'isCheckPrice',type:'outter',isCheck:true},
                    {name:'客户',prop:'clientCode',type:'inner'},
                    {name:'经销商',prop:'clientCode2',type:'inner'},
                    {name:'合同号',prop:'contractCode',type:'inner'},
                    {name:'铝锭取价方式',prop:'alPriceMethodName',type:'inner'},
                    {name:'铝锭价',prop:'alPrice',type:'inner'},
                    {name:'销售公司',prop:'companyName',type:'inner'},
                    {name:'取价日期',prop:'alPriceDate',type:'inner'},
                    {name:'结算方式',prop:'settlementMethodName',type:'inner'},
                    {name:'铝价日期',prop:'alPriceDate',type:'inner'},
                    {name:'喷码',prop:'usrTxt1Name',type:'inner'},
                    {name:'备注',prop:'remark',type:'inner',isLong:true}
                ],
                //新增&编辑映射列表
                operateProp: [
                    {name:'下单日期',prop:'docDate',type:'normal'},
                    {name:'销售类型',prop:'sellType',type:'select',selectList:[{value:1,label:'国内'},{value:2,label:'出口'}]},
                    {name:'交货日期',prop:'deliveryDate',type:'normal'},
                    {name:'单据类型',prop:'docType',type:'normal'},
                    {name:'客户',prop:'clientName',type:'normal'},
                    {name:'货期等级',prop:'deliveryLevel',type:'normal'},
                    {name:'合同编码',prop:'contractId',type:'normal'},
                    {name:'经销商',prop:'clientName2',type:'normal'},
                    {name:'客户PO',prop:'clientPo',type:'normal'},
                    {name:'工程项目',prop:'projectName',type:'normal'},
                    {name:'备注说明',prop:'remark',type:'normal'},
                    {name:'包装方式',prop:'packMethodName',type:'normal'}
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
                searchForm: {tempStatus: 2,minPriceStatus: 50,maxPriceStatus: 100},
                addForm: {},
                detailForm: {},
                copyForm: {},
                tempForm: {},
                audit:[],
                detailId: null,
                aluTaxPrice: '',
                aluPrice: '',
                detailIdList: [],
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //详情表格内容
                tabLeft: '275px',
                activeName: 'first',
                //订单明细映射表
                tabPropI: [
                    {prop:'itemNo', name:'项目号',type:'normal',width:130},
                    {prop:'matCode', name:'型材型号',type:'normal'},
                    {prop:'cx1Name', name:'颜色代码',type:'normal'},
                    {prop:'colorDescribe', name:'颜色名称',type:'normal'},
                    {
                        prop:'', name:'单价',
                        children:[
                            {prop:'otherPrice',name:'面积(元/m²)',width:100,type:'normal',rule:'limitLength',isShort: true,align:'right'},
                            {prop:'price',name:'重量(元/kg)',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                        ]
                    },
                    {
                        prop:'', name:'价格组成(元/KG)',
                        children:[
                            {prop:'pricePart1',name:'铝锭价',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                            {prop:'pricePart2',name:'铝加工',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                            {prop:'pricePart3',name:'表面加工',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                            {prop:'pricePart4',name:'后工序',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                            {prop:'pricePart5',name:'附加费',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                            {prop:'usrPricePart1',name:'特殊材质费',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                            {prop:'usrPricePart2',name:'特殊包装费',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                            {prop:'usrPricePart3',name:'长料费',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                            {prop:'usrPricePart4',name:'小料费',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                            {prop:'usrPricePart5',name:'机型费',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                            {prop:'usrPricePart6',name:'锯挂痕费',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                            {prop:'usrPricePart7',name:'撕筋费',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                            {prop:'usrPricePart8',name:'禁喷加工费',type:'normal',rule:'limitLength',isShort: true,align:'right'},
                        ]
                    },
                    {prop:'machineLevelCode',name:'机台级别',type:'normal'},
                    {prop:'usrTxt6Name',name:'胶条规格',type:'normal'},
                    {
                        prop:'',name:'生产要求',
                        children:[
                            {prop:'usrTxt1Name',name:'喷码',type:'normal'},
                            {prop:'usrTxt2Name',name:'禁喷类型',type:'normal'},
                            {prop:'usrTxt3Name',name:'撕筋',type:'checkbox',width: 55, align:'center'}
                        ]
                    },
                    {
                        prop:'',name:'型材系列',
                        children:[
                            {prop:'matSeriesCode',name:'型号',type:'normal'},
                            {prop:'matSeriesName',name:'名称',type:'normal'}

                        ]
                    },
                    {prop:'cx2Name',name:'材质',type:'normal'},
                    {prop:'cx4Name',name:'长度',type:'normal',rule:'limitLength',unit:' m',isShort: true,align:'right'},
                    {prop:'cx3Name',name:'膜厚',type:'normal',unit:'',isShort: true,align:'right'},
                    {
                        prop:'',name:'结算方式',
                        children:[
                            {prop:'usrTxt1',name:'代码'},
                            {prop:'usrTxt2',name:'名词'}
                        ]
                    },
                    {prop:'remark',name:'备注',type:'normal'}
                ],
                //订单明细数据
                tabDataI: [],
                copyDataI: [],
                tabPropIII: [
                    {
                        prop:'itemNo', name:'序号',
                    },
                    {prop:'priceItemText', name:'合同条款内容'},
                    {
                        prop:'', name:'价格',
                        children:[
                            {prop:'otherPrice',name:'面积(元/m²)'},
                            {prop:'price',name:'重量(元/kg)'},

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
                    }
                ],
                tabDataIII:[]
            }
        },
        mounted() {
            this.getData();
            // 操作/布局相关
            this.listenResizeIII();
            this.changeSizeIII();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                this.tableData = [];
                this.fetch(`/oms/sls/SalesOrderPriceController/getOrderAndContractInfo?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
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
                            this.tabDataI = [];
                            this.pageObj.commonTotal = 0;
                            this.$nextTick(() => {
                                this.$refs['tabTableI'].initStatus();
                            })
                        }
                    })
            },
            selectChange(val) {
                if(val === 1) {
                    this.searchForm.minPriceStatus = 50;
                    this.searchForm.maxPriceStatus = 101;
                }else if(val === 2) {
                    this.searchForm.minPriceStatus = 50;
                    this.searchForm.maxPriceStatus = 100;
                }else if(val === 3) {
                    this.searchForm.minPriceStatus = 100;
                    this.searchForm.maxPriceStatus = 100;
                }
            },
            //刷新
            handleRefresh() {
                this.getData();
                this.tabDataI = [];
                this.detailForm = {};
                this.showUnAudit = false;
                this.showButton = false;
            },
            //重置
            handleReset() {
                this.searchForm = {tempStatus: 2,minPriceStatus: 50,maxPriceStatus: 100};
                this.handleRefresh();
            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
            },
            //更改后的刷新
            changeRefresh() {
                this.getData(false);
                this.otherVariable.isChildEdit = false;
            },
            //点击主表行
            handleDetail(row) {
                this.isShowNotAllowed = true;
                this.loadingI = true;
                if(row.priceStatus === 0 || row.priceStatus === null || row.priceStatus === 50) {
                    this.showUnAudit = false;
                    this.showButton = true
                }else if(row.priceStatus === 100){
                    this.showUnAudit = true;
                    this.showButton = false
                }else {
                    this.showUnAudit = false;
                    this.showButton = false
                }
                this.detailForm = row;
                this.showTable = false;
                this.refMatPrice = row.alPrice;
                this.tabDataIII = [];
                this.detailId = row.fid;
                this.docStatus = row.docStatus;
                this.docCode = row.docCode;
                this.getDetailTable(row.fid);
                this.getOrderDetailTable(row.fid);
                this.getPricePart(row.fid);
            },
            //批量选择-审核
            handleSelectionChange(rows) {
                this.detailIdList = [];
                rows.forEach(item => {
                    this.detailIdList.push(item.fid)
                })
            },
            //获取价格明细
            getDetailTable(fid) {
                this.tabDataI = [];
                this.fetch('/oms/sls/SalesOrderPriceController/getMatOrderAndPrice',{flowId: fid})
                    .then(result => {
                        this.isShowNotAllowed = false;
                        if(result.status === 200 && result.data) {
                            result.data.forEach(item => {
                                item.pricePart8 = this.refMatPrice;
                            });
                            this.tabDataI = result.data;
                        }else {
                            this.tabDataI = [];
                        }
                    })
                    .then(() => {
                        this.loadingI = false;
                        this.$refs['tabTableI'].initStatus();
                    })
            },
            //获取从表
            getDetailTable(fid) {
                this.tabDataI = [];
                this.copyDataI = [];
                this.loadingI=true;
                this.otherVariable.isChildEdit = false;
                this.isShowNotAllowed = true;
                this.fetch('/oms/sls/SalesOrderPriceController/getMatOrderAndPrice', {flowId: fid})
                    .then(result => {
                        this.isShowNotAllowed = false;
                        if(result.status === 200 && result.data) {
                            result.data.forEach(item => {
                                item.pricePart8 = this.refMatPrice;
                                if(!item.parentVariantId) {
                                    !item.isTax ? item.isTax = 0 : '';
                                    !item.priceUom ? item.priceUom = 'kg' : '';
                                }
                                item._curdFlag = 'r';
                                item === null ?item = '' : '';
                            });
                            this.tabDataI = result.data;
                            this.copyDataI = this.$lodash.cloneDeep(this.tabDataI);
                        }else {
                            this.tabDataI = [];
                            this.copyDataI = [];
                        }
                    }).then(()=>{
                    this.loadingI = false;
                });
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
                        }
                    })
            },
            //获取产品价格构成
            handleOtherTable(row) {
                this.tabDataIII = [];
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
            },
            //审核
            handleAdudit(type) {
                if(this.detailIdList.length>0 && type ==='multi'){
                    this.hanleNo = this.detailIdList.length;

                }else{
                    this.hanleNo='';
                }
                this.$confirm('是否审核'+this.hanleNo+'条订单？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let tempObj,api;
                    let isBatch = false;
                    this.otherVariable.isSaving = true;
                    if(type === 'alone') {
                        isBatch = false;
                        tempObj = {orderFlowId: this.detailId, checkPrice: 1};
                        api = '/oms/sls/SalesOrderPriceController/checkPriceInfo';
                    }else {
                        isBatch = true;
                        tempObj = {orderFlowIds: this.detailIdList};
                        api = '/oms/sls/SalesOrderPriceController/checkPriceInfoBatch';
                    }
                    if(isBatch && this.detailIdList.length || !isBatch) {
                        let resultStatus;
                        this.fetch(api,tempObj)
                            .then(result => {
                                resultStatus = result.status;
                                if(result.status === 200) {
                                    this.$message({
                                        message: result.data,
                                        type: 'success'
                                    });
                                    this.getData(false);
                                }else {
                                    this.$message({
                                        message: this.returnErrorMsg(result.error),
                                        type: 'warning'
                                    })
                                }
                            })
                            .then(() => {
                                if(resultStatus === 200) {

                                    this.$refs.commontable.renderRow(this.detailId);
                                }
                                this.otherVariable.isSaving = false;
                            })
                    }else {
                        this.$message({
                            message: '请勾选订单',
                            type:'warning'
                        })
                    }
                })
            },
            //反审
            handleUnAudit() {
                let tempObj = {
                    orderFlowId: this.detailId,
                    checkPrice: 0
                };
                let resultStatus;
                this.fetch('/oms/sls/SalesOrderPriceController/checkPriceInfo',tempObj)
                    .then(result => {
                        resultStatus = result.status;
                        if(result.status === 200) {
                            this.$message({
                                message: result.data,
                                type: 'success'
                            });
                            this.getData(false);
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'warning'
                            })
                        }
                    })
                    .then(() => {
                        if(resultStatus === 200) {
                            this.$refs.commontable.renderRow(this.detailId);
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
    .exportCount {
        z-index: 99;
        position: absolute;
        right: 216px;
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
    .exportText {
        z-index: 98;
        position: absolute;
        right: 169px;
        bottom: 3px;
        transform: translateY(50%);
        cursor: pointer;
        width: 61px;
        height: 33px;
        line-height: 33px;
        text-align: center;
        font-size: 15px;
        color: #fff;
        background: #FF7F00;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
    }
    .exportCount1 {
        z-index: 99;
        position: absolute;
        right: 99px;
        bottom: 3px;
        transform: translateY(50%);
        cursor: pointer;
        border-radius: 50%;
        width: 55px;
        height: 55px;
        line-height: 47px;
        text-align: center;
        font-size: 18px;
        color: #666;
        background-color: white;

        border: 1px solid #666;
    }
    .exportText1 {
        z-index: 98;
        position: absolute;
        right: 49px;
        bottom: 3px;
        transform: translateY(50%);
        cursor: pointer;
        /* border-radius: 50%; */
        width: 61px;
        height: 33px;
        line-height: 33px;
        text-align: center;
        font-size: 15px;
        color: #666;
        background-color: white;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
        border: 1px solid #666;
    }
</style>
