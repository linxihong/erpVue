/**
* @date 2017/11/22
* @desc 用户组管理 人员选择器
**/
<template>
    <div class="m-userPickerVisible">
        <el-button @click="handleOpen">{{btnText}}</el-button>
        <el-dialog
                title="人员列表"
                :visible.sync="userPickerVisible"
                size="large"
                :before-close="handleClose">

            <el-card class="box-card">
                <el-table
                        ref="multipleTable"
                        :data="employeelist"
                        @selection-change="handleUserpickerSelectionAdd"
                        style="width: 100%">

                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>

                    <el-table-column
                            prop="empName"
                            label="员工姓名"
                            width="100">
                        <template slot-scope="scope">
                            <router-link :to="{ name:'hr_staff_detail',params:{id:scope.row.empId}}">
                                {{scope.row.empName}}
                            </router-link>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="empCode"
                            label="员工编号">
                    </el-table-column>

                    <el-table-column
                            prop="sex"
                            label="性别"
                            width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.sex==0">男</span>
                            <span v-if="scope.row.sex==1">女</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="empNum"
                            label="员工工号"
                            width="100">
                    </el-table-column>

                    <el-table-column
                            prop="empTypeName"
                            label="员工类型">
                    </el-table-column>

                    <el-table-column
                            prop="isregempflag"
                            width="120"
                            label="正式员工">
                        <template slot-scope="scope">
                            <span v-if="scope.row.isregempflag==0">是</span>
                            <span v-if="scope.row.isregempflag==1">否</span>
                        </template>
                    </el-table-column>

                </el-table>
                <el-pagination
                        class="console-mt5"
                        @size-change="handleUserSizeChange"
                        @current-change="handleUserCurrentChange"
                        :current-page="cPage"
                        :page-sizes="cpageSizes"
                        :page-size="cSize"
                        layout="total, sizes, prev, pager, next"
                        :total="cTotal">
                </el-pagination>
            </el-card>

            <p></p>

            <el-card class="box-card mt10">
                <div slot="header" class="clearfix">
                    <span>已选列表</span>
                </div>

                <el-checkbox-group v-model="checkList" @change="handleUserpickerSelectionDelete">
                    <el-checkbox v-for="item in multipleSelection" :key="item.empId" :label="item.empId"> {{item.empName}} </el-checkbox>
                </el-checkbox-group>

            </el-card>

            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleSubmit(setAdd)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
　<!--　btntext:(curVal,oldVal)=>{
　　　　　　　  //console.log(this.btntext,this.btnText);
                this.btntext = this.btnText;
                return this.btnText?this.btnText:'添加'
　　　　　　},-->
<!--btnText:{
                handler:(val,oldVal)=>{
                    //console.log(val)
                    val?this.btntext = val:this.btntext = '添加';
                },
                deep:true
            }-->
<script type="es6">
    export default {
        name: 'userPicker',
        data () {
            return {
                //multipleSelection: [],
                checkList: [],
                userPickerVisible: false,
                btntext: '添加',
                tableData: [],
                employeelist: [],
                userorglist: [],
            }
        },
        watch:{
　　　　　　
　　　　},
        computed:{
　　　　
　　　　},
        props: {
            'btnText':{
                type: String,
                default: '添加'
            },
            'demid':{
                type: [String,Number],
                required:true
            },
        },
        methods: {
            handleOpen(done) {
                this.userPickerVisible = true;
                this.getemployeelist();
                //this.getuserorglist();
            },
            handleSubmit(done) {
                this.$confirm('确认提交？')
                  .then(_ => {
                    this.userPickerVisible = false;
                    done();
                  }).catch(_ => {});
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                  .then(_ => {
                    this.userPickerVisible = false;
                    done();
                  }).catch(_ => {});
            },
            handleUserpickerSelectionDelete(val) {
                var _result = [];

                _.each(this.employeelist, (mv,mk) => {
                    this.$refs.multipleTable.toggleRowSelection(this.employeelist[mk],false);
                    _.each(val, (v,k)  => {
                        if(v==mv.empId){
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
                var _result = [];
                _.each(val,(v,k) => {
                    ////console.log('v',v.empId)
                    _result.push(v.empId);
                })
                this.multipleSelection = val;
                this.checkList = _result;
                ////console.log(this.multipleSelection,val, this.checkList);
            },
            setAdd () {
                ////console.log("dialog add",this.checkList,this.demid)
                var _params=[];
                _.each(this.checkList, (v,k) =>{
                    _params.push({demid:this.demid,empid:v})
                })
                this.fetch('/sys/usergroup/save',_params).then((result) => {
                    //result ={   "status" : 200,"error" : "成功","message" : "操作成功","data" : {     "demid" : 10000000460109,"orgcode" : "333","depth" : 3,"orgname" : "恒利搅拌站","remark" : null,"demid" : 10000000470184,"parentid" : 10000000460105,"sort" : null,"rsnum" : null,"status" : 0,"orgtype" : 3,"systemid" : 10000000460117,"creator" : 1,"createtime" : null,"editor" : null,"editdate" : null,"pageNo" : 1,"pageSize" : 10   } }
                    if(result.status=='200'){
                        this.$handleRes(result);
                        this.multipleSelection = [];
                        this.checkList = [];
                        this.$emit('cb');
                    }
                })
            },
            getemployeelist () {
                this.fetch('/sys/employee/getAll',this.objfilter({
                    pageNo:this.cPage,
                    pageSize:this.cSize,
                })).then((result) => {
                    //result ={   "status" : 200,"error" : "成功","message" : "操作成功","data" : {     "demid" : 10000000460109,"orgcode" : "333","depth" : 3,"orgname" : "恒利搅拌站","remark" : null,"demid" : 10000000470184,"parentid" : 10000000460105,"sort" : null,"rsnum" : null,"status" : 0,"orgtype" : 3,"systemid" : 10000000460117,"creator" : 1,"createtime" : null,"editor" : null,"editdate" : null,"pageNo" : 1,"pageSize" : 10   } }
                    if(result.status=='200'){
                        this.$set(this, 'employeelist',result.data.list);
                        this.cTotal = result.data.total;
                    }else {
                        this.$message({
                            message:'系统正在升级中，请稍后再试',
                            type:'error'
                        });
                    }
                })
            },
            getuserorglist () {
                var _result = [];
                this.multipleSelection = [];

                this.getAjax('/usergroup/getGroupUser/'+ this.demid).then((result) => {
                    //result ={   "status" : 200,"error" : "成功","message" : "操作成功","data" : {     "demid" : 10000000460109,"orgcode" : "333","depth" : 3,"orgname" : "恒利搅拌站","remark" : null,"demid" : 10000000470184,"parentid" : 10000000460105,"sort" : null,"rsnum" : null,"status" : 0,"orgtype" : 3,"systemid" : 10000000460117,"creator" : 1,"createtime" : null,"editor" : null,"editdate" : null,"pageNo" : 1,"pageSize" : 10   } }
                    if(result.status=='200'){
                        _.each(result.data,(v,k)=>{
                            _result.push(v.userid)
                            _.each(this.employeelist, (ev,ek) => {
                                if(v.empid==ev.empid){
                                    this.$refs.multipleTable.toggleRowSelection(this.employeelist[ek], true);
                                }
                            })

                        })
                        this.checkList = _result;
                    }
                })
            },
            handleUserCurrentChange(val) {
                this.cPage = val;
                this.getemployeelist();
            },
            handleUserSizeChange(val) {
                this.cSize = val;
                this.getemployeelist();
            },
        }
    }

</script>
