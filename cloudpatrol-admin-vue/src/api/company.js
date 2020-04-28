import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/company/list',
    method:'get',
    params:params
  })
}

export function deleteBatch(data) {
    return request({
      url:'/company/delete/batch',
      method:'post',
      data:data
    });
  }


export function createCompany(data) {
  return request({
    url:'/company/create',
    method:'post',
    data:data
  })
}


export function deleteCompany(id) {
  return request({
    url:'/company/delete/'+id,
    method:'post',
  })
}

export function getCompany(id) {
  return request({
    url:'/company/'+id,
    method:'get',
  })
}

export function updateCompany(id,data) {
  return request({
    url:'/company/update/'+id,
    method:'post',
    data:data
  })
}

