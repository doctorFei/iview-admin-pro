import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import flow from './modules/flow'
import user from './modules/user'
import permission from './modules/permission'
import tabNav from './modules/tabNav'

import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  state,
  mutations,
  actions,
  modules: {
    flow,
    permission,
    user,
    tabNav
  },
  plugins: process.env.NODE_ENV !== 'production'
    ? [createLogger()]
    : []
})
