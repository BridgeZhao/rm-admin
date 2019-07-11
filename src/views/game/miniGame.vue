<template>
  <div class="app-container mini_game">
    <div>
      <el-row :gutter="20" class="data-list game-list">
        <el-col v-for="(item, key) in miniGame" :key="key" :span="4">
          <div class="data-list-item">
            <div class="name-warp">
              <span class="name">{{ item.name }}</span>
              <div>
                <svg-icon icon-class="edit" class="svg-icon" @click="editChannelGame(item)" />
                <svg-icon icon-class="trash" class="delete-icon" @click="delGame(item)" />
              </div>
            </div>
            <div class="img">
              <img :src="item.img">
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="add data-list-item" @click="addGame">
            <svg-icon icon-class="plus" class="svg-plus" />
            <span class="font-red">添加游戏</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--弹框-->
    <el-dialog :title="dialogType === 'add' ? '添加游戏' : '修改游戏'" :width="'720px'" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="()=>{clearClose()}">
      <!--基本信息-->
      <el-form ref="myform" v-loading="dgLoading" :model="fromInfo" :rules="rules">
        <el-row :gutter="24" class="">
          <el-col :span="16">
            <el-form-item label="游戏名称" :label-width="formLabelWidth" prop="name">
              <el-input v-model="fromInfo.name" autocomplete="off" placeholder="请输入游戏名称" />
            </el-form-item>
            <el-form-item label="path" :label-width="formLabelWidth" prop="link">
              <el-input v-model="fromInfo.link" autocomplete="on" placeholder="请输入path" />
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" prop="imgBase64">
              <el-upload
                ref="upload"
                class="upload-img"
                action=""
                name="imgBase64"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handlePreview"
              >
                <div class="text-left">
                  <el-button type="primary" size="small">
                    <i class="el-icon-upload el-icon--right" /> 点击上传
                  </el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传jpg/png文件，且不超过2MB
                  </div>
                </div>  
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="upload-imgshow">
              <img class="game_img" :src="fromInfoImg" onerror="notfound(this)">
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button type="primary" @click="btnSubmit">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { addGame, gamePage ,delGame } from '@/api/game'
  export default {
    name: 'MiniGame',
    data () {
      return {
        miniGame: [],
        dialogVisible : false,
        dgLoading: false,
        dialogType:'add',
        formLabelWidth : '80px',
        fileReader: new FileReader(),
        fromInfo: {
          id:'',
          name:'',
          link:'',
          imgBase64:undefined
        },
        fromInfoImg:undefined,
        rules: {
        	name: [
        		{required: true, message: '请输入游戏名称', trigger: 'blur'},
        		{min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
        	],
        	link:[{ required: true, message: '请输入游戏h5链接', trigger: 'blur'},
              {min: 5, max: 32, message: '长度在 2 到 10 个字符', trigger: 'blur'}
            // {type: 'url', message: '请输入正确的游戏h5链接', trigger: 'blur'},
          ],
          imgBase64:[{required: true, message: '请上传h5游戏图片', trigger: 'change'}]
        }
      }
    },
    created(){
      this.gamePage()
    },
    methods: {
      gamePage(){
        return new Promise(resolve => {
          gamePage().then(res => {
            this.miniGame = res.data
            resolve(this.miniGame)
          })
        })
      },
      addGame () {
        this.dialogType = 'add'
        this.dialogVisible = true
        this.rules.imgBase64 = [{required: true, message: '请上传h5游戏图片', trigger: 'change'}]
        this.fromInfo.imgBase64 = undefined
      },
      handlePreview(file) {
        console.log(file)
        const fileName = file.name
        const isLimt = file.size / 1024 < 2048 
        const regex = /(.jpg|.jpeg|.png)$/
        if (regex.test(fileName.toLowerCase())) {
          if (isLimt) {
            this.fileReader.readAsDataURL(file.raw)
            this.fileReader.onload = (res) => {
              this.fromInfo.imgBase64 = res.currentTarget.result
              this.fromInfoImg = res.currentTarget.result
              this.fromInfo = Object.assign({}, this.fromInfo)
            }
          }else{
            this.$message.error('上传图片不能超过2MB')
          }
        }else{
          this.$message.error('只能上传jpg或png格式')
        }
      },
      btnSubmit () {
        console.log(this.fromInfo.imgBase64)
          if(this.dialogType === 'edit' && this.fromInfo.imgBase64 === undefined){ 
            delete this.rules.imgBase64
            delete this.fromInfo.imgBase64
          }
          this.$refs['myform'].validate((valid) => {
            if (valid) {
              this.dgLoading = true
              addGame(this.fromInfo).then(() => {
                this.gamePage()
                this.$message.success('操作成功')
              }).finally(() => {
                this.dgLoading = false
                this.dialogVisible = false
              })
            }
          })
      },
      clearClose(reload){
        this.dialogVisible = false
        if(reload){
          this.gamePage()
        }
      	this.$refs['myform'].resetFields()
        this.fromInfo.name=''
        this.fromInfo.link=''  
        this.fromInfo.imgBase64 = undefined
        this.fromInfoImg = undefined
        this.fromInfo.id = ''
      },
      editChannelGame(val){
        this.dialogType = 'edit'
        console.log(val)
        this.fromInfo.id = val.id
        this.fromInfo.name = val.name
        this.fromInfo.link = val.link
        this.fromInfoImg = val.img
        this.dialogVisible = true
      },
      delGame (key) {
        this.$confirm('确认要删除' + key.name + '吗？')
        .then(() => {
          delGame(key.id).then(()=>{
            this.$message.success('删除成功')
            this.gamePage()
          }).finally(() =>{})
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '@/styles/variables.scss';
  .app-container {
    background: none;
  }
  .svg-icon{
    cursor: pointer;
  }
  .svg-icon:hover{
    color: #fe0000;
  }
  .mini_game{
    .data-list {
        margin-top: 0;
        display: flex;
        flex-wrap: wrap;
        padding-inline-start: 0;
        .data-list-item{
          width: 13.2rem;
          height: 25rem;
          background: $menuBg;
          border:1px solid $borderColor;
          border-radius: 4px;
          // margin-right: 1.2rem;
          margin-bottom: 1rem;
          padding: 0 1.2rem;
          box-sizing: border-box;
          .name-warp {
            display: flex;
            justify-content: space-between;
            margin: 1rem  auto;
            align-items: center;
            .name{
              width: 8rem;
              text-overflow: ellipsis;
              white-space:nowrap;
              overflow:hidden;
            }
          }
          .img {
            height: 19rem;
            margin: 0 auto;
            position: relative;
            >img{
              width: 100%;
            }
            >.error{
              width: auto;
              height: auto;
              position: absolute;
              top:50%;
              left: 50%;
              margin-top:-45px; 
              margin-left:-58px;
            }
          }
        }
      }
      .upload-imgshow{
        max-width:100%;
        display: flex;
        justify-content: center;
        // background: $bgColor;
        // border:1px solid $borderColor;
        .game_img{
          max-width: 100%;
          max-height: 260px;
          vertical-align: middle;
        }
      }
      .data-list{
        .data-list-item.add {
          border: 1px dashed red;
          box-sizing: border-box;
          cursor: pointer;
          background: transparent!important;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          font-size: .7rem;
          color: #fe0000;
          .svg-plus{
            width: 3.3rem;
            height: 3.3rem;
            color: red;
          }
        }
      }
    }
</style>
