<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content f-doubleblock">
            <div class="left-block percent">
                <div class="scroll-tree scrollBar tree-heightI">
                    <el-tree
                        :expand-on-click-node="false"
                        class="render-tree"
                        :data="treeOptions"
                        node-key="id"
                        :props="defaultProps"
                        @node-click="handleNodeClick"
                        :render-content="handleTreerender"
                        :highlight-current="true"
                        :accordion="true">
                    </el-tree>
                </div>
                <div id="contextmenuDialog" ref="contextmenuDialog"
                     :style="{ position: contextmenuDialog.position,zIndex: contextmenuDialog.zIndex }">
                    <ul class="el-menu el-menu-vertical">
                        <li class="el-menu-item" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&handleContextmenuDialog('add')">添加</li>
                        <li class="el-menu-item" v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&handleContextmenuDialog('edit')"
                            v-if="this.contextmenuDialog.data.depth!=1">修改
                        </li>
                        <li class="el-menu-item" v-auth="ifHasAuth('delete')" @click="ifHasAuth('delete')&&handleContextmenuDialog('del')"
                            v-if="this.contextmenuDialog.data.depth!=1">删除
                        </li>
                       <!-- <li class="el-menu-item" @click="handleContextmenuDialog('up')"
                            v-if="this.contextmenuDialog.data.depth!=1">上移
                        </li>
                        <li class="el-menu-item" @click="handleContextmenuDialog('down')"
                            v-if="this.contextmenuDialog.data.depth!=1">下移
                        </li>-->
                    </ul>
                </div>
            </div>
            <div class="right-block system-block" v-if="$route.name=='msm_module_list'">
                <div class="rightDivI">
                    <div class="right-contentI">
                        <div class="right-header console-pt5 console-pb5">
                            <div class="console-title console-ml10">
                                <span class="color-12 ui-font">模块详情</span>
                            </div>
                        </div>
                        <!--<div class="">-->
                        <!--<el-button @click="routeToAdd">新增</el-button>-->
                        <!--<el-button @click="$routeTo('msm_module_edit',{id:detail.resid})">修改</el-button>-->
                        <!--<el-button  @click="handleDelete(multipleSelection)">删除</el-button>&lt;!&ndash; @click="$routeTo('msm_module_add')"&ndash;&gt;-->
                        <!--</div>-->
                        <div class="right-body percent-table">
                            <el-card class="del-shadow console-mt6">
                                <el-form ref="form" label-width="120px">
                                    <el-col :span="fieldItemsWidth" v-for="(val,key) in detail" v-if="handlekeytoname(key)" :key="key">
                                        <el-form-item :label="handlekeytoname(key)">
                                            <!--<span>{{val}}</span>-->
                                            <span v-html="htmlval(val,key)"> </span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="权限" class="Hauto">
                                            <el-table :data="tableData" class="console-width-12">
                                                <el-table-column type="index" width="80"></el-table-column>
                                                <el-table-column prop="isfolder" label="类型" width="150"></el-table-column>
                                                <el-table-column prop="resname" width="150" label="权限点"></el-table-column>
                                                <el-table-column prop="alias" width="150" label="别名"></el-table-column>
                                                <el-table-column prop="icon" label="图标" width="150"></el-table-column>
                                                <el-table-column alias="操作" width="80"></el-table-column>
                                            </el-table>
                                        </el-form-item>
                                    </el-col>
                                </el-form>
                            </el-card>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-block system-block" v-if="$route.name!='msm_module_list'">
                <div class="rightDivI">
                    <div class="right-contentI">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
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
                treeOptions: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                checkAll: true,
                filterform: {
                    account: '',
                    statusa: '',
                    statusb: '',
                    status: '',
                    createTime: '',
                },
                tableData: [],
                fieldItemsWidth: 12,
                fieldItemnames: {
                    name: "模块名称",
                    alias: "模块别名",
                    restype: "模块类型",
                    defaulturl: "默认地址",
                    isdisplayinmenu: "是否显示",
                    isopen: "是否打开",
                    titleicon: "模块图标",
                    icon: "资源图标",
                    isfolder: "是否栏目",
                },
                detail: {}
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
            htmlval(_val, key){
                let val;
                this.detail[key] != undefined ? val = this.detail[key] : '';
                switch (key) {
                    case 'icon':
                    case 'titleicon':
                        return '<i class="fa ' + val + '"></i>';
                        break;
                    case 'isfolder':
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
                this.detailStatus = this.$route.params.id;
                this.hidetreeContextmenu();
                this.getlist();
            },
            routeToAdd(){
                this.$router.push({
                    name: 'msm_module_add',
                    query: {
                        parentid: this.detail.resid,
                        depth: this.detail.depth,
                    }
                })
            },
            getlist(){
                if (_.isEmpty(this.treeOptions)) {
                    this.getAjax('/sys/res/getList', {
                        headers: {
                            systemid: this.$store.state.systemid
                        }
                    }).then((result) => {
                        if (result.status == '200') {
                            result.data.length != 0 ? this.treeOptions = this.handleListToTree(result.data, {
                                cid: 'resid',
                                labelName: 'resname'
                            }) : '';
                            this.detail = result.details;
                            if(this.$route.name=="msm_module_list"){
                                this.$router.push({name: "msm_module_detail", params: {id: this.detail.resid}})
                            }
                        }
                    })
                }
            },
            handleNodeClick(data, node, el) {
                if (node.data.depth != 1) {
                    this.$router.push({name: "msm_module_detail", params: {id: node.data.resid}})
                }
            },
            handlerender(h, {node}) {
                if (node.data.icon) {
                    return h('span', [h('i', {
                        class: node.data.icon,
                    }),
                        h('span', {
                            style: {
                                paddingLeft: '10px'
                            },
                        }, node.data.label),
                    ])
                } else {
                    return h('span', {
                        style: {},
                    }, node.data.label)
                }

            },
            handlekeytoname(key){
                return this.fieldItemnames[key] ? this.fieldItemnames[key] : null;
            },
            handleContextmenuDialog(type) {
                switch (type) {
                    case 'add':
                        this.$router.push({
                            name: 'msm_module_add', query: {
                                parentid: this.contextmenuDialog.data.resid,
                                depth: this.contextmenuDialog.data.depth,
                                sid: this.contextmenuDialog.data.systemid,
                                systemid: this.$store.state.systemid
                            }
                        })
                        break;
                    case 'edit':
                        this.$routeTo('msm_module_edit', {
                            id: this.contextmenuDialog.data.resid,
                        })
                        break;
                    case 'del':
                        // this.handleDemensionDel(this.contextmenuDialog.data.resid, () => {
                        //     this.getlist()
                        // });
                        this.handleDelCommon('/sys/res/delete/' + this.contextmenuDialog.data.resid, () => {
                            this.treeOptions = [];
                            this.$router.push({name: "msm_module_list"})
                        });
//                        if(confirm('确定删除？')==true){
//                            this.deleteAjax('/sys/res/delete/'+ this.contextmenuDialog.data.resid).then( (result) => {
//                                this.$handleRes(result);
//                                this.getlist()
//                            })
//                        }
                        break;
                    case 'up':
                        let _treeOptions = this.treeOptions;

                    function sort(array, index, typeid) {
                        return array.sort(function (x, y) {
                            if (index == -1 && y.typeid == typeid) {
                                return 1
                            } else if (index == 1 && x.typeid == typeid) {
                                return -1;
                            } else {
                                return 0;
                            }
                        })
                    }

                    function _each(obj, target) {
                        let _b;
                        _.each(obj, function (val, key) {
                            if (val) {
                                if (val.children) {
                                    var _a = _each(val.children, target);
                                    if (_a) {
                                        val.children = _a;
                                    }
                                    return false;
                                } else if (val.typeid && val.typeid == target) {
                                    if (key != 0) {
                                        _b = sort(obj, -1, val.typeid);
                                    }
                                }
                            }
                        });
                        return _b;
                    }

                        _each(_treeOptions, this.contextmenuDialog.data.typeid);
                        this.$set(this, 'treeOptions', _treeOptions);
                        break;
                    case 'down':
                        break;
                }
            },
        }
    }


</script>

<style scoped lang="less" type="text/less">
    .page-secondnav .f-content {
        overflow-y: hidden;
    }
</style>
