import axios from '@/libs/api.request'

export const getaltasData = (entity) => {
  return axios.request({
    method: 'GET',
    url: 'editor/atlas',
    params: {
      entity
    }
  })
}
