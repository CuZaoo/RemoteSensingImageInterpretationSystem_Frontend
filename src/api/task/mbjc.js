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

export function getModelByPage(type,page, size) {
  return request({
    url: '/model/getModelByPage',
    method: 'get',
    params: { type:type,page: page,
      size: size }
  })
}

export function run(imgUrl,type,modelId,userId) {
  return request({
    url: '/task/mbjc/run',
    method: 'post',
    data: {imgUrl,type,modelId,userId}
  })
}

export function runAll(imgList,type,modelId,userId){
  return request({
    url:'/task/mbjc/runAll',
    method:"post",
    data:{imgList,type,modelId,userId}
  })
}




