<template>
    <div class="expand-menu-wrap">
        <div class="first-menu-wrap">
            <div v-for="(item,index) in firstMenu">
                <div class="first-menu-item" :index="index" v-if="item.children==0&&item.isdisplayinmenu!=0" v-show="false">
                    <i class="el-icon-menu"></i>
                    <span>{{item.name}}</span>
                </div>
                <div class="first-menu-item" @mouseover="showSecondMenu(item,item.resid)" @mouseout="clearDelay" :index="index" :class="{activeClass:activeIndex===item.resid}" v-if="item.children.length>0&&item.isdisplayinmenu!=0">
                    <i v-if="item.titleicon!==''" :class="[item.titleicon,{hoverClass:activeIndex===item.resid}]"></i>
                    <i v-if="item.titleicon==''" class="el-icon-menu"></i>
                    <span>{{item.name}}</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
        </div>
        <div class="second-menu-wrap scrollBar">
            <div v-for="(item,index) in secondMenu" class="second-menu-content">
                <div v-if="item.children.length==0&&item.isdisplayinmenu!=0" class="second-menu-item" @click.stop="toTargetPage(item,item.resid,item.defaulturl)" :class='[activeIndexII===item.resid?"activeClass":"",!item.defaulturl?"forbidClass":""]'>
                    <span :class="[item.isCollect?'icon_favorite_focus_class':'icon_favorite_class',!item.defaulturl?'forbidClass':'']" @click.stop="isCollectMenu(item.resid,item.defaulturl)" v-if="isShowIcon"></span>
                    <i v-if="item.titleicon!==''" :class="[item.titleicon,item.defaulturl?'hoverClass':'disabledClass']" ></i>
                    <i v-if="item.titleicon==''" :class="['menu-icons-setting menu-icons-50',item.defaulturl?'hoverClass':'disabledClass']"></i>
                    <span>{{item.name}}</span>
                </div>
                <div v-if="item.children.length>0&&item.isdisplayinmenu!=0" class="has-title">
                    <div class="second-menu-title">{{item.name}}</div>
                    <div class="second-menu-list">
                        <div v-for="(third,index) in item.children" class="second-menu-item" @click.stop="toTargetPage(third,third.resid,third.defaulturl)" :class='[activeIndexII===third.resid?"activeClass":"",!third.defaulturl?"forbidClass":""]'>
                            <span :class="[third.isCollect?'icon_favorite_focus_class':'icon_favorite_class',!third.defaulturl?'forbidClass':'']" @click.stop="isCollectMenu(third.resid,third.defaulturl)" v-if="isShowIcon"></span>
                            <i v-if="third.titleicon!==''" :class="[third.titleicon,third.defaulturl?'hoverClass':'disabledClass']" ></i>
                            <i v-if="third.titleicon==''" :class="['menu-icons-setting menu-icons-50',third.defaulturl?'hoverClass':'disabledClass']"></i>
                            <span>{{third.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import icon_favorite from './../assets/ico/icon_favorite.png'
    import icon_favorite_focus from './../assets/ico/icon_favorite_focus.png'
    export default {
        data() {
            return {
                activeIndex:'',
                activeIndexII:'',
                navs: this.$store.getters.getSideNavlist||[],
                sideValue: sessionStorage.getItem('sideValue')!==undefined?parseInt(sessionStorage.getItem('sideValue')):0,
                activeroute: '',//this.$route.meta.firstnavstatus,
                firstMenu: [],
                secondMenu: [],
                collectMenu: [],
                isShowIcon: true,
                isHoverClass: true,
                tempTimer: null,
                timerList: []
            }
        },
        watch: {
            '$store.state.activenavItem':function(){
                this.$emit('jumpToCollectMenu');
                this.matchAllItemLight(this.$store.state.activenavItem,this.$store.state.activenavItem.resid,this.$store.state.activenavItem.defaulturl);
            }
        },
        created() {
            this.matchCollectMenu();
        },
        mounted() {
            this.firstMenu = this.navs[this.sideValue].children;
        },
        methods: {
            //高亮全部菜单列表对应的菜单项
            matchAllItemLight(tag,index,url) {
                if(JSON.stringify(this.filterArray(this.firstMenu,'alias',"grzy")) === '{}') {
                    this.toTargetPage(tag,index,url);
                    this.showSecondMenu(this.filterArray(this.firstMenu,'resid',tag.parentid),tag.parentid);
                }
                this.$emit('jumpToCollectMenu');
            },
            //匹配已收藏的菜单
            matchCollectMenu() {
                this.getAjax('/sys/res/all-collections')
                    .then(result => {
                        result.data.forEach((item,index,arr) => {
                            (this.filterArray(this.firstMenu,'resid',item.resid))['isCollect'] = true;
                        });
                    })
            },
            //显示最后一级的菜单
            showSecondMenu(item,index) {
                //增加hover延时
                this.tempTimer = setTimeout(() => {
                    this.secondMenu = item.children;
                    this.activeIndex = index;
                },50);
                this.timerList.push(this.tempTimer)
            },
            //清除hover延时
            clearDelay() {
                this.timerList.forEach(v => {
                    clearTimeout(v)
                })
            },
            //跳转到对应页面的路由
            toTargetPage(tag,index,url) {
                if(url) {
                    this.activeIndexII = index;
                    this.goTargetTag(tag);
                    this.$emit('jumpToCollectMenu');
                }
            },
            //收藏/取消收藏菜单项
            isCollectMenu(resid,url) {
                if(url) {
                    this.isShowIcon = false;
                    this.filterArray(this.secondMenu,'resid',resid)['isCollect'] = !this.filterArray(this.secondMenu,'resid',resid)['isCollect'];
                    setTimeout(() => {
                        this.isShowIcon = true;
                    });
                    this.filterArray(this.secondMenu,'resid',resid)['isCollect']?this.collectItem(resid):this.cancelCollectItem(resid);
                }
            },
            //收藏菜单项
            collectItem(resid) {
                this.fetch('/sys/res/update-collections',[{resid:resid}])
                    .then(result => {
                        if(result.status === 200) {
                            this.$emit('refreshCollectMenu');
                        }else {
                            this.$message({
                                type: 'warning',
                                message: result.message
                            })
                        }
                    })
            },
            //取消收藏菜单项
            cancelCollectItem(resid) {
                this.deleteAjax('/sys/res/del-collections/'+resid)
                    .then(result => {
                        if(result.status === 200) {
                            this.$emit('refreshCollectMenu');
                        }else {
                            this.$message({
                                type: 'warning',
                                message: result.message
                            })
                        }
                    })
            }
        }
    }
</script>

<style lang="less" scoped type="text/less">
    .show {
        display: block;
    }
    .hide {
        display: none;
    }
    .expand-menu-wrap {
        display: flex;
        height: 100%;
    }
    .first-menu-wrap {
        width: 200px;
        height: 100%;
        background: #46987c;
        .first-menu-item {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            position: relative;
            cursor: pointer;
            color: #fff;
            border-bottom: 1px solid #eee;
            transition:all .5s ease-in 0s;
            .common-menu-item;
            i {
                margin-left: 8px;
                margin-right: 15px;
            }
            &.activeClass {
                color: #000;
                background-color: #fff;
                transition:all .5s ease-in 0s;
                i {
                    color: #00c26f;
                }
            }
            &.forbidClass {
                cursor: not-allowed;
                background-color: #fff;
                &:hover {
                    background-color: #fff;
                }
            }
        }
    }
    .common-menu-item() {
        padding: 12px 0 12px 25px;
        i {
            /*margin-left: 8px;*/
            /*margin-right: 8px;*/
            &:last-child {
                font-size: 12px;
                position: absolute;
                right: 8px;
                line-height: 20px;
            }
        }
    }
    .second-menu-wrap {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        width: 800px;
        height: 100%;
        background: #fff;
        overflow-y: auto;
        .second-menu-content {
            margin-bottom: 20px;
        }
        .second-menu-title {
            color: #00c26f;
            padding: 8px 0 6px 25px;
        }
        .has-title {
            border-bottom: 2px solid #eee;
            border-top: 2px solid #eee;
            &:first-child {
                border-top: 0;
            }
            display: flex;
            flex-direction: column;
        }
        .second-menu-list {
            width: 800px;
            display: flex;
            flex-wrap: wrap;
        }
        .second-menu-item {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            min-width: 200px;
            position: relative;
            cursor: pointer;
            color: #000;
            .common-menu-item;
            i {
                margin-left: 8px;
                margin-right: 8px;
            }
            &.activeClass {
                background-color: #cfe8dc;
            }
            &.forbidClass {
                cursor: not-allowed;
                background-color: #fff;
                color: #ccc;
                &:hover {
                    background-color: #fff;
                }
            }
            &:hover {
                background-color: #cfe8dc;
            }
        }
    }
</style>
