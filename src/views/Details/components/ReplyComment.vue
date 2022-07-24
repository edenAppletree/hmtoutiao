<template>
  <div>
    <van-popup
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
            <van-icon
              name="good-job-o"
              @click="likeHostFn(replyObj)"
              :class="{ changeRed: isLikeHost === true }"
            />
            <span> {{ replyObj.like_count ? replyObj.like_count : '赞' }}</span>
          </template>
        </van-cell>
      </van-cell-group>
      <!-- 回复部分 -->
      <van-cell-group>
        <van-cell title="全部回复" />
      </van-cell-group>
      <!-- <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="100"
      >
        <van-cell />
      </van-list> -->
      <!-- 回复 内容渲染 -->
      <van-cell-group>
        <van-cell
          class="cell"
          center
          v-for="item in commentReply"
          :key="item.com_id"
        >
          <template #title>
            <div class="com_content">
              <img :src="item.aut_photo" />
              <div class="text">
                <p class="username">{{ item.aut_name }}</p>
                <p class="content">{{ item.content }}</p>
                <div class="time_reply">
                  <span class="time">{{ relativeTime1 }}</span>
                  <span>
                    <van-button class="btn"
                      >回复 {{ item.reply_count }}</van-button
                    >
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template #default>
            <van-icon
              name="good-job-o"
              @click="likeReplyFn(item.com_id)"
              :class="{ changeRed: isLike === true }"
            />
            <span> {{ item.like_count ? item.like_count : '赞' }}</span>
          </template>
        </van-cell>
      </van-cell-group>
      <!-- 底部评论区 -->
      <van-tabbar>
        <van-tabbar-item>
          <input
            type="text"
            class="iptCom"
            placeholder="评论"
            @click="sendReply"
          />
        </van-tabbar-item>
      </van-tabbar>
      <van-popup v-model="isWrite" position="bottom" :style="{ height: '18%' }">
        <div class="inputComReply">
          <van-field
            v-model="replyVal"
            rows="2"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入评论"
            show-word-limit
            class="textarea"
          />
          <button class="sendCom" @click="sendComReply">发布</button>
        </div>
      </van-popup>
    </van-popup>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import {
  getComments,
  toCommentOrReply,
  likeComment,
  cancelLikeComment
} from '@/api'
export default {
  data() {
    return {
      isShow: false,
      loading: false,
      finished: false,
      commentReply: [],
      isLike: '',
      replyVal: '',
      isWrite: false,
      isLikeHost: ''
    }
  },
  props: {
    replyObj: {
      type: Object,
      required: true
    },
    comid: {
      type: String
    },
    artid: {
      type: String
    }
  },
  computed: {
    // 楼主的评论时间
    relativeTime() {
      return dayjs(this.replyObj.pubdate).fromNow()
    },
    commentListCount() {
      return this.$parent.item.reply_count
    },
    // 评论回复的时间 有错误
    relativeTime1() {
      return dayjs(this.commentReply.$children).fromNow()
    }
  },
  methods: {
    onLoad() {
      this.loading = false
      this.finished = false
    },
    // 对楼主评论点赞
    async likeHostFn(item) {
      this.isLikeHost = !this.isLikeHost
      if (this.isLikeHost) {
        await likeComment(this.replyObj.com_id)
        item.like_count++
        this.$toast('点赞成功')
      } else {
        await cancelLikeComment(this.replyObj.com_id)
        item.like_count--
        this.$toast('取消成功')
      }
    },
    // 获取评论回复数据
    async getComments() {
      const res = await getComments('c', this.comid)
      this.commentReply = res.data.data.results
      // console.log(this.commentReply)
    },
    // 对回复评论点赞 或 取消
    async likeReplyFn(id) {
      this.isLike = !this.isLike
      if (this.isLike) {
        await likeComment(id)
        this.$toast('点赞成功')
      } else {
        await cancelLikeComment(id)
        this.$toast('取消点赞成功')
      }
    },
    // 点击 写评论 出现弹框
    sendReply() {
      this.isWrite = true
    },
    // 点击发布评论回复
    async sendComReply() {
      const artid = this.$parent.art_id
      // console.log(this.comid)
      await toCommentOrReply(this.comid, this.replyVal, artid)
      // 重新获取评论回复数据
      // this.getComments()
      // 关闭弹框
      this.isWrite = false
    }
  },
  created() {
    this.getComments()
    this.isLikeHost = this.replyObj.is_liking
    console.log(this.replyObj)
  }
}
</script>

<style lang="less" scoped>
.changeRed {
  color: red;
}
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
// 发布评论 弹窗样式
.inputComReply {
  display: flex;
  .textarea {
    flex: 7;
    margin: 30px 10px 30px 30px;
    background-color: #f5f7f9;
  }
  .sendCom {
    flex: 1;
    color: #cbdcee;
    border: none;
    background-color: #fff;
    font-size: 28px;
  }
}
</style>
