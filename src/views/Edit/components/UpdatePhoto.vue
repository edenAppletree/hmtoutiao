<template>
  <div>
    <div class="content">
      <img :src="photo" ref="img" />
      <div class="btn">
        <button @click="cancel">取消</button>
        <button @click="confirm">完成</button>
      </div>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { editMyPhoto } from '@/api'
export default {
  props: ['photo'],
  mounted() {
    const img = this.$refs.img
    this.myCropper = new Cropper(img, {
      viewMode: 1,
      background: false,
      highlight: false,
      scalable: true
    })
  },
  methods: {
    confirm() {
      const fm = new FormData()
      // console.log(this)
      this.myCropper.getCroppedCanvas().toBlob(async (blob) => {
        fm.append('photo', blob)

        console.log(this.photo)
        // console.log(this.myCropper.getCroppedCanvas())
        const res = await editMyPhoto(fm)
        // 返回数据拿到图片地址返回给父组件进行页面渲染
        this.$emit('updateAvator', res.data.data.photo)
        // this.$parent.popshow = false
        this.$emit('closePop')
      })
    },
    cancel() {
      // this.$parent.popshow = false
      console.log(1)
      console.log(this.$parent)
      this.$emit('closePop')
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  margin-top: 50%;
}
img {
  width: 100%;
}
.btn {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: #ffffff;
  button {
    border: none;
    font-size: 34px;
    background-color: transparent;
  }
}
</style>
