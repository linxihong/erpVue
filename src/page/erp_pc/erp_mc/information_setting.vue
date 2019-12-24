<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content f-doubleblock">
        <div class="left-block percent">
            <div class="scroll-tree tree-heightI scrollBar icon-treeI">
                <el-tree
                    class="render-tree"
                    :highlight-current="true"
                    :data="moduleList"
                    :props="defaultProps"
                    :accordion="true"
                    @node-click="getInformation">
                </el-tree>
            </div>
        </div>

        <div class="right-block system-block">
            <div class="rightDivI">
                <div class="right-contentI" ref="contentHeight">
                    <div class="right-header" ref="headerHeight">
                        <div class="console-title console-mt5 console-mb5 console-ml10">
                            <span class="color-12 ui-font">消息模板设置</span>
                        </div>
                    </div>

                    <div class="right-body">
                        <!-- 查询 -->
                        <div class="console-pt4 console-pb4" ref="formHeight">
                            <ZLCommonSearch :fields="searchFields" @search="search" @reset="reset" ref="ZLCommonSearch"></ZLCommonSearch>
                        </div>
                        <div class="console-pb4" ref="btnHeight">
                            <el-button class="ui-color3" @click="$routeTo('mc_information_setting_add')">新增</el-button>
                            <el-button class="ui-color2" @click="initials" title="刷新"><i class="fa fa-refresh"></i></el-button>
                        </div>

                        <ZLCommonTable
                            :tableData="tableData"
                            :itemValues="itemValues"
                            :tabHeight="tabHeight"
                            @editRoute="editRoute"
                            @delete="delrow">
                        </ZLCommonTable>

                        <!--分页-->
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
            </div>
        </div>
    </div>
    </div>
</template>

<script>
    import ZLCommonTable from '../../../components/ZLCommonTable'
    import ZLCommonSearch from '../../../components/ZLCommonSearch'
    export default {
        components:{
            ZLCommonTable,
            ZLCommonSearch,
        },
        data() {
            return {
                apiUrl:'/message/infotemplate/allByPage',
                defaultProps: {
                    label: (data, treeObject) => data.treeObject.itemname,
                    children: 'children'
                },
                tabHeight: 403,
                condition:{},
                moduleList: [],
                tableData: [],
                someData:[],
                searchFields:[
                    {
                        name: '消息类型',
                        type: 'select',
                        fieldName: 'type',
                        label: [{label:'系统公告',value:'xt'},{label:'任务信息',value:'rw'},{label:'信息提醒',value:'xx'}],
                    },{
                        name: '标题',
                        type: 'string',
                        fieldName: 'title'
                    }],         
                itemValues: [
                    {
                        name:'',
                        type:'select'
                    },
                    {
                        name:'infotemplatecd',
                        label:'消息编号',
                        width: 300,
                        widthI: 220,
                        type:'normal'
                    }, {
                        name:'name',
                        label:'消息名称',
                        width:'',
                        type:'normal'
                    }, {
                        name:'level',
                        label:'消息级别',
                        width:'',
                        type:'normal'
                    }, {
                        name:'status',
                        label:'消息状态',
                        width:'',
                        type: 'normal'
                    }, {
                        name:'systempresets',
                        label:'系统预置',
                        width:'',
                        type:'normal'
                    }, {
                        type:'button',
                        width: 120,
                        buttons: [
                            {name: 'editRoute',label:'编辑'},
                            {name: 'delete',label:'删除'},
                        ]
                    }
                ]
            }
        },
        mounted() {
            this.getlist();
            this.getlisttype();
            this.getDivHeight();
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
            'screenWid': 'toggleScreen',
            'screenHei': 'toggleScreen'
        },
        methods: {
            //查询
            search(params){
                this.condition =params.exts
                this.getlist();
            },

            getDivHeight(){
                const contentHeight = this.$refs.contentHeight.offsetHeight;
                const headerHeight = this.$refs.headerHeight.offsetHeight;
                const formHeight = this.$refs.formHeight.offsetHeight;
                const btnHeight = this.$refs.btnHeight.offsetHeight;
                this.tabHeight = contentHeight-headerHeight-formHeight-btnHeight-this.$store.state.pageHeight;
            },

            //浏览器窗口大小改变监听事件
            toggleScreen (){
                setTimeout(()=>{
                    this.getDivHeight();
                },70)
            },

            //刷新
            initials(){
                this.$refs.ZLCommonSearch.init();
            },

            //重置
            reset() {
                this.condition = {};
                this.getlist();
            },

            //获取列表
            getlist(typecode) {
                const _this = this;
                let tempData = [];
                this.fetch(this.apiUrl,{infotemplate:{
                    type:typecode || this.condition.type,
                    title:this.condition.title,
                    pageNo:this.cPage,
                    pageSize:this.cSize}})
                    .then(result => {
                        if(result.status === 200){
                          tempData = result.data.list;
                        for(let index in tempData) {
                            if (tempData[index].level === 1) {
                                tempData[index].level = '提醒'
                            }else if(tempData[index].level === 2){
                                tempData[index].level = '警告'
                            }
                        }

                        for(let index in tempData) {
                            if (tempData[index].status === 2) {
                                tempData[index].status = '禁用'
                            }else if(tempData[index].status === 1){
                                tempData[index].status = '启用'
                            }
                        }

                        for(let index in tempData) {
                            if (tempData[index].systempresets === 0) {
                                tempData[index].systempresets = '否'
                            }else if(tempData[index].systempresets === 1){
                                tempData[index].systempresets = '是'
                            }
                        }
                        this.cTotal = result.data.total;
                        _this.tableData = tempData;
                        }else {
                            this.$message({
                                message:_this.returnIntercept(result),
                                type:'error'
                            });
                        }
                    })
            },

            //获取树
            getlisttype(){
                this.fetch('message/dic/getList',{})
                    .then(result => {
                        this.moduleList = result.data;
                    })
            },

            //树节点的点击事件
            getInformation(data) {
                const _this = this;
                let typecode = data.treeObject.itemkey
                this.getlist(typecode);
            },

            //删除
            delrow(index,rows){
				this.deleteAjax('/message/infotemplate/del/'+rows[index].infotemplatecd)
					.then(result => {
						if(result.status === 200){
							this.$message({
								message: result.message,
								type: 'success'
                            });
                            this.getlist();
						}else if(result.status === 500){
							this.$message({
								message: result.message,
								type: 'error'
                            });
                            this.getlist();
						}
					})
			},

            //路由跳转
            editRoute(index,rows) {
                this.$routeTo('mc_information_setting_edit',{id:rows[index].infotemplatecd})
            }
        }
    }
</script>

<style lang="less" scoped type="text/less">

</style>