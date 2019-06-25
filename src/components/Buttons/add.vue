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
		background: #0a2949;
		border: 2px solid #9fe7ff;
		border-radius: 100%;
		padding: 8px;
    position: fixed;
		width: 3rem;
		height: 3rem;
		z-index: 10;
		right: 2.5rem;
		bottom:3rem;
		cursor: pointer;
		&:hover{
			background: #385777;
			border: 2px solid #71dcff;
		}
	.svg-icon{
		fill: #9fe7ff;
			width: 100%;
			height: 100%;
		}
	}
</style>
