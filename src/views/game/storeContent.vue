<template>
  <div id="store_content" class="app-container">
    <div class="top-bar">
      <el-radio-group v-model="gameTab">
        <!-- <el-radio-button label="店内导航" class="radioBtn"></el-radio-button> -->
        <el-radio-button label="navGame" class="radioBtn">
          关联游戏
        </el-radio-button>
        <el-radio-button label="navAd" class="radioBtn">
          广告配置
        </el-radio-button>
      </el-radio-group>
    </div>
    <dispose-nav v-show="gameTab === &quot;nav&quot;" />
    <dispose-game v-show="gameTab === &quot;navGame&quot;" :store-id="defaultStoreId" />
    <dispose-ad v-show="gameTab === &quot;navAd&quot;" :store-id="defaultStoreId" />
  </div>
</template>

<script>
  import disposeGame from '@/views/game/pages/disposeGame'
  import disposeAd from '@/views/game/pages/disposeAd'
  export default {
    name: 'StoreContent',
    components: {
        disposeGame,
        disposeAd
    },
    data() {
      return {
        gameTab: 'navGame',
        defaultStoreId:''
      } 
    },
    methods:{
      // 全局门店下拉修改
      $storeIdChanged(storeId){
        if(storeId){
          this.defaultStoreId=storeId
        }
        console.log('下拉测试',this.defaultStoreId)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .app-container {
    background: none;
  }
</style>
