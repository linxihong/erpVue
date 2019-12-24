/**
* @date 2017/11/22
* @desc 流水号 选择器
**/
<template>
    <div class="m-userPickerVisible">
        <el-button  class="btn-color" type="text" v-auth="ifHasAuth('accountallocation')" @click="ifHasAuth('accountallocation')&&handleOpen()">{{btnText}}</el-button>
        <el-dialog
                class="dialogDiv dialogDivII"
                :show-close="false"
                :visible.sync="userPickerVisible"
                size="small"
                :top="roleTop"
                :before-close="handleClose">
            <div class="slideContent leftOffsetII">
                <div class="leftDiv">
                    <el-button class="icon-setting-2 icon-close" @click="handleClose"></el-button>
                    <el-button class="icon-setting-1 icon-confirm" @click="handleSubmit(setAdd)"></el-button>
                </div>
                <div class="slideTop" v-drag1>账号列表</div>
                <div class="slideMid">

                    <el-card class="box-card del-shadow">
                        <div class="console-m2">
                             <el-input v-model="search" placeholder="账号名称/账号" icon="search" style="width: 50%;"></el-input>
                        </div>
                        <el-table
                                row-key="account"
                                ref="multipleTable"
                                :data="searchData"
                                @selection-change="handleUserpickerSelectionAdd"
                                class="console-width-12"
                                :max-height='roleHeight'>

                            <el-table-column
                                    type="selection"
                                    label=""
                                    width="55"
                                    :reserve-selection="true">
                            </el-table-column>

                            <el-table-column
                                    prop="account"
                                    label="账号"
                                    width="">
                            </el-table-column>

                            <el-table-column
                                    prop="fullname"
                                    label="账号名称"
                                    width="">
                            </el-table-column>

                            <el-table-column
                                    prop="islock"
                                    label="是否锁定"
                                    width="100">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.islock==1">锁定</span>
                                    <span v-if="scope.row.islock==0">未锁定</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="isexpired"
                                    label="是否过期"
                                    width="100">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.isexpired==1">过期</span>
                                    <span v-if="scope.row.isexpired==0">未过期</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="status"
                                    label="状态"
                                    width="80">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.status==0">激活</span>
                                    <span v-if="scope.row.status==1">未激活</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="createtime"
                                    width="170"
                                    label="创建时间">
                                <template slot-scope="scope">
                                    {{formatDate(scope.row.createtime)}}
                                </template>
                            </el-table-column>

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
                        <!-- <el-checkbox-group v-model="checkList" @change="handleUserpickerSelectionDelete">
                            <el-checkbox v-for="item in checkItemslist" :key="item.userid" :label="handletoString(item.userid)"> {{item.account}}</el-checkbox>
                        </el-checkbox-group> -->
                        <div class="selectedDiv">
                            <div v-for="item in checkList" class="mr10">
                                <el-tag type="primary">{{item.account}}</el-tag>
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>

            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button class="ui-color2"  @click="handleClose">取 消</el-button>-->
                <!--<el-button class="ui-color3" type="primary" @click="handleSubmit(setAdd)">确 定</el-button>-->
            <!--</span>-->
        </el-dialog>
    </div>
