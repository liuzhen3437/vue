import request from '@/utils/request'
export function inspectorList(params) {
  return request({
    url:'/inspector/list',
    method:'get',
    params:params
  })
}

export function create(data) {
  return request({
    url:'/inspector/create',
    method:'post',
    data:data
  })
}

export function DeleteSingle(id,data) {
  return request({
    url:'/inspector/delete/'+id,
    method:'post',
    data:data
  })
}

export function deleteBatch(data) {
  return request({
    url:'/inspector/delete/batch',
    method:'post',
    data:data
  })
}

export function updateInspector(id,data) {
  return request({
    url:'/inspector/update/'+id,
    method:'post',
    data:data
  })
}

export function getInspector(id) {
  return request({
    url:'/inspector/'+id,
    method:'get',
  })
}

export function changeToTempCard(id) {
  return request({
    url:'/inspector/changeToTempCard/'+id,
    method:'post',
  })
}


export function changeToTempCardBatch(data) {
    return request({
      url:'/inspector/changeToTempCard/batch',
      method:'post',
      data:data
    });
}
export function getCompanyList(params) {
  return request({
    url:'/company/list',
    method:'get',
    params:params
  })
}
// 
// export function changeToTempCard(id) {
//   return request({
//     url:'/address/changeToTempCard/'+id,
//     method:'post',
//   })
// }
// 
// export function getAddress(id) {
//   return request({
//     url:'/address/'+id,
//     method:'get',
//   })
// }
// 
// export function updateAddress(id,data) {
//   return request({
//     url:'/address/update/'+id,
//     method:'post',
//     data:data
//   })
// }
// 
// 
// export function create(data) {
//   return request({
//     url:'/address/create',
//     method:'post',
//     data:data
//   })
// }

