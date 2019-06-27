import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken, setMenus } from '@/utils/auth'
import { getMenus } from '@/api/system'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const state = {
  token: getToken(),
  name: Cookies.get('name') ? Cookies.get('name') : '',
  menus: setMenus()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
		setToken(token)
  },
  SET_NAME: (state, name) => {
    state.name = name
		Cookies.set('name', name)
  },
  SET_MENUS: (state, meuns) => {
    state.menus = meuns
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { token } = response
        commit('SET_NAME', username)
        commit('SET_TOKEN', token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user menus
  getMenus({ commit }) {
    return new Promise((resolve, reject) => {
      getMenus().then(response => {
        commit('SET_MENUS', response)
        setMenus(response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

