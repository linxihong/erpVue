<template>
    <div class="f-content">
        <div class="console-title">
            <h5 v-if="$handlePageType('add') == true">添加账户</h5>
            <h5 v-if="$handlePageType('edit') == true">修改账户</h5>
        </div>
        <el-card class="del-shadow">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" :class="{'form-readonly':pageReadonly==true}">
                <el-col :span="12">
                    <el-form-item prop="auditid" label="系统日志ID">
                        <el-input v-model="form.auditid"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="opname" label="操作名称">
                        <el-input v-model="form.opname"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="exetime" label="执行时间">
                        <el-input v-model="form.exetime"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="executorid" label="执行人ID">
                        <el-input v-model="form.executorid"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="executor" label="执行人">
                        <el-input v-model="form.executor"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="fromip" label="IP">
                        <el-input v-model="form.fromip"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="exemethod" label="执行方法">
                        <el-input v-model="form.exemethod"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="requesturi" label="请求URL">
                        <el-input v-model="form.requesturi"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="reqparams" label="操作内容">
                        <el-input v-model="form.reqparams"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="operatetype" label="日志类型">
                        <el-input v-model="form.operatetype"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="systemid" label="系统ID'">
                        <el-input v-model="form.systemid"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="备注">
                        <el-input v-model="form.remark"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item class="f-tac">
                        <el-button class="ui-color3" type="primary" @click="onSubmitAdd('ruleForm')"
                                   v-if="$handlePageType('add') == true">添加
                        </el-button>
                        <el-button class="ui-color3" type="primary" @click="onSubmitEdit('ruleForm')"
                                   v-if="$handlePageType('edit') == true">保存
                        </el-button>
                        <el-button class="ui-color2" @click="$routeTo('msm_setting_subsystem')">取消</el-button>
                    </el-form-item>
                </el-col>


            </el-form>
        </el-card>
    </div>
</template>
<script type="text/ecmascript-6">
    const cityOptions = ['上海', '北京', '广州', '深圳'];
    export default {
        name: 'list',
        data () {
            return {
                detailId: '',
                form: {
                    account: '',
                    status: '',
                    ifadmin: '0',
                    isexpired: '0',
                    islock: '0',
                    usertype: '',
                    remark: '',
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
                        {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'},
                        {validator: this.validateChar, message: '请输入英文字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
                    ],
                    usertype: [
                        {required: true, message: '请选择类型', trigger: 'blur'},
                    ],
                }
            }
        },
        mounted () {
            if (this.$handlePageType('edit') == true) {
                this.detailId = this.$route.params.id;
                this.getDetail();
            }
        },
        methods: {
            onSubmitAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/audit/save', this.form).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$routeTo('msm_setting_subsystem');
                            }
                        })
                    }
                });
            },
            onSubmitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/audit/update', this.form).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$routeTo('msm_setting_subsystem');
                            }
                        })
                    }
                });
            },
            getDetail(){
                this.getAjax('/sys/audit/edit/' + this.detailId).then((result) => {
                    if (result.status == '200') {
                        this.form = this.handleItemstoString(result.data, []);
                    }
                })
            },
        }
    }
</script>
