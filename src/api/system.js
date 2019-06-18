import request from '@/utils/request'

export function getMenus() {
  return request({
    url: '/user-menus',
    method: 'get'
  })
}
export function addUpdateMenu(data) {
  return request({
    url: '/menus',
    method: 'put',
    data
  })
}
export function deleteMenu(data) {
  return request({
    url: '/menus',
    method: 'delete',
    data
  })
}

export function addRoles( data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}
export function getAllRoles() {
  return request({
    url: '/role',
    method: 'get'
  })
}
export function delRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}
export function getRolesID(id) {
  return request({
    url: `/role/${id}`,
    method: 'get'
  })
}
export function updateRole(data) {
  return request({
    url: '/role',
    method: 'put',
    data
  })
}

