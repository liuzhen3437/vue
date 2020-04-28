import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/tempCard/list',
    method:'get',
    params:params
  })
}

export function deleteBatch(data) {
    return request({
      url:'/tempCard/delete/batch',
      method:'post',
      data:data
    });
  }



export function deleteTempCard(id) {
  return request({
    url:'/tempCard/delete/'+id,
    method:'post',
  })
}

export function changeToAddressBatch(data) {
  return request({
    url:'/tempCard/changeToAddress/batch',
    method:'post',
    data:data
  });
}

export function changeToAddress(id) {
    return request({
      url:'/tempCard/changeToAddress/'+id,
      method:'post',
    })
  }


	
	
	export function changeToInspectorBatch(data) {
	  return request({
	    url:'/tempCard/changeToInspector/batch',
	    method:'post',
	    data:data
	  });
	}
	
	export function changeToInspector(id) {
	    return request({
	      url:'/tempCard/changeToInspector/'+id,
	      method:'post',
	    })
	}
	
	
	export function changeToEventBatch(data) {
	  return request({
	    url:'/tempCard/changeToEvent/batch',
	    method:'post',
	    data:data
	  });
	}
	
	export function changeToEvent(id) {
	    return request({
	      url:'/tempCard/changeToEvent/'+id,
	      method:'post',
	    })
	}


