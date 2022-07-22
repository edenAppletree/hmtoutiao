import request from '@/utils/request'

export const getNewsDetails = (id) => {
  return request({
    url: `/v1_0/articles/${id}`
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取用户评论或评论回复
export const getComments = (type, source) => {
  return request({
    url: '/v1_0/comments',
    params: {
      type,
      source
    }
  })
}
