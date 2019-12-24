<template>
    <div class="page-secondnav page-commonnav" ref="pageHeight">
        <div class="f-content">
            <div class="console-pt4 console-pb4" ref="btnHeight">
                <!-- <el-button @click="init">刷新</el-button> -->
                <el-button class="ui-color3" @click="$routeTo('mc_announcement_edit',{type:'annou'})">新建公告</el-button>
                <el-button class="ui-color2" @click="markread">标为已读</el-button>
                <el-button class="ui-color2" @click="deletes">删除</el-button>
                <div class="pull-right">
                    <el-button class="ui-color2 console-mr2" @click="initial" title="刷新"><i class="fa fa-refresh"></i></el-button>
                    <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowBot">更多查询<i class="el-icon-arrow-down margin-2"/></span>
                    <span class="color-1 margin-2 fm-query" @click="toggleSearch" v-if="arrowTop">更多查询<i class="el-icon-arrow-up margin-2"/></span>
                </div>
            </div>

         <!-- 查询 -->
            <div v-show="searchVisible" class="console-pb4" ref="formHeight">
                <ZLCommonSearch :fields="searchFields" @search="search" @reset="reset" ref="ZLCommonSearch"></ZLCommonSearch>
            </div>

        <!-- 列表 -->
        <!--<ZLCommonTable-->
            <!--:tableData="receiveData"-->
            <!--:itemValues="itemValues"-->
            <!--:tabHeight="tabHeight"-->
            <!--@show="show_dialog"-->
            <!--@delete="delrow"-->
            <!--@editRoute="editRoute"-->
            <!--@getcheckbox="getcheckbox">-->
        <!--</ZLCommonTable>-->
            <ZLMessageTable
                    :tableData="receiveData"
                    :pageState="pageState"
                    :tabHeight="tabHeight"
                    @show="show_dialog"
                    @editRoute="editRoute"
                    @getcheckbox="getcheckbox">
            </ZLMessageTable>

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
</template>
<script>
    //import ZLCommonTable from '../../../components/ZLCommonTable'
    import ZLMessageTable from '../../../components/ZLMessageTable'
    import ZLCommonSearch from '../../../components/ZLCommonSearch'
    export default {
        components:{
            //ZLCommonTable,
            ZLMessageTable,
            ZLCommonSearch,
        },
        data(){
            const _this = this;
            return{
                pageState: 'announce',
                tabHeight: 522,
                apiUrl:'/message/inbox/allByPage',
                receiveData:[],
                searchFields:[
                    {
                        name: '消息类型',
                        type: 'select',
                        fieldName: 'type',
                        label: _this.getSubordinate('xt')
                    },{
                        name: '状态',
                        type: 'select',
                        fieldName: 'status',
                        label: [{label:'已读',value:'1'},{label:'未读',value:'0'}],
                    },{
                        name: '标题',
                        type: 'string',
                        fieldName: 'title'
                    }],         
                itemValues:[{
                    type:'select'
                },{
                    name:'status',
                    label:'状态',
                    width:'',
                    type:'normal'
                },{
                    name:'type',
                    label:'消息类型',
                    width:'',
                    type:'normal'
                },{
                    name:'title',
                    label:'标题',
                    width:'',
                    type:'normal'
                },{
                    name:'content',
                    label:'消息内容',
                    width:'',
                    type:'normal'
                },{
                    name:'publisher',
                    label:'发布人',
                    width:'',
                    type:'normal'
                },{
                    name:'publishtime',
                    label:'发布时间',
                    width:'',
                    type:'normal'
                },{
                    type:'button',
                    width: 150,
                    buttons: [
                        {name: 'editRoute',label:'查看'},
                    ]
                }],
                condition:{},
                ischeckboxData:[],
                someData:[],
                typename:'xt',
                arrowBot: true,
                arrowTop: false,
                searchVisible: true,
                formHeight: null,
                height: null,
            }
        },
        mounted() {
            this.init();
            setTimeout(()=>{
                this.getDivHeight();
            },20)
            // this.cpageSizes = [100,200,500,10000];
            // this.cSize = 200;
        },
        methods:{
            //刷新
            init(){
                setTimeout(()=>{
                    this.getlist();
                },20)
                this.getSomeData();
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
                    },10)
                } else {
                    this.tabHeight = this.height;
                }
            },

            //刷新
            initial(){
                this.$refs.ZLCommonSearch.init();
            },

            //查询
            search(params){
                this.condition = params.exts
                this.getlist();
            },

            //重置
            reset() {
                this.condition = {
                    title:null,
                    status:null,
                };
                this.getlist();
            },

            //获取列表
            getlist(){
                const _this = this;
                let tempData = [];
                if(this.condition.type){
                    this.typename = this.condition.type
                }else{
                    this.typename = 'xt'
                }
                this.fetch(this.apiUrl,{inbox:{
                    type:this.typename,
                    title:this.condition.title,
                    status:this.condition.status,
                    pageNo:this.cPage,
                    pageSize:this.cSize}})
                    .then(result => {
                        tempData = result.data.list;
                        for(let i=0; i<tempData.length; i++) {
                            tempData[i].type = _.filter(_this.someData,{itemkey:tempData[i].type})[0].itemname
                            // for(let j in this.someData){
                            //     if (tempData[i].type === this.someData[j].itemkey) {
                            //         tempData[i].type = this.someData[j].itemname
                            //     }
                            // };
                        }

                        for(let index in tempData) {
                            if (tempData[index].status === 0) {
                                tempData[index].status = '未读'
                            }else if(tempData[index].status === 1){
                                tempData[index].status = '已读'
                            }
                          
                        }

                        for(let index=0; index<tempData.length; index++){
                            tempData[index].content = this.removeHTMLTag(tempData[index].content);
                        };
                        this.cTotal = result.data.total;
                        _this.receiveData = tempData;
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

            //标为已读
            markread(){
                const _this = this;
                if(this.ischeckboxData.length){
                    this.fetch('/message/inbox/read',this.ischeckboxData)
                    .then(result => {
                        if(result.status === 200){
                            this.$message({
                                message: result.message,
                                type: 'success'
                            });
                            _this.$store.state.noticnum = 1;
                            this.getlist();
                        }else if(result.status === 500){
                            this.$message({
                                message: result.message,
                                type: 'error'
                            });
                            this.getlist();
                        }
                    })
                    // let i = 1;
                }else{
                    this.$message({
                        message: '请选择要标为已读的数据',
                        type: 'warning'
                    });
                }
            },

            //删除
            deletes(){
                if(this.ischeckboxData.length){
                    this.fetch('/message/inbox/del',this.ischeckboxData)
                    .then(result => {
                        if(result.status === 200){
                            this.$message({
                                message: result.message,
                                type: 'success'
                            });
                            this.$store.state.noticnum = 1;
                            this.getlist();
                        }else if(result.status === 500){
                            this.$message({
                                message: result.message,
                                type: 'error'
                            });
                            this.getlist();
                        }
                    })
                }else{
                    this.$message({
                        message: '请选择删除的数据',
                        type: 'warning'
                    });
                }
            },
            //勾选的数据
            getcheckbox(data){
                this.ischeckboxData = data;
            },
            
            show_dialog(){

            },
            delrow(){

            },
            
            //路由跳转
            editRoute(index,rows) {
                this.$routeTo('mc_announcement_view',{id:rows[index].inboxcd,typeid:'1',inboxcdData:rows,index:index}) 
            }
        }
    }
</script>
<style lang="less" scoped type="text/less">

</style>
