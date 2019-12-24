<template>
    <div class="page-secondnav page-commonnav">
        <div class="f-content console-mt3">
        <div class="console-mt3">
            <el-button class="ui-color3" @click="previous">上一条</el-button>
            <el-button class="ui-color3" @click="next">下一条</el-button>
            <el-button class="ui-color2" @click="cancel">关闭</el-button>
        </div>

        <el-form ref="announcementform" :inline="true" :model="announcementform" label-width="80px" class="console-pt6 inputWidthI">
            <!-- <el-form-item label="消息类型">
                <el-input v-model="announcementform.type" :disabled="true"></el-input>
            </el-form-item> -->
            <el-form-item label="标题">
                <el-input v-model="announcementform.title" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="发布人">
                <el-input v-model="announcementform.publisher" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="发布时间">
                <el-date-picker
                :disabled="true"
                v-model="announcementform.publishtime"
                align="right"
                type="date"
                format="yyyy-MM-dd"
                placeholder="发布时间" class="conselect">
            </el-date-picker>
            </el-form-item>
        </el-form>
        <el-form ref="announcementform" :model="announcementform" label-width="80px" class="inputWidthIII">
            <el-form-item label="内容" class="margin-botI">
                <el-input v-model="announcementform.content"  placeholder="请输入内容" resize="none" :rows="18" type="textarea" :readonly="true"></el-input>
            </el-form-item>
            <!-- <el-form-item label="附件" class="margin-bot">
                <el-upload
                    class="upload-demo"
                    action="//message/file/upload?fileDir"
                    :before-upload="handleBeforeUpload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item> -->
        </el-form>
        <el-button class="ui-color2" @click="getDownload">下载附件：{{download}}</el-button>
        <!-- <el-collapse v-model="activeNames" v-for="(item,index) in items" :key="item.processor">
            <el-collapse-item :title="item.processor+':回复'" :name="index">
                <div>{{item.handlingsuggestion}}</div>
            </el-collapse-item>
        </el-collapse> -->
    </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                apiUrl:'/message/inbox/get/',
                activeNames:['1'],
                inboxData:[],
                items:[],
                ischeckboxData:[],
                announcementform:{
                    type:null,
                    title:null,
                    publisher:null,
                    publishtime:null,
                    content:null,
                    attachment:null
                },
                config: {
					//可以在此处定义工具栏的内容
					toolbars: [
					 ['fullscreen', 'undo', 'redo','|','bold', 'italic', 'underline',
					 '|','superscript','subscript','|', 'insertorderedlist', 'insertunorderedlist',
					 '|','fontfamily','fontsize','justifyleft','justifyright','justifycenter','justifyjustify']
					],
                	zIndex : 100,
					autoHeightEnabled: false,
					autoFloatEnabled: true,
					initialContent:'请输入内容',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
					autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
					initialFrameWidth: null,
					initialFrameHeight: 300,
					BaseUrl: '',
					UEDITOR_HOME_URL: "/static/UE/"
				},
                isbutton:true,
                download:null
            }
        },
        mounted() {
            this.init();
        },
        watch: {
            $route() {
                this.init();
            }
        },
        methods:{
            init() {
                this.getid();
                this.setStorage();
                this.getIsbutton();
            },


            //查看
            getid(val){
                const _this = this;
                let inboxcd
                if(val){
                    inboxcd = val
                }else {
                    inboxcd = this.$route.params.id
                }
                if(inboxcd){
                    this.getAjax(this.apiUrl+inboxcd)
                    .then(result => {
                        if(result.status === 200){
                            if(result.data !== null){
                                this.announcementform = result.data;
                                this.download = result.data.attachment;
                                this.announcementform.content = this.removeHTMLTag(result.data.content);
                                this.ischeckboxData.push(inboxcd);
                                this.markread();
                                // if(result.data.taskhandleList){
                                //     this.items = result.data.taskhandleList;
                                // }
                            }
                        }
                    })
                }
            },

            //下载附件
            getDownload(){
                if(this.download){
                    location.href = `http://${location.host}/message/file/download/?filename=${this.download}`
                    //location.href = `http://192.168.11.84:8480/message/file/download/?filename=${this.download}`
                    //this.getAjax('/message/file/download/?filename='+this.download)
                }
            },
            //上一条
            previous(){
                if(this.$route.params.index != 0){
                    let i = --this.$route.params.index;
                    let inboxcd;
                    let inboxcdData = this.$route.params.inboxcdData
                    if(inboxcdData){
                        for(i;i<inboxcdData.length; i--){
                            inboxcd = inboxcdData[i].inboxcd
                            break;
                        }
                        this.getid(inboxcd)
                    }
                }
            },

            //下一条
            next(){
                let i = ++this.$route.params.index;
                let inboxcd;
                let inboxcdData = this.$route.params.inboxcdData
                if(inboxcdData){
                    for(i;i<inboxcdData.length; i++){
                        inboxcd = inboxcdData[i].inboxcd
                        break;
                    }
                    this.getid(inboxcd)
                }
            },

            //按钮true/false
            getIsbutton(){
                if(this.$route.params.inboxcdData === undefined){
                    this.isbutton = false;
                }
            },
            //标为已读
            markread(){
                this.fetch('/message/inbox/read',this.ischeckboxData)
                .then(result => {
                    this.$store.state.noticnum = 1;
                })
            },

            //设置缓存
            setStorage() {
				let AnnounmMission = this.$route.params.typeid
				if(this.$route.params.typeid === undefined){
					AnnounmMission = sessionStorage.getItem('AnnounmMissionid')
				}
				setTimeout(()=>{
					sessionStorage.setItem('AnnounmMissionid',AnnounmMission);
				},200)
            },

            //路由跳转
            cancel(){
                if(sessionStorage.getItem('AnnounmMissionid') === '1'){
					this.$routeTo('mc_announcement')
				}else if(sessionStorage.getItem('AnnounmMissionid') === '2'){
					this.$routeTo('mc_task_message')
				}else if(sessionStorage.getItem('AnnounmMissionid') === '3'){
					this.$routeTo('mc_information_remind')
				}else {
					this.$routeTo('mc_announcement')
				}
            }
        }
    }
</script>
<style lang="less" scoped type="text/less">
    .line {
        .el-col-1 {
            width: 4.16667%;
            text-align: center;
        }
    }
    .margin-bot {
        margin-bottom: 86px;
        @media screen and (max-width: 1500px) {
            margin-bottom: 73px;
        }
    }
    .margin-botI{
		margin-bottom: 400px;
	}
</style>
