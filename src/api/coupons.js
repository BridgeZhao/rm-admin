import request from '@/utils/request'
// 获取列表
export function getCouponsData(params) {
	return request({
		url: '/mg/scenario',
		method: 'get',
		params
	})
}
// 查询列表
export function searchCouponsData(id) {
	return request({
		url: `/mg/scenario/${id}`,
		method: 'get'
	})
}
// 编辑列表内容
export function setCouponsData(data) {
	return request({
		url: '/mg/scenario',
		method: 'post',
		data
	})
}
// 删除场景
export function delCouponsData(id) {
	return request({
		url: `/mg/scenario/${id}`,
		method: 'delete'
	})
}
