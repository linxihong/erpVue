<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content">
        <div class="console-title">
            <h5 v-if="$handlePageType('add') == true">添加账户</h5>
            <h5 v-if="$handlePageType('edit') == true">修改账户</h5>
        </div>
        <el-card class="del-shadow">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="140px" :class="{'form-readonly':pageReadonly==true}">
                <el-col :span="11">
                    <el-form-item prop="account" label="账号">
                        <el-input v-model="form.account"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="fullname" label="账号名称">
                        <el-input v-model="form.fullname"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" v-if="$handlePageType('add') == true">
                    <el-form-item prop="password" label="密码">
                        <el-input v-model="form.password" type="password" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="systemid" label="子系统">
                        <el-select v-model="form.systemid" placeholder="请选择子系统" class="fulltable">
                            <el-option
                                    v-for="item in subsystemlist"
                                    :key="item.systemid"
                                    :label="item.sysname"
                                    :value="handletoString(item.systemid)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!--<el-col :span="11">
                    <el-form-item prop="usertype" label="类型">
                        <el-select v-model="form.usertype" placeholder="请选择类型" @change="handleUsertype">
                            <el-option label="管理员" value="1"></el-option>
                            <el-option label="员工主账号" value="2"></el-option>
                            <el-option label="员工子账号" value="3"></el-option>
                            <el-option label="客户主账号" value="4"></el-option>
                            <el-option label="客户子帐号" value="5"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>-->
                <el-col :span="11">
                    <el-form-item label="管理员标志">
                        <el-select v-model="form.ifadmin" placeholder="请选择管理员标志" class="fulltable">
                            <el-option
                                    v-for="item in ifadminoptions"
                                    :disabled="form.usertype==1&&item.value==0"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
               <!-- <el-col :span="11">
                    <el-form-item label="是否过期">
                        <el-radio-group v-model="form.isexpired">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>-->
                <el-col :span="11">
                    <el-form-item label="是否锁定">
                        <el-radio-group v-model="form.islock">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                <el-col :span="11">
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="form.remark" :rows="2"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item class="f-tac console-mt5">
                        <el-button class="ui-color3" type="primary" @click="onSubmitAdd('ruleForm')" v-if="$handlePageType('add') == true">添加</el-button>
                        <el-button class="ui-color3" type="primary" @click="onSubmitEdit('ruleForm')" v-if="$handlePageType('edit') == true">保存</el-button>
                        <el-button class="ui-color2" @click="$routeTo('msm_account')">取消</el-button>
                    </el-form-item>
                </el-col>


            </el-form>
        </el-card>
    </div>
    </div>
</template>
<script type="text/ecmascript-6">

    export default {
        name: 'list',
        data () {
            return {
                detailId: '',
                subsystemlist: "",
                form: {
                    account: '',
                    fullname: '',
                    status: '',
                    ifadmin: '0',
                    isexpired: '0',
                    islock: '0',
                    usertype: '',
                    systemid: '',
                    remark: ''
                },
                ifadminoptions: [
                    {
                        value: '1',
                        label: '是'
                    }, {
                        value: '0',
                        label: '否'
                    }
                ],
                rules: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                      /*  {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'},
                        {validator: this.validateChar, message: '请输入英文字符', trigger: 'blur'}*/
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        /*{min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}*/
                    ],
                    usertype: [
                        {required: true, message: '请选择类型', trigger: 'blur'},
                    ],
                    sort: [{validator: this.validataSort, message: '请输入有效数字且大于0', trigger: 'blur'}],
                }
            }
        },
        activated () {
            this.getAuthlist();
            if (this.$handlePageType('edit') == true||this.$handlePageType('add') == true) {
                this.getsubsystem()
            }
            if (this.$handlePageType('edit') == true) {
                this.detailId = this.$route.params.id;
                this.getDetail();
            }
        },
        methods: {
            onSubmitAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/user/save', this.form).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$refs[formName].resetFields();
                                this.$routeTo('msm_account');
                            }
                        })
                    }
                });
            },
            onSubmitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/user/update', this.form).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$refs[formName].resetFields();
                                this.$routeTo('msm_account');
                            }
                        })
                    }
                });
            },
            getDetail(){
                this.getAjax('/sys/user/edit/' + this.detailId).then((result) => {
                    if (result.status == '200') {
                        this.form = this.handleItemstoString(result.data, ['usertype', 'ifadmin', 'isexpired', 'islock', 'systemid']);
                    }
                })
            },
            handleUsertype(){
                if(this.form.usertype==1){
                    this.form.ifadmin='1'
                }
            },
            getsubsystem(){
                this.getAjax('/sys/subsystem/getsubsystem/').then((result) => {
                    //result = {"msg":"成功","data":[{"alias":"hlfgs","allowdel":1,"createtime":"2017-08-18 10:18:27","creator":1,"defaulturl":"http://192.168.0.118:8080","editdate":null,"editor":0,"homepage":"http://192.168.0.118:8080","isactive":1,"islocal":1,"logo":"fa fa-address-book-o","orgid":0,"pageNo":1,"pageSize":10,"remark":"恒利分公司","sort":2,"sysname":"恒利分公司","systemid":10000000460113},{"alias":"hljbz","allowdel":0,"createtime":"2017-08-18 10:22:55","creator":1,"defaulturl":"http://192.168.0.118:8080","editdate":null,"editor":0,"homepage":"","isactive":1,"islocal":0,"logo":"fa fa-address-book","orgid":0,"pageNo":1,"pageSize":10,"remark":"恒利搅拌站","sort":3,"sysname":"恒利搅拌站","systemid":10000000460117}],"error":"","status":200}
                    if (result.status == '200') {
                        this.subsystemlist = result.data;
                        if (result.data&&result.data.length>0&&this.$handlePageType('add') == true){
                            result.data[0].systemid?this.form.systemid = result.data[0].systemid.toString():'';
                        }
                    }
                })
            },
        }
    }
</script>
