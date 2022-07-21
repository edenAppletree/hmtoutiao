import request from '@/utils/request.js'

export const getSearchSuggestion = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}

export const getSearchResult = (q, page, perPage) => {
  return request({
    url: '/v1_0/search',
    params: {
      q,
      page,
      perPage
    }
  })
}
