<template>
    <div class="f-content" ref="pageHeight">
        <div class="console-pt4 console-pb4" ref="btnHeight">
            <el-button class="ui-color3" size="small" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&$routeTo('msm_setting_typekey_add')">添加</el-button>
            <div class="pull-right">
                <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowBot">更多查询<i class="el-icon-arrow-down margin-2"/></span>
                <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowTop">更多查询<i class="el-icon-arrow-up margin-2"/></span>
            </div>
        </div>

        <div v-show="searchVisible" ref="formHeight" class="console-pb4">
            <el-card class="box-card__form">
                <el-form ref="filterform" :model="filterform" label-width="110px" class="filterformV cf" @keyup.enter.native="ifHasAuth('search')&&onSubmitFilterform()">
                    <el-form-item prop="typename" label="标识符名称">
                        <el-input v-model="filterform.typename" placeholder="标识符名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="typekey" label="标识符别名">
                        <el-input v-model="filterform.typekey" placeholder="标识符别名"></el-input>
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
                    @selection-change="handletypeSelectionChange"
                    class="console-width-12">

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

                <el-table-column
                        prop="typename"
                        label="标识符名称"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="typekey"
                        label="标识符别名"
                        width="">
                 <!--   <template slot-scope="scope">
                        <span>{{ scope.row.typekey.replace(/(\S*)_/,'')}}</span>
                    </template>-->
                </el-table-column>

                <el-table-column
                        prop="idenflag"
                        width=""
                        label="标识符类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.idenflag==0">分类</span>
                        <span v-if="scope.row.idenflag==1">参数设置</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="flag"
                        width=""
                        label="是否可删除">
                    <template slot-scope="scope">
                        <span v-if="scope.row.flag==0">是</span>
                        <span v-if="scope.row.flag==1">否</span>
                    </template>
                </el-table-column>

                <el-table-column
                label="操作"
                width="150">
                <template slot-scope="scope">

                    <el-button class="btn-color" type="text" v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&$handleEditClick([scope.row],{routeTo:'msm_setting_typekey_edit',type:'edit'},'typemrkid')">修改</el-button>
                    <span class="color-2">|</span>
                    <el-button class="btn-color" type="text" v-auth="ifHasAuth('delete')" @click="ifHasAuth('delete')&&handleDelete([scope.row])" :disabled="scope.row.flag==1">删除</el-button>

                </template>
                </el-table-column>

            </el-table>
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
</template>
<script type="es6">
    export default {
        name: 'list',
        data () {
            return {
                tabHeight: 515,
                height: null,
                systemid: '',

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                checkAll: true,
                filterform: {
                    typename: '',
                    typekey: ''
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
        },
        watch: {
            '$route': 'fetchdata'
        },
        methods: {
            init(){
                this.getAuthlist();
                this.getlist();
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

            getlist(){
                this.fetch('/sys/typekey/getAll', this.objfilter({
                    typename: this.filterform.typename,
                    typekey: this.filterform.typekey,
                    pageNo: this.cPage,
                    pageSize: this.cSize
                }),{
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    if (result.status == '200') {
                        this.tableData = result.data.list;
                        this.cTotal = result.data.total;
                    }
                })
            },
            handleDelete(obj){
                var _delitems = [],status=true;
                if (obj.length > 0) {
                    _.each(obj, (val, key) =>{
                        val.typemrkid ? _delitems.push(val.typemrkid) : ''
                        if (val.flag == '1') {
                            this.$message.warning('不能删除项目！')
                            status=false;
                            return false;
                        }
                    });
                    if(status==true){
                        this.handleDelCommon('/sys/typekey/delete/'+_delitems.join(','), () => {
                            this.getlist()
                        });
                    }else if(status==false){
                        this.$message.warning('不能删除项目！')
                    }
                } else {
                    this.$message.warning('请选择一项删除')
                }
            },
            onSubmitFilterform(type, opt) {
                if (type == 'reset') {
                    this.$refs[opt].resetFields();
                }
                this.getlist();
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
                    this.getAjax('/sys/typekey/updateSort/'+row.typemrkid+'/'+ row.sort,{
                        headers: {systemid: this.$store.state.systemid
                        }
                    }).then((result) => {
                        this.$handleRes(result);
                        this.getlist();
                    })
                }
            },
            handletypeSelectionChange(vals){
//                var _vals=[];
//                _.each(vals,function (val,key) {
//                    if(val&&val.flag != '0'){
//                        _vals.push(val);
//                    }else if(val&&val.flag == '0'){
//                        delete vals[key]
//                    }
//                })
//                this.multipleSelection = _vals;
                this.multipleSelection = vals;
            }
        }
    }


</script>
