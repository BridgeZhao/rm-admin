import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function userQuery(params) {
  return request({
    url: '/auth/user',
    method: 'get',
		params
  })
}

export function addUser(data) {
  return request({
    url: '/auth/user',
    method: 'post',
    data
  })
}
export function updateUser(data) {
  return request({
    url: `/auth/user/${data.id}`,
    method: 'put',
		data
  })
}
export function delUser(id) {
  return request({
    url: `/auth/user/${id}`,
    method: 'delete'
  })
}

export function logout() {
  return request({
		url: '/mg/regions',
		method: 'get'
  })
}

export function changePassword(data) {
  return request({
		url: `/auth/user/password/${data.id}`,
		method: 'put',
    data
  })
}

// export function detailUser(params) {
//   return request({
// 		url: '/auth/user/profile',
// 		method: 'get',
//     params
//   })
// }


