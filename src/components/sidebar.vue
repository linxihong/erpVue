/**
* @date 2017/11/22
* @desc 导航
**/
<template>
    <div class="m-sidebar" ref="sidebar">
        <div class="sidebar-logo">
            <img src="../assets/ico/logo-1.png" class='img-logo'/>
            <div class="logo-txt">
                <span>智能数字企业平台</span>
                <el-select v-model="sideValue" placeholder="请选择" class="sideSelect" @change="handlesideValueChange">
                    <el-option v-for="(item,index) in navs" :key="index" :label="item.name" :value="index"></el-option>
                </el-select>
            </div>
        </div>
        <div class="sidebar-line"></div>
        <el-col :span="24" v-if="isShowMenu">
            <el-menu
                :default-active="activeroute" :unique-opened="true" class="el-menu-leftside"
                mode="horizontal"
                router
                :collapse="foldable">
                <template v-for="(db,indexb) in navs[sideValue].children">
                    <el-menu-item :index="db.rindex" @click="handleSelect(db)" :route="db.route" v-if="!db.children.length&&db.isdisplayinmenu!=0">
                        <template  slot="title" class="nav-icon" >
                            <i class="menu-ico-setting menu-ico-1"></i>
                            <span slot="title" class="nav-title">{{db.name}}</span>
                        </template>
                    </el-menu-item>
                    <!--一级有子菜单  menu-trigger='click'-->
                    <el-submenu :index="db.rindex" @click="handleSelect(db)" class="secondMenu" v-if="db.children.length&&db.isdisplayinmenu!=0" :data-rindex="db.rindex">
                        <template  slot="title" class="nav-icon " >
                            <i class="menu-ico-setting menu-ico-1"></i>
                                <span slot="title" class="nav-title">{{db.name}}</span>
                            <i class="custom-ico"></i>
                        </template >
                        <template v-for="(dc,indexc) in db.children">
                            <!--二级菜单-->
                            <el-menu-item v-if="dc.children.length==0&&dc.isdisplayinmenu!=0" :index="dc.rindex" :route="dc.route" @click="handleSelectChildren(dc)" :data-rindex="dc.rindex">
                                <div class="nav-icon thirdNavItem">
                                    <i class="menu-ico-setting menu-ico-15"></i>
                                </div>
                                <span class="nav-title" slot="title">{{dc.name}}</span>
                            </el-menu-item>
                            <!--三级菜单-->
                            <el-menu-item-group :title="dc.name" v-if="dc.children.length>0&&dc.isdisplayinmenu!=0" :index="dc.rindex" @click="handleSelect(dc)"  :data-rindex="dc.rindex">
                                <template v-for="(dd,indexc) in dc.children">
                                    <el-menu-item v-if="dd.isdisplayinmenu!=0" :index="dd.rindex" :route="dd.route" @click="handleSelectChildren(dd)" :data-rindex="dd.rindex">
                                        <div class="nav-icon fourthNavItem">
                                            <i v-if="dd.children.length==0" class="fa fa-file "></i>
                                            <i v-if="dd.children.length>0" class="fa fa-folder"></i>
                                        </div>
                                        <span class="nav-title" slot="title">{{dd.name}}</span>
                                    </el-menu-item>
                                </template>
                            </el-menu-item-group>
                        </template>
                    </el-submenu>
                </template>
            </el-menu>
            <footer class="sidebar-footer"><img src="../assets/ico/footer-ico.png" class="footer-ico"/><span v-show="!foldable">@2017广东正来科技</span></footer>
        </el-col>
    </div>
</template>

