import axios from '@/libs/api.request'

export const getTableData = (data) => {
  return axios.request({
    method: 'GET',
    url: '/table/demo',
    params: data
  })
}
