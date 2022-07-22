<template>
  <div>
    <!-- 每一篇文章的结构 -->
    <van-pull-refresh v-model="refreshLoading" @refresh="loadNextPage">
      <van-list offset="0" @load="loadNextPage">
        <ArticleItem
          v-for="item in articles"
          :key="item.art_id"
          :articleInfo="item"
          v-model="loading"
          :finished="isFinished"
          :error.sync="error"
          error-text="出错了，请重新加载"
          finished-text="没有更多了~"
          success-text="刷新成功"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 引入api
import { getArticleList } from '@/api'
// 引入组件
import ArticleItem from './ArticleItem.vue'
/**
 * load事件：滚动条触底时触发
 * offset： 滚动条到底部的距离
 * loading:控制load事件触发 loading为false,可以触发load事件,并且每次触发load事件时候, vant会把loading设置为true,在加载完时候,需要手动设置为false
 * finally 语句一定会执行
 */
export default {
  name: 'ArticleList',
  data() {
    return {
      articles: [],
      pre_timestamp: '',
      loading: false,
      isFinished: false,
      error: false,
      refreshLoading: false
    }
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  created() {
    this.getArticleList()
  },
  components: {
    ArticleItem
  },
  methods: {
    // 页面一开始，加载第一页数据
    async getArticleList() {
      try {
        const { data } = await getArticleList(this.id, +new Date())
        this.pre_timestamp = data.data.pre_timestamp
        this.articles = data.data.results
        // console.log(this.articles)
      } catch (error) {
        // 获取状态码
        const status = error.response.status
        if (status === 400) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('获取文章列表失败，请重新刷新')
        }
      }
    },
    // 加载下一页数据
    async loadNextPage() {
      try {
        const { data } = await getArticleList(this.id, this.pre_timestamp)
        if (!data.data.pre_timestamp) {
          this.isFinished = true
        }
        //  将第n页的数据，放在articles
        if (this.refreshLoading) {
          // 如果是下拉刷新，将数据放在最前方
          this.articles.unshift(...data.data.results)
        } else {
          this.articles.push(...data.data.results)
        }
        // 更新数据
        this.pre_timestamp = data.data.pre_timestamp

        // loading设置为false
        // this.loading = false
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
        this.refreshLoading = false
      }
    }
  }
}
</script>

<style></style>
