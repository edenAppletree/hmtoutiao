<template>
  <div>
    <!-- 渲染无图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 0"
      :title="articleInfo.title"
      :label="articleDacs"
      @click="routerFn(articleInfo.art_id)"
    />
    <!-- 渲染一张图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 1"
      :title="articleInfo.title"
      :label="articleDacs"
      @click="routerFn(articleInfo.art_id)"
    >
      <van-image
        width="3rem"
        height="2rem"
        :src="articleInfo.cover.images[0]"
      ></van-image>
    </van-cell>
    <!-- 渲染三张图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 3"
      :title="articleInfo.title"
      @click="routerFn(articleInfo.art_id)"
    >
      <template #label>
        <!-- 图片 -->
        <div>
          <van-image
            v-for="item in articleInfo.cover.images"
            :key="item"
            width="3rem"
            height="2rem"
            :src="item"
          ></van-image>
        </div>
        <!-- 文章描述 -->
        <span>{{ articleDacs }}</span>
      </template>
    </van-cell>
  </div>
</template>

<script>
// 引入utils
import dayjs from '@/utils/dayjs'
export default {
  props: {
    articleInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    articleDacs() {
      const art = this.articleInfo
      const relativeTime = dayjs(art.pubdate).fromNow()
      return `${art.aut_name} ${art.comm_count}评论 ${relativeTime}`
    }
  },
  methods: {
    // 点击跳转文章详情页
    routerFn(id) {
      this.$router.push({
        path: '/details',
        query: {
          art_id: id
        }
      })
    }
  }
}
</script>

<style></style>
