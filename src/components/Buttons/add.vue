<template>
	<div class="my-button add">
		<svg-icon icon-class="add"/>
	</div>
</template>

<script>
	export default {
		name: 'Add',
		props: {
			isActive: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			toggleClick() {
				this.$emit('toggleClick')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my-button{
		background:#0a2949;
		border: 2px solid #71dcff;
		border-radius: 100%;
		padding: 8px;
   position: fixed;
		width: 3rem;
		height: 3rem;
		z-index: 10;
		right: 2rem;
		bottom:2rem;
	.svg-icon{
			width: 100%;
			height: 100%;
		}
	}
</style>
