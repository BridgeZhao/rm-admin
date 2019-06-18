import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/401'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
	{ path: '/',
		component: Layout,
		redirect: '/welcome',
		hidden: true ,
		children: [{
			path: '/welcome',
			name: 'welcome',
			component: () => import('@/views/welcome'),
			meta: { title: '欢迎页面'}
		}]
	},
  {
    path: '/store',
    name: 'store',
    component: Layout,
    meta: {
      title: '门店管理',
      icon: 'store'
    },
    children: [{
      path: 'list',
      name: 'store-list',
      component: () => import('@/views/store/index'),
      meta: { title: '门店列表', icon: 'list' }
    },{
      path: 'device',
      name: 'store-device',
      component: () => import('@/views/store/device'),
      meta: { title: '设备管理', icon: 'tree-table'}
    }]
  },
  {
    path: '/system',
    name: 'system',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'system'
    },
    children: [{
      path: 'menus',
      name: 'system-menus',
      component: () => import('@/views/system/menus'),
      meta: { title: '菜单管理'}
    },{
      path: 'roles',
      name: 'system-roles',
      component: () => import('@/views/system/roles'),
      meta: { title: '角色管理'}
    },{
      path: 'user',
      name: 'system-user',
      component: () => import('@/views/system/user'),
      meta: { title: '管理员管理'}
    }]
  },
  {
    path: '/member',
    name: 'member',
    component: Layout,
    meta: {
      title: '会员管理',
      icon: 'user'
    },
    children: [{
      path: 'virtual',
      name: 'member-virtual',
      component: () => import('@/views/member/virtual'),
      meta: { title: '虚拟会员'}
    },{
      path: 'register',
      name: 'member-register',
      component: () => import('@/views/member/register'),
      meta: { title: '注册会员'}
    }]
  },
  // 新增页面  chy
	{
		path: '/dashboard',
		name: 'dashboard',
		component: Layout,
		meta: {title: '统计报表', icon: 'dashboard'},
		children: [
			{
				path: 'real-time',
				name: 'dashboard-realTime',
				component: () => import('@/views/dashboard/realTime'),
				meta: {title: '实时客流统计'}
			},
			{
				path: 'in-store-flow',
				name: 'dashboard-inStoreFlow',
				component: () => import('@/views/dashboard/inStoreFlow'),
				meta: {title: '进店客流统计'}
			},
			{
				path: 'week-flow',
				name: 'dashboard-weekFlow',
				component: () => import('@/views/dashboard/weekFlow'),
				meta: {title: '周时段客流统计'}
			},
			{
				path: 'store-flow',
				name: 'dashboard-storeFlow',
				component: () => import('@/views/dashboard/storeFlow'),
				meta: {title: '门店客流分析'}
			},
			{
				path: 'heatMap',
				name: 'dashboard-heatMap',
				component: () => import('@/views/dashboard/heatMap'),
				meta: {title: '区域热力图'}
			},
			{
				path: '/dashboard/tv-show',
				name: 'dashboard-tvShow',
				component: () => import('@/views/dashboard/tvShow'),
				meta: {title: '智能客流演示4K屏'}
			}
		]
	},
	// 优惠券管理 chy
	{
		path: '/coupons',
		name: 'coupons',
		component: Layout,
		meta: {
			title: '优惠券管理',
			icon: 'form'
		},
		children: [{
			path: 'config',
			name: 'coupons-config',
			component: () => import('@/views/coupons/config'),
			meta: {title: '优惠券管理'}
		},{
			path: 'config',
			name: 'coupons-logs',
			component: () => import('@/views/coupons/config'),
			meta: {title: '发放记录'}
		}]
	}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
