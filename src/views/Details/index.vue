<template>
  <div class="bg">
    <!-- 头部导航 -->
    <van-nav-bar title="黑马头条" left-arrow @click-left="onClickLeft" />
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
          <van-button @click="isShow = !isShow">
            <van-icon name="plus" v-show="isShow" />
            {{ isShow ? '关注' : '已关注' }}</van-button
          >
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 没有更多了~ 列表设置 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
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
      <!-- 评论区 -->
    </van-list>
    <!-- 底栏功能区 -->
    <van-tabbar fixed class="tab">
      <van-tabbar-item class="first">
        <input type="text" placeholder="写评论" class="ipt" />
      </van-tabbar-item>
      <van-tabbar-item
        icon="comment-o"
        :badge="contentObj.comm_count"
        class="commentIcon"
      ></van-tabbar-item>
      <van-tabbar-item icon="star-o"></van-tabbar-item>
      <van-tabbar-item icon="good-job-o"></van-tabbar-item>
      <van-tabbar-item icon="share-o"></van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { getNewsDetails, getComments } from '@/api'
import dayjs from '@/utils/dayjs'
export default {
  data() {
    return {
      id: '',
      contentObj: {},
      loading: false,
      finished: false,
      isShow: true,
      commentList: []
    }
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
      //   console.log(this.contentObj)
    },
    onLoad() {
      this.loading = true
      this.finished = true
    },
    async getComments() {
      const res = await getComments('a', this.id)
      this.commentList = res.data.data.results
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
    margin-top: -10px;
    .ipt {
      width: 280px;
      height: 44px;
      border-radius: 22px;
      border: 2px solid #efefef;
      font-size: 30px;
      color: #a7a7af;
      text-align: center;
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
