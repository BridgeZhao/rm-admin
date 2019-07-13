<template>
  <div class="second_item">
    <div>
      <el-row :gutter="20" class="data-list game-list">
        <el-col v-for="(item, key) in gameData" :key="key" :span="4">
          <div class="data-list-item">
            <div class="name-warp">
              <span class="name">{{ item.game.name }}</span>
              <svg-icon icon-class="edit" class="svg-icon" @click="editChannelGame(item)" />
            </div>
            <div class="img">
              <img :src="item.game.img">
            </div>
            <el-button class="default" size="small" @click="delChannelGame(item)">
              取消关联
            </el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="add data-list-item" @click="addChannelGame('add')">
            <svg-icon icon-class="plus" class="svg-plus" />
            <span class="font-red">添加关联游戏</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="addEditType === true ? '添 加': '编辑'" :width="'720px'" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="()=>{clearClose()}">
      <el-form ref="myform" v-loading="dgLoading" :model="fromInfo" :rules="rules">
        <el-form-item v-if="addEditType" label="选择游戏" prop="gameId" :label-width="formLabelWidth">
          <el-select v-model="fromInfo.gameId" placeholder="请选择">
            <el-option
              v-for="item in gameListAll"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else label="游戏名称" :label-width="formLabelWidth">
          <el-input
            v-model="fromInfo.gameName"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="选择场景" :label-width="formLabelWidth" prop="areaId">
          <el-select v-model="fromInfo.areaId" placeholder="请选择">
            <el-option
              v-for="item in ScenarioList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="交互屏设置" :label-width="formLabelWidth">
          <el-checkbox v-model="fromInfo.isIndeterminate" label="全选按钮" name="type" @change="handleCheckAllChange" />
        </el-form-item>
        <el-form-item label="应用设备" style="padding-left:90px;" prop="checked">
          <el-checkbox-group v-model="fromInfo.checked">
            <el-checkbox v-for="item in fromInfo.checkList" :key="item.id" :label="item.id">
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button type="primary" @click="btnSubmit">
          确定添加
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { gamePage, channelGame ,channelGamePage ,delChannelGame} from '@/api/game'
  import { getScenarioData } from '@/api/coupons'
  import { getDevices } from '@/api/device'
  export default {
    name: 'DisposeGame',
    props:[
      "StoreId"
    ],
    data() {
      return {
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
          checkList: [{ id: 0,name: 'screen'},{ id: 1,name: 'pad'}],
          checked:[],
          isIndeterminate : false
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
      ]),
      gameListAll: function () {
        const _this = this
        const alls = JSON.parse(JSON.stringify(_this.gameList))
        for(let i = 0; i<_this.gameData.length; i++){
          for(let j = 0; j<alls.length; j++){
            if(_this.gameData[i].game.id === alls[j].id){
               alls.splice(j,1)
            }
          }
        }
        return alls
      }
    },
    watch:{
      StoreId : function(newVal,oldVal){
        this.defaultStoreId = newVal
        this.channelGamePage()
        this.getDevices ()
        this.gamePage()
      }
      
    },
    created(){
    	this.defaultStoreId=this.storeId
      this.getScenarioData()
      this.getDevices()
      this.channelGamePage()
      this.gamePage()
    },
    methods: {
      gamePage(){
        // console.log('门店列表',this.storeList,this.storeId)
        return new Promise(resolve => {
          gamePage().then(res => {
            this.gameList = res.data
            // console.log("总游戏",this.gameList)
            resolve(res)
          })
        })
      },
      getScenarioData(){
        return new Promise(resolve => {
          getScenarioData({size:50}).then(res => {
            // console.log("场景总列表",res.data)
            this.ScenarioList = res.data
            resolve(res)
          })
        })
      },
      getDevices () {
        return new Promise(resolve => {
          getDevices(this.defaultStoreId).then(res => { 
            const resDevices = []
            for(let i = 0; i< res.length;i++){
              if(res[i].deviceType === 'screen' || res[i].deviceType === 'pospad'){
               resDevices.push(res[i])
              }
            }
            this.fromInfo.checkList = resDevices
            // console.log("设备",resDevices )
            resolve(res)
          })
        })
      },
      channelGamePage(){
        return new Promise(resolve => {
          channelGamePage(this.defaultStoreId).then(res => {  
            this.gameData =  res.data
            // console.log("关联游戏",this.gameData)
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
        this.channelGamePage()
        this.gamePage()
      },
      editChannelGame(val){
        this.addEditType = false
        this.dialogVisible = true
        // console.log("编辑调用数据",val)
        this.fromInfo.id = val.id
        this.fromInfo.gameName = val.game.name
        this.fromInfo.gameId = val.game.id
        this.fromInfo.checked = []
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
            // console.log(this.upFromInfo)
            channelGame(this.upFromInfo).then(() => {
              this.channelGamePage()
              this.gamePage()
              this.clearClose('reload')
              this.$message.success('操作成功')
            })
          }
        })
      },
      delChannelGame(key){
        this.$confirm('确认要取消关联' + key.game.name + '吗？')  
        .then(() => {
          delChannelGame(key.id).then(() => { 
            this.$message.success('取消成功')
            this.channelGamePage()
          })
        })
      },
      clearClose() {
        this.dialogVisible = false
        // this.$refs['myform'].resetFields()
      },
      handleCheckAllChange(){
        var _this = this
        this.fromInfo.checked = []
        if (this.fromInfo.isIndeterminate) {
          this.fromInfo.checkList.forEach(function(item, index) {
            if (index >= 0) {
              _this.fromInfo.checked.push(item.id)
            }
          })
          // console.log( _this.fromInfo.checked)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
   @import '@/styles/variables.scss';
    //common
    #store_content{
      .svg-icon{
        cursor: pointer;
      }
      .svg-icon:hover{
        color: #fe0000;
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
    .second_item{
      .data-list {
        // margin-top: 1.6rem;
        display: flex;
        flex-wrap: wrap;
        padding-inline-start: 0;
        .data-list-item {
          width: 13.2rem;
          height: 26rem;
          background:$menuBg;
          border:1px solid $borderColor;
          border-radius: 4px;
          margin-top:1.2rem;
          margin-bottom: 1.2rem;
          padding: 0 1.2rem;
          box-sizing: border-box;
          display: flex;
          flex-direction:column;
          .name-warp {
            display: flex;
            margin: 1rem 0;
            align-items: center;
            justify-content: space-between;
            .name{
              width: 8rem;
              text-overflow: ellipsis;
              white-space:nowrap;
              overflow:hidden;
            }
          }
          .img {
             position: relative;
             >img{
               width: 100%;
             }
             // >.error{
             //   width: auto;
             //   height: auto;
             //   position: absolute;
             //   top:50%;
             //   left: 50%;
             //   margin-top:-45px; 
             //   margin-left:-58px;
             // }
          }
          .default{
            margin-top: .4rem;
            cursor: pointer;
          }
        }
      }
    }
</style>
