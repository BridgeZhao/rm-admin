<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar ref="refbar" @storeIdChange="emitChildData" />
      </div>
      <app-main ref="childs" @updateStoreList="emitUpdateStoreList" />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
    	console.log(this.$store.state.app.sidebar)
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
		smallRatio(){
    	console.log(document.body.offsetWidth,document.body.offsetWidth<1600)
			return document.body.offsetWidth<1600
		},
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
	created(){
  	if(this.smallRatio){
			this.$store.dispatch('app/toggleSideBar')
		}
	},
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
    },
    emitChildData(storeId) {
      const refs = this.$refs.childs.$children
      if (refs.length > 0 && refs[0].$storeIdChanged) {
        console.warn('头部storeId更改')
        this.$refs.childs.$children[0].$storeIdChanged(storeId)
      }
    },
		emitUpdateStoreList(){
			const refs = this.$refs.refbar.updateStoreList
			if (refs) {
				console.warn('头部StoreList更改')
				refs()
			}
		}
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
