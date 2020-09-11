import axios from '@/libs/api.request'

export const getChart = () => {
  return axios.request({
    method: 'GET',
    url: 'dashboard/chart'
  })
}
