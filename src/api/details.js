import request from '@/utils/request'

export const getNewsDetails = (id) => {
  return request({
    url: `/v1_0/articles/${id}`
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

// 对文章或者评论进行评论
export const toCommentOrReply = (target, content, artId) => {
  return request({
    url: '/v1_0/comments',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      target,
      content,
      art_id: artId
    }
  })
}

// 收藏文章
export const collectArt = (artId) => {
  return request({
    url: '/v1_0/article/collections',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      target: artId
    }
  })
}

// 取消收藏文章
export const cancelCollectArt = (artId) => {
  return request({
    url: `/v1_0/article/collections/${artId}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取用户收藏列表
export const getUserCollectionList = () => {
  return request({
    url: '/v1_0/article/collections'
  })
}

// 对文章点赞
export const likeArt = (artId) => {
  return request({
    url: '/v1_0/article/likings',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      target: artId
    }
  })
}

// 取消对文章点赞
export const cancelLikeArt = (Id) => {
  return request({
    url: `/v1_0/article/likings/${Id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 对评论或评论回复点赞
export const likeComment = (comId) => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      target: comId
    }
  })
}

// 取消对评论或评论回复点赞
export const cancelLikeComment = (comId) => {
  return request({
    url: `/v1_0/comment/likings/${comId}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
