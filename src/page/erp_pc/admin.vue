<template>
    <div class="master" :class="{'master__sidebar-mini':foldable==true}">
        <div class="master-body">
            <div class="master-siderbar">
                <!--<sidebar :foldable="foldable"></sidebar>-->
                <!--新导航-->
                <navMenu ref="navmenu" :foldable="foldable" @showFullMenu="showFullMenu" @showToggleMenu="showToggleMenu" @jumpToCollectMenu="jumpToCollectMenu" @toLightItem="toLightItem"></navMenu>
            </div>
            <div class="master-content" v-if="$store.state.isShowPage" :class="{'isscroll':$store.state.isScroll}">
                <div>
                    <topbar :foldable="foldable" :inboxnum="inboxnum" :inboxData="inboxData" @on-foldable-change="onFoldableChange"></topbar>
                </div>
                <div class="master-content-wrapper full-menu-wrap" v-show="isShowRight">
                    <fullMenu ref="fullmenu" @showFullMenu="showFullMenu" @refreshCollectMenu="refreshCollectMenu" @jumpToCollectMenu="jumpToCollectMenu"></fullMenu>
                </div>
                <div class="master-content-wrapper scrollBar" ref="masterHeight">
                    <transition name="fade" mode="out-in">
                        <keep-alive>
                            <router-view></router-view>
                        </keep-alive>
                    </transition>
                    <div class="mcnottion" v-if="isnotton">
                        <div class="mcnottion_divI">
                            <span class="mcnottion_spanI">{{title}}</span>
                            <el-button type="text" @click="canlce">
                                <span class="mcnottion_spanII">X</span>
                            </el-button>
                        </div>
                        <div class="mcnottion_divII console-pt3" @click="getSuperior">
                            <p>{{content}}</p>
                        </div>
                        <div class="mcnottion_divIII">
                            <el-checkbox v-model="isprompt" label="不再提示" @change="getPrompt(isprompt)"></el-checkbox>
                            <span class="mcnottion_divIII_span" @click="getSuperior">查看详情</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //var websocket = null;
    //判断当前浏览器是否支持WebSocket
    //   if('WebSocket' in window){
    //        websocket = new WebSocket("ws://192.168.11.84:8486/websocket?userid=10000000100103");
    //   }
    //   else{
    //       alert('您的浏览器不支持 websocket！')
    //   }

    //连接发生错误的回调方法
    //   websocket.onerror = function(){
    // setMessageInnerHTML("error");
    //   };

    //连接成功建立的回调方法
    //   websocket.onopen = function(event){
    //       alert("链接成功,欢迎加入聊天室！");
    //   }

    //接收到消息的回调方法
    //   websocket.onmessage = function(event){
    //       if(event){
    //         //setMessageInnerHTML(event.data);
    //         aa =
    //         console.log(event.data);
    //       }

    //   }

    //连接关闭的回调方法
    // websocket.onclose = function(){
    //    alert(4564654)
    // }

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    // window.onbeforeunload = function(){
    //     websocket.close();
    // }

    //关闭连接
    // function closeWebSocket(){
    //     websocket.close();
    // }
    export default {
        name: 'admin-indexPage',
        data () {
            const _this = this;
            return {
                isnotton:false,
                websocket:null,
                visible: false,
                activeroute: "1",
                foldable: false,
                isCollapse:false,
                inboxnum:null,
                title:null,
                content:null,
                isprompt:false,
                iphost:_this.returnAnumData(),
                obj:{},
                inboxData:[],
                //新导航
                isShowRight: false,
                navs:this.$store.getters.getSideNavlist||[],
                sideValue: sessionStorage.getItem('sideValue')!==undefined?parseInt(sessionStorage.getItem('sideValue')):0,
                sysNav: [],
                anumData:[]
            }
        },
        watch: {
            "$route": "handleRoute",
            "$store.state.noticnum":"getNum",
            "iphost":'getWebSocket'
        },

        //components: ['sidebar'],
        // updated () {
        //     console.log('WebSocket',this.iphost)
        //     this.getWebSocket();
        // },
        mounted(){
            if (this.loginStatus()){
                this.handleRoute()
            }
            this.$store.state.masterHeight = this.$refs.masterHeight.offsetHeight;
            this.sysNav = this.navs[this.sideValue].children;
            // this.getNum();
            this.getSomeData();
            this.getStorage();
        },
        methods: {
            /*******************新导航***********************/
            //切换显示全部菜单
            showToggleMenu() {
                this.isShowRight = !this.isShowRight;
            },

            //切换显示全部菜单
            showFullMenu() {
                this.isShowRight = true;
            },

            //跳转至收藏菜单，隐藏全部菜单
            jumpToCollectMenu() {
                this.isShowRight = false;
            },

            //更新已收藏菜单列表
            refreshCollectMenu() {
                this.$refs.navmenu.getCollectMenu(false);
            },

            //高亮匹配全部菜单的菜单项
            toLightItem(tag,index,url) {
                this.$refs.fullmenu.matchAllItemLight(tag,index,url);
            },
            /*******************新导航***********************/

            handleRoute(){
                this.activeroute = this.$route.name;
            },
            onFoldableChange(val){
                this.foldable = val;
            },

            //判断当前浏览器是否支持WebSocket
            getWebSocket(){
                let host = this.iphost;
                if(!this.iphost){
                    host = location.host;
                }
                const hostname = location.hostname;
                //console.log('host',location.host);
                //console.log("userid",this.$store.getters.getUserinfo.userid);
                //console.log('websocket',`ws://${host}/websocket?userid=${this.$store.getters.getUserinfo.userid}`);
                const _this = this;
                let isonopen ='';
                // if(this.$store.getters.getUserinfo.userid){
                //         if('WebSocket' in window){
                //             //this.websocket = new WebSocket("ws://61.145.105.82:8786/websocket?userid="+this.$store.getters.getUserinfo.userid);
                //             //this.websocket = new WebSocket("ws://192.168.11.84:8486/websocket?userid="+this.$store.getters.getUserinfo.userid);
                //             //this.websocket = new WebSocket("ws://192.168.11.87:8486/websocket?userid="+this.$store.getters.getUserinfo.userid);
                //             //this.websocket = new WebSocket("ws://39.108.191.55:8486/websocket?userid="+this.$store.getters.getUserinfo.userid);
                //             //this.websocket = new WebSocket(`ws://${hostname}:8486/websocket?userid=${this.$store.getters.getUserinfo.userid}`);
                //             this.websocket = new WebSocket(`ws://${host}/websocket?userid=${this.$store.getters.getUserinfo.userid}`);
                //             this.websocket.onopen = () =>{
                //             isonopen = "true";
                //         };
                //         this.websocket.onclose = () =>{
                //             if(isonopen != "true"){
                //                 this.getOnclose();
                //             }
                //         };
                //         this.getOnclose();
                //         this.websocket.onmessage = event => {
                //             if(event){
                //                 _this.getNum();
                //                 this.obj = JSON.parse(event.data);
                //                 if(_this.isprompt === true){
                //                     _this.isnotton = false;
                //                 }else {
                //                     _this.title = this.obj.data.title;
                //                     _this.content = this.removeHTMLTag(this.obj.data.content);
                //                     _this.isnotton = true;
                //                     setTimeout(()=>{
                //                         _this.isnotton = false;
                //                     },30000);
                //                 }
                //             }
                //         }
                //     }
                //     else{
                //         alert('您的浏览器不支持 websocket！')
                //     }
                // }
                //
                // window.onbeforeunload = () =>{
                //     this.websocket.close();
                // };


            },

            //连接关闭的回调方法
            getOnclose(){
                let host = this.iphost;
                if(!this.iphost){
                    host = location.host;
                }
                const hostname = location.hostname;
                if(this.$store.getters.getUserinfo.userid){
                    if('WebSocket' in window){
                        this.websocket = new WebSocket(`ws://${host}/websocket?userid=${this.$store.getters.getUserinfo.userid}`);
                        //this.websocket = new WebSocket("ws://61.145.105.82:8786/websocket?userid="+this.$store.getters.getUserinfo.userid);
                        //this.websocket = new WebSocket("ws://192.168.11.84:8486/websocket?userid="+this.$store.getters.getUserinfo.userid);
                        //this.websocket = new WebSocket("ws://192.168.11.87:8486/websocket?userid="+this.$store.getters.getUserinfo.userid);
                        //this.websocket = new WebSocket(`ws://${hostname}:8486/websocket?userid=${this.$store.getters.getUserinfo.userid}`);
                    }
                    else{
                        alert('您的浏览器不支持 websocket！')
                    }
                }
            },
            // //获取消息数量
            // getInboxNum(){
            //     const _this = this;
            //     let obj = this.getNum()
            //     setTimeout(() => {
            //         this.inboxData = obj.data;
            //         this.inboxnum = obj.num;
            //     },200)
            // },

            //获取消息数量
            getNum(){
                const _this = this;
                this.fetch('/message/inbox/allByPage',{inbox:{status:0}})
                    .then(result => {
                        if(result.status === 200){
                            if(result.data.list.length >=4){
                                this.inboxData = result.data.list;
                                this.inboxData.length = 4;
                            }else{
                                this.inboxData = result.data.list;
                            }
                            this.inboxnum = result.data.total;
                            sessionStorage.setItem('newsnumber',result.data.total)
                            this.$store.state.noticnum = this.inboxnum;
                        }
                    })
            },

            //关闭弹框
            canlce(){
                this.isnotton = false;
                if(this.$store.state.systemid && this.isprompt === true){
                    this.isnotton = false;
                }
            },

            //不再提示
            getPrompt(val){
                sessionStorage.setItem('isprompt',val)
                this.isprompt = val
            },

            //获取缓存
            getStorage() {
                if(sessionStorage.getItem('isprompt') === 'true'){
                    this.isprompt = true;
                }else if(sessionStorage.getItem('isprompt') === 'false'){
                    this.isprompt = false;
                }

            },

            //获取数据字典
            getSomeData() {
                this.postDicData([{'nodekey':'messageType'}]).then( (result)=>{
                    if (result.status === 200) {
                       this.someData = result.data['messageType'];
                    }
                })
            },

            //获取数据字典websocket的IP和端口
            getanumData() {
                this.postDicData([{'nodekey':'xxzx'}]).then( (result)=>{
                    if (result.status === 200) {
                        this.anumData = result.data['xxzx'];
                        let ip = this.anumData[0].itemvalue;
                        let post = this.anumData[1].itemvalue
                        this.iphost = ip+':'+post
                    }
                })
            },

            //点击消息判断上级类型跳转页面
            getSuperior(){
                const _this = this;
                let superiorid,superiorkey;
                for(let i=0; i<_this.someData.length; i++){
                if(_this.obj.data.type === _this.someData[i].itemkey){
                        superiorid = _this.someData[i].parentid
                        if(superiorid === 0){
                            superiorkey = _this.someData[i].itemkey
                        }
                    }
                }

                if(superiorkey === undefined){
                    for(let i=0; i<_this.someData.length; i++){
                        if(superiorid === _this.someData[i].dicid){
                            superiorkey = _this.someData[i].itemkey
                        }
                    }
                }
                setTimeout(()=>{
                    if(superiorkey === 'xt'){
                        _this.goTargetTag(this.filterArray(this.sysNav,'resname','系统公告'));
                    }else if(superiorkey === 'rw'){
                        _this.goTargetTag(this.filterArray(this.sysNav,'resname','任务信息'));
                    }else if(superiorkey === 'xx'){
                        _this.goTargetTag(this.filterArray(this.sysNav,'resname','信息提醒'));
                    }
                },200);
                this.isnotton = false;
            },
        }
    }
