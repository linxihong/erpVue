<template>
    <div>
        <div class="right-header console-pt5 console-pb5">
            <div class="console-title console-ml10">
                <span class="color-12 ui-font">模块详情</span>
            </div>
        </div>
        <div class="right-body percent-table">
            <div class="console-mt6">
                <el-button  class="ui-color3" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&routeToAdd()">添加</el-button>
                <el-button  class="ui-color3" v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&$routeTo('msm_module_edit',{id:detail.resid})">修改</el-button>
                <el-button  class="ui-color2" v-auth="ifHasAuth('delete')" @click="ifHasAuth('delete')&&handleDelete([detail])">删除</el-button>
            </div>
            <el-card class="mt10 del-shadow">
                <el-form ref="form" label-width="100px">
                    <el-col :span="fieldItemsWidth" v-for="(val,key) in fieldItemnames" v-if="handlekeytoname(key)"
                            :key="key">
                        <el-form-item :label="handlekeytoname(key)">
                            <!--<span>{{val}}</span>-->
                            <span v-html="htmlval(val,key)"> </span>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="权限" class="Hauto">
                            <el-table :height="350" :data="tableData" class="console-width-12">
                                <el-table-column type="index" width="80"></el-table-column>
                                <el-table-column prop="isfolder" label="类型" width="150">
                                    <template slot-scope="scope">
                                        <span v-for="item in isfolderlist" :key="item.key" v-if="scope.row.isfolder==item.key">{{item.name}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="resname" width="" label="权限点"></el-table-column>
                                <el-table-column prop="alias" width="" label="别名"></el-table-column>
                                <el-table-column prop="icon" label="图标" width="150">
                                    <template slot-scope="scope">
                                        <i :class="tableData[scope.$index].icon"></i>
                                    </template>
                                </el-table-column>
                                <el-table-column alias="操作" width="80"></el-table-column>
                            </el-table>
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
                restypelist:[],
                tableData:[],
                isfolderlist: [{name: '按钮权限', key: 2}, {name: '数据权限', key: 3}],
                fieldItemsWidth: 12,
                fieldItemnames: {
                    resname: "模块名称",
                    alias: "模块别名",
                    restype: "模块类型",
                    titleicon: "模块图标",
                    icon: "资源图标",
                    defaulturl: "默认地址",
                    isfolder: "是否栏目",
                    isdisplayinmenu: "是否显示",
                    isopen: "是否打开"
                },
                detail: {
                    resname: "模块名称",
                    alias: "模块别名",
                    restype: "模块类型",
                    titleicon: "模块图标",
                    icon: "资源图标",
                    defaulturl: "默认地址",
                    isfolder: "是否栏目",
                    isdisplayinmenu: "是否显示",
                    isopen: "是否打开"
                }
            }
        },
        watch: {
            '$route': 'init'
        },
        mounted () {
            this.init();
        },
        methods: {
            htmlval(_val, key){
                let val;
                this.detail[key] != undefined ? val = this.detail[key] : '';
                switch (key) {
                    case 'icon':
                    case 'restype':
                        let _name ;
                        this.restypelist.forEach(item=>{
                            if(this.detail[key]==item.itemvalue){
                                _name = item.itemname
                            }
                        });
                        return _name;
                        break;
                    case 'titleicon':
                        return '<i class="fa ' + val + '"></i>';
                        break;
                    case 'isfolder'://restypelist
                    case 'isdisplayinmenu':
                    case 'isopen':
                        return val == '1' ? "是" : val == '0' ? "否" : val;
                        break;
                    default:
                        return val;
                        break
                }
            },
            init(){
                if (this.$route.name === 'msm_module_detail') {
                    this.detailId = this.$route.params.id;
                    this.getdicdata();
                    this.getdetail();
                }
            },
            routeToAdd(){
                this.$router.push({
                    name: 'msm_module_add',
                    query: {
                        parentid: this.detail.resid,
                        depth: this.detail.depth,
                        sid: this.detail.systemid,
                        systemid: this.$store.state.systemid
                    }
                })
            },
            getdetail(){
                this.getAjax('/sys/res/edit/' + this.detailId).then((result) => {
                    if (result.status == '200') {
                        this.detail = this.handleItemstoString(result.data, ['isfolder', 'isdisplayinmenu', 'isopen']);
                        result.data.children?this.tableData = result.data.children:'';
                        this.$parent.treeExpandeds = [result.data.resid]
                    }
                })
            },
            getdicdata() {
                //this.getDicData(['anqx', 'sjqx']).then((result) => {
                this.postDicData([{'nodekey':'restype',systemid:'0'}]).then( (result)=>{
                    if (result.status == '200' && result.data) {
                        result.data['restype'] ? this.restypelist = result.data['restype'] : '';
                    }
                })
            },
            handlekeytoname(key){
                return this.fieldItemnames[key] ? this.fieldItemnames[key] : key;
            },
            handleDelete(obj){
                this.handleDelCommon('/sys/res/delete/' + obj[0].resid, () => {
                    this.$parent.treeOptions = [];
                    this.$router.push({name: "msm_module_list"})//parentid
                });
                /*var _delitems = [];
                if (obj.length > 0) {
                    _.each(obj, function (val, key) {
                        val.resid ? _delitems.push(val.resid) : '';
                    })
                    this.handleDelCommon('/sys/res/delete/' + _delitems.join(','), () => {
                        //this.getdetail()
                        this.$parent.treeOptions = [];
                        this.$router.push({name: "msm_module_detail", params: {id: obj[0].parentid}})//parentid
                    });
                } else {
                    this.$message.warning('请选择一项删除')
                }*/

            },
        }
    }
</script>
