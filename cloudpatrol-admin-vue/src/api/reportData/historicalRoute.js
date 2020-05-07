import request from '@/utils/request'

export function taskTrackList(params) {
  return request({
    url:'/taskTrack/list',
    method:'get',
    params:params
  })
}

export function lastPoint(params) {
  return request({
    url:'/taskTrack/lastPoint',
    method:'get',
    params:params
  })
}
