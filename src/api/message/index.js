import request from '@/utils/request'

// 获取message的总数
export function getMessageSize() {
  console.log("留言api")
  return request({
    url: 'message/getMessageSize',
    method: 'get'
  })
}
// 获取7日留言数量
export function getMessageOf7Day() {
  return request({
    url: 'message/getMessageOf7Day',
    method: 'get'
  })
}
// 保存留言
export function saveMessage(data) {
  return request({
    url: 'message/saveMessage',
    method: 'post',
    data
  })
}
// 随机获取10条留言
export function getSomeMessage() {
  return request({
    url: 'message/getSomeMessage',
    method: 'get'
  })
}
// 分页获取10条留言
export function getNewMessage(page, size) {
  return request({
    url: 'message/getNewMessage',
    method: 'get',
    params: {
      page: page,
      size: size
    }
  })
}

export function getPCV() {
  return request({
    url: 'message/getPsv',
    method: 'get'
  })
}
export default {
  getMessageSize,
  getMessageOf7Day,
  saveMessage,
  getSomeMessage,
  getNewMessage
}
