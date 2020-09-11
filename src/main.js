import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import '@/assets/style/main.less'

import IconFont from '_c/IconFont'
import IconSvg from '_c/IconSvg'

Vue.use(ViewUI)
Vue.component('IconFont', IconFont)
Vue.component('IconSvg', IconSvg)

Vue.config.productionTip = false

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
