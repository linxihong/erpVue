<template>
    <div class="">
        <div class="console-title">
            <h4>分类详情</h4>
        </div>

        <div class="mt15">
            <el-button icon="plus" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&$routeTo('msm_setting_gltype_add')">添加</el-button>
        </div>

            <el-table
                    :data="tableData"
                    class="mt15 console-width-12">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="date"
                        label="参数编码"
                        width="180">
                    <template slot-scope="scope">
                        <router-link :to="{ name:'msm_account_detail',params:{id:scope.row.id}}">{{scope.row.date}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="参数名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="参数值">
                </el-table-column>
                <el-table-column
                        prop="index"
                        label="所属分组编码">
                </el-table-column>
                <el-table-column
                        prop="index"
                        label="是否缓存">
                </el-table-column>
                <el-table-column
                        prop="index"
                        label="排序号">
                </el-table-column>
                <el-table-column
                        prop="index"
                        label="备注">
                </el-table-column>
                <el-table-column
                label="重置密码"
                width="100">
                    <template slot-scope="scope">
                        <el-button v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&$handleEditClick([scope.row],{routeTo:'msm_setting_gltype_edit',type:'edit'},'typeid')">修改</el-button>
                        <el-button v-auth="ifHasAuth('delete')" @click="ifHasAuth('delete')&&handleDelete([scope.row])">删除</el-button>
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
</template>
<script type="es6">
    export default {
        name: 'list',
        data () {
            return {
                nodekey: '',

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
                tableData: [{
                    id: 1,
                    index: 1,
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],
            }
        },
        mounted () {
            //this.init();
            this.fetchdata();
        },
        watch: {
            '$route': 'fetchdata'
        },
        methods: {
            init(){

            },
            fetchdata(){
                this.$route.query.nodekey ? this.nodekey = this.$route.query.nodekey : '';
            },
            getlist(){
                this.fetch('/sys/gltype/getAll', this.objfilter({pageNo: this.cPage, pageSize: this.cSize}), {
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then(function (result) {

                })
            },
            handleNodeClick(data) {

            },
            onSubmitFilterform() {

            },
            handleDelete(obj){
                let _delitems = [];
                if (obj.length > 0) {
                    _.each(obj, function (val, key) {
                        val.typeid ? _delitems.push(val.typeid) : '';
                    })
                    this.handleDelCommon('/sys/gltype/delete/'+_delitems.join(','), () => {
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

            }
        }
    }


</script>
