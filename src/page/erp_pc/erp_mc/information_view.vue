<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content f-doubleblock">
        <div class="left-block percent">
            <div class="scroll-tree icon-treeII scrollBar tree-heightI">
                <el-tree
                    class="render-tree"
                    :highlight-current="true"
                    :data="moduleList"
                    :props="defaultProps"
                    :accordion="true"
                    @node-click="getlistuserid">
                </el-tree>
            </div>
        </div>

        <div class="right-block system-block">
            <div class="rightDivI">
                <div class="right-contentI" ref="contentHeight">
                    <div class="right-header" ref="headerHeight">
                        <div class="console-title console-mt5 console-mb5 console-ml10">
                            <span class="color-12 ui-font">{{this.moduleListName}}&nbsp;</span>
                        </div>
                    </div>

                    <div class="right-body">
                        <!--查询条件-->
                        <div class="console-pt4 console-pb4" ref="formHeight">
                            <ZLCommonSearch ref="formHeight" :fields="searchFields" @search="search" @reset="reset"></ZLCommonSearch>
                        </div>
                        <el-table
                            :data="tableData"
                            :height="tabHeight"
                            highlight-current-row
                            class="th-center">
                            <el-table-column  prop="typename" label="消息类型" min-width="10" align="center"></el-table-column>
                            <el-table-column  prop="title" label="标题" min-width="15" align="center"></el-table-column>
                            <el-table-column  prop="content" label="消息内容" min-width="20" align="center"></el-table-column>
                            <el-table-column  prop="level" label="消息级别" min-width="10" align="center"></el-table-column>
                            <el-table-column  prop="choose" label="订阅" min-width="9" align="center">
                                <template slot-scope="scope">
                                    <el-checkbox v-model='scope.row.choose' :disabled="true"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="提醒方式" min-width="36">
                                <template slot-scope="scope">
                                    <el-checkbox-group v-model="scope.row.checkList">
                                        <el-checkbox label="1" :disabled="true">页面弹窗</el-checkbox>
                                        <el-checkbox label="2" :disabled="true">APP</el-checkbox>
                                        <el-checkbox label="3" :disabled="true">微信</el-checkbox>
                                        <el-checkbox label="4" :disabled="true">邮件</el-checkbox>
                                    </el-checkbox-group>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- <ZLCommonTable
                                :tableData="tableData"
                                :itemValues="itemValues"
                                :tabHeight="tabHeight">
                        </ZLCommonTable> -->

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
                defaultProps: {
                    label: (data, treeObject) => data.treeObject.orgname,
                    children: 'children'
                },
                moduleListName: '',
                tabHeight: 448,
                condition:{},
                moduleList: [],
                tableData: [],
                someData:[],
                checkList:[],
                searchFields:[
                    {
                        name: '消息类型',
                        type: 'select',
                        fieldName: 'type',
                        label: [{label:'系统公告',value:'xt'},{label:'任务信息',value:'rw'},{label:'信息提醒',value:'信息'}],
                    },{
                        name: '标题',
                        type: 'string',
                        fieldName: 'title'
                    }],         
                itemValues: [
                    {
                        name:'type',
                        label:'消息类型',
                        width:'',
                        type:'normal'
                    }, {
                        name:'title',
                        label:'标题',
                        width:'',
                        type:'normal'
                    }, {
                        name:'content',
                        label:'消息内容',
                        width:'',
                        type:'normal'
                    }, {
                        name:'level',
                        label:'消息级别',
                        width:'',
                        type: 'normal'
                    }, {
                        type:'choose',
                        label:'订阅',
                        width: 80,
                        widthI: 60,
                        chooses: [
                            {code: '0',label:'订阅'}
                        ]
                    }, {
                        name:'remindermode',
                        label:'提醒方式',
                        type:'choose',
                        width: 300,
                        widthI: 320,
                        chooses: [
                            {code: '1',label:'页面弹窗'},
                            {code: '2',label:'APP'},
                            {code: '3',label:'微信'},
                            // {name: 'dd',label:'短信'},
                            {code: '4',label:'邮件'}
                        ]
                    }
                ],
            }
        },
        mounted() {
            this.init();
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
            //刷新
            init(){
                this.getSomeData();
                setTimeout(() => {
                    this.getlist();
                })
                this.getModuleList();
            },
            getDivHeight(){
                const contentHeight = this.$refs.contentHeight.offsetHeight;
                const headerHeight = this.$refs.headerHeight.offsetHeight;
                //const formHeight = this.$refs.formHeight.getDivHeight();
                const formHeight = this.$refs.formHeight.offsetHeight;
                this.tabHeight = contentHeight-headerHeight-formHeight-this.$store.state.pageHeight;
            },
            //浏览器窗口大小改变监听事件
            toggleScreen (){
                setTimeout(()=>{
                    this.getDivHeight();
                },70)
            },

            //查询
            search(params){
                this.condition =params.exts
                this.getlist();
            },

            //重置
            reset() {
                this.getlist();
            },

            //获取列表
            getlist(userid) {
                const _this = this;
                let tempData = [];
                this.fetch('/message/infotemplate/subscriptionByPage',{
                    infotemplate:{pageNo:this.cPage,
                    pageSize:this.cSize,
                    title:this.condition.title,
                    type:this.condition.type
                    },userId:userid})
                    .then((result) => {
                        if(result.status === 200){
                            if(result.data){
                                tempData = result.data.list;
                                for(let i=0; i<tempData.length; i++) {
                                    tempData[i].typename = _.filter(_this.someData,{itemkey:tempData[i].type})[0].itemname
                                    // for(let j=0; j<_this.someData.length; j++){
                                    //     if (tempData[i].type === _this.someData[j].itemkey) {
                                    //         tempData[i].type = _this.someData[j].itemname
                                    //         console.log(11111111)
                                    //     }
                                    // };
                                }
                                for(let index=0; index<tempData.length; index++) {
                                    if (tempData[index].level === 1) {
                                        tempData[index].level = '提醒'
                                    }else if(tempData[index].level === 2){
                                        tempData[index].level = '警告'
                                    }
                                    //console.log(111,tempData[index].remindermode)
                                    tempData[index].checkList = tempData[index].remindermode.split(",")
                                    tempData[index].choose = true
                                }
                               
                                    this.cTotal = result.data.total;
                                    _this.tableData = tempData;
                              
                               
                            }
                        }else {
                            this.$message({
                                message:'系统正在升级中，请稍后再试',
                                type: 'error'
                            });
                        }
                    })
            },

             //获取数据字典
            getSomeData() {
                this.postDicData([{'nodekey':'messageType'}]).then( (result)=>{
                    if (result.status === 200) {
                        this.someData = result.data['messageType'];
                    }
                })
            },
            
            //树
            getModuleList() {
                const _this = this;
                this.fetch('/message/infotemplate/orgUser',{})
                    .then(result => {
                        if(result.status === 200){
                            _this.moduleList = result.data;
                            _this.moduleListName = result.data[0].treeObject.orgname;
                        }else {
                            // this.$message({
                            //     message:'系统正在升级中，请稍后再试',
                            //     type:'error'
                            // });
                        }
                    })
            },

            //树的节点点击事件
            getlistuserid(data){
               // this.tableData = [];
                this.getlist(data.treeObject.orgid);
            },
        }
    }
</script>

<style lang="less" scoped type="text/less">

</style>