<template>
    <div class="">
        <div class="console-title">
            <h5 v-if="$handlePageType('add') == true">添加岗位</h5>
            <h5 v-if="$handlePageType('edit') == true">修改岗位</h5>
        </div>
        <el-card class="del-shadow">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px" :class="{'form-readonly':pageReadonly==true}">
                <el-col :span="12">
                    <el-form-item prop="posname" label="岗位名称">
                        <el-input v-model="form.posname" @blur="handlePinyin"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="alias" label="别名">
                        <el-input v-model="form.alias"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item prop="posdesc" label="岗位描述">
                        <el-input v-model="form.posdesc"></el-input>
                    </el-form-item>
                </el-col>
<!--
                <el-col :span="12">
                    <el-form-item prop="isleaf" label="是否页节点">
                        <el-radio-group v-model="form.isleaf">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>-->

                <el-col :span="24">
                    <el-form-item class="f-tac">
                        <el-button type="primary" @click="onSubmitAdd('ruleForm')" v-if="$handlePageType('add') == true">添加</el-button>
                        <el-button type="primary" @click="onSubmitEdit('ruleForm')" v-if="$handlePageType('edit') == true">保存</el-button>
                        <el-button @click="$routeTo('msm_station_list')">取消</el-button>
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
                isIndeterminate: true,
                checkAll: true,
                form: {
                    "posname":"",
                    "posdesc":"",
                    "isleaf":"0",
                    "alias":"",
                },
                rules: {
                    posname: [{required: true, message: '请输入岗位名称', trigger: 'blur'}],
                    posdesc: [{required: true, message: '请输入岗位描述', trigger: 'blur'}],
                    parentid: [{required: true, message: '请输入上级岗位', trigger: 'blur'}],
                    nodepath: [{required: true, message: '请输入路径', trigger: 'blur'}],
                    depth: [{required: true, message: '请输入层次', trigger: 'blur'}],
                    sort: [{validator: this.validataSort, message: '请输入有效数字且大于0', trigger: 'blur'}],
                    isleaf: [{required: true, message: '请输入是否页节点', trigger: 'blur'}],
                    alias: [{required: true, message: '请输入别名', trigger: 'blur'}],
                },
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
                }
            },
            onSubmitAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/position/save',this.form).then((result) => {
                            this.$handleRes(result);
                            if(result.status=='200'){
                                this.$routeTo('msm_station_list');
                            }
                        })
                    }
                });
            },
            onSubmitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/position/update',this.objfilter(this.form)).then((result) => {
                            this.$handleRes(result);
                            if(result.status=='200'){
                                this.$routeTo('msm_station_list');
                            }
                        })
                    }
                });
            },
            getDetail(){
                this.getAjax('/sys/position/edit/'+this.detailId).then((result) => {
                    this.$handleRes(result);
                    if(result.status=='200'){
                        this.form=this.handleItemstoString(result.data,[]);
                    }
                })
            },
            handlePinyin(){
                this.getPingyin(this.form.posname).then((result) => {
                    this.form.alias = result;
                })
            },
        }
    }


</script>
