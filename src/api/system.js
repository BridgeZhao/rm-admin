import request from '@/utils/request'

export function getMenus() {
  return request({
    url: '/auth/user-menus',
    method: 'get'
  })
}
export function addUpdateMenu(data) {
  return request({
    url: '/auth/menus',
    method: 'put',
    data
  })
}
export function deleteMenu(data) {
  return request({
    url: '/auth/menus',
    method: 'delete',
    data
  })
}

export function addRoles( data) {
  return request({
    url: '/auth/role',
    method: 'post',
    data
  })
}
export function getAllRoles() {
  return request({
    url: '/auth/role',
    method: 'get'
  })
}
export function delRole(id) {
  return request({
    url: `/auth/role/${id}`,
    method: 'delete'
  })
}
export function getRolesID(id) {
  return request({
    url: `/auth/role/${id}`,
    method: 'get'
  })
}
export function updateRole(data) {
  return request({
    url: '/auth/role',
    method: 'put',
    data
  })
}

