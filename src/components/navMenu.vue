<template>
    <div class="m-sidebar" ref="sidebar">
        <div class="nav-logo pt10" ref="logoHeight">
            <div class="logo-left console-ml1">
                <img src="../assets/ico/logo-1.png" class='icon-logo'/>
            </div>
            <div class="logo-right console-ml1" v-show="!foldable">
                <span class="console-text-size-14">智铝数字企业平台</span>
                <el-select v-if="navs.length>1" v-model="sideValue" placeholder="请选择" class="side-select" @change="handlesideValueChange">
                    <el-option v-for="(item,index) in navs" :key="index" :label="item.name" :value="index"></el-option>
                </el-select>
                <p v-else>{{navs[0].name}}</p>
            </div>
        </div>
        <div class="menu-wrap" :style="{height:menuHeight}">
            <div class="nav-line"></div>
            <ul class="main-menu" ref="mainHeight">
                <div class="menu-item" @click="showCenterPage" :class="{activeClass:isAcitveCenter}" v-show="isShowCenter">
                    <!--<i class="el-icon-menu"></i>-->
                    <i class="menu-icons-setting menu-icons-13"></i>
                    <span slot="title" v-show="!foldable">我的主页</span>
                </div>
                <div class="nav-line"></div>
                <div class="menu-item" @click="showRightMenu" :class="{activeClass:isShowAll}">
                    <!--<i class="el-icon-menu"></i>-->
                    <i class="menu-icons-setting menu-icons-14"></i>
                    <span slot="title" v-show="!foldable">全部功能</span>
                </div>
                <div class="nav-line"></div>
            </ul>
            <ul class="collect-menu" ref="collectHeight">
                <div class="menu-title" v-show="!foldable">常用菜单</div>
                <draggable v-model="collectMenu" @start="drag=true" @end="drag=false" @change="updateCollectMenu">
                    <li v-for="(item,index) in collectMenu" :key="index" @click="clickCollectItem(item,item.resid)" :class="{activeClass:activeIndex===item.resid}">
                        <div class="menu-item">
                            <i v-if="item.titleicon!==''" :class="item.titleicon"></i>
                            <i v-if="item.titleicon==''" class="menu-icons-setting menu-icons-50"></i>
                            <span slot="title" v-show="!foldable">{{item.name}}</span>
                        </div>
                    </li>
                </draggable>
            </ul>
        </div>

        <footer class="nav-footer">
            <div class="flow-icon" v-if="flowIcon">
                <span v-if="arrowBot"><i class="el-icon-arrow-down margin-2"></i></span>
                <span v-if="arrowTop"><i class="el-icon-arrow-up margin-2"></i></span>
            </div>
            <div style="height: 50px;">
                <div class="connect-wrap">
                    <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2477493125&site=qq&menu=yes">客服QQ：2477493125</a>
                </div>
                <div class="brand-icon">
                    <img src="../assets/ico/footer-ico.png" class="footer-icon" @click="toggleSth" />
                    <span v-show="!foldable">@2017广东正来科技<i class="el-icon-info version-icon" :title='version' @click="showHelp"></i></span>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    export default {
        data () {
            return {
                version: '版本号:n1.9.20',
                navs:this.$store.getters.getSideNavlist||[],
                activeroute: '',
                sideValue: sessionStorage.getItem('sideValue')!==undefined?parseInt(sessionStorage.getItem('sideValue')):0,
                collectMenu:[],
                returnResids: [],
                sysNav: [],
                //菜单高亮
                isShowAll: false,
                isAcitveCenter: false,
                isShowCenter: true,
                activeIndex: '',
                flowIcon: false,
                arrowBot: true,
                arrowTop: false,
                menuHeight: null,
                collectHeight: null,
                mainHeight: null,
                titleHeight: null,
            }
        },
        watch: {
            '$store.state.activenavItem':function(){
                setTimeout(() => {
                    this.matchCollectItemLight();
                })
            },
            'collectHeight':'flowVisible'
        },
        components: {
            draggable,
        },
        props: ['foldable'],
        mounted () {
            this.initCollectMenu();
            this.getDivHeight();
            this.getDivHeightI();
            this.goTargetTag(this.$store.state.activenavItem);
            sessionStorage.setItem('sideValue',this.sideValue);
            localStorage.getItem('isShowDetailBan') === 'false' ? this.$store.state.isShowDetailBan = false : this.$store.state.isShowDetailBan = true
        },
        methods: {
            //调整菜单高度
            getDivHeight() {
                const sidebar = this.$refs.sidebar.offsetHeight;
                const logoHeight = this.$refs.logoHeight.offsetHeight;
                this.menuHeight = sidebar - logoHeight - 52;
            },
            getDivHeightI() {
                setTimeout(()=>{
                    this.mainHeight = this.$refs.mainHeight.offsetHeight;
                    this.collectHeight = this.$refs.collectHeight.offsetHeight;
                    this.titleHeight = this.menuHeight - this.mainHeight;
                },100)
            },
            flowVisible(){
                this.collectHeight < this.titleHeight ? this.flowIcon = false:this.flowIcon = true;
            },
            //高亮收藏菜单列表对应菜单
            matchCollectItemLight() {
                let tag = this.$store.state.activenavItem;
                let homepage = this.filterArray(this.sysNav,'resname',"我的主页")||{};
                if(_.filter(this.collectMenu,{resid:tag.resid})[0]){
                    this.clickCollectItem(tag,tag.resid);
                    this.$emit('toLightItem',tag,tag.resid,tag.defaulturl);
                }else if(JSON.stringify(homepage) === '{}'){
                    this.activeIndex = -1;
                    this.isShowAll = true;
                    this.$emit('toLightItem',tag,tag.resid,tag.defaulturl);
                }else if( JSON.stringify(homepage) !== '{}'){
                    this.activeIndex = -1;
                    if(homepage.resid===tag.resid) {
                        this.isShowAll = false;
                        this.showCenterPage();
                    }else {
                        this.isAcitveCenter = false;
                        this.isShowAll = true;
                        this.$emit('toLightItem',tag,tag.resid,tag.defaulturl);
                    }
                }
            },
            //切换子系统
            handlesideValueChange() {
                //缓存子系统索引
                sessionStorage.setItem('sideValue',this.sideValue);
                //切换systemid
                this.handlesetSystemid();
                //初始化路由
                this.initRoutePage();
                //初始化页面
                this.initPage();
                this.initCollectMenu();
                //window.location.reload();
            },
            //点击已收藏的菜单项
            clickCollectItem(item,index) {
                this.activeIndex = index;
                this.isShowAll = false;
                this.isAcitveCenter = false;
                this.$emit('jumpToCollectMenu');
                this.$emit('toLightItem',this.$store.state.activenavItem,this.$store.state.activenavItem.resid,this.$store.state.activenavItem.defaulturl);
                this.goTargetTag(item);
            },
            //获取已收藏菜单列表
            getCollectMenu(boolean = true) {
                this.getAjax('/sys/res/all-collections')
                    .then(result => {
                        this.collectMenu = [];
                        this.getDivHeightI();
                        result.data.forEach((item,index,arr) => {
                            if(JSON.stringify(this.filterArray(this.sysNav,'resid',item.resid)) !== "{}") {
                                this.collectMenu.push(this.filterArray(this.sysNav, 'resid', item.resid));
                            }
                        })
                    })
                    .then(() => {
                        if(boolean) {
                            this.matchCollectItemLight();
                        }
                    })
            },
            //更新已收藏菜单列表
            updateCollectMenu() {
                this.returnResids = [];
                this.collectMenu.forEach((item,index) => {
                    this.returnResids.push({sort:index,resid:item.resid})
                });
                this.fetch('/sys/res/update-collections',this.returnResids)
                    .then(result => {
                        if(result.status === 200) {
                            this.getCollectMenu();
                        }else {
                            this.$message({
                                type: 'warning',
                                message: result.message
                            })
                        }
                    })
            },
            //初始化收藏菜单
            initCollectMenu() {
                this.sysNav = this.navs[this.sideValue].children;
                setTimeout(() => {
                    this.isExistHpmePage();
                    this.getCollectMenu();
                })
            },
            //判断是否存在个人主页
            isExistHpmePage() {
                if(JSON.stringify(this.filterArray(this.sysNav,'resname',"我的主页"))==='{}') {
                    this.isShowCenter = false
                }else {
                    this.isShowCenter = true;
                    if(this.$store.state.activenavItem.resname === "我的主页") {
                        this.showCenterPage();
                    }
                }
            },
            //显示个人主页
            showCenterPage() {
                this.goTargetTag(this.filterArray(this.sysNav,'resname',"我的主页"));
                this.isAcitveCenter = true;
                this.isShowAll = false;
                this.activeIndex = -1;
                this.$emit('jumpToCollectMenu');
            },
            //显示全部菜单
            showRightMenu() {
                this.activeIndex = -1;
                this.$emit('showToggleMenu');
                this.isShowAll = true;
                this.isAcitveCenter = false;
            },
            //切换
            toggleSth() {
                let isShowDetailBan = localStorage.getItem('isShowDetailBan') || 'false';
                if(isShowDetailBan === 'true') {
                    localStorage.setItem('isShowDetailBan', false);
                    this.$store.state.isShowDetailBan = false;
                }else {
                    localStorage.setItem('isShowDetailBan', true);
                    this.$store.state.isShowDetailBan = true;
                }
            },
            //显示帮助文档
            showHelp() {
                window.open('../../../static/readme.html')
            }
        }
    }
