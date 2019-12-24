<template>
    <div class="f-content">
        <div class="console-title">
            <h5 v-if="$handlePageType('add') == true">添加子系统</h5>
            <h5 v-if="$handlePageType('edit') == true">修改子系统</h5>
            <h5 v-if="$handlePageType('detail') == true">子系统详情</h5>
        </div>
        <el-card class="del-shadow">
            <el-form ref="filterform" :model="filterform" :rules="rules" label-width="140px" :class="{'form-readonly':pageReadonly==true}">
                <el-col :span="11">
                    <el-form-item prop="sysname" label="子系统名称">
                        <el-input :readonly="pageReadonly" v-model="filterform.sysname" @blur="handlePinyin()"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="alias" label="别名">
                        <el-input :readonly="pageReadonly" v-model="filterform.alias" :disabled="aliasreadonly"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="logo" label="子系统图标">
                        <!--<el-input :readonly="pageReadonly" v-model="filterform.logo"></el-input>-->
                        <i :class="filterform.logo"></i>
                        <iconmenu :readonly="pageReadonly" v-model="filterform.logo"  v-if="$handlePageType('detail') != true"></iconmenu>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="defaulturl" label="默认地址">
                        <el-input :readonly="pageReadonly" v-model="filterform.defaulturl"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="allowdel" label="允许删除">
                        <el-select :disabled="pageReadonly" v-model="filterform.allowdel" clearable placeholder="是否允许删除" class="fulltable">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="isactive" label="是否激活">
                        <el-select :disabled="pageReadonly" v-model="filterform.isactive" clearable placeholder="是否激活" class="fulltable">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="islocal" label="是否本地系统">
                        <el-select :disabled="pageReadonly" v-model="filterform.islocal" clearable placeholder="是否本地系统" class="fulltable">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="homepage" label="首页地址">
                        <el-input :readonly="pageReadonly" v-model="filterform.homepage"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="sort" label="排序">
                        <el-input :readonly="pageReadonly" v-model="filterform.sort"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="remark" label="备注">
                        <el-input type="textarea" :readonly="pageReadonly" v-model="filterform.remark" :rows="2"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item class="f-tac ml0 mt20">
                        <el-button class="ui-color3" size="small" type="primary" @click="onSubmitAdd('filterform')"
                                   v-if="$handlePageType('add') == true">添加
                        </el-button>
                        <el-button class="ui-color3" size="small" type="primary" @click="onSubmitEdit('filterform')"
                                   v-if="$handlePageType('edit') == true">保存
                        </el-button>
                        <el-button class="ui-color2" size="small" @click="$routeTo('msm_setting_subsystem')">
                            <span v-if="$handlePageType('detail') != true">取消</span>
                            <span v-if="$handlePageType('detail') == true">返回</span>
                        </el-button>
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
                aliasreadonly: false,

                filterform: {
                    sysname: '',
                    alias: '',
                    logo: '',
                    defaulturl: '',
                    allowdel: '0',
                    isactive: '0',
                    islocal: '0',
                    homepage: '',
                    sort: '',
                    remark: '',
                },
                rules: {
                    systemid: [{required: true, message: '请输入系统ID', trigger: 'blur'}],
                    orgid: [{required: true, message: '请输入组织ID', trigger: 'blur'}],
                    sysname: [{required: true, message: '请输入子系统名称', trigger: 'blur'}],
                    alias: [{required: true, message: '请输入别名', trigger: 'blur'},
                        {validator: this.validateChar, message: '请输入英文字符', trigger: 'blur'}],
                    //logo: [{required: true, message: '请输入子系统图标', trigger: 'blur'}],
                    //defaulturl: [{required: true, message: '请输入默认地址', trigger: 'blur'}],
                    //allowdel: [{required: true, message: '请输入允许删除', trigger: 'blur'}],
                    needorg: [{required: true, message: '请输入选择组织架构', trigger: 'blur'}],
                   // isactive: [{required: true, message: '请输入是否激活', trigger: 'blur'}],
                    //islocal: [{required: true, message: '请输入是否本地系统', trigger: 'blur'}],
                    sort: [{validator:this.validataSort, message: '请输入有效数字且大于0', trigger: 'blur'}],
                }
            }
        },
        mounted () {
            this.init();
            //this.getlist();
        },
        methods: {
            init(){
                if(this.$handlePageType('edit') == true){
                    this.aliasreadonly = true;
                }
                if (this.$handlePageType('edit') == true||this.$handlePageType('detail') == true) {
                    this.$route.params.id ? this.detailId = this.$route.params.id : this.$routeTo('msm_setting_subsystem_list');
                    this.getdetail()
                }

            },
            onSubmitAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/subsystem/save', this.filterform).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$parent.treeOptions = [];
                                this.$routeTo('msm_setting_subsystem');
                            }
                        })
                    }
                })
            },
            onSubmitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/subsystem/update', this.filterform).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$parent.treeOptions = [];
                                this.$routeTo('msm_setting_subsystem');
                            }
                        })
                    }
                })
            },
            getdetail(obj){
                this.getAjax('/sys/subsystem/edit/' + this.detailId).then((result) => {
                    if (result.status == '200') {
                        this.filterform = this.handleItemstoString(result.data, ['allowdel', 'isactive', 'islocal']);
                    }
                })
            },
            handlePinyin(){
                this.getPingyin(this.filterform.sysname).then((result) => {
                    this.filterform.alias = result;
                })
            },
        }
    }


</script>
