import request from '@/utils/request'
export function eventList(params) {
  return request({
    url:'/event/list',
    method:'get',
    params:params
  })
}


export function create(data) {
  return request({
    url:'/event/create',
    method:'post',
    data:data
  })
}

export function update(id,data) {
  return request({
    url:'/event/update/'+id,
    method:'post',
    data:data
  })
}

export function getEven(id,data) {
  return request({
    url:'/event/'+id,
    method:'get',
  })
}

export function deleteEven(id,data) {
  return request({
    url:'/event/delete/'+id,
    method:'post',
    data:data
  })
}

export function deleteBatch(data) {
  return request({
    url:'/event/delete/batch',
    method:'post',
    data:data
  })
}

export function changeToTempCard(id,data) {
  return request({
    url:'/event/changeToTempCard/'+id,
    method:'post',
    data:data
  })
}

export function changeToTempCardBatch(data) {
  return request({
    url:'/event/changeToTempCard/batch',
    method:'post',
    data:data
  })
}

export function getCompanyList(params) {
  return request({
    url:'/company/list',
    method:'get',
    params:params
  })
}


//查询指定单位的事件列表
export function listByCompany(params) {
  return request({
    url:'/event/listByCompany/',
    method:'get',
    params:params
  })
}






