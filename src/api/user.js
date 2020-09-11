import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  return axios.request({
    method: 'POST',
    url: 'user/login',
    data: {
      userName,
      password
    }
  })
}

export const getInfo = (token) => {
  return axios.request({
    method: 'GET',
    url: 'user/info',
    params: {
      token
    }
  })
}
