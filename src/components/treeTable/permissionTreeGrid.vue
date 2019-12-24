/**
* @date 2017/11/22
* @desc 权限管理 赋权管理 权限点
**/
<template>
    <el-table
            :data="data"
            border
            style="width: 100%"
            :row-style="showTr">
        <el-table-column
                label="权限点"
                width="">
            <template slot-scope="scope">
                <!--v-if="spaceIconShow(scope.$index,scope.row)"-->
                <span v-for="(space, levelIndex) in scope.row._level"
                      class="ms-tree-space"></span>
                <button class="button is-outlined is-primary is-small" v-if="toggleIconShow(scope.$index,scope.row)"
                        @click="toggle(scope.$index)">
                    <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
                    <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
                </button>
                <span v-else-if="scope.$index===0" class="ms-tree-space"></span>
                <span>{{columnDataFilter(scope,scope.row.resname)}}</span>
            </template>
        </el-table-column>

        <el-table-column
                label="授权"
                width="">
            <template slot-scope="scope">
                <el-checkbox @change="ifAuSelect('ifAu', scope.row, scope)"
                             v-model='ifAu[scope.row.resid]'></el-checkbox>
            </template>
        </el-table-column>

        <el-table-column
                label="可分配"
                width="">
            <template slot-scope="scope">
                <el-checkbox @change="setMsg(ifFlag[scope.row.resid],scope.row)" v-model='ifFlag[scope.row.resid]'
                             v-if="ifAu[scope.row.resid]!=true" disabled></el-checkbox>
                <el-checkbox @change="setMsg(ifFlag[scope.row.resid],scope.row)" v-model='ifFlag[scope.row.resid]'
                             v-if="ifAu[scope.row.resid]==true"></el-checkbox>
            </template>
        </el-table-column>
    </el-table>
</template>
<script type="es6">
    import Utils from './utils/index.js'
    export default {
        name: 'tree-grid',
        props: {
// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
            treeStructure: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
// 这是相应的字段展示
            columns: {
                type: Array,
                default: function () {
                    return []
                }
            },
// 这是数据源
            dataSource: {
                type: Array,
                default: function () {
                    return []
                }
            },
// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
            requestUrl: {
                type: String,
                default: function () {
                    return ''
                }
            },
// 这个是是否展示操作列
            treeType: {
                type: String,
                default: function () {
                    return 'normal'
                }
            },
// 是否默认展开所有树
            defaultExpandAll: {
                type: Boolean,
                default: function () {
                    return false
                }
            }
        },
        data () {
            return {
                checkList: [],
                ifAu: {},
                ifFlag: {},
                resultArray: {},
            }
        },
        watch: {
            'dataSource':{
                handler:(val,oldVal) => {
                    let _resultArray,_ifAu={};
                    let _each = (obj,status) => {
                        _.each(obj,(v,k) => {
                            if(v.parentid!=0&&v.resid!=undefined&&v.checked==true){
                                _ifAu[v.resid] = true
                            }
                            if(v.children){
                                _each(v.children)
                            }
                        })
                    };
                    _each(val)
                    this.ifAu = _ifAu;
                },
                // 深度观察
                deep:true
            }
        },
        computed: {
            ifDisable(type, row, scope){
                /*if(type=='ifFlag'){
                 return ifAu[row.resid]!=undefined?false:true
                 }*/
                return 'disabled';

            },
            // 格式化数据源
            data: function () {
                let me = this
                if (me.treeStructure) {
                    let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
                    return data
                }
                return me.dataSource
            }
        },
        methods: {
            setMsg(type,v) {
                if(type==true){
                    v.type = 1;
                    this.resultArray[v.resid] = v;
                    this.$emit('change',this.resultArray);
                }
            },
            columnStatus(status) {
                return true
            },
            columnDataFilter(scope, column) {
                return column
            },

            ifAuSelect(type, row, scope){
                if(this.ifAu[row.resid]==false){
                    this.ifFlag[row.resid] = false;
                }
                this.ifAu[row.resid]==undefined?this.ifAu[row.resid]==true:this.ifAu[row.resid]==false;
                this.selectChildren('ifAu',row.resid,this.ifAu[row.resid]);
                this.setMsg(this.ifFlag[row.resid],row);
            },
            selectChildren(type,id,status,columnVal){
                let _resultArray,
                    _result;
                let _each = (obj,type) => {
                    _.each(obj,(v,k) => {
                        if(_resultArray==undefined&&v.resid==id){
                            v.children?_resultArray = v.children:'';
                        }
                        v.children?_each(v.children):''
                    })
                };
                _each(this.dataSource)

                if(type=='ifAu'){
                    _result = this.deepCopy(this.ifAu);
                }else if(type=='ifFlag'){
                    _result = this.deepCopy(this.ifFlag);
                }

                let _childrenEach = (obj,type) => {
                    _.each(obj,(v,k) => {
                        columnVal?_result[v.resid] = columnVal:_result[v.resid] = status;
                        v.children?_childrenEach(v.children):''
                    })
                };

                _childrenEach(_resultArray)

                if(type=='ifAu'){
                    this.ifAu = _result;
                }else if(type=='ifFlag'){
                    this.ifFlag = _result;
                }
            },
            // 显示行
            showTr: function (row, index) {
                let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
                row._show = show;
                return show ? '' : 'display:none;'
            },
            // 展开下级
            toggle: function (trIndex) {
                let me = this;
                let record = me.data[trIndex];
                record._expanded = !record._expanded
            },
            // 显示层级关系的空格和图标
            spaceIconShow (index) {
                let me = this;
                if(record.children &&record.children.length > 0) {
                    return true
                }
                return false
            },
            // 点击展开和关闭的时候，图标的切换
            toggleIconShow (index, record) {
                let me = this;
                //me.treeStructure && index === 0 && record.children &&
                if(record.children &&record.children.length > 0) {
                    return true
                }
                return false
            },
        }
    }



</script>
<style scoped>
    .ms-tree-space {
        position: relative;
        top: 1px;
        display: inline-block;
        font-family: 'Glyphicons Halflings';
        font-style: normal;
        font-weight: 400;
        line-height: 1;
        width: 18px;
        height: 14px;
    }

    .ms-tree-space::before {
        content: ""
    }

    table td {
        line-height: 26px;
    }
</style>
