<template>
  <van-popup
    v-model="isShow"
    position="bottom"
    :style="{ height: '98%' }"
    closeable
    close-icon-position="top-left"
  >
    <div class="popupMain">
      <!-- 我的频道标题 -->
      <div class="my-channel">
        <van-cell title="我的频道">
          <van-button
            size="small"
            round
            class="edit-btn"
            @click="isEdit = !isEdit"
            >{{ isEdit ? '完成' : '编辑' }}</van-button
          >
        </van-cell>
        <van-grid gutter="10px">
          <van-grid-item
            :text="item.name"
            v-for="(item, index) in myChannels"
            :key="item.id"
            :class="{ 'active-channel': item.name === '推荐' }"
            @click="onDelMyChannel(item, index)"
          >
            <template #icon
              ><van-icon v-show="isEdit && item.name !== '推荐'" name="cross"
            /></template>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 推荐频道 -->
      <div class="recommend-channel">
        <van-cell title="推荐频道"> </van-cell>
        <van-grid gutter="10px" :border="false">
          <van-grid-item
            :text="item.name"
            icon="plus"
            v-for="item in recommendChannels"
            :key="item.id"
            @click="addMyChannel(item)"
          >
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  data() {
    return {
      isShow: true,
      allChannels: [],
      isEdit: false
    }
  },
  props: {
    myChannels: {
      type: Array,
      require: true
    }
  },
  created() {
    this.getAllChannels()
  },
  methods: {
    async getAllChannels() {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
      console.log(this.allChannels)
    },
    onDelMyChannel(channel, index) {
      // 边缘情况的判断
      if (this.isEdit && channel.name !== '推荐') {
        // 删除
        return this.$emit('del-myChannel', channel.id)
      }
      if (!this.isEdit) {
        // 切换
        this.isShow = false
        this.$emit('change-active', index)
      }
    },
    addMyChannel(myChannel) {
      this.$emit('add-mychannel', { ...myChannel })
    }
  },
  computed: {
    recommendChannels() {
      // 在所有的频道中，减去我的频道
      // 在所有的频道中，筛选掉我的频道
      return this.allChannels.filter((item) => {
        // 所有频道的每一项
        const result = this.myChannels.find((i) => i.id === item.id)
        // if (result) {
        //   return false
        // } else {
        //   return true
        // }
        return !result
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 高亮样式
.active-channel {
  :deep(.van-grid-item__text) {
    color: hotpink;
  }
}
.popupMain {
  margin-top: 100px;
  // 按钮的样式
  .edit-btn {
    color: red;
    padding: 0 30px;
    height: 48px;
    border: 0.02667rem solid red;
  }
  //   我的频道的样式
  .my-channel {
    :deep(.van-grid-item__content) {
      position: relative;
      background-color: #eee;

      .van-grid-item__icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;

        .van-icon-cross {
          position: absolute;
          top: -24px;
          right: -20px;
          transform: translate(20%, -35%);
          border: 0.02667rem solid #000;
          border-radius: 50%;
          text-align: center;
          line-height: 0.64rem;
          transform: scale(0.6, 0.6);
        }
      }
    }
  }
  // 推荐频道的样式
  .recommend-channel {
    // 推荐频道加号样式
    :deep(.van-grid-item__content) {
      flex-direction: row;
      background-color: #eee;

      .van-grid-item__icon {
        font-size: 0.5rem;
      }

      .van-grid-item__text {
        margin-top: 0;
      }
    }
  }
}
</style>
