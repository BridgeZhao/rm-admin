import request from '@/utils/request'

export function getDevices(storeId) {
  return request({
    url: `/mg/devices?storeId=${storeId}`,
    method: 'get'
  })
}
export function getDeviceInfo(id) {
  return request({
    url: `/mg/devices/${id}`,
    method: 'get'
  })
}
export function delDevice(id) {
  return request({
    url: `/mg/devices/${id}`,
    method: 'delete'
  })
}
export function getRegions() {
  return request({
    url: '/mg/regions',
    method: 'get'
  })
}
export function addUpdateDevice(data) {
  return request({
    url: '/mg/devices',
    method: 'post',
    data
  })
}
