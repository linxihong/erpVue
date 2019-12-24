/**
* @date 2017/11/22
* @desc 权限管理 已拥有权限 按钮与数据
**/
<template>
    <el-table
            :data="tableData"
            class-name="f-tabletree_typeb console-width-12"
            :row-style="showTr">
        <el-table-column
                label="按钮与数据名称"
                class-name="f-tabletree_typeb"
                width="">
            <template slot-scope="scope">
                <button class="button f-btnArrow is-primary is-small" v-if="toggleIconShow(scope.$index,scope.row)" @click="toggle(scope.$index)">
                    <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
                    <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
                </button>
                <span>{{scope.row.resname}}</span>
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
    //  import Vue from 'vue'
    export default {
        name: 'tree-grid',
        props: {
            itempermisson:{
                type: Object,
            },
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
            /*            dataSource: {
                            type: Array,
                            default: function () {
                                return []
                            }
                        },*/
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
                tableData: [],
                dataSource: [],
                checkList: [],
                ifAu: {},
                ifFlag: {},
                resultArray: {},
            }
        },
        watch: {
//            'dataSource':'setColumnArray',
            '$route': 'init',
            //'itempermisson':'init'
        },
        computed: {
            ifDisable(type, row, scope){
                /*if(type=='ifFlag'){
                 return ifAu[row.resid]!=undefined?false:true
                 }*/
                return 'disabled';

            },
        },
        mounted () {
            this.init()
        },
        methods: {
            initSelected (a,b) {
                var _ChildrenItemPermissions = this.$store.getters.ChildrenItemPermissions,
                    _resid = this.$route.query.resid;
                if(_resid&&_ChildrenItemPermissions['all_'+_resid]){
                    this.dataSource = _ChildrenItemPermissions['all_'+_resid];
                    this.tableData = Utils.MSDataTransfer.treeToArray(this.dataSource, null, null, this.defaultExpandAll);
                    this.setColumnArray (_ChildrenItemPermissions['all_'+_resid]);
                    //_ChildrenItemPermissions[_resid]
                }else{
                    this.getitempermissionlist(this.$route.query);
                }
            },
            init (a,b) {
                //this.ifAu = {};
                //this.ifFlag = {};
                if (this.$route.name=='msm_permission_detail_a') {
                    this.getitempermissionlist()
                }
            },
            getItemPermission(row) {
                this.$store.state.ItemPermissions = row;
            },
            getitempermissionlist(val){
                this.getAjax('/sys/res/selectByresId/'+ this.$route.params.id +"/"+ this.$route.params.resid ).then((result) => {
                    if (result.status == '200') {
                        this.tableData = result.data[0].list;//this.handleListToTree(result.data,{cid:'resid',labelName:'resname'});
                        //this.tableData = Utils.MSDataTransfer.treeToArray(this.dataSource, null, null, this.defaultExpandAll);
                    }
                })
            },
            setColumnArray(val, oldVal) {
                var _resultArray, _ifAu = {}, _ifFlag = {};
                var _ChildrenItemPermissions = this.$store.getters.ChildrenItemPermissions,
                    _resid = this.$route.query.resid;

                var _each = (obj, status) => {
                    _.each(obj, (v, k) => {
                        _ifAu[v.resid] = false;
                        _ifFlag[v.resid] = false;
                        //&& (v.checked == true || v.checked == 'true')
                        if (v.parentid != 0 && v.resid != undefined ) {
                            if (v&&v.rightofusing == 1) {
                                _ifAu[v.resid] = true;
                            }
                            if (v&&v.authorityflag == 1) {
                                _ifFlag[v.resid] = true;
                            }
                        }

                        /*if(_ChildrenItemPermissions[_resid]&&_ChildrenItemPermissions[_resid][v.resid]){
                            if (_ChildrenItemPermissions[_resid][v.resid].rightofusing == 1) {
                                _ifAu[v.resid] = true;
                            }
                            if (_ChildrenItemPermissions[_resid][v.resid].authorityflag == 1) {
                                _ifFlag[v.resid] = true;
                            }
                        }*/
                    })
                }
                _each(val);

                var _ChildrenItemPermissions = this.$store.getters.ChildrenItemPermissions,
                    _resid = this.$route.query.resid;

                _.each(_ChildrenItemPermissions[_resid],v=>{
                    if(v.rightofusing==1){
                        _ifAu[v.resid] = true;
                    }
                    if(v.authorityflag==1){
                        _ifFlag[v.resid] = true;
                    }
                })

                this.ifAu = this.deepCopy(_ifAu);
                this.ifFlag = this.deepCopy(_ifFlag);
            },
            getTreeResult_fromDatasource(){
                var _result = {};
                _.each(this.dataSource,v=>{
                    _result[v.resid] = v;
                })
                return _result
            },
            setMsg(type,v) {//dataSource
                var _dataSourceObj = this.getTreeResult_fromDatasource(),resultobj = {},_resultArray=[];

                _.each(this.ifAu,(v,k)=>{
                    if(v==true){
                        resultobj[k] = _dataSourceObj[k];
                        resultobj[k].rightofusing = 1;
                    }
                })

                _.each(this.ifFlag,(v,k)=>{
                    if(v==true){
                        resultobj[k] = _dataSourceObj[k];
                        resultobj[k].authorityflag = 1;
                        resultobj[k].rightofusing!=1||this.ifAu[k]!=true?resultobj[k].rightofusing = 0:'';
                    }
                })
                this.$store.commit('handleChildrenItemPermissions',{data:resultobj,type:this.$route.query.resid});
                this.$emit('change', this.$store.getters.ChildrenItemPermissions, 'itempermissonchildren');
            },
            columnStatus(status) {
                return true
            },
            columnDataFilter(scope, column) {
                return column
            },

            ifAuSelect(type, v){
                this.ifAu[v.resid] == true?this.ifAu[v.resid] = true:'';
                this.setMsg()
            },
            ifFlagSelect(type, v) {
                this.ifFlag[v.resid] == true?this.ifAu[v.resid] = true:'';
                this.setMsg()
            },
            // 显示行
            showTr: function (row, index) {
                let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
                row._show = show
                return show ? '' : 'display:none;'
            },
            // 展开下级
            toggle: function (trIndex) {
                let me = this
                let record = me.tableData[trIndex]
                record._expanded = !record._expanded
            },
            // 显示层级关系的空格和图标
            spaceIconShow (index) {
                let me = this
                if (record.children &&record.children.length > 0) {
                    return true
                }
                return false
            },
            // 点击展开和关闭的时候，图标的切换
            toggleIconShow (index, record) {
                let me = this
                //me.treeStructure && index === 0 && record.children &&
                if ( record.children &&record.children.length > 0) {
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
