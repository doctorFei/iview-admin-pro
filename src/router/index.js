import Vue from 'vue'
import VueRouter from 'vue-router'
import { constantRoutes } from './router'
import { LoadingBar, Message } from 'view-design'
import store from '@/store'
import { getToken } from '@/libs/auth'

Vue.use(VueRouter)

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

const router = new VueRouter({
  routes: constantRoutes
})

// 禁止全局路由错误处理打印
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

router.beforeEach(async (to, from, next) => {
  LoadingBar.start()
  const hasToken = getToken() // or get user detail
  if (hasToken) {
    if (to.path === 'login') {
      // 已登录，直接到主页
      next({ path: '/' })
      LoadingBar.finish()
    } else {
      try {
        // 确定用户是否通过getInfo获得了他的权限角色
        const hasRoles = store.state.user.roles && store.state.user.roles.length > 0
        if (hasRoles) {
          next()
        } else {
          const { roles } = await store.dispatch('getInfo') // 获取身份
          // 根据角色生成可访问的路由映射
          const accessedRoutes = await store.dispatch('generateRoutes', roles)
          // 动态添加可访问路由
          router.addRoutes(accessedRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true }) // 注：只将动态路由加载后的next方法，进行改变，如果全部改变，将进入到死循环
        }
      } catch (error) {
        await store.dispatch('resetToken')
        Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        LoadingBar.finish()
      }
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      LoadingBar.finish()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  LoadingBar.finish()
})

export default router
