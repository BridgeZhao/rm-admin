<template>
  <el-dialog title="收货地址" :visible.sync="dialogIsVisible" fullscreen @close="callBack">
    <line-chart v-if="type==='line'" :data="data" :height="'100%'" />
    <bar-chart v-if="type==='bar'" :data="data" />
  </el-dialog>
</template>

<script>
import LineChart from './LineChart'
import BarChart from './BarChart'
export default {
  components: { LineChart, BarChart },
  props: {
    type: {
      type: String,
      default: 'bar'
    },
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogIsVisible: this.show
    }
  },
  watch: {
    show(val) {
      this.dialogIsVisible = val
    }
  },
  mounted() {
    console.log('dialogIsVisible', this.props)
  },
  methods: {
    callBack() {
      this.$emit('close', this.dialogIsVisible)
    }
  }
}
</script>

<style scoped>
  .chart-dialog{
    position: relative;
    width: 100%;
    height: calc(100vh - 84px);
  }
</style>

