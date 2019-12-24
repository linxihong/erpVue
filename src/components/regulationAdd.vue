/**
* @date 2017/11/22
* @desc 流水号 选择器
**/
<template>
    <div class="m-userPickerVisible console-mb3">
        <!-- <el-card class="box-card del-shadow"> -->
            <div class="el-table el-table--fit el-table--enable-row-hover">
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__header console-width-12">
                    <thead>
                    <tr>
                        <th width="100">
                            <el-button @click="handleTableColumnAdd" icon="plus" class="ml20 ui-color2"></el-button>
                        </th>
                        <th width="70">序号</th>
                        <th width="180">参数类型</th>
                        <th>参数值</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in tableList" :key="item.kType">
                        <td>
                            <el-button @click="handleTableColumnDelete(index)" icon="minus" class="ml20 ui-color2"></el-button>
                        </td>
                        <td>
                            {{index+1}}
                        </td>
                        <td>
                            <el-select style="width: 150px;" @change="kTypechange(index)"
                                       v-model="tableList[index].kType" placeholder="请选择">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :disabled="item.disabled"
                                        :label="item.label"
                                        :value="handletoString(item.value)">
                                </el-option>
                            </el-select>
                        </td>
                        <td>
                            <span v-if="tableList[index].kType=='3'">    长度：</span><el-input v-if="tableList[index].kType=='3'" @change="kValvisiblechange"
                                      v-model="tableList[index].kValLong" placeholder="长度"
                                      style="width:60px;"></el-input>
                            <span v-if="tableList[index].kType=='3'">    步长：</span><el-input v-if="tableList[index].kType=='3'" @change="kValvisiblechange"
                                      v-model="tableList[index].kValStep" placeholder="步长"
                                      style="width:60px;"></el-input>

                            <span v-if="tableList[index].kType=='3'">    初始值：</span>
                            <el-input v-if="tableList[index].kType=='3'" @change="kValvisiblechange"
                                      v-model="tableList[index].kValDefault" placeholder="初始值"
                                      style="width:80px;"></el-input>
                            <span v-if="tableList[index].kType=='3'">    补零方式：</span>
                            <el-select v-if="tableList[index].kType=='3'" style="width: 110px;" @change="kTypechange(index)"
                                       v-model="tableList[index].originalheader" placeholder="请选择">
                                <el-option label="前面补零" value="NO"></el-option>
                                <el-option label="后面补零" value="no"></el-option>
                            </el-select>

                            <el-input v-if="tableList[index].kType=='1'"
                                      @change="kValvisiblechange(tableList[index].kVal,index)"
                                      v-model="tableList[index].kVal" style="width:150px;"></el-input>
                            <el-select placeholder="选择日期" class="f-db"
                                       style="width: 150px;"
                                       v-model="tableList[index].kVal"
                                       v-if="tableList[index].kType=='2'"
                                       @change="kValvisiblechange(tableList[index].kVal,index)">
                                <el-option :label="item.itemvalue" :value="item.itemvalue" v-for="item in getlshrqlist" :key="item.itemvalue"></el-option>
                            </el-select>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        <!-- </el-card> -->
    </div>
</template>

