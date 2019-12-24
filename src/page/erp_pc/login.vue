<template>
    <div class="page-login">
        <div class="login-inputPannel">
            <div class="wrapper">
                <div class="formItem formItem__logo ">
                    <img src="../../assets/ico/logo-1.png" alt="" class="">
                    <div class="font-label">广 亚 集 团</div>
                </div>
                <div class="form-content">
                    <div class="font-labelI">智铝数字企业平台</div>
                    <el-form :model="detail" :rules="ruleValidate" ref="detail" class="fix-login">
                        <el-form-item label="1" prop="username" :show-message="false" class="formItem__iconUser icon_user">
                            <el-input v-model="detail.username" placeholder="用户名" @keyup.enter.native="onSubmit" autofocus="autofocus"></el-input>
                        </el-form-item>
                        <el-form-item label="1" prop="password" :show-message="false" class="formItem__iconUser icon_psd">
                            <el-input v-model="detail.password" type="password" placeholder="密码" @keyup.enter.native="onSubmit"></el-input>
                        </el-form-item>
                        <div class="formItem cf">
                            <el-checkbox v-model="ifRemember" class="formItem__ifRemember">记住用户名</el-checkbox>
                            <router-link :to="psdForgetUrl" class="formItem__psdForgetUrl">忘记密码？</router-link>
                        </div>
                    </el-form>
                    <div class="formItem formItem__btn">
                        <el-button class="btn-login" type="primary" @click="onSubmit" :class="{'login-btn-loading':loadingStatus==true}">
                            <div v-if="loadingStatus==true"><span>登录中</span><img src="../../assets/ico/loading_01.gif" class="loading-img"></div>
                            <span v-if="loadingStatus==false">登录</span>
                        </el-button>
                    </div>
                </div>
                <div class="connect-div">
                    <a target="_blank"  href="http://wpa.qq.com/msgrd?v=3&uin=2477493125&site=qq&menu=yes">客服QQ：2477493125</a>
                </div>
            </div>
        </div>
        <div class="login-footPannel">
            <img src="../../assets/ico/footer-ico.png" alt="" class="footer-icon">
            @ 2018    广东正来科技    粤ICP备11108168号
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                ifRemember: sessionStorage.getItem("ifRemember")!=undefined?sessionStorage.getItem("ifRemember"):true,
                psdForgetUrl: {name:'login'},
                loadingStatus: false,
                detail: {
                    username: sessionStorage.getItem("uname")!=undefined?sessionStorage.getItem("uname"):'',
                    password: '',
                },
                ruleValidate:{
                    username: [
                        { required: true, message: 'Please input the User Name!', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Please input the Password!', trigger: 'blur' }
                    ],
                },
            }
        },
        mounted () {
            this.cleandata();
            this.init();
        },
        methods: {
            init() {
                if(this.$route.query.username && this.$route.query.password) {
                    this.detail.username = this.$route.query.username;
                    this.detail.password = this.$route.query.password;
                    this.onSubmit()
                }
            },
            onSubmit () {
                //this.$router.push({name:'msm_operationallimits_list'})
                //this.handlegetnav();
                sessionStorage.setItem('sideValue','0');
                this.$refs['detail'].validate((valid) => {
                    if (valid) {
                        this.loadingStatus = true;
                        this.login(this.detail.username, this.detail.password).then((result)=> {
                            this.loadingStatus = false;
                            if (result.status == '500') {
                                this.$message({
                                    message:this.returnIntercept(result),
                                    type:'error'
                                });
                            } else if (result&&result.token_type && result.access_token) {
                                this.handlegetnav();
                            } else {
                                this.$message({
                                    message:result.msg.error_description === 'Bad credentials' ? '密码错误' : result.msg.error_description,
                                    type:'error'
                                });
                            }
                        })
                    }
                });
            },
            handleifRemember () {
                sessionStorage.setItem("ifRemember",JSON.stringify(this.ifRemember))
                if(this.ifRemember==true){
                    sessionStorage.setItem("uname",this.detail.username)
                }else{
                    sessionStorage.removeItem("uname")
                }
            },
            handlegetnav () {
                this.navs = [];
                this.getsidebar().then((result)=> {
                    if (result.status == '200' && _.isEmpty(result.data) == false) {
                        sessionStorage.setItem('sidenavlist', JSON.stringify(result.data));
                        this.$store.commit('setSidenavlist',result.data);
                        if (this.$store.getters.getSideNavlist) {
                            var _sideIndex = 0;
                            var _firstPage = '';
                            var _each = (list)=>{
                                var _result = false;
                                _.map(list, (num, key)=>{
                                    if(_firstPage==''&&num.children.length==0){
                                        _firstPage = num;
                                        _result = true;
                                        return true;
                                    }else if(_firstPage==''){
                                        _each(num.children);
                                    }
                                });
                            };

                            _each(this.$store.getters.getSideNavlist[_sideIndex].children);
                            sessionStorage.setItem('activenavItem', JSON.stringify(_firstPage));
                            sessionStorage.setItem('systemid',_firstPage.systemid)
                            this.$store.state.systemid = _firstPage.systemid;
                            this.$store.state.activenavItem = _firstPage;
                            this.loadingStatus = false;
                            this.handlesetSystemid();
                            this.getUser();
                            if(_firstPage.defaulturl==''){
                                this.$message({
                                    message:'该账号没分配可操作菜单，请联系管理员！',
                                    type:'error'
                                })
                            }
                            this.$router.push(_firstPage.route);
                            if(this.detail.password == '123456') {
                                this.$message({type:'warning',message: '系统检测到该账号目前的密码是初始密码，为了您的账号安全，请尽快修改密码！'});
                            }
                        }
                    }else if (_.isEmpty(result.data) == true) {
                        this.$message.warning('该账号没有分配权限')
                    }

                })
            },
        }
    }


