<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content">
        <div class="console-title">
            <h5 v-if="$handlePageType('add') == true">添加角色</h5>
            <h5 v-if="$handlePageType('edit') == true">修改角色</h5>
        </div>
        <el-card class="del-shadow">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px" :class="{'form-readonly':pageReadonly==true}">
                <el-col :span="11">
                    <el-form-item prop="rolename" label="角色名称">
                        <el-input v-model="form.rolename" @blur="handlePinyin"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="11">
                    <el-form-item prop="alias" label="角色别名">
                        <el-input v-model="form.alias" :readonly="$handlePageType('edit')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="allowdel" label="允许删除">
                        <el-select v-model="form.allowdel" clearable placeholder="允许删除" class="fulltable">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
              <!--  <el-col :span="11">
                    <el-form-item prop="allowedit" label="允许修改">
                        <el-select v-model="form.allowedit" clearable placeholder="允许修改">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>-->
                <el-col :span="11">
                    <el-form-item prop="enabled" label="是否启用">
                        <el-select v-model="form.enabled" clearable placeholder="是否启用" class="fulltable">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="remark" label="备注">
                        <el-input type="textarea" v-model="form.remark" :rows="2"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item class="f-tac ml0 console-mt5">
                        <el-button class="ui-color3" type="primary" @click="onSubmitAdd('ruleForm')"
                                   v-if="$handlePageType('add') == true">添加
                        </el-button>
                        <el-button class="ui-color3" type="primary" @click="onSubmitEdit('ruleForm')"
                                   v-if="$handlePageType('edit') == true">保存
                        </el-button>
                        <el-button class="ui-color2" @click="$routeTo('msm_role')">取消</el-button>
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
                form: {
                    "alias":"",
                    "rolename":"",
                    "allowdel":"0",
                    "allowedit":"0",
                    "enabled":"1",
                    "remark":"",
                },
                config_yn: [
                    {
                        value: '1',
                        label: '是'
                    }, {
                        value: '0',
                        label: '否'
                    }
                ],
                rules: {
                    alias: [{required: true, message: '请输入角色别名', trigger: 'blur'}],
                    rolename: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
                    allowdel: [{required: true, message: '请输入允许删除', trigger: 'blur'}],
                    allowedit: [{required: true, message: '请输入允许修改', trigger: 'blur'}],
                    enabled: [{required: true, message: '请输入是否启用', trigger: 'blur'}],
                    sort: [{validator: this.validataSort, message: '请输入有效数字且大于0', trigger: 'blur'}],
                }
            }
        },
        activated () {
            this.init();
        },
        methods: {
            init(){
                if (this.$handlePageType('edit') == true) {
                    this.$route.params.id ? this.detailId = this.$route.params.id : this.$routeTo('msm_role');
                    this.getDetail()
                }else {
                    this.clearForm();
                }
            },
            onSubmitAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/role/save', this.objfilter(this.form)).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$routeTo('msm_role');
                            }
                        })
                    }
                });
            },
            onSubmitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/role/update', this.objfilter(this.form)).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$routeTo('msm_role');
                            }
                        })
                    }
                });
            },
            getDetail(){
                this.getAjax('/sys/role/edit/' + this.detailId).then((result) => {
                    if (result.status == '200') {
                        this.form = this.handleItemstoString(result.data, ['allowdel', 'allowedit', 'enabled']);
                    }
                })
            },
            handlePinyin(){
                this.getPingyin(this.form.rolename).then((result) => {
                    this.form.alias = result;
                })
            },

            //清空
            clearForm(){
                this.form= {
                    "alias":"",
                    "rolename":"",
                    "allowdel":"0",
                    "allowedit":"0",
                    "enabled":"1",
                    "remark":""
                }
            }
        }
    }
</script>
