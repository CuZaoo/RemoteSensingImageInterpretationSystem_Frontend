import request from '@/utils/request'

export function recordPV(id) {
  return request({
    url: 'stat/updateStatCount',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function getStatCount(id) {
  return request({
    url: 'stat/getStatCount',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function getAllStatCount() {
  return request({
    url: 'stat/getAllStatCount',
    method: 'post'
  })
}

export function getAllStatCountOf7Day() {
  return request({
    url: 'stat/getAllTaskStatCountOf7Day',
    method: 'post'
  })
}

export function showLines(user) {
  return request({
    url: '/lines/showLines',
    method: 'post',
    data: user
  })
}

export function addLines(user, lines_type) {
  return request({
    url: '/lines/addLines',
    method: 'post',
    data: { user: user, linesType: lines_type }
  })
}

export function reduceLines(user, lines_type) {
  return request({
    url: '/lines/reduceLines',
    method: 'post',
    data: { user: user, linesType: lines_type }
  })
}

export function getModelByPage(page, size) {
  return request({
    url: '/model/getModelByPageAll',
    method: 'get',
    params: {
      page: page,
      size: size
    }
  })
}

export function uploadModel(model) {
  return request({
    url: '/model/uploadModel',
    method: 'post',
    data: model
  })
}

export function uploadPicture(img) {
  return request({
    url: 'api/localStorage/pictures',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: img
  })
}

export function deleteModel(modelId) {
  return request({
    url: '/model/deleteModel',
    method: 'post',
    params: { modelId: modelId }
  })
}
