import request from '@/utils/request'
//查询已关联列表
export function listByCompany(params) {
  return request({
    url:'/addressEvent/listChecked',
    method:'get',
    params:params
  })
}


//查询未关联列表
export function listUnchecked(params) {
  return request({
    url:'/addressEvent/listUnchecked',
    method:'get',
    params:params
  })
}

//批量创建地点绑定事件
export function addressEventCreateBatch(data) {
  return request({
    url:'/addressEvent/create/batch/',
    method:'post',
    data:data
  })
}


export function deleteAddressEvent(id,data) {
  return request({
    url:'/addressEvent/delete/'+id,
    method:'post',
    data:data
  })
}


export function deleteBatch(data) {
  return request({
    url:'/addressEvent/delete/batch',
    method:'post',
    data:data
  })
}


export function overwrite(data) {
  return request({
    url:'/addressEvent/overwrite/',
    method:'post',
    data:data
  })
}


