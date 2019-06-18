import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function userQuery() {
  return request({
    url: '/user',
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}
export function updateUser(id) {
  return request({
    url: `/user/${id}`,
    method: 'put'
  })
}
export function delUser(id) {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
