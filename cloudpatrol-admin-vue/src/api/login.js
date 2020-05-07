import request from '@/utils/request'

export function login(groupName,username,password) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
			groupName,
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}
