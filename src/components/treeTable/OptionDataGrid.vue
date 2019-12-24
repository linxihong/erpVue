/**
* @date 2017/11/22
* @desc 权限管理 角色 赋权管理 按钮与数据
**/
<template>
    <el-table
            :data="tableData"
            border
            :max-height="tabHeight"
            class="f-tabletree_typea console-width-12"
            :row-style="showTr">
        <el-table-column
                label="按钮与数据名称"
                class-name="f-tabletree_typeb"
                width="">
            <template slot-scope="scope">
                <button class="button is-outlined is-primary is-small" v-if="toggleIconShow(scope.$index,scope.row)" @click="toggle(scope.$index)">
                    <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
                    <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
                </button>
                <span>{{columnDataFilter(scope,scope.row.resname)}}</span>
            </template>
        </el-table-column>

        <el-table-column
                label="可使用"
                width="80">
            <template slot-scope="scope">
                <el-checkbox @change="ifAuSelect('ifAu', scope.row, scope)" :disabled="scope.row.checked=='true'"
                             :checked="ifAu[scope.row.resid]" v-model='ifAu[scope.row.resid]'></el-checkbox>
            </template>
        </el-table-column>

        <el-table-column
                label="可分配"
                width="80">
            <template slot-scope="scope">
                <el-checkbox @change="ifFlagSelect(ifFlag[scope.row.resid],scope.row)" :disabled="scope.row.checked=='true'"
                             :checked="ifFlag[scope.row.resid]" v-model="ifFlag[scope.row.resid]"></el-checkbox>
                <!--v-model='ifFlag[scope.row.resid]'-->
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
                tabHeight: 610,
                tableData: [],
                dataSource: [],
                checkList: [],
                ifAu: {},
                ifFlag: {},
                resultArray: {},
                updateResids: [],
                deleteResids: []
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
           this.init();
           this.jungleHeight();
        },
        methods: {
            jungleHeight(){
                if(this.$store.state.resolution === 'low'){
                    this.tabHeight = 470;
                }
            },
            initSelected (a,b) {
                var _ChildrenItemPermissions = this.$store.getters.ChildrenItemPermissions,
                 _resid = this.$route.query.resid;
                if(_resid&&_ChildrenItemPermissions['all_'+_resid]){
                    this.dataSource = _ChildrenItemPermissions['all_'+_resid];
                    this.tableData = Utils.MSDataTransfer.treeToArray(this.dataSource, null, null, this.defaultExpandAll);
                    this.$store.state.permissionTableData = this.tableData;
                    this.setColumnArray (_ChildrenItemPermissions['all_'+_resid]);
                    //_ChildrenItemPermissions[_resid]
                }else{
                    this.getitempermissionlist(this.$route.query);
                }
            },
            init (a,b) {
                this.ifAu = {};
                this.ifFlag = {};
                if (this.$handlePageType('detail') == true) {
                    if (this.$route.query.resid!=undefined&&this.$route.query.typeid!=undefined&&this.$route.query.authorityid!=undefined){
                        this.initSelected()//this.getitempermissionlist(this.$route.query)
                    }
                }
            },
            getItemPermission(row) {
                this.$store.state.ItemPermissions = row;
            },
            getitempermissionlist(val){

                if (val){
                    this.getAjax('/sys/res/selectPermission/'+ val.resid +"/"+ val.typeid +"/"+ val.authorityid ).then((result) => {
                        //result = {"msg":"成功","data":[{"list":[{"alias":"hljt_cseeee&add","authoritydtlid":0,"authorityflag":1,"checked":"false","children":[],"createtime":"2017-09-16 00:44:52","creator":1,"defaulturl":"","depth":3,"editdate":null,"editor":0,"icon":"fa fa-drivers-license","isavailable":0,"isdisplayinmenu":0,"isfolder":2,"isopen":0,"pageNo":1,"pageSize":10,"parentid":10000001351515,"path":"","rescode":0,"resid":10000001351516,"resids":"","resname":"添加","sort":0,"systemid":10000000220101,"titleicon":""},{"alias":"hljt_cseeee&edit","authoritydtlid":0,"authorityflag":1,"checked":"false","children":[],"createtime":"2017-09-16 00:44:52","creator":1,"defaulturl":"","depth":3,"editdate":null,"editor":0,"icon":"fa fa-bathtub","isavailable":0,"isdisplayinmenu":0,"isfolder":2,"isopen":0,"pageNo":1,"pageSize":10,"parentid":10000001351515,"path":"","rescode":0,"resid":10000001351517,"resids":"","resname":"编辑","sort":0,"systemid":10000000220101,"titleicon":""}]}],"error":"","status":200}
                        if (result.status == '200') {
                            this.dataSource = result.data;//this.handleListToTree(result.data,{cid:'resid',labelName:'resname'});
                            this.tableData = Utils.MSDataTransfer.treeToArray(this.dataSource, null, null, this.defaultExpandAll);
                            this.$store.state.permissionTableData = this.tableData;
                            this.setColumnArray (this.dataSource);
                            //this.cTotal = result.data.total;
                            this.$store.commit('handleChildrenItemPermissions',{data:this.dataSource,type:'all_'+this.$route.query.resid})
                            //this.initSelected();
                        }
                    })
                }
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
                if(val&&val.length>0){
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
                }
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
                    resultobj[k]?"":resultobj[k] = _dataSourceObj[k];
                    resultobj[k].rightofusing = 0;
                    if(v==true&&_dataSourceObj[k]){
                        resultobj[k].rightofusing = 1;
                    }
                })

                _.each(this.ifFlag,(v,k)=>{
                    resultobj[k]?"":resultobj[k] = _dataSourceObj[k];
                    resultobj[k].authorityflag = 0;
                    if(v==true&&_dataSourceObj[k]){
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

            watchSelect(resid) {
                if(this.ifAu[resid]===false&&this.ifFlag[resid]===false) {
                    //deletes
                    this.deleteResids.push(resid);
                    this.updateResids = this.deleteObjfromArr(this.updateResids,resid);
                }else {
                    //updates
                    this.updateResids.push(resid);
                    this.deleteResids = this.deleteObjfromArr(this.deleteResids,resid);
                }
                this.$store.state.updateDataList = this.updateResids;
                this.$store.state.deleteDataList = this.deleteResids;
            },

            ifAuSelect(type, v){
                //this.ifAu[v.resid] == true?this.ifAu[v.resid] = true:'';
                this.setMsg();
                this.watchSelect(v.resid)
            },
            ifFlagSelect(type, v) {
                this.ifFlag[v.resid] == true?this.ifAu[v.resid] = true:'';
                this.setMsg();
                this.watchSelect(v.resid)
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
