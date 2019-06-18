import request from '@/utils/request'

export function getAreas(storeId) {
  return request({
    url: `/mg/areas?storeId=${storeId}`,
    method: 'get'
  })
}
export function addUpdateArea(data) {
  return request({
    url: '/mg/areas',
    method: 'post',
    data
  })
}
export function deleteArea(id) {
  return request({
    url: `/mg/areas/${id}`,
    method: 'delete'
  })
}
