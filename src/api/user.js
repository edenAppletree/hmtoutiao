import request from '@/utils/request'
// import store from '@/store'

/**
 * 登录
 * @param {String} mobile 手机号
 * @param {String} code 验证码
 * @returns Promise
 */
export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: { mobile, code }
  })
}

/**
 * 发送验证码
 * @param {String} mobile 手机号
 * @returns Promise
 */
export const sendCode = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}

/**
 * 请求用户自己的信息
 * @returns Promise
 */
export const getUserInfo = () => {
  return request({
    url: '/v1_0/user'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 关注用户
export const getFollowed = (target) => {
  return request({
    url: '/v1_0/user/followings',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      target
    }
  })
}

// 取消关注用户
export const cancelFollowed = (target) => {
  return request({
    url: `/v1_0/user/followings/${target}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
