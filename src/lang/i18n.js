import Vue from 'vue'
import Element from 'element-ui'
import VueI18n from 'vue-i18n'
import store from '../store'
import zh from './zh'
import en from './en'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

const messages = {
  en: Object.assign(en, enLocale),
  zh: Object.assign(zh, zhLocale)
}
console.log(messages.zh)
const i18n = new VueI18n({
  locale: store.getters.lang,
  messages
})

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
export default i18n
