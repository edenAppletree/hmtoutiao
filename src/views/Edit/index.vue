<template>
  <div class="bg">
    <!-- 头部导航 -->
    <van-nav-bar
      title="个人信息"
      left-arrow
      @click-left="onClickLeft"
      class="navbar"
    />
    <!-- 内容 -->
    <!-- 头像部分 -->
    <van-cell title="头像" is-link>
      <van-uploader
        v-model="fileList"
        :style="{ display: 'block' }"
        :after-read="afterRead"
        :preview-image="false"
        :showIndex="false"
      >
        <template #default>
          <van-image :src="myInfo.photo" width="30px" height="30px" round />
        </template>
      </van-uploader>
    </van-cell>
    <!-- 弹出层 -->
    <van-popup
      v-model="popshow"
      :style="{ height: '100%', width: '100%', backgroundColor: '#333' }"
    >
      <UpdatePhoto
        :photo="photo"
        @updateAvator="updateAvator"
        @closePop="closePop"
      >
      </UpdatePhoto>
    </van-popup>
    <!-- 昵称部分 -->
    <van-cell title="昵称" is-link @click="showPopup">{{
      myInfo.name
    }}</van-cell>
    <van-popup v-model="show" position="bottom" :style="{ height: '100%' }">
      <van-nav-bar
        title="更新昵称"
        left-text="取消"
        right-text="保存"
        @click-left="cancelChangeName"
        @click-right="saveChangedName"
      />
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        show-word-limit
      />
    </van-popup>
    <!-- 性别部分 -->
    <van-cell title="性别" is-link @click="showPopup1">{{
      { 0: '男', 1: '女' }[myInfo.gender]
    }}</van-cell>
    <van-popup v-model="show1" position="bottom" :style="{ height: '40%' }">
      <van-picker
        title="更新性别"
        show-toolbar
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"
        :style="{ width: '100%' }"
        value-key
      />
    </van-popup>
    <!-- 生日部分 -->
    <van-cell title="生日" is-link @click="showPopup2">{{
      myInfo.birthday
    }}</van-cell>
    <van-popup v-model="show2" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="saveTime"
        @cancel="cancelChangeTime"
      />
    </van-popup>
  </div>
</template>

<script>
import { getMyInfo, editMyInfo } from '@/api'
import UpdatePhoto from '@/views/Edit/components/UpdatePhoto.vue'
import moment from 'moment'
export default {
  data() {
    return {
      popshow: false,
      myInfo: {},
      show: false,
      message: '',
      userInfoObj: {
        name: '',
        gender: '',
        birthday: '',
        real_name: '',
        intro: ''
      },
      columns: ['男', '女'],
      show1: false,
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      show2: false,
      photo: '',
      fileList: []
    }
  },
  created() {
    this.getMyInfo()
  },
  components: {
    UpdatePhoto
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取用户个人资料
    async getMyInfo() {
      const res = await getMyInfo()
      this.myInfo = res.data.data
      //   console.log(this.myInfo)
    },
    // 更改头像
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      // console.log(file)
      this.photo = file.content
      this.popshow = true
    },
    updateAvator(photo) {
      this.myInfo.photo = photo
    },
    // 关闭弹窗
    closePop() {
      this.popshow = false
    },
    // 昵称部分
    showPopup() {
      this.show = true
      this.message = this.myInfo.name
    },
    cancelChangeName() {
      // 取消
      this.show = false
    },
    saveChangedName() {
      // 保存
      this.show = false
      console.log(this.message)
      this.userInfoObj.name = this.message
      this.$nextTick(() => {
        this.editMyInfo()
      })
      // 重新获取个人资料
      this.getMyInfo()
    },
    // 性别部分
    showPopup1() {
      this.show1 = true
    },
    onConfirm(value, index) {
      // 点击 确认 保存
      console.log(index)
      this.userInfoObj.gender = index
      this.$nextTick(() => {
        this.editMyInfo()
      })
      // 重新获取个人资料
      this.getMyInfo()
      this.show1 = false
    },
    onCancel() {
      // 取消
      this.show1 = false
    },
    // 选择年月日部分
    showPopup2() {
      this.show2 = true
    },
    saveTime(val) {
      // 保存
      console.log(moment(val).format('YYYY-MM-DD'))
      this.userInfoObj.birthday = moment(val).format('YYYY-MM-DD')
      this.$nextTick(() => {
        this.editMyInfo()
      })
      // 重新获取个人资料
      this.getMyInfo()
      this.show2 = false
    },
    cancelChangeTime() {
      // 点击取消
      this.show2 = false
    },
    // 编辑用户个人资料
    async editMyInfo() {
      await editMyInfo({ ...this.userInfoObj })
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  background-color: #5094f3;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  :deep(.van-icon-arrow-left:before) {
    color: #fff;
  }
}
img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
:deep(.van-uploader__wrapper) {
  padding-left: 250px;
}
</style>
