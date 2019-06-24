<template>
  <div class="mini_game">
    <ul  class="data-list game-list">
      <li >
        <div  class="name-warp"><span  class="name">颜值打分</span>
         <svg-icon icon-class="trash" class="delete-icon" />
         </div>
        <div  class="img" style="background-image: url('http://172.16.2.118/media/5d0b47c4e7f8b535833263.jpg');"></div>
      </li>
      <li  class="add">
        <svg-icon icon-class="plus" class="svg-plus"></svg-icon>
         <span class="font-red">添加游戏</span>
      </li>
    </ul>
    <div  class="cs-dialog dark1" style="display: none;">
      <div class="add-game" data-v-3248c00a="">
        <h1 class="title">添加小游戏</h1>
        <div class="game-form-warp">
          <ul class="config-list">
            <li>
              <div class="item-title">名称</div> <input type="text" placeholder="请输入游戏名称"
                class="input">
            </li>
            <li>
              <div class="item-title">H5链接</div> <input type="text" class="input">
            </li>
            <li>
              <div class="item-title">上传预览图片</div>
              <div  class="cs-upload-warpper">
                <input  type="file" accept="*" class="file-input">
                <input  type="text" readonly="readonly" class="input">
                <span  class="upload-icon"></span>
                
              </div>
            </li>
          </ul>
          <div class="preview-panel"></div>
        </div>
        <div class="btn-group"><button data-v-02914539="" class="btns btn mr-right btn-cancel default">取
            消</button> <button data-v-02914539="" class="btns btn btn-add gradient">添加</button></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'miniGame'
  }
</script>
<style lang="scss">
  @import "../../styles/game.scss";
</style>
