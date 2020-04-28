import request from '@/utils/request'
//查询已关联列表
export function listByCompany(params) {
  return request({
    url:'/lineAddress/listChecked',
    method:'get',
    params:params
  })
}


//查询未关联列表
export function listUnchecked(params) {
  return request({
    url:'/lineAddress/listUnchecked',
    method:'get',
    params:params
  })
}

//批量创建地点绑定事件
export function lineAddressEventCreateBatch(data) {
  return request({
    url:'/lineAddress/create/batch',
    method:'post',
    data:data
  })
}


export function deleteAddressEvent(id,data) {
  return request({
    url:'/lineAddress/delete/'+id,
    method:'post',
    data:data
  })
}


export function deleteBatch(data) {
  return request({
    url:'/lineAddress/delete/batch',
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


