<template>
  <div class="change-password app-container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="form">
      <el-form-item label="原密码" prop="oldPassword" :label-width="formLabelWidth">
        <el-col >
          <el-input v-model="ruleForm.oldPassword" placeholder="请输入原密码" ref="oldPassInput"  :type="!pwt.pass?'':'password'"></el-input>
          <span class="show-pwd" @click="pwt.pass = !pwt.pass">
            <svg-icon :icon-class="pwt.pass? 'eye' : 'eye-open'" />
          </span>
        </el-col>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword" :label-width="formLabelWidth">
        <el-col >
          <el-input v-model="ruleForm.newPassword" placeholder="请输入新密码"  :type="!pwt.nPass?'':'password'"></el-input>
          <span class="show-pwd" @click="pwt.nPass = !pwt.nPass">
            <svg-icon :icon-class="pwt.nPass? 'eye' : 'eye-open'" />
          </span>
        </el-col>
      </el-form-item>
      <el-form-item label="重复新密码" prop="cnPass" :label-width="formLabelWidth">
        <el-col >
          <el-input v-model="ruleForm.cnPass" placeholder="请再次输入新密码" :type="!pwt.cnPass?'':'password'"></el-input>
          <span class="show-pwd" @click="pwt.cnPass = !pwt.cnPass">
            <svg-icon :icon-class="pwt.cnPass? 'eye' : 'eye-open'" />
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
          callback(new Error("请再次输入密码"))
        } else if (value !== this.ruleForm.newPassword) {
          callback(new Error("两次输入密码不一致!"))
        } else {
          callback()
        }
      }
      return {
        rules: {
          oldPassword: [{
            required: true,
            message: "请输入密码"
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }],
          newPassword: [{
            required: true,
            message: "请输入密码"
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }],
          cnPass: [{
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
          oldPassword: '',
          newPassword: '',
          cnPass: '',
          id:''
        },
        formLabelWidth : '100px',
        pwt :{
          pass: false,
          nPass: false,
          cnPass: false
        },
        loading: false
      }
    },
    computed: {
    	...mapGetters([
        'userId'
    	])
    },
    methods: {
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            return new Promise(resolve => {
              changePassword(this.ruleForm).then(res => {
                 this.$alert('密码修改成功', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$store.dispatch('user/logout')
                    .then(() => {
                        this.$router.push(`/login`)	
                    })	
                  }
                })
                resolve(res)
              }).catch(()=>{
								this.$refs.oldPassInput.focus()
							}).finally(() => {
                this.loading = false
              })
            })
          }
        })
      },
    },
    created(){
      this.ruleForm.id = this.userId
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
     top: 0;
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
