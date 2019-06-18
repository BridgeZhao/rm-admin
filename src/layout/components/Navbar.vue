<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <div class="head-store">
        <svg-icon icon-class="store" />
      </div>
      <div class="head-store">
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
          <span>admin</span>
        </div>
        <el-dropdown-menu class="user-dropdown">
          <router-link to="/dashboard">
            <el-dropdown-item>
              {{ $t("menus.dashboard") }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display:block;" @click="logout">
               {{ $t("menus.logout") }}</span>
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
  	this.defaultStoreId=this.storeId
	},
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    changeLang() {
      this.$store.dispatch('app/toggleLang')
      this.lang=this.$i18n.locale = this.lang
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #0a2949;
  color: #71dcff;
  fill: #71dcff;
  .head-store{
    float: left;
    margin-right: 10px;
    vertical-align: middle;
  }
  .h-store-text{

  }
  .avatar-wrapper{
    span{
      padding-left: 3px;
    }
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  i{
    color:  #71dcff;
  }
  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
  }
}
</style>
