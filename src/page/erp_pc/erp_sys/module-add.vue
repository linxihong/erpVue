<template>
    <div>
        <div class="right-header console-pt5 console-pb5">
            <div class="console-title console-ml10">
                <span class="color-12 ui-font" v-if="$handlePageType('add') == true">添加模块</span>
                <span class="color-12 ui-font" v-if="$handlePageType('edit') == true">修改模块</span>
            </div>
        </div>
        <div class="right-body">
            <el-card class="del-shadow console-mt6">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <el-col :span="12">
                        <el-form-item prop="resname" label="模块名称">
                            <el-input v-model="form.resname" @blur="handlePinyin"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="alias" label="模块别名">
                            <el-input v-model="form.alias" :readonly="$handlePageType('edit')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="restype" label="模块类型">
                            <el-select v-model="form.restype" placeholder="请选择模块类型" class="fulltable">
                                <el-option
                                        v-for="item in restypelist"
                                        :key="item.itemvalue"
                                        :label="item.itemname"
                                        :value="handletoString(item.itemvalue)">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="defaulturl" label="默认地址">
                            <el-input v-model.trim="form.defaulturl"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="sort" label="排序">
                            <el-input v-model="form.sort"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="isopen" label="默认打开">
                            <el-select v-model="form.isopen" placeholder="请选择管理员标志" class="fulltable">
                                <el-option
                                        v-for="item in ifadminoptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="titleicon" label="菜单图标">

                            <i :class="[form.titleicon,'hoverClass']"></i>
                            <iconmenu v-model="form.titleicon"></iconmenu>

                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="12">
                        <el-form-item prop="icon" label="模块图标">

                            <i :class="form.icon"></i>
                            <iconmenu v-model="form.icon"></iconmenu>

                        </el-form-item>
                    </el-col>-->

                    <!--<el-col :span="12">
                        <el-form-item prop="isfolder" label="是否栏目">
                            <el-select v-model="form.isfolder" placeholder="请选择管理员标志">
                                <el-option
                                        v-for="item in ifadminoptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>-->
                    <el-col :span="12">
                        <el-form-item prop="isdisplayinmenu" label="显示到菜单">
                            <el-select v-model="form.isdisplayinmenu" placeholder="请选择管理员标志" class="fulltable">
                                <el-option
                                        v-for="item in ifadminoptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="权限" class="Hauto">
                                <div class="mb10">
                                    <el-button class="ui-color2" @click="handleAddPermissonPoint" icon="plus"></el-button>
                                </div>
                                <el-table :height="350" :data="tableData" class="console-width-12 ui-color4">
                                    <el-table-column type="index" width="80"></el-table-column>
                                    <el-table-column prop="isfolder" label="类型" width="150">
                                        <template slot-scope="scope">
                                            <!--v-model="tableData[scope.index].isfolder"-->
                                            <el-select v-model="tableData[scope.$index].isfolder" @change="handleIsfolderChange(tableData[scope.$index].isfolder,scope.$index)" clearable placeholder="权限点" :disabled="tableData[scope.$index].deleteflag===1">
                                                <el-option v-for="item in isfolderlist" :key="item.key" :label="item.name"
                                                           :value="item.key"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="resname" label="权限点">
                                        <template slot-scope="scope">
                                            <el-input v-if="tableData[scope.$index].isfolder=='3'" v-model="tableData[scope.$index].resname" :disabled="tableData[scope.$index].deleteflag===1"></el-input>
                                            <!--<el-select v-model="tableData[scope.$index].resname" clearable placeholder="权限点"
                                                       v-if="tableData[scope.$index].isfolder=='3'">
                                                <el-option v-for="item in sjqxlist" :key="item.dicid" :label="item.itemname" :value="item.dicid"></el-option>
                                            </el-select>-->
                                            <el-select v-model="tableData[scope.$index].resname" @change="handleResnameChange(tableData[scope.$index].resname,scope.$index)" clearable placeholder="权限点"
                                                       v-if="tableData[scope.$index].isfolder=='2'||tableData[scope.$index].isfolder==''" :disabled="tableData[scope.$index].deleteflag===1">
                                                <el-option v-for="item in angllist" :key="item.dicid" :label="item.itemname" :value="item.dicid"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="alias" label="别名">
                                        <template slot-scope="scope">
                                            <el-input v-model="tableData[scope.$index].alias" :readonly="true" v-if="tableData[scope.$index].isfolder==2" :disabled="tableData[scope.$index].deleteflag===1"></el-input>
                                            <el-input v-model="tableData[scope.$index].alias" v-if="tableData[scope.$index].isfolder==3" :disabled="tableData[scope.$index].deleteflag===1"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="icon" label="图标" width="150">
                                        <template slot-scope="scope">
                                            <i :class="tableData[scope.$index].icon"></i>
                                            <iconmenu v-model="tableData[scope.$index].icon" v-if="tableData[scope.$index].deleteflag!==1"></iconmenu>
                                        </template>
                                    </el-table-column>
                                    <el-table-column alias="操作" width="80">
                                        <template slot-scope="scope">
                                            <el-button @click="handleRemovePermissonPoint(scope.$index)" type="text" size="small" v-if="tableData[scope.$index].deleteflag!==1">移除</el-button>
                                            <el-button type="text" size="small" v-if="tableData[scope.$index].deleteflag===1" :disabled="tableData[scope.$index].deleteflag===1">已删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="errmsg!=''">
                        <el-form-item prop="sort">
                            <p style="color: #ff4949;">{{errmsg}}</p>
                        </el-form-item>
                    </el-col>
                    <div class="fiexd-btn-wrap">
                        <el-button class="ui-color3" type="primary" @click="onSubmitAdd('form')" v-if="$handlePageType('add') == true">添加</el-button>
                        <el-button class="ui-color3" type="primary" @click="onSubmitEdit('form')" v-if="$handlePageType('edit') == true">保存</el-button>
                        <el-button class="ui-color2" @click="$router.back()">取消</el-button>
                    </div>
                </el-form>
            </el-card>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'list',
        data() {
            return {
                accountId: '',
                errmsg: '',
                tableData: [],
                angllist: [],
                restypelist: [],
                sjqxlist: [],
                isfolderlist: [{name: '按钮权限', key: 2}, {name: '数据权限', key: 3}],
                form: {
                    resname: '',
                    alias: '',
                    titleicon: '',
                    //icon: '',
                    defaulturl: '',
                    isfolder: '1',
                    isdisplayinmenu: '1',
                    isopen: '1',
                    restype: '',
                    sort: '1',
                    depth: '',
                    parentid: '',
                    systemid: '',
                    children: [],
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
                rules: {
                    resname: [{required: true, message: '请输入模块名称', trigger: 'blur'}],
                    restype: [{required: true, message: '请选择模块类型', trigger: 'change'}],
                    alias: [{required: true, message: '请输入模块别名', trigger: 'blur'}],
                    sort: [{validator: this.validataSort, message: '请输入有效数字且大于0', trigger: 'blur'}],
                    //sort: [{required: true, message: '请输入排序号', trigger: 'blur'}],
                    //icon: [{required: true, message: '请输入模块图标', trigger: 'blur'}],
                    //defaulturl: [{required: true, message: '请输入默认地址', trigger: 'blur'}],
                    //isfolder: [{required: true, message: '请输入是否栏目', trigger: 'blur'}],
                    // isdisplayinmenu: [{required: true, message: '请输入显示到模块', trigger: 'blur'}],
                    //isopen: [{required: true, message: '请输入默认打开', trigger: 'blur'}],
                    //path: [{required: true, message: '请输入模块路径', trigger: 'blur'}],
                    //titleicon: [{required: true, message: '请输入标题图标', trigger: 'blur'}],
                    //rescode: [{required: true, message: '请输入模块编码', trigger: 'blur'}]
                }
            }
        },
        watch: {
            '$route': function () {
                this.init();
            }
        },
        computed: {},
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$handlePageType('edit') == true) {
                    this.$route.params.id ? this.detailId = this.$route.params.id : this.$routeTo('msm_module_list')
                    this.getdetail();
                }
                if (this.$handlePageType('add') == true || this.$handlePageType('edit') == true) {
                    this.getdicdata();
                }
            },
            onSubmitAdd(formName) {
                var _query = this.$route.query;
                this._isNull(_query.parentid) ? this.form.parentid = _query.parentid : '';
                this._isNull(_query.depth) ? this.form.depth = _query.depth : '';
                this._isNull(_query.sid) ? this.form.systemid = _query.sid : '';
                this.errmsg = '';
                this.$refs[formName].validate((valid) => {
                    this.errmsg = this.handleValidPermissonPoint();
                    if (valid&&this.errmsg=='') {
                        this.form.children = this.tableData;
                        this.fetch('/sys/res/save', this.form, {
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$parent.treeOptions = [];
                                this.$router.back()
                            }
                        })
                    }
                })
            },
            onSubmitEdit(formName) {
                this.errmsg = '';
                this.$refs[formName].validate((valid) => {
                    this.errmsg = this.handleValidPermissonPoint();
                    if (valid&&this.errmsg=='') {
                        this.form.children = this.handleQuerydicdata()
                        this.fetch('/sys/res/update', this.form, {
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.$parent.treeOptions = [];
                                this.$router.back()
                            }
                        })
                    }
                })
            },
            getdetail(obj) {
                this.getAjax('/sys/res/edit/' + this.detailId, {
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if (result.status == '200') {
                        this.form = this.handleItemstoString(result.data, ['isfolder', 'isdisplayinmenu', 'isopen', 'restype']);
                        this.form.children?this.tableData = this.form.children:'';
                    }
                })
            },
            handlePinyin() {
                this.getPingyin(this.form.resname).then((result) => {
                    !_.isEmpty(result) ? this.form.alias = result : '';
                })
            },
            handleQuerydicdata() {
                var result = []; //this.tableData
                _.each(this.tableData,(v,k)=>{
                    if(v.isfolder=='3'){
                        _.each(this.sjqxlist,(cv,k)=>{
                            if(v.resname==cv.itemname){
                                v.resname = cv.dicid;
                            }
                        })
                    }
                    if(v.isfolder=='2'){
                        _.each(this.angllist,(cv,k)=>{
                            if(v.resname==cv.itemname){
                                v.resname = cv.dicid;
                            }
                        })
                    }
                });
                return this.tableData
            },
            getdicdata() {
                //this.getDicData(['anqx', 'sjqx']).then((result) => {
                this.postDicData([{'nodekey':'angl',systemid:'0'},{'nodekey':'restype',systemid:'0'}]).then( (result)=>{
                    if (result.status == '200' && result.data) {
                        result.data['angl'] ? this.angllist = result.data['angl'] : '';
                        result.data['restype'] ? this.restypelist = result.data['restype'] : '';
                        /*result.data['sjqx'] ? this.sjqxlist = result.data['sjqx'] : '';*/
                    }
                })
            },
            handleValidPermissonPoint() {
                var _errmsg='';
                if (!_.isEmpty(this.tableData)) {
                    _.each(this.tableData, (v, k) => {
                        if ( v.resname == undefined||v.resname == '') {
                            _errmsg += '权限点不能为空！'
                        }
                        if (v.isfolder == undefined||v.isfolder == '') {
                            _errmsg += '类型不能为空！'
                        }
                        if (v.alias == undefined||v.alias == '') {
                            _errmsg += '别名不能为空！'
                        }
                       /* if (v.icon == undefined||v.icon == '') {
                            _errmsg += '图标不能为空！'
                        }*/
                    })
                }
                return _errmsg;
            },
            handleAddPermissonPoint() {
                this.tableData.push({'resname': null,'alias': null,'dicid': null, 'isfolder': 2, 'icon': null, 'deleteflag': 0})
            },
            handleRemovePermissonPoint($index) {
                this.tableData[$index].deleteflag = 1;
            },
            handleResnameChange(value,index) {
                _.each(this.angllist,v=>{
                    if(v.dicid==value) {
                        this.tableData[index].alias = v.itemvalue;
                    }
                })
            },
            handleIsfolderChange(value,index) {
                if(value=='3'){
                    this.tableData[index].resname = ''
                }
            }
        }
    }
</script>

<style scoped>
    .fiexd-btn-wrap {
        width: 100%;
        position: fixed;
        bottom: 2%;
        margin: 0 30%;
    }
</style>
