<template>
    <div class="page-secondnav page-commonnav" ref="pageHeight">
        <div class="f-content">
            <div class="console-pt4 console-pb4" ref="btnHeight">
                <el-button class="ui-color3" v-auth="ifHasAuth('add')" @cb="init" @click="ifHasAuth('add')&&$routeTo('msm_account_add')">添加</el-button>
                <div class="pull-right">
                    <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowBot">更多查询<i class="el-icon-arrow-down margin-2"></i></span>
                    <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowTop">更多查询<i class="el-icon-arrow-up margin-2"></i></span>
                </div>
            </div>

            <div v-show="searchVisible" ref="formHeight" class="console-pb4">
                <el-card class="box-card__form">
                    <el-form ref="filterform" :model="filterform" label-width="80px" class="filterform cf" @keyup.enter.native="ifHasAuth('search')&&onSubmitFilterform()">
                        <el-form-item label="帐号" prop="account">
                            <el-input v-model="filterform.account" placeholder="帐号"></el-input>
                        </el-form-item>

                        <el-form-item label="帐号名称" prop="fullname">
                            <el-input v-model="filterform.fullname" placeholder="帐号名称"></el-input>
                        </el-form-item>

                        <el-form-item label="员工姓名" prop="empName">
                            <el-input v-model="filterform.empName" placeholder="员工姓名"></el-input>
                        </el-form-item>

                        <!-- <el-form-item label="是否过期" prop="isexpired">
                             <el-select v-model="filterform.isexpired" clearable placeholder="是否过期">
                                 <el-option label="过期" value="1"></el-option>
                                 <el-option label="未过期" value="0"></el-option>
                             </el-select>
                         </el-form-item>-->

                        <el-form-item label="锁定" prop="islock">
                            <el-select v-model="filterform.islock" clearable placeholder="是否锁定">
                                <el-option label="锁定" value="1"></el-option>
                                <el-option label="未锁定" value="0"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="状态" prop="status">
                            <el-select v-model="filterform.status" clearable placeholder="状态">
                                <el-option label="激活" value="0"></el-option>
                                <el-option label="未激活" value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="创建时间" prop="createTime">
                            <el-date-picker
                                    v-model="filterform.createTime"
                                    type="daterange"
                                    align="right"
                                    placeholder="创建时间范围"
                                    :picker-options="dateOption">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="ui-color3" v-auth="ifHasAuth('search')" @click="ifHasAuth('search')&&onSubmitFilterform()">查询</el-button>
                            <el-button class="ui-color2" v-auth="ifHasAuth('reset')" @click="ifHasAuth('reset')&&onSubmitFilterform('reset','filterform')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>

            <!--:class="{'btnReadonly':ifHasAuth('save')==false}"-->
            <el-table
                    :data="tableData"
                    :height="tabHeight"
                    @selection-change="handleSelectionChange"
                    class="console-width-12">
                <el-table-column
                        type="selection"
                        width="50">
                </el-table-column>

                <el-table-column
                        label="排序"
                        class-name="tbSort"
                        prop="sort"
                        width="120">
                    <template slot-scope="scope">
                        <el-input size="small" v-model="scope.row.sort" placeholder="排序">
                            <el-button slot="append" icon="check" @click="handleSorticonClick(scope.row)"></el-button>
                        </el-input>
                    </template>
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
                        prop="empName"
                        label="员工姓名"
                        width="">
                </el-table-column>

                <el-table-column
                        prop="ifadmin"
                        label="管理员"
                        width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.ifadmin==1">是</span>
                        <span v-if="scope.row.ifadmin==0">否</span>
                    </template>
                </el-table-column>

                <el-table-column
                        prop="islock"
                        label="锁定"
                        width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.islock==1">锁定</span>
                        <span v-if="scope.row.islock==0">未锁定</span>
                    </template>
                </el-table-column>

                <!--<el-table-column
                        prop="isexpired"
                        label="是否过期"
                        width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isexpired==1">过期</span>
                        <span v-if="scope.row.isexpired==0">未过期</span>
                    </template>
                </el-table-column>-->

                <el-table-column
                        prop="status"
                        label="状态"
                        width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==0">激活</span>
                        <span v-if="scope.row.status==1">未激活</span>
                    </template>
                </el-table-column>

                <el-table-column
                        prop="createtime"
                        width="110"
                        label="创建时间">
                    <template slot-scope="scope">
                        {{formatDate(scope.row.createtime)}}
                    </template>
                </el-table-column>

                <el-table-column
                        label="操作"
                        width="360">
                    <template slot-scope="scope">
                        <el-button class="btn-color" type="text" v-auth="ifHasAuth('details')" @click="ifHasAuth('details')&&$router.push({ name:'msm_account_detail',params:{id:scope.row.userid}})">详情</el-button>
                        <span class="color-2">|</span>
                        <el-button class="btn-color" type="text" v-auth="ifHasAuth('details')" @click="ifHasAuth('details')&&$handleEditClick([scope.row],{routeTo:'msm_account_edit',type:'edit'})">修改</el-button>
                        <span class="color-2">|</span>
                        <el-button class="btn-color" type="text" v-auth="ifHasAuth('delete')" @click="ifHasAuth('delete')&&handleDelete([scope.row])" :disabled="scope.row.ifadmin==1">删除</el-button>
                        <span class="color-2">|</span>
                        <user-account-picker style="display:inline-block;" btn-text="员工分配" :mSelection='scope.row' @cb="init"></user-account-picker>
                        <span class="color-2">|</span>
                        <el-button class="btn-color" type="text" @click="handleDeleteEmp([scope.row.userid])" size="small">移除员工</el-button>
                        <span class="color-2">|</span>
                        <el-button class="btn-color" type="text" v-auth="ifHasAuth('resetpassword')" @click="ifHasAuth('resetpassword')&&handleResetpsdDialog([scope.row])" size="small">重置密码</el-button>
                    </template>
                </el-table-column>
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

            <el-dialog class="dialogDiv dialogDivII" :show-close="false" :visible.sync="dialogFormVisible" size="tiny">
                <div class="slideContent">
                    <div class="leftDiv">
                        <span class="icon-setting-2 icon-close" @click="dialogFormVisible = false"></span>
                        <span class="icon-setting-1 icon-confirm" @click="onSubmitResetpsdform('resetpsd')"></span>
                    </div>
                    <div class="slideTop" v-drag1>重置密码</div>
                    <div class="slideMid">
                        <el-form ref="resetpsd"  label-width="100" :model="resetpsd" :rules="resetpsdrules"  class="console-mb11 item-bottom">
                            <el-form-item prop="password" label="新密码：" class="console-mb10">
                                <el-input v-model="resetpsd.password" type="password" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item prop="checkpsd" label="确认新密码：">
                                <el-input v-model="resetpsd.checkpsd" type="password" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button class="ui-color2" @click="dialogFormVisible = false">取 消</el-button>-->
                <!--<el-button class="ui-color3" type="primary" @click="onSubmitResetpsdform('resetpsd')">确 定</el-button>-->
                <!--</div>-->
            </el-dialog>
        </div>
    </div>
