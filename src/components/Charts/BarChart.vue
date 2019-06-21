<template>
  <v-chart theme="dark" :class="className" :style="{height:height,width:width}" :options="options" />
</template>

<script>
const animationDuration = 2000
const options = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  grid: {
    top: '10%',
    left: '2%',
    right: '2%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisTick: {
      alignWithLabel: true
    }
  }],
  yAxis: [{
    type: 'value',
    axisTick: {
      show: false
    }
  }],
  series: []
}
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    data: {
      type: Object,
      default() {

      }
    }
  },
  data() {
    return {
      options: {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: '10%',
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: []
        }
      }
  },
  created() {
    this.options.xAxis.data = this.data.xAxisData
    const series_data = []
    this.data.seriesData.map(item => {
      series_data.push({
        name: item.name,
        type: 'bar',
        stack: 'vistors',
        barWidth: '80%',
        data: item.data,
        animationDuration
      })
    })
    this.options.series = series_data
    console.log(this.options)
  }
}
</script>
