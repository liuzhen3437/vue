import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/notice/list',
    method:'get',
    params:params
  })
}

export function getAdminList(params) {
  return request({
    url:'/admin/list',
    method:'get',
    params:params
  })
}

export function companyList(params) {
  return request({
    url:'/company/list',
    method:'get',
    params:params
  })
}


export function noticeCreate(data) {
  return request({
    url:'/notice/create',
    method:'post',
    data:data
  })
}



export function getProduct(id,data) {
  return request({
    url:'/notice/'+id,
    method:'get',
  })
}

export function deleteNotice(id,data) {
  return request({
    url:'/notice/delete/'+id,
    method:'post',
    data:data
  })
}

export function deleteBatch(data) {
  return request({
    url:'/notice/delete/batch',
    method:'post',
    data:data
  })
}

export function updateProduct(id,data) {
  return request({
    url:'/notice/update/'+id,
    method:'post',
    data:data
  })
}


