<template>
    <div>
        <div class="right-header console-pt5 console-pb5">
            <div class="console-title console-ml10">
                <span class="color-12 ui-font" v-if="$handlePageType('add') == true">添加参数管理</span>
                <span class="color-12 ui-font" v-if="$handlePageType('edit') == true">修改参数管理</span>
            </div>
        </div>
        <div class="right-body">
            <el-card class="del-shadow console-mt6">
                <el-form ref="form" :model="form" :rules="rules" label-width="130px">
                    <el-col :span="11">
                        <el-form-item prop="itemname" label="参数名称">
                            <el-input v-model="form.itemname" @blur="handlePinyin"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="itemkey" label="参数编码">
                            <el-input v-model="form.itemkey" :readonly="$handlePageType('edit')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="itemvalue" label="参数值">
                            <el-input v-model="form.itemvalue"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="nodekey" label="分类编码">
                            <el-input v-model="form.nodekey" readonly="readonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="sort" label="排序号">
                            <el-input v-model="form.sort"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="11">
                        <el-form-item prop="iscache" label="状态">
                            <el-radio-group v-model="form.iscache">
                                <el-radio label="1">启用</el-radio>
                                <el-radio label="0">停用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>

                    <el-col :span="11" v-for="item in fieldlist" key="item.label">
                        <el-form-item :label="item.label">
                            <el-input v-model="form[item.model]"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="11">
                        <el-form-item prop="remark" label="备注">
                            <el-input type="textarea" :rows="2" v-model="form.remark"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item class="f-tac">
                            <el-button class="ui-color3" type="primary" @click="onSubmitAdd('form')" v-if="$handlePageType('add') == true">添加</el-button>
                            <el-button class="ui-color3" type="primary" @click="onSubmitEdit('form')" v-if="$handlePageType('edit') == true">保存</el-button>
                            <el-button class="ui-color2" @click="$router.back()">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-card>
        </div>
    </div>
</template>
<script type="es6">

    export default {
        name: 'list',
        data () {
            return {
                detailId: "",
                fieldlist: [],
                form: {
                    "itemkey": "",
                    "itemname": "",
                    "itemvalue": "",
                    "nodekey": "",
                    "typeid": "",
                    "iscache": "1",
                    "sort": "1",
                },
                rules: {
                    itemname: [{required: true, message: '请输入参数名称', trigger: 'blur'}],
                    itemkey: [{required: true, message: '请输入参数编码', trigger: 'blur'}],
                    itemvalue: [{required: true, message: '请输入参数值', trigger: 'blur'}],
                    sort: [{validator: this.validataSort, message: '请输入有效数字且大于0', trigger: 'blur'}],
                }
            }
        },
        watch: {
            '$parent.treeList': 'handleFieldsRender'
        },
        mounted () {
            this.init();
        },
        methods: {
            init(){
                this.handleFieldsRender();
                if (this.$handlePageType('edit') == true) {
                    this.$route.params.id ? this.detailId = this.$route.params.id : this.$routeTo('msm_operationallimits')
                    this.getdetail();
                }else if (this.$handlePageType('add') == true){
                    this.$route.query.nodekey?this.form.nodekey=this.$route.query.nodekey:"";
                    this.$route.query.paramid?this.form.typeid = this.$route.query.paramid:"";
                }
            },
            handleFieldsRender(){
                const handleGetFieldsFromData = (treeList,target,type)=>{
                    let _fieldlist=[];
                    _.each(treeList,v=>{
                        if(v[type]==target){
                            for(var i=1;i<7;i++){
                                if(v['field'+i]){
                                    _fieldlist.push({label:v['field'+i],model:'field'+i})
                                }
                            }
                        }
                    });
                    return _fieldlist;
                };

                if(this.$parent.treeList&&this.$route&&this.$route.query.nodekey){
                    this.fieldlist = handleGetFieldsFromData(this.$parent.treeList,this.$route.query.nodekey,'nodekey')
                }
            },
            onSubmitAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/dic/systemParameterSave', this.form, {
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$routeToWithQuery('msm_operationallimits_list',{systemid:this.$route.query.systemid,nodekey:this.$route.query.nodekey,paramid:this.$route.query.paramid})
                            }
                        })
                    }
                })
            },
            onSubmitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/dic/systemParameterUpdate', this.form, {
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            //this.$handleRes(result);
                            if (result.status == '200') {
                                //this.$routeTo('msm_operationallimits');
                                this.$router.back();
                                //this.$routeToWithQuery('msm_operationallimits_list',{systemid:this.$route.query.systemid,nodekey:this.$route.query.nodekey,typeid:this.$route.query.typeid})
                            }
                        })
                    }
                })
            },
            getdetail(obj){
                this.getAjax('/sys/dic/edit/' + this.detailId, {
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if (result.status == '200') {
                        result.data!=undefined?this.form = this.handleItemstoString(result.data, ['iscache']):'';
                    }
                })
            },
            handlePinyin(){
                if(this.form.itemname){
                    this.getPingyin(this.form.itemname).then((result) => {
                        this.form.itemkey = result;
                    })
                }
            },
        }
    }


</script>
