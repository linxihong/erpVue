<template>
    <div class="f-content" ref="pageHeight">
        <div class="console-pt4 console-pb4" ref="btnHeight">
            <!--<el-button @click="$routeTo('msm_setting_system_log_add')">添加</el-button>-->
            <!--<el-button @click="$handleEditClick(multipleSelection,{routeTo:'msm_setting_system_log_edit',type:'edit'},'auditid')">修改</el-button>-->
            <el-button class="ui-color3" v-auth="ifHasAuth('delete')" @click="ifHasAuth('delete')&&handleDelete(multipleSelection)">批量删除</el-button>
            <div class="pull-right">
                <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowBot">更多查询<i class="el-icon-arrow-down margin-2"/></span>
                <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowTop">更多查询<i class="el-icon-arrow-up margin-2"/></span>
            </div>
        </div>

        <div v-show="searchVisible" ref="formHeight" class="console-pb4">
            <el-card class="box-card__form">
                <el-form ref="filterform" :model="filterform" label-width="120px" class="filterformV cf" @keyup.enter.native="ifHasAuth('search')&&onSubmitFilterform()">
                    <el-form-item label="操作名称" prop="opname">
                        <el-input v-model="filterform.opname" placeholder="操作名称"></el-input>
                    </el-form-item>

                    <el-form-item label="账号" prop="executor">
                        <el-input v-model="filterform.executor" placeholder="账号"></el-input>
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
                @selection-change="handleSelectionChange"
                class="console-width-12">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column prop="opname" label="操作名称"></el-table-column>
            <el-table-column prop="exetime" label="执行时间"></el-table-column>
            <el-table-column prop="executor" label="账号"></el-table-column>
            <el-table-column prop="fromip" label="IP"></el-table-column>
            <el-table-column prop="requesturi" label="请求URL" ></el-table-column>
            <!--<el-table-column-->
            <!--label="操作"-->
            <!--width="150">-->
            <!--<template slot-scope="scope">-->
            <!--<el-button @click="" type="text" size="small">人员配置</el-button>-->
            <!--<el-button @click="handleResetpsdDialog(scope.row)" type="text" size="small">重置密码</el-button>-->
            <!--</template>-->
            <!--</el-table-column>-->
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
        name: 'account',
        data() {
            return {
                tabHeight: 515,
                height: null,
                resetpsd: {
                    password: '',
                    checkpsd: ''
                },
                filterform: {
                    "opname": "",
                    "exetime": "",
                    "executor": "",
                    "fromip": "",
                    "requesturi": "",
                    "reqparams": "",
                    pageNo: this.cPage,
                    pageSize: this.cSize,
                },
                tableData: [],
                resetpsdrules: {
                    password: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                    ],
                    checkpsd: [
                        {validator: this._validateCheckPsd, check: ['resetpsd'], trigger: 'blur'},
                    ],
                },
                arrowBot: true,
                arrowTop: false,
                searchVisible: true,
                formHeight: null,
            }
        },
        mounted() {
            //this.init();{pageNo:this.cPage,pageSize:this.cSize}
            this.getAuthlist();
            this.getlist();
            setTimeout(()=>{
                this.getDivHeight();
            },20)
        },
        methods: {
            _validateCheckPsd(rule, value, callback) {
                this.validateCheckPsd(rule, value, callback, this.resetpsd.password)
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

            getlist() {
                this.tableData = []
                this.fetch('/sys/audit/getAll', this.objfilter({
                    opname: this.filterform.opname,
                    exetime: this.filterform.exetime,
                    executor: this.filterform.executor,
                    fromip: this.filterform.fromip,
                    requesturi: this.filterform.requesturi,
                    reqparams: this.filterform.reqparams,
                    pageNo: this.cPage,
                    pageSize: this.cSize,
                })).then((result) => {
                    if (result.status == '200') {
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
                        val.auditid ? _delitems.push(val.auditid) : '';
                    })
                    this.handleDelCommon('/sys/audit/delete/'+_delitems.join(','), () => {
                        this.getlist()
                    });
                } else {
                    this.$message.warning('请选择一项删除')
                }
            }
        }
    }


</script>
