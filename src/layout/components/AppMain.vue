<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view  v-on="$listeners" />
    </transition>
  </section>
</template>
<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  padding: 20px;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: inset 1px 1px 5px 0 rgba(0,0,0,.5);
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
