import request from '@/utils/request'

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

export function run(imgUrl, type, modelId, userId) {
  return request({
    url: '/task/mbtq/run',
    method: 'post',
    data: { imgUrl, type, modelId, userId }
  })
}

export function runAll(imgList, type, modelId, userId) {
  return request({
    url: '/task/mbtq/runAll',
    method: 'post',
    data: { imgList, type, modelId, userId }
  })
}




