<template>
    <div>
        <div class="right-header console-pt5 console-pb5">
            <div class="console-title console-ml10">
                <span class="color-12 ui-font" v-if="$handlePageType('add') == true">添加节点</span>
                <span class="color-12 ui-font" v-if="$handlePageType('edit') == true">修改节点</span>
            </div>
        </div>
        <div class="right-body">
            <el-card class="del-shadow console-mt7">
                <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="console-ml6">
                    <el-col :span="11">
                        <el-form-item prop="typename" label="分类名称">
                            <el-input v-model="form.typename" @blur="handlePinyin"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="nodekey" label="分类编码">
                            <el-input v-model="form.nodekey" :readonly="$handlePageType('edit')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="sort" label="排序">
                            <el-input v-model="form.sort"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" v-if="isTemp">
                        <el-form-item label="角色">
                            <el-input v-model="form.roleidname" :readonly="true">
                                <el-button slot="append" @click="showRole"><i class="el-icon-more"></i></el-button>
                            </el-input>
                            <el-input v-model="form.roleids" v-show="false"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" v-if="isTemp">
                        <el-form-item label="行">
                            <el-input v-model="form.ordinate"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" v-if="isTemp">
                        <el-form-item label="列">
                            <el-input v-model="form.abscissa"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="附加字段1">
                            <el-input v-model="form.field1"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="附加字段2">
                            <el-input v-model="form.field2"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="附加字段3">
                            <el-input v-model="form.field3"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="附加字段4">
                            <el-input v-model="form.field4"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="附加字段5">
                            <el-input v-model="form.field5"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="附加字段6">
                            <el-input v-model="form.field6"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item class="f-tac ml0">
                            <el-button class="ui-color3" type="primary" @click="onSubmitAdd('form')" v-if="$handlePageType('add') == true">添加</el-button>
                            <el-button class="ui-color3" type="primary" @click="onSubmitEdit('form')" v-if="$handlePageType('edit') == true">保存</el-button>
                            <el-button class="ui-color2" @click="handleCancel">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-card>
            <el-dialog
                    class="dialogDiv dialogDivII"
                    :show-close="false"
                    :visible.sync="dialogVisible"
                    size="tiny"
                    :top = "dialog_top">
                <div class="slideContent">
                    <div class="leftDiv aloneDivI">
                        <el-button class="icon-setting-1 icon-confirm" @click="reverted"></el-button>
                    </div>
                    <div class="slideTop" v-drag1>角色列表</div>
                    <div class="slideMid">
                        <el-table
                            ref="roleData"
                            highlight-current-row
                            :data="roleData"
                            max-height='500'
                            @select="roleSelect"
                            class="th-center">
                            <el-table-column type="selection" width="55" align="center"></el-table-column>
                            <el-table-column prop="alias" label="角色别名" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.alias.replace(/(\S*)_/,'')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="rolename" label="角色名称" align="center"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script type="es6">

    export default {
        name: 'list',
        data () {
            return {
                dialog_top: "100px",
                detailId: "",
                dialogVisible:false,
                roleData:[],
                form: {
                    typename: '',
                    nodekey: '',
                    isfolder: '0',

                    depth: '',
                    parentid: '',//typeid
                    catkey: '',
                    typemrkid: '',

                    field1: '',
                    field2: '',
                    field3: '',
                    field4: '',
                    field5: '',
                    field6: '',

                    roleidname:'',
                    roleids:''
                },
                isTemp: true,
                rolenameArr: [],
                roleidArr: [],
                rules: {
                    typename: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                    ],
                    nodekey: [{required: true, message: '请输入分类编码', trigger: 'blur'}],
                    isfolder: [
                        {required: true, message: '请选择是否创建文件夹', trigger: 'blur'},
                    ],
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
                this.$route.query.catkey==='TemplateManagement'?this.isTemp = true : this.isTemp = false;
                this.getailsuser();
                this.getAuthlist();
                if (this.$handlePageType('edit') == true) {
                    this.$route.params.catkey==='TemplateManagement'?this.isTemp = true : this.isTemp = false;
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
            //确定添加
            onSubmitAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/gltype/save',this.objfilter(this.form),{
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            this.$handleRes(result);
                            if(result.status=='200'){
                                //this.$routeTo('msm_setting_gltype');
                                this.$parent.treeOptions = [];
                                this.$routeTo('msm_setting_gltype_detail',{id:this.form.parentid});
                            }
                        })
                    }
                })
            },
            //确定修改
            onSubmitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/gltype/update',this.objfilter(this.form),{
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            this.$handleRes(result);
                            if(result.status=='200'){
                                this.$parent.treeOptions = [];
                                this.$routeTo('msm_setting_gltype_detail',{id:this.detailId});
                            }
                        })
                    }
                })
            },
            //取消
            handleCancel() {
                this.detailId?this.$routeTo('msm_setting_gltype_detail',{id:this.detailId}):this.$routeTo('msm_setting_gltype_detail',{id:this.form.parentid});
            },
            //获取详情
            getdetail(obj){
                this.getAjax('/sys/gltype/edit/'+this.detailId,{
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if(result.status=='200'){
                        this.form=this.handleItemstoString(result.data,['isfolder']);
                    }
                })
            },
            handlePinyin(){
               if (this.form.typename){
                   this.getPingyin(this.form.typename).then((result) => {
                       this.form.nodekey = result;
                   })
               }
            },
            //显示角色选择框
            showRole() {
                this.dialogVisible = true;
            },
            //获取角色和员工
            getailsuser(){
                this.fetch('/sys/role/getAll',this.objfilter({pageNo:this.cPage,pageSize:10000}))
                    .then(result => {
                        if(result.status === 200){
                            this.roleData = result.data.list;
                        }
                    })
            },
            //选择
            roleSelect(rows) {
                this.rolenameArr = [];
                this.roleidArr = [];
                for(let i=0; i<rows.length; i++){
                    this.rolenameArr.push(rows[i].rolename);
                    this.roleidArr.push(rows[i].roleid);
                }
            },
            //显示已勾选
            showSelect() {
                let tempData = [];
                for(let i = 0; i < this.roleData.length; i++) {
                    tempData = _.filter(this.roleData,{'roleid':this.roleData[i].roleid})
                }
                this.$refs.roleData.toggleRowSelection(tempData);
            },
            //确定并返回
            reverted(){
                this.form.roleidname =  this.rolenameArr.join(",");
                this.form.roleids =  this.roleidArr.join(",");
                this.dialogVisible = false;
            }
        }
    }


</script>
