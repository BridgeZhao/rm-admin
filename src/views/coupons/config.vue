<template>
    <div class="app-container">
        <div class="config-haeder">
            <div class="item" :class="{'active':isStep == 1}">
                <i class="el-icon-menu"></i>
                优惠卷场景配置
            </div>
					  <svg-icon icon-class="right-go" style="font-size: 2rem;margin: 0 1%;"></svg-icon>
            <div class="item" :class="{'active':isStep == 2}">
                <i class="el-icon-circle-plus-outline"></i>
                优惠卷导入
            </div>
					<svg-icon icon-class="right-go" style="font-size: 2rem;margin: 0 1%;"></svg-icon>
            <div class="item" :class="{'active':isStep == 3}">
                <i class="el-icon-sort"></i>
                优惠卷场景关联
            </div>
        </div>
        <div class="box-card">
            <scene-setting  @nextComponet="next" v-if="isStep == 1"></scene-setting>
            <sceneLoad  @nextComponet="next" v-else-if="isStep == 2"></sceneLoad>
            <sceneConnect  @nextComponet="next" v-else></sceneConnect>
        </div>
    </div>
</template>
<script>
    import sceneSetting from './sceneSetting'
    import sceneConnect from './sceneConnect'
    import sceneLoad from './sceneLoad'
  export default {
    name: 'configuration',
    components: { sceneSetting,sceneConnect,sceneLoad},
    data() {
      return {
        isStep: 1,
      }
    },
    computed:{
      componentName(){
        if(this.isStep == 1){
          return 'sceneSetting';
        }else if(this.isStep == 2){
          return 'sceneLoad';
        }else {
          return 'sceneConnect'
        }
      }
    },
    methods: {
      next(val){
        this.isStep = val;
        console.log("--------",val)
      }
    },
    mounted() {


    }
  }
</script>
<style lang="scss" scoped>
    @import "../../styles/config.scss";
</style>
