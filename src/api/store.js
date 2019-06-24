import request from '@/utils/request'

export function getStores(params) {
  return request({
    url: '/auth/user-store',
    method: 'get',
    params
  })
}
export function getStoresImg(id) {
	return request({
		url: `/auth/user-store/${id}`,
		method: 'get',
	})
}
export function getAllStores(params) {
	return request({
		url: '/mg/stores',
		method: 'get',
		params
	})
}
export function delStore(id) {
  return request({
    url: `/mg/stores/${id}`,
    method: 'delete'
  })
}
export function getRegions() {
  return request({
    url: '/mg/regions',
    method: 'get'
  })
}
export function addUpdateStore(data) {
  return request({
    url: '/mg/stores',
    method: 'post',
    data
  })
}
