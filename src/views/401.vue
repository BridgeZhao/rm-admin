<template>
  <div class="wscn-http401-container text-center">
    <p><img width="300" src="@/assets/img/logo.png" alt="404"></p>
    <h2 class="text-center">抱歉，您无权访问该页面</h2>
    <h2 class="text-center">Sorry，Authorization required</h2>
    <h2 class="text-center"><el-button type="primary" @click="reLogin">返回登录页</el-button></h2>
  </div>
</template>
<script>
export default {
	data() {
		return {
			authRoutes: []
		}
	},
	created() {

	},
	methods: {
		reLogin(){
			this.$store.dispatch('user/logout').then(() => {
				this.$router.push(`/login?redirect=${this.$route.fullPath}`)
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.wscn-http401-container{
  transform: translate(-50%,-50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
</style>