</template>
<script type="es6">
    export default {
        name: 'account',
        data () {
            return {
                tabHeight: '416px',
                height: null,
                dialogFormVisible: false,
                resetpsd: {
                    password: '',
                    checkpsd: ''
                },
                filterform: {
                    account: '',
                    fullname: '',
                    empName: '',
                    isexpired: '',
                    islock: '',
                    status: '',
                    createTime: [],
                    pageNo: this.cPage,
                    pageSize: this.cSize,
                },
                tableData: [],
                resetpsdrules: {
                    password: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                    ],
                    checkpsd: [
                        {validator: this._validateCheckPsd, check: ['resetpsd'], trigger: 'blur'},
                    ],
                },
                arrowBot: true,
                arrowTop: false,
                searchVisible: true,
                formHeight: null,
            }
        },
        mounted () {
            this.init();
            setTimeout(()=>{
                this.getDivHeight();
            },20)
        },
        methods: {
            _validateCheckPsd(rule, value, callback){
                this.validateCheckPsd(rule, value, callback, this.resetpsd.password)
            },
            init(){
                this.getlist();
                this.getAuthlist();
            },

            getDivHeight(){
                const pageHeight = this.$refs.pageHeight.offsetHeight;
                const btnHeight = this.$refs.btnHeight.offsetHeight;
                this.formHeight = this.$refs.formHeight.offsetHeight;
                this.height = pageHeight-btnHeight-this.$store.state.pageHeight;
                this.tabHeight = this.height-this.formHeight;
            },

            //切换显示状态
            toggleSearch(){
                this.arrowBot = !this.arrowBot;
                this.arrowTop = !this.arrowTop;
                this.searchVisible = !this.searchVisible;
                if (this.searchVisible) {
                    setTimeout(() => {
                        this.tabHeight = this.height - this.formHeight;
                    },20)
                } else {
                    this.tabHeight = this.height;
                }
            },

            getlist(){
                this.tableData = [];
                this.fetch('/sys/user/getAll', this.objfilter({
                    account: this.filterform.account,
                    fullname: this.filterform.fullname,
                    empName: this.filterform.empName,
                    isexpired: this.filterform.isexpired,
                    islock: this.filterform.islock,
                    status: this.filterform.status,
                    createtimeStart: this.filterform.createTime ? this.formatDate(this.filterform.createTime[0], 'timestamp') : "",
                    createtimeEnd: this.filterform.createTime ? this.formatDate(this.filterform.createTime[1], 'timestamp') : "",
                    pageNo: this.cPage,
                    pageSize: this.cSize,
                }),{
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if (result.status == '200') {
                        this.tableData = result.data.list;
                        this.cTotal = result.data.total;
                    }
                })
            },
            handleResetpsdDialog(obj){
                this.resetpsd.password = '';
                this.resetpsd.checkpsd = '';
                if (obj.length == 1) {
                    this.dialogFormVisible = true;
                    this.resetpsd.userid = obj[0].userid;
                } else {
                    this.$message.warning('请选择一项修改密码')
                }
            },
            onSubmitResetpsdform(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/user/resetPwd', this.objfilter(this.resetpsd),{
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            this.$handleRes(result);
                            this.dialogFormVisible = false;
                        })
                    }
                })
            },
            onSubmitFilterform(type, opt) {
                if (type == 'reset') {
                    this.$refs[opt].resetFields();
                }
                this.getlist();
            },
            handleDelete(obj){
                let _delitems = [];
                if (obj.length > 0) {
                    _.each(obj, function (val, key) {
                        val.userid ? _delitems.push(val.userid) : '';
                    });
                    this.handleDelCommon('/sys/user/delete/'+_delitems.join(','), () => {
                        this.getlist()
                    });
                } else {
                    this.$message.warning('请选择一项删除')
                }
            },
            handleDeleteEmp(userid) {
                this.deleteAjax('/sys/user/removeEmp/'+userid)
                    .then(result => {
                        if (result.status === 200) {
                            this.$message({
                                message: result.message,
                                type: 'success'
                            });
                            this.getlist();
                        } else {
                            this.$message({
                                message: this.returnIntercept(result),
                                type: 'error'
                            })
                        }
                    })
            },
            /* 列表排序 */
            handleSorticonClick(row){
                if(this.handlesortfilter(row.sort.toString())){
                    this.getAjax('/sys/user/updatesort/'+ row.userid+'/'+ row.sort).then((result) => {
                        this.$handleRes(result);
                        this.getlist();
                    })
                }
            }
        }
    }


</script>
