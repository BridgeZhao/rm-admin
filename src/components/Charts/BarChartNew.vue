<template>
  <v-chart
    ref="chart"
    theme="dark"
    :class="className"
    :style="{height:height,width:width}"
    :options="options"
  />
</template>

<script>
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
      default: '100%'
    },
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '{a} <br/>{b} : {c}'
        },
        grid: {
          top: '16%',
          left: '2%',
          right: '10%',
          bottom:1,
          containLabel: true
        },
        xAxis: {
          name: '',
          nameGap: 4,
          type: 'category',
          splitLine: { show: false },
          data: []
        },
        yAxis: {
          name: '',
          nameGap: 3,
          type: 'value',
          splitLine: { show: true }
        },
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '6',
            itemStyle: {
              color:'#71dcff',
              barBorderRadius:[3,3,0,0]
            },
            data: []
          }
        ]
      }
    }
  },
  watch:{
    data(val){
      const _val = JSON.parse(JSON.stringify(val))
      this.options.xAxis.data = _val.xAxisData
      this.options.xAxis.name = _val.xAxisName
      this.options.yAxis.name = _val.yAxisName
      this.options.series[0].data =_val.barList
      console.log('val000',_val)
    }
  },
  beforeDestroy() {
    this.options = null
  },
  created() {
    const { xAxisData, xAxisName, yAxisName, barList } = this.data
    this.options.xAxis.data = xAxisData
    this.options.xAxis.name = xAxisName
    this.options.yAxis.name = yAxisName
    this.options.series[0].data = barList
  },
  methods: {}
}
</script>
