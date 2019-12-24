<template>
    <div class="f-content f-doubleblock">
        <div class="left-block percent">
            <div class="scroll-tree scrollBar tree-heightI">
                <el-tree class="render-tree" :data="treeOptions" node-key="id" :default-expanded-keys="treeExpandeds" :props="defaultProps"
                         @node-click="handleNodeClick" :render-content="handleTreerender" :highlight-current="true" :accordion="true"></el-tree>
            </div>
            <div id="contextmenuDialog" ref="contextmenuDialog"
                 :style="{ position: contextmenuDialog.position,zIndex: contextmenuDialog.zIndex }">
                <ul class="el-menu el-menu-vertical">
                    <li class="el-menu-item ui-color3" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&handleContextmenuDialog('add')">添加</li>
                    <li class="el-menu-item ui-color3" v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&handleContextmenuDialog('edit')"
                        v-if="this.contextmenuDialog.data.depth!=1">修改
                    </li>
                    <li class="el-menu-item ui-color2" v-auth="ifHasAuth('delete')" @click="ifHasAuth('delete')&&handleContextmenuDialog('del')"
                        v-if="this.contextmenuDialog.data.depth!=1">删除
                    </li>
                    <!--<li class="el-menu-item" @click="handleContextmenuDialog('up')"
                        v-if="this.contextmenuDialog.data.depth!=1">上移
                    </li>
                    <li class="el-menu-item" @click="handleContextmenuDialog('down')"
                        v-if="this.contextmenuDialog.data.depth!=1">下移
                    </li>-->
                </ul>
            </div>
        </div>
        <div class="right-block system-block" v-if="$route.name=='msm_setting_gltype'">
            <div class="rightDivI">
                <div class="right-contentI">
                    <div class="right-header console-pt5 console-pb5">
                        <div class="console-title console-ml10">
                            <span class="color-12 ui-font">分类详情</span>
                        </div>
                    </div>
                    <!--<div class="">-->
                    <!--<el-button size="small" @click="routeToAdd">添加</el-button>-->
                    <!--<el-button size="small" @click="$routeTo('msm_setting_gltype_edit',{id:detail.typeid})">修改</el-button>-->
                    <!--<el-button size="small">删除</el-button>-->
                    <!--</div>-->
                    <div class="right-body">
                        <!--  <span class="el-tree__empty-text" v-if="JSON.stringify(detail)=='{}'">暂无数据</span>-->
                        <isEmpty :obj="detail">
                            <el-form ref="form" label-width="160px">
                                <el-col :span="fieldItemsWidth" v-for="(val,key) in fieldItemnames" v-if="handlekeytoname(key)"
                                        key="item">
                                    <el-form-item :label="handlekeytoname(key)">
                                        <span v-html="htmlval(val,key)"> </span>
                                    </el-form-item>
                                </el-col>
                            </el-form>
                        </isEmpty>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-block system-block" v-if="$route.name!='msm_setting_gltype'">
            <div class="rightDivI">
                <div class="right-contentI">
                    <transition name="fade" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="es6">
    const treeOptions = [];

    export default {
        name: 'list',
        data () {
            return {
                treeOptions: [],
                treeExpandeds: [],
                defaultProps: {
                    absolute: 'absolute',
                    children: 'children',
                    label: 'label'
                },
                checkAll: true,
                filterform: {
                    account: '',
                    statusa: '',
                    statusb: '',
                    status: '',
                    createTime: ''
                },
                tableData: [],

                fieldItemsWidth: 24,
                fieldItemnames: {typename: "分类名称", nodekey: "分类编码", sort: "排序"},
                detail: {},
                detailStatus: false,
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
                    case 'isfolder':
                        return val == '1' ? "是" : val == '0' ? "否" : val;
                        break;
                    default:
                        return val;
                        break
                }
            },
            init(){
                this.$route.params.id ? this.detailStatus = this.$route.params.id : "";
                this.$route.params.id ?this.treeExpandeds = [this.$route.params.id]:'';
                this.hidetreeContextmenu();
                this.getAuthlist();
                this.getlist();
            },
            getlist(){
                if(!_.isEmpty(this.treeOptions)){
                    return true;
                }
                this.detail = {};
                this.getAjax('/sys/gltype/getList', {
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if (result.status == '200') {
                        this.treeOptions = this.handleListToTree(result.data);
                        //this.treeExpandeds = [this.treeOptions[0].id]
                        //this.detail = {typename:123};
                    }
                })
            },
            routeToAdd(){
                this.$router.push({
                    name: 'msm_setting_gltype_add', query: {
                        parentid: this.detail.typeid,
                        depth: this.detail.depth,
                        catkey: this.detail.catkey
                    }
                })
            },
            handlekeytoname(key){
                return this.fieldItemnames[key] ? this.fieldItemnames[key] : null;
            },

            handleNodeClick(data, node, el) {
                if (node.data.parentid != 0) {
                    this.$router.push({name: "msm_setting_gltype_detail", params: {id: node.data.typeid}})
                }
            },
            handleContextmenuDialog(type) {
                switch (type) {
                    case 'add':
                        this.$router.push({
                            name: 'msm_setting_gltype_add', query: {
                                typemrkid: this.contextmenuDialog.data.typemrkid,
                                parentid: this.contextmenuDialog.data.typeid,
                                depth: this.contextmenuDialog.data.depth,
                                catkey: this.contextmenuDialog.data.catkey
                            }
                        })
                        break;
                    case 'edit':
                        this.$router.push({
                            name: 'msm_setting_gltype_edit', params: {
                                id: this.contextmenuDialog.data.typeid,
                            }
                        })
                        break;
                    case 'del':
                        this.handleDemensionDel(this.contextmenuDialog.data.typeid, () => {
                            this.treeOptions = [];
                            this.getlist();
                            this.treeExpandeds = [this.contextmenuDialog.data.parentid]
                        });
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
                            var _b;
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
                            })
                            return _b;
                        }

                        var _result = _each(_treeOptions, this.contextmenuDialog.data.typeid);
                        //this.$set(this, 'treeOptions', _treeOptions);
                        break;
                    case 'down':

                        break;
                }
            },
            /* 列表排序 */
            handleSorticonClick(row) {
                if (this.handlesortfilter(row.sort.toString())) {
                    //this.$message.success('这是有效数字,可以进行排序');
                    //排序
                    this.getAjax('/sys/gltype/updateSort/' + row.dicid + '/' + row.sort).then((result) => {
                        this.$handleRes(result);
                        this.getlist();
                    })
                }
            }
        }
    }


</script>

<style scoped lang="less" type="text/less">
    .page-secondnav .f-content {
        overflow-y: hidden;
    }
</style>
