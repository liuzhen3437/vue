import request from '@/utils/request'


export function listHighrisk(params) {
  return request({
    url:'/report/listHighrisk',
    method:'get',
    params:params
  })
}

export function monthTotalDashboard(params) {
  return request({
    url:'/report/monthTotalDashboard',
    method:'get',
    params:params
  })
}

export function listTaskPoint(params) {
  return request({
    url:'/report/listTaskPoint',
    method:'get',
    params:params
  })
}

export function monthTotalDashboardCount(params) {
  return request({
    url:'/report/monthTotalDashboardCount',
    method:'get',
    params:params
  })
}
// export function fetchList(params) {
//   return request({
//     url:'/address/list',
//     method:'get',
//     params:params
//   })
// }
// 
// export function changeToTempCardBatch(data) {
//     return request({
//       url:'/address/changeToTempCard/batch',
//       method:'post',
//       data:data
//     });
//   }
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
// 
// export function Delete(id,data) {
//   return request({
//     url:'/address/delete/'+id,
//     method:'post',
//     data:data
//   })
// }
// 
// export function DeleteBatch(data) {
//   return request({
//     url:'/address/delete/batch',
//     method:'post',
//     data:data
//   })
// }
// 
// export function getCompanyList(params) {
//   return request({
//     url:'/company/list',
//     method:'get',
//     params:params
//   })
// }

