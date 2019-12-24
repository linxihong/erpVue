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
                :detailForm="detailForm"
                :hasSimpleHead="true"
                @toggleSpread="toggleSpread"
                @handleEdit="handleEdit"
                @handleDelete="handleDelete"
            >
                <!--头部按钮-->
                <template slot="main-btn-wrap">
                    <div class="icon-edit" @click="handleEdit"></div>
                    <!--<i class="icon-delete" title="删除" @click="handleDelete"></i>-->
                </template>
                <!--头部表单-->
                <template slot="head-form-content">
                    <div class="head-form-content">
                        <div>
                            <span style="font-size: 27px; font-weight: normal">型材资料</span>
                        </div>
                    </div>
                </template>
                <!--明细-->
                <template slot="model-input">
                    <div style="padding: 0 25px;">
                        <template>
                            <el-row style="font-size: 15px;color: #606266;" ref="detailRef">
                                <el-col :span="item.span" v-for="(item,index) in formItems" :key="index">
                                    <div v-if="item.type!=='checkbox'&&item.type!=='select'">
                                        {{item.name}}{{detailForm[item.prop]}}
                                    </div>
                                    <div v-if="item.type=='select'">
                                        <span>{{item.name}}</span>
                                        <span v-if="!(detailForm[item.prop] && item.selectList.length)">{{detailForm[item.prop]}}</span>
                                        <span v-if="detailForm[item.prop] && item.selectList.length">{{findObj(item.selectList,'value',detailForm[item.prop],'label')}}</span>
                                    </div>
                                    <el-checkbox :span="item.span"
                                                 v-if="item.type==='checkbox'"
                                                 v-model="detailForm[item.prop]"
                                                 :true-label="1"
                                                 :false-label="0"
                                                 :disabled="true">{{item.name}}</el-checkbox>
                                    <i :style="item.style" v-if="item.type == 'line'"></i>
                                </el-col>
                            </el-row>
                        </template>
                    </div>
                </template>

                <!--详情内容-->
                <template slot="common-content">
                    <!--按钮区域-->
                    <div class="tab-btn-wrap" :style="{left: tabLeft}">
                        <el-button @click="handleAddChild" v-if="!otherVariable.isChildEdit">新增</el-button>
                        <el-button @click="handleCancelChild" v-if="otherVariable.isChildEdit">取消</el-button>
                        <el-button class="btn-cyan search-btn" @click="handleSaveChild" v-if="otherVariable.isChildEdit">提交</el-button>
                    </div>
                    <!--tab区域-->
                    <el-tabs v-model="activeName" class="common-content-tab">
                        <el-tab-pane label="子型号明细" name="first">
                            <el-table
                                v-if="isResize"
                                :height="tableHeight"
                                tooltip-effect="dark"
                                :data="tabDataI"
                                border
                                highlight-current-row
                            >
                                <el-table-column label="序号" prop="docItem" align="center" width="30">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.sequence }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="物料代码" prop="fcode" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.fcode}}</span>
                                        <el-select
                                            v-if="scope.row.isEditState"
                                            clearable
                                            filterable
                                            remote
                                            :remote-method="getModelInput"
                                            v-model.trim="scope.row.fcode"
                                            @change="setModelInput"
                                            style="width: 100%"
                                        >
                                            <el-option
                                                v-for="(item,index) in modelInputList"
                                                :key="index"
                                                :label="item.fcode"
                                                :value="item.fcode">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="物料名称" align="center">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.fname}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="型材" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.isProfile === 0 ? '✔':(scope.row.isProfile === 1)?"x":''}}</span>
                                        <el-checkbox v-if="scope.row.isEditState"  v-model="scope.row.isProfile " :true-label="1" :false-label="0"></el-checkbox>
                                    </template>
                                </el-table-column>
                                <el-table-column label="胶条" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.isPvc === 0 ? '✔':(scope.row.isPvc===1?"x":'')}}</span>
                                        <el-checkbox v-if="scope.row.isEditState"  v-model="scope.row.isPvc" :true-label="1" :false-label="0"></el-checkbox>
                                    </template>
                                </el-table-column>
                                <el-table-column label="失效" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.inactive === 0 ? '✔':(scope.row.inactive===1)?"x":''}}</span>
                                        <el-checkbox v-if="scope.row.isEditState"  v-model="scope.row.inactive" :true-label="1" :false-label="0"></el-checkbox>
                                    </template>
                                </el-table-column>
                                <el-table-column label="支重" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.unitWght }}</span>
                                        <el-input  @keyup.native="changeWghtDigit(scope.row)" v-if="scope.row.isEditState" v-model="scope.row.unitWght"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位数量" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.unitDigit }}</span>
                                        <el-input @keyup.native="changeWghtDigit(scope.row)" v-if="scope.row.isEditState" v-model="scope.row.unitDigit"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位重量" align="center">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.WghtDigit }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.remark}}</span>
                                        <el-input v-if="scope.row.isEditState" v-model="scope.row.remark"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="55" fixed="right">
                                    <template slot-scope="scope">
                                        <i class="el-icon-delete" title="删除" @click.stop="handleDeleteChild(scope.row,scope.$index)"></i>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="胶条明细" name="second">
                            <el-table
                                v-if="isResize"
                                :height="tableHeight"
                                tooltip-effect="dark"
                                :data="tabDataII"
                                border
                                highlight-current-row
                            >
                                <el-table-column label="胶条代码" prop="fcode" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.fcode}}</span>
                                        <el-select
                                            v-if="scope.row.isEditState"
                                            clearable
                                            filterable
                                            remote
                                            :remote-method="getPvcModelCode"
                                            v-model.trim="scope.row.fcode"
                                            @change="setPvcModelCode"
                                            style="width: 100%"
                                        >
                                            <el-option
                                                v-for="(item,index) in pvcModelCodeList"
                                                :key="index"
                                                :label="item.fcode"
                                                :value="item.fcode">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="胶条名称" align="center">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.fname}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="失效" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.inactive === 1 ? 'x':(scope.row.inactive===0)?'√':''}}</span>
                                        <el-checkbox v-if="scope.row.isEditState"  v-model="scope.row.inactive" :true-label="1" :false-label="0"></el-checkbox>
                                    </template>
                                </el-table-column>
                                <el-table-column label="米重" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.meterWght }}</span>
                                        <el-input v-if="scope.row.isEditState" v-model="scope.row.meterWght"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位数量" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.unitDigit }}</span>
                                        <el-input v-if="scope.row.isEditState" v-model="scope.row.unitDigit"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位重量" align="center">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.WghtDigit }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row.remark}}</span>
                                        <el-input v-if="scope.row.isEditState" v-model="scope.row.remark"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="55" fixed="right">
                                    <template slot-scope="scope">
                                        <i class="el-icon-delete" title="删除" @click.stop="handleDeleteChildII(scope.row,scope.$index)"></i>
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
                        <el-form ref="addOrEditForm" :rules="addRules" :model="addOrEditForm" :inline="otherVariable.isInlineForm" label-width="120px">
                            <el-form-item label="型号代码" prop="fcode">
                                <el-input v-model="addOrEditForm.fcode"></el-input>
                            </el-form-item>
                            <el-form-item label="型号名称" prop="fname">
                                <el-input v-model="addOrEditForm.fname"></el-input>
                            </el-form-item>
                            <el-form-item label="组合型材" prop="isCombine">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.isCombine"
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
                            <el-form-item label="撕筋" prop="isTear">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.isTear"
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
                            <el-form-item label="失效" prop="inactive">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.inactive"
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
                            <el-form-item label="型号状态" prop="modelState">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.modelState"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="(item,index) in modelStateList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="型号分组" prop="clientCode">
                                <SelectEnter
                                    ref="matGroupSelect"
                                    :inputValue="valueObj.matGroupCode"
                                    :selectTHs="valueObj.matGroupCodeTHs"
                                    :selectTds="valueObj.matGroupCodeList"
                                    placeholder="请输入型号分组"
                                    @getList="getMatGroupCode"
                                    @setObj="setMatGroupCode"
                                    selectLabel="value"
                                    selectValue="value"
                                    selectKey="fid">
                                </SelectEnter>
                            </el-form-item>
                            <el-form-item label="专利所属公司" prop="patentCompanyName">
                                <el-input v-model="addOrEditForm.patentCompanyName"></el-input>
                            </el-form-item>
                            <el-form-item label="客户型号" prop="cltMatCode">
                                <el-input v-model="addOrEditForm.cltMatCode"></el-input>
                            </el-form-item>
                            <el-form-item label="型号系列" prop="matSeriesCode">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.matSeriesCode"
                                    style="width: 100%"
                                    @change="selectChange($event,'matSeriesName')"
                                >
                                    <el-option
                                        v-for="(item,index) in matSeriesCodeList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="形状类型" prop="shapeType">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.shapeType"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="(item,index) in shapeTypeList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="价格分组" prop="priceGroupCode">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.priceGroupCode"
                                    style="width: 100%"
                                    @change="selectChange($event,'priceGroupName')"
                                >
                                    <el-option
                                        v-for="(item,index) in priceGroupCodeList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="报关名称" prop="ciqCode">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.ciqCode"
                                    style="width: 100%"
                                    @change="selectChange($event,'ciqName')"
                                >
                                    <el-option
                                        v-for="(item,index) in ciqCodeList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="壁厚" prop="thick">
                                <el-input v-model="addOrEditForm.thick"></el-input>
                            </el-form-item>
                            <el-form-item label="单支面积" prop="unitArea">
                                <el-input v-model="addOrEditForm.unitArea"></el-input>
                            </el-form-item>
                            <el-form-item label="米重" prop="meterWght">
                                <el-input v-model="addOrEditForm.meterWght"></el-input>
                            </el-form-item>
                            <el-form-item label="直径" prop="diameterType">
                                <el-input v-model="addOrEditForm.diameterType"></el-input>
                            </el-form-item>
                            <el-form-item label="装饰面积" prop="unitDecorateArea">
                                <el-input v-model="addOrEditForm.unitDecorateArea"></el-input>
                            </el-form-item>
                            <el-form-item label="支/扎数" prop="perLotQty">
                                <el-input v-model="addOrEditForm.perLotQty"></el-input>
                            </el-form-item>
                            <el-form-item label="周长" prop="girth">
                                <el-input v-model="addOrEditForm.girth"></el-input>
                            </el-form-item>
                            <el-form-item label="难度等级" prop="hardLevel">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.hardLevel"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="(item,index) in hardLevelList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="损耗率(%)" prop="lossRate">
                                <el-input v-model="addOrEditForm.lossRate"></el-input>
                            </el-form-item>
                            <el-form-item label="禁喷类型" prop="banSprayType">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.banSprayType"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="(item,index) in banSprayTypeList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="包装方式" prop="packCode">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.packCode"
                                    style="width: 100%"
                                    @change="selectChange($event,'packName')"
                                >
                                    <el-option
                                        v-for="(item,index) in packCodeList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="机台棒径" prop="machineDiameter">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.machineDiameter"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="(item,index) in machineDiameterList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="机台级别" prop="machineLevel">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.machineLevel"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="(item,index) in machineLevelList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="质量要求" prop="qmCode">
                                <el-select
                                    clearable
                                    v-model="addOrEditForm.qmCode"
                                    style="width: 100%"
                                    @change="selectChange($event,'qmName')"
                                >
                                    <el-option
                                        v-for="(item,index) in qmCodeList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="备注" prop="remark">
                                <el-input type="textarea" v-model="addOrEditForm.remark"></el-input>
                            </el-form-item>
                        </el-form>
                    </template>
                </CommonAdd>
            </transition>
            <!--获取公共数据-->
            <CommonData :valueObj="valueObj" ref="commondata"></CommonData>
        </div>
    </div>
