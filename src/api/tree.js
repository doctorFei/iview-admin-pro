import axios from '@/libs/api.request'

export const getFolderList = () => {
  return axios.request({
    url: '/tree/getFolderList',
    method: 'get'
  })
}

export const getFileList = () => {
  return axios.request({
    url: '/tree/getFileList',
    method: 'get'
  })
}
