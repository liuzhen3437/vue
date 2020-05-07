import request from '@/utils/request'
//查询考核列表
export function listTaskPoint(params) {
  return request({
    url:'/report/listTaskPoint',
    method:'get',
    params:params
  })
}


//查询考核列表汇总
export function listTaskPointTotal(params) {
  return request({
    url:'/report/listTaskPointTotal',
    method:'get',
    params:params
  })
}