<template>
    <div class="f-content">
        <div class="console-title">
            <h5 v-if="$handlePageType('add') == true">添加分类标识</h5>
            <h5 v-if="$handlePageType('edit') == true">修改分类标识</h5>
        </div>
        <el-card class="del-shadow">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px" :class="{'form-readonly':pageReadonly==true}">
                <el-col :span="11">
                    <el-form-item prop="typename" label="标识符名称">
                        <el-input v-model="form.typename" @blur="handlePinyin()"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="typekey" label="标识符别名">
                        <el-input v-model="form.typekey" :readonly="$handlePageType('edit')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                <el-form-item prop="idenflag" label="标识符类型">
                    <el-radio-group v-model="form.idenflag">
                        <el-radio label="0">分类</el-radio>
                        <el-radio label="1">参数设置</el-radio>
                    </el-radio-group>
                </el-form-item>
                </el-col>
                <el-col :span="11">
                <el-form-item prop="flag" label="是否可删除">
                    <el-radio-group v-model="form.flag">
                        <el-radio label="0">是</el-radio>
                        <el-radio label="1">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="sort" label="排序">
                        <el-input v-model="form.sort"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item class="f-tac ml0">
                        <el-button class="ui-color3" size="small" type="primary" @click="onSubmitAdd('ruleForm')"
                                   v-if="$handlePageType('add') == true">添加
                        </el-button>
                        <el-button class="ui-color3" size="small" type="primary" @click="onSubmitEdit('ruleForm')"
                                   v-if="$handlePageType('edit') == true">保存
                        </el-button>
                        <el-button class="ui-color2" size="small" @click="$router.push({name: 'msm_setting_typekey', query: {systemid: $store.state.systemid}})">取消</el-button>
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
                checkAll: true,
                form: {
                    typename: '',
                    typekey: '',
                    idenflag: '0',
                    flag: '0',
                    //nodepath: '',
                    //depth: '',
                    //parentid: '',
                    //catkey: '',
                    //sn: '',
                },
                rules: {
                    typename: [
                        {required: true, message: '请输入标识符名称', trigger: 'blur'},
                    ],
                    typekey: [
                        {required: true, message: '请输入标识符别名', trigger: 'blur'},
                        {min: 1, max: 30, message: '长度在 1 到 60 个字符', trigger: 'blur'},
                        {validator: this.validateChar, message: '请输入英文字符', trigger: 'blur'}
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
                if (this.$handlePageType('edit') == true) {
                    this.$route.params.id ? this.detailId = this.$route.params.id : this.$routeTo('msm_setting_typekey');
                    this.getDetail();
                }
            },
            onSubmitAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/typekey/save',this.objfilter(this.form),{
                            headers: {systemid: this.$store.state.systemid
                            }}).then((result) => {
                            this.$handleRes(result);
                            if(result.status=='200'){
                                //this.$routeTo('msm_setting_typekey');
                                this.$router.push({name: 'msm_setting_typekey', query: {systemid: this.$store.state.systemid}})
                            }
                        })
                    }
                })
            },
            onSubmitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/typekey/update',this.form,{
                            headers: {systemid: this.$store.state.systemid
                            }}).then((result) => {
                            this.$handleRes(result);
                            if(result.status=='200'){
                                this.$router.push({name: 'msm_setting_typekey', query: {systemid: this.$store.state.systemid}})
                            }
                        })
                    }
                })
            },
            getDetail(){
                this.getAjax('/sys/typekey/edit/'+this.detailId,{
                    headers: {systemid: this.$store.state.systemid
                    }}).then((result) => {
                    //this.$handleRes(result);
                    if(result.status=='200'){
                        this.form=this.handleItemstoString(result.data,['idenflag','flag']);//result.data
                    }
                })
            },
            handlePinyin(){
                this.getPingyin(this.form.typename).then((result) => {
                    this.form.typekey = result;
                })
            },
        }
    }
</script>
