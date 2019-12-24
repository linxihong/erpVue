/**
* @date 2017/11/22
* @desc 权限管理 账号 赋权管理 模块名称
**/
<template>
    <el-table
            :data="data"
            border
            class="f-tabletree_typea"
            style="width: 100%"
            highlight-current-row
            :row-style="showTr">
        <el-table-column
                label="模块名称"
                class-name="f-tabletree_typeb"
                width="">
            <template slot-scope="scope">
                <span v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
                <button class="button f-btnArrow is-primary is-small" v-if="toggleIconShow(scope.$index,scope.row)" @click="toggle(scope.$index)">
                    <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
                    <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
                </button>
                <span v-else-if="scope.$index===0" class="ms-tree-space"></span>
                <span @click="scope.row.parentid != '1'&&getItemPermission(scope.row)" style="cursor:pointer;">{{columnDataFilter(scope,scope.row.resname)}}</span>
            </template>
        </el-table-column>

        <el-table-column
                label="可使用"
                width="80">
            <template slot-scope="scope">
                <el-checkbox @change="ifAuSelect('ifAu', scope.row, scope)" :disabled="scope.row.parentid != '1'&&scope.row.checked=='true'"
                             v-model='ifAu[scope.row.resid]'></el-checkbox>
            </template>
        </el-table-column>

        <el-table-column
                label="可分配"
                width="80">
            <template slot-scope="scope">
                <el-checkbox @change="ifFlagSelect(ifFlag[scope.row.resid],scope.row)" :disabled="scope.row.parentid != '1'&&scope.row.checked=='true'"
                             :checked="ifFlag[scope.row.resid]" v-model="ifFlag[scope.row.resid]"></el-checkbox>
                <!--v-model='ifFlag[scope.row.resid]'-->
            </template>
        </el-table-column>

        <el-table-column
                label="禁用"
                width="80">
            <template slot-scope="scope">
                <el-checkbox @change="ifFobSelect(ifFob[scope.row.resid],scope.row)"
                             :checked="ifFob[scope.row.resid]" v-model="ifFob[scope.row.resid]"></el-checkbox>
                <!--v-model='ifFlag[scope.row.resid]'-->
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
                ifFob: {},
                resultArray: {},
                deleteResids: [],
                updateResids: [],
                deleteParents: [],
                updateParents: [],
                resultObj: {}
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
            }
        },
        methods: {
            getItemPermission(row) {
                //this.$store.state.ItemPermissions = row;
                this.$emit('getItemPermission', row);
            },
            setColumnArray(val, oldVal) {
                let _resultArray, _ifAu = {}, _ifFlag = {},_ifFob = {};
                let statusObj = {
                    _ifAu:false,
                    _ifFlag:false,
                    _ifFob:false,
                };
                let _each = (obj, status) => {
                    if(obj&&obj!=0){
                        //console.log(obj.length)
                        _.each(obj, (v, k) => {
                            var topdom = v.parents[v.parents.length-1];

                            _ifAu[v.resid] = false;
                            _ifFlag[v.resid] = false;
                            _ifFob[v.resid] = false;
                            if (v.parentid != 1 && v.resid != undefined ) {
                                if (v&&v.rightofusing == 1) {
                                    _ifAu[v.resid] = true;
                                    topdom?_ifAu[topdom.resid] = true:''
                                }
                                if (v&&v.authorityflag == 1) {
                                    _ifFlag[v.resid] = true;
                                    topdom?_ifFlag[topdom.resid] = true:''
                                }
                                if (v&&v.isavailable == 1) {
                                    _ifFob[v.resid] = true;
                                    topdom?_ifFob[topdom.resid] = true:''
                                }
                            }
                            if (v.children) {
                                _each(v.children)
                            }
                        })
                    }
                };
                if(val&&val.length>0){
                    _each(val);

                    this.ifAu = this.deepCopy(_ifAu);
                    this.ifFlag = this.deepCopy(_ifFlag);
                    this.ifFob = this.deepCopy(_ifFob);
                    this.$emit('change', {ifAu: this.ifAu, ifFlag: this.ifFlag, ifFob: this.ifFob}, 'itempermissonparents_ifFob');
                }
            },
            columnStatus(status) {
                return true
            },
            columnDataFilter(scope, column) {
                return column
            },
            //可使用
            ifAuSelect(type, row, scope){
                this.ifAu[row.resid] == undefined ? this.ifAu[row.resid] == true : this.ifAu[row.resid] == false;
                this.selectChildren('ifAu', row.resid, this.ifAu[row.resid]);
                this.selectParent('ifAu', row, this.ifAu[row.resid]);
                this.setMsg();
                this.watchSelect(row.resid);
            },
            //可分配
            ifFlagSelect(type, row) {
                this.selectChildren('ifFlag', row.resid, this.ifFlag[row.resid]);
                this.selectParent('ifFlag', row, this.ifFlag[row.resid]);
                if (type == true) {
                    this.ifAu[row.resid] = true;
                    this.selectParent('ifAu', row, this.ifAu[row.resid]);
                }
                if (row.parents) {
                    _.forEach(row.parents, row => {
                        type == true ? this.ifFlag[row.resid] = true : ''//!this.ifFlag[v.resid]
                    })
                }
                this.setMsg();
                this.watchSelect(row.resid);
            },
            //禁用
            ifFobSelect(type, row) {
                this.ifFob[row.resid] == undefined ? this.ifFob[row.resid] == true : this.ifFob[row.resid] == false;
                this.selectChildren('ifFob', row.resid, this.ifFob[row.resid]);
                let _thisrow = this.getUpdownObj(row);
                row.parentid!=1?this.handleIfAllBrothor_False(_thisrow._bros,_thisrow._parents[row.parentid]):'';
                this.setMsg();
                this.watchSelect(row.resid);
            },
            //监听select变化
            watchSelect(resid) {
                if(this.ifAu[resid]===false&&this.ifFlag[resid]===false&&this.ifFob[resid]===false) {
                    //deletes
                    this.deleteResids.push(resid);
                    //this.updateResids = this.deleteObjfromArr(this.updateResids,resid);
                    const loop = list => {
                        list.forEach(item => {
                            if(item.children.length>0) {
                                loop(item.children);
                            }
                            this.deleteResids.push(item.resid);
                            this.updateResids = this.deleteObjfromArr(this.updateResids,resid);
                        })
                    };
                    loop(this.filterArray(this.dataSource,"resid",resid).children);
                    this.deleteParents = _.initial(this.filterArray(this.dataSource,"resid",resid).parents);
                    this.watchParents('delete');
                }else {
                    //updates
                    this.updateResids.push(resid);
                    //this.deleteResids = this.deleteObjfromArr(this.deleteResids,resid);
                    const loop = list => {
                        list.forEach(item => {
                            if(item.children.length>0) {
                                loop(item.children);
                            }
                            this.updateResids.push(item.resid);
                            this.deleteResids = this.deleteObjfromArr(this.deleteResids,resid);
                        })
                    };
                    loop(this.filterArray(this.dataSource,"resid",resid).children);
                    this.updateParents = _.initial(this.filterArray(this.dataSource,"resid",resid).parents);
                    this.watchParents('update');
                }
                this.$store.state.deletesList = this.deleteResids;
                this.$store.state.updatesList = this.updateResids;
            },

            //监听父
            watchParents(type) {
                if(type === 'delete') {
                    this.deleteParents.forEach(parentitem => {
                        if(this.resultObj[parentitem.resid] == false) {
                            this.$store.state.deleteParentsList.push(parentitem.resid)
                        }
                    })
                }else {
                    this.updateParents.forEach(parentitem => {
                        if(this.resultObj[parentitem.resid] == true) {
                            this.$store.state.updateParentsList.push(parentitem.resid);
                        }
                    })
                }
            },

            handleIfAllBrothor_False(row,parentrow){
                if(!row==false){
                    let _parentStatus = true;
                    for(let i in row){
                        //检查禁用
                        if(this.ifFob[i] == false||this.ifFob[i] == undefined){
                            _parentStatus = false;
                        }
                    }
                    //父节点禁用赋值
                    this.ifFob[parentrow.resid] = _parentStatus;

                    if(parentrow.parentid!=1){
                        let _thisrow = this.getUpdownObj(parentrow);
                        this.handleIfAllBrothor_False(_thisrow._bros,_thisrow._parents[parentrow.parentid])
                    }
                }
            },
            getUpdownObj(row){
                let _parents = {}
                let _children = {}
                let _bros = {}
                let _each = (_array)=>{
                    _array.forEach(item=>{
                        //brother
                        if(row.parentid==item.parentid){
                            _bros[item.resid] = item;
                        }
                        //parents
                        if(row.parentid==item.resid){
                            _parents[item.resid] = item;
                        }
                        //children
                        if(row.resid==item.parentid){
                            _children[item.resid] = item;
                        }
                        if(item.children&&item.children.length>0){
                            _each(item.children);
                        }
                    })
                };
                if (this.dataSource&&this.dataSource.length>0){
                    this.dataSource.forEach(item =>{
                        _each(item.children);
                        if(item.resid==row.parentid){
                            _parents[item.resid] = this.dataSource[0];
                        }
                    })
                }

                return {_parents:_parents,_children:_children,_bros:_bros}
            },
            setMsg() {
                this.$emit('change', {ifAu: this.ifAu, ifFlag: this.ifFlag, ifFob: this.ifFob}, 'itempermissonparents_ifFob');
                /*if(type==true){
                 v.type = 1;
                 this.resultArray[v.resid] = v;
                 this.$emit('change',this.resultArray,'itempermissonparents');
                 }*/
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
                    this.resultObj = _result;
                } else if (type == 'ifFlag') {
                    _result = this.deepCopy(this.ifFlag);
                    this.resultObj = _result;
                } else if (type == 'ifFob') {
                    _result = this.deepCopy(this.ifFob);
                    this.resultObj = _result;
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
                }else if (type == 'ifFob') {
                    this.ifFob = _result;
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
                }else if (type == 'ifFob') {
                    _result = this.deepCopy(this.ifFob);
                }

                let _childrenEach = (obj) => {
                    _.each(obj, (v, k) => {
                        //后台传值为字符类型，不是Boolean类型
                        if (v.checked =='false'){
                            columnVal ? _result[v.resid] = columnVal : _result[v.resid] = status;
                            if (type == 'ifFlag') {
                                _result[v.resid] == true ? this.ifAu[v.resid] = true : '';
                                _result[v.resid] == true ? this.selectParent('ifAu', v, this.ifAu[v.resid]) : '';
                            }
                        }
                        v.children ? _childrenEach(v.children) : ''
                    })
                };

                _childrenEach(_resultArray)

                if (type == 'ifAu') {
                    this.ifAu = _result;
                } else if (type == 'ifFlag') {
                    this.ifFlag = _result;
                }else if (type == 'ifFob') {
                    this.ifFob = _result;
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
                let record = me.data[trIndex]
                record._expanded = !record._expanded
            },
            // 显示层级关系的空格和图标
            spaceIconShow (index) {
                let me = this;
                if (record.children && record.children.length > 0) {
                    return true
                }
                return false
            },
            // 点击展开和关闭的时候，图标的切换
            toggleIconShow (index, record) {
                let me = this;
                //me.treeStructure && index === 0 && record.children &&
                if (record.children && record.children.length > 0) {
                    return true
                }
                return false
            },
        }
    }


</script>
<style lang="less" type="text/less" scoped>
    .ms-tree-space{
      width: 30px;
    }
    .ms-tree-space::before {
        content: ""
    }

    table td {
        line-height: 26px;
    }
    tbody .f-tabletree_typeb{
        .cell{
            padding: 0;
        }
    }
    .f-tabletree_typea{
        &.el-table .cell{
            //padding: 0;
        }
         .f-btnArrow,.f-btnArrow:active{
             border: 0;
             outline: 0;
             background-color: transparent;
         }
    }
</style>
