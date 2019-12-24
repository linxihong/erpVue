/**
* @date 2017/11/22
* @desc 顶部导航
**/
<template>
    <div class="topbar-wrapper">
        <div class="el-sidebar-fold" @click="handleFold"><i class="fa icon-setting-4" :class="foldstatus?'icon-menu-1-r':'icon-menu-1'"></i></div>
        <div class='topbar-mid'>
            <routerTags ref="routertag"></routerTags>
        </div>
        <div class="topbar-right">
            <div class="right-note">
                <div class="note" v-popover:popover>
                    <el-badge :value="inboxnum" class="item">
                        <i class="icon-bells icon-note"></i>
                    </el-badge>
                    <el-popover
                        popper-class="popper-class"
                        ref="popover"
                        placement="left"
                        width="235"
                        v-model="ispopover"
                        trigger="click">
                        <div class="nottion-line-hight" v-for="(item,index) in inboxData" :key="index" @click="getSuperior(index)">
                            <p class="main-nottion">{{item.title}}</p>
                            <p class="secondary-text">{{item.receivetime}}</p>
                        </div>
                        <div class="nottion-hight"  @click="getNews">
                            <p class="main-nottion">查看更多</p>
                        </div>
                    </el-popover>
                </div>
            </div>
            <div class="topbar-left topbar-user">
                <div class="topbar-info-dropdown">
                    <div class="topbar-btn">
                        <div class="user-name f-vams">
                            <img src="../assets/ico/icon_persona.png" alt="" style="width: 25px;">
                            <span style="display: inline-block;width: 70%;overflow: hidden;textOverflow: ellipsis;whiteSpace: nowrap" :title=$store.getters.getUserinfo.fullname>{{$store.getters.getUserinfo.fullname}}</span>
                        </div>
                    </div>

                    <div class="topbar-info-dropdown-memu topbar-align-right">
                        <div class="topbar-user-entrance-list cf">
                            <template v-for="data in user_links">
                                <!-- key="data"-->
                                <router-link  :to="data.href" class="topbar-user-entrance" v-if="data.type==undefined">
                                    <span class="logo"><i :class="data.icon"></i></span><span >{{data.type}}{{data.name}}</span>
                                </router-link>
                                <div class="topbar-user-entrance router-link-active" @click="handleResetpsdDialog()" v-if="data.type=='resetpsd'">
                                    <span class="logo"><i class="el-icon-edit"></i></span><span>{{data.resetpsd}}修改密码</span>
                                </div>
                            </template>

                        </div>
                        <div class="user-btn-list">
                            <router-link :to="data.href" class="topbar-user-btn" v-for="data in user_btns" key="data">
                                <span>{{data.name}}</span>
                            </router-link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <el-dialog
                class="dialogDiv dialogDivII"
                :visible.sync="dialogFormVisible"
                :append-to-body="true"
                :show-close="false"
                :top="dialog_top"
                size="tiny"
                :modal-append-to-body="false">
            <div class="slideContent">
                <div class="leftDiv">
                    <span class="icon-setting-2 icon-close" @click="dialogFormVisible = false"></span>
                    <span class="icon-setting-1 icon-confirm" @click="onSubmitResetpsdform('resetpsd')"></span>
                </div>
                <div class="slideTop" v-drag1>重置密码</div>

                <div class="slideMid">
                    <el-form ref="resetpsd" :model="resetpsd" :rules="resetpsdrules" class="normal">
                        <el-form-item prop="password" label="旧密码" label-width="100">
                            <el-input v-model="resetpsd.password" type="password" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item prop="newPassword" label="新密码" label-width="100">
                            <el-input v-model="resetpsd.newPassword" type="password" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item prop="confirmPassword" label="确认新密码" label-width="100">
                            <el-input v-model="resetpsd.confirmPassword" type="password" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="onSubmitResetpsdform('resetpsd')">确 定</el-button>-->
            <!--</div>-->
        </el-dialog>
    </div>
</template>

