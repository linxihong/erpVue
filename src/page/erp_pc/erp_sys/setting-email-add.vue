<template>
    <div class="f-content">
        <div class="console-title">
            <h5 v-if="$handlePageType('add') == true">添加邮箱设置</h5>
            <h5 v-if="$handlePageType('edit') == true">修改邮箱设置</h5>
            <h5 v-if="$handlePageType('detail') == true">邮箱设置详情</h5>
        </div>
        <el-card class="del-shadow">
            <el-form ref="form" :model="form" :rules="rules" label-width="130px">

                <el-col :span="12">
                    <el-form-item prop="mailname" label="账号名称">
                        <el-input v-model="form.mailname"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item prop="mailaddress" label="邮箱地址">
                        <el-input v-model="form.mailaddress"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item prop="mailtype" label="邮件类型">
                        <el-select v-model="form.mailtype" placeholder="请选择邮件类型" class="fulltable">
                            <el-option label="pop" value="1"></el-option>
                            <el-option label="stmp" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item prop="mailpass" label="邮箱密码">
                        <el-input v-model="form.mailpass"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item prop="smtphost" label="smtp主机">
                        <el-input v-model="form.smtphost"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item prop="smtpport" label="smtp端口">
                        <el-input v-model="form.smtpport"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item prop="pophost" label="pop主机">
                        <el-input v-model="form.pophost"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item prop="popport" label="pop端口">
                        <el-input v-model="form.popport"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item prop="isdefault" label="是否默认">
                        <el-radio-group v-model="form.isdefault">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item class="f-tac">
                        <el-button class="ui-color3" type="primary" @click="onSubmitAdd('form')"
                                   v-if="$handlePageType('add') == true">添加
                        </el-button>
                        <el-button class="ui-color3" type="primary" @click="onSubmitEdit('form')"
                                   v-if="$handlePageType('edit') == true">保存
                        </el-button>
                        <el-button class="ui-color2" @click="$routeTo('msm_setting_email',{id:'all'})">取消
                        </el-button>
                    </el-form-item>
                </el-col>

            </el-form>
        </el-card>
    </div>
</template>

<script type="es6">

    export default {
        name: 'list',
        data () {
            return {
                detailId: "",
                form: {
                    mailname: '',
                    mailaddress: '',
                    mailpass: '',
                    smtphost: '',
                    smtpport: '',
                    pophost: '',
                    popport: '',
                    isdefault: '',
                    mailtype: '1',
                },
                rules: {
                    mailname: [{required: true, message: '请输入邮箱名称', trigger: 'blur'}],
                    mailaddress: [{required: true, message: '请输入邮箱地址', trigger: 'blur'}],
                    mailpass: [{required: true, message: '请输入邮箱密码', trigger: 'blur'}],
                    smtphost: [{required: true, message: '请输入smtp主机', trigger: 'blur'}],
                    smtpport: [{required: true, message: '请输入smtp端口', trigger: 'blur'}],
                    pophost: [{required: true, message: '请输入pop主机', trigger: 'blur'}],
                    popport: [{required: true, message: '请输入pop端口', trigger: 'blur'}],
                    isdefault: [{required: true, message: '请输入是否默认', trigger: 'blur'}],
                    mailtype: [{required: true, message: '请输入邮件类型', trigger: 'blur'}],
                    sort: [{validator: this.validataSort, message: '请输入有效数字且大于0', trigger: 'blur'}],
                }
            }
        },
        watch: {
            '$route': function () {
                this.init();
            }
        },
        mounted () {
            this.init();
        },
        methods: {
            init(){
                if (this.$handlePageType('edit') == true) {
                    this.$route.params.id ? this.detailId = this.$route.params.id : this.$routeTo('msm_setting_gltype_detail',{id:'all'});
                    this.getdetail()
                }else if(this.$handlePageType('add') == true){
                    var _query=this.$route.query
                    _query.parentid ? this.form.parentid = _query.parentid : '';
                    _query.depth ? this.form.depth = _query.depth : '';
                    _query.catkey ? this.form.catkey = _query.catkey : '';
                    _query.typemrkid ? this.form.typemrkid = _query.typemrkid : '';
                }
            },
            onSubmitAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/mail/save',this.form,{
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            this.$handleRes(result);
                            if(result.status=='200'){
                                this.$routeTo('msm_setting_email');
                            }
                        })
                    }
                })
            },
            onSubmitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/mail/update',this.objfilter(this.form),{
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            this.$handleRes(result);
                            if(result.status=='200'){
                                this.$routeTo('msm_setting_email');
                            }
                        })
                    }
                })
            },
            getdetail(obj){
                this.getAjax('/sys/mail/edit/'+this.detailId,{
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if(result.status=='200'){
                        this.form=this.handleItemstoString(result.data,['isfolder','isdefault']);
                    }
                })
            },
            handlePinyin(){
                this.getPingyin(this.form.typename).then((result) => {
                    this.form.nodekey = result;
                })
            },
        }
    }


</script>
