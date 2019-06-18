import request from '@/utils/request'

export function getVirtualMember(params) {
  return request({
    url: '/mg/virtual_members',
    method: 'get',
    params
  })
}
export function getRegisterMember(params) {
  return request({
    url: '/mg/members',
    method: 'get',
    params
  })
}
