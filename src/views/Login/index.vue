<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar title="登录" @click-left="backPrePage" class="navbar">
      <template #left>
        <van-icon name="cross" />
      </template>
    </van-nav-bar>
    <!-- 表单模块 -->
    <van-form @submit="onSubmit" class="form" ref="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      >
        <template #label>
          <span class="toutiao toutiao-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <!-- 左侧字体图标 -->
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        <!-- 右侧验证码图标 -->
        <template #right-icon>
          <!-- 倒计时图标 -->
          <van-count-down
            :time="3 * 1000"
            v-if="isShowCountDown"
            @finish="isShowCountDown = false"
          />
          <!-- 发送验证码图标 -->
          <van-button
            round
            class="code-btn"
            size="mini"
            v-else
            @click.prevent="sendCode"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px" @submit="onSubmit">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendCode } from '@/api/user'
// 引入验证规则
import { mobileRules, codeRules } from '@/views/Login/rules'
export default {
  data() {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isShowCountDown: false
    }
  },
  methods: {
    // 返回先前页面
    backPrePage() {
      this.$router.back()
    },
    // 登录
    async onSubmit() {
      // loading
      this.$toast.loading({
        message: '不要着急，加载中',
        // loading时，点击页面没有反应
        forbidClick: true
      })
      try {
        const res = await login(this.mobile, this.code)
        console.log(res)
        // 保存token
        this.$store.commit('setUser', res.data.data)
        // 跳转页面
        this.$router.push('/profile')
        // 提示成功
        this.$toast.success('登录成功')
      } catch (error) {
        // 提示失败
        // 拿到状态码
        const status = error.response.status
        let message = '登录错误，请刷新'
        if (status === 400) {
          message = error.response.data.message
        }
        this.$toast.fail(message)
      }
    },
    async sendCode() {
      try {
        // 验证手机号
        await this.$refs.form.validate('mobile')
        // 发送请求，获取验证码
        await sendCode(this.mobile)
        // 开始倒计时
        this.isShowCountDown = true
      } catch (error) {
        //  1.表单校验失败
        if (!error.response) {
          this.$toast.fail('手机号格式不正确')
        } else {
          // 2.发送验证码导致的失败
          const status = error.response.data.status
          console.log(status)
          if (status === 404 || status === 429) {
            this.$toast.fail(error.response.data.message)
          }
        }
      }
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