</script>

<style lang="less" rel="stylesheet/less" type="text/less">

    .page-login{
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        //background-image: url("../../assets/icon_login1.jpg");
        background-image: url("../../../static/login.jpg");
        background-color: #8ff1ff;
        background-position: center;
        background-size: cover;

        .el-button.btn-login {
            &:active, &:hover, &:focus, &:visited {
                color: #fff;
                outline: 0;
            }
            &:hover {
                background-color: lighten(#00C26F, 4%);
                border-color: lighten(#00C26F, 4%);
            }
            &:active {
                background-color: darken(#00C26F, 4%);
                border-color: darken(#00C26F, 4%);
            }
        }
    }
    .login-titlePannel {
        position: absolute;
        left: 100px;
        top:50%;
        margin-top: -280px;
        transform: translateY(-50%);

        text-align: left;
    }
    .login-inputPannel{
        padding-top: 3%;
        .left{
            width: 50%;
            float: left;
            margin-top: 130px;
            text-align: center;
            img{
                width: 450px;
            }
        }
        /*.right{*/

            .wrapper{
                width: 50%;
                max-width: 350px;
                margin-left: 41%;
                text-align: center;
            }
            .form-content {
                background: #ffffff;
                padding: 0 30px 30px 30px;
                border: 1px solid transparent;
                border-radius: 10px;
                box-shadow:0 2px 12px 0 rgba(0,0,0,.2);
                .font-labelI {
                    font-size: 18px;
                    color: #9e9e9e;
                    line-height: 60px;
                    font-weight: 600;
                }
            }

        /*}*/

        .icon_user label{
            width: 30px;
            height: 30px;
            float: left;
            padding: 8px 0;
            background-position: right;
            background-repeat: no-repeat;
            background-image: url("../../assets/ico/icon_user.png");
            background-size:  auto 18px;
            font-size: 0;
        }
        .icon_psd label{
            width: 30px;
            height: 30px;
            float: left;
            padding: 8px 0;
            background-position: right;
            background-repeat: no-repeat;
            background-image: url("../../assets/ico/icon_password.png");
            background-size:  auto 18px;
            font-size: 0;
        }
        .el-form-item{
            border-radius: 5px;
            background-color: #fff;
            border: 1px solid #9e9e9e;

            .el-input__inner{
                border-width: 0;
            }
            &.is-error{
                border-color: #ff4949;
            }
        }
        .formItem__ifRemember{
            .el-checkbox__label{
                font-size: 12px;
            }
            float: left;
            color: #9e9e9e;
        }
        .formItem__psdForgetUrl{
            float: right;
            font-size: 12px;
            color: #9e9e9e;
        }
        .formItem__iconUser .el-form-item__content{
            width: auto;
            margin-left: 44px;
        }
        .formItem{
            display: block;
            margin-bottom: 15px;
            line-height: 30px;
            text-align: center;
            .font-label {
                font-size: 24px;
                @media screen and (max-width: 1500px) {
                    font-size: 20px!important;
                }
                font-weight: bold;
            }
        }
        .formItem__logo{
            line-height: 40px;

            img{
                height: 80px;
                vertical-align: middle;
            }
        }
        .formItem__input{
            .el-input__inner{
                border-radius: 0;
            }
        }
        .formItem__btn{

            .el-button--primary{
                width: 100%;
                padding: 13px 15px;
                font-size: 14px;
                border-radius: 6px;

                background-color: #00C26F;
                border-color: #00C26F;
            }
        }
    }
    .login-footPannel{
        width: 100%;
        height: 35px;
        line-height: 35px;
        position: absolute;
        left:0;
        bottom:20px;
        text-align: center;
        color: #fff;
        .footer-icon{
            width: 25px;
            margin: 0 5px;
            vertical-align: middle;
        }
    }
    .login-btn-loading{
        background-color: #eef1f6;
        border-color: #eef1f6;
    }
    .loading-img {
        width: 10px;
        margin-left: 5px;
    }
    .connect-div {
        a {
            font-weight: bold;
            font-size: 14px;
            color: white;
        }
        margin-top: 10px;
    }
</style>