<script type="es6">
    export default {
        name: 'topbar',
        data () {
            return {
                dialog_top: "100px",
                username: '管理员',
                user_links: [
                    {href: "{ name: 'user', params: { userId: 123 }}", type: "resetpsd", name: "修改密码", icon: "el-icon-edit"},
                    {href: { name: 'login'}, name: "退出", icon: "el-icon-circle-close"},
                ],
                user_btns: [
//                    {href: {name: 'login'}, name: "退出", icon: "el-icon-edit"},
                ],
                dialogFormVisible: false,
                resetpsd: {
                    password: '',
                    newPassword: '',
                    userId: this.$store.getters.getUserinfo.userid,
                },
                foldstatus: this.foldable,
                resetpsdrules: {
                    password: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'},
                    ],
                    newPassword: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                    ],
                    confirmPassword: [
                        {required: true, message: '请确认新密码', trigger: 'blur'},
                        {validator: this._validateCheckPsd, check: ['resetpsd'], trigger: 'blur'},
                    ],
                },
                //数据字典
                someData:[],
                ispopover:false,
                navs:this.$store.getters.getSideNavlist||[],
                sideValue: sessionStorage.getItem('sideValue')!==undefined?parseInt(sessionStorage.getItem('sideValue')):0,
                sysNav: []
            }
        },
        props: ['foldable','inboxnum','inboxData'],
        watch: {
            //"$route":"handleRoute"
            foldstatus(val){
                this.$emit("on-foldable-change", val);
            },
        },
        created() {

        },
        mounted(){
            this.sysNav = this.navs[this.sideValue].children;
            this.getSomeData();
        },
        methods: {

            //点击查看更多
            getNews(){
                //this.$routeTo('mc_announcement')
                this.goTargetTag(this.filterArray(this.sysNav,'resname','系统公告'));
                this.ispopover =! this.ispopover
            },

            //获取数据字典
            getSomeData() {
                this.postDicData([{'nodekey':'messageType'}]).then( (result)=>{
                    if (result.status === 200) {
                       this.someData = result.data['messageType'];
                    }
                })
            },

            //点击消息判断上级类型跳转页面
            getSuperior(val){
                let superiorid,superiorkey;
                for(let i=0; i<this.someData.length; i++){
                    if(this.inboxData[val].type === this.someData[i].itemkey){
                        superiorid = this.someData[i].parentid;
                        if(superiorid === 0){
                            superiorkey = this.someData[i].itemkey
                        }
                    }
                }
                if(superiorkey === undefined){
                    for(let i=0; i<this.someData.length; i++){
                        if(superiorid === this.someData[i].dicid){
                            superiorkey = this.someData[i].itemkey
                        }
                    }
                }

                //路由跳转
                if(superiorkey === 'xt'){
                    this.goTargetTag(this.filterArray(this.sysNav,'resname','系统公告'));
                }else if(superiorkey === 'rw'){
                    this.goTargetTag(this.filterArray(this.sysNav,'resname','任务信息'));
                }else if(superiorkey === 'xx'){
                    this.goTargetTag(this.filterArray(this.sysNav,'resname','信息提醒'));
                }

                //关闭popover
                this.ispopover = !this.ispopover
            },
            _validateCheckPsd(rule, value, callback){
                this.validateCheckPsd(rule, value, callback, this.resetpsd.newPassword)
            },
            handleFold () {
                this.foldstatus = !this.foldstatus;
            },
            handleCommand (command) {
                this.$message('click on item ' + command);
                command == "quit" ? this.$router.push({name: "login"}) : ""
            },
            handleResetpsdDialog(obj){
                this.resetpsd.password = '';
                this.resetpsd.newPassword = '';
                this.dialogFormVisible = true;
            },
            onSubmitResetpsdform(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        delete this.resetpsd.confirmPassword;
                        this.fetch('/sys/user/updatePassword', this.objfilter(this.resetpsd),{
                            headers: {
                                systemid: this.$store.state.systemid
                            }
                        }).then((result) => {
                            this.$handleRes(result);
                            if(result.status == 200) {
                                this.logout();
                            }
                            this.dialogFormVisible = false;
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="less" type="text/less">
    @sidebarWidth: 180px;
    @topbarHeight: 64px;

    .master-topbar {
        position: relative;
        clear: both;
        height: @topbarHeight;
        background: #fafafa;
        font-size: 12px;
        border-bottom: 1px solid #e0e0e0;
    }

    .topbar-wrapper {
        /*width: 100%;*/
        /*align-items: center;*/
        /*.topbar-mid {*/
            /*display: inline-block;*/
            /*width: 75%;*/
            /*overflow: hidden;*/
        /*}*/
        /*.topbar-right {*/
            /*float: right;*/
            /*margin-right: 10px;*/
        /*}*/
        display: flex;
        width: 100%;
        .topbar-mid {
            flex: 8;
            overflow: hidden;
        }
        .topbar-right {
            display: flex;
            width: 280px;
            padding-right: 10px;
            //z-index: 1;
            .right-note {
                flex:1;
            }
            .topbar-left {
                flex:2;
            }
        }
        .topbar-btn,
        .topbar-logo {
            padding: 0 18px;
            height: @topbarHeight;
            line-height: @topbarHeight;
            display: block;
            z-index: 2;
            font-size: 14px;
            color: #788d9b;
        }

        .topbar-logo {
            width: @sidebarWidth;
            text-align: center;
            float: left;
            background: #fff;
            img {
                height: @topbarHeight - 20;
                margin-top: 8px;
            }
        }
        .topbar-item {
            line-height: @topbarHeight;
            float: left;
            color: #788d9b;
        }
        .topbar-item__title {
            padding: 0 15px;
            font-size: 20px;
            font-weight: bold;
        }
        .topbar-btn:hover {
            background-color: #dde0e6;
        }

    }

    .topbar-info-dropdown {
        position: relative;
    }

    .topbar-info-dropdown:hover .topbar-info-dropdown-memu,
    .active .topbar-info-dropdown-memu,
    .active.topbar-info-dropdown-memu {
        visibility: visible;
        opacity: 1;
    }

    .topbar-user {
        position: relative;
        color:#c1c3c4;
        .user-avatar {
            width: @topbarHeight - 30;
            height: @topbarHeight - 30;
            margin: -(@topbarHeight - 30)/2 0 0 0;
            position: absolute;
            top: 50%;
        }
        .user-name {
            padding-left: 10px;
            text-align: center;
        }
    }

    .topbar-info-dropdown-memu {
        padding: 0;
        position: absolute;
        top: 100%;
        right: 0;
        visibility: hidden;
        float: left;
        list-style: none;
        background-color: #ffffff;
        background-clip: padding-box;
        z-index: 10001!important;
        font-size: 12px;
        min-width: 100%;
        margin: 0;
        border: none;
        -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        -webkit-transition: opacity 0.15s, visibility 0s 0.15s;
        transition: opacity 0.15s, visibility 0s 0.15s;
        opacity: 0;

        .topbar-user-btn {
            height: 50px;
            line-height: 50px;
            display: block;
            -webkit-transition: all 0.15s;
            transition: all 0.15s;
            text-align: center;
            color: #333;
            border-top: 1px solid #f5f5f5;
        }
    }

    .topbar-user {
        width: 200px;
    }

    .topbar-user-entrance-list {
        overflow: hidden;
        width: 180px;
        margin: 8px 0;
        padding: 8px 10px;

        .topbar-user-entrance {
            width: 80px;
            height: 80px;
            float: left;
            text-align: center;
            color: #333;
            -webkit-transition: background 0.15s;
            transition: background 0.15s;
            border-radius: 2px;

            &:hover {
                background-color: #f5f5f5;
            }

            .logo {
                font-size: 20px;
                margin: 8px auto;
                margin-bottom: 4px;
                width: 40px;
                height: 40px;
                display: block;
                vertical-align: middle;
                line-height: 40px;
                color: #788D9B;
            }
        }
    }

    .el-menu-item {
        a {
            color: #fff;
            display: block;
        }
    }
    .note {
        position: absolute;
        top: 28px;
        right: 240px;
        .el-badge__content{
            background-color: #00C26F;
            border-radius: 50%;
            color: #fff;
            display: inline-block;
            font-size: 12px;
            // height: 18px;
            // width: 18px;
            line-height: 16px;
            padding: 0 4px;
            text-align: center;
            border: 1px solid #fff;
        }
        .el-badge__content.is-fixed{
            top: 0;
            right: 12px;
            position: absolute;
            -ms-transform: translateY(-50%) translateX(100%);
            transform: translateY(-50%) translateX(100%);
        }
    }

</style>
