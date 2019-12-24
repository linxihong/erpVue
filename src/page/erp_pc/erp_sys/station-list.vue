<template>
    <div>
        <div class="console-title">
            <h5>岗位</h5>
        </div>
        <el-card class="top-float box-card__form">
            <div slot="header" class="cf">
                <span class="top-float-item">条件查询</span>
            </div>
            <el-form ref="filterform" :model="filterform" label-width="120px" class="filterform form-select cf" @keyup.enter.native="ifHasAuth('search')&&onSubmitFilterform()">
                <el-form-item prop="posname" label="岗位名称">
                    <el-input v-model="filterform.posname" placeholder="岗位名称"></el-input>
                </el-form-item>
                <el-form-item prop="alias" label="别名">
                    <el-input v-model="filterform.alias" placeholder="别名"></el-input>
                </el-form-item>
                <el-form-item prop="isleaf" label="是否页节点">
                    <el-select v-model="filterform.isleaf" clearable placeholder="是否页节点">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button v-auth="ifHasAuth('search')" @click="ifHasAuth('search')&&onSubmitFilterform()">查询</el-button>
                    <el-button v-auth="ifHasAuth('reset')" @click="ifHasAuth('reset')&&onSubmitFilterform('reset','filterform')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <div class="mt15">
            <el-button v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&$routeTo('msm_station_add')">添加</el-button>
        </div>
        <el-card class="del-shadow mt15">
            <el-table
                    :data="tableData"
                    class="console-width-12">
                <el-table-column
                        type="selection"
                        @selection-change="handleSelectionChange"
                        width="55">
                </el-table-column>
                <el-table-column prop="posname" label="岗位名称" width=""></el-table-column>
                <el-table-column prop="alias" label="别名" width=""></el-table-column>
                <el-table-column prop="posdesc" label="岗位描述" width=""></el-table-column>
                <el-table-column prop="isleaf" label="是否页节点" width=""></el-table-column><!-- 1=是，0=否-->
                <el-table-column
                    label="操作"
                    width="180">
                    <template slot-scope="scope">
                        <el-button v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&$handleEditClick([scope.row],{routeTo:'msm_position_edit',type:'edit'},'posid')">修改</el-button>
                        <el-button size="small" v-auth="ifHasAuth('delete')" @click="ifHasAuth('delete')&&handleDelete([scope.row])">删除</el-button>
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
                    "posname": "",
                    "isleaf": "",
                    "alias": "",
                },
                tableData: [],
            }
        },
        mounted () {
            this.init();
        },
        methods: {
            init(){
                this.getAuthlist();
                this.getlist();
            },
            getlist(){
                this.tableData = []
                this.fetch('/sys/station/getAll', this.objfilter({
                    posname: this.filterform.posname,
                    isleaf: this.filterform.isleaf,
                    alias: this.filterform.alias,
                    pageNo: this.cPage,
                    pageSize: this.cSize,
                })).then((result) => {
                    if (result.status == '200') {
                        this.tableData = result.data.list;
                    }
                })
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
                        val.systemid ? _delitems.push(val.posid) : '';
                    })
                    if (confirm('确定删除？') == true) {
                        this.deleteAjax('/sys/station/delete/' + _delitems.join(',')).then((result) => {
                            this.$handleRes(result);
                            if (result.status == '200') {
                                this.getlist()
                            }
                        })
                    }
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
