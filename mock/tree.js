const Mock = require('mockjs')
const doCustomTimes = (timeNum, callback) => {
  while (timeNum--) {
    callback()
  }
}

export default [
  {
    url: '/tree/getFolderList',
    type: 'get',
    response: req => {
      const template1 = {
        'name|1': '@word',
        creat_time: '@datetime',
        folder_id: 0,
        'id|+1': 1
      }
      const template2 = {
        'name|1': '@word',
        creat_time: '@datetime',
        'folder_id|+1': 1,
        'id|+1': 4
      }
      const arr = []
      doCustomTimes(3, () => {
        arr.push(Mock.mock(template1))
      })
      doCustomTimes(2, () => {
        arr.push(Mock.mock(template2))
      })
      return {
        success: true,
        errorCode: '000000',
        errorMessage: null,
        data: arr
      }
    }
  },
  {
    url: '/tree/getFileList',
    type: 'get',
    response: req => {
      const template = {
        'name|5': '@cword',
        creat_time: '@datetime',
        'folder_id|1-5': 0,
        'id|+1': 10000
      }
      const arr = []
      doCustomTimes(10, () => {
        arr.push(Mock.mock(template))
      })
      return {
        success: true,
        errorCode: '000000',
        errorMessage: null,
        data: arr
      }
    }
  }
]
