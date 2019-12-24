<template>
    <div class="percent">
        <div class="right-header console-pt5 console-pb5" ref="headerHeight">
            <div class="console-title console-ml10">
                <span class="color-12 ui-font">{{ifValue(this.$store.state.activenavItem.name,'参数管理')}}列表</span>
            </div>
        </div>
        <div class="right-body">
            <div class="console-pt4" ref="formHeight">
                <el-card class="box-card__form">
                    <el-form ref="filterform" :model="filterform" label-width="80px" class="filterform cf" @keyup.enter.native="ifHasAuth('search')&&onSubmitFilterform()">
                        <el-form-item prop="itemname" label="参数名称">
                            <el-input v-model="filterform.itemname" placeholder="参数名称"></el-input>
                        </el-form-item>

                        <el-form-item prop="itemvalue" label="参数值">
                            <el-input v-model="filterform.itemvalue" placeholder="参数值"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button class="ui-color3" v-auth="ifHasAuth('search')" @click="ifHasAuth('search')&&onSubmitFilterform()">查询</el-button>
                            <el-button class="ui-color2" v-auth="ifHasAuth('reset')" @click="ifHasAuth('reset')&&onSubmitFilterform('reset','filterform')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>

            <div class="pt10 pb10" ref="btnHeight">
                <el-button class="ui-color3" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&$routeToWithQuery('msm_operationallimits_add',{nodekey: $route.query.nodekey,paramid: $route.query.paramid})">添加</el-button>
            </div>
            <el-table
                    :data="tableData"
                    :height="tabHeight"
                    @selection-change="handleSelectionChange"
                    class="console-width-12 ui-color4">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>

                <el-table-column
                        label="排序"
                        class-name="tbSort"
                        prop="sort"
                        width="120">
                    <template slot-scope="scope">
                        <el-input size="small" v-model="scope.row.sort" placeholder="排序">
                            <el-button slot="append" icon="check" @click="handleSorticonClick(scope.row)"></el-button>
                        </el-input>
                    </template>
                </el-table-column>

                <!--<el-table-column prop="nodekey" label="参数编码" width=""></el-table-column>-->
                <el-table-column prop="itemname" label="参数名称" width=""></el-table-column>
                <el-table-column prop="itemvalue" label="参数值" width=""></el-table-column>
                <el-table-column prop="iscache" label="是否缓存" width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.iscache==1">启用</span>
                        <span v-if="scope.row.iscache==0">停用</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" width=""></el-table-column>

                <el-table-column
                        label="操作"
                        width="150">
                    <template slot-scope="scope">
                        <!-- $handleEditClick([scope.row],{routeTo:'msm_operationallimits_edit',type:'edit'},'dicid') -->
                        <el-button type="text" v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&$routeTo('msm_operationallimits_edit', {id: scope.row.dicid}, {nodekey: scope.row.nodekey})">修改</el-button>
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
        name: 'operationalimits',
        props:['contentHeight'],
        data () {
            return {
                tabHeight: 416,
                nodekey: '',
                typeid: '',

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                checkAll: true,
                filterform: {
                    itemkey: '',
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
                this.init();
            },
            'screenWid': function () {
                setTimeout(()=>{
                    this.getDivHeight();
                },30)
            },
            'screenHei': function () {
                setTimeout(()=>{
                    this.getDivHeight();
                },70)
            }
        },
        mounted () {
            this.init();
            setTimeout(()=>{
                this.getDivHeight();
            },220)
        },
        methods: {
            init(){
                this.getAuthlist();
                this.getlist();

                if(this.$route.query.nodekey){
                    this.nodekey=this.$route.query.nodekey;
                }
                if(this.$route.query.paramid){
                    this.typeid=this.$route.query.paramid;
                    //nodekey: $route.query.nodekey,typeid: $route.query.typeid
                }
            },

            getDivHeight(){
                const headerHeight = this.$refs.headerHeight.offsetHeight;
                const formHeight = this.$refs.formHeight.offsetHeight;
                const btnHeight = this.$refs.btnHeight.offsetHeight;
                this.tabHeight = this.contentHeight-headerHeight-formHeight-btnHeight-this.$store.state.pageHeight;
            },

            getlist(){
                this.tableData=[];
                var _apiUrl='/sys/dic/getAllSystemParameter'

                this.fetch(_apiUrl, this.objfilter({

                    typeid: this.$route.query.paramid,
                    nodekey: this.$route.query.nodekey,

                    itemkey: this.filterform.itemkey,
                    itemname: this.filterform.itemname,
                    itemvalue: this.filterform.itemvalue,
                    pageNo: this.cPage,
                    pageSize: this.cSize
                }),{
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if(result.status=='200'){
                        this.tableData = result.data.list;
                        this.cTotal = result.data.total;
                        this.$route.query.paramid?this.$parent.treeExpandeds = [this.$route.query.paramid]:''
                    }
                })
            },
            onSubmitFilterform(type,opt) {
                if(type=='reset'){
                    this.$refs[opt].resetFields();
                }
                this.getlist();
            },
            handleDelete(obj){
                var _delitems=[];
                if(obj.length>0){
                     _.each(obj,function (val,key) {
                        val.dicid?_delitems.push(val.dicid):'';
                     })
                     this.handleDelCommon('/sys/dic/delete/'+_delitems.join(','), () => {
                        this.getlist()
                     });
                }else{
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
            handleSorticonClick(row){
                if(this.handlesortfilter(row.sort.toString())){
                    //this.$message.success('这是有效数字,可以进行排序');
                    //排序
                    this.getAjax('/sys/dic/updateSort/'+ row.dicid+'/'+ row.sort).then((result) => {
                        this.$handleRes(result);
                        this.getlist();
                    })
                }
            }
        }
    }


</script>
<style scoped lang="less" type="text/less">
    .right-contentI {
        &:after{
            content:'';
            display: inline-block;
        }
    }
</style>
