import Vue from 'vue'
import i18n from './lang/i18n'
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css
import '@/permission' // 路由权限判断
import '@/icons' // icon
import permission from './directive/permission/permission.js' // 按钮权限判断指令
import drag from './directive/el-drag-dialog/drag.js' // 权限判断指令
import waves from './directive/waves/waves.js' // 权限判断指令
import App from './App'
import store from './store'
import router from './router'
import moment from 'moment'
import ECharts from 'vue-echarts'
import themeDark from '@/components/Charts/theme/dark.json'
ECharts.registerTheme('dark', themeDark)
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})
Vue.config.productionTip = false
Vue.component('v-chart', ECharts)
Vue.directive('permission', permission)
Vue.directive('drag-dialog', drag)
Vue.directive('waves', waves)

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
