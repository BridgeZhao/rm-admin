import Vue from 'vue'
import i18n from './lang/i18n'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css
import './permission' // permission control
import permission from '@/directive/permission/permission.js' // 权限判断指令
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import moment from 'moment'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/effectScatter'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/legendScroll'
import themeDark from '@/components/Charts/theme/dark.json'
import rem from '@/rem'
const PC_DESIGN_SIZE = 2080
rem(PC_DESIGN_SIZE)
ECharts.registerTheme('dark', themeDark)
import '@/permission' // permission control
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
Vue.config.productionTip = false
Vue.component('v-chart', ECharts)
Vue.directive('permission', permission)

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
