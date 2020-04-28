import request from '@/utils/request'
//图表对比-汇总地点
export function chartTotalAddress(params) {
  return request({
    url:'/report/chartTotalAddress',
    method:'get',
    params:params
  })
}

//图表对比-汇总设备
export function chartTotalDevice(params) {
  return request({
    url:'/report/chartTotalDevice',
    method:'get',
    params:params
  })
}


//图表对比-汇总人员
export function chartTotalInspector(params) {
  return request({
    url:'/report/chartTotalInspector',
    method:'get',
    params:params
  })
}


//图表对比-汇总线路
export function chartTotalLine(params) {
  return request({
    url:'/report/chartTotalLine',
    method:'get',
    params:params
  })
}


