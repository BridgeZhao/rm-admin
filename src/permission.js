import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken , checkRoutePermission } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login','/404','/401','/coupons/record','/week-flow-pad','/real-time-pad','/in-store-flow-pad','/changePassword'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/'})
      NProgress.done()
    } else {
      if (whiteList.indexOf(to.path) !== -1||to.path==='/welcome') {
        next()
      } else {
        // 权限控制
        const has_auth = checkRoutePermission(to.name)
        console.log('权限控制--',has_auth)
        console.log('权限控制-path-',to.path)
        if (has_auth) {
          next()
        } else {
          console.warn('无权访问')
          next({path: '/401'})
        }
      }
    }
  }else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
