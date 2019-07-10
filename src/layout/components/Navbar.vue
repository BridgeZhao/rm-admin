<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <div class="head-storelist">
        <svg-icon icon-class="store" />
      </div>
      <div class="head-storelist" v-if="storeList&&storeList.length">
        <el-select class="active" v-model="defaultStoreId" placeholder="请选择">
          <el-option
            v-for="item in storeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <el-dropdown class="avatar-container lang" trigger="click" @command="changeLang">
        <div class="avatar-wrapper">
          <svg-icon icon-class="language" />
          <span>{{ lang==='zh'?'中':'En' }}</span>
        </div>
        <el-dropdown-menu class="user-dropdown">
          <el-dropdown-item>
            {{ lang!=='zh'?'中':'En' }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <svg-icon icon-class="user" />
          <span>{{name}}</span>
        </div>
        <el-dropdown-menu class="user-dropdown">
					<el-dropdown-item>
            <span style="display:block;" @click="changePassword">
							{{ $t("menus.password") }}</span>
					</el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="logout">
							{{ $t("menus.loginout") }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <screenfull id="screenfull" class="right-menu-item hover-effect" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Screenfull from '@/components/Screenfull'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Screenfull,
    Hamburger
  },
  data() {
    return {
      pagination: {
        page: 1,
        size: 100,
        name: '',
        total: 0
      },
			defaultStoreId:undefined
    }
  },
  computed: {
    ...mapGetters([
    	'lang',
    	'name',
      'storeList',
      'storeId',
      'sidebar',
      'avatar'
    ])
  },
  watch: {
		defaultStoreId(val) {
    	console.log('watch',val)
      this.$store.dispatch('app/setStoreId', val)
      this.$emit('storeIdChange',val)
    }
  },
	created(){
  	console.log(this.name)
  	this.defaultStoreId=this.storeId
	},
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    changeLang() {
      this.$store.dispatch('app/toggleLang')
      this.$i18n.locale = this.lang
    },
		updateStoreList(){
			this.$store.dispatch('app/getStoreId').then(res=>{
				console.log('getStoreId',res)
			})
		},
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    changePassword() {
      this.$router.push(`/system/password`)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
