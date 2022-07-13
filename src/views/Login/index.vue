<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar title="登录" @click-left="backPrePage" class="navbar">
      <template #left>
        <van-icon name="cross" />
      </template>
    </van-nav-bar>
    <!-- 表单模块 -->
    <van-form @submit="onSubmit" class="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="[{ required: true, message: '请输入手机号' }]"
      >
        <template #label>
          <span class="toutiao toutiao-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="[{ required: true, message: '请输入验证码' }]"
      >
        <!-- 左侧字体图标 -->
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        <!-- 右侧验证码图标 -->
        <template #right-icon>
          <van-button round class="code-btn" size="mini">发送验证码</van-button>
        </template>
      </van-field>
      <div style="margin: 16px" @submit="onSubmit">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  data() {
    return {
      mobile: '',
      code: ''
    }
  },
  methods: {
    // 返回先前页面
    backPrePage() {
      this.$router.back()
    },
    async onSubmit() {
      const res = await login(this.mobile, this.code)
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
// 头部导航样式
.navbar {
  background-color: #5090e5;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  .van-icon {
    color: #fff;
  }
}
// 表单域样式
.form {
  :deep(.van-field__label) {
    flex: 1;
  }
  :deep(.van-cell__value) {
    flex: 20;
  }
  .toutiao {
    font-size: 0.49333rem;
  }
  .code-btn {
    background-color: #eee;
    padding: 0 10px;
    color: #666;
  }
}
</style>