</template>
<script type="es6">
    export default {
        name: 'userPicker',
        data () {
            return {
                //multipleSelection: [],
                search:null,
                checkList: [],
                checkListData: [],
                checkItemslist: {},
                userPickerVisible: false,
                btntext: '添加',
                tableData: [],
                employeelist: [],
                userorglist: [],
                roleid: '',
                roleTop: '5%',
                roleHeight: 430,
            }
        },
        props: {
            'btnText':{
                type: String,
                default: '添加'
            },
            'selection':{
                type: [String,Number,Array,Object],
                required:true
            },
        },
        mounted () {
            this.jungleHeight();
        },
        // watch:{
        //     'checkListData':'hello'
        // },
        computed: {
            //全字段模糊查询
            searchData() {
                let search = this.search;
                if (search) {
                    return this.employeelist.filter(employeelist => {
                        return Object.keys(employeelist).some(key => {
                            return String(employeelist[key]).indexOf(search) > -1
                        })
                    })
                }
                return this.employeelist;
            }
        },
        methods: {
            jungleHeight(){
               if(this.$store.state.resolution === 'low'){
                   this.roleTop = '5%';
                   this.roleHeight = 350;
               }
            },
            handleOpen(done) {
                var _delitems = [];
                //console.log(this.selection)

                if (this.selection&&this.selection.roleid != undefined) {
                    this.userPickerVisible = true;
                    this.roleid = this.selection.roleid;
                    this.getlist();
                    //this.getuserorglist();
                }

            },
            handleSubmit(done) {
                this.userPickerVisible = false;
                done?done():'';
                /*this.$confirm('确认提交？')
                  .then(_ => {
                    this.userPickerVisible = false;
                    done();
                  }).catch(_ => {});*/
            },
            handleClose(done) {
                this.userPickerVisible = false;
                this.employeelist = [];
                this.$emit('cb');
                this.$refs.multipleTable.clearSelection();
                /*this.$confirm('确认关闭？')
                  .then(_ => {
                    this.userPickerVisible = false;
                    done();
                  }).catch(_ => {});*/
            },
            handleUserpickerSelectionDelete(val) {
                var _result = [];

                _.each(this.employeelist, (mv,mk) => {
                    this.$refs.multipleTable.toggleRowSelection(this.employeelist[mk],false);
                    _.each(val, (v,k)  => {
                        if(v==mv.userid){
                            _result.push(mv);
                            this.$refs.multipleTable.toggleRowSelection(this.employeelist[mk], true);
                        }
                    })
                })

                this.checkList = val;
                //this.multipleSelection = _result;
                //this.$set(this,'multipleSelection',_result);
            },
            handleUserpickerSelectionAdd(val) {
               // console.log(223,_.difference([2,3,3,5,6],[5,6]).concat([5,6]));
               // console.log(222,val)
               // console.log(224,_.difference(this.checkListData,val).concat(_.difference(val,this.checkListData)));
                //let _result= val;
               // let _resultlist= _result.concat(this.checkListData)
               // let _result =_.difference(this.checkListData,val).concat(_.difference(val,this.checkListData));
                //let _resultlist= this.reduceObj(_.difference(this.checkListData,val).concat(_.difference(val,this.checkListData)),"account")

                //let _resultObj={};
                // _.each(_result,(v,k) => {
                //     //防重复
                //     _resultObj[v.userid] = true;
                //     _resultlist[v.account] = v;
                //     //_result.push(v.userid.toString());
                //     _resultlist.push(v);
                // })
                // _.each(this.checkListData,(v,k) => {
                //     _result.push(v.account.toString());
                // })
                // this.multipleSelection = _resultlist;
                this.checkList = val;
                //console.log(223,_resultlist);
                //console.log(22,_result);
            },
            setAdd () {
                //console.log("dialog add",this.checkList,this.orgid)
                var _params=[];
                _.each(this.checkList, (v,k) =>{
                    _params.push({roleid:this.selection.roleid,userid:v.userid})
                })
                if(_params.length>0){
                    this.fetch('/sys/userrole/save',_params).then((result) => {
                        //result ={   "status" : 200,"error" : "成功","message" : "操作成功","data" : {     "orgid" : 10000000460109,"orgcode" : "333","depth" : 3,"orgname" : "恒利搅拌站","remark" : null,"demid" : 10000000470184,"parentid" : 10000000460105,"sort" : null,"rsnum" : null,"status" : 0,"orgtype" : 3,"systemid" : 10000000460117,"creator" : 1,"createtime" : null,"editor" : null,"editdate" : null,"pageNo" : 1,"pageSize" : 10   } }
                        if(result.status=='200'){
                            this.$handleRes(result);
                            this.multipleSelection = [];
                            this.checkList = [];
                            this.$emit('cb');
                        }else {
                            this.$message({
                                message:'操作失败',
                                type: 'error'
                            });
                        }
                    })
                }else if(_params.length==0){
                    this.getAjax('sys/userrole/removeall/'+this.selection.roleid).then((result) => {
                        if(result.status=='200'){
                            this.$handleRes(result);
                            this.multipleSelection = [];
                            this.checkList = [];
                            this.$emit('cb');
                        }
                    })
                }
            },
            getlist () {
                this.fetch('/sys/user/selectUser',this.objfilter({
                    pageNo:this.cPage,
                    pageSize:10000,
                })).then((result) => {
                    if(result.status==200){
                        this.$set(this, 'employeelist',result.data.list);
                        //this.cTotal = result.data.total;
                        this.getuserorglist();
                    }
                })
            },
            getuserorglist () {
                var _result = [];
                this.multipleSelection = [];
                this.getAjax('/sys/userrole/getRoleUser/'+ this.roleid).then((result) => {
                    if(result.status==200){
                        //this.checkList = result.data
                        this.checkListData = result.data
                        _.each(result.data,(v,k)=>{
                            _result.push(v.userid.toString());
                            v.userid = v.userid.toString();
                            this.checkItemslist[v.userid] = v;
                        })
                        _.each(this.employeelist, (v,k) => {
                            _.each(this.checkItemslist, (ev,ek) => {
                               if (v.userid==ek){
                                   this.$refs.multipleTable.toggleRowSelection(v, true);
                               }
                            })
                        })
                        //this.multipleSelection.length ==0?this.multipleSelection = result.data:'';
                        //this.checkList?'':this.checkList = _result;
                    }
                })
            },
        }
    }

</script>
<style lang="less" scoped type="text/less">
    /*.el-checkbox-group .el-checkbox{*/
        /*margin-left: 0;*/
        /*margin-right: 15px;*/
    /*}*/

    .selectedDiv {
        display: flex;
        /*div {*/
            /*margin-right: 10px;*/
        /*}*/
    }
    /*应用：列表-列、操作*/
    .btn-color {
        &.el-button {
          padding: 0;
          font-size: 14px;
          }
        &.el-button--text {
             color: #00C26F;
         }
        &.el-button--text.is-disabled,.el-button.is-disabled:hover {
             color: #bfcbd9;
         }
    }
    .leftDiv {
        top: 80px!important;
        @media screen and (max-width: 1500px) {
            top: 40px!important;
        }
    }
    .box-card {
        .el-card__body {
            padding: 0 20px 20px 20px;
        }
    }
</style>