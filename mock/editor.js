const axios = require('axios')
export default [
  {
    url: '/editor/atlas',
    type: 'get',
    response: async req => {
      const entity = req.query.entity ? req.query.entity : '刘德华'
      const res = await axios({
        url: `https://api.ownthink.com/kg/knowledge?entity=${encodeURIComponent(entity)}`
      })
      if (!res.data.data.avp) {
        return {
          success: true,
          errorCode: '000000',
          errorMessage: null,
          data: {
            nodes: [],
            links: []
          }
        }
      }
      // 改造数据
      const links = res.data.data.avp.map((item) => {
        return {
          source: res.data.data.entity,
          target: item[1],
          value: item[0]
        }
      })

      const nodes = res.data.data.avp.map((item) => {
        return {
          id: item[1],
          group: parseInt(Math.random() * 10)
        }
      })
      nodes.unshift({
        id: res.data.data.entity,
        group: -1
      })
      return {
        success: true,
        errorCode: '000000',
        errorMessage: null,
        data: {
          nodes,
          links
        }
      }
    }
  }
]