</script>

<style lang="less" type="text/less">
    @sidebarWidth: 180px;
    @topbarHeight: 64px;

    .master-body {
        margin-left: @sidebarWidth;
        background-color: transparent;
    }

    .el-notification{
        width: 330px;
        height: 200px;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 2px;
        position: fixed;
        right: 16px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
        transition: opacity .3s,transform .3s,right .3s,top .4s;
        overflow: hidden;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;

    }

    .master-content-wrapper {
        position: absolute;
        width: auto;
        top:64px;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: hidden;
        overflow-y: auto;
        -webkit-transition: all 0.2s ease;
    }

    .master-siderbar {
        width: @sidebarWidth;
        height: 100%;
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #324158;
        z-index: 102;
        overflow-x: hidden;
        overflow-y: hidden;
    }

    .master-content {
        width: auto;
        position: absolute;
        top: 0;
        left: @sidebarWidth;
        bottom: 0;
        right: 0;
        overflow: hidden;
        background: #f5f5f5;
    }

    .mcnottion{
        position: fixed;
        bottom: 0;
        right: 0;
        width: 300px;
        height: 200px;
        background-color: antiquewhite;
        border: 1px solid #ccc;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        z-index: 9999;
        .mcnottion_divI{
            height: 15%;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            background-color: #46987C;
            border-top-right-radius: 10px;
            border-top-left-radius: 10px;
            .mcnottion_spanI{
                padding-left: 10px;
                font-weight: bold;
            }
            .mcnottion_spanII{
                font-size: 16px;
                font-weight: bold;
                color: floralwhite;
                cursor: pointer;
            }
        }
        .mcnottion_divII{
            height: 70%;
            padding-right: 10px;
            border-bottom: 1px solid #ccc;
            background-color:#fff;
            cursor: pointer;
            p{
                margin: 0;
                margin-left: 20px;
            }
        }
        .mcnottion_divIII{
            height: 15%;
            padding: 10px;
            background-color:#fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span{
                cursor: pointer;
            }
        }
    }

    .full-menu-wrap {
        z-index: 10000;
        background: #f5f5f5;
    }
</style>
