import request from '@/utils/request'
// 实时客流 、进店客流
export function getRealTimeData(params) {
  return request({
    url: '/mg/dashboard/camera',
    method: 'get',
    params
  })
}
//周时段客流统计
export function getWeekFlowData(params) {
    return request({
      url: '/mg/dashboard/weekflow',
      method: 'get',
      params
    })
  }

  //门店客流统计
  export function getStoreFlowData(params) {
    return request({
      url: '/mg/dashboard/faceidFlow',
      method: 'get',
      params
    })
  }
  //客流热力图
  export function getAreaHotData(params) {
    return request({
      url: '/mg/dashboard/heatmap',
      method: 'get',
      params
    })
  }
  export function getDurationData(params) {
    return request({
      url: '/mg/dashboard/duration',
      method: 'get',
      params
    })
  }

//4K屏幕图片
export function getImageData(params) {
    return request({
      url: '/backend/camera/entries',
      method: 'get',
      params
    })
}
export function getPinData(params) {
  return request({
    url: '/mg/dashboard/supermonitor',
    method: 'get',
    params
  })
}
// http://172.16.2.182:8000/api/mg/dashboard/supermonitor?store_id=test0523

