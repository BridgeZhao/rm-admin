import Cookies from 'js-cookie'
import store from '@/store'
import router from '../router'
const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setMenus(menus) {
  return menus ? sessionStorage.setItem('menus', JSON.stringify(menus)) : JSON.parse(sessionStorage.getItem('menus') || '{}')
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function checkRoutePermission(path) {
  const roles = store.getters && store.getters.menus
  return JSON.stringify(roles).indexOf(path)!==-1
}
export function checkPermissionButton(pathname,btnType){
  const roles = store.getters && store.getters.menus
  const hasRole=roles.find(item=>{
    return item.name===pathname
  })
  // console.log('~~hasRolehasRole~~',hasRole.buttons[btnType])
  return hasRole.buttons[btnType]
}
export function checkPermission() {
	const name = store.getters && store.getters.name
  const roles = store.getters && store.getters.menus
	const route_filter = []
	if(roles instanceof Array&&name) {
		roles.push({name: 'welcome', parentId: 0, title: ''})
		const routes = router.options.routes
		let route_obj = {}
		for (let i = 0; i < routes.length; i++) {
			if (routes[i].hasOwnProperty('hidden')) {
				continue
			}
			if (routes[i].hasOwnProperty('redirect')) {
				const obj = roles.find(item => {
					return item.name === routes[i].children[0].name
				})
				if (obj) {
					routes[i].children[0].meta.title = obj.title
					route_filter.push(Object.assign({}, routes[i]))
				}
			} else {
				route_obj = Object.assign({}, routes[i])
				route_obj.children = []
				for (let f = 0; f < routes[i].children.length; f++) {
					for (let n = 0; n < roles.length; n++) {
						const routeName=routes[i].children[f].name
						// if (routeName === 'store-list'||routeName === 'system-list' && name !== 'admin') {
						// 	continue
						// }
						if (roles[n].name === routeName && roles[n].parentId !== 0) {
							routes[i].children[f].meta.title = roles[n].title
							route_obj.children.push(routes[i].children[f])
						}
					}
				}
				if (route_obj.children.length) {
					route_filter.push(route_obj)
				}
			}
		}
	}
  return route_filter
}
