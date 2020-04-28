import request from '@/utils/request'
//查询考核列表
export function listRecordEvent(params) {
  return request({
    url:'/report/listRecordEvent',
    method:'get',
    params:params
  })
}




