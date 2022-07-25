<template>
  <div class="bg">
    <!-- 头部导航 -->
    <van-nav-bar title="黑马头条" left-arrow @click-left="onClickLeft" fixed />
    <!-- 文章标题 -->
    <div class="title">
      <h5>{{ contentObj.title }}</h5>
    </div>
    <!-- 作者+关注 -->
    <van-cell-group>
      <van-cell class="cell" center :border="false">
        <template #title>
          <div class="cellcontent">
            <img :src="contentObj.aut_photo" />
            <div class="text">
              <p>{{ contentObj.aut_name }}</p>
              <p class="time">{{ relativeTime }}</p>
            </div>
          </div>
        </template>
        <template #default>
          <van-button @click="getFollowed(contentObj.aut_id)">
            <van-icon name="plus" v-show="!isShow" />
            {{ isShow ? '已关注' : '关注' }}</van-button
          >
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 没有更多了~ 列表设置 -->
    <!-- 文章内容 -->
    <div
      class="article-content markdown-body"
      v-html="contentObj.content"
    ></div>
    <!-- 正文结束 -->
    <div class="line">
      <div></div>
      <p>正文结束</p>
      <div></div>
    </div>
    <!-- 评论区 组件 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      offset="100"
      check
    >
      <CommentStyle
        v-for="item in commentList"
        :key="item.com_id"
        :item="item"
        :art_id="id"
        :style="{ padding: '10px' }"
      ></CommentStyle>
    </van-list>
    <!-- 底栏功能区 -->
    <van-tabbar class="tab">
      <!-- 发送评论 -->
      <van-tabbar-item class="first">
        <input
          type="text"
          placeholder="写评论"
          class="ipt"
          @click="showPopup1"
        />
        <van-popup
          v-model="isWrite"
          position="bottom"
          :style="{ height: '18%' }"
        >
          <div class="inputCom">
            <van-field
              v-model="commentVal"
              rows="2"
              autosize
              type="textarea"
              maxlength="50"
              placeholder="请输入评论"
              show-word-limit
              class="textarea"
            />
            <button class="sendCom" @click="sendCom()">发布</button>
          </div>
        </van-popup>
      </van-tabbar-item>
      <van-tabbar-item
        icon="comment-o"
        :badge="contentObj.comm_count"
        class="commentIcon"
      ></van-tabbar-item>
      <van-tabbar-item
        icon="star"
        @click="collectFn(id)"
        :class="{ changeRed: isCollect === true }"
      ></van-tabbar-item>
      <van-tabbar-item
        icon="good-job"
        :class="{ changeRed: isLike === 1 }"
        @click="likeArt(id)"
      ></van-tabbar-item>
      <van-tabbar-item icon="share-o"></van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import {
  getNewsDetails,
  getComments,
  collectArt,
  cancelCollectArt,
  likeArt,
  cancelLikeArt,
  toCommentOrReply,
  getFollowed,
  cancelFollowed
} from '@/api'
import dayjs from '@/utils/dayjs'
import CommentStyle from '@/views/Details/components/CommentStyle'
export default {
  data() {
    return {
      id: '',
      contentObj: {},
      loading: false,
      finished: false,
      isShow: '',
      commentList: [],
      commentVal: '',
      isCollect: '',
      isLike: '',
      isWrite: false
    }
  },
  components: {
    CommentStyle
  },
  computed: {
    relativeTime() {
      return dayjs(this.contentObj.pubdate).fromNow()
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    // 获取文章详情数据
    async getNewsDetails() {
      this.id = this.$route.query.art_id
      const res = await getNewsDetails(this.id)
      this.contentObj = res.data.data
      // console.log(this.contentObj)
      this.isCollect = this.contentObj.is_collected
      this.isLike = this.contentObj.attitude
      this.isShow = this.contentObj.is_followed
    },
    onLoad() {
      if (this.commentList.length <= 10) {
        this.loading = true
        this.finished = true
      } else {
        this.loading = false
      }
      // this.finished = true
    },
    // 关注用户 或 取消关注
    async getFollowed(autid) {
      // console.log(autid)
      this.isShow = !this.isShow
      if (this.isShow) {
        await getFollowed(autid)
        this.$toast.success('关注作者成功')
      } else {
        await cancelFollowed(autid)
        this.$toast.success('取消关注作者成功')
      }
    },
    // 获取评论
    async getComments() {
      const res = await getComments('a', this.id)
      this.commentList = res.data.data.results
      // console.log(res.data.data)
    },
    // 发送评论
    async sendCom() {
      if (this.commentVal.trim().length === 0) {
        return this.$toast('评论不能为空')
      }
      // 对文章评论
      await toCommentOrReply(this.id, this.commentVal)
      // 刷新评论数据（重新获取评论数据）
      this.getComments()
      this.contentObj.comm_count++
      // 弹框下去
      this.isWrite = false
      // 输入框置空
      this.commentVal = ''
    },
    // 收藏文章 或 取消收藏
    async collectFn(artId) {
      this.isCollect = !this.isCollect
      if (this.isCollect) {
        // 收藏文章
        await collectArt(artId)
        this.$toast.success('收藏文章成功')
      } else {
        // 取消收藏
        await cancelCollectArt(artId)
        this.$toast.success('取消收藏成功')
      }
    },
    // 点赞文章 或 取消点赞
    async likeArt(artId) {
      if (this.isLike !== 1) {
        // 点赞文章
        await likeArt(artId)
        this.$toast.success('点赞成功')
        this.isLike = 1
      } else if (this.isLike === 1) {
        // 取消点赞
        await cancelLikeArt(artId)
        this.$toast.success('取消点赞成功')
        this.isLike = 0
      }
    },
    // 展示评论弹框
    showPopup1() {
      this.isWrite = true
    }
  },
  created() {
    this.getNewsDetails()
    this.getComments()
  }
}
</script>

<style lang="less" scoped>
.bg {
  margin-bottom: 100px;
}
// 收藏样式变红
.changeRed {
  color: red;
}
// 头部导航样式
:deep(.van-nav-bar__content) {
  background-color: #5094f3;
  .van-nav-bar__title {
    color: #ffffff;
  }
  .van-icon-arrow-left:before {
    color: #ffffff;
  }
}
// 文章标题样式
.title {
  margin-top: 150px;
  padding: 0 30px;
  h5 {
    margin: 40px 0;
  }
}
.cell {
  .cellcontent {
    display: flex;
    align-items: center;
    line-height: 0.5;
    img {
      width: 80px;
      height: 90px;
      border-radius: 50%;
    }
    .text {
      margin-left: 20px;
      font-size: 26px;
      line-height: 1;
      .time {
        color: #c1c4cc;
      }
    }
  }
  .van-button--default {
    background-color: #5094f3;
    width: 170px;
    height: 58px;
    border-radius: 29px;
    color: #ffffff;
  }
}
// 文章内容
:deep(.markdown-body) {
  padding: 54px 32px;
  p {
    text-indent: 2em;
    font-size: 30px !important;
  }
  h1 {
    font-size: 40px !important;
  }
  h2 {
    font-size: 36px !important;
  }
}
// 正文结束样式
.line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0;
  div {
    width: 270px;
    height: 2px;
    background-color: #f6f6f8;
  }
  p {
    font-size: 28px;
    color: #969799;
  }
}
.tab {
  border-top: 1px solid #d8d8d8;
  .first {
    flex: 4;
    margin-bottom: 10px;
    .ipt {
      width: 280px;
      height: 44px;
      border-radius: 22px;
      border: 1px solid #efefef;
      font-size: 30px;
      color: #a7a7af;
      text-align: center;
    }
    .inputCom {
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
  }
  :deep(.van-icon) {
    font-size: 40px;
  }
  :deep(.van-icon-comment-o:before) {
    margin-top: 10px;
  }
}
</style>
