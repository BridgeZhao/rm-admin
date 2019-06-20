import router from '@/router'
import { checkPermissionButton } from '@/utils/auth'

export default {
  inserted(el, binding, vnode) {
    const {value} = binding
    const path_name = router.app.$route.name
    const page_role = checkPermissionButton(path_name, value)
    // console.log(value+'按钮权限', page_role)
    if (page_role) {
      return el
    } else {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
