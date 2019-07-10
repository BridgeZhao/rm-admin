<template>
  <div :class="{'has-logo':showLogo}" v-if="authRoutes.length>0">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
				:unique-opened="true"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="(route,index) in authRoutes" :key="index" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import {  checkPermission } from '@/utils/auth'
import variables from '@/styles/variables.scss'

export default {
  components: {SidebarItem, Logo},
  data() {
    return {
      authRoutes: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const {meta, path} = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    this.authRoutes = checkPermission('menus')
		console.log('~~~this.authRoutes~~~',this.authRoutes)
    if(!this.authRoutes.length){
			Message({
				message: '未分配菜单，请联系管理员',
				type: 'error',
				duration: 5 * 1000
			})
			this.$store.dispatch('user/logout').then(()=>{
				this.$router.push('/login')
			})
		}
  }
}
</script>
