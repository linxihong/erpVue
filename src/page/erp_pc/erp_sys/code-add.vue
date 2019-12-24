<template>
    <div>
        <div class="right-header console-pt5 console-pb5">
            <div class="console-title console-ml10">
                <span class="color-12 ui-font" v-if="$handlePageType('add') == true">添加代码管理</span>
                <span class="color-12 ui-font" v-if="$handlePageType('edit') == true">修改代码管理</span>
            </div>
        </div>
        <div class="right-body">
            <el-card class="del-shadow console-mt6">
                <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                    <el-col :span="11">
                        <el-form-item prop="itemname" :label="label1">
                            <el-input v-model="form.itemname" @blur="handlePinyin"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="11">
                        <el-form-item prop="itemkey" :label="label2">
                            <el-input v-model="form.itemkey" :readonly="$handlePageType('edit')"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="11">
                        <el-form-item prop="itemvalue" :label="label3">
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

                    <el-col :span="11" v-for="item in fieldlist" :key="item.label">
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
                        <el-form-item class="f-tac mt15">
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
<script type="text/ecmascript-6">

    export default {
        name: 'list',
        data () {
            return {
                pageType: "",
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
                    itemname: [{required: true, message: '请输入代码名称', trigger: 'blur'}],
                    itemkey: [{required: true, message: '请输入代码编码', trigger: 'blur'}],
                    itemvalue: [{required: true, message: '请输入代码值', trigger: 'blur'}],
                    sort: [{validator: this.validataSort, message: '请输入有效数字且大于0', trigger: 'blur'}],
                },
                label1: '代码名称',
                label2: '代码编码',
                label3: '代码值'
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
                this.$route.query.codeid?this.$parent.treeExpandeds = [this.$route.query.codeid]:''
                this.handleFieldsRender();
                if (this.$route.params.cid) {
                    this.pageType = this.$route.params.cid;
                }
                if (this.$handlePageType('edit') == true) {
                    this.$route.params.id ? this.detailId = this.$route.params.id : this.$routeTo('msm_operationallimits')
                    this.getdetail();
                }else if (this.$handlePageType('add') == true){
                    this.$route.query.nodekey?this.form.nodekey=this.$route.query.nodekey:"";
                    this.$route.query.codeid?this.form.typeid = this.$route.query.codeid:"";
                }
                if(this.pageType == 4) {
                    this.label1  = 'DIV标题';
                    this.label2 = 'DIV别名';
                    this.label3 = 'DIV_src';
                }else {
                    this.label1  = '代码名称';
                    this.label2 = '代码编码';
                    this.label3 = '代码值';
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
                        this.fetch('/sys/dic/codeSave/'+this.pageType,this.form,{
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            this.$handleRes(result);
                        if(result.status=='200'){
                            //this.$parent.treeOptions = [];
                            this.$router.back();
                            //this.$routeTo('msm_code_list');
                        }
                    })
                    }
                })
            },
            onSubmitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/dic/codeUpdate/'+this.pageType,this.objfilter(this.form),{
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            this.$handleRes(result);
                        if(result.status=='200'){
                            //this.$parent.treeOptions = [];
                            this.$router.back();
                            //this.$routeTo('msm_code_list');
                        }
                    })
                    }
                })
            },
            getdetail(obj){
                this.getAjax('/sys/dic/edit/'+this.detailId,{
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if(result.status=='200'){
                        this.form=this.handleItemstoString(result.data,['iscache']);
                    }
                })
            },
            handlePinyin(){
                this.getPingyin(this.form.itemname).then((result) => {
                    this.form.itemkey = result;
                })
            },
        }
    }


</script>
