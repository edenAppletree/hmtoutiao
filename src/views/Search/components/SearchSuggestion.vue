<template>
  <div>
    <van-cell v-for="(item, index) in highlightData" :key="index">
      <template #icon>
        <van-icon name="search" class="search-icon" />
      </template>
      <template #title>
        <span v-html="item" @click="addToInput(index)"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api'
export default {
  data() {
    return {
      suggestions: []
    }
  },
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  watch: {
    // 监视属性绑定的函数，如果是methods里面的函数，支持字符串的写法
    keywords: {
      immediate: true,
      handler() {
        this.getSearchSuggestion()
      }
    }
  },
  methods: {
    async getSearchSuggestion() {
      try {
        const res = await getSearchSuggestion(this.keywords)
        if (res.data.data.options.length === 0) {
          this.$toast.fail('没有搜索建议')
        }
        this.suggestions = res.data.data.options.filter(Boolean)
      } catch (error) {
        console.log(error)
      }
    },
    addToInput(index) {
      // 点击推荐内容，把索引号对应内容传给输入框的v-model
      const selected = this.suggestions[index]
      this.$emit('selectedContent', selected)
    }
  },
  computed: {
    highlightData() {
      // 将搜索建议的每一项都进行处理（关键字的样式变红色）
      const reg = new RegExp(this.keywords, 'ig')
      return this.suggestions.map((str) =>
        str.replace(reg, (match) => `<span style="color:red">${match}</span>`)
      )
    }
  }
}
</script>

<style lang="less" scoped>
.search-icon {
  padding-top: 10px;
}
</style>
