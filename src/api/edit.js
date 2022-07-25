import request from '@/utils/request'

// 获取用户个人资料
export const getMyInfo = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}

// 编辑用户个人资料
export const editMyInfo = (userInfoObj) => {
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      ...userInfoObj
    }
  })
}

// 编辑用户照片资料（头像、身份证照片）
export const editMyPhoto = (photo) => {
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: photo
  })
}
