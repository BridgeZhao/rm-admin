<template>
    <div class="labelView">
        <h1 class="label-title">{{labelFather}}</h1>
    </div>
</template>
<script>
export default {
    name:'labelView',
    data(){
        return{

        }
    },
    props:['labelFather']
}
</script>

<style lang="scss" scoped>
.labelView{
    font-size: 14px;
	  padding-left: 20px;
    /*line-height: 1.6rem;*/
    /*height: 1.6rem;*/
    color: #71dcff;
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
	 .label-title{
		 line-height: 27px;
		 margin: 0;
		 font-size: 18px;
		 font-weight: normal;
		 color: #71dcff;
	 }
    .label-title::before{
        content: "";
        display: block;
        position: absolute;
			   top:0;
        left:0;
        /*top: 15%;*/
        width: 3px;
        height:26px;
        background: #71dcff;
    }

}
</style>
