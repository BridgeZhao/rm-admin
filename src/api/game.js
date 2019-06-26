import request from '@/utils/request'

export function addGame(data) {
  return request({
    url: '/mg/games',
    method: 'post',
    data
  })
}

export function delGame(id) {
  return request({
    url: `/mg/games/${id}`,
    method: 'delete'
  })
}

export function gameDetails(id) {
  return request({
    url: `/mg/games/${id}`,
    method: 'get',
  })
}
export function gamePage(data) {
  return request({
    url: '/mg/games',
    method: 'get',
		data
  })
}
export function channelGame(data) {
  return request({
    url: 'api/mg/channel_games',
    method: 'post',
    data
  })
}
export function delChannelGame (id) {
  return request({
    url: `/api/mg/channel_games/${id}`,
    method: 'delete'
  })
}

export function channelGameDetails (id) {
  return request({
    url: `/api/mg/channel_games/${id}`,
    method: 'get'
  })
}
export function channelGamePage (data) {
  return request({
    url: '/api/mg/channel_games',
    method: 'get',
		data
  })
}
export function byDeviceGame (device){
  return request ({
    url: `/api/mg/channel_games/by_device/${device.id}`,
    method: 'get',
    device
  })
}
export function DeviceNav (device){
  return request ({
    url: `/mg/nav_image/${device.id}`,
    method: 'get',
    device
  })
}