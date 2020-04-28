import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/notice/listMyNotice',
    method:'get',
    params:params
  })
}


export function seen(id) {
  return request({
    url:'/notice/seen/'+id,
    method:'post'
  })
}


