<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content" style="padding: 15px">
            <div class="rightDivI">
                <div class="right-contentI">
                    <div class="right-header console-pt5 console-pb5">
                        <div class="console-title console-ml10">
                            <span class="color-12 ui-font" v-if="$handlePageType('add') == true">添加流水号</span>
                            <span class="color-12 ui-font" v-if="$handlePageType('edit') == true">修改流水号</span>
                        </div>
                    </div>
                    <div class="right-body" v-if="isRefresh">
                        <el-card class="box-card__form console-mt6">
                            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                                <el-col :span="11">
                                    <el-form-item prop="name" label="流水号名称">
                                        <el-input v-model="form.name" @blur="handlePinyin"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item prop="alias" label="别名">
                                        <el-input v-model="form.alias" :readonly="$handlePageType('edit')"></el-input>
                                    </el-form-item>
                                </el-col>
                                <!--<el-col :span="12">-->
                                <!--<el-form-item prop="modulid" label="模块名称">-->
                                <!--<el-select v-model="form.modulid" placeholder="请选择模块名称" class="f-db">-->
                                <!--<el-option-->
                                <!--v-for="item in modulidlist"-->
                                <!--:key="item"-->
                                <!--:label="item.itemname"-->
                                <!--:value="item.dicid">-->
                                <!--</el-option>-->
                                <!--</el-select>-->
                                <!--</el-form-item>-->
                                <!--</el-col>-->
                                <!--<el-col :span="12">
                                    <el-form-item prop="billofdoc" label="单据名称">
                                        <el-select v-model="form.billofdoc" placeholder="请选择单据名称" class="f-db">
                                            <el-option
                                                    v-for="item in billofdoclist"
                                                    :key="item"
                                                    :label="item.itemname"
                                                    :value="item.dicid">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>-->

                                <!--       <el-col :span="12">
                                           <el-form-item prop="regulation" label="规则">
                                               <el-input v-model="form.regulation" :readonly="regulationreadonly" ></el-input>
                                           </el-form-item>
                                       </el-col>-->

                                <!--<el-col :span="12">-->
                                <!--<el-form-item prop="nolength" label="流水号长度">-->
                                <!--<el-input v-model="form.nolength"></el-input>-->
                                <!--</el-form-item>-->
                                <!--</el-col>-->

                                <!--<el-col :span="12">-->
                                <!--<el-form-item prop="nolength" label="初始值">-->
                                <!--<el-input v-model="form.nolength"></el-input>-->
                                <!--</el-form-item>-->
                                <!--</el-col>-->

                                <!--<el-col :span="12">-->
                                <!--<el-form-item prop="nolength" label="当前值">-->
                                <!--<el-input v-model="form.nolength"></el-input>-->
                                <!--</el-form-item>-->
                                <!--</el-col>-->

                                <!--<el-col :span="12">-->
                                <!--<el-form-item prop="step" label="步长">-->
                                <!--<el-input v-model="form.step"></el-input>-->
                                <!--</el-form-item>-->
                                <!--</el-col>-->

                                <!--<el-col :span="12">-->
                                <!--<el-form-item prop="geneveryday" label="生成方式">-->
                                <!--<el-select v-model="form.geneveryday" placeholder="生成方式" class="f-db">-->
                                <!--<el-option label="递增" value="0"></el-option>-->
                                <!--<el-option label="按天生成" value="1"></el-option>-->
                                <!--<el-option label="按月生成" value="2"></el-option>-->
                                <!--<el-option label="按年生成" value="3"></el-option>-->
                                <!--</el-select>-->
                                <!--</el-form-item>-->
                                <!--</el-col>-->
                                <el-col :span="24">
                                    <regulation-add v-model="form.regulation" :getlshrqlist="lshrqlist" :regulationdetail="form" @regulationcb="getregulation" @errmsg="errTip"></regulation-add>
                                    <div style="position: relative;height: 20px;">
                                        <div class="el-form-item__error" style="top: 0;" v-if="errTipmsgStatus">{{errTipmsg}}</div>
                                    </div>
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
            </div>
        </div>
    </div>
