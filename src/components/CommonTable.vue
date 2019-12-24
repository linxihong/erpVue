<!--
    isShowStatus: 包含多个控制是否显示的属性的对象
    propData: 含有表单字段名称以及字段代码等相关信息的列表
        -- type: 表单项的类型，常见的有:normal,select
        -- isMain: 是否为主键
    tableData: 表格的数组数据
    @handleDetail: 调用父组件的handleDetail方法,参数row为被点击行的数据
    @showLabel: 将后台拿到的value转为对应的要显示的label
    isMulTable: true表示嵌套表头的表格，false表示普通表格
-->

<template>
    <div>
        <el-table
            ref="simpleTable"
            class="main-table"
            :height="tableHeight || mainHeight"
            tooltip-effect="dark"
            v-if="!isMulTable"
            :align="isCenter?'center':'left'"
            border
            v-show="!isShowStatus.isMore"
            :data="tableData"
            @row-click="handleDetail"
            :cell-style="cellStyle"
            :row-class-name="tableRowClassName"
            highlight-current-row
            :max-height="tableHeight || $store.state.screenHei*0.76"
            @selection-change="handleSelectionChange"
            :header-cell-style="tableHeaderColor"
        >
            <el-table-column v-if="(otherVariable.isMulSelect || isMulSelect )&& isNotMulSelect" type="selection" width="40" ></el-table-column>
            <!--simple-table-->
            <template v-if="!isMulCommonTable" v-for="(item,index) in propData">
                <el-table-column v-if="item.type === 'normal'&&!item.isMain&&!item.disabledInput||item.type === 'first'" :fixed="item.fixed" :align="item.align" :label="item.name" :width="item.width" :sortable="item.sortable" :sort-method="(a, b) => sortAlpha(a, b, item.prop)" :show-overflow-tooltip="!item.isShort">
                    <template slot-scope="scope">
                        <span>{{ scope.row[item.prop] }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'Exception'&&!item.isMain&&!item.disabledInput||item.type === 'first'" :fixed="item.fixed" :align="item.align" :label="item.name" :width="item.width" :sortable="item.sortable" :sort-method="(a, b) => sortAlpha(a, b, item.prop)" :show-overflow-tooltip="!item.isShort">
                    <template slot-scope="scope">
                        <span>{{ scope.row[item.prop]==null?'0':scope.row[item.prop]}}天</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'number'&&!item.isMain" :label="item.name" :align="item.align" :width="item.width" :sortable="item.sortable" :sort-method="(a, b) => sortAlpha(a, b, item.prop)" :show-overflow-tooltip="!item.isShort">
                    <template slot-scope="scope">
                        <span>{{ scope.row[item.prop] }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'select'&&!item.disabledInput" :label="item.name" :align="item.align" :width="item.width" :sortable="item.sortable" :sort-method="(a, b) => sortAlpha(a, b, item.prop)" :show-overflow-tooltip="!item.isShort">
                    <template slot-scope="scope">
                        <span>{{ showLabel(item.selectList,scope.row[item.prop]) }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'mixinNormal'" :label="item.name1+item.name2" :align="item.align" :width="item.width" :show-overflow-tooltip="!item.isShort">
                    <template slot-scope="scope">
                        <div class="mixin-rowI">&nbsp;{{scope.row[item.prop1]}}</div>
                        <div class="mixin-rowII">&nbsp;{{scope.row[item.prop2]}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'mixinVoucher'" :label="item.name1+item.name2" :align="item.align" :width="item.width" :show-overflow-tooltip="!item.isShort">
                    <template slot-scope="scope">
                        <div class="mixin-rowI">&nbsp;{{scope.row[item.prop1]}}</div>
                        <div class="mixin-rowII">&nbsp;{{scope.row[item.prop2]=='0'?'未提交':scope.row[item.prop2]=='50'?'已提交':'已审核'}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'mixinVouchers'" :label="item.name1+item.name2" :align="item.align" :width="item.width" :show-overflow-tooltip="!item.isShort">
                    <template slot-scope="scope">
                        <div class="mixin-rowI">&nbsp;{{scope.row[item.prop1]}}</div>
                        <div class="mixin-rowII">&nbsp;{{scope.row[item.prop2]=='1'?'贷款':scope.row[item.prop2]=='2'?'订金':'税金'}}</div>
                    </template>
                </el-table-column>
                <el-table-column :class-name="item.tooltip?'tooltip-cell':''" v-if="item.type === 'mixin'" :label="item.name1+item.name2" :align="item.align" :width="item.width" :show-overflow-tooltip="!item.isShort">
                    <template slot-scope="scope">
                        <div class="mixin-rowI">&nbsp;{{scope.row[item.prop1]}}</div>
                        <div class="mixin-rowII">&nbsp;{{scope.row[item.prop2]==="已审核"?'待签批':scope.row[item.prop2]}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'mixinStatus'" :label="item.name1+item.name2" :align="item.align" :width="item.width" :show-overflow-tooltip="!item.isShort">
                    <template slot-scope="scope">
                        <div class="mixin-rowI">&nbsp;{{scope.row[item.prop1]}}</div>
                        <div class="mixin-rowII">
                            <span>&nbsp;{{scope.row[item.prop2]==='已提交'?'待提交':(scope.row[item.prop2])=='已确认'?'已提交':scope.row[item.prop2]}}</span>
                            <span v-if="item.hasCircleI" class="statusCircle" :class="setCircle(scope.row[item.status])"></span>
                            <span v-if="item.hasCircleII" class="statusCircleII" :class="setCircleII(scope.row[item.status])"></span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :class-name="item.tooltip?'tooltip-cell':''" v-if="item.type === 'mixinTop'" :label="item.name1+item.name2" :align="item.align" :width="item.width" :show-overflow-tooltip="!item.isShort">
                    <template slot-scope="scope">
                        <div class="mixin-rowI">&nbsp;{{scope.row[item.prop1]}}<span v-if="scope.row.isTop" @mouseover="toggleTop(false)"  @mouseout="toggleTop(true)" @click="cancelTop" class="top-tip">{{isShowTop ? '置顶' : '取消'}}</span></div>
                        <div class="mixin-rowI">&nbsp;{{scope.row[item.prop2]}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'modelInput'" :label="item.name" :align="item.align" :width="item.width" align="center" :show-overflow-tooltip="!item.isShort">
                    <template slot-scope="scope">
                        <div>{{scope.row[item.prop]===0?'×':(scope.row[item.prop]===1)?"√":''}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'voucherInput'" :label="item.name" :align="item.align" :width="item.width" align="center" :show-overflow-tooltip="!item.isShort">
                    <template slot-scope="scope">
                        <div>{{scope.row[item.prop]===100?'√':''}}</div>
                    </template>
                </el-table-column>
                <!--<el-table-column v-if="item.type === 'keepNum'" :label="item.name" :width="item.width">-->
                    <!--<template slot-scope="scope">-->
                        <!--<div>{{scope.row[item.prop].toFixed(3)}}</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column v-if="item.type === 'visits'" :label="item.name" :width="item.width" :align="item.align">
                    <template slot-scope="scope">
                        <div>{{scope.row[item.prop]===0?'待拜访':(scope.row[item.prop]===50?'拜访中':'已完成')}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'client'" :label="item.name" :width="item.width" :align="item.align">
                    <template slot-scope="scope">
                        <div>{{scope.row[item.prop]==='1'?'普通客户':(scope.row[item.prop]==='2'?'分销商':'经销商')}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type ==='sell'" :label="item.name" :width="item.width" :align="item.align">
                    <template slot-scope="scope">
                        <div>{{scope.row[item.prop]===1?'国内':(scope.row[item.prop]===2?'出口':'')}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'doctypes'" :label="item.name1+item.name2" :width="item.width" :align="item.align">
                    <template slot-scope="scope">
                        <div class="mixin-rowI">&nbsp;{{scope.row[item.prop1]}}</div>
                        <div class="mixin-rowII">&nbsp;{{scope.row[item.prop2]==0?'潜在机会':'落实机会'}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'export_list'" :label="item.name1+item.name2" :width="item.width" :align="item.align">
                    <template slot-scope="scope">
                        <div class="mixin-rowI">&nbsp;{{scope.row[item.prop1]}}</div>
                        <div class="mixin-rowII">&nbsp;{{scope.row[item.prop2]==0?'未确定':(scope.row[item.prop2]==50)?'已确定':(scope.row[item.prop2]==100)?'已审核':''}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'is_check_price'" :label="item.name1+item.name2" :width="item.width" :align="item.align">
                    <template slot-scope="scope">
                        <div class="mixin-rowI">&nbsp;{{scope.row[item.prop1]}}</div>
                        <div class="mixin-rowII" v-if="scope.row[item.prop2] === 0 || scope.row[item.prop2] === null">未提交</div>
                        <div class="mixin-rowII" v-if="scope.row[item.prop2] === 50">已提交</div>
                        <div class="mixin-rowII" v-if="scope.row[item.prop2] === 100">已审核</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'is_load'" :label="item.name1+item.name2" :width="item.width" :align="item.align">
                    <template slot-scope="scope">
                        <div class="mixin-rowI">&nbsp;{{scope.row[item.prop1]}}</div>
                        <div class="mixin-rowII" v-if="load_status_list.includes(scope.row[item.prop2])">未提交</div>
                        <div class="mixin-rowII" v-if="scope.row[item.prop2] === 100">已提交</div>
                        <div class="mixin-rowII" v-if="scope.row[item.prop2] !== 100 && !load_status_list.includes(scope.row[item.prop2])">{{scope.row.docStatusName}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.type === 'circle'" :label="item.name" :width="item.width" :align="item.align">
                    <template slot-scope="scope">
                        <el-progress type="circle" :percentage="scope.row[item.prop] ===null?0:scope.row[item.prop]" color="#00BAFF" :width="44"></el-progress>
                    </template>
                </el-table-column>
            </template>
            <!--multi-table-->
            <template v-if="isMulCommonTable" v-for="(item,index) in propData">
                <el-table-column :label="item.name + (item.unit ? item.unit : '')" :align="item.align" :width="item.width" :show-overflow-tooltip="!item.isShort">
                    <template slot-scope="scope">
                        <!--isEditState 表格行可编辑-->
                        <!--isCellEdit 单元格可编辑-->
                        <!--rule 单元格有数据规则约束-->
                        <div v-if="item.type==='normal'" :align="item.align">
                            <span v-if="(!item.rule)&&(!item.isCellEdit)">{{ scope.row[item.prop] }}</span>
                            <span v-if="(item.rule === 'limitLength')">{{ scope.row[item.prop]?parseFloat(scope.row[item.prop]).toFixed(3):0.00 }}</span>
                        </div>
                        <div v-if="item.type==='select'" :align="item.align">
                            <span>{{ showLabel(item.selectList,scope.row[item.prop]) }}</span>
                        </div>
                        <div v-if="item.type==='checkbox'" :align="item.align">
                            <span>{{ scope.row[item.prop] === 'true' ? '✔' : '×' }}</span>
                        </div>
                        <div v-if="item.type==='sell'" :align="item.align">
                            <span>{{scope.row[item.prop]===1?'国内':(scope.row[item.prop]===2?'出口':'')}}</span>
                        </div>
                    </template>
                    <template v-if="item.children.length" v-for="i in item.children" :align="i.align">
                        <el-table-column :label="i.name" :align="i.align" :width="i.width" :show-overflow-tooltip="!i.isShort">
                            <template slot-scope="scope">
                                <span v-if="i.type==='normal'">{{ scope.row[i.prop] }}</span>
                                <span v-if="i.type==='checkbox'">{{ scope.row[i.prop] === 'true' ? '✔' : '×' }}</span>
                            </template>
                            <template v-if="i.children.length" v-for="s in i.children">
                                <el-table-column :prop="s.prop" :label="s.name" :align="s.align" :width="s.width" :show-overflow-tooltip="!s.isShort">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row[s.prop] }}</span>
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table-column>
                    </template>
                </el-table-column>
            </template>
            <slot name="operate-btn"></slot>
        </el-table>
        <!--multiple-table-->
        <el-table
            ref="multipletable"
            tooltip-effect="dark"
            v-if="isMulTable"
            :show-summary="isSum"
            :summary-method="getSummaries"
            :row-class-name="tableRowClassName"
            border
            @row-click="handleRowEdit"
            @row-dblclick="handleDblClick"
            :data="mulTableData"
            :height="tableHeight || $store.state.screenHei*0.60"
            highlight-current-row
            @selection-change="handleSelectionChange"
            :header-cell-style="tableHeaderColor"
        >
            <el-table-column v-if="(otherVariable.isMulSelect || isMulSelect )&& isNotMulSelect" type="selection" width="40"></el-table-column>
            <template v-for="item in formPropTable">
                <el-table-column :label="item.name + (item.unit ? item.unit : '')"  :align="item.align?item.align:'left'" :width="item.width" :show-overflow-tooltip="!item.isShort" :prop="item.prop=='digit'?'digit':(item.prop=='theoryWght')?'theoryWght':''">
                    <el-table-column v-if="item.type === 'TableIndex'" type="index" :fixed="item.fixed" :align="item.align" label="序号" :width="item.width" :sortable="item.sortable" :sort-method="(a, b) => sortAlpha(a, b, item.prop)" :show-overflow-tooltip="!item.isShort">
                    </el-table-column>
                    <template slot-scope="scope" >
                        <!--isEditState 表格行可编辑-->
                        <!--isCellEdit 单元格可编辑-->
                        <!--rule 单元格有数据规则约束-->
                        <span class="num-cell-r" v-if="(!scope.row.isEditState)&&(!item.rule)&&(!item.isCellEdit)">{{ scope.row[item.prop] }}</span>
                        <el-input
                            @keydown.native.down="jumpToCell('down')"
                            @keydown.native.up="jumpToCell('up')"
                            @keyup.native="changeCell(item.prop)"
                            v-if="(!scope.row.isEditState)&&(!item.rule)&&(item.isCellEdit)"
                            v-model="scope.row[item.prop]">
                        </el-input>
                        <span class="num-cell-r" v-if="(!scope.row.isEditState)&&(item.rule === 'limitLength')">{{ scope.row[item.prop]?parseFloat(scope.row[item.prop]).toFixed(3):0.00 }}</span>
                        <el-input v-if="scope.row.isEditState&&item.type!=='select'" v-model="scope.row[item.prop]"></el-input>
                        <span class="num-cell-r" v-if="(!scope.row.isEditState)&&(item.rule === 'keepLength')">{{ scope.row[item.prop]?parseFloat(scope.row[item.prop]).toFixed(3):0.00 }}</span>
                        <el-input v-if="scope.row.isEditState&&item.type!=='keepNum'" v-model="scope.row[item.prop]"></el-input>
                    </template>
                    <template v-if="item.children.length" v-for="i in item.children" >
                        <el-table-column :label="i.name" :align="i.align?i.align:'left'" :width="i.width" :show-overflow-tooltip="!i.isShort">
                            <template slot-scope="scope">
                                <span v-if="(!scope.row.isEditState)&&(i.type==='normal')&&(i.rule !== 'limitLength')" :class="i.className">{{ scope.row[i.prop] }}</span>
                                <span class="num-cell-r" v-if="(!scope.row.isEditState)&&(i.type==='normal')&&(i.rule === 'limitLength')">{{ scope.row[i.prop]?parseFloat(scope.row[i.prop]).toFixed(3):0.00 }}</span>
                                <el-input v-if="scope.row.isEditState&&i.type==='normal'" v-model="scope.row[i.prop]"></el-input>
                                <span v-if="!scope.row.isEditState&&i.type==='checkbox'">{{ scope.row[i.prop] === 'true' ? '✔' : '×' }}</span>
                                <el-checkbox
                                    true-label="true"
                                    false-label="false"
                                    v-if="scope.row.isEditState&&i.type==='checkbox'"
                                    v-model="scope.row[i.prop]">
                                </el-checkbox>
                            </template>
                            <template v-if="i.children.length" v-for="s in i.children">
                                <el-table-column  :label="s.name" :align="s.align?s.align:'left'" :width="s.width" :show-overflow-tooltip="!s.isShort">
                                    <template slot-scope="scope">
                                        <span v-if="!scope.row.isEditState">{{ scope.row[s.prop] }}</span>
                                        <el-input v-if="scope.row.isEditState&&s.type!=='select'" v-model="scope.row[s.prop]"></el-input>
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table-column>
                    </template>
                </el-table-column>
            </template>
            <slot name="operate-btn"></slot>
        </el-table>
    </div>
</template>

<script>
    export default {
        props: {
            //表格高度
            'mainHeight': {
                type: Number,
                default: 713
            },
            // isMore 点击'更多查询'时隐藏该表格
            'isShowStatus': {
                type: Object
            },
            // isReadTable 该表格只读，单击行不会呈编辑状态
            // isChildEdit true表示该表格处于编辑状态
            // isOtherTable 单击表格行的方法(除了单击行后呈编辑状态的方法)
            'otherVariable': {
                type: Object
            },
            // 含有表单字段名称以及字段代码等相关信息的列表
            'propData': {
                type: Array
            },
            // 表格的数组数据
            'tableData': {
                type: Array
            },
            // true表示嵌套表头的表格，false表示普通表格
            'isMulTable': {
                type: Boolean,
                default: false
            },
            // true表示普通的嵌套表头的表格，false表示普通表格
            'isMulCommonTable': {
                type: Boolean,
                default: false
            },
            // 单元格是否居中
            'isCenter': {
                type: Boolean,
                default: false
            },
            'isSum':{
                type: Boolean,
                default: false
            },
            'sumParam': {
                type: Object,
                default: function () {
                    return {digit:null,theoryWght:null}
                }
            },
            'indexList': {
                type: Array,
                default: function () {
                    return []
                }
            },
            // 父组件传过来的表格数据
            'formTableData': {
                type: Array,
                default: function () {
                    return []
                }
            },
            // 嵌套表格，含有表单字段名称以及字段代码等相关信息的列表
            'formPropTable': {
                type: Array,
                default: function () {
                    return []
                }
            },
            // 表格的高度
            'tableHeight': {
                type: Number
            },
            // 是否拥有双击的方法
            'isHasDbMethod' : {
                type: Boolean,
                default : false
            },
            // 单击事件只获取row和index
            'isPureClickRow': {
                type: Boolean,
                default : false
            },
            // 表格行的主键
            'mainKey': {
                type: String,
                default : 'fid'
            },
            // 是否多选
            'isMulSelect': {
                type: Boolean,
                default: false
            },
            'isNotMulSelect': {
                type: Boolean,
                default: true
            },
            // 默认点击触发勾选
            'isNotHandleSelect': {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                tableHeaderColor: {
                    'background-color':'#f5f7fa'
                },
                isShowTop: true,
                mulTableData: [],
                copyMulTableData: [],
                focusTimes: 1,
                editIndex: 0,
                load_status_list: [0,null,50]
            }
        },
        mounted() {
            this.initStatus();
        },
        methods: {
            // 渲染表格
            initStatus() {
                this.mulTableData = this.giveState(this.formTableData);
                this.copyMulTableData = this.giveState(this.$lodash.cloneDeep(this.formTableData));
            },
            tableRowClassName({row,rowIndex}){
              if(row.docTypeName=='冲销'){
                  return 'info-row';
              }
              if(row.billType == '冲销单'){
                  return 'info-row';
              }
                return '';
            },

            //表单单元格
            cellStyle(row,column,rowIndex,columnIndex){
                if(row.row.auditingOrderOverDay=='1' && row.column.label==='审核超期'){
                    return 'background-color: #FFEAE5;'
                }else  if(row.row.auditingOrderOverDay=='2' && row.column.label==='审核超期'){
                    return 'background-color: #FFC3B9;'
                }else  if(row.row.auditingOrderOverDay=='3' && row.column.label==='审核超期'){
                    return 'background-color: #FF9C91;'
                }else  if(row.row.auditingOrderOverDay=='4' && row.column.label==='审核超期'){
                    return 'background-color: #FF7369;'
                }else if(row.row.auditingOrderOverDay=='5' && row.column.label==='审核超期'){
                    return 'background-color: #FF4640;'
                }else  if(row.row.auditingOrderOverDay=='6' && row.column.label==='审核超期'){
                    return 'background-color: #FF2619; color: white;'
                }else  if(row.row.auditingOrderOverDay=='7' && row.column.label==='审核超期'){
                    return 'background-color: #D91F11;color: white;'
                }else  if(row.row.auditingOrderOverDay=='8' && row.column.label==='审核超期'){
                    return 'background-color: #D91F11;color: white;'
                }else if(row.row.auditingOrderOverDay=='9' && row.column.label==='审核超期'){
                    return 'background-color: #B3170B;color: white;'
                }else if(row.row.auditingOrderOverDay=='10' && row.column.label==='审核超期'){
                    return 'background-color: #8C100D;color: white;'
                }
                if(row.row.signingOrderOverDay=='1' && row.column.label==='签批超期'){
                    return 'background-color: #FFEAE5;'
                }else  if(row.row.signingOrderOverDay=='2' && row.column.label==='签批超期'){
                    return 'background-color: #FFC3B9;'
                }else  if(row.row.signingOrderOverDay=='3' && row.column.label==='签批超期'){
                    return 'background-color: #FF9C91;'
                }else  if(row.row.signingOrderOverDay=='4' && row.column.label==='签批超期'){
                    return 'background-color: #FF7369;'
                }else if(row.row.signingOrderOverDay=='5' && row.column.label==='签批超期'){
                    return 'background-color: #FF4640;'
                }else  if(row.row.signingOrderOverDay=='6' && row.column.label==='签批超期'){
                    return 'background-color: #FF2619; color: white;'
                }else  if(row.row.signingOrderOverDay=='7' && row.column.label==='签批超期'){
                    return 'background-color: #D91F11;color: white;'
                }else  if(row.row.signingOrderOverDay=='8' && row.column.label==='签批超期'){
                    return 'background-color: #D91F11;color: white;'
                }else if(row.row.signingOrderOverDay=='9' && row.column.label==='签批超期'){
                    return 'background-color: #B3170B;color: white;'
                }else if(row.row.signingOrderOverDay=='10' && row.column.label==='签批超期'){
                    return 'background-color: #8C100D;color: white;'
                }
                if(row.row.productOverDay=='1' && row.column.label==='生产超期'){
                    return 'background-color: #FFEAE5;'
                }else  if(row.row.productOverDay=='2' && row.column.label==='生产超期'){
                    return 'background-color: #FFC3B9;'
                }else  if(row.row.productOverDay=='3' && row.column.label==='生产超期'){
                    return 'background-color: #FF9C91;'
                }else  if(row.row.productOverDay=='4' && row.column.label==='生产超期'){
                    return 'background-color: #FF7369;'
                }else if(row.row.productOverDay=='5' && row.column.label==='生产超期'){
                    return 'background-color: #FF4640;'
                }else  if(row.row.productOverDay=='6' && row.column.label==='生产超期'){
                    return 'background-color: #FF2619; color: white;'
                }else  if(row.row.productOverDay=='7' && row.column.label==='生产超期'){
                    return 'background-color: #D91F11;color: white;'
                }else  if(row.row.productOverDay=='8' && row.column.label==='生产超期'){
                    return 'background-color: #D91F11;color: white;'
                }else if(row.row.productOverDay=='9' && row.column.label==='生产超期'){
                    return 'background-color: #B3170B;color: white;'
                }else if(row.row.productOverDay=='10' && row.column.label==='生产超期'){
                    return 'background-color: #8C100D;color: white;'
                }
                if(row.row.takeDeliveryOverDay=='1' && row.column.label==='提货超期'){
                    return 'background-color: #FFEAE5;'
                }else  if(row.row.takeDeliveryOverDay=='2' && row.column.label==='提货超期'){
                    return 'background-color: #FFC3B9;'
                }else  if(row.row.takeDeliveryOverDay=='3' && row.column.label==='提货超期'){
                    return 'background-color: #FF9C91;'
                }else  if(row.row.takeDeliveryOverDay=='4' && row.column.label==='提货超期'){
                    return 'background-color: #FF7369;'
                }else if(row.row.takeDeliveryOverDay=='5' && row.column.label==='提货超期'){
                    return 'background-color: #FF4640;'
                }else  if(row.row.takeDeliveryOverDay=='6' && row.column.label==='提货超期'){
                    return 'background-color: #FF2619; color: white;'
                }else  if(row.row.takeDeliveryOverDay=='7' && row.column.label==='提货超期'){
                    return 'background-color: #D91F11;color: white;'
                }else  if(row.row.takeDeliveryOverDay=='8' && row.column.label==='提货超期'){
                    return 'background-color: #D91F11;color: white;'
                }else if(row.row.takeDeliveryOverDay=='9' && row.column.label==='提货超期'){
                    return 'background-color: #B3170B;color: white;'
                }else if(row.row.takeDeliveryOverDay>='10' && row.column.label==='提货超期'){
                    return 'background-color: #8C100D;color: white;'
                }
            },
            // 点击表格行获取详情
            handleDetail(row) {
                this.$emit('handleDetail',row)
            },
            //渲染
            renderRow(fid,idName = 'fid') {
                let tempRow;
                if(this.tableData.length) {
                    tempRow = this.tableData.find(item => item[idName] === fid);
                }else {
                    tempRow = null;
                }
                this.$nextTick(() => {
                    if(tempRow) {
                        this.$refs.simpleTable.setCurrentRow(tempRow);
                        this.$emit('handleDetail',tempRow);
                    }else {
                        this.$emit('getInitPage');
                    }
                })
            },
            // 多选事件
            handleSelectionChange(rows) {
                this.$emit('handleSelectionChange',rows)
            },
            // 点击表格行使其呈编辑状态
            handleRowEdit(row) {
                this.focusTimes = 1;
                this.editIndex = this.$lodash.findIndex(this.mulTableData, [this.mainKey, row[this.mainKey]]);
                if(!this.otherVariable.isReadTable) {
                    this.otherVariable.isChildEdit = true;
                    this.mulTableData = this.giveState(this.mulTableData);
                    row.isEditState = true;
                }
                if(this.otherVariable.isOtherTable) {
                    this.$emit('handleOtherTable',row);
                }
                if(this.isPureClickRow) {
                    this.$emit('pureClickRow',row,this.editIndex);
                    if(!this.isNotHandleSelect) {
                        this.$refs.multipletable.toggleRowSelection(row);
                    }
                }
            },
            // 双击事件
            handleDblClick(row) {
                if(this.isHasDbMethod) {
                    this.$emit('handleDblClick',row)
                }
            },
            // 单元格内input改变事件
            changeCell(porp) {
                this.$emit('changeCell',porp)
            },
            // ↑↓跳至指定单元格
            jumpToCell(type) {
                if(type === 'down') {
                    this.editIndex += 1;
                    if(this.editIndex >= this.mulTableData.length) {
                        this.editIndex = this.mulTableData.length - 1
                    }
                }else {
                    this.editIndex -= 1;
                    if(this.editIndex < 0) {
                        this.editIndex = 0
                    }
                }
                this.$nextTick(() => {
                    this.$refs.multipletable.setCurrentRow(this.mulTableData[this.editIndex]);
                    $('.el-table__body-wrapper .el-input__inner')[this.editIndex].focus();
                })
            },
            // 展示值所对应的name/label
            showLabel(list,value) {
                let item = {label:'',value:''};
                item = list.find(item => item.value === value) || {label:'',value:''};
                return item.label
            },
            // 排序
            sortAlpha(a, b, key) {
                if(a[key] > b[key]) {
                    return 1;
                }else if(a[key] < b[key]) {
                    return -1;
                }
                return 0;
            },
            // 鼠标聚焦事件
            handleFocus() {
                const that = this;
                $('.el-table__body-wrapper .el-input__inner')[0].focus();
                let domLength = [...$('.el-table__body-wrapper .el-input__inner')].length;
                $('.el-table__body-wrapper .el-input__inner').keyup(function(e) {
                    let keycode = e.which;
                    if(keycode === 13) {
                        let cell = $(this).parents('.is-center');
                        let nextEl = cell.next().find('.el-input__inner');
                        if(nextEl.prop("disabled")) {
                            nextEl = cell.next().next().find('.el-input__inner');
                            nextEl.focus();
                        }else {
                            nextEl.focus();
                            that.focusTimes += 1;
                            if(that.focusTimes > domLength) {
                                let tempObj;
                                tempObj = that.mulTableData[that.editIndex];
                                that.$emit('handleSaveChild',tempObj,'edit')
                            }
                        }
                    }
                })
            },
            //合计-订单数、理重
            getSummaries(param) {
                const { columns, data } = param;
                let sums = [];
                if(this.isSum && this.sumParam.digit && this.sumParam.theoryWght) {
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
                    sums[this.sumParam.digit] = digit;
                    //理重
                    theoryWght ? sums[this.sumParam.theoryWght] = theoryWght.toFixed(3) : 0;
                }else if(this.isSum && this.sumParam.isWeightNote) {
                    // 核算汇总
                    let actDigit = null;
                    let balanceDigit = null;
                    let balanceTotalMoney = null;
                    let billTotalMoney = null;
                    if(data.length) {
                        data.forEach((d,i) => {
                            balanceDigit += Number(d.balanceDigit);
                            actDigit += Number(d.actDigit);
                            balanceTotalMoney += Number(d.balanceTotalMoney);
                            billTotalMoney += Number(d.billTotalMoney);
                        })
                    }
                    sums[0] = '合计';
                    //支数
                    sums[3] = actDigit||0;
                    //数量
                    sums[4] = balanceDigit||0;
                    //结算金额
                    balanceTotalMoney ? sums[6] = balanceTotalMoney.toFixed(3) : sums[6] = 0;
                    //开票金额
                    billTotalMoney ? sums[8] = billTotalMoney.toFixed(3) : sums[8] = 0;
                }else {
                    sums = [];
                }
                return sums;
            },
            // 状态圆圈
            setCircle(status) {
                if(status >= 0 && status < 50) {
                    return 'red'
                }else if(status >= 100) {
                    return 'green'
                }else if(status === 50) {
                    return 'red'
                }
                else {
                    return 'none'
                }
            },
            setCircleII(status) {
                if(status === 50) {
                    return 'yellow'
                }else {
                    return 'none'
                }
            },
            // 置顶功能
            toggleTop(isShowTop) {
                this.isShowTop = isShowTop;
            },
            cancelTop() {
                this.$emit('cancelTop');
            },
            // 修改table header的背景色
//            tableHeaderColor({ row, column, rowIndex, columnIndex }) {
//                if (rowIndex === 0) {
//                    return 'background-color: grey;'
//                }
//            }

        }
    }
</script>

<style scoped lang="less">
    .mixin-rowI {
        color: #333;
    }
    .mixin-rowII {
        color: #888;
        display: flex;
        align-items: center;
    }
    .current-row {
        .mixin-rowII {
            color: #fff;
        }
        &:hover {
            .mixin-rowII {
                color: #888;
            }
        }
    }

    .top-tip {
        border: 1px dotted red;
        padding-left: 2px;
        padding-right: 2px;
        line-height: 1.2;
        display: inline-block;
        color: red;
        margin-left: 10px;
        transform: scale(0.88);
        font-size: 12px;
    }
    .statusCircle {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-left: 10px;
        &.red {
            background: red;
        }
        &.green {
            background: green;
        }
        &.yellow {
            background: yellow;
        }
        &.none {
            display: none;
        }
    }
    .statusCircleII {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-left: 5px;
        &.red {
            background: red;
        }
        &.green {
            background: green;
        }
        &.yellow {
            background: yellow;
        }
        &.none {
            display: none;
        }
    }
</style>
