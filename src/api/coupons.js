import request from '@/utils/request'
// 获取列表
export function getScenarioData(params) {
	return request({
		url: '/mg/scenario',
		method: 'get',
		params
	})
}
// 查询列表
export function searchScenarioData(id) {
	return request({
		url: `/mg/scenario/${id}`,
		method: 'get'
	})
}
// 编辑列表内容
export function setScenarioData(data) {
	return request({
		url: '/mg/scenario',
		method: 'post',
		data
	})
}
// 删除场景
export function delScenarioData(id) {
	return request({
		url: `/mg/scenario/${id}`,
		method: 'delete'
	})
}
// 获取优惠券列表
export function getCouponsList(params) {
	return request({
		url: '/mg/coupons',
		method: 'get',
		params
	})
}

