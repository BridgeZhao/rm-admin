import Cookies from 'js-cookie'
import { getStores } from '@/api/store'
const _storeList=()=>{
  let s=[]
  try{
    s=JSON.parse(sessionStorage.getItem('storeList'))
  }catch (e) {
    sessionStorage.setItem('storeList','[]')
  }
  return s
}
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  storeId: ~~Cookies.get('storeId') || 0,
  storeList:_storeList(),
  lang: Cookies.get('lang') || 'zh',
  device: 'desktop'
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  TOGGLE_LANG: state => {
    if (state.lang === 'zh') {
      Cookies.set('lang', 'en')
      state.lang = 'en'
    } else {
      Cookies.set('lang', 'zh')
      state.lang = 'zh'
    }
  },
  SET_STOREID:(state, storeId) => {
    state.storeId = ~~storeId
    Cookies.set('storeId',storeId)
  },
  STORELIST:(state, storeData) => {
    state.storeList = storeData
    sessionStorage.setItem('storeList',JSON.stringify(storeData))
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  storeList({ commit },storeData) {
    commit('STORELIST',storeData)
  },
	getStoreId({ commit }) {
		return new Promise((resolve, reject) => {
			getStores().then(data => {
				if (data.length) {
					let _storeId=~~Cookies.get('storeId')
					if(!_storeId){
						_storeId=data[0].id
						Cookies.set('storeId',_storeId)
					}
					commit('SET_STOREID',  _storeId)
					commit('STORELIST',  data)
				}
				resolve(data)
			}).catch((error)=>{
				reject(error)
			})
		})
	},
	setStoreId({ commit },storeId) {
    commit('SET_STOREID',storeId)
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  toggleLang({ commit }, device) {
    commit('TOGGLE_LANG', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
