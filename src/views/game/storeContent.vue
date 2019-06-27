<template>
  <div id='store_content' class="app-container">
    <div class="top-bar">
      <!-- <ul class="feature-tab-list">
        <li class="" :class="{ selected: gameTab }" @click='tabclick("first")'>店内导航</li>
        <li class="" :class="{ selected: !gameTab }" @click='tabclick("second")'>关联游戏</li>
      </ul> -->
      <el-radio-group v-model="gameTab">
          <el-radio-button label="店内导航" class="radioBtn"></el-radio-button>
          <el-radio-button label="关联游戏" class="radioBtn"></el-radio-button>
      </el-radio-group>
    </div>
    <div v-show='gameTab' class="first_item">
    <!--  <div class="filter-warp">
        <div class="drop-down area-drop-down">
          <template>
            <el-select v-model="defaultStoreId" placeholder="请选择" >
              <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </div> 
        <button class=" gradient" @click='addRegion'>添加区域</button> 
        <button class="gradient">发布</button>
      </div>
      <ul class="data-list">
        <li v-for='(item, key) in listdata' :key='key'>
          <div class="name-warp"><span class="name">{{item.name}}</span> <svg-icon icon-class="trash" class="delete-icon" @click="deleteRegion(key)" /></div>
          <div class="desc-warp"><span>上次更新时间</span> <span>{{item.time}}</span></div>
          <ul class="preview-warp">
            <li>
              <h1 class="title">区域缩略图</h1>
              <div class="img">
                <img :src="item.imgThumbnail" alt="">
              </div>
              <el-upload
                class="upload-img"
                action=""
                ref="upload"
                name="imgThumbnail"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handlePreview">
                <div class="text-left">
                  <el-button type="primary" class="file-upload" size="small" @click="handleClickFile('imgThumbnail' ,key)">
                    <svg-icon icon-class="upload" class="upload-icon svg-icon" />
                  </el-button>
                </div>
              </el-upload>
              <button  class="btns handle-btn default">更新</button>
            </li>
            <li>
              <h1 class="title">区域导航图</h1>
              <div class="img">
                  <img :src="item.imgNavigation" alt="">
              </div>
              <el-upload
                class="upload-img"
                action=""
                ref="upload"
                name="imgNavigation"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handlePreview">
                <div class="text-left">
                  <el-button type="primary" class="file-upload" size="small" @click="handleClickFile('imgNavigation' ,key)">
                    <svg-icon icon-class="upload" class="upload-icon svg-icon" />
                  </el-button>
                </div>
              </el-upload>
              <button  class="btns handle-btn default">更新</button>
            </li>
          </ul>
        </li>
      </ul>
  -->  </div>
    <!-- 关联小游戏 -->
    <div v-show='gameTab === "关联游戏" ' class="second_item">
      <ul  class="data-list game-list">
        <li class="game-list-li" draggable="false" v-for='(item, key) in gameData' :key='key'>
          <div  class="name-warp">
            <span  class="name">{{item.game.name}}</span>
            <svg-icon icon-class="edit" class="svg-icon" @click="editChannelGame(item)"></svg-icon>
          </div>
          <div class="img">
            <img :src="item.game.img" onerror="notfound(this)"/>
          </div>
          <el-button class="default" @click="delChannelGame(item)" size="small">取消关联</el-button>
        </li>
        <li  class="add" @click="addChannelGame('add')">
          <svg-icon icon-class="plus" class="svg-plus"></svg-icon>
           <span class="font-red" >添加关联游戏</span>
        </li>
      </ul>
      <el-dialog :title="addEditType === true ? '添 加': '编辑'" :width="'720px'" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="()=>{clearClose()}">
        <el-form  v-loading="dgLoading" :model="fromInfo" :rules="rules"  ref="myform">
          <el-form-item v-if="addEditType" label="选择游戏" prop="gameId" :label-width="formLabelWidth"  >
             <el-select v-model="fromInfo.gameId" placeholder="请选择">
              <el-option
                v-for="item in gameList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else label="游戏名称"  :label-width="formLabelWidth">
             <el-input
              v-model="fromInfo.gameName"
              :disabled="true">
            </el-input>
          </el-form-item>
          <el-form-item label="选择场景" :label-width="formLabelWidth" prop="areaId" >
             <el-select v-model="fromInfo.areaId" placeholder="请选择" >
              <el-option
                v-for="item in ScenarioList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交互屏设置" :label-width="formLabelWidth"  >
              <el-checkbox label="全选按钮" name="type" v-model="fromInfo.isIndeterminate"  @change="handleCheckAllChange"></el-checkbox>
          </el-form-item>
          <el-form-item label="应用设备" style="padding-left:90px;" prop="checked">
            <el-checkbox-group v-model="fromInfo.checked">
              <el-checkbox v-for='item in fromInfo.checkList' :key='item.id' :label="item.id" >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-center">
          <el-button type="primary" @click="btnSubmit">确定添加</el-button></div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { addGame, gamePage, channelGame ,channelGamePage ,delChannelGame} from '@/api/game'
  import { getScenarioData } from '@/api/coupons'
  import { getDevices } from '@/api/device'
  export default {
    name: 'storeContent',
    data() {
      return {
        gameTab: '关联游戏',
        value: '',
        listdata: [{
          id:'1',
          name: '展示厅',
          time: '2019-06-06',
          imgThumbnail:'http://172.16.2.118/media/5cf8bd48e042e128180005.png',
          imgNavigation:'http://172.16.2.118/media/5cf8bd4f920e8885753787.png'
        }],
        gameData: [],
        fileReader: new FileReader(),
        changeImgBase64 : false,
        listdataImg : undefined,
        listdataIn : undefined,
        nowId : '',
        defaultStoreId : undefined,
        dgLoading: false,
        fromInfo: {
          id:'',
          areaId:'',
          gameId:'',
          gameName:'',
          checkList: [],
          checked:[],
          isIndeterminate : false,
        },
        upFromInfo:{},
        formLabelWidth: '90px',
        dialogVisible : false,
        gameList:[],
        ScenarioList:[],
        addEditType:true,
        rules: {
        	gameId:[{ required: true, message: '请选择游戏', trigger: 'change'}],
        	areaId:[{ required: true, message: '请选择场景', trigger: 'change'}],
          checked:[{ required: true, message: '请选择设备', trigger: 'change'}]
        }
      }
    },
    computed: {
      ...mapGetters([
        'storeList',
        'storeId'
      ])
    },
    created(){
    	this.defaultStoreId=this.storeId
      this.gamePage()
      this.getScenarioData()
      this.getDevices()
      this.channelGamePage()
    },
    methods: {
      // tabclick(tabClickVal) {
      //   this.gameTab = tabClickVal == 'second' ? false : true;
      // },
      addRegion () {
         const _listdata = {
           id:'',
           name: '',
           time: '',
           imgThumbnail:'',
           imgNavigation:''
         };
         _listdata.id = this.defaultStoreId 
         _listdata.name = this.storeList.find(item => {return item.id === this.defaultStoreId}).name
         let thisListdata = this.listdata
         let lastListdata = thisListdata[thisListdata.length - 1]
          if(this.defaultStoreId === lastListdata.id){
            this.$message({
              message: '该区域已存在，请勿重复添加',
              type: 'warning'
            });
            return false
          }
          this.listdata.push(_listdata)
      },
      deleteRegion (key) {
        this.listdata.splice(key,1)
        this.$message({
          message: '删除成功',
          type: 'success'
        });
      },
      handlePreview(file) {
        this.changeImgBase64=true
        let mun = this.listdataIn
        let listdataImg = this.listdataImg
        const fileName = file.name
        const isLimt = file.size / 1024 / 1024 < 1
        const regex = /(.jpg|.jpeg|.png)$/
        if (regex.test(fileName.toLowerCase())) {
          if (isLimt) {
            this.fileReader.readAsDataURL(file.raw)
            this.fileReader.onload = (res) => {
              listdataImg === 'imgThumbnail' ? this.listdata[mun].imgThumbnail= res.currentTarget.result : this.listdata[mun].imgNavigation = res.currentTarget.result
            }
          }else{
            this.$message.error('上传图片不能超过1MB')
          }
        }else{
          this.$message.error('只能上传jpg或png格式')
        }
      },
      handleClickFile(type, key) {
        this.listdataIn = key
        this.listdataImg = type
      },
      // 关联游戏模块
      gamePage(){
        console.log('门店列表',this.storeList,this.storeId)
        return new Promise(resolve => {
          gamePage().then(res => {
            console.log("总游戏",res.data)
            this.gameList = res.data
            resolve(res)
          })
        })
      },
      getScenarioData(){
        return new Promise(resolve => {
          getScenarioData().then(res => {
            console.log("场景总列表",res.data)
            this.ScenarioList = res.data
            resolve(res)
          })
        })
      },
      getDevices () {
        return new Promise(resolve => {
          getDevices(this.defaultStoreId).then(res => { 
            console.log("设备",res)
            this.fromInfo.checkList = res
            resolve(res)
          })
        })
      },
      channelGamePage(){
        return new Promise(resolve => {
          channelGamePage(this.defaultStoreId).then(res => {  
            this.gameData =  res.data
            console.log("关联游戏",this.gameData)
            resolve(res)
          })
        })
      },
      addChannelGame(){
        this.addEditType = true
        this.dialogVisible = true
        this.fromInfo.id = ''
        this.fromInfo.gameName = ''
        this.fromInfo.gameId = ''
        this.fromInfo.areaId = ''
        this.fromInfo.checked = []

      },
      editChannelGame(val){
        this.addEditType = false
        this.dialogVisible = true
        console.log("编辑调用数据",val)
        this.fromInfo.id = val.id
        this.fromInfo.gameName = val.game.name
        this.fromInfo.gameId = val.game.id
        for(let i = 0 ; i<val.devices.length; i++ ){
          this.fromInfo.checked.push(val.devices[i].id)
        }
        this.fromInfo.areaId = val.scenarioId
      },
      btnSubmit () {
        this.$refs['myform'].validate((valid) => {
          if(valid){
            this.upFromInfo = {}
            if(this.addEditType){
              this.upFromInfo = {
                id: this.fromInfo.id,
                gameId:this.fromInfo.gameId,
                preRegistration: false,
                logoBase64: this.gameList.find(item => item.id === this.fromInfo.gameId).img,
                deviceIds: this.fromInfo.checked,
                scenarioId:this.fromInfo.areaId
              }
            }else{
              this.upFromInfo = {
                id: this.fromInfo.id,
                gameId:this.fromInfo.gameId,
                preRegistration: false,
                logoBase64: this.gameList.find(item => item.id === this.fromInfo.gameId).img,
                deviceIds: this.fromInfo.checked,
                scenarioId:this.fromInfo.areaId
              }  
            }
            console.log(this.upFromInfo)
            channelGame(this.upFromInfo).then(() => {
              this.channelGamePage()
              this.clearClose('reload')
              this.$message.success('操作成功')
            })
          }
        })
      },
      delChannelGame(key){
        this.$confirm('确认要删除' + key.game.name + '吗？')  
        .then(() => {
          delChannelGame(key.id).then(() => {
            this.channelGamePage()
            this.$message.success('删除成功')
          })
        })
      },
      clearClose() {
        this.dialogVisible = false
        // this.$refs['myform'].resetFields()
      },
      handleCheckAllChange(){
        var _this = this;
        this.fromInfo.checked = [];
        if (this.fromInfo.isIndeterminate) {
          this.fromInfo.checkList.forEach(function(item, index) {
            if (index >= 0) {
              _this.fromInfo.checked.push(item.id);
            }
          });
          console.log( _this.fromInfo.checked)
        }
      },
      // 全局门店下拉修改
      $storeIdChanged(storeId){
        if(storeId){
          this.defaultStoreId=storeId
        }
        this.channelGamePage()
      }
    },
    watch: {
      defaultStoreId(val) {
        this.$store.dispatch('app/setStoreId', val)
        this.$emit('storeIdChange',val)
      },
    }
  }
</script>
<style lang="scss">
  @import "../../styles/game.scss";
</style>
