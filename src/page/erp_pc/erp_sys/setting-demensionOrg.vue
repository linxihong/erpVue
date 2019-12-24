<template>
    <div class="f-content" ref="pageHeight">
        <div class="console-pt4 console-pb4" ref="btnHeight">
            <el-button class="ui-color3" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&$routeTo('msm_setting_demension_org_add')">添加</el-button>
            <div class="pull-right">
                <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowBot">更多查询<i class="el-icon-arrow-down margin-2"/></span>
                <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowTop">更多查询<i class="el-icon-arrow-up margin-2"/></span>
            </div>
        </div>

        <div v-show="searchVisible" ref="formHeight" class="console-pb4">
            <el-card class="box-card__form">
                <el-form ref="filterform" :model="filterform" label-width="110px" class="filterformV cf" @keyup.enter.native="ifHasAuth('search')&&onSubmitFilterform()">
                    <el-form-item prop="demname" label="维度名称">
                        <el-input v-model="filterform.demname" placeholder="维度名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="demdesc" label="维度描述">
                        <el-input v-model="filterform.demdesc" placeholder="维度描述"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="ui-color3" v-auth="ifHasAuth('search')" @click="ifHasAuth('search')&&onSubmitFilterform()">查询</el-button>
                        <el-button class="ui-color2" v-auth="ifHasAuth('reset')" @click="ifHasAuth('reset')&&onSubmitFilterform('reset','filterform')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>

        <el-table
                :data="tableData"
                :height="tabHeight"
                @selection-change="handledemSelectionChange"
                @select="selection"
                class="console-width-12 ui-color4">

            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>

            <el-table-column
                    prop="demname"
                    label="维度名称">
            </el-table-column>

            <el-table-column
                    prop="demdesc"
                    label="维度描述">
            </el-table-column>

            <el-table-column
                    prop="demtype"
                    label="维度类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.demtype=='1'">行政维度</span>
                    <span v-if="scope.row.demtype=='2'">自定义维度</span>
                </template>
            </el-table-column>

            <el-table-column
                    label="操作"
                    width="200">
                <template slot-scope="scope">
                    <el-button type="text" v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&$handleEditClick([scope.row],{routeTo:'msm_setting_demension_org_edit',type:'edit'},'demid')">修改</el-button>
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
</template>
<script type="es6">
    export default {
        name: 'list',
        data () {
            return {
                nodekey: '',
                tabHeight: 515,
                height: null,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                checkAll: true,
                filterform: {
                    demname: '',
                    demdesc: '',
                },
                tableData: [],
                arrowBot: true,
                arrowTop: false,
                searchVisible: true,
                formHeight: null,
            }
        },
        mounted () {
            this.init();
            this.getAuthlist();
            this.fetchdata();
            this.getlist();
        },
        watch: {
            '$route': 'fetchdata'
        },
        methods: {
            init(){
                setTimeout(()=>{
                    this.getDivHeight();
                },20)
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

            fetchdata(){
                this.$route.query.nodekey ? this.nodekey = this.$route.query.nodekey : '';
            },
            getlist(){
                this.tableData = [];
                this.fetch('/sys/demension/getAll', this.objfilter({
                    demname: this.filterform.demname,
                    demdesc: this.filterform.demdesc,
                    pageNo: this.cPage,
                    pageSize: this.cSize
                })).then((result) => {
                    if (result.status == '200') {
                        this.tableData = result.data.list;
                        this.cTotal = result.data.total;
                    }
                })
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
                this.getlist();
            },
            handleDelete(obj){
                var _delitems = [];
                if (obj.length > 0) {
                    /* if (obj[0].demtype == '1') {
                     this.$message.warning('不能删除项目！')
                     return false
                     }*/
                    _.each(obj, function (val, key) {
                        val.demid ? _delitems.push(val.demid) : '';
                    })
                    this.handleDelCommon('/sys/demension/delete/' + _delitems.join(','), () => {
                        this.getlist()
                    });
                } else {
                    this.$message.warning('请选择一项删除')
                }
            },
            selection(selection, row) {
                /* if (row.demtype == '1') {
                 selection.pop();
                 this.$message.warning('不能(修改)删除该项！')
                 }*/
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
            handledemSelectionChange(vals) {
                /*var _vals=[];
                 _.each(vals,function (val,key) {
                 if(val&&val.demtype != '1'){
                 _vals.push(val);
                 }else if(val&&val.demtype == '1'){
                 delete vals[key]
                 }
                 })
                 this.multipleSelection = _vals;*/
                this.multipleSelection = vals;
            },
        }
    }


</script>
