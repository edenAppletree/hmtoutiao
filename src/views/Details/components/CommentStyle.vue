<template>
  <div>
    <!-- 评论区 -->
    <van-cell-group>
      <van-cell class="cell" center>
        <template #title>
          <div class="com_content">
            <img :src="item.aut_photo" />
            <div class="text">
              <p class="username">{{ item.aut_name }}</p>
              <p class="content">{{ item.content }}</p>
              <div class="time_reply">
                <span class="time">{{ relativeTime }}</span>
                <span>
                  <van-button class="btn" @click="showPopup(item.com_id)"
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
            @click="likeFn(item)"
            :class="{ changeRed: isLike === true }"
          />
          <span> {{ item.like_count ? item.like_count : '赞' }}</span>
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 评论回复 弹框 组件 -->
    <ReplyComment
      ref="popup"
      :replyObj="replyObj"
      :comid="item.com_id"
    ></ReplyComment>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import { toCommentOrReply, likeComment, cancelLikeComment } from '@/api'
// 引入组件
import ReplyComment from '@/views/Details/components/ReplyComment'
export default {
  data() {
    return {
      replyObj: {},
      isLike: ''
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    art_id: {
      type: String
    }
  },
  components: {
    ReplyComment
  },
  computed: {
    relativeTime() {
      return dayjs(this.item.pubdate).fromNow()
    }
  },
  methods: {
    // 对文章或者评论进行评论---dui
    async toCommentOrReply() {
      const res = await toCommentOrReply(
        this.art_id,
        this.item.content,
        this.item.com_id
      )
      this.replyObj = res.data.data.new_obj
    },
    // 弹窗
    showPopup(id) {
      this.$refs.popup.isShow = true
      // 没有这一步的话回复页面不能确定评论id 无法正常渲染
      this.toCommentOrReply(id)
    },
    // 对评论点赞 或 取消点赞
    async likeFn(item) {
      this.isLike = !this.isLike
      if (this.isLike) {
        await likeComment(this.item.com_id)
        item.like_count++
        this.$toast('点赞成功')
      } else {
        await cancelLikeComment(this.item.com_id)
        item.like_count--
        this.$toast('取消成功')
      }
    }
  },
  created() {
    this.isLike = this.item.is_liking
  }
}
</script>

<style lang="less" scoped>
.changeRed {
  color: red;
}
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
  }
}
</style>
