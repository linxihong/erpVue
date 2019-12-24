<template>
    <div class="f-content" ref="pageHeight">
        <div class="console-pt4 console-pb4" ref="btnHeight">
            <el-button class="ui-color3" size="small" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&$routeTo('msm_setting_subsystem_add')">添加</el-button>
            <div class="pull-right">
                <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowBot">更多查询<i class="el-icon-arrow-down margin-2"/></span>
                <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowTop">更多查询<i class="el-icon-arrow-up margin-2"/></span>
            </div>
        </div>

        <div v-show="searchVisible" ref="formHeight" class="console-pb4">
            <el-card class="box-card__form">
                <el-form ref="filterform" :model="filterform" label-width="110px" class="filterformV cf" @keyup.enter.native="ifHasAuth('search')&&onSubmitFilterform()">
                    <el-form-item label="子系统名称" prop="sysname" >
                        <el-input v-model="filterform.sysname" placeholder="子系统名称"></el-input>
                    </el-form-item>

                    <el-form-item label="子系统别名" prop="alias">
                        <el-input v-model="filterform.alias" placeholder="子系统别名"></el-input>
                    </el-form-item>

                    <el-form-item label="允许删除" prop="allowdel">
                        <el-select v-model="filterform.allowdel" clearable placeholder="允许删除">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="激活" prop="isactive">
                        <el-select v-model="filterform.isactive" clearable placeholder="激活">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="本地系统" prop="islocal">
                        <el-select v-model="filterform.islocal" clearable placeholder="本地系统">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button class="ui-color3" size="small" v-auth="ifHasAuth('search')" @click="ifHasAuth('search')&&onSubmitFilterform()">查询</el-button>
                        <el-button class="ui-color2" size="small" v-auth="ifHasAuth('reset')" @click="ifHasAuth('reset')&&onSubmitFilterform('reset','filterform')">重置</el-button>
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

                <el-table-column prop="sysname" label="子系统名称" width="120"></el-table-column>
                <el-table-column prop="alias" label="别名" width="100"></el-table-column>
                <el-table-column prop="logo" label="图标" width="">
                    <template slot-scope="scope">
                      <i :class="scope.row.logo"></i>
                    </template>
                </el-table-column>

                <!--<el-table-column prop="defaulturl" label="默认地址" width="150"></el-table-column>-->
                <el-table-column prop="allowdel" label="允许删除">
                    <template slot-scope="scope">
                        <span v-if="scope.row.allowdel==1">是</span>
                        <span v-if="scope.row.allowdel==0">否</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isactive" label="激活">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isactive==1">是</span>
                        <span v-if="scope.row.isactive==0">否</span>
                    </template>
                </el-table-column>
                <el-table-column prop="islocal" label="本地系统">
                    <template slot-scope="scope">
                        <span v-if="scope.row.islocal==1">是</span>
                        <span v-if="scope.row.islocal==0">否</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button class="btn-color" type="text" v-auth="ifHasAuth('details')" @click="ifHasAuth('details')&&$router.push({ name:'msm_setting_subsystem_detail',params:{id:scope.row.systemid}})">详情</el-button>
                        <span class="color-2">|</span>
                        <el-button class="btn-color" type="text" v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&$handleEditClick([scope.row],{routeTo:'msm_setting_subsystem_edit',type:'edit'},'systemid')">修改</el-button>
                        <span class="color-2">|</span>
                        <el-button class="btn-color" type="text" v-auth="ifHasAuth('delete')" @click="ifHasAuth('delete')&&handleDelete([scope.row])" :disabled="scope.row.allowdel==0">删除</el-button>
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
<script type="text/ecmascript-6">
    export default {
        name: 'list',
        data () {
            return {
                tabHeight: 465,
                height: null,
                nodekey: '',

                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                checkAll: true,
                filterform: {
                    alias: '',
                    sysname: '',
                    allowdel: '',
                    isactive: '',
                    islocal: '',
                },
                tableData: [],
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                arrowBot: true,
                arrowTop: false,
                searchVisible: true,
                formHeight: null,
            }
        },
        mounted () {
            this.init();
            //this.handlefilterstring("systemid             decimal(18,0) not null comment '系统ID',orgid                decimal(18,0) comment '组织ID',sysname              varchar(50) comment '分类设置名称',alias                varchar(20) comment '别名',logo                 varchar(50) comment '分类设置图标',defaulturl           varchar(50) comment '默认地址',remark               text comment '备注',allowdel             tinyint comment '允许删除',needorg              decimal(18,0) comment '选择组织架构         (0,不需要选择,1,需要选择)         如果用户只属于一个组织读取组织后，放到当前上下文。多个的话则需要选择。',isactive             tinyint comment '是否激活',islocal              tinyint comment '是否本地系统',homepage             varchar(256) comment '首页地址'")
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
                this.tableData=[];
                this.fetch('/sys/subsystem/getAll', this.objfilter({
                    sysname: this.filterform.sysname,
                    alias: this.filterform.alias,
                    allowdel: this.filterform.allowdel,
                    isactive: this.filterform.isactive,
                    islocal: this.filterform.islocal,
                    pageNo: this.cPage,
                    pageSize: this.cSize
                })).then((result) => {
                    if(result.status=='200'){
                        this.tableData=result.data.list;
                        this.cTotal = result.data.total;
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
                        val.systemid?_delitems.push(val.systemid):'';
                    })
                    this.handleDelCommon('/sys/subsystem/delete/'+_delitems.join(','), () => {
                        this.getlist()
                    });
                }else{
                    this.$message.warning('请选择一项删除')
                }
            },

            handleNodeClick(data) {
                //console.log(data);
            },
            handleDetailClick () {
                this.$router.push({name: "detail"})
            },
            handleSorticonClick (obj) {
                if(obj.sort>0){
                    this.fetch('/sys/subsystem/update',obj).then((result) => {
                        this.$handleRes(result);
                        this.getlist();
                    })
                }else{
                    //obj.sort = 0;
                    this.$message({
                        message: "排序不能小于0，请重新输入",
                        type: 'warning'
                    })
                }
            },
        }
    }


</script>

