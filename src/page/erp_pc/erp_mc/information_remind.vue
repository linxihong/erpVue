<template>
    <div class="page-secondnav page-commonnav" ref="pageHeight">
        <div class="f-content">
            <div class="console-pt4 console-pb4" ref="btnHeight">
                <el-button class="ui-color3" @click="markread">标为已读</el-button>
                <el-button class="ui-color2" @click="deletes">删除</el-button>
                <i class="margin-ll">
                    <!-- <el-input style="width:200px;" placeholder="请输入关键字查询"></el-input>
                    <el-button icon="search">查找</el-button> -->
                </i>
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

        <!--<ZLCommonTable-->
            <!--:tableData="tableData"-->
            <!--:itemValues="itemValues"-->
            <!--:tabHeight="tabHeight"-->
            <!--@show="show_dialog"-->
            <!--@getcheckbox="getcheckbox"-->
            <!--@editRoute="editRoute">-->
        <!--</ZLCommonTable>-->

        <ZLMessageTable
                :tableData="tableData"
                :pageState="pageState"
                :tabHeight="tabHeight"
                @editRoute="editRoute"
                @getcheckbox="getcheckbox">
        </ZLMessageTable>

        <!--查看消息详细-->
        <!-- <el-dialog
            title="信息提醒"
            :visible.sync="remindVisible"
            @close="close">
            <span slot="footer" class="dialog-footer">
                <el-form label-width="100px" :inline="true" :model="announcementform" ref="typeForm" class="itemContent inputColor">
                    <el-card class="del-shadow itembottom">
                        <el-form-item label="标题">
                            <el-input v-model="announcementform.title"></el-input>
                        </el-form-item>

                        <el-form-item label="消息类型">
                            <el-input v-model="announcementform.type" ></el-input>
                        </el-form-item>

                        <el-form-item label="发布人">
                            <el-input  v-model="announcementform.publisher"></el-input>
                        </el-form-item>

                        <el-form-item label="内容">
                            <el-input type="textarea" v-model="announcementform.content" :rows="2"></el-input>
                        </el-form-item>
                    </el-card>
            </el-form>
            </span>
        </el-dialog> -->

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
    data() {
        const _this = this;
        return {
            pageState: 'remind',
            apiUrl:'/message/inbox/allByPage',
            remindVisible: false,
            tabHeight: 522,
            typename:'xx',
            condition:{},
            announcementform:{
                title:null,
                content:null,
                type:null,
                publisher:null
            },
            tableData:[],
            ischeckboxData:[],
            someData:[],
            searchFields:[
                {
                    name: '消息类型',
                    type: 'select',
                    fieldName: 'type',
                    label: _this.getSubordinate('xx')
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
            itemValues:[
                    {
                        type:'select'
                    }, {
                        name:'status',
                        label:'状态',
                        width:'',
                        type:'normal'
                    }, {
                        name:'type',
                        label:'消息类型',
                        width:'',
                        type:'normal',
                        formatter:true
                    }, {
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
                        name:'level',
                        label:'消息级别',
                        width:'',
                        type:'normal'
                    },{
                        name:'publisher',
                        label:'发送人',
                        width:'',
                        type:'normal'
                    },{
                        name:'receivetime',
                        label:'接收时间',
                        width:'',
                        type: 'normal',
                        formatter:true
                    },{
                        type:'button',
                        width: 120,
                        buttons: [
                            {name: 'editRoute',label:'查看'},
                        ]
                    }
                ],
            arrowBot: true,
            arrowTop: false,
            searchVisible: true,
            formHeight: null,
            height: null,
        }
    },
    mounted() {
        // this.cpageSizes = [100,200,500,1000];
        // this.cSize = 200;
        // this.cPage=1;
        this.init();
        setTimeout(()=>{
            this.getDivHeight();
        },20)
    },
    methods: {
        init() {
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
                },20)
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
                this.typename = 'xx'
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

                    for(let index in tempData) {
                        if (tempData[index].level === 1) {
                            tempData[index].level = '提醒'
                        }else if(tempData[index].level === 2){
                            tempData[index].level = '警告'
                        }
                    }

                    for(let index=0; index<tempData.length; index++){
                        tempData[index].content = this.removeHTMLTag(tempData[index].content);
                    };
                    this.cTotal = result.data.total;
                    _this.tableData = tempData;
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
            if(this.ischeckboxData.length){
                this.fetch('/message/inbox/read',this.ischeckboxData)
                .then(result => {
                    if(result.status === 200){
                        if(this.ischeckboxData.length === 1){

                        }else{
                            this.$message({
                                message: result.message,
                                type: 'success'
                            });
                        }
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

        //查看
        show_dialog(type,index,rows) {
            this.remindVisible = true;
            const _this = this;
            if (type === "edit"){
                this.ischeckboxData = [];
                this.dialogType = 'edit';
                this.announcementform = rows[index]
                this.ischeckboxData.push(rows[index].inboxcd);
            }
        },

        //路由跳转
        editRoute(index,rows) {
            this.$routeTo('mc_announcement_view',{id:rows[index].inboxcd,typeid:'3',inboxcdData:rows,index:index})
        }
    }
}
</script>
<style lang="less" scoped type="text/less">
    .margin-ll {
        margin-left: 75%;
        @media screen and (max-width: 1500px) {
            margin-left: 65%;
        }
    }
</style>

