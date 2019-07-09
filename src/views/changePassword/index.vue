<template>
  <div class="change-password">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="form">
      <div class="title-container">
        <h3 class="title">KANKAN AI
          <h2>change - password</h2>
        </h3>
      </div>
      <el-form-item label="原密码" prop="pass" :label-width="formLabelWidth">
        <el-col >
          <el-input v-model="ruleForm.pass" placeholder="请输入原密码" :type="passwordType"></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-col>
      </el-form-item>
      <el-form-item label="新密码" prop="newpass" :label-width="formLabelWidth">
        <el-col >
          <el-input v-model="ruleForm.newpass" placeholder="请输入新密码"  :type="passwordType"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="重复新密码" prop="checknewpass" :label-width="formLabelWidth">
        <el-col >
          <el-input v-model="ruleForm.checknewpass" placeholder="请再次输入新密码" :type="passwordType"></el-input>
        </el-col>
      </el-form-item>
      <div>
        <el-button :loading="loading" type="primary" class="button" @click="submitForm('ruleForm')">保存</el-button>
      </div>
      <div class="tips">
        <span>Copyright© 2016 - 2019 Ruima.All Right Reserved.</span>
        <span>蜀ICP备16009239号-12 成都睿码科技有限责任公司 版权所有</span>
      </div>
    </el-form>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { changePassword, detailUser} from '@/api/user'
  
  export default {
    name: 'changePassword',
    data() {
      let validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.ruleForm.newpass) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      }
      return {
        rules: {
          pass: [{
            required: true,
            message: "请输入密码"
          }],
          newpass: [{
            required: true,
            message: "请输入密码"
          }],
          checknewpass: [{
            required: true,
            validator: validatePass2,
            trigger: "blur"
          }]
        },
        ruleForm: {
          pass: '',
          newpass: '',
          checknewpass: ''
        },
        submitF:{
          oldPassword:'',
          newPassword:'',
          id:''
        },
        formLabelWidth : '100px',
        passwordType :'password',
        loading: false,
      }
    },
    computed: {
    	...mapGetters([
    		'token',
        'storeId'
    	])
    },
    watch: {},
    mounted() {},
    methods: {
      submitForm(formName){
        console.log(this.submitF.id)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true 
            this.submitF.oldPassword = this.ruleForm.pass  
            this.submitF.newPassword = this.ruleForm.newpass
            return new Promise(resolve => {
              changePassword(this.submitF).then(res => {
                console.log(res)
 
                this.$store.dispatch('user/logout')
                resolve(res)
              }).finally(() => {
                this.loading = false
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              })
            })
          }
        })
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
    },
    created(){
      detailUser(this.token).then(res => {
        console.log(res.id)
        this.submitF.id = res.id
      })
      }
    }
</script>

<style lang="scss" scoped>
 .change-password{
   background-size:100%;
   min-height: 100%;
   width: 100%;
   background-color: #2d3a4b;
   overflow: hidden;
    .title-container {
     position: relative;
     .title {
       font-size: 26px;
       margin: 0px auto 40px auto;
       text-align: center;
       font-weight: bold;
       h2{
         color: #71dcff;
         margin: 10px;
       }
     }
   }
   .form {
     position: relative;
     width: 520px;
     max-width: 100%;
     padding: 160px 35px 0;
     margin: 0 auto;
     overflow: hidden;
     .button{
       width:100%;
       margin-bottom:30px;
     }
      .tips {
       font-size: 13px;
       color: #819196;
        text-align: center;
       span{display: block;margin-top: 10px;}
     }
   }
   .el-input {
     display: inline-block;
     height:100%;
     width: 85%;
     .el-input__inner{
       background: transparent;
       border: 0;
     }
     }
     .el-form-item {
       border: 1px solid rgba(255, 255, 255, 0.1);
       background: rgba(0, 0, 0, 0.1);
       border-radius: 5px;
       color: #454545;
       background: #00172f;
       padding:5px 0; 
     }
     .show-pwd {
       position: absolute;
       right: 18px;
       font-size: 16px;
       color: #889aa4;
       cursor: pointer;
       user-select: none;
       fill: #71dcff;
       .svg-icon{
         fill: #71dcff;
       }
     }
   } 
</style>
