<template>
  <div>
    <van-popup v-model="show">
      <img :src="photo" ref="img" />
      <div class="btn">
        <button>取消</button>
        <button @click="confirm">完成</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { editMyPhoto } from '@/api'
export default {
  data() {
    return {
      show: false
    }
  },
  props: ['photo'],
  mounted() {
    const img = this.refs.img
    this.myCropper = new Cropper(img, {})
  },
  methods: {
    showPopup() {
      this.show = true
    },
    confirm() {
      const fm = new FormData()
      this.myCropper.getCroppedCanvas().toBlob(function (blob) {
        fm.append('photo', blob)

        editMyPhoto(fm)
      })
    }
  }
}
</script>

<style lang="less" scoped>
img {
  height: 500px;
}
.btn {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: none;
  color: #ffffff;
}
</style>
