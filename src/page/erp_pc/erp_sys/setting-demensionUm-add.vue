<template>
    <div class="">
        <div class="console-title">
            <h5 v-if="$handlePageType('add') == true">添加用户组</h5>
            <h5 v-if="$handlePageType('edit') == true">修改用户组</h5>
        </div>
        <el-card class="del-shadow">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-col :span="24">
                    <el-form-item prop="orgname" label="用户组名称">
                        <el-input v-model="form.orgname"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item prop="orgcode" label="用户组编码">
                        <el-input v-model="form.orgcode"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item prop="remark" label="备注">
                        <el-input v-model="form.remark"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item class="f-tac ml0">
                        <el-button size="small" type="primary" @click="onSubmitAdd('form')"
                                   v-if="$handlePageType('add') == true">添加
                        </el-button>
                        <el-button size="small" type="primary" @click="onSubmitEdit('form')"
                                   v-if="$handlePageType('edit') == true">保存
                        </el-button>
                        <el-button size="small" @click="$routeTo('msm_setting_demension_um')">取消</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-card>
    </div>
</template>
<script type="text/ecmascript-6">

    export default {
        name: 'list',
        data () {
            return {
                detailId: "",
                form: {
                    orgcode: '',
                    orgname: '',
                    remark: ''
                },
                rules: {
                    orgcode: [
                        {required: true, message: '请输入用户组名称', trigger: 'blur'},
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
                if (this.$handlePageType('edit') == true||this.$handlePageType('detail') == true) {
                    this.detailId = this.$route.params.id
                    this.getdetail()
                }else if(this.$handlePageType('add') == true){
                    var _query=this.$route.query;
                    _query.parentid!=undefined ? this.form.parentid = _query.parentid : '';
                    _query.depth!=undefined ? this.form.depth = _query.depth : '';
                    _query.demid!=undefined ? this.form.demid = _query.demid : '';
                }
            },
            onSubmitAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/org/save', this.form).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$routeTo('msm_setting_demension_um');
                            }
                        })
                    }
                })
            },
            onSubmitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/org/update', this.form).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$routeTo('msm_setting_demension_um');
                            }
                        })
                    }
                })
            },
            getdetail(obj){
                this.getAjax('/sys/org/edit/' + this.detailId).then( (result) => {
                    if (result.status == '200') {
                        this.form = this.handleItemstoString(result.data, []);
                    }
                })
            },
        }
    }


</script>
