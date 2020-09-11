const Mock = require('mockjs')

export default [
  {
    url: '/table/demo',
    type: 'get',
    response: req => {
      return {
        success: true,
        errorCode: '000000',
        errorMessage: null,
        data: Mock.mock({
          'content|10': [
            {
              account: '@first',
              userName: '@cname',
              userId: '@integer',
              id: '@integer'
            }
          ],
          currentPage: req.query.pageIndex,
          totalPages: 5,
          totalNumbers: 50
        })
      }
    }
  }
]
