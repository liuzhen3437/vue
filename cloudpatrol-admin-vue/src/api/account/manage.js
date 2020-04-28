import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/admin/list',
    method:'get',
    params:params
  })
}

export function create(data) {
  return request({
    url:'/admin/create',
    method:'post',
    data:data
  })
}

export function getList(id) {
  return request({
    url:'/admin/'+id,
    method:'get',
  })
}

export function update(id,data) {
  return request({
    url:'/admin/update/'+id,
    method:'post',
    data:data
  })
}


export function deleteBatch(data) {
    return request({
      url:'/admin/delete/batch',
      method:'post',
      data:data
    });
  }
	
	export function deleteLine(id,data) {
	  return request({
	    url:'/admin/delete/'+id,
	    method:'post',
		data:data
	  })
	}
	

  export function resetPassword(id) {
    return request({
      url:'/admin/resetPassword/'+id,
      method:'post',
    })
  }

  export function updateMyPassword(data) {
    return request({
      url:'/admin/updateMyPassword',
      method:'post',
			data:data
    })
  }

export function adminInfo(params) {
  return request({
    url:'/admin/info',
    method:'get',
    params:params
  })
}