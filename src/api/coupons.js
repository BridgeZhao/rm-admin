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
// 导入优惠券
export function postCouponsData(data) {
	return request({
		url: '/mg/coupons',
		method: 'post',
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		data
	})
}
// 更新优惠券状态
export function changeCouponsStatus(params) {
	return request({
		url: '/mg/coupons/status',
		method: 'put',
		params
	})
}
// 删除优惠券
export function deleteCouponsList(params) {
	return request({
		url: '/mg/coupons',
		method: 'delete',
		params
	})
}
// 查看记录
export function searchRecord(params) {
	return request({
		url: '/mg/coupons_log',
		method: 'get',
		params
	})
}
// 优惠券关联 -查询列表
export function searchConnection(params) {
	return request({
		url: '/mg/scenario_coupons',
		method: 'get',
		params
	})
}
