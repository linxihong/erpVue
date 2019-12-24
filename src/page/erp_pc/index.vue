<template>
  <div class="home">

    <h1>{{ msg }}</h1>

  </div>
</template>
<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js erp_pc index',
      visible: false
    }
  },
  mounted () {
    this.$router.push("login");

  }
}
</script>
