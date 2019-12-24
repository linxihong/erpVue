/**
* @date 2017/11/22
* @desc 可删除
**/
<template>
    <div class="topbar-wrapper">
        <div class="topbar-left cf"><!-- target="_blank"-->
            <router-link :to="{ name: 'dashboard'}" class="topbar-logo">
                <!--logo-->
                <img src="../assets/logo.png" alt="" class="">
            </router-link>
            <div class="topbar-item topbar-item__title">
                <span class="topbar_title">混凝土行业云数字制造系统</span>
            </div>
        </div>
        <div class="topbar-right">
            <!--<div class="topbar-left topbar-btn">-->
            <!--<span>-->
            <!--1101201191@qq.com-->
            <!--</span>-->
            <!--</div>-->
            <div class="topbar-left topbar-user">
                <div class="topbar-info-dropdown">
                    <div class="topbar-btn">
                        <img src="../assets/user-avatar02.png" alt="" class="user-avatar">
                        <div class="user-name">
                            <span v-if="$store.state.username">{{$store.state.username}}，</span>欢迎您!
                        </div>
                    </div>
                    <div class="topbar-info-dropdown-memu topbar-align-right">
                        <div class="topbar-user-entrance-list cf">

                            <router-link :to="{ name: 'detail'}" class="topbar-user-entrance" v-for="data in user_links"
                                         key="data">
                                <span class="logo"><i :class="data.icon"></i></span>
                                <span>{{data.name}}</span>
                            </router-link>

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
    </div>
</template>

<script type="es6">
export default {
    name: 'topbar',
    data () {
      return {
        username:'管理员',
        user_links:[
          {href:"{ name: 'user', params: { userId: 123 }}",name:"基本资料",icon:"el-icon-edit"},
          {href:"{ name: 'user', params: { userId: 123 }}",name:"基本资料",icon:"el-icon-edit"},
          {href:"{ name: 'user', params: { userId: 123 }}",name:"基本资料",icon:"el-icon-edit"},
          {href:"{ name: 'user', params: { userId: 123 }}",name:"基本资料",icon:"el-icon-edit"},
          {href:"{ name: 'user', params: { userId: 123 }}",name:"基本资料",icon:"el-icon-edit"},
          {href:"{ name: 'user', params: { userId: 123 }}",name:"基本资料",icon:"el-icon-edit"},
          {href:"{ name: 'user', params: { userId: 123 }}",name:"基本资料",icon:"el-icon-edit"},
          {href:"{ name: 'user', params: { userId: 123 }}",name:"基本资料",icon:"el-icon-edit"},
          {href:"{ name: 'user', params: { userId: 123 }}",name:"基本资料",icon:"el-icon-edit"},
        ],
        user_btns:[
          {href:{name: 'login'},name:"退出",icon:"el-icon-edit"},
        ]
      }
    },
    watch:{
      //"$route":"handleRoute"
    },
    mounted(){

    },
    methods: {
      handleCommand (command) {
        this.$message('click on item ' + command)
        command=="quit"?this.$router.push({name:"login"}):""
      }
    }
  }



</script>
<style lang="less" scoped type="text/less">
    @sidebarWidth: 180px;
    @topbarHeight: 60px;

    .master-topbar {
        position: relative;
        z-index: 100;
        clear: both;
        height: @topbarHeight;
        background: #324158;
        font-size: 12px;
        //min-width: 990px;
    }

    .topbar-wrapper {

        .topbar-left {
            float: left;
        }

        .topbar-right {
            float: right;
        }
        .topbar-btn,
        .topbar-logo {
            padding: 0 18px;
            height: @topbarHeight;
            line-height: @topbarHeight;
            display: block;
            z-index: 2;
            font-size: 14px;
            color: #fff;
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
            color: #fff;
        }
        .topbar-item__title {
            padding: 0 15px;
            font-size: 20px;
            font-weight: bold;
        }
        .topbar-btn:hover {
            background-color: #223045;
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
        .user-avatar {
            width: @topbarHeight - 30;
            height: @topbarHeight - 30;
            margin: -(@topbarHeight - 30)/2 0 0 0;
            position: absolute;
            top: 50%;
        }
        .user-name {
            padding-left: 40px;
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
        z-index: 1;
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

    .topbar-user-entrance-list {
        overflow: hidden;
        width: 270px;
        margin: 8px 0;
        padding: 8px 15px;

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

</style>
