<template>
  <div>
    <van-popup
      ref="popup"
      v-model="isShow"
      position="bottom"
      :style="{ height: '98%' }"
      fixed="false"
    >
      <!-- 头部 -->
      <van-nav-bar
        :title="commentListCount ? `${commentListCount}条回复` : '暂无回复'"
        class="head"
      />
      <!-- 用户的评论内容 -->
      <van-cell-group>
        <van-cell class="cell" center>
          <template #title>
            <div class="com_content">
              <img :src="replyObj.aut_photo" />
              <div class="text">
                <p class="username">{{ replyObj.aut_name }}</p>
                <p class="content">{{ replyObj.content }}</p>
                <div class="time_reply">
                  <span class="time">{{ relativeTime }}</span>
                  <span>
                    <van-button class="btn"
                      >回复 {{ commentListCount }}</van-button
                    >
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template #default>
            <van-icon name="good-job-o" />
            <span> {{ replyObj.like_count ? replyObj.like_count : '赞' }}</span>
          </template>
        </van-cell>
      </van-cell-group>
      <!-- 回复部分 -->
      <van-cell-group>
        <van-cell title="全部回复" />
      </van-cell-group>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="100"
      >
        <van-cell />
      </van-list>
      <!-- 底部评论区 -->
      <van-tabbar>
        <van-tabbar-item>
          <input type="text" class="iptCom" placeholder="评论" />
        </van-tabbar-item>
      </van-tabbar>
    </van-popup>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
export default {
  data() {
    return {
      isShow: false,
      loading: false,
      finished: false
    }
  },
  props: {
    replyObj: {
      type: Object,
      required: true
    }
  },
  computed: {
    relativeTime() {
      return dayjs(this.replyObj.pubdate).fromNow()
    },
    commentListCount() {
      return this.$parent.item.reply_count
    }
  },
  methods: {
    onLoad() {
      this.loading = false
      this.finished = false
    }
  }
}
</script>

<style lang="less" scoped>
// 头部样式
:deep(.van-nav-bar__content) {
  background-color: #fff !important;
  .van-nav-bar__title {
    color: #3a3e55 !important;
  }
}
// 用户评论内容部分样式
.cell {
  .van-cell__title {
    flex: 3;
  }
  .com_content {
    display: flex;
    align-items: center;
    img {
      width: 80px;
      height: 90px;
      border-radius: 50%;
      margin-top: -100px;
    }
    .text {
      margin-left: 20px;
      line-height: 1;
      .username {
        color: #6c6fa2;
      }
      .content {
        font-size: 30px;
        color: #000;
        margin: 40px 0;
      }
      .time_reply {
        display: flex;
        align-items: center;
        .time {
          font-size: 24px;
          margin-right: 20px;
        }
        .btn {
          width: 140px;
          height: 50px;
          border-radius: 25px;
          font-size: 24px;
        }
      }
    }
  }
  :deep(.van-cell__value) {
    margin-top: -100px;
    color: #000;
    padding-right: 20px;
  }
}
// 底栏样式
:deep(.van-tabbar) {
  height: 100px;
  .van-tabbar-item {
    background-color: #ed72b2;
  }
  .iptCom {
    width: 650px;
    height: 70px;
    border-radius: 40px;
    border: none;
    margin-bottom: 10px;
    margin-left: -15px;
    font-size: 30px;
    text-align: center;
  }
}
</style>
