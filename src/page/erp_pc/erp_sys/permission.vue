<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content f-doubleblock">
            <div class="left-block percent">
                <el-select v-model="permissionType" class="console-p2 f-db f-tac" @change="handleChangePermissionType">
                    <el-option
                            v-for="item in permissionTypesOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value.toString()">
                    </el-option>
                </el-select>
                <el-input v-model="searchName" class="permission-search-input" :placeholder="placeholder"  @keyup.enter.native="searchItem"></el-input>
                <el-button @click="searchItem">查询</el-button>
                <el-button @click="resetList">重置</el-button>
                <div class="scroll-tree scrollBar tree-heightIII">
                    <el-tree
                        v-if="isTree"
                        class="render-tree"
                        :data="treeOptions"
                        node-key="id"
                        :default-expanded-keys="treeExpandeds"
                        :expand-on-click-node="false"
                        :props="defaultProps"
                        @node-click="handleNodeClick"
                        :render-content="handleTreerender__permission"
                        :highlight-current="true">
                    </el-tree>
                </div>
            </div>
            <div class="right-block system-block" v-if="$route.name=='msm_permission'||$route.name=='msm_permission_detail'||$route.name=='msm_permission_detail_a'">
                <div class="rightDivI">
                    <div class="right-contentI">
                        <div class="right-header console-pt5 console-pb5">
                            <div class="console-title console-ml10">
                                <span class="color-12 ui-font">权限管理</span>
                            </div>
                        </div>
                        <div class="right-body">
                            <el-tabs v-model="activeName" @tab-click="handleClick">
                                <el-tab-pane label="赋权" name="first">
                                    <div>
                                        <!--角色-->
                                        <el-button class="ui-color3" v-auth="ifHasAuth('save')" @click="ifHasAuth('save')&&newSavePermission()" v-if="$route.params.id&&$route.query.typeid!='2'">保存</el-button>
                                        <!--账号-->
                                        <el-button class="ui-color3" v-auth="ifHasAuth('save')" @click="ifHasAuth('save')&&newSavePermission()" v-if="$route.params.id&&$route.query.typeid=='2'">保存</el-button>
                                        <permissionRolePicker v-if="$route.params.id&&$route.query.typeid=='2'" style="display: inline-block;"></permissionRolePicker>
                                    </div>
                                    <el-row :gutter="10">
                                        <el-col :span="ifItemPermissWidth">
                                            <div class="system-tree scrollBar" v-if="isShowTreeGrid">
                                                <!--角色-->
                                                <tree-grid v-if="$route.query.typeid!=2" @getItemPermission="getItemPermission" :columns="columns" :tree-structure="true" :data-source="dataSource" @change='getTreeResult_forParents'></tree-grid>
                                                <!--账号-->
                                                <tree-gridb v-if="$route.query.typeid==2" @getItemPermission="getItemPermission" :columns="columns" :tree-structure="true" :data-source="dataSource" @change='getTreeResult_forParents_iffob'></tree-gridb>
                                            </div>
                                        </el-col>
                                        <el-col :span="24 - ifItemPermissWidth" v-if="itemPermissons.resid">
                                            <div v-if="isShowTreeGrid">
                                                <OptionDataGrid v-if="$route.query.typeid!=2" :itempermisson="itemPermissons" :columns="columns" :tree-structure="true" @change='getTreeResult_forChildren'></OptionDataGrid>
                                                <OptionDataGridb v-if="$route.query.typeid==2" :itempermisson="itemPermissons" :columns="columns" :tree-structure="true" @change='getTreeResult_forChildren_iffob'></OptionDataGridb>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </el-tab-pane>
                                <el-tab-pane label="已拥有权限" name="second" v-if="permissionType=='2'">
                                    <el-row :gutter="10">
                                        <el-col :span="ifItemPermissWidth">
                                            <existedPermissionTable @change="getExistedPermissionTreeResult" @getItemPermission="getItemPermission_b" :tree-structure="true" :dataSource="ExistedTableData"></existedPermissionTable>
                                        </el-col>
                                        <el-col :span="24 - ifItemPermissWidth" v-if="itemPermissons.resid">
                                            <existedPermissionTableReadonly :itempermisson="itemPermissons" :columns="columns" :tree-structure="true" @change='getTreeResult_forChildren'></existedPermissionTableReadonly>
                                        </el-col>
                                    </el-row>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-block system-block" v-if="$route.name=='msm_permission_add'||$route.name=='msm_permission_edit'">
                <div class="rightDivI">
                    <div class="right-contentI">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="es6">
    export default {
        data () {
            return {
                activeName: 'first',
                //已拥有角色权限
                hasPermissionColumns: [],
                hasPermissionDataSource: [],
                hasPermissionColumnsResult: [],
                //账号赋权
                columns: [],
                columnsResult: [],
                dataSource: [],
                dataSourcelist: [],
                treeGridResult: [],
                permissionTypesOptions: [{
                    value: '1',
                    label: '角色'
                }, {
                    value: '2',
                    label: '账号'
                }],
                detailId: '',
                permissionType: '1',
                lastpermissionType: '1',
                filterform: {
                    rolename: '',
                    allowdel: '',
                    allowedit: '',
                    enabled: ''
                },
                tableData: [],
                ExistedTableData: [],

                treeOptions: [],
                treeExpandeds: [],
                defaultProps: {
                    children: 'children',
                    label: 'rolename'
                },
                itemPermissons:{},
                itempermissonparents:[],
                itempermissonchildren:[],
                searchName:null,
                isTree:true,
                isShowTreeGrid:false,
                placeholder:'角色名称'
            }
        },
        mounted () {
            this.init();
            this.getAuthlist();
        },
        computed: {
            ifItemPermissWidth(type, row, scope){
                if (this.itemPermissons.resid){
                    return 12
                }else{
                    return 24
                }
            },
        },
        watch: {
            '$route':'init',
            '$store.state.updatesList':'updateNoRepeat',
            '$store.state.updateParentsList':'updateNoRepeat',
            '$store.state.updateDataList':'updateNoRepeat',
            '$store.state.deletesList':'deleteNoRepeat',
            '$store.state.deleteParentsList':'deleteNoRepeat',
            '$store.state.deleteDataList':'deleteNoRepeat'
            //'$route.params.id':'init'
        },
        methods: {
            //初始化
            init (a,b) {
                this.itemPermissons = {};
                this.detailStatus = this.$route.params.id;
                this.$route.query.typeid?this.permissionType = this.$route.query.typeid.toString():'';
                this.getlist();
                if (this.$handlePageType('detail') == true) {
                    this.detailId = this.$route.params.id;
                    this.itemPermissons.resid = this.$route.query.resid;
                    if((a!=undefined&&b!=undefined&&a.path!=b.path)||(a==undefined&&b==undefined)){
                        //this.$route.name!='msm_permission_detail_a'?this.getpermissionlist():'';
                        if (this.$route.name!='msm_permission_detail_a'&&this.activeName === 'second' ){
                            this.getExistedPermissionlist()
                        }else if(this.$route.name!='msm_permission_detail_a'&&this.activeName === 'first'){
                            this.getpermissionlist()
                        }
                    }
                }
            },
            //选择角色/账号
            handleChangePermissionType(val) {
                this.searchName = null;
                this.activeName = 'first';
                this.dataSource = [];
                this.$routeTo( "msm_permission", {}, {typeid:this.permissionType});
                if(val === "2") {
                    this.placeholder = "账号名(英文)"
                }else {
                    this.placeholder = "角色名称"
                }
                // if(this.detailId){
                // }else{
                //     this.$routeTo( "msm_permission", {}, {typeid:this.permissionType})
                // }
            },
            //已拥有权限
            getItemPermission_b(row) {
                if (row){
                    row.typeid=this.permissionType;
                    row.authorityid=this.detailId;
                    this.$routeTo( "msm_permission_detail_a", {id: this.detailId,resid:row.resid},
                        {resid:row.resid,typeid:this.permissionType,authorityid:this.detailId})
                }
            },
            //获取数据权限
            getItemPermission(row) {
                if (row){
                    row.typeid=this.permissionType;
                    row.authorityid=this.detailId;
                    this.$routeTo( "msm_permission_detail", {id: this.detailId},
                        {resid:row.resid,typeid:this.permissionType,authorityid:this.detailId})
                }
            },
            //tab切换
            handleClick(tab, event) {
                if (this.activeName === 'second' ){
                    this.getExistedPermissionlist()
                }else if(this.activeName === 'first' ){
                    this.getpermissionlist()
                }
            },
            //已拥有角色权限 计算需要提交的结果
            getExistedPermissionTreeResult(result,type) {
                var _resultArray=[];
                if (!_.isEmpty(result)){
                    _.each(result, (v,k)=>{
                        _resultArray.push({"systemid":v.systemid,"authoritytypeid":this.detailId,"authorityflag":v.type,"resid":k})
                    })
                }
                this.hasPermissionColumnsResult= _resultArray;
                this.columnsResult= null;
            },
            //账号赋权 计算需要提交的结果
            getTreeResult_fromDatasource(){
                var _result = {};
                _.each(this.dataSourcelist,v=>{
                    _.each(v.list,vl=>{
                        vl?_result[vl.resid] = vl:'';
                    })
                });
                return _result
            },
            getTreeResult_forParents_iffob(result,type){
                var _dataSourceObj = this.getTreeResult_fromDatasource(),resultobj = {},_resultArray=[];

                //ifAu
                _.each(result.ifAu,(v,k)=>{
                    if(v==true){
                        resultobj[k]?'':resultobj[k] = _dataSourceObj[k];
                        resultobj[k].rightofusing = 1;
                    }
                });
                //ifFlag
                _.each(result.ifFlag,(v,k)=>{
                    if(v==true){
                        resultobj[k]?'':resultobj[k] = _dataSourceObj[k];
                        resultobj[k].authorityflag = 1;
                       // resultobj[k].rightofusing!=1||result.ifAu[k]!=true?resultobj[k].rightofusing = 0:'';
                    }
                });
                //ifFob
                _.each(result.ifFob,(v,k)=>{
                    if(v==true){
                        resultobj[k]?'':resultobj[k] = _dataSourceObj[k];
                        resultobj[k].isavailable = 1;
                    }
                });

                this.itempermissonparents = resultobj;

                if (!_.isEmpty(this.itempermissonparents)){
                    _.each(this.itempermissonparents, (v,k)=>{
                        if(v.depth!=1||v.parentid!=1){
                            result.ifAu[k]==false?v.rightofusing=0:'';
                            result.ifFlag[k]==false?v.authorityflag=0:'';
                            result.ifFob[k]==false?v.isavailable=0:'';
                            if(v&&v.rightofusing==1||v.authorityflag==1||v.isavailable==1){
                                _resultArray.push({"authorityid":this.$route.params.id,"userid":this.$route.params.id,"systemid":v.systemid,"authoritytypeid":this.detailId,"authorityflag":v.authorityflag,"isavailable":v.isavailable,"rightofusing":v.rightofusing,"resid":k})
                            }
                        }
                    })
                }
                if (!_.isEmpty(this.itempermissonchildren)){
                    _.each(this.itempermissonchildren, (v,k)=>{
                        if(v&&v.depth!=1||v.parentid!=1){
                            result.ifAu[k]==false?v.rightofusing=0:'';
                            result.ifFlag[k]==false?v.authorityflag=0:'';
                            result.ifFob[k]==false?v.isavailable=0:'';
                            if(v&&v.rightofusing==1||v.authorityflag==1||v.isavailable==1){
                                _resultArray.push({"authorityid":this.$route.params.id,"userid":this.$route.params.id,"systemid":v.systemid,"authoritytypeid":this.detailId,"authorityflag":v.authorityflag,"isavailable":v.isavailable,"rightofusing":v.rightofusing,"resid":k})
                            }
                        }
                    })
                }
                this.columnsResult= _resultArray;
                this.hasPermissionColumnsResult= null;
            },
            getTreeResult_forParents(result,type){
                var _dataSourceObj = this.getTreeResult_fromDatasource(),resultobj = {},_resultArray=[];
                //ifAu
                _.each(result.ifAu,(v,k)=>{
                    resultobj[k]?'':resultobj[k] = _dataSourceObj[k];
                    resultobj[k].rightofusing = 0;
                    if(v==true){
                        resultobj[k].rightofusing = 1;
                    }
                });
                //ifFlag
                _.each(result.ifFlag,(v,k)=>{
                    resultobj[k]?'':resultobj[k] = _dataSourceObj[k];
                    resultobj[k].authorityflag = 0;
                    if(v==true){
                        if (resultobj[k]){
                            resultobj[k].authorityflag = 1;
                            resultobj[k].rightofusing!=1||result.ifAu[k]!=true?resultobj[k].rightofusing = 0:'';
                        }
                    }
                });

                this.itempermissonparents = resultobj;

                if (!_.isEmpty(this.itempermissonparents)){
                    _.each(this.itempermissonparents, (v,k)=>{
                        if(v&&(v.depth!=1||v.parentid!=1)){
                            if(v.authorityflag==1||v.rightofusing==1){
                                _resultArray.push({
                                    "systemid":v.systemid,
                                    "authoritytypeid":this.detailId,
                                    "authorityflag":v.authorityflag,
                                    "rightofusing":v.rightofusing,
                                    "resid":k
                                })
                            }
                        }
                    })
                }
                if (!_.isEmpty(this.itempermissonchildren)){
                    _.each(this.itempermissonchildren, (v,k)=>{
                        if(v&&(v.depth!=1||v.parentid!=1)){
                            if(v.authorityflag==1||v.rightofusing==1){
                                _resultArray.push({
                                    "systemid":v.systemid,
                                    "authoritytypeid":this.detailId,
                                    "authorityflag":v.authorityflag,
                                    "rightofusing":v.rightofusing,
                                    "resid":k
                                })
                            }
                        }
                    })
                }

                this.columnsResult= _resultArray;
                this.hasPermissionColumnsResult= null;
            },
            getTreeResult_forChildren(result,type){
                var _resultArray=[],resultobj={};

                _.each(result,subauthitems=>{
                    _.each(subauthitems,v=>{
                        if(v.authorityflag==1||v.rightofusing==1){
                            resultobj[v.resid] = v;
                        }
                    })
                });

                this.itempermissonchildren = resultobj;

                if (!_.isEmpty(this.itempermissonparents)){
                    _.each(this.itempermissonparents, (v,k)=>{
                        if(v&&(v.depth!=1&&v.parentid!=1)){
                            if(v.authorityflag==1||v.rightofusing==1){
                                _resultArray.push({
                                    "systemid":v.systemid,
                                    "authoritytypeid":this.detailId,
                                    "authorityflag":v.authorityflag,
                                    "rightofusing":v.rightofusing,
                                    "resid":k
                                })
                            }
                        }
                    })
                }
                if (!_.isEmpty(this.itempermissonchildren)){
                    _.each(this.itempermissonchildren, (v,k)=>{
                        if(v&&(v.depth!=1||v.parentid!=1)){
                            if(v.authorityflag==1||v.rightofusing==1){
                                _resultArray.push({
                                    "systemid":v.systemid,
                                    "authoritytypeid":this.detailId,
                                    "authorityflag":v.authorityflag,
                                    "rightofusing":v.rightofusing,
                                    "resid":k
                                })
                            }
                        }
                    })
                }

                this.columnsResult= _resultArray;
                this.hasPermissionColumnsResult= null;
            },
            getTreeResult_forChildren_iffob(result,type){
                var _resultArray=[],resultobj={};
                _.each(result,subauthitems=>{
                    _.each(subauthitems,v=>{
                        if(v.authorityflag==1||v.isavailable==1||v.rightofusing==1){
                            resultobj[v.resid] = v;
                        }
                    })
                });

                this.itempermissonchildren = resultobj;

                if (!_.isEmpty(this.itempermissonparents)){
                    _.each(this.itempermissonparents, (v,k)=>{
                        if(v.depth!=1||v.parentid!=1){
                            if(v.authorityflag==1||v.rightofusing==1||v.isavailable==1){
                                _resultArray.push({
                                    "authorityid":this.$route.params.id,
                                    "userid":this.$route.params.id,
                                    "systemid":v.systemid,
                                    "authoritytypeid":this.detailId,
                                    "authorityflag":v.authorityflag,
                                    "rightofusing":v.rightofusing,
                                    "isavailable":v.isavailable,
                                    "resid":k
                                })
                            }
                        }
                    })
                }
                if (!_.isEmpty(this.itempermissonchildren)){
                    _.each(this.itempermissonchildren, (v,k)=>{
                        if(v.depth!=1||v.parentid!=1){
                            if(v.authorityflag==1||v.rightofusing==1||v.isavailable==1){
                                _resultArray.push({
                                    "authorityid":this.$route.params.id,
                                    "userid":this.$route.params.id,
                                    "systemid":v.systemid,
                                    "authoritytypeid":this.detailId,
                                    "authorityflag":v.authorityflag,
                                    "rightofusing":v.rightofusing,
                                    "isavailable":v.isavailable,
                                    "resid":k
                                })
                            }
                        }
                    })
                }

                this.columnsResult= _resultArray;
                this.hasPermissionColumnsResult= null;
            },
            //获取角色或者账户的列表
            getlist(){
                if(this.permissionType=='1'){
                    this.getrolelist();
                }else if(this.permissionType=='2'){
                    this.getuserlist();
                }
                this.lastpermissionType = this.deepCopy(this.permissionType)[0]
            },
            searchItem() {
                this.isShowTreeGrid = false;
                if(this.permissionType=='1'){
                    this.searchRole(this.searchName);
                }else if(this.permissionType=='2'){
                    this.searchAccount(this.searchName);
                }
                this.lastpermissionType = this.deepCopy(this.permissionType)[0]
            },
            resetList() {
                this.isTree = false;
                this.searchName = null;
                setTimeout(() => {
                    this.searchItem();
                    this.$routeTo( "msm_permission");
                    this.isTree = true;
                })
            },
            //查询角色
            searchRole(val) {
                this.fetch('/sys/role/getList',{rolename:val}).then((result) => {
                    if (result.status == '200') {
                        result.data.length!=0?this.treeOptions = this.handleListToTree(result.data,{cid:'roleid',labelName:'rolename',type:'permission'}):'';
                        result.data.length!=0?this.treeExpandeds=[this.treeOptions[0].roleid]:'';
                        if(result.data[0]&&result.data[0].roleid&&this.$route.name=='msm_permission'){
                            this.$routeTo( "msm_permission_detail", {id: result.data[0].roleid})
                        }
                    }
                })
            },
            //查询账号
            searchAccount(val) {
                this.fetch('/sys/user/getList',{account:val}).then((result) => {
                    if (result.status == '200') {
                        for(let i = 0; i<result.data.length; i++){
                            result.data[i].accountFullname = result.data[i].account + '(' + result.data[i].fullname + ')';
                        }
                        result.data.length !==0 ? this.treeOptions = this.handleListToTree(result.data,{cid:'userid',labelName:'accountFullname',type:'permission'}):'';
                        result.data.length !==0 ? this.treeExpandeds=[this.treeOptions[0].userid]:'';
                        if(result.data[0]&&result.data[0].userid&&this.$route.name=='msm_permission'){
                            this.$routeTo( "msm_permission_detail", {id: result.data[0].userid},{typeid:2})
                        }
                    }
                })
            },
            //获取角色
            getrolelist(){
                if (_.isEmpty(this.treeOptions)||this.lastpermissionType!=this.permissionType){
                    this.treeOptions = [{}];
                    this.fetch('/sys/role/getList',{}).then((result) => {
                        if (result.status == '200') {
                            result.data.length!=0?this.treeOptions = this.handleListToTree(result.data,{cid:'roleid',labelName:'rolename',type:'permission'}):'';
                            result.data.length!=0?this.treeExpandeds=[this.treeOptions[0].roleid]:'';
                            if(result.data[0]&&result.data[0].roleid&&this.$route.name=='msm_permission'){
                                this.$routeTo( "msm_permission_detail", {id: result.data[0].roleid})
                            }
                        }
                    })
                }
            },
            //获取账号
            getuserlist(){
                if (_.isEmpty(this.treeOptions)||this.lastpermissionType!=this.permissionType){
                    this.treeOptions = [{}];
                    this.fetch('/sys/user/getList',{}).then((result) => {
                        if (result.status == '200') {
                            for(let i = 0; i<result.data.length; i++){
                                result.data[i].accountFullname = result.data[i].account + '(' + result.data[i].fullname + ')';
                            }
                            result.data.length !==0 ? this.treeOptions = this.handleListToTree(result.data,{cid:'userid',labelName:'accountFullname',type:'permission'}):'';
                            result.data.length !==0 ? this.treeExpandeds=[this.treeOptions[0].userid]:'';
                            if(result.data[0]&&result.data[0].userid&&this.$route.name=='msm_permission'){
                                this.$routeTo( "msm_permission_detail", {id: result.data[0].userid},{typeid:2})
                            }
                        }
                    })
                }
            },
            //获取权限点
            getpermissionlist(){
                if (this.detailId){
                    this.getAjax('/sys/res/selectAu/'+this.permissionType+"/"+this.detailId).then((result) => {
                        if (result.status == '200'&&result.data) {
                            //this.userorgTableData = result.data.list;
                            _.each(result.data, v=>{
                                v.list = this.gettreeparentandchildren(v.list)
                            })
                            this.dataSourcelist = result.data;//result.data[0].list;
                            this.dataSource = this.handleListToTree(result.data,{cid:'resid',labelName:'resname'});
                            //console.log(this.dataSource)
                            this.cTotal = result.data.total;
                        }
                    })
                }
            },
            gettreeparentandchildren(list){
                var _childrenobject = {};
                var _parentsobject = {};
                var traverseDFparents = (node,nodeList)=>{
                    if(node.parentid&&_parentsobject[node.parentid]&&node.parentid!=1){
                        nodeList.push(_parentsobject[node.parentid]);
                        traverseDFparents(_parentsobject[node.parentid],nodeList)
                    }
                };
                var traverseDFchildren = (node,nodeList)=>{
                    _.each(list,v =>{
                        if (v.parentid==node.resid){
                            nodeList.push(v)
                        }
                    })
                };
                _.each(list,v =>{
                    v.resid!=1?_parentsobject[v.resid] = v:'';
                });
                _.each(list,v =>{
                    v.parents = [];
                    //v.children = [];
                    traverseDFparents(v, v.parents);
                    //traverseDFchildren(v, v.children);
                });
                return list
            },
            //获取已拥有角色权限
            getExistedPermissionlist(){
                this.ExistedTableData = [];
                this.getAjax('/sys/res/selectAllRes/'+this.detailId).then((result) => {
                    if (result.status == '200') {
                        this.ExistedTableData = this.handleListToTree(result.data,{cid:'resid',labelName:'resname'});
                    }
                });
                if (this.permissionType=='2'&&(_.isEmpty(this.ExistedTableData)||this.lastpermissionType!=this.permissionType)){

                }
            },
            //保存角色授权
            onSubmitAdd(formName) {
                var _params=[],_columnsResult;
                if (this.columnsResult){
                    _columnsResult = this.columnsResult
                }else if (this.hasPermissionColumnsResult){
                    _columnsResult = this.hasPermissionColumnsResult
                }
                if (!_.isEmpty(_columnsResult)) {
                    _.each(_columnsResult,(v,k)=>{
                        _params.push(v)
                    });
                    this.fetch('/sys/suthority/saveres', _params).then((result) => {
                        this.$handleRes(result);
                        if (result.status == '200') {
                            this.init();
                            this.$store.state.ChildrenItemPermissions = {};
                            this.$store.commit('handleChildrenItemPermissions',{type:'clean'});
                        }
                    })
                }else if (_.isEmpty(_columnsResult)){
                    this.getAjax('/sys/suthority/removeall/'+this.$route.params.id).then((result) => {
                        this.$handleRes(result);
                        if(result.status=='200'){
                            this.init();
                            this.$store.state.ChildrenItemPermissions = {};
                            this.$store.commit('handleChildrenItemPermissions',{type:'clean'});
                        }
                    })
                }
            },
            //保存账号授权
            /**
             * rightofusing  是否可用
             * authorityflag 是否可授权
             * */
            onSubmitAdd_iffob(formName) {
                var _params=[],_columnsResult;
                if (this.columnsResult){
                    _columnsResult = this.columnsResult
                }else if (this.hasPermissionColumnsResult){
                    _columnsResult = this.hasPermissionColumnsResult
                }
                if (!_.isEmpty(_columnsResult)) {
                    _.each(_columnsResult,(v,k)=>{
                        _params.push(v)
                    });
                    this.fetch('/sys/authoritydetail/save', _params).then((result) => {
                        this.$handleRes(result);
                        if (result.status == '200') {
                            //this.$routeTo('msm_permission');
                            this.init()
                            this.$store.state.ChildrenItemPermissions = {};
                            this.$store.commit('handleChildrenItemPermissions',{type:'clean'});
                        }
                    })
                }else if (_.isEmpty(_columnsResult)){
                    this.getAjax('/sys/authoritydetail/removeall/'+this.$route.params.id).then((result) => {
                        this.$handleRes(result);
                        if(result.status=='200'){
                            this.init()
                            this.$store.state.ChildrenItemPermissions = {};
                            this.$store.commit('handleChildrenItemPermissions',{type:'clean'});
                        }
                    })
                }
            },
            //赋值并去重
            updateNoRepeat() {
                this.$store.state.updatesLastList = Array.from(new Set([...this.$store.state.updatesList, ...this.$store.state.updateParentsList,...this.$store.state.updateDataList]));
                this.$store.state.deletesLastList = this.compareArr(this.$store.state.updatesLastList,this.$store.state.deletesLastList)
            },
            deleteNoRepeat() {
                this.$store.state.deletesLastList = Array.from(new Set([...this.$store.state.deletesList, ...this.$store.state.deleteParentsList,...this.$store.state.deleteDataList]));
                this.$store.state.updatesLastList = this.compareArr(this.$store.state.deletesLastList,this.$store.state.updatesLastList)
            },
            /************新接口保存账号/角色授权************/
            newSavePermission() {
                if(this.$route.query.typeid == '2') {
                    //账号
                    let lastUpadteList = [],lastDeleteList = [];
                    this.$store.state.updatesLastList.forEach(item => {
                        let detailItem = this.filterArray(Array.from(new Set([...this.dataSource,...this.$store.state.permissionTableData])),"resid",item);
                        let obj = {};
                        obj.authoritydtlid = detailItem.authoritydtlid;
                        if(detailItem.authoritydtlid === 0){obj.authoritydtlid = null}
                        obj.authorityid = this.$route.params.id;
                        obj.userid = this.$route.params.id;
                        obj.systemid = detailItem.systemid;
                        obj.authorityflag = detailItem.authorityflag;
                        obj.rightofusing = detailItem.rightofusing;
                        obj.isavailable = detailItem.isavailable;
                        obj.resid = detailItem.resid;
                        obj.resname = detailItem.resname;
                        lastUpadteList.push(obj)
                    });
                    this.$store.state.deletesLastList.forEach(item => {
                        let detailItem = this.filterArray(this.dataSource,"resid",item);
                        let detailTableItem = this.filterArray(this.$store.state.permissionTableData,"resid",item);
                        let obj = {};
                        if(detailItem.authoritydtlid) {
                            obj.authoritydtlid = detailItem.authoritydtlid;
                            lastDeleteList.push(obj.authoritydtlid);
                        }
                        if(detailTableItem.authoritydtlid) {
                            obj.authoritydtlid = detailTableItem.authoritydtlid;
                            lastDeleteList.push(obj.authoritydtlid);
                        }
                    });
                    this.fetch("/sys/authoritydetail/user-auth-cud",{deletes:_.compact(lastDeleteList),updates:lastUpadteList})
                        .then(result => {
                            if(result.status === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '操作成功'
                                })
                            }else {
                                this.$message({
                                    type: 'warning',
                                    message: this.returnIntercept(result)
                                })
                            }
                        })
                        .then(() => {
                            this.resetTreeGridb();
                        })
                }else {
                    //角色
                    let roleUpadteList = [], roleDeleteList = [];
                    this.$store.state.updatesLastList.forEach(item => {
                        let detailItem = this.filterArray(Array.from(new Set([...this.dataSource,...this.$store.state.permissionTableData])),"resid",item);
                        let obj = {};
                        obj.authorityid = detailItem.authorityid;
                        if(detailItem.authorityid === 0){obj.authorityid = null}
                        obj.authoritytypeid = this.$route.params.id;
                        obj.systemid = detailItem.systemid;
                        obj.authorityflag = detailItem.authorityflag;
                        obj.rightofusing = detailItem.rightofusing;
                        obj.resid = detailItem.resid;
                        obj.resname = detailItem.resname;
                        roleUpadteList.push(obj)
                    });
                    this.$store.state.deletesLastList.forEach(item => {
                        let detailItem = this.filterArray(this.dataSource,"resid",item);
                        let detailTableItem = this.filterArray(this.$store.state.permissionTableData,"resid",item);
                        let obj = {};
                        if(detailItem.authorityid) {
                            obj.authorityid = detailItem.authorityid;
                            roleDeleteList.push(obj.authorityid);
                        }
                        if(detailTableItem.authorityid) {
                            obj.authorityid = detailTableItem.authorityid;
                            roleDeleteList.push(obj.authorityid);
                        }
                    });
                    this.fetch("/sys/suthority/saveres",{deletes:_.compact(roleDeleteList),updates:roleUpadteList})
                        .then(result => {
                            if(result.status === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '操作成功'
                                })
                            }else {
                                this.$message({
                                    type: 'warning',
                                    message: this.returnIntercept(result)
                                })
                            }
                        })
                        .then(() => {
                            this.resetTreeGridb();
                        })
                }
            },
            //子树点击
            handleNodeClick(data, node, el) {
                this.isShowTreeGrid = true;
                this.$store.commit('handleChildrenItemPermissions',{type:'clean'});
                if(this.permissionType=='1'){
                    this.$routeTo( "msm_permission_detail", {id: node.data.roleid})
                }else if(this.permissionType=='2'){
                    this.$routeTo( "msm_permission_detail", {id: node.data.userid},{typeid:this.permissionType})
                }
                
            },
            //重置treeGridb
            resetTreeGridb() {
                this.getpermissionlist();
                this.$store.state.updatesList = [];
                this.$store.state.deletesList = [];
                this.$store.state.updateDataList = [];
                this.$store.state.deleteDataList = [];
                this.$store.state.updateParentsList = [];
                this.$store.state.deleteParentsList = [];
                this.$store.state.permissionTableData = [];
                this.searchItem();
                this.isShowTreeGrid = false;
            }
        }
    }


</script>
