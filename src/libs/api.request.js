import HttpRequest from './axios'

export default new HttpRequest(process.env.VUE_APP_BASE_API)
