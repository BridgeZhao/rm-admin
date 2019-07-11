<template>
  <v-chart ref="lineTimeChart" theme="dark" :class="className" :style="{height:height,width:width}" :options="options" />
</template>

<script>
  import echarts from 'echarts'
  const animationDuration = 3000
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
        default: '200px'
      },
      data: {
        type: Object,
        default() {
        }
      }
    },
    data() {
      return {
        colors:['#71DCFF','#0176FF','#04ACE3','#1583DF','#11659B','#50E3C2','#B8E986','#F8E71C','#D8B003','#F5A623'],
        options: {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            top: '0',
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: [],
            right: '4%'
          },
          grid: {
            top: '16%',
            left: '3%',
            right: '5%',
            bottom: '4%',
            containLabel: true
          },
          xAxis: {
            name: '时间',
            nameGap: 4,
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            name: '人数',
            type: 'value',
            axisTick: {
              show: false
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            }
          },
          series: []
        }
      }
    },
    watch: {
      data(val) {
				console.log('LineTimeChart中的watch',val)
        this.loadData(val)
      }
    },
    beforeDestroy() {
      this.options = null
    },
    mounted() {
      const datas = this.data
      if (datas.seriesData) {
      	console.log('LineTimeChart中的mouted')
        this.loadData(datas)
      }
    },
    methods: {
      loadData(data) {
				this.options.series = []
				console.log('LineTimeChart', data)
        const {xAxisData, legendData, seriesData} = data
        this.options.legend.data = legendData
        this.options.xAxis.data = xAxisData
        seriesData.map((item, idx) => {
          this.options.series.push({
            name: item.name,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: this.colors[idx],
                borderWidth: 12
              }
            },
            data: item.data,
            animationDuration
          })
        })
      },
      initColor() {
        const r = Math.random() * 255
        const g = Math.random() * 255
        const b = Math.random() * 255
        const a = 0.8
        const colors = `rgba(${r},${g},${b},${a})`
        return colors
      }
    }
  }
</script>