</template>

<script>
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    import CommonDetailX from '$src/components/CommonDetailX'
    import CommonAdd from '$src/components/CommonAdd'
    import CommonData from '$src/components/CommonData'
    import SelectEnter from '$src/components/SelectEnter'
    export default {
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetailX,
            CommonAdd,
            CommonData,
            SelectEnter
        },
        data() {
            return {
                mainHeight: 716,
                isShowNotAllowed: false,
                tableHeight: this.$store.state.screenHei*0.421,
                isResize: true,
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    detailTitle: '编辑型号',
                    addTitle: '新建型号',
                    popupTitle: '新建型号',
                    isInlineForm: true,
                    isEdit: false,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    loading: false,
                    $isCustom: true
                },
                tempWidth: null,
                tableData: [],
                modelInputList: [],
                pvcModelCodeList: [],
                //搜索映射表
                searchProp: [
                    {
                        name: '型号',
                        prop: 'fcode',
                        type: 'normal',
                        isMainSearch: true,
                        isMain: false,
                        placeholder: '请输入型号'
                    },
                    {
                        name: '型材系列',
                        prop: 'matSeriesCode',
                        type: 'normal',
                        isMainSearch: false,
                        isMain: false,
                        placeholder: '请输入型材系列代码'
                    },
                    {
                        name: '型号分组',
                        prop: 'matGroupCode',
                        type: 'normal',
                        isMainSearch: false,
                        isMain: false,
                        placeholder: '请输入型号分组代码'
                    },
                    {
                        name: '组合型材',
                        prop: 'isCombine',
                        type: 'select',
                        selectList:this.getStaticList('isTrue'),
                        isMainSearch: false,
                        isMain: false
                    }
                ],
                //校验
                addRules:{
                    'fcode':[
                        { required: true, message: '请输入型号代码', trigger: 'blur' }
                    ],
                    'fname':[
                        { required: true, message: '请输入型号名称', trigger: 'blur' }
                    ],
                    'modelState':[
                        { required: true, message: '请选择型号状态', trigger: 'blur' }
                    ],
                    'thick':[
                        { required: true, message: '请输入壁厚', trigger: 'blur' }
                    ],
                    'unitArea':[
                        { required: true, message: '请输入单支面积', trigger: 'blur' }
                    ],
                    'meterWght':[
                        { required: true, message: '请输入米重', trigger: 'blur' }
                    ],
                    'diameterType':[
                        { required: true, message: '请输入直径', trigger: 'blur' }
                    ],
                    'unitDecorateArea':[
                        { required: true, message: '请输入装饰面积', trigger: 'blur' }
                    ],
                    'girth':[
                        { required: true, message: '请输入周长', trigger: 'blur' }
                    ],
                    'hardLevel':[
                        { required: true, message: '请选择难度等级', trigger: 'blur' }
                    ],
                    'banSprayType':[
                        { required: true, message: '请选择禁喷类型', trigger: 'blur' }
                    ],
                    'machineLevel':[
                        { required: true, message: '请选择机台级别', trigger: 'blur' }
                    ]
                },
                //表格映射列表
                tableProp: [
                    {
                        name: 'fid',
                        prop: 'fid',
                        type: 'normal',
                        isMain: true
                    },
                    {
                        name1: '型号',
                        prop1: 'fcode',
                        name2: '',
                        prop2: 'fname',
                        type: 'mixin',
                        width: ''
                    },
                    {
                        name1: '型号分组',
                        prop1: 'matGroupCode',
                        name2: '',
                        prop2: 'matGroupName',
                        type: 'mixin',
                        width: ''
                    },
                    {
                        name1: '型材系列',
                        prop1: 'matSeriesCode',
                        name2: '',
                        prop2: 'matSeriesName',
                        type: 'mixin',
                        width: ''
                    },
                    {
                        name: '组合型材',
                        prop: 'isCombine',
                        type: 'modelInput',
                        width: ''
                    },
                    {
                        name: '撕筋',
                        prop: 'isTear',
                        type: 'modelInput',
                        width: ''
                    },
                    {
                        name: '失效',
                        prop: 'inactive',
                        type: 'modelInput',
                        width: ''
                    }
                ],
                formItems: [
                    //0
                    {span: 12, name: '型号代码：', prop: 'fcode'},
                    //1
                    {span: 12, name: '型号状态：', prop: 'modelState', type: 'select'},
                    //2
                    {span: 12, name: '型号名称：', prop: 'fname'},
                    //3
                    {span: 12, name: '形状类型：', prop: 'shapeType', type: 'select'},
                    //4
                    {span: 12, name: '型号分组：', prop: 'matGroupCode', type: 'select'},
                    //5
                    {span: 12, name: '报关名称：', prop: 'ciqCode', type: 'select'},
                    //6
                    {span: 12, name: '型号系列：', prop: 'matSeriesCode', type: 'select'},
                    //7
                    {span: 12, name: '专利所属公司：', prop: 'patentCompanyName'},
                    //8
                    {span: 12, name: '客户型号：', prop: 'cltMatCode'},
                    //9
                    {span: 12, name: '价格分组：', prop: 'priceGroupCode', type: 'select'},
                    //10
                    {span: 12, name: '组合型材', prop: 'isCombine', type: 'checkbox'},
                    //11
                    {span: 12, name: '撕筋', prop: 'isTear', type: 'checkbox'},
                    //12
                    {span: 12, name: '失效', prop: 'inactive', type: 'checkbox'},
                    //13
                    {
                        type: 'line',
                        style: {
                            display: 'block',
                            margin: '10px auto',
                            height: '1px',
                            width: '100%',
                            backgroundColor: '#cecece',
                            span: 24
                        }
                    },
                    //14
                    {span: 6, name: '壁厚:', prop: 'thick'},
                    //15
                    {span: 6, name: '单支面积:', prop: 'unitArea'},
                    //16
                    {span: 6, name: '米重:', prop: 'meterWght'},
                    //17
                    {span: 6, name: '直径:', prop: 'diameterType'},
                    //18
                    {span: 6, name: '装饰面积:', prop: 'unitDecorateArea'},
                    //19
                    {span: 6, name: '支/扎数:', prop: 'perLotQty', type: 'normal'},
                    //20
                    {span: 6, name: '周长:', prop: 'girth'},
                    //21
                    {span: 6, name: '损耗率(%):', prop: 'lossRate'},
                    //22
                    {span: 6, name: '难度等级:', prop: 'hardLevel', type: 'select'},
                    //23
                    {span: 6, name: '禁喷类型:', prop: 'banSprayType', type: 'select'},
                    //24
                    {span: 6, name: '机台级别:', prop: 'machineLevel', type: 'select'},
                    //25
                    {span: 6, name: '包装方式:', prop: 'packCode', type: 'select'},
                    //26
                    {span: 6, name: '机台棒径:', prop: 'machineDiameter', type: 'select'},
                    //27
                    {span: 6, name: '质量要求:', prop: 'qmCode', type: 'select'},
                    //28
                    {span: 6, name: '备注：', prop: 'remark'}
                ],
                searchForm: {inactive : 0},
                addOrEditForm: {},
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
                //详情表格内容
                tabLeft: '200px',
                activeName: 'first',
                childDetailRow: {},
                editIndex: 0,
                //订单明细数据
                tabDataI: [],
                tabDataII: [],
                //数据
                modelStateList: [],
                matSeriesCodeList: [],
                shapeTypeList: [],
                priceGroupCodeList: [],
                ciqCodeList: [],
                hardLevelList: [],
                banSprayTypeList: [],
                packCodeList: [],
                machineDiameterList: [],
                machineLevelList: [],
                qmCodeList: [],
                valueObj: {
                    //型号分组
                    matGroupCode: null,
                    matGroupCodeList: [],
                    matGroupCodeTHs: [
                        {label:'代码',prop:'value'},
                        {label:'名称',prop:'label'}
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
            'isShowStatus.isRead':{
                handler(val) {
                    this.isShowNotAllowed = !val;
                }
            },
        },
        mounted() {
            this.getData();
            this.getMdmCiq();
            this.getselectBan();
            //this.getCompanName();
            this.getAlGropList();
            this.getQmLevel();
            this.getPriceGroupList();
            this.getselseData();
            this.getHardLevel();
            this.getMatSeries();
            this.getShapeType();
            this.getMachineDiameter();
            this.getMachineLevel();
            this.getModelState();
            // 操作/布局相关
            this.listenResize();
            this.changeSize();
            this.tempWidth = this.otherVariable.contentWidth;
        },
        methods: {
            //获取型号状态
            getModelState() {
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30122')
                    .then(result => {
                        if(result.data) {
                            result.data.forEach(item => {
                                item.dictValue = Number(item.dictValue)
                            });
                            let tempList = this.formatArray(result.data, 'dictText', 'dictValue');
                            this.modelStateList = tempList;
                            this.formItems[1].selectList = tempList;
                        }
                    })
            },

            //清空选择组件的数据
            clearSelect() {
                this.$refs.matGroupSelect.inputValueData = '';
                this.valueObj.matGroupCode = '';
            },

            //获取型号分组
            getMatGroupCode(val) {
                this.$refs.commondata.getMatGroupCode(val);
            },
            setMatGroupCode(item) {
                this.$set(this.valueObj,'matGroupCode',item.fcode);
                this.$set(this.addOrEditForm,'matGroupName',item.fname);
                this.$set(this.addOrEditForm,'matGroupCode',item.fcode);
                this.$set(this.addOrEditForm,'matGroupId',item.fid);
            },
            getAlGropList() {
                this.fetch('/oms/BasedataController/getAlGroupList?pageSize=100',{})
                    .then(result => {
                        if(result.data && result.data.list) {
                            let tempList = this.formatArray(result.data.list, 'fname', 'fname');
                            this.formItems[4].selectList = tempList;
                        }else {
                            this.formItems[4].selectList = [];
                        }
                    })
            },

            //获取专利所属公司
            getCompanName(){
                this.fetch('/basedata/Org/Company/selectByQueryModel?pageSize=100',{})
                    .then(result => {
                        if(result.data&&result.data.list) {
                            let tempList = this.formatArray(result.data.list, 'fname', 'fname');
                        }
                    })
            },

            //获取型号系列
            getMatSeries() {
                this.fetch('/basedata/Mat/MatSeriesController/selectByQueryModel?pageSize=100', {})
                    .then(result => {
                        if(result.data&&result.data.list) {
                            let tempList = this.formatArray(result.data.list, 'fname', 'fname');
                            this.matSeriesCodeList = tempList;
                            this.formItems[6].selectList = tempList;
                        }
                    })
            },

            //获取形状类型
            getShapeType() {
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30123')
                    .then(result => {
                        if(result.data) {
                            let tempList = this.formatArray(result.data, 'dictText', 'dictValue');
                            this.shapeTypeList = tempList;
                            this.formItems[3].selectList = tempList;
                        }
                    })
            },

            //获取价格分组
            getPriceGroupList() {
                this.fetch('/oms/BasedataController/getModelGroupList?pageSize=100', {})
                    .then(result => {
                        if(result.data&&result.data.list) {
                            let tempList = this.formatArray(result.data.list, 'fname', 'fcode');
                            this.priceGroupCodeList = tempList;
                            this.formItems[9].selectList = tempList;
                        }
                    })
            },

            //获取报关名称
            getMdmCiq() {
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30121')
                    .then(result => {
                        if(result.data) {
                            let tempList = this.formatArray(result.data, 'dictText', 'dictValue');
                            this.ciqCodeList = tempList;
                            this.formItems[5].selectList = tempList;
                        }
                    })
            },

            //难度等级
            getHardLevel() {
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30120')
                    .then(result => {
                        if(result.data) {
                            result.data.forEach(item => {
                                item.dictValue = Number(item.dictValue)
                            });
                            let tempList = this.formatArray(result.data, 'dictText', 'dictValue');
                            this.hardLevelList = tempList;
                            this.formItems[22].selectList = tempList;
                        }
                    })
            },

            //禁喷类型
            getselectBan() {
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30119')
                    .then(result => {
                        if(result.data) {
                            let tempList = this.formatArray(result.data, 'dictText', 'dictValue');
                            this.banSprayTypeList = tempList;
                            this.formItems[23].selectList = tempList;
                        }
                    })
            },

            //包装方式
            getselseData() {
                this.fetch('/basedata/Mdm/MdmPackMethodController/selectByQueryModel?pageSize=1000', {})
                    .then(result => {
                        if(result.data&&result.data.list) {
                            let tempList = this.formatArray(result.data.list, 'fname', 'fcode');
                            this.packCodeList = tempList;
                            this.formItems[25].selectList = tempList;
                        }
                    })
            },

            //机台棒径
            getMachineDiameter() {
                this.getAjax('/basedata/sys/DataDictionary/getDataDictionary?docCode=30125')
                    .then(result => {
                        if(result.data) {
                            result.data.forEach(item => {
                                item.dictValue = Number(item.dictValue)
                            });
                            let tempList = this.formatArray(result.data, 'dictText', 'dictValue');
                            this.machineDiameterList = tempList;
                            this.formItems[26].selectList = tempList;
                        }
                    })
            },

            //机台级别
            getMachineLevel() {
                this.fetch('/basedata/Mdm/MdmMachineLevelController/selectByQueryModel?pageSize=100',{})
                    .then(result => {
                        if(result.data&&result.data.list) {
                            result.data.list.forEach(item => {
                                item.fcode = Number(item.fcode)
                            });
                            let tempList = this.formatArray(result.data.list, 'fname', 'fcode');
                            this.machineLevelList = tempList;
                            this.formItems[24].selectList = tempList;
                        }
                    })
            },

            //质量等级
            getQmLevel() {
                this.fetch('/basedata/Mdm/MdmQmLevelController/selectByQueryModel?pageSize=100',{})
                    .then(result => {
                        if(result.data&&result.data.list) {
                            let tempList = this.formatArray(result.data.list, 'fname', 'fcode');
                            this.qmCodeList = tempList;
                            this.formItems[27].selectList = tempList;
                        }
                    })
            },

            //设置选择
            selectChange(val,paramName) {
                if(val) {
                    if(paramName === 'matSeriesName') {
                        this.addOrEditForm.matSeriesName = this.findObj(this.matSeriesCodeList,'value',val,'label');
                    }else if(paramName === 'priceGroupName') {
                        this.addOrEditForm.priceGroupName = this.findObj(this.priceGroupCodeList,'value',val,'label');
                        this.addOrEditForm.priceGroupId = this.findObj(this.priceGroupCodeList,'value',val,'fId');
                    }else if(paramName === 'ciqName') {
                        this.addOrEditForm.ciqName = this.findObj(this.ciqCodeList,'value',val,'label');
                        this.addOrEditForm.ciqId = this.findObj(this.ciqCodeList,'value',val,'fId');
                    }else if(paramName === 'packName') {
                        this.addOrEditForm.packName = this.findObj(this.packCodeList,'value',val,'label');
                        this.addOrEditForm.packId = this.findObj(this.packCodeList,'value',val,'fid');
                    }else if(paramName === 'qmName') {
                        this.addOrEditForm.qmName = this.findObj(this.qmCodeList,'value',val,'label');
                        this.addOrEditForm.qmId = this.findObj(this.qmCodeList,'value',val,'fid');
                    }
                }
            },

            //获取主表数据
            getData(isFirst = true) {
                this.tableData = [];
                this.fetch(`/basedata/Mat/AluModel/selectByQueryModel?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`, this.searchForm)
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
                            this.copyForm = {};
                            this.addOrEditForm = {};
                            this.tableData = [];
                            this.detailId = null;
                            this.docCode = null;
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },

            //刷新
            handleRefresh() {
                this.getData();
            },
            handleReset() {
                this.searchForm = {};
                this.getData();
            },
            getInitPage() {
                this.pageObj.commonPage = 1;
                this.pageObj.commonSize = 10;
                this.getData();
            },
            //点击主表行
            handleDetail(row) {
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.tabDataII = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {};
                this.copyForm = {};
                this.fetch('/basedata/Mat/AluModel/getAluModelInfo', {fid: row.fid})
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
                this.detailId = row.fid;
                this.docCode = row.fcode;
                this.getChildTable();
                this.getChildTableII();
            },
            //主表添加行
            handleAdd() {
                this.isShowStatus.isPopUp = true;
                this.otherVariable.popupTitle = this.otherVariable.addTitle;
                this.otherVariable.isEdit = false;
                this.clearSelect();
                this.addOrEditForm = {};
            },
            //主表编辑行
            handleEdit() {
                this.otherVariable.popupTitle = this.otherVariable.detailTitle;
                this.otherVariable.isEdit = true;
                this.addOrEditForm = this.detailForm;
                if(this.detailForm.fid) {
                    this.isShowStatus.isPopUp = true;
                    this.valueObj.matGroupCode = null;
                    this.$set(this.addOrEditForm,'matGroupCode',this.detailForm.matGroupCode);
                    this.$set(this.valueObj,'matGroupCode',this.detailForm.matGroupCode);
                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    });
                }
            },
            //主表保存行
            handleSave(type) {
                let tempObj;
                let api;
                if(type === 'add') {
                    api = '/basedata/Mat/AluModel/addAluModel';
                    tempObj = this.addOrEditForm;
                } else {
                    api = '/basedata/Mat/AluModel/updateAluModel';
                    tempObj = this.detailForm;
                }
                this.fetch(api, tempObj)
                    .then(result => {
                        if(result.status === 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.isShowStatus.isPopUp = false;
                            this.detailForm = {};
                            this.addOrEditForm = {};
                            this.searchForm = {inactive : 0};
                            this.tabDataI = [];
                            type === 'add' ? this.getData() : this.getData(false);
                        }else {
                            this.$message({
                                message: this.returnErrorMsg(result.error),
                                type: 'error'
                            });
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
                }
            },
            //主表删除行
            handleDelete() {
                if (this.detailForm.fid) {
                    this.fetch(`/basedata/Mat/AluModel/deleteAluModel?orderId=${this.detailForm.fid}`)
                        .then(result => {
                            if (result.status === 200) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.searchForm = {inactive : 0};
                                this.detailForm = {};
                                this.getData();
                            } else {
                                this.$message({
                                    message: '删除失败',
                                    type: 'error'
                                });
                            }
                        })
                } else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    });
                }
            },
            //获取从表
            getChildTable() {
                this.tabDataI = [];
                this.fetch('/basedata/Mat/AluModelCombine/selectByQueryModel?pageSize=100',{modelCode:this.docCode})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list) {
                            result.data.list.forEach(item => {
                                item.WghtDigit = item.unitWght * item.unitDigit
                            });
                            this.tabDataI = result.data.list;
                        }else {
                            this.tabDataI = [];
                        }
                    })
            },
            //获取胶条明细
            getChildTableII() {
                this.tabDataII = [];
                this.fetch('/basedata/Mat/PvcModel/selectByQueryModel?pageSize=100',{modelCode:this.docCode})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list) {
                            this.tabDataII = result.data.list;
                        }else {
                            this.tabDataII = [];
                        }
                    })
            },
            //获取型号列表
            getModelInput(val) {
                this.modelInputList = [];
                this.fetch(`basedata/Mat/AluModel/selectByQueryModel?pageNo=1&pageSize=10`,{fcode:val})
                    .then(result => {
                        if(result.data&&result.data.list) {
                            this.modelInputList = result.data.list;
                        }else {
                            this.modelInputList = [];
                        }
                    })
            },
            setModelInput(val) {
                let item;
                item = this.modelInputList.find(item => item.fcode === val);
                if(JSON.stringify(item) !== {}) {
                    this.$set(this.tabDataI[0],'fname',item.fname);
                }
            },
            //获取胶条号列表
            getPvcModelCode(val) {
                this.fetch('/basedata/Mat/PvcModel/selectByQueryModel?pageSize=100',{fcode:val})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list) {
                            this.pvcModelCodeList = result.data.list;
                        }else {
                            this.pvcModelCodeList = [];
                        }
                    })
            },
            setPvcModelCode() {
                let item;
                item = this.pvcModelCodeList.find(item => item.fcode === val);
                if(JSON.stringify(item) !== {}) {
                    this.$set(this.tabDataII[0],'fname',item.fname);
                }
            },
            //从表添加行
            handleAddChild() {
                if(this.detailForm.fid) {
                    this.otherVariable.isChildEdit = true;
                        this.$nextTick(() => {
                            this.tempForm = {isEditState: true};
                            this.activeName === 'first' ?
                            this.tabDataI.unshift(this.$lodash.cloneDeep(this.tempForm)):
                            this.tabDataII.unshift(this.$lodash.cloneDeep(this.tempForm));
                        })
                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    })
                }
            },
            //改变单位重量
            changeWghtDigit(row) {
                let temp = Number(Number(row.unitWght) * Number(row.unitDigit));
                this.$set(row,'WghtDigit',temp)
            },
            //从表保存
            handleSaveChild() {
                this.$confirm('是否提交?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let api;
                    let tempObj;
                    if(!this.childDetailRow.fid) {
                        if(this.activeName === 'first') {
                            api = '/basedata/Mat/AluModelCombine/addAluModelCombine';
                            let tempRow = this.tabDataI[0];
                            tempObj = {
                                "inactive": tempRow.inactive,
                                "isProfile": tempRow.isProfile,
                                "isPvc": tempRow.isPvc,
                                "modelCode": this.docCode,
                                "remark": tempRow.remark,
                                "sequence": tempRow.sequence,
                                "subModelCode": tempRow.fcode,
                                "unitDigit": tempRow.unitDigit,
                                "unitWght": tempRow.unitWght
                            }
                        }else {
                            api = '/basedata/Mat/PvcModel/addPvcModel'
                        }
                    }else {
                        if(this.activeName === 'first') {
                            api = '/basedata/Mat/AluModelCombine/updateAluModelCombine';
                            tempObj = this.childDetailRow;
                            tempObj.subModelCode = this.childDetailRow.fcode;
                        }else {
                            api = '/basedata/Mat/PvcModel/updatePvcModel'
                        }
                    }
                    this.fetch(api,tempObj)
                        .then(result => {
                            if(result.status === 200) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.childDetailRow.fid = null;
                                this.getChildTable();
                                setTimeout(() => {
                                    this.handleAddChild();
                                },500)
                            }else {
                                this.tabDataI[this.editIndex].isEditState = true;
                                this.$message({
                                    message: this.returnErrorMsg(result.error),
                                    type: 'error'
                                });
                            }
                        });
                    this.tabDataI = this.giveState(this.tabDataI)

                }).catch(() => {
                    console.log('cnacel')
                })



            },
            //从表取消操作
            handleCancelChild() {
                this.otherVariable.isChildEdit = false;
                this.activeName === 'first' ? this.getChildTable() : this.getChildTableII();
            },
            //从表删除行
            handleDeleteChild(row, index) {
                if (row.fid) {
                    let api;
                    this.activeName === 'first' ?
                        api = '/basedata/Mat/AluModelCombine/deleteAluModelCombine':
                        api = '/basedata/Mat/PvcModel/deletePvcModel';
                    if(confirm('确定删除？') === true) {
                        this.fetch(api,{fid:row.fid})
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    this.activeName === 'first' ? this.getChildTable() : this.getChildTableII();
                                }else {
                                    this.$message({
                                        message: '删除失败',
                                        type: 'error'
                                    })
                                }
                            });
                        this.otherVariable.isChildEdit = false;
                    }
                }else {
                    this.$message({
                        message: '请选择',
                        type: 'warning'
                    })
                }
            },
            //从表点击行
            clickDetail(row) {
                if(!this.otherVariable.isReadTable) {
                    this.otherVariable.isChildEdit = true;
                    this.tabDataI = this.giveState(this.tabDataI);
                    row.isEditState = true;
                }
                this.childDetailRow = row || {};
                this.editIndex = this.$lodash.findIndex(this.tabDataI, ['fid', row.fid]);
                if(this.editIndex < 0) {
                    this.editIndex = 0;
                }
            },
            //自适应高度
            changeSize() {
                this.isResize = false;
                this.tableHeight = window.innerHeight - this.$refs.detailRef.$el.offsetHeight - 130 - 64 - 40 - 55;
                this.mainHeight = window.innerHeight - 214;
                this.$nextTick(() => {
                    this.isResize = true;
                })
            },
            listenResize() {
                window.onresize = () => {
                    this.changeSize();
                }
            },
            //禁止点击表格提醒
            handleNotAllowed() {
                if(this.isShowStatus.isPopUp || !this.isShowStatus.isRead) {
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
</style>
