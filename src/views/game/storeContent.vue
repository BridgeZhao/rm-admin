<template>
  <div>
    <div class="top-bar">
      <ul class="feature-tab-list">
        <li class="" :class="{ selected: gameTab }" @click='tabclick("first")'>店内导航</li>
        <li class="" :class="{ selected: !gameTab }" @click='tabclick("second")'>小游戏</li>
      </ul>
    </div>
    <div v-show='gameTab' class="first_item">
      <div class="filter-warp">
        <div class="drop-down area-drop-down dark1">
          <!-- 	<div class="main"><span title="测试" class="text-ellipsis">测试</span> <span class="arrow down"></span></div>
					<ul class="popup-list" style="display: none;">
						<li class="selected"><span title="测试" class="text-ellipsis">测试</span>
						  
						</li>
						<li class=""><span title="测试区" class="text-ellipsis">测试区</span>
						  
						</li>
						<li class=""><span title="测试123" class="text-ellipsis">测试123</span>
						  
						</li>
						<li class=""><span title="25" class="text-ellipsis">25</span>
						  
						</li>
						<li class=""><span title="35" class="text-ellipsis">35</span>
						  
						</li>
						<li class=""><span title="36" class="text-ellipsis">36</span>
						  
						</li>
						<li class=""><span title="37" class="text-ellipsis">37</span>
						  
						</li>
						<li class=""><span title="41" class="text-ellipsis">41</span>
						  
						</li>
						<li class=""><span title="展厅区" class="text-ellipsis">展厅区</span>
						  
						</li>
					</ul> -->
          <template>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div> 
        <button class=" gradient" @click='addRegion'>添加区域</button> 
        <button class="gradient">发布</button>
      </div>
      <ul class="data-list">
        <li v-for='(item, key) in listdata' :key=key>
          <div class="name-warp"><span class="name">{{item.name}}</span> <svg-icon icon-class="trash" class="delete-icon" /></div>
          <div class="desc-warp"><span>上次更新时间</span> <span>{{item.time}}</span></div>
          <ul class="preview-warp">
            <li>
              <h1 class="title">区域缩略图</h1>
              <div class="img" :style="{backgroundImage: 'url(' + item.imgThumbnail + ')'}"></div>
              <div  class="cs-upload-warpper file-upload">
                <input  type="file" accept="*" class="file-input"> 
                <input  type="text" readonly="readonly" class="input">
                <svg-icon icon-class="upload" class="upload-icon" />
              </div> 
              <button  class="btns handle-btn default">更新</button>
            </li>
            <li>
              <h1 class="title">区域导航图</h1>
              <div class="img" :style="{backgroundImage: 'url(' + item.imgNavigation + ')'}"></div>
              <div  class="cs-upload-warpper file-upload">
                <input  type="file" accept="*" class="file-input"> 
                <input  type="text" readonly="readonly" class="input">
                <svg-icon icon-class="upload" class="upload-icon" />
              </div>
              <button  class="btns handle-btn default">更新</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-show='!gameTab' class="second_item">
      <ul  class="data-list game-list">
        <li  class="game-list-li" draggable="false">
          <div  class="name-warp"><span  class="name">贴纸游戏</span> <button
               class="icon edit"></button></div>
          <div  class="img" style="background-image: url('http://172.16.2.118/media/5d0b47c4e7f8b535833263.jpg');"></div>
          <button class="btns handle-btn mr-top default">取消关联</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'storeContent',
    data() {
      return {
        gameTab: true,
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }],
        value: '',
        listdata: [{
          id:'1',
          name: '展示厅',
          time: '2019-06-06',
          imgThumbnail:'http://172.16.2.118/media/5cf8bd48e042e128180005.png',
          imgNavigation:'http://172.16.2.118/media/5cf8bd4f920e8885753787.png'
        }]
      }
    },
    methods: {
      tabclick(tabClickVal) {
        this.gameTab = tabClickVal == 'second' ? false : true;
      },
      addRegion () {
         const _listdata = [{
           id:'',
           name: '',
           time: '',
           imgThumbnail:'',
           imgNavigation:''
         }];
         let thisListdata = this.listdata
         let lastListdata = thisListdata[thisListdata.length - 1]
          if(lastListdata.id == '' || lastListdata.id == undefined){
            this.$message('该区域已存在，请勿重复添加');
            return false
          }
         this.listdata.push(_listdata)
      },
      deleteRegion () {
        
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles/game.scss";
</style>