<script type="es6">
    export default {
        name: 'userPicker',
        data () {
            return {
                options: [{
                    value: '1',
                    label: '自定义字符',
                    disabled: false
                }, {
                    value: '2',
                    label: '日期',
                    disabled: false
                }, {
                    value: '3',
                    label: '序列号',
                    disabled: false
                }],
                value: '',
                resultErrmsg: '',
                //multipleSelection: [],
                tableList: [],
                checkList: [],
                regulation: '',
                userPickerVisible: false,
                btntext: '添加',
                tableData: [],
                employeelist: [],
                userorglist: [],
            }
        },
        watch: {
            'tableList'(val){
                this.cb()
            },
            'regulationdetail'(val){
                if(this.regulationdetail){
                    var _result = [],_billofdoc=[],_regulation=[];
                    this.regulationdetail.billofdoc!=undefined?_billofdoc=this.regulationdetail.billofdoc.split("%"):'';
                    this.regulationdetail.regulation!=undefined?_regulation=this.regulationdetail.regulation.split("%"):'';
                    _.each(_billofdoc,(v,k)=>{
                        if(v=='3'){
                            var _kVal=_regulation[k].split(',');
                            _result.push({kType:v,kVal:_regulation[k],kValLong:_kVal[0],kValStep:_kVal[1],kValDefault:_kVal[2],originalheader:this.regulationdetail.originalheader});
                            this.options[2].disabled = true;
                        }else{
                            _result.push({kType:v,kVal:_regulation[k],kValLong:'',kValStep:'',kValDefault:''});
                        }
                    })
                    this.tableList = _result
                }
                //this.tableList = this.regulationdetail
            }
        },
        computed: {},
        props: {
            'getlshrqlist': {
                type: [Array,Object],
            },
            'regulationdetail': {
                type: [Array,Object],
            },
            'btnText': {
                type: String,
                default: '添加'
            },
        },
        mounted () {
            ////console.log(this)
        },
        methods: {
            cb(val) {
                var _billofdoc = [], _regulation = [];
                this.resultErrmsg='';
                _.each(this.tableList, (v, k)=> {
                    ////console.log('v.kVal',v.kVal)
                    if(v.kVal==undefined||v.kVal==''){
                        this.resultErrmsg+='自定义字符不能为空！'
                    }

                    if (v.kType == '3') {

                        if(v.kValLong==undefined||v.kValLong==''){
                            this.resultErrmsg+='长度不能为空！'
                        }
                        if(v.kValStep==undefined||v.kValStep==''){
                            this.resultErrmsg+='步长不能为空！'
                        }
                        if(v.kValDefault==undefined||v.kValDefault==''){
                            this.resultErrmsg+='初始值不能为空！'
                        }
                        if(v.originalheader==undefined||v.originalheader==''){
                            this.resultErrmsg+='补零方式不能为空！'
                        }

                        v.kVal = v.kValLong + "," + v.kValStep + "," + v.kValDefault+ "," + v.originalheader
                    }
                    if (v.kType == '2') {
                        v.kVal = this.formatDate(v.kVal)
                    }
                    this.$emit("errmsg", this.resultErrmsg);
                    if(this.resultErrmsg.length!=0){
                        return
                    }
                    _billofdoc.push(v.kType)
                    _regulation.push(v.kVal)
                    ////console.log(_regulation,v.kType,v.kVal,this.resultErrmsg)
                })

                this.$emit("regulationcb", {billofdoc: _billofdoc.join("%"), regulation: _regulation.join("%")});
                //this.regulation = _regulation.join("%")
            },
            kValValid(e) {
                ////console.log(e)
                var val = e.target.value
                //val==undefined||val==''?alert('数据不能为空'):'';
                //this.cb();
            },
            kValvisiblechange(val, index) {
                ////console.log('kValvisiblechange', val, index, this.tableList[index])
                if (val.constructor === Date) {
                    this.tableList[index].kVal = this.formatDate(this.tableList[index].kVal)
                }
                this.cb();
            },
            kTypechange(index) {
                ////console.log('kTypechange', index)
                if (this.tableList[index].kType == '3') {
                    this.tableList[index].kVal = 'NO'
                } else {
                    this.tableList[index].kVal = ''
                }
                this.cb();
            },
            handleTableColumnAdd(val) {
                this.tableList.push({kType: '1', kVal: '', kValLong: '', kValStep: '', kValDefault: '', originalheader: ''});
                _.each(this.tableList, (v, k)=> {
                    if (v.kType == '3') {
                        this.options[2].disabled = true;
                    }
                })
                ////console.log(this.options)
            },
            handleTableColumnDelete(key) {
                this.tableList.splice(key, 1);
            },

            handleOpen(done) {
                this.userPickerVisible = true;
                this.tableList = [];
                ////console.log('handleOpen',this.tableList)
                //this.getemployeelist();
                //this.getuserorglist();
                this.handleTableColumnAdd()
            },
            handleSubmit(done) {
                ////console.log('tableList',this.tableList)
                this.$confirm('确认提交？')
                        .then(_ => {
                            this.userPickerVisible = false;
                            done();
                        }).catch(_ => {
                });
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                        .then(_ => {
                            this.userPickerVisible = false;
                            done();
                        }).catch(_ => {
                });
            },
            handleUserpickerSelectionDelete(val) {
                var _result = [];

                _.each(this.employeelist, (mv, mk) => {
                    this.$refs.multipleTable.toggleRowSelection(this.employeelist[mk], false);
                    _.each(val, (v, k) => {
                        if (v == mv.empId) {
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
                _.each(val, (v, k) => {
                    ////console.log('v',v.empId)
                    _result.push(v.empId);
                })
                this.multipleSelection = val;
                this.checkList = _result;
                ////console.log(this.multipleSelection,val, this.checkList);
            },
            setAdd () {
                ////console.log("dialog add",this.checkList,this.demid)
                var _params = [];
                _.each(this.checkList, (v, k) => {
                    _params.push({posid: this.posid, empid: v})
                })
                this.fetch('/sys/userpos/save', _params).then((result) => {
                    //result ={   "status" : 200,"error" : "成功","message" : "操作成功","data" : {     "demid" : 10000000460109,"orgcode" : "333","depth" : 3,"orgname" : "恒利搅拌站","remark" : null,"demid" : 10000000470184,"parentid" : 10000000460105,"sort" : null,"rsnum" : null,"status" : 0,"orgtype" : 3,"systemid" : 10000000460117,"creator" : 1,"createtime" : null,"editor" : null,"editdate" : null,"pageNo" : 1,"pageSize" : 10   } }
                    if (result.status == '200') {
                        this.$handleRes(result);
                        this.multipleSelection = [];
                        this.checkList = [];
                        this.$emit('cb');
                    }
                })
            },
            getemployeelist () {
                this.fetch('/sys/employee/getAll', this.objfilter({
                    pageNo: this.cPage,
                    pageSize: this.cSize,
                })).then((result) => {
                    //result ={   "status" : 200,"error" : "成功","message" : "操作成功","data" : {     "demid" : 10000000460109,"orgcode" : "333","depth" : 3,"orgname" : "恒利搅拌站","remark" : null,"demid" : 10000000470184,"parentid" : 10000000460105,"sort" : null,"rsnum" : null,"status" : 0,"orgtype" : 3,"systemid" : 10000000460117,"creator" : 1,"createtime" : null,"editor" : null,"editdate" : null,"pageNo" : 1,"pageSize" : 10   } }
                    if (result.status == '200') {
                        this.$set(this, 'employeelist', result.data.list);
                        this.cTotal = result.data.total;
                    }else {
                        this.$message({
                            message:'系统正在升级中，请稍后再试',
                            type:'error'
                        });
                    }
                })
            },
            /* 无用 */
            getuserorglist () {
                var _result = [];
                this.multipleSelection = [];

                this.getAjax('/usergroup/getGroupUser/' + this.demid).then((result) => {
                    //result ={   "status" : 200,"error" : "成功","message" : "操作成功","data" : {     "demid" : 10000000460109,"orgcode" : "333","depth" : 3,"orgname" : "恒利搅拌站","remark" : null,"demid" : 10000000470184,"parentid" : 10000000460105,"sort" : null,"rsnum" : null,"status" : 0,"orgtype" : 3,"systemid" : 10000000460117,"creator" : 1,"createtime" : null,"editor" : null,"editdate" : null,"pageNo" : 1,"pageSize" : 10   } }
                    if (result.status == '200') {
                        _.each(result.data, (v, k)=> {
                            _result.push(v.userid)
                            _.each(this.employeelist, (ev, ek) => {
                                if (v.empid == ev.empid) {
                                    this.$refs.multipleTable.toggleRowSelection(this.employeelist[ek], true);
                                }
                            })

                        })
                        this.checkList = _result;
                    }
                })
            },
        }
    }

</script>
