import request from '@/utils/request'

export function addAd(data) {
  return request({
    url: '/mg/ads',
    method: 'post',
    data
  })
}

export function statusAd(data) {
  return request({
    url: '/mg/ads/status',
    method: 'put',
    data
  })
}

export function delAd(id) {
  return request({
    url: `/mg/ads/${id}`,
    method: 'delete',
  })
}
export function adPage(params) {
  return request({
    url: '/mg/ads',
    method: 'get',
    params
  })
}

export function deviceAd (id) {
  return request({
    url: `/mg/ads/by_device/${id}`,
    method: 'get'
  })
}

export function detailAd (id){
  return request({
    url: `/mg/ads/${id}`,
    method: 'get'
  })
}