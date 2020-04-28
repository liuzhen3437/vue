import request from '@/utils/request'
//查询已关联列表
export function listChecked(params) {
  return request({
    url:'/planInspector/listChecked',
    method:'get',
    params:params
  })
}


//查询未关联列表
export function listUnchecked(params) {
  return request({
    url:'/planInspector/listUnchecked',
    method:'get',
    params:params
  })
}
// 
//批量创建地点绑定事件
export function lineAddressEventCreateBatch(data) {
  return request({
    url:'/planInspector/create/batch',
    method:'post',
    data:data
  })
}
// 
// 
export function deleteAddressEvent(id,data) {
  return request({
    url:'/planInspector/delete/'+id,
    method:'post',
    data:data
  })
}
// 
// 
export function deleteBatch(data) {
  return request({
    url:'/planInspector/delete/batch',
    method:'post',
    data:data
  })
}
// 
// 


