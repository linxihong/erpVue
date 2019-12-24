<template>
    <div>
        <div class="right-header console-pt5 console-pb5" ref="headerHeight">
            <div class="console-title console-ml10">
                <span class="color-12 ui-font">{{ifValue(this.$store.state.activenavItem.name,'代码管理')}}</span>
            </div>
        </div>
        <div class="right-body">
            <div class="console-pt4" ref="formHeight">
                <el-card class="box-card__form">
                    <el-form ref="filterform" :model="filterform" label-width="80px" class="filterform cf" @keyup.enter.native="ifHasAuth('search')&&onSubmitFilterform()">
                        <el-form-item prop="itemname" label="代码名称">
                            <el-input v-model="filterform.itemname" placeholder="代码名称"></el-input>
                        </el-form-item>

                        <el-form-item prop="itemvalue" label="代码值">
                            <el-input v-model="filterform.itemvalue" placeholder="代码值"></el-input>
                        </el-form-item>

                        <el-form-item prop="iscache" label="状态">
                            <el-select v-model="filterform.iscache" clearable placeholder="状态">
                                <el-option label="启用" value="1"></el-option>
                                <el-option label="停用" value="0"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-button class="ui-color3" v-auth="ifHasAuth('search')" @click="ifHasAuth('search')&&onSubmitFilterform()">查询</el-button>
                            <el-button class="ui-color2" v-auth="ifHasAuth('reset')" @click="ifHasAuth('reset')&&onSubmitFilterform('reset','filterform')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>

            <div class="pt10 pb10" ref="btnHeight">
                <el-button class="ui-color3" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&$routeToWithQuery('msm_code_add',{nodekey: $route.query.nodekey,codeid: $route.query.codeid,systemid:$route.query.systemid})">
                    添加
                </el-button>
            </div>

            <el-table
                    :data="tableData"
                    :height="tabHeight"
                    @selection-change="handleSelectionChange"
                    class="console-width-12 ui-color4">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="排序" class-name="tbSort" prop="sort" width="120">
                    <template slot-scope="scope">
                        <el-input size="small" v-model="scope.row.sort" placeholder="排序">
                            <el-button slot="append" icon="check" @click="handleSorticonClick(scope.row)"></el-button>
                        </el-input>
                    </template>
                </el-table-column>

                <!--<el-table-column prop="nodekey" label="代码编码" width=""></el-table-column>-->
                <el-table-column prop="itemname" label="代码名称" width=""></el-table-column>
                <el-table-column prop="itemvalue" label="代码值" width=""></el-table-column>
                <el-table-column prop="iscache" label="状态" width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.iscache==1">启用</span>
                        <span v-if="scope.row.iscache==0">停用</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" width=""></el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <!--$handleEditClick([scope.row],{routeTo:'msm_code_edit',type:'edit'},'dicid')-->
                        <el-button type="text" v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&$routeTo('msm_code_edit', {id: scope.row.dicid}, {nodekey: scope.row.nodekey})">
                            修改
                        </el-button>
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
</template>
<script type="es6">
    export default {
        name: 'code',
        props:['contentHeight'],
        data() {
            return {
                tabHeight: 373,
                nodekey: '',
                typeid: '',
                pageType: '1',

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                checkAll: true,
                filterform: {
                    iscache: '',
                    itemname: '',
                    itemvalue: '',
                },
                tableData: [],
            }
        },
        computed: {
            screenWid() {
                return this.$store.state.screenWid;
            },
            screenHei() {
                return this.$store.state.screenHei;
            }
        },
        watch: {
            '$route': function () {
                if(this.$route.query.nodekey&&this.$route.query.codeid) {
                    this.init();
                }
            },
            'screenWid': function () {
                setTimeout(()=>{
                    this.getDivHeight();
                },20)
            },
            'screenHei': function () {
                setTimeout(()=>{
                    this.getDivHeight();
                },70)
            }
        },
        mounted() {
            this.init();
            setTimeout(()=>{
                this.getDivHeight();
            },220)
        },
        methods: {
            init() {
                this.getAuthlist();
                if (this.$route.query.nodekey) {
                    this.nodekey = this.$route.query.nodekey;
                }
                if (this.$route.query.codeid) {
                    this.typeid = this.$route.query.codeid;
                }
                if (this.$route.params.cid) {
                    this.pageType = this.$route.params.cid;
                }
                this.getlist();
            },
            getDivHeight(){
                const headerHeight = this.$refs.headerHeight.offsetHeight;
                const formHeight = this.$refs.formHeight.offsetHeight;
                const btnHeight = this.$refs.btnHeight.offsetHeight;
                this.tabHeight = this.contentHeight-headerHeight-formHeight-btnHeight-this.$store.state.pageHeight;
            },
            getlist() {
                this.tableData = [];
                this.fetch('/sys/dic/getAllCode/'+this.pageType, this.objfilter({

                    typeid: this.$route.query.codeid,
                    nodekey: this.$route.query.nodekey,

                    iscache: this.filterform.iscache,
                    itemname: this.filterform.itemname,
                    itemvalue: this.filterform.itemvalue,
                    pageNo: this.cPage,
                    pageSize: this.cSize
                }), {
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if (result.status == '200') {
                        this.tableData = result.data.list;
                        this.cTotal = result.data.total;
                        this.$route.query.codeid?this.$parent.treeExpandeds = [this.$route.query.codeid]:''
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
                let _delitems = [];
                if (obj.length > 0) {
                    _.each(obj, function (val, key) {
                        val.dicid ? _delitems.push(val.dicid) : '';
                    });
                    this.handleDelCommon('/sys/dic/delete/' + _delitems.join(','), () => {
                        //this.$parent.treeOptions = [];
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
            /* 列表排序 */
            handleSorticonClick(row) {
                if (this.handlesortfilter(row.sort.toString())) {
                    //this.$message.success('这是有效数字,可以进行排序');
                    //排序
                    this.getAjax('/sys/dic/updateSort/' + row.dicid + '/' + row.sort).then((result) => {
                        this.$handleRes(result);
                        this.getlist();
                    })
                }
            }
        }
    }


</script>
