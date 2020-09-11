import axios from 'axios'
import { Message, Modal } from 'view-design'
import { getToken } from '@/libs/auth'
import store from '@/store'

// import { Spin } from 'iview'

class HttpRequest {
  constructor (baseUrl = '/') {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      // withCredentials: true, // send cookies when cross-domain requests
      timeout: 5000, // request timeout
      headers: {
        //
      }
    }
    return config
  }

  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      if (getToken()) {
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        config.headers['X-Token'] = getToken()
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(response => {
      this.destroy(url)
      const res = response.data

      if (res.errorCode !== '000000') {
        Message.error(res.errorMessage)
        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.errorCode === '50008' || res.errorCode === '50012' || res.errorCode === '50014') {
          Modal.confirm({
            title: '提醒',
            content: '<p>您已经登出，您可以取消以停留在此页面，或再次登录</p>',
            onOk: () => {
              store.dispatch('resetToken').then(() => {
                location.reload()
              })
            }
          })
        }
        return Promise.reject(new Error(res.errorMessage || '请求失败'))
      } else {
        return res // you can also return res.data
      }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        if (error.message.includes('timeout')) {
          Message.error('请求超时，请检查网络是否连接正常')
        } else {
          errorInfo = {
            statusText,
            status,
            request: { responseURL: config.url }
          }
          Message.error(errorInfo.statusText)
        }
      }
      return Promise.reject(error)
    })
  }

  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
