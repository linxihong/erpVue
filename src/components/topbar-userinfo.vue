/**
* @date 2017/11/22
* @desc 可删除
**/
<template>
  <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link topbar-btn">
              110120119@qq.com
            </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="a">基本资料</el-dropdown-item>
      <el-dropdown-item command="b">安全设置</el-dropdown-item>
      <el-dropdown-item command="c">访问控制</el-dropdown-item>
      <el-dropdown-item command="d">会员权益</el-dropdown-item>
      <el-dropdown-item command="e">会员积分</el-dropdown-item>
      <el-dropdown-item command="quit" divided>退出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
    name: 'topbar',
    data () {
      return {
        msg: 'Welcome to Your Vue.js erp_pc admin',
        visible: false,
        activeroute:"1"
      }
    },
    watch:{
      "$route":"handleRoute"
    },
    mounted(){
      this.handleRoute()
    },
    methods: {
      handleRoute(){
        this.activeroute=this.$route.name;
        //console.log('handleRoute',this.$route.name,this.activeroute)
      },
      handleCommand (command) {
        this.$message('click on item ' + command)
        command=="quit"?this.$router.push({name:"login"}):""
      },
      handleOpen (key, keyPath) {
        //console.log('handleOpen',key, keyPath)
      },
      handleClose (key, keyPath) {
        //console.log('handleClose',key, keyPath)
      }
    }
  }
</script>
