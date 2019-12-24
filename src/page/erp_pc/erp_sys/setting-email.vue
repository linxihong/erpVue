<template>
    <div class="f-content" ref="pageHeight">

        <div class="console-pt4 console-pb4" ref="btnHeight">
            <el-button class="ui-color3" v-auth="ifHasAuth('add')" @click="ifHasAuth('add')&&$routeTo('msm_setting_email_add')">添加</el-button>
            <div class="pull-right">
                <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowBot">更多查询<i class="el-icon-arrow-down margin-2"/></span>
                <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowTop">更多查询<i class="el-icon-arrow-up margin-2"/></span>
            </div>
        </div>
        <div v-show="searchVisible" ref="formHeight" class="console-pb4">
            <el-card class="box-card__form">
                <el-form ref="filterform" :model="filterform" label-width="80px" class="filterform cf">
                    <el-form-item label="帐号名称" prop="mailname">
                        <el-input v-model="filterform.mailname" placeholder="帐号"></el-input>
                    </el-form-item>

                    <el-form-item label="邮箱地址" prop="mailaddress">
                        <el-input v-model="filterform.mailaddress" placeholder="邮箱地址"></el-input>
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
                class="console-width-12 ui-color4">

            <el-table-column
                    prop="mailname"
                    label="账号名称"
                    width="">
            </el-table-column>

            <el-table-column
                    prop="mainaddress"
                    label="邮箱地址"
                    width="">
            </el-table-column>

            <el-table-column
                    prop="isdefault"
                    label="是否默认"
                    width="">
                <template slot-scope="scope">
                    <span v-if="scope.row.isdefault==1">是</span>
                    <span v-if="scope.row.isdefault==0">否</span>
                </template>
            </el-table-column>

            <el-table-column
            label="操作"
            width="180">
                <template slot-scope="scope">
                    <el-button type="text" v-auth="ifHasAuth('update')" @click="ifHasAuth('update')&&$handleEditClick([scope.row],{routeTo:'msm_setting_email_edit',type:'edit'},'mailsetid')">修改</el-button>
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
    const treeOptions = [];

    export default {
        name: 'list',
        data () {
            return {
                tabHeight: null,
                height: null,
                treeOptions: null,
                treeExpandeds: [],
                filterform: {
                    mailname: '',
                    mailaddress: '',
                    pageNo: this.cPage,
                    pageSize: this.cSize,
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
            setTimeout(()=>{
                this.getDivHeight();
            },20)
        },
        methods: {
            init(){
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

            //刷新
            initials(){
                this.$refs.ZLCommonSearch.init();
            },

            getlist(){
                this.fetch('/sys/mail/getAll', this.objfilter({pageNo: this.cPage, pageSize: this.cSize}), {
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
                let _delitems = [];
                if (obj.length > 0) {
                    _.each(obj, function (val, key) {
                        val.mailsetid ? _delitems.push(val.mailsetid) : '';
                    });
                    this.handleDelCommon('/sys/mail/delete/'+_delitems.join(','), () => {
                        this.getlist()
                    });
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
        }
    }


</script>
