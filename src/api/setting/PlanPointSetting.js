import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/planAddress/list',
    method:'get',
    params:params
  })
}

export function getPlanAddress(id) {
  return request({
    url:'/planAddress/'+id,
    method:'get',
  })
}

export function planAddressUpdate(id,data) {
  return request({
    url:'/planAddress/update/'+id,
    method:'post',
    data:data
  })
}

// export function planCreate(data) {
//   return request({
//     url:'/plan/create',
//     method:'post',
//     data:data
//   })
// }
// 
// 

// 

// 
// 
// export function deletePlan(id) {
//   return request({
//     url:'/plan/delete/'+id,
//     method:'post',
//   })
// }
// 
// 
// export function deleteBatch(data) {
//     return request({
//       url:'/plan/delete/batch',
//       method:'post',
//       data:data
//     });
// }
// 
// export function updatePlan(id,data) {
//   return request({
//     url:'/plan/update/'+id,
//     method:'post',
//     data:data
//   })
// }

