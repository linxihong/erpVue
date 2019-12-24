/**
* @date 2017/11/22
* @desc 权限管理 已拥有权限 模块
**/
<template>
    <el-table
            :data="data"
            :max-height="tabHeight"
            class="f-tabletree_typea console-width-12"
            :row-style="showTr">
        <el-table-column
                label="模块名称"
                class-name="f-tabletree_typeb"
                width="">
            <template slot-scope="scope">
                <span v-for="(space, levelIndex) in scope.row._level"
                      class="ms-tree-space"></span>
                <button class="button f-btnArrow is-primary is-small" v-if="toggleIconShow(scope.$index,scope.row)"
                        @click="toggle(scope.$index)">
                    <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
                    <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
                </button>
                <span v-else-if="scope.$index===0" class="ms-tree-space"></span>
                <span @click="scope.row.parentid != '0'&&getItemPermission(scope.row)" style="cursor:pointer;">{{columnDataFilter(scope,scope.row.resname)}}</span>
            </template>
        </el-table-column>

        <el-table-column
                label="权限来源"
                prop="rolename">
            <template slot-scope="scope">
                <span style="cursor:pointer;">{{scope.row.rolename}}</span>
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
                tabHeight: 610,
                checkList: [],
                ifAu: {},
                ifFlag: {},
                resultArray: {},
            }
        },
        watch: {
            'dataSource': 'setColumnArray',
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
                    let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll);
                    return data
                }
                return me.dataSource
            },
        },
        mounted () {
            this.$nextTick(()=>{
                this.jungleHeight();
            })
        },
        methods: {
            jungleHeight(){
                if(this.$store.state.resolution === 'low'){
                    this.tabHeight = 470;
                }
            },
            getItemPermission(row) {
                //this.$store.state.ItemPermissions = row;
                this.$emit('getItemPermission', row);
            },
            setColumnArray(val, oldVal) {
                let _resultArray, _ifAu = {}, _ifFlag = {};
                let _each = (obj, status) => {
                    _.each(obj, (v, k) => {
                        //var topdom = v.parents[v.parents.length-1];
                        if(v){
                            _ifAu[v.resid] = false;
                            _ifFlag[v.resid] = false;
                            if (v.parentid != 0 && v.resid != undefined ) {

                                if (v&&v.rightofusing == 1) {
                                    _ifAu[v.resid] = true;
                                    //topdom?_ifAu[topdom.resid] = true:''
                                }
                                if (v&&v.authorityflag == 1) {
                                    //_ifAu[v.resid] = true;
                                    _ifFlag[v.resid] = true;

                                    //topdom?_ifAu[topdom.resid] = true:''
                                    //topdom?_ifFlag[topdom.resid] = true:''
                                }
                                //this.resultArray[v.resid] = v;
                            }
                        }
                        if (v&&v.children) {
                            _each(v.children)
                        }
                    })
                };
                if(val&&val.length>0){
                    _each(val);

                    this.ifAu = this.deepCopy(_ifAu);
                    this.ifFlag = this.deepCopy(_ifFlag);
                    this.$emit('change', {ifAu: this.ifAu, ifFlag: this.ifFlag}, 'itempermissonparents');
                }
            },
            columnStatus(status) {
                return true
            },
            columnDataFilter(scope, column) {
                return column
            },

            ifAuSelect(type, row, scope){
                if (this.ifFlag[row.resid] == true) {
                    //this.ifAu[row.resid] = true;
                }
                this.ifAu[row.resid] == undefined ? this.ifAu[row.resid] == true : this.ifAu[row.resid] == false;
                this.selectChildren('ifAu', row.resid, this.ifAu[row.resid]);
                this.selectParent('ifAu', row, this.ifAu[row.resid]);
                this.setMsg()
            },
            ifFlagSelect(type, v) {
                this.selectChildren('ifFlag', v.resid, this.ifFlag[v.resid]);
                this.selectParent('ifFlag', v, this.ifFlag[v.resid]);
                if (type == true) {
                    this.ifAu[v.resid] = true;
                    this.selectParent('ifAu', v, this.ifAu[v.resid]);
                }
                if (v.parents) {
                    _.forEach(v.parents, v => {
                        type == true ? this.ifFlag[v.resid] = true : ''//!this.ifFlag[v.resid]
                    })
                }
                this.setMsg()
            },
            setMsg() {
                if(this.dataSource){
                    this.$emit('change', {ifAu: this.ifAu, ifFlag: this.ifFlag}, 'itempermissonparents');
                }
            },
            selectParent(type, row, status, columnVal){
                let _resultArray,
                    _result,
                    pathObj = {},
                    path = [];
                if (row.parents != undefined) {
                    _resultArray = row.parents
                }
                if (type == 'ifAu') {
                    _result = this.deepCopy(this.ifAu);
                } else if (type == 'ifFlag') {
                    _result = this.deepCopy(this.ifFlag);
                }

                let _childrenEach = (obj) => {
                    _.each(obj, (v, k) => {
                        columnVal ? _result[v.resid] = columnVal : _result[v.resid] = status == true || _result[v.resid] == true ? true : _result[v.resid]//status==true?status:true;
                        if (type == 'ifFlag') {
                            _result[v.resid] == true ? this.ifAu[v.resid] = true : '';
                        }
                    })
                };

                //单项取消,父节点判断选择
                let _singleEach = (obj, parent) => {
                    let _resultStatus = false;
                    _.each(obj, (v, k) => {
                        if (_result[v.resid] == true) {
                            _resultStatus = true;
                        }
                    });
                    _result[parent.resid] = _resultStatus;
                };


                _childrenEach(_resultArray);
                //单项选择，取消
                _.each(_resultArray, (v, k)=> {
                    _singleEach(v.children, v);
                });
                //_singleEach(_resultArray);

                if (type == 'ifAu') {
                    this.ifAu = _result;
                } else if (type == 'ifFlag') {
                    this.ifFlag = _result;
                }
            },
            selectChildren(type, id, status, columnVal){
                let _resultArray,
                    _result;
                let _each = (obj, type) => {
                    _.each(obj, (v, k) => {
                        if (_resultArray == undefined && v.resid == id) {
                            v.children ? _resultArray = v.children : '';
                        }
                        v.children ? _each(v.children) : ''
                    })
                };
                _each(this.dataSource)

                if (type == 'ifAu') {
                    _result = this.deepCopy(this.ifAu);
                } else if (type == 'ifFlag') {
                    _result = this.deepCopy(this.ifFlag);
                }

                let _childrenEach = (obj) => {
                    _.each(obj, (v, k) => {
                        columnVal ? _result[v.resid] = columnVal : _result[v.resid] = status;
                        if (type == 'ifFlag') {
                            _result[v.resid] == true ? this.ifAu[v.resid] = true : '';
                            _result[v.resid] == true ? this.selectParent('ifAu', v, this.ifAu[v.resid]) : '';
                        }
                        v.children ? _childrenEach(v.children) : ''
                    })
                };

                _childrenEach(_resultArray)

                if (type == 'ifAu') {
                    this.ifAu = _result;
                } else if (type == 'ifFlag') {
                    this.ifFlag = _result;
                }
            },
            // 显示行
            showTr: function (row, index) {
                //console.log(row);
                let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
                row._show = show
                return show ? '' : 'display:none;'
            },
            // 展开下级
            toggle: function (trIndex) {
                let me = this
                let record = me.data[trIndex];
                record ? record._expanded = !record._expanded : ''
            },
            // 显示层级关系的空格和图标
            spaceIconShow (index) {
                let me = this;
                if(record.children && record.children.length > 0) {
                    return true
                }
                return false
            },
            // 点击展开和关闭的时候，图标的切换
            toggleIconShow (index, record) {
                let me = this;
                //me.treeStructure && index === 0 && record.children &&
                if(record.children && record.children.length > 0) {
                    return true
                }
                return false
            },
        }
    }


</script>
<style scoped>

    .ms-tree-space::before {
        content: ""
    }

    table td {
        line-height: 26px;
    }
</style>
