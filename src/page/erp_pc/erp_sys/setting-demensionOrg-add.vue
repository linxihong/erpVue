<template>
    <div class="f-content">
        <div class="console-title">
            <h5 v-if="$handlePageType('add') == true">添加维度</h5>
            <h5 v-if="$handlePageType('edit') == true">修改维度</h5>
        </div>
        <el-card class="del-shadow">
            <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                <el-col :span="11">
                    <el-form-item prop="demname" label="维度名称">
                        <el-input v-model="form.demname" @blur="handlePinyin"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="11">
                    <el-form-item prop="alias" label="维度别名">
                        <el-input v-model="form.alias" :readonly="$handlePageType('edit')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="11">
                    <el-form-item label="维度描述">
                        <el-input v-model="form.demdesc"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="demtype" label="类型">
                        <el-select v-model="form.demtype" placeholder="请选择类型" class="fulltable">
                            <el-option label="行政维度" value="1"></el-option>
                            <el-option label="自定义维度" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item class="f-tac ml0">
                        <el-button class="ui-color3" type="primary" @click="onSubmitAdd('form')"
                                   v-if="$handlePageType('add') == true">添加
                        </el-button>
                        <el-button class="ui-color3" type="primary" @click="onSubmitEdit('form')"
                                   v-if="$handlePageType('edit') == true">保存
                        </el-button>
                        <el-button class="ui-color2" @click="$routeTo('msm_setting_demension_org')">取消</el-button>
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
                    demname: '',
                    alias: '',
                    demdesc: '',
                    demtype: '2',
                },
                rules: {
                    demname: [
                        {required: true, message: '请输入维度名称', trigger: 'blur'},
                    ],
                    alias: [
                        {required: true, message: '请输入维度别名', trigger: 'blur'},
                        {validator: this.validataString, message: '请输入英文字符', trigger: 'blur'}
                    ],
                    sort: [{validator: this.validataSort, message: '请输入有效数字且大于0', trigger: 'blur'}],
                }
            }
        },
        mounted () {
            this.init();
        },
        methods: {
            init(){
                if (this.$handlePageType('add') == false) {
                    this.$route.params.id ? this.detailId = this.$route.params.id : this.$routeTo('msm_setting_gltype')
                    this.getdetail();
                }
            },
            onSubmitAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/demension/save', this.form).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$routeTo('msm_setting_demension_org');
                            }
                        })
                    }
                })
            },
            onSubmitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/demension/update', this.form).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$routeTo('msm_setting_demension_org');
                            }
                        })
                    }
                })
            },
            getdetail(obj){
                this.getAjax('/sys/demension/edit/' + this.detailId).then((result) => {
                    if (result.status == '200') {
                        this.form = this.handleItemstoString(result.data, ['demtype']);
                    }
                })
            },
            handlePinyin(){
                this.getPingyin(this.form.demname).then((result) => {
                    this.form.alias = result;
                })
            },
        }
    }


</script>
