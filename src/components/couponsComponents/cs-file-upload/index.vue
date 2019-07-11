<script>
export default {
  props: {
    accept: {
      type: String,
      default: '*'
    },
    extra: {
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    path: {
      type: String
    }
  },
  data() {
    return {
      vitrualPath: this.path
    }
  },
  watch: {
    path(v){
      this.vitrualPath=v
    }
  },
  methods: {
    onFileChange($event) {
      const path = $event.target.value
      this.vitrualPath = path
      this.$emit('change', $event, this.extra)
    }
  }
}
</script>

<template>
  <div class="cs-upload-warpper">
    <input :multiple="multiple" class="file-input" type="file" :accept="accept" @change="onFileChange">
    <input :value="vitrualPath" type="text" readonly class="input">
    <span class="upload-icon" />
  </div>
</template>
<style lang="scss" scoped>
.upload-icon {
  position: absolute;
  right: 0.8rem;
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  background-image: url("./img/upload.svg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  top: 0;
}
.file-input {
  // visibility: hidden;
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 0;
}
.cs-upload-warpper {
  width: 17.2rem;
  height: 1.5rem;
  position: relative;
}
.input {
  width: 100%;
  height: 100%;
  background: #eeeeef;
  border-radius: 4px;
  padding-left: 0.4rem;
  font-size: 0.7rem;
  box-sizing: border-box;
}
</style>