</script>

<style lang="less" type="text/less">
    .nav-logo{
        display: flex;
        color: white;
        .logo-left {
            .icon-logo{
                width: 40px;
                height: 40px;
                background-size: 100% 100%;
            }
        }
        .logo-right {
            .side-select {
                width: 80%;
                .el-input--suffix .el-input__inner {
                    color: #fff;
                    border: 0!important;
                    font-size: 12px;
                }
                .el-input--small .el-input__icon {
                    line-height: 22px;
                }
                .el-input__inner {
                    height: 22px;
                    line-height: 22px;
                }
            }
            p {
                text-align: center;
                margin: 0;
            }
        }
    }
    .nav-line{
        background: url("../assets/ico/sidebar-line.png") repeat-x;
        height: 4px;
        width: 100%;
    }
    .nav-footer{
        position: absolute;
        width: 100%;
        height: 80px;
        left: 0;
        bottom: 0;
        color: #929292;
        font-size: 12px;
        background: #4a4a4a;
        .flow-icon {
            width: 15px;
            margin: 5px auto;
        }
        .brand-icon {
            position: absolute;
            bottom: 5px;
        }
    }
    .footer-icon{
        width: 25px;
        margin: 5px 1px;
        vertical-align: middle;
    }
    .version-icon {
        margin-left: 5px;
        cursor: pointer;
    }

    .menu-wrap {
        position: absolute;
        top: 55px;
        bottom: 80px;
        width: 110% + 30px;
        overflow-y: auto;
        cursor: pointer;
        .menu-title {
            color: #7a7a7a;
            font-size: 12px;
            padding: 6px 0 6px 16px;
        }

        .main-menu,.collect-menu {
            color: white;
            .menu-item {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .common-item;
                &:hover {
                    background-color: #46987c;
                }
            }
            .activeClass {
                background-color: #00C26F;
            }
        }
    }

    .connect-wrap {
        position: absolute;
        bottom: 40px;
        left: 15%;
        a {
            color: #929292;
        }
    }

    .common-item() {
        padding: 12px 0 12px 11px;
        i {
            margin-right: 8px;
            &:last-child {
                font-size: 12px;
                position: absolute;
                right: 5px;
                line-height: 20px;
            }
        }
    }

</style>
