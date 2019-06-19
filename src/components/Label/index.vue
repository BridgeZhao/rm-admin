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
    font-size: 1.2rem;
	margin-left: 1.2%;
    /*line-height: 1.6rem;*/
    /*height: 1.6rem;*/
    color: #71dcff;
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    .label-title::before{
        content: "";
        display: block;
        position: absolute;
        left: -1rem;
        /*top: 15%;*/
        width: .3rem;
        height: 1.2rem;
        background: #71dcff;
        border-radius: .15rem;
    }
    .label-title{
        font-size: 1.3rem;
    }

}
</style>
