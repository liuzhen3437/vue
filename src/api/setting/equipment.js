import request from '@/utils/request'
export function deviceEventList(params) {
  return request({
    url:'/device/list',
    method:'get',
    params:params
  })
}

export function create(data) {
  return request({
    url:'/device/create',
    method:'post',
    data:data
  })
}

export function update(id,data) {
  return request({
    url:'/device/update/'+id,
    method:'post',
    data:data
  })
}


export function getdeviceEvent(id) {
  return request({
    url:'/device/'+id,
    method:'get',
  })
}

export function deleteDeviceEvent(id,data) {
  return request({
    url:'/device/delete/'+id,
    method:'post',
	data:data
  })
}

export function deleteDeviceEventBatch(data) {
  return request({
    url:'/device/delete/batch',
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
