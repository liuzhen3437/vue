import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/line/list',
    method:'get',
    params:params
  })
}

export function deleteBatch(data) {
    return request({
      url:'/line/delete/batch',
      method:'post',
      data:data
    });
  }


export function createLine(data) {
  return request({
    url:'/line/create',
    method:'post',
    data:data
  })
}


export function deleteLine(id) {
  return request({
    url:'/line/delete/'+id,
    method:'post',
  })
}

export function getLine(id) {
  return request({
    url:'/line/'+id,
    method:'get',
  })
}

export function updateLine(id,data) {
  return request({
    url:'/line/update/'+id,
    method:'post',
    data:data
  })
}
