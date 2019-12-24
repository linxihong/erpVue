<template>
    <div class="page-secondnav page-commonnav" ref="pageHeight">
        <div class="f-content">
            <div class="console-pt4 console-pb4" ref="btnHeight">
                <!-- <el-button @click="init">刷新</el-button> -->
                <el-button class="ui-color3" @click="$routeTo('mc_announcement_edit',{type:'task'})">新增</el-button>
                <!-- <el-button>处理</el-button> -->
                <!-- <el-button>转发</el-button> -->
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

        <!-- 处理弹框 -->
        <el-dialog
            class="dialogDiv dialogDivII"
            :show-close="false"
            :visible.sync="typeVisible"
            :top = "dialog_top"
            size="tiny"
            @close="close">
            <div class="slideContent">
                <div class="leftDiv">
                    <el-button class="icon-setting-2 icon-close" @click="typeVisible = false"></el-button>
                    <el-button class="icon-setting-1 icon-confirm" @click="dealwith"></el-button>
                </div>
                <div class="slideTop" v-drag1>处理消息</div>

                <div class="slideMid">
                    <el-form label-width="80px" :model="typeForm" ref="typeForm">
                        <!--<el-card class="del-shadow">-->
                            <el-form-item label="标题" >
                                <el-input v-model="typeForm.title" :readonly="true"></el-input>
                            </el-form-item>

                            <el-form-item label="处理项">
                                <el-input  v-model="typeForm.processeditem"></el-input>
                            </el-form-item>

                             <el-form-item label="消息内容" class="item-bottomI">
                                <el-input type="textarea" v-model="typeForm.content" resize="none" :rows="4" :readonly="true"></el-input>
                            </el-form-item>

                            <el-form-item label="处理意见" class="item-bottomI">
                                <el-input type="textarea" v-model="typeForm.handlingsuggestion" resize="none" :rows="3"></el-input>
                            </el-form-item>
                        <!--</el-card>-->
                    </el-form>
                </div>
            </div>
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button @click="typeVisible = false">取 消</el-button>-->
                <!--<el-button @click="dealwith">确 定</el-button>-->
            <!--</span>-->
        </el-dialog>
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
                    @editRoute="editRoute"
                    @show="show_dialog"
                    @getcheckbox="getcheckbox">
            </ZLMessageTable>

        <!-- 分页 -->
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
           // ZLCommonTable,
            ZLMessageTable,
            ZLCommonSearch,
        },
        data(){
            const _this = this;
            return{
                pageState: 'task',
                dialog_top: '100px',
                tabHeight: 522,
                createtime:null,
                typename:'rw',
                apiUrl:'/message/inbox/allByPage',
                typeVisible:false,
                condition:{},
                receiveData:[],
                ischeckboxData:[],
                someData:[],
                typeForm:{
                    status:null,
                    inboxcd:null,
                    inboxid:null,
                    handlingsuggestion:null,
                    processeditem:null,
                    processor:this.$store.getters.getUserinfo.fullname,
                    processorid:this.$store.getters.getUserinfo.userid,
                    receiverid:0,
                    parentid:null,
                },
                searchFields:[
                    {
                        name: '消息类型',
                        type: 'select',
                        fieldName: 'type',
                        label: _this.getSubordinate('rw')
                    },{
                        name: '状态',
                        type: 'select',
                        fieldName: 'status',
                        label: [{label:'已处理',value:'1'},{label:'未处理',value:'0'}],
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
                    name:'receiver',
                    label:'发送人',
                    width:'',
                    type:'normal'
                },{
                    name:'receivetime',
                    label:'接受时间',
                    width:'',
                    type:'normal'
                },{
                    // name:'handlingsuggestion',
                    // label:'已处理意见',
                    // width:'',
                    // type:'normal'
                },{
                    // name:'adjustcode',
                    // label:'完成时间',
                    // width:'',
                    // type:'normal'
                },{
                    type:'button',
                    width: 150,
                    buttons: [
                        {name: 'editRoute',label:'查看'},
                        {name: 'edit',label:'处理'},
                    ]
                }],
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
                    this.typename = 'rw'
                }
                this.fetch(this.apiUrl,{inbox:{
                    type:this.typename,
                    title:this.condition.title,
                    status:this.condition.status,
                    pageNo:this.cPage,
                    pageSize:this.cSize}})
                    .then(result => {
                        if(result.status === 200){
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
                                    tempData[index].status = '未处理';
                                }else if(tempData[index].status === 1){
                                    tempData[index].status = '已处理';
                                }
                            }

                            for(let index=0; index<tempData.length; index++){
                                tempData[index].content = this.removeHTMLTag(tempData[index].content);
                            };
                            _this.cTotal = result.data.total;
                            _this.receiveData = tempData;
                        }else{

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

            //处理
            dealwith(){
                const _this = this;
                this.typeForm.status = 1;
                this.fetch('/message/taskhandle/add',{taskhandle:this.typeForm})
                    .then(result => {
                        if(result.status === 200){
                            this.$message({
                                message: result.message,
                                type: 'success'
                            });
                            _this.$store.state.noticnum = 1;
                            this.typeVisible = false;
                            this.getlist();
                            console.log(90)
                        }else if(result.status === 500){
                            this.$message({
                                message: result.message,
                                type: 'error'
                            });
                            this.typeVisible = false;
                            this.getlist();
                        }
                    })
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

            //添加编辑
            show_dialog(index,rows){
                this.typeVisible = true;
//                if(type === "add"){
//
//                }else if (type === "edit"){
//                    this.dialogType = 'edit';
//                    this.typeForm = rows[index]
//                }
                this.typeForm = rows[index];
            },

            //关闭弹框
            close() {
                this.typeVisible = false;
            },

            delrow(){

            },
            editRoute(index,rows) {
                this.$routeTo('mc_announcement_view',{id:rows[index].inboxcd,typeid:'2',inboxcdData:rows,index:index})
            }
        }
    }
</script>
<style lang="less" scoped type="text/less">

</style>
