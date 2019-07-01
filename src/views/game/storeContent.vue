<template>
  <div id='store_content' class="app-container">
    <div class="top-bar">
      <el-radio-group v-model="gameTab">
          <!-- <el-radio-button label="店内导航" class="radioBtn"></el-radio-button> -->
          <el-radio-button label="关联游戏" class="radioBtn"></el-radio-button>
          <el-radio-button label="广告配置" class="radioBtn"></el-radio-button>
      </el-radio-group>
    </div>
    <dispose-nav  v-show='gameTab === "店内导航"' ></dispose-nav>
    <dispose-game v-show='gameTab === "关联游戏"' :StoreId="defaultStoreId"></dispose-game>
    <dispose-ad v-show='gameTab === "广告配置"' :StoreId="defaultStoreId"></dispose-ad>
  </div>
</template>

<script>
  import disposeGame from '@/views/game/pages/disposeGame'
  import disposeAd from '@/views/game/pages/disposeAd'
  import disposeNav from '@/views/game/pages/disposeNav'

  export default {
    name: 'storeContent',
    components: {
        disposeGame,
        disposeAd,
        disposeNav
    },
    data() {
      return {
        gameTab: '广告配置',
        defaultStoreId:''
      } 
    },
    methods:{
      // 全局门店下拉修改
      $storeIdChanged(storeId){
        if(storeId){
          this.defaultStoreId=storeId
        }
        console.log("下拉测试",this.defaultStoreId)
      }
    }
  }
</script>
<style lang="scss">
  @import "../../styles/game.scss";
</style>
