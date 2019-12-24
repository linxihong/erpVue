<template>
    <div class="f-content f-doubleblock">
        <div class="left-block">
            <div class="console-title">
                <h5>用户组管理</h5>
            </div>
            <el-tree :data="treeOptions" node-key="id" :default-expanded-keys="treeExpandeds" :props="defaultProps" :expand-on-click-node="false"
                     @node-click="handleNodeClick" :render-content="handleTreerender"></el-tree>
            <div id="contextmenuDialog" ref="contextmenuDialog"
                 :style="{ position: contextmenuDialog.position,zIndex: contextmenuDialog.zIndex }">
                <ul class="el-menu el-menu-vertical">
                    <li class="el-menu-item" @click="handleContextmenuDialog('add')">添加</li>
                    <li class="el-menu-item" @click="handleContextmenuDialog('edit')"
                        v-if="this.contextmenuDialog.data.depth!=1">修改
                    </li>
                    <li class="el-menu-item" @click="handleContextmenuDialog('del')"
                        v-if="this.contextmenuDialog.data.depth!=1">删除
                    </li>
                    <li class="el-menu-item" @click="handleContextmenuDialog('up')"
                        v-if="this.contextmenuDialog.data.depth!=1">上移
                    </li>
                    <li class="el-menu-item" @click="handleContextmenuDialog('down')"
                        v-if="this.contextmenuDialog.data.depth!=1">下移
                    </li>
                </ul>
            </div>
        </div>
        <div class="right-block" v-if="$route.name=='msm_setting_demension_um'||$route.name=='msm_setting_demension_um_detail'">
            <!--v-if="detailId"-->
            <el-tabs v-model="activeName" @tab-click="handleTabClick" >
                <el-tab-pane label="用户组基本信息" name="first">
                    <div class="mb10" v-if="detail.orgid">
                        <el-button size="small" @click="routeToAdd">添加</el-button>
                        <el-button size="small" @click="$routeTo('hr_group_edit',{id:detail.orgid})">修改</el-button>
                        <!--<el-button size="small" @click="$routeTo('hr_group_edit',{id:detail.orgid})">删除</el-button>-->
                    </div>
                    <el-card class="del-shadow">
                        <el-form ref="detail" :model="detail" label-width="120px" :class="{'form-readonly':pageReadonly==true}">
                            <el-col :span="12"><el-form-item prop="orgname" label="用户组名称"> <el-input :readonly="pageReadonly" v-model="detail.orgname"></el-input> </el-form-item></el-col>
                            <el-col :span="12"><el-form-item prop="orgcode" label="用户组编码"> <el-input :readonly="pageReadonly" v-model="detail.orgcode"></el-input> </el-form-item></el-col>
                            <el-col :span="12"><el-form-item prop="remark" label="备注"> <el-input :readonly="pageReadonly" v-model="detail.remark"></el-input> </el-form-item></el-col>
                            <!--<el-col :span="24">-->
                            <!--<el-form-item>-->
                            <!--<el-button size="small" @click="$routeTo('hr_group')">-->
                            <!--<span v-if="$handlePageType('detail') == true">返回</span>-->
                            <!--</el-button>-->
                            <!--</el-form-item>-->
                            <!--</el-col>-->
                        </el-form>
                    </el-card>
                </el-tab-pane>
                <el-tab-pane label="员工信息" name="second">

                    <el-card class="top-float box-card__form">
                        <div slot="header" class="cf">
                            <span class="top-float-item">条件查询</span>
                        </div>
                        <el-form ref="userorgfilterform" :model="userorgfilterform" label-width="120px" class="cf">
                            <el-form-item prop="empCode" label="员工姓名">
                                <el-input v-model="userorgfilterform.empName" placeholder="员工姓名"></el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button @click="onSubmitFilterform()" type="primary">提交</el-button>
                                <el-button @click="onSubmitFilterform('reset','userorgfilterform')">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>

                    <div class="mt10">
                        <userGroupPicker class="console-mr2" style="display:inline-block;" :demid="detailId" @cb="init"></userGroupPicker>
                        <el-button @click="handleDelete(multipleSelection)">移除</el-button>
                    </div>

                    <el-card class="mt10">
                        <el-table
                                :data="userorgTableData"
                                @selection-change="handleSelectionChange"
                                class="console-width-12">

                            <el-table-column
                                    type="selection"
                                    width="55">
                            </el-table-column>

                            <el-table-column
                                    prop="empName"
                                    label="员工姓名"
                                    width="">
                             <!--   <template slot-scope="scope">
                                    <router-link :to="{ name:'hr_staff_detail',params:{id:scope.row.empId}}">
                                        {{scope.row.empName}}
                                    </router-link>
                                </template>-->
                            </el-table-column>

                            <el-table-column
                                    prop="empNum"
                                    label="员工工号"
                                    width="">
                            </el-table-column>

                            <el-table-column
                                    prop="sex"
                                    label="性别"
                                    width="100">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.sex==0">男</span>
                                    <span v-if="scope.row.sex==1">女</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="isprimary"
                                    width="120"
                                    label="是否主组织">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.isprimary==0">是</span>
                                    <span v-if="scope.row.isprimary==1">否</span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="ischarge"
                                    width="120"
                                    label="是否负责人">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.ischarge==0">是</span>
                                    <span v-if="scope.row.ischarge==1">否</span>
                                </template>
                            </el-table-column>

                        </el-table>
                        <el-pagination
                                class="console-mt5"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="cPage"
                                :page-sizes="cpageSizes"
                                :page-size="cSize"
                                layout="total, sizes, prev, pager, next"
                                :total="cTotal">
                        </el-pagination>
                    </el-card>

                </el-tab-pane>
            </el-tabs>

        </div>
        <div class="right-block"  v-if="$route.name=='msm_setting_demension_um_add'||$route.name=='msm_setting_demension_edit'">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name: 'list',
        data () {
            return {
                activeName: 'first',
                dialogVisible: false,

                nodekey: '',
                treeOptions: [],
                treeExpandeds: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                checkAll: true,
                filterform: {
                    demname: '',
                    demdesc: '',
                },

                userorgfilterform: {
                    empCode: '',
                    empNum: '',
                    empTypeid: '',
                    isregempflag: '',
                },
                tableData: [],
                detail : {},
                detailId : '',
                userorgTableData : [],
                detailStatus: this.$route.params.id,
            }
        },
        mounted () {
            this.init();
           /*this.getlist();*/
        },
        watch: {
            '$route': 'init'
        },
        methods: {
            init(){
                ////console.log(this.$route)
                this.detailStatus = this.$route.params.id;
                //组织管理 右键功能 取消选择
                this.hidetreeContextmenu();
                this.getlist();

                if (this.$handlePageType('detail') == true) {
                    this.detailId = this.$route.params.id;
                    //this.getdetail(this.detailId)
                    this.handleTabClick();
                }
            },
            getlist(){
                if (_.isEmpty(this.treeOptions)){
                    this.getAjax('/sys/org/getUserGroupList').then((result) => {
                        if (result.status == '200') {
                            result.data.length!=0?this.treeOptions = this.handleListToTree(result.data,{cid:'demid',labelName:'orgname'}):'';
                            result.data.length!=0?this.treeExpandeds=[this.treeOptions[0].demid]:'';
                        }
                    })
                }
            },
            handleNodeClick(data) {

            },
            handleDetailClick () {
                this.$router.push({name: "detail"})
            },
            onSubmitFilterform(type, opt) {
                if (type == 'reset') {
                    this.$refs[opt].resetFields();
                }
                this.getuserorglist();
            },
            handleDelete(obj){
                let _delitems = [];
                if (obj.length > 0) {
                    _.each(obj, function (val, key) {
                        val.usergroupid ? _delitems.push(val.usergroupid) : '';
                    });
                    this.handleDelCommon('/sys/usergroup/delete/'+_delitems.join(','), () => {
                        this.getlist()
                    });
                } else {
                    this.$message.warning('请选择一项删除')
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
            //组织管理 获取组织详情
            getdetail(id){
                if(id){
                    this.getAjax('/sys/org/edit/'+ id).then((result) => {
                        if(result.status=='200'){
                            //this.detail = this.handleItemstoString(result.data,['orgtype']);
                            this.treeExpandeds = [result.data.orgid];
                            this.$set(this, 'detail',this.handleItemstoString(result.data,['orgtype']))
                        }
                    })
                }
            },
            //组织管理 获取人员列表
            getuserorglist(){
                this.fetch('/sys/usergroup/getAll',this.objfilter({
                    empName:this.userorgfilterform.empName,
                    posid:this.detailId,
                    pageNo:this.cPage,
                    pageSize:this.cSize,
                })).then((result) => {
                    if (result.status == '200') {
                        this.userorgTableData = result.data.list;
                        this.cTotal = result.data.total;
                    }
                })
            },
            //组织管理 人员列表移除人员
            handleDelete(obj) {
                var _delitems = [];
                if (obj.length > 0) {
                    _.each(obj, function (val, key) {
                        val.usergroupid ? _delitems.push(val.usergroupid) : '';
                    });
                    this.handleDelCommon('/sys/usergroup/delete/'+_delitems.join(','), () => {
                        this.getuserorglist()
                    });
                } else {
                    this.$message.warning('请选择一项删除')
                }
            },
            //组织管理 tab切换
            handleTabClick() {
                switch (this.activeName){
                    case 'first':
                        this.getdetail(this.detailId)
                        break
                    case 'second':
                        this.getuserorglist();
                        break
                }
            },
            handleNodeClick(data, node, el) {
                if (node.data.parentid != 1) {
                    this.$routeTo( "msm_setting_demension_um_detail",  {id: node.data.orgid})
                }
            },
            handleContextmenuDialog(type) {
                switch (type) {
                    case 'add':
                        this.$routeTo(
                            'msm_setting_demension_um_add', {
                                parentid: this.contextmenuDialog.data.orgid,
                                depth: this.contextmenuDialog.data.depth,
                                demid: this.contextmenuDialog.data.demid
                        });
                        break;
                    case 'edit':
                        this.$routeTo(
                             'msm_setting_gltype_edit',  {
                                id: this.contextmenuDialog.data.orgid,
                        });
                        break;
                    case 'del':
                        this.handleDelCommon('/sys/org/delete/'+this.contextmenuDialog.data.orgid, () => {
                            this.getlist()
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
                        let _b;
                        _.each(obj, function (val, key) {
                            if (val) {
                                if (val.children) {
                                    let _a = _each(val.children, target);
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
