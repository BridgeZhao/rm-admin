<template>
  <div class="change-password app-container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="form">
      <el-form-item label="原密码" prop="pass" :label-width="formLabelWidth">
        <el-col >
          <el-input v-model="ruleForm.pass" placeholder="请输入原密码" ref="oldPassInput"  :type="passwordType.pass"></el-input>
          <span class="show-pwd" @click="showPwd(1)">
            <svg-icon :icon-class="passwordType.pass === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-col>
      </el-form-item>
      <el-form-item label="新密码" prop="newpass" :label-width="formLabelWidth">
        <el-col >
          <el-input v-model="ruleForm.newpass" placeholder="请输入新密码"  :type="passwordType.newpass"></el-input>
          <span class="show-pwd" @click="showPwd(2)">
            <svg-icon :icon-class="passwordType.newpass === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-col>
      </el-form-item>
      <el-form-item label="重复新密码" prop="checknewpass" :label-width="formLabelWidth">
        <el-col >
          <el-input v-model="ruleForm.checknewpass" placeholder="请再次输入新密码" :type="passwordType.checknewpass"></el-input>
          <span class="show-pwd" @click="showPwd(3)">
            <svg-icon :icon-class="passwordType.checknewpass === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-col>
      </el-form-item>
			<div class="footer-btn">
				<el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">保存</el-button>
			</div>
    </el-form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { changePassword} from '@/api/user'

  export default {
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
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }],
          newpass: [{
            required: true,
            message: "请输入密码"
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }],
          checknewpass: [{
            required: true,
            validator: validatePass2,
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
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
        passwordType :{
          pass: 'password',
          newpass: 'password',
          checknewpass: 'password'
        },
        loading: false,
      }
    },
    computed: {
    	...mapGetters([
        'userId'
    	])
    },
    watch: {},
    mounted() {},
    methods: {
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            this.submitF.oldPassword = this.ruleForm.pass
            this.submitF.newPassword = this.ruleForm.newpass
            return new Promise(resolve => {
              changePassword(this.submitF).then(res => {
								this.$store.dispatch('user/logout')
								this.$confirm('密码修改成功,请重新登录账号')
									.then(() => {
										this.$router.push(`/login?redirect=${this.$route.fullPath}`)
									})
                resolve(res)
              }).catch(()=>{
								this.$nextTick(() => {
									this.$refs.oldPassInput.focus()
								})
							}).finally(() => {
                this.loading = false
              })
            })
          }
        })
      },
      showPwd(type) {
        if(type === 1){
          this.passwordType.pass === 'password'?this.passwordType.pass = '':this.passwordType.pass = 'password'
        }else if(type === 2){
          this.passwordType.newpass === 'password'?this.passwordType.newpass = '':this.passwordType.newpass = 'password'
        }else{
          this.passwordType.checknewpass === 'password'?this.passwordType.checknewpass = '':this.passwordType.checknewpass = 'password'
        }
      }
    },
    created(){
      // detailUser(this.token).then(res => {
      //   console.log(res.id)
      //   this.submitF.id = res.id
      // })
      this.submitF.id = this.userId
      }
    }
</script>

<style lang="scss" scoped>
 .change-password {
	 .form {
		 position: relative;
		 width: 520px;
		 padding: 100px 35px;
		 margin: 0 auto;
		 overflow: hidden;
		 .footer-btn{
			 text-align: right;
		 }
	 }
	 .show-pwd {
		 position: absolute;
		 right: 18px;
		 font-size: 16px;
		 color: #889aa4;
		 cursor: pointer;
		 user-select: none;
		 fill: #71dcff;
		 .svg-icon {
			 fill: #71dcff;
		 }
	 }
 }
</style>
