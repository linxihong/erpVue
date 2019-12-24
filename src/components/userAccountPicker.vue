/**
* @date 2017/11/22
* @desc 账户列表 员工选择器
**/
<template>
    <div class="m-userPickerVisible">
        <el-button class="btn-color" type="text" v-auth="ifHasAuth('employeeallocation')" @click="ifHasAuth('employeeallocation')&&handleOpen()" :disabled="this.mSelection.usertype=='0'||this.mSelection.usertype=='1'">{{btnText}}</el-button>
        <el-dialog
                class="dialogDiv dialogDivII"
                :visible.sync="userPickerVisible"
                :show-close="false"
                top="5%"
                size="small"
                :before-close="handleClose">
            <div class="slideContent leftOffsetII">
                <div class="leftDiv">
                    <el-button class="icon-setting-2 icon-close" @click="handleClose"></el-button>
                    <el-button class="icon-setting-1 icon-confirm" @click="handleSubmit(setAdd)"></el-button>
                </div>
                <div class="slideTop" v-drag1>员工分配</div>
                <div class="slideMid">

                    <div class="console-m2">
                        <el-input v-model="empName" placeholder="请输入员工姓名" class="searchInput" @keyup.enter.native="getlist"></el-input>
                        <el-button class="ui-color3" type="primary" @click="getlist">查询</el-button>
                    </div>

                    <!-- <el-card class="box-card"> -->
                    <el-table
                            ref="multipleTable"
                            :data="employeelist"
                            @selection-change="handleUserpickerSelectionAdd"
                            class="console-width-12 mt10">

                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>

                        <el-table-column
                                prop="account"
                                label="账号">
                        </el-table-column>

                        <el-table-column
                                prop="empName"
                                label="员工姓名">
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
                                <span v-if="scope.row.sex==item.itemvalue" v-for="item in sexlist" :key="item.itemvalue">{{item.itemname}}</span>
                                <!-- <span v-if="scope.row.sex==0">男</span>
                                 <span v-if="scope.row.sex==1">女</span>-->
                            </template>
                        </el-table-column>

                        <el-table-column
                                prop="empNum"
                                label="员工工号"
                                width="200">
                        </el-table-column>

                        <!-- <el-table-column
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
                         </el-table-column>-->

                    </el-table>
                    <el-pagination
                            class="console-mt5"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="cPage"
                            :page-sizes="cpageSizes"
                            :page-size="cSize"
                            layout="total, sizes, prev, pager, next"
                            :total="cTotal">
                    </el-pagination>
                    <!-- </el-card> -->

                    <!--<p></p>-->

                    <!--<el-card class="box-card mt10">-->
                    <!--<div slot="header" class="clearfix">-->
                    <!--<span>已选列表</span>-->
                    <!--</div>-->

                    <!--<el-checkbox-group v-model="checkList" @change="handleUserpickerSelectionDelete">-->
                    <!--<el-checkbox v-for="item in multipleSelection" :key="item.empId" :label="item.empId"> {{item.empName}} </el-checkbox>-->
                    <!--</el-checkbox-group>-->

                    <!--</el-card>-->
                </div>
            </div>
            <!--<span slot="footer" class="dialog-footer">-->
            <!--<el-button class="ui-color2" @click="handleClose">取 消</el-button>-->
            <!--<el-button class="ui-color3" type="primary" @click="handleSubmit(setAdd)">确定</el-button>-->
            <!--</span>-->
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
                sexlist: [],
                checkList: [],
                userPickerVisible: false,
                btntext: '添加',
                tableData: [],
                employeelist: [],
                userorglist: [],
                empName: null
            }
        },
        watch: {},
        computed: {},
        props: {
            'btnText': {
                type: String,
                default: '添加'
            },
            'mSelection': {
                type: Object
            },
        },
        methods: {
            handleOpen(done) {
                if (this.mSelection && this.mSelection.userid != undefined) {
                    this.userPickerVisible = true;
                    this.getdicdata();
                    this.getlist();
                    this.empName = null;
                    //this.getuserorglist();
                } else {
                    this.$message.warning('请选择一项进行操作')
                }
            },
            handleSubmit(done) {
                this.userPickerVisible = false;
                done();
                setTimeout(() => {
                    this.$emit('cb');
                },100)

            },
            handleClose(done) {
                this.userPickerVisible = false;
                this.$emit('cb');
            },
            handleUserpickerSelectionDelete(val) {
                var _result = [];

                _.each(this.employeelist, (mv, mk) => {
                    this.$refs.multipleTable.toggleRowSelection(this.employeelist[mk], false);
                    _.each(val, (v, k) => {
                        if (v == mv.empId) {
                            _result.push(v);
                            this.$refs.multipleTable.toggleRowSelection(this.employeelist[mk], true);
                        }
                    })
                })

                this.checkList = _result;
            },
            handleUserpickerSelectionAdd(val) {
                var _result = [];
                if (val && val.length > 1) {
                    val.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                        _result.push(row);
                    });
                } else {
                    _result.push(val[0]);
                }
                this.checkList = _result;
            },
            setAdd () {
                if(this.checkList.length==1){
                    this.fetch('/sys/user/updateEmpId', {userid: this.mSelection.userid, empid: this.checkList[0].empId, usertype: this.checkList[0].empTypeid}).then((result) => {
                        //result ={   "status" : 200,"error" : "成功","message" : "操作成功","data" : {     "orgid" : 10000000460109,"orgcode" : "333","depth" : 3,"orgname" : "恒利搅拌站","remark" : null,"demid" : 10000000470184,"parentid" : 10000000460105,"sort" : null,"rsnum" : null,"status" : 0,"orgtype" : 3,"systemid" : 10000000460117,"creator" : 1,"createtime" : null,"editor" : null,"editdate" : null,"pageNo" : 1,"pageSize" : 10   } }
                        this.$handleRes(result);
                        if (result.status == '200') {
                            this.multipleSelection = [];
                            this.checkList = [];
                            this.$emit('cb');
                        }
                    })
                }
            },
            getlist () {
                this.fetch('/sys/employee/getAll', this.objfilter({
                    pageNo: this.cPage,
                    pageSize: this.cSize,
                    empName: this.empName,
                    userid: this.mSelection.userid,
                })).then((result) => {
                    //result = {"data":{"endRow":0,"firstPage":0,"hasNextPage":true,"hasPreviousPage":true,"isFirstPage":true,"isLastPage":true,"lastPage":0,"list":[{"empId":0,"pageNo":0,"pageSize":0,"empCode":"string","empName":"string","empNum":"string","empTypeid":0,"status":0,"isregempflag":0,"cardno":"string","idnum":"string","sex":0,"birthdate":"2017-08-30T13:50:24.976Z","province":0,"city":"string","homeplace":"string","regresidence":"string","nationnality":0,"marriage":0,"politicalstatus":0,"homeAddress":"string","phoneContact":"string","phoneMobile":"string","phoneShort":"string","email":"string","speciality":"string","leaderid":0,"remark":"string","creator":0,"createtime":"2017-08-30T13:50:24.976Z","editor":0,"editdate":"2017-08-30T13:50:24.976Z"},{"empId":0,"pageNo":0,"pageSize":0,"empCode":"string","empName":"string","empNum":"string","empTypeid":0,"status":0,"isregempflag":0,"cardno":"string","idnum":"string","sex":0,"birthdate":"2017-08-30T13:50:24.976Z","province":0,"city":"string","homeplace":"string","regresidence":"string","nationnality":0,"marriage":0,"politicalstatus":0,"homeAddress":"string","phoneContact":"string","phoneMobile":"string","phoneShort":"string","email":"string","speciality":"string","leaderid":0,"remark":"string","creator":0,"createtime":"2017-08-30T13:50:24.976Z","editor":0,"editdate":"2017-08-30T13:50:24.976Z"}],"navigateFirstPage":0,"navigateLastPage":0,"navigatePages":0,"navigatepageNums":[0],"nextPage":0,"pageNum":0,"pageSize":0,"pages":0,"prePage":0,"size":0,"startRow":0,"total":0},"error":"string","message":"string","status":'200'};
                    if (result.status == '200') {
                        this.$set(this, 'employeelist', result.data.list);
                        this.cTotal = result.data.total;
                        if(this.mSelection.userid === result.data.list[0].userid) {
                            this.$nextTick(() => {
                                this.$refs.multipleTable.toggleRowSelection(this.employeelist[0],true);
                            })
                        }
                    }else {
                        this.$message({
                            message:'系统正在升级中，请稍后再试',
                            type:'error'
                        });
                    }
                })
            },
            getuserorglist () {
                this.getAjax('/sys/org/edit/' + this.orgid).then((result) => {
                    //result ={   "status" : 200,"error" : "成功","message" : "操作成功","data" : {     "orgid" : 10000000460109,"orgcode" : "333","depth" : 3,"orgname" : "恒利搅拌站","remark" : null,"demid" : 10000000470184,"parentid" : 10000000460105,"sort" : null,"rsnum" : null,"status" : 0,"orgtype" : 3,"systemid" : 10000000460117,"creator" : 1,"createtime" : null,"editor" : null,"editdate" : null,"pageNo" : 1,"pageSize" : 10   } }
                    if (result.status == '200') {
                        this.$set(this, 'userorglist', result.data.list)
                    }
                })
            },
            getdicdata(formName) {
                this.postDicData([
                    {'nodekey':'sex',systemid:'0'},
                    /*    {'nodekey':'status',systemid:'0'},
                        {'nodekey':'province',systemid:'0'},
                        {'nodekey':'nationnality',systemid:'0'},
                        {'nodekey':'marriage',systemid:'0'},
                        {'nodekey':'politicalstatus',systemid:'0'},
                        {'nodekey':'sex',systemid:'0'},*/
                ]).then( (result)=>{
                    //this.DevType==true?result = {"msg":"成功.","data":{"province":[{"createtime":"2017-08-22 11:27:09","creator":10000000100107,"dicid":10000000770144,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_bjs","itemname":"北京市","itemvalue":"1","nodekey":"hljt_province","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":1,"status":0,"systemid":10000000220101,"typeid":10000000770116},{"createtime":"2017-08-22 11:27:28","creator":10000000100107,"dicid":10000000770146,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_tjs","itemname":"天津市","itemvalue":"2","nodekey":"hljt_province","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":1,"status":0,"systemid":10000000220101,"typeid":10000000770116},{"createtime":"2017-08-22 11:27:41","creator":10000000100107,"dicid":10000000770148,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_shs","itemname":"上海市","itemvalue":"3","nodekey":"hljt_province","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":1,"status":0,"systemid":10000000220101,"typeid":10000000770116},{"createtime":"2017-08-22 11:27:56","creator":10000000100107,"dicid":10000000770150,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_cqs","itemname":"重庆市","itemvalue":"4","nodekey":"hljt_province","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":1,"status":0,"systemid":10000000220101,"typeid":10000000770116},{"createtime":"2017-08-22 11:29:59","creator":10000000100107,"dicid":10000000770154,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_hbs","itemname":"河北省","itemvalue":"5","nodekey":"hljt_province","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":1,"status":0,"systemid":10000000220101,"typeid":10000000770116},{"createtime":"2017-08-22 11:30:18","creator":10000000100107,"dicid":10000000770156,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_sqx","itemname":"山西省","itemvalue":"6","nodekey":"hljt_province","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":1,"status":0,"systemid":10000000220101,"typeid":10000000770116}],"empType":[{"createtime":"2017-08-22 10:59:52","creator":10000000100107,"dicid":10000000770121,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_pt","itemname":"普通","itemvalue":"0","nodekey":"hljt_empType","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":1,"status":0,"systemid":10000000220101,"typeid":10000000770110},{"createtime":"2017-08-22 11:00:13","creator":10000000100107,"dicid":10000000770123,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_ywy","itemname":"业务员","itemvalue":"1","nodekey":"hljt_empType","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":2,"status":0,"systemid":10000000220101,"typeid":10000000770110},{"createtime":"2017-08-22 11:00:36","creator":10000000100107,"dicid":10000000770125,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_sj","itemname":"司机","itemvalue":"2","nodekey":"hljt_empType","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"3","sort":3,"status":0,"systemid":10000000220101,"typeid":10000000770110}],"nationnality":[{"createtime":"2017-08-22 11:31:53","creator":10000000100107,"dicid":10000000770158,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_acz","itemname":"阿昌族","itemvalue":"1","nodekey":"hljt_nationnality","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":1,"status":0,"systemid":10000000220101,"typeid":10000000770119},{"createtime":"2017-08-22 11:32:36","creator":10000000100107,"dicid":10000000770162,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_hz","itemname":"汉族","itemvalue":"3","nodekey":"hljt_nationnality","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"3","sort":1,"status":0,"systemid":10000000220101,"typeid":10000000770119},{"createtime":"2017-08-22 11:32:18","creator":10000000100107,"dicid":10000000770160,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_mz","itemname":"满族","itemvalue":"2","nodekey":"hljt_nationnality","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":2,"status":0,"systemid":10000000220101,"typeid":10000000770119}],"status":[{"createtime":"2017-08-22 11:01:43","creator":10000000100107,"dicid":10000000770130,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_zz","itemname":"在职","itemvalue":"0","nodekey":"hljt_status","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":1,"status":0,"systemid":10000000220101,"typeid":10000000770113},{"createtime":"2017-08-22 11:02:01","creator":10000000100107,"dicid":10000000770132,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_cz","itemname":"辞职","itemvalue":"1","nodekey":"hljt_status","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"2","sort":2,"status":0,"systemid":10000000220101,"typeid":10000000770113},{"createtime":"2017-08-22 11:02:14","creator":10000000100107,"dicid":10000000770134,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_ct","itemname":"辞退","itemvalue":"2","nodekey":"hljt_status","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"3","sort":2,"status":0,"systemid":10000000220101,"typeid":10000000770113},{"createtime":"2017-08-22 11:02:29","creator":10000000100107,"dicid":10000000770136,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_ls","itemname":"临时","itemvalue":"3","nodekey":"hljt_status","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":3,"status":0,"systemid":10000000220101,"typeid":10000000770113},{"createtime":"2017-08-22 11:24:12","creator":10000000100107,"dicid":10000000770139,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_tx","itemname":"退休","itemvalue":"98","nodekey":"hljt_status","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":5,"status":0,"systemid":10000000220101,"typeid":10000000770113},{"createtime":"2017-08-22 11:24:47","creator":10000000100107,"dicid":10000000770142,"editdate":null,"editor":0,"iscache":1,"itemkey":"hljt_sw","itemname":"死亡","itemvalue":"99","nodekey":"hljt_status","nodepath":"","pageNo":1,"pageSize":10,"parentid":0,"remark":"","sort":6,"status":0,"systemid":10000000220101,"typeid":10000000770113}]},"error":"","status":200}:''
                    this.afteryAjax(result);
                    if(result.status=='200'&&result.data){
                        setTimeout(()=>{
                            result.data['sex']?this.sexlist = result.data['sex']:'';
                        },100)
                    }
                })
            },
        }
    }

</script>
<style lang="less" scoped type="text/less">
    .searchInput {
        width: 200px;
        margin-right: 20px;
    }
    .btn-color {
        //应用：列表-列、操作
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
</style>
