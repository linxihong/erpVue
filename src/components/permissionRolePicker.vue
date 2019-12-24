/**
* @date 2017/11/22
* @desc 权限管理 角色选择器
**/
<template>
    <div class="m-userPickerVisible">
        <!--    v-auth="ifHasAuth('accountallocation')"  v-auth="ifHasAuth('accountallocation')"-->
        <el-button class="ui-color2" @click="handleOpen()">{{btnText}}</el-button>
        <el-dialog
                class="dialogDiv dialogDivII"
                :top = "dialog_top"
                :show-close="false"
                :visible.sync="rolePickerVisible"
                size="small"
                :before-close="handleClose">
            <div class="slideContent leftOffsetIII" v-drag1>
                <div class="leftDiv">
                    <el-button class="icon-setting-2 icon-close" @click="handleClose"></el-button>
                    <el-button class="icon-setting-1 icon-confirm" @click="setAdd"></el-button>
                </div>
                <div class="slideTop">角色列表</div>

                <div class="slideMid">
                    <el-card class="box-card del-shadow">
                        <div class="console-m2">
                            <el-input v-model="search" placeholder="角色名称" icon="search" style="width: 50%;"></el-input>
                        </div>
                        <el-table
                                ref="multipleTable"
                                :data="searchData"
                                @selection-change="handleRolepicker"
                                class="console-width-12"
                                :max-height='permissionHeight'>

                            <el-table-column label="" width="55">
                                <template slot-scope="scope">
                                    <el-checkbox @change="handleRolepicker(scope.row)" v-model='checkobjList[scope.row.roleid]' :checked="checkobjList[scope.row.roleid]"></el-checkbox>
                                </template>
                            </el-table-column>

                            <el-table-column prop="rolename" label="角色名称" width=""></el-table-column>

                            <el-table-column prop="remark" label="备注" width=""></el-table-column>

                        </el-table>
                        <!-- <el-pagination
                                class="console-mt5"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="cPage"
                                :page-sizes="cpageSizes"
                                :page-size="cSize"
                                layout="total, sizes, prev, pager, next"
                                :total="cTotal">
                        </el-pagination> -->
                    </el-card>

                    <p></p>

                    <el-card class="box-card mt10 del-shadow">
                        <div slot="header" class="clearfix">
                            <span>已选列表</span>
                        </div>

                        <el-checkbox-group v-model="checkList" @change="handleRoleSelected">
                            <el-checkbox v-for="(item,itemindex) in roleobjlist" :key="item.roleid" :label="item.roleid" v-if="checkobjList[item.roleid]==true">{{item.rolename}} </el-checkbox>
                        </el-checkbox-group>

                    </el-card>
                </div>
            </div>
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button @click="handleClose">取 消</el-button>-->
                <!--<el-button type="primary" @click="setAdd">确 定</el-button>-->
            <!--</span>-->
        </el-dialog>
    </div>
</template>

<script type="es6">
    export default {
        name: 'userPicker',
        data () {
            return {
                dialog_top: '50px',
                search:null,
                roleobjlist:{},
                rolelist:[],
                roleselectlist:[],
                btntext: '角色分配',
                checkobjList: {},
                checkList: [],

                //multipleSelection: [],

                rolePickerVisible: false,

                tableData: [],
                employeelist: [],
                userorglist: [],
                userid: this.$route.params.id,
                permissionHeight: 450,
            }
        },
        watch:{

        },
        props: {
            'btnText':{
                type: String,
                default: '角色分配'
            },
            'selection':{
                type: [String,Number,Array,Object],
                //required:true
            },
        },
        computed: {
            //全字段模糊查询
            searchData() {
                let search = this.search;
                if (search) {
                    return this.rolelist.filter(rolelist => {
                        return Object.keys(rolelist).some(key => {
                            return String(rolelist[key]).indexOf(search) > -1
                        })
                    })
                }
                return this.rolelist;
            }
        },
        mounted () {
            this.jungleHeight();
        },
        methods: {
            jungleHeight(){
               if(this.$store.state.resolution === 'low'){
                   this.permissionHeight = 390;
               }
            },
            handleOpen(done) {
                var _delitems = [];
                this.userid = this.$route.params.id;

                if (this.userid != undefined) {
                    this.rolePickerVisible = true;
                    this.getlist();
                }
            },
            getlist() {
                this.fetch('/sys/role/getAll',this.objfilter({
                    pageNo:this.cPage,
                    pageSize:10000,
                })).then((result) => {
                    if(result.status=='200'){
                        this.rolelist = result.data.list;
                        //this.cTotal = result.data.total;
                        var _checkList = [] ,_checkobjList ={};
                        _.each(this.rolelist,v=>{
                            this.roleobjlist[v.roleid] = v;
                            _checkobjList[v.roleid] = false;
                        })
                        this.checkobjList = _checkobjList;
                        this.getroleSelectlist()
                    }
                })
            },
            getroleSelectlist() {
                this.checkList = [];
                //this.checkobjList = {};
                this.getAjax('sys/userrole/userRoleList/'+this.$route.params.id).then((result) => {
                    if(result.status=='200') {
                        this.roleselectlist = result.data;
                        var _checkList = [] ,_checkobjList ={};
                        _.each(this.roleselectlist, v => {
                            console.log(v.rolename,v);
                            _checkList.push(v.roleid);
                            _checkobjList[v.roleid] = true;
                        })
                        this.checkList = _checkList;
                        this.checkobjList = _checkobjList;

                    }
                })
            },
            setAdd () {
                //关闭
                this.rolePickerVisible = false;
                //合并数据
                var _params=[];
                _.each(this.checkList, (v,k) =>{
                    _params.push({roleid:v,userid:this.$route.params.id})
                })
                //发送请求
                if(_params.length>0){
                    this.fetch('/sys/userrole/saveRole',_params).then((result) => {
                        if(result.status=='200'){
                            this.$handleRes(result);
                            this.checkList = [];
                            this.checkobjList = {};
                            this.$emit('cb');
                        }
                    })
                }else if(_params.length==0){
                    this.getAjax('/sys/userrole/removeallrole/'+this.$route.params.id).then((result) => {
                        if(result.status=='200'){
                            this.$handleRes(result);
                            this.checkList = [];
                            this.checkobjList = {};
                            this.$emit('cb');
                        }
                    })
                }
            },
            handleClose() {
                this.rolePickerVisible = false;
                this.rolelist = [];
                this.$emit('cb');
                this.$refs.multipleTable.clearSelection();
            },

            handleRolepicker(){

                var _checkList = [] ,_checkobjList ={};
                _.each(this.roleobjlist, v => {
                    _checkobjList[v.roleid] = false;
                    if(this.checkobjList[v.roleid]==true){
                        _checkList.push(v.roleid);
                        _checkobjList[v.roleid] = true;
                    }
                })
                this.checkList = _checkList;
                this.checkobjList = _checkobjList;

            },
            handleRoleSelected(data,type) {
                var _checkobjList = {};
                _.each(data,(v,k)=>{
                    _checkobjList[v]=true
                })
                this.checkobjList = _checkobjList;
                this.handleRolepicker()

            },
        }
    }

</script>
