<template>
  <div>
    <!-- 一级路由路径出口 -->
    <router-view></router-view>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  created() {
    console.dir(request)
  }
}
</script>

<style scoped>
.login {
  width: 700px;
  height: 30px;
  background-color: pink;
}
</style>
