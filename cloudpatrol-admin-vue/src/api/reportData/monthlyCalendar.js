import request from '@/utils/request'
//月历报表-汇总单位
export function monthTotalCompany(params) {
  return request({
    url:'/report/monthTotalCompany',
    method:'get',
    params:params
  })
}

//月历报表-汇总线路
export function monthTotalLine(params) {
  return request({
    url:'/report/monthTotalLine',
    method:'get',
    params:params
  })
}


