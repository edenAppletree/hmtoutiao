<template>
  <div>
    <!-- 搜索历史 -->
    <van-cell-group>
      <van-cell title="搜索历史">
        <template #default>
          <van-icon name="delete-o" v-if="isShow" @click="isShow = false" />
          <div v-else>
            <span @click="allDel">全部删除</span> <span @click="isShow=true">完成</span>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 搜索历史内容列表 -->
    <van-cell
      v-for="(item, index) in histryList"
      :key="index"
      @click="addToInput(index)"
      :title="item"
    >
      <template #right-icon>
        <van-icon
          name="close"
          v-show="!isShow"
          @click.stop="delMyself(index)"
        />
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  data() {
    return {
      histryList: [],
      isShow: true
    }
  },
  created() {
    this.histryList = JSON.parse(localStorage.getItem('history'))
  },
  methods: {
    addToInput(index) {
      // 点击列表内容，把索引号对应内容传给输入框的v-model
      const selected = this.histryList[index]
      this.$emit('selectedContent', selected)
    },
    allDel() {
      this.histryList = []
      // 数据传进本地存储
      this.$emit('newHistoryList', this.histryList)
    },
    delMyself(index) {
      // 找到点击的对应索引号进行删除
      this.histryList.findIndex((i) => i === index)
      this.histryList.splice(index, 1)
      // 还没有删除本地
      this.$emit('newHistoryList', this.histryList)
    }
  }
}
</script>

<style lang="less" scoped></style>
