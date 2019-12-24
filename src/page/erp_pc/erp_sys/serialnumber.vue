<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content" :class="{'f-doubleblock':treeOptions}">
            <div class="left-block percent" v-if="treeOptions">
                <div class="scroll-tree scrollBar tree-heightI">
                    <el-tree
                        :expand-on-click-node="false"
                        class="render-tree"
                        :data="treeOptions"
                        node-key="typeid"
                        :default-expanded-keys="treeExpandeds"
                        :props="defaultProps"
                        @node-click="handleNodeClick"
                        :render-content="handleTreerender__code"
                        :highlight-current="true">
                    </el-tree>
                </div>
            </div>
            <div class="right-block system-block">
                <div class="rightDivI">
                    <div class="right-contentI" ref="contentHeight">
                        <div class="right-header console-pt5 console-pb5" ref="headerHeight">
                            <div class="console-title console-ml10">
                                <span class="color-12 ui-font">流水号列表</span>
                            </div>
                        </div>
                        <div class="right-body percent-table">
                            <div class="console-pt4" ref="formHeight">
                                <el-card class="box-card__form">
                                    <el-form ref="filterform" :model="filterform" label-width="120px" class="filterform cf" @keyup.enter.native="ifHasAuth('search')&&onSubmitFilterform()">
                                        <el-form-item label="流水号名称" prop="name">
                                            <el-input v-model="filterform.name" placeholder="名称"></el-input>
                                        </el-form-item>

                                        <el-form-item label="别名" prop="alias">
                                            <el-input v-model="filterform.alias" placeholder="别名"></el-input>
                                        </el-form-item>

                                        <el-form-item>
                                            <el-button class="ui-color3" v-auth="ifHasAuth('search')" @click="ifHasAuth('search')&&onSubmitFilterform()">查询</el-button>
                                            <el-button class="ui-color2" v-auth="ifHasAuth('reset')" @click="ifHasAuth('reset')&&onSubmitFilterform('reset','filterform')">重置</el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-card>
                            </div>

                            <div class="pt10 pb10" ref="btnHeight">
                                <el-button class="ui-color3" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&$routeTo('msm_serialnumber_add',{},{modulid:$route.query.listid})">添加</el-button>
                            </div>

                            <el-table
                                    highlight-current-row
                                    :data="tableData"
                                    :height="tabHeight"
                                    @selection-change="handleSelectionChange"
                                    class="ui-color4">
                                <el-table-column type="selection" min-width="10"></el-table-column>
                                <el-table-column prop="name" min-width="25" label="流水号名称"></el-table-column>
                                <el-table-column prop="alias" min-width="25" label="别名">
                                   <!-- <template slot-scope="scope">
                                        <span>{{ scope.row.alias.replace(/(\S*)_/,'')}}</span>
                                    </template>-->
                                </el-table-column>
                                <el-table-column prop="regulation" min-width="25" label="规则"></el-table-column>
                                <el-table-column label="操作" min-width="15">
                                    <template slot-scope="scope">
                                        <el-button type="text" v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&$handleEditClick([scope.row],{routeTo:'msm_serialnumber_edit',type:'edit'},'identityid')">修改</el-button>
                                        <span class="color-2">|</span>
                                        <el-button type="text" v-auth="ifHasAuth('delete')" @click="ifHasAuth('delete')&&handleDelete([scope.row])">删除</el-button>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="es6">
    export default {
        name: 'account',
        data () {
            return {
                tabHeight: 416,
                treeList: [],
                treeOptions: null,
                treeExpandeds: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                filterform: {
                    billofdoc: "",
                    modulid: "",
                    name: '',
                    alias: '',
                    originalheader: '',
                    newheader: '',
                    regulation: '',
                },
                modulidlist:[],
                billofdoclist:[],
                tableData: [],
            }
        },
        watch: {
            '$route.query.listid': function () {
                this.getlist();
            }
        },
        mounted (){
            this.init();
            setTimeout(()=>{
                this.getDivHeight();
            },20)
        },
        methods: {
            init(){
                this.getAuthlist();
                this.gettreelist();
                if(this.$route.query.listid){
                    this.getlist();
                }
                //this.getdicdata();
            },
            getDivHeight(){
                const contentHeight = this.$refs.contentHeight.offsetHeight;
                const headerHeight = this.$refs.headerHeight.offsetHeight;
                const formHeight = this.$refs.formHeight.offsetHeight;
                const btnHeight = this.$refs.btnHeight.offsetHeight;
                this.tabHeight = contentHeight-headerHeight-formHeight-btnHeight-this.$store.state.pageHeight;
            },
            gettreelist(){
                this.treeOptions = [];
                this.getAjax('/sys/identity/getList').then((result) => {
                    if (result.status == '200' && _.isEmpty(result.data) != true) {
                        this.treeList = result.data;
                        this.treeOptions = this.handleListToSingleTree(result.data[0].list);
                        this.$route.query.listid?'': this.$router.push({
                            name: "msm_serialnumber",
                            query: {
                                modulid: this.treeOptions[0].modulid,
                                listid: this.treeOptions[0].typeid,
                                systemid: this.$route.query.systemid
                            }
                        })
                    }
                })
            },
            getlist(){
                this.tableData = [];
                this.fetch('/sys/identity/getAll', this.objfilter({
                    modulid: this.$route.query.listid,
                    billofdoc: this.filterform.billofdoc,
                    name: this.filterform.name,
                    alias: this.filterform.alias,
                    pageNo: this.cPage,
                    pageSize: this.cSize
                })).then(result => {
                    if (result.status == '200') {
                        this.tableData = result.data.list;
                        this.cTotal = result.data.total;
                        this.$route.query.listid?this.treeExpandeds = [this.$route.query.listid]:''
                    }
                })
            },
            //点击显示右边表格
            handleNodeClick(data, node, el) {
                this.$router.push({name: "msm_serialnumber", query: {listid: node.data.typeid,systemid:this.$route.query.systemid}})
            },
            onSubmitFilterform(type, opt) {
                if (type == 'reset') {
                    this.$refs[opt].resetFields();
                }
                this.getlist();
            },
            handleDelete(obj){
                let _delitems = [];
                if (obj.length > 0) {
                    _.each(obj, function (val, key) {
                        val.identityid ? _delitems.push(val.identityid) : '';
                    });
                     this.handleDelCommon('/sys/identity/delete/'+_delitems.join(','), () => {
                          this.getlist()
                     });
                } else {
                    this.$message.warning('请选择一项删除')
                }
            },
            getdicdata() {
                this.postDicData([{'nodekey':'mkmc',systemid:'0'},{'nodekey':'djmc',systemid:'0'}]).then( (result)=>{
                    if(result.status=='200'&&result.data){
                        result.data['mkmc']?this.modulidlist = result.data['mkmc']:'';
                        result.data['mkmc']?this.billofdoclist = result.data['djmc']:'';
                    }
                })
            },
        }
    }
</script>
