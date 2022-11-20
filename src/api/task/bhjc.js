import request from '@/utils/request'

export function recordPV(titleName) {
  return request({
    url: 'api/record',
    method: 'post',
    data: {
      titleName: titleName
    }
  })
}

export function getModelByPage(type, page, size) {
  return request({
    url: '/model/getModelByPage',
    method: 'get',
    params: {
      type: type, page: page,
      size: size
    }
  })
}

export function run(img1Url, img2Url, type, modelId, userId) {
  return request({
    url: '/task/bhjc/run',
    method: 'post',
    data: { img1Url, img2Url, type, modelId, userId }
  })
}

export function runAll(imgList, type, modelId, userId) {
  return request({
    url: '/task/bhjc/runAll',
    method: 'post',
    data: { imgList, type, modelId, userId }
  })
}