<script>
    export default {
        name: 'sidebar',
        data () {
            return {
                isShowMenu:true,
                navs:this.$store.getters.getSideNavlist||[],
                activeroute: '',//this.$route.meta.firstnavstatus,
                sideValue: sessionStorage.getItem('sideValue')!=undefined?parseInt(sessionStorage.getItem('sideValue')):0
            }
        },
        props: ['foldable'],
        watch: {
            'sideValue'() {
                if (this.loginStatus()){
                    this.handlenavactive();
                }
            },
        },
        mounted () {
            //导航菜单
            if (this.loginStatus()){
                this.handlegetnav();
            }
        },
        methods: {
            handlesideValueChange(){
                //缓存子系统索引
                sessionStorage.setItem('sideValue',this.sideValue);
                //切换systemid
                this.handlesetSystemid();
                //初始化路由
                this.initRoutePage();
                //初始化页面
                this.initPage();
                //window.location.reload();
            },
            handlenavactive(){
                this.isShowMenu = false;
                //预选择页面
                if(this.$store.state.activenavItem){
                    setTimeout(()=> {
                        if(this.$store.state.activenavItem.resid) {
                            this.activeroute = 'resid_'+this.$store.state.activenavItem.resid.toString();
                        }
                        this.isShowMenu = true;
                    },100)
                }
            },
            handlegetnav() {
                if(this.$store.getters.getSideNavlist){
                    this.navs = this.$store.getters.getSideNavlist;
                    //选中导航菜单
                    this.handlenavactive();
                }else{
                    this.$message({
                        message: '该账号没有分配权限',
                        type: 'warning'
                    });
                }
            },
            handleSelectChildren (item) {
                let _result = {name:item.name,list:item.children};
                this.$store.state.navSecondChildren = _result;
                sessionStorage.setItem('_sn',encodeURIComponent(JSON.stringify(_result)));
                this.handleSelect(item)
            },
            handleSelect (item) {
                sessionStorage.setItem('activenavItem', JSON.stringify(item));
                this.$store.state.activenavItem = item;

                //匹配页签
                let _status = false;
                this.$store.state.navtaglist.forEach(tag =>{
                    if (tag.route.path==item.route.path){
                        _status = true;
                    }
                });
                _status == true?'':this.$store.state.navtaglist.push(item);
            }
        }
    }
</script>

<style lang="less" scope type="text/less">
    .sidebar-footer{
    	position: absolute;
    	left: 10px;
    	bottom:20px ;
    	color: #929292;
    	font-size: 12px;
    }
    .sidebar-logo{
        height: 63px;
    }
    .footer-ico{
    	width: 25px;
    	margin: 0 5px;
    	vertical-align: middle;
    }
    .logo-txt{
        display: inline-block;
        vertical-align: top;
        color: #888;
        width: 65%;
        margin-top:15px;
        font-size: 12px;
        /*.sideSelect .el-input{
            font-size: 12px;
        }*/
    }
    .custom-ico{
    	width: 12px;
    	height: 12px;
    	background: url(../assets/ico/right-arrow.png) no-repeat;
    	background-size: 100%;
    	display: inline-block;
    	position: absolute;
    	right: 10px;
    	top:15px;
    }
    .img-logo{
        width: 25px;
        background-size: 100% 100%;
        display: inline-block;
        margin:15px 8px 10px ;
    }
    .sidebar-line{
        background: url("../assets/ico/sidebar-line.png") repeat-x ;
        height: 4px;
        width: 100%;
    }
    .el-menu{
        .nav-icon + .nav-title{
            padding-left: 10px;
        }
        .el-icon-caret-bottom:before{
	   		content:''
        }
    }
    .sideSelect{
        padding-right: 5px;
        input{
            border: 0;
            color: #fff;
            background-color: transparent;
        }
    }
    .nav-title{
        margin-left:8px;
    }
    /*新增*/
    .el-menu--horizontal>.el-menu-item:hover, .el-menu--horizontal>.el-submenu.is-active .el-submenu__title,
    .el-menu--horizontal>.el-submenu:hover .el-submenu__title{
   		border-bottom:none;
    }
	.el-menu--horizontal .el-menu-item:hover, .el-menu--horizontal .el-submenu__title:hover{
		color: #fff;
	    background-color: #46987c;
	}

    .el-menu--horizontal .el-submenu .el-menu-item,.el-menu--horizontal .el-menu-item{
   	    height: 40px;
   	    line-height: 40px;
    }
    .el-menu--horizontal .el-submenu>.el-menu{
    	position: fixed;
        left:180px;
        width: 180px;
        min-width: 0;
        overflow-x: hidden;
        border-radius:0;
        max-height: 500px;
        top: inherit;
        margin-top: -40px;
        background: #fff;
        box-shadow: none;
        border:1px solid #ccc;
        padding: 0;
        z-index: 9999;
    }
    .el-menu--horizontal .el-submenu .el-submenu__title,.el-menu--horizontal .el-menu-item{
		height: 40px;
		line-height: 40px;
		border-bottom: none;
		width: 180px;
	}
    .secondMenu .el-menu{
        &::-webkit-scrollbar-track-piece {
            background: #e8e8e8;
        }
        &::-webkit-scrollbar {
            width: 6px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background-color: #afafaf;
        }
    }
    .el-menu-item-group__title{
        padding: 10px 0 0 10px;
        box-sizing: border-box;
        color: #a9c4bc;
        margin:3px 0;
    }
    .el-menu-item.is-active {
        color: #fff;
        background-color: #00C26F;
    }

</style>
