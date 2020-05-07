import request from '@/utils/request'
//查询考核列表
export function listRecord(params) {
  return request({
    url:'/report/listRecord',
    method:'get',
    params:params
  })
}



//获取指定记录的事件列表
export function listEvent(params) {
  return request({
    url:'/record/listEvent',
    method:'get',
    params:params
  })
}


//获取指定记录的附件列表
export function listAttachment(params) {
  return request({
    url:'/record/listAttachment',
    method:'get',
    params:params
  })
}
