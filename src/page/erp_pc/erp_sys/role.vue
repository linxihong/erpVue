<template>
    <div class="page-secondnav page-commonnav" ref="pageHeight">
        <div class="f-content">
            <div class="console-pt4 console-pb4" ref="btnHeight">
                <el-button class="ui-color3" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&$routeTo('msm_role_add')">添加</el-button>
                <div class="pull-right">
                    <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowBot">更多查询<i class="el-icon-arrow-down margin-2"/></span>
                    <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowTop">更多查询<i class="el-icon-arrow-up margin-2"/></span>
                </div>
            </div>

            <div v-show="searchVisible" ref="formHeight" class="console-pb4">
                <el-card class="box-card__form">
                    <el-form ref="filterform" :model="filterform" label-width="80px" class="filterform cf" @keyup.enter.native="ifHasAuth('search')&&onSubmitFilterform()">
                        <el-form-item label="角色名称" prop="rolename">
                            <el-input v-model="filterform.rolename" placeholder="角色名称"></el-input>
                        </el-form-item>
                        <el-form-item label="允许删除" prop="allowdel">
                            <el-select v-model="filterform.allowdel" clearable placeholder="允许删除">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <!--<el-form-item label="允许修改" prop="allowedit">
                            <el-select v-model="filterform.allowedit" clearable placeholder="允许修改">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>-->
                        <el-form-item label="是否启用" prop="enabled">
                            <el-select v-model="filterform.enabled" clearable placeholder="是否启用">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="ui-color3" v-auth="ifHasAuth('search')" @click="ifHasAuth('search')&&onSubmitFilterform()">查询</el-button>
                            <el-button class="ui-color2" v-auth="ifHasAuth('reset')" @click="ifHasAuth('reset')&&onSubmitFilterform('reset','filterform')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>

        <!-- <el-card class="box-card mt10"> -->
            <el-table
                    :data="tableData"
                    :height="tabHeight"
                    @selection-change="handleSelectionChange"
                    class="console-width-12">

                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>

                <el-table-column prop="rolename" label="角色名称" width=""></el-table-column>

                <el-table-column prop="alias" label="角色别名" width="">
                    <template slot-scope="scope">
                        <!--<span>{{ scope.row.alias.replace(/(\S*)_/,'')}}</span>-->
                        <span>{{scope.row.alias}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="allowdel" label="允许删除" width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.allowdel==1">是</span>
                        <span v-if="scope.row.allowdel==0">否</span>
                    </template>
                </el-table-column>

             <!--   <el-table-column prop="allowedit" label="允许修改" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.allowedit==1">是</span>
                        <span v-if="scope.row.allowedit==0">否</span>
                    </template>
                </el-table-column>-->

                <el-table-column prop="enabled" label="是否启用" width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.enabled==1">是</span>
                        <span v-if="scope.row.enabled==0">否</span>
                    </template>
                </el-table-column>

                <el-table-column prop="remark" label="备注" width=""></el-table-column>

                <el-table-column
                        label="管理"
                        width="230">
                    <template slot-scope="scope">
                        <el-button class="btn-color" type="text" v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&$handleEditClick([scope.row],{routeTo:'msm_role_edit',type:'edit'},'roleid')">修改</el-button>
                        <span class="color-2">|</span>
                        <el-button class="btn-color" type="text" v-auth="ifHasAuth('delete')" @click="ifHasAuth('delete')&&handleDelete([scope.row])" :disabled="scope.row.allowdel==0">删除</el-button>
                        <span class="color-2">|</span>
                        <roleuserPicker style="display:inline-block;" btnText="账号分配" :selection="scope.row" @cb="init"></roleuserPicker>
                    </template>
                </el-table-column>
           </el-table>

            <el-dialog class="dialogDiv dialogDivII" :show-close="false" size="large" :visible.sync="dialogFormVisible" :top = "dialog_top"><!--tiny/small/large/full-->
                <div class="slideContent">
                    <!--<div class="leftDiv leftOffsetIII">-->
                        <!--<el-button class="icon-setting-2 icon-close" @click="dialogFormVisible = false"></el-button>-->
                        <!--<el-button class="icon-setting-1 icon-confirm" @click="dialogFormVisible = false"></el-button>-->
                    <!--</div>-->
                    <div class="slideTop" v-drag1>账号分配</div>
                    <div class="slideMid">
                        <el-row>
                            <el-col :span="6"><div class="grid-content">
                                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                            </div></el-col>
                            <el-col :span="18"><div class="grid-content ml20">
                                <el-table
                                        :data="dialogTableData"
                                        class="console-width-12">
                                    <el-table-column
                                            prop="date"
                                            label="日期"
                                            width="180">
                                    </el-table-column>
                                    <el-table-column
                                            prop="name"
                                            label="姓名"
                                            width="180">
                                    </el-table-column>
                                    <el-table-column
                                            prop="address"
                                            label="地址">
                                    </el-table-column>
                                </el-table>
                            </div></el-col>
                        </el-row>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                </div>
            </el-dialog>
            <!--, jumper-->
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
        <!-- </el-card> -->
    </div>
    </div>
</template>
<script type="es6">

    export default {
        name: 'account',
        data () {
            return {
                dialog_top: '50px',
                tabHeight: 522,
                height: null,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                dialogTableData: [],
                data: [],
                filterform: {
                    rolename: '',
                    allowdel: '',
                    allowedit: '',
                    enabled: ''
                },
                dialogFormVisible: false,
                tableData: [],
                arrowBot: true,
                arrowTop: false,
                searchVisible: true,
                formHeight: null,
            }
        },
        mounted () {
            this.init();
            setTimeout(()=>{
                this.getDivHeight();
            },20)
        },
        methods: {
            handleNodeClick(data) {
                //console.log(data);
            },
            init () {
                this.getAuthlist();
                this.getlist();
            },

            getDivHeight(){
                const pageHeight = this.$refs.pageHeight.offsetHeight;
                const btnHeight = this.$refs.btnHeight.offsetHeight;
                this.formHeight = this.$refs.formHeight.offsetHeight;
                this.height = pageHeight-btnHeight-this.$store.state.pageHeight;
                this.tabHeight = this.height-this.formHeight;
            },

            //切换显示状态
            toggleSearch(){
                this.arrowBot = !this.arrowBot;
                this.arrowTop = !this.arrowTop;
                this.searchVisible = !this.searchVisible;
                if (this.searchVisible) {
                    setTimeout(() => {
                        this.tabHeight = this.height - this.formHeight;
                    },20)
                } else {
                    this.tabHeight = this.height;
                }
            },

            getlist(){
                this.tableData = []
                this.fetch('/sys/role/getAll', this.objfilter({
                    rolename: this.filterform.rolename,
                    account: this.filterform.account,
                    isexpired: this.filterform.isexpired,
                    allowdel: this.filterform.allowdel,
                    allowedit: this.filterform.allowedit,
                    enabled: this.filterform.enabled,
                    pageNo: this.cPage,
                    pageSize: this.cSize
                })).then((result) => {
                    if(result.status == '200'){
                        this.tableData = result.data.list;
                        this.cTotal = result.data.total;
                    }
                })
            },
            onSubmitFilterform(type, opt) {
                if (type == 'reset') {
                    this.$refs[opt].resetFields();
                }
                this.getlist();
            },
            handleDelete(obj) {
                var _delitems = [];
                if (obj.length > 0) {
                    _.each(obj, function (val, key) {
                        val.roleid ? _delitems.push(val.roleid) : '';
                    })
                    this.handleDelCommon('/sys/role/delete/'+_delitems.join(','), () => {
                        this.getlist()
                    });
                } else {
                    this.$message.warning('请选择一项删除')
                }
            },
        }
    }
</script>
