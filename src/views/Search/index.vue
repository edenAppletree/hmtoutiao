<template>
  <div>
    <!-- 头部搜索框 -->
    <van-search
      v-model="keywords"
      show-action
      background="#5094f3"
      color="#fff"
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="backToPrePage"
      @focus="visibleSearchSuggestion"
    />
    <component
      :is="comName"
      :keywords="keywords"
      @selectedContent="selectedContent"
      @newHistoryList="getNewHistoryList"
      :histryList="histryList"
    ></component>
  </div>
</template>

<script>
import SearchHistory from './components/SearchHistory'
import SearchSuggestion from './components/SearchSuggestion'
import SearchResult from './components/SearchResult.vue'
export default {
  data() {
    return {
      keywords: '',
      isShowSearchResult: false,
      histryList: JSON.parse(localStorage.getItem('history')) || []
    }
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  computed: {
    comName() {
      if (this.keywords.trim() === '') {
        return SearchHistory
      }
      if (this.isShowSearchResult) {
        return SearchResult
      }
      return SearchSuggestion
    }
  },
  methods: {
    backToPrePage() {
      this.$router.go(-1)
    },
    onSearch() {
      this.isShowSearchResult = true
      if (!this.histryList.includes(this.keywords)) {
        this.histryList.unshift(this.keywords)
      } else {
        this.histryList = this.histryList.filter(
          (item) => item !== this.keywords
        )
        this.histryList.unshift(this.keywords)
        console.log(this.histryList)
      }
      // 搜索历史列表放入本地存储
      localStorage.setItem('history', JSON.stringify(this.histryList))
    },
    // 显示搜索建议
    visibleSearchSuggestion() {
      // 如果keywords没有值，显示搜索历史
      // 如果keywords有值，显示搜索建议
      this.isShowSearchResult = false
    },
    selectedContent(val) {
      // 把所选内容填入到输入框
      this.keywords = val
      // 获取内容的搜索结果
      this.onSearch()
    },
    getNewHistoryList(val) {
      this.histryList = val
      // 最新搜索历史列表放入本地存储
      // localStorage.setItem('history', JSON.stringify(this.histryList))
    }
  }
}
</script>

<style lang="less" scoped>
.van-search__action {
  color: #ffffff;
}
</style>