</template>
<script type="es6">
    export default {
        name: 'list',
        data () {
            return {
                isRefresh: true,
                regulationreadonly: true,
                errTipmsg: '',
                errTipmsgStatus: false,
                detailId: '',
                form: {
                    "billofdoc": "",
                    "modulid": "",
                    "initvalue": "",
                    //"identityid": "",
                    "name": "",
                    //"originalheader": "",
                    //"newheader": "",
                    "alias": "",
                    "regulation": "",
                    "geneveryday": "",
                    "nolength": "",
                    //"curdate": "",
                    //"initvalue": "",
                    //"curvalue": "",
                    "step": ""
                },
                ifadminoptions: [
                    {
                        value: '1',
                        label: '是'
                    }, {
                        value: '0',
                        label: '否'
                    }
                ],
                modulidlist:[],
                billofdoclist:[],
                lshrqlist:[],
                rules: {
                    identityid: [{required: true, message: '请输入系统流水号ID', trigger: 'blur'}],
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    originalheader: [{required: true, message: '请输入抬头', trigger: 'blur'}],
                    alias: [{required: true, message: '请输入别名', trigger: 'blur'},
                      {validator: this.validataString, message: '请输入英文字符', trigger: 'blur'}],
                    regulation: [{required: true, message: '请输入规则', trigger: 'change'}],
                    geneveryday: [{required: true, message: '请输入每天生成', trigger: 'blur'}],
                    nolength: [{required: true, message: '请输入流水号长度', trigger: 'blur'}],
                    step: [{required: true, message: '请输入步长', trigger: 'blur'}],
                    systemid: [{required: true, message: '请输入系统ID', trigger: 'blur'}],
                    sort: [{validator: this.validataSort, message: '请输入有效数字且大于0', trigger: 'blur'}],
                }
            }
        },
        activated () {
            this.isRefresh = false;
            setTimeout(() => {
                this.isRefresh = true;
                this.init();
            })
        },
        methods: {
            init(){
                this.form = {};
                if (this.$handlePageType('edit') == true) {
                    //console.log(this.$route.params.identityid)
                    this.$route.params.id ? this.detailId = this.$route.params.id : this.$routeTo('msm_serialnumber');
                    this.getDetail();
                }
                //获取数据字典数据
                this.getdicdata();
            },
            errTip(status) {
                status!=''?this.errTipmsg=status:this.errTipmsg=null;
                status!=''?this.errTipmsgStatus = false:this.errTipmsgStatus = true;
                status!=''?this.errTipmsgStatus=false:this.errTipmsgStatus=true;
            },
            getregulation(obj) {
                this.form.billofdoc = obj.billofdoc;
                this.form.regulation = obj.regulation;
            },
            getdicdata(formName) {
                /*'mkmc','djmc','lshrq'{'nodekey':'mkmc',systemid:'0L'},{'nodekey':'djmc',systemid:'0L'},*/
                this.postDicData([{'nodekey':'lshrq',systemid:'0'}]).then( (result)=>{
                    if(result.status=='200'&&result.data){
                    /*    result.data['mkmc']?this.modulidlist = result.data['mkmc']:'';
                        result.data['mkmc']?this.billofdoclist = result.data['djmc']:'';*/
                        result.data['lshrq']?this.lshrqlist = result.data['lshrq']:'';
                    }
                })
            },
            onSubmitAdd(formName) {
                this.errTipmsg!=''?this.errTipmsgStatus = true:this.errTipmsgStatus = false;
                this.$refs[formName].validate((valid) => {
                    if(this.errTipmsgStatus==false){
                        this.form.regulation==undefined||this.form.regulation==''?this.errTipmsg='数据为空，请检查！':''
                        return
                    }
                    this.$route.query.modulid?this.form.modulid = this.$route.query.modulid:''
                    if (valid) {
                        this.fetch('/sys/identity/save', this.form,{
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                //this.$routeTo('msm_serialnumber');
                                this.$router.back()
                            }
                        })
                    }
                });
            },
            onSubmitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.fetch('/sys/identity/update', this.form,{
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$router.back()
                                //this.$routeTo('msm_serialnumber');
                            }
                        })
                    }
                });
            },
            getDetail(){
                this.getAjax('/sys/identity/edit/' + this.detailId,{
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if (result.status == '200') {
                        this.form = this.handleItemstoString(result.data, ['nolength','step','geneveryday']);
                    }
                })
            },
            handlePinyin(){
                this.getPingyin(this.form.name).then((result) => {
                    this.form.alias = result;
                })
            }
        }
    }


</script>
