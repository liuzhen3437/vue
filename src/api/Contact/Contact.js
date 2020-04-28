import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/contact/list',
    method:'get',
    params:params
  })
}

export function create(data) {
  return request({
    url:'/contact/create',
    method:'post',
    data:data
  })
}

export function getList(id) {
  return request({
    url:'/contact/'+id,
    method:'get',
  })
}

export function update(id,data) {
  return request({
    url:'/contact/update/'+id,
    method:'post',
    data:data
  })
}


export function deleteBatch(data) {
    return request({
      url:'/contact/delete/batch',
      method:'post',
      data:data
    });
  }

  export function deleteLine(id) {
    return request({
      url:'/contact/delete/'+id,
      method:'post',
    })
  }
