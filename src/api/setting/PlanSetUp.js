import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/plan/list',
    method:'get',
    params:params
  })
}
export function planCreate(data) {
  return request({
    url:'/plan/create',
    method:'post',
    data:data
  })
}


export function planupdate(id,data) {
  return request({
    url:'/plan/update/'+id,
    method:'post',
    data:data
  })
}

export function getPlan(id) {
  return request({
    url:'/plan/'+id,
    method:'get',
  })
}


export function deletePlan(id) {
  return request({
    url:'/plan/delete/'+id,
    method:'post',
  })
}


export function deleteBatch(data) {
    return request({
      url:'/plan/delete/batch',
      method:'post',
      data:data
    });
}

export function updatePlan(id,data) {
  return request({
    url:'/plan/update/'+id,
    method:'post',
    data:data
  })
}

export function updateTaskRound(id,data) {
  return request({
    url:'/plan/updateTaskRound/'+id,
    method:'post',
    data:data
  })
}
// 
// 
// 
// 
// 
// export function deleteLine(id) {
//   return request({
//     url:'/line/delete/'+id,
//     method:'post',
//   })
// }
// 
// export function getLine(id) {
//   return request({
//     url:'/line/'+id,
//     method:'get',
//   })
// }
// 
// export function updateLine(id,data) {
//   return request({
//     url:'/line/update/'+id,
//     method:'post',
//     data:data
//   })
// }
