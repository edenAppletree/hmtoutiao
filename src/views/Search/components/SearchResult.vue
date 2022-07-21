<template>
  <div>
    <van-list
      v-model="loading"
      :finished="isFinished"
      :error.sync="error"
      error-text="出错了，请重新加载"
      finished-text="没有更多了~"
      success-text="刷新成功"
      @load="loadNextPage"
      offset="0"
    >
      <van-cell v-for="item in resultList" :key="item.art_id">
        <template #title>
          <span v-html="item.title"></span>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api'
export default {
  data() {
    return {
      resultList: [],
      per_page: '',
      loading: false,
      isFinished: false,
      error: false
    }
  },
  props: {
    keywords: {
      type: [String, Number],
      required: true
    }
  },
  created() {
    this.getSearchResult()
  },
  methods: {
    // 页面一开始，加载第一页数据
    async getSearchResult() {
      try {
        // if (Math.random() < 0.6) {
        //   throw new Error('出错了')
        // }
        const res = await getSearchResult(this.keywords)
        this.resultList = res.data.data.results
        // 获得当前的页面数量
        this.per_page = res.data.data.per_page
      } catch (error) {
        // 获取状态码
        const status = error.response.status
        if (status === 400) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('获取搜索列表失败，请重新刷新')
        }
      }
    },
    // 加载下一页数据
    async loadNextPage() {
      try {
        const res = await getSearchResult(this.keywords, this.per_page)
        if (res.data.data.results.length < 10) {
          this.isFinished = true
        } else {
          // 将第n页的数据，放在resultList
          this.resultList.push(...res.data.data.results)
        }
        // 更新数据
        this.per_page = res.data.data.per_page
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

<style lang="less" scoped></style>
