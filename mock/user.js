const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { userName } = config.body
      const token = tokens[userName]

      // mock error
      if (!token) {
        return {
          success: false,
          errorCode: '60204',
          errorMessage: '账号或密码失败',
          data: token
        }
      }
      return {
        success: true,
        errorCode: '000000',
        errorMessage: null,
        data: token
      }
    }
  },
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]
      // mock error
      if (!info) {
        return {
          success: false,
          errorCode: '50008',
          errorMessage: 'Login failed, unable to get user details.',
          data: null
        }
      }
      return {
        success: true,
        errorCode: '000000',
        errorMessage: null,
        data: info
      }
    }
  }
]
