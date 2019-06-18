<template>
  <v-chart theme="dark" :class="className" :style="{height:height,width:width}" :options="options"/>
</template>

<script>
  import echarts from 'echarts'

  const animationDuration = 3000
  // const options = {
  //   tooltip: {
  //     trigger: 'axis'
  //   },
  //   legend: {
  //     top: '0',
  //     icon: 'rect',
  //     itemWidth: 14,
  //     itemHeight: 5,
  //     itemGap: 13,
  //     data: [],
  //     right: '4%'
  //   },
  //   grid: {
  //     top: '12%',
  //     left: '2%',
  //     right: '2%',
  //     bottom: '2%',
  //     containLabel: true
  //   },
  //   xAxis: [],
  //   yAxis: [{
  //     type: 'value',
  //     name: '(%)',
  //     axisTick: {
  //       show: false
  //     },
  //     axisLabel: {
  //       margin: 10,
  //       textStyle: {
  //         fontSize: 14
  //       }
  //     }
  //   }],
  //   series: []
  // }
  const colorAry = [{
    item: 'rgb(0, 136, 212)',
    area: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(0, 136, 212, 0.3)'}, {
      offset: 0.8,
      color: 'rgba(0, 136, 212, 0)'
    }], false)
  }, {
    item: 'rgb(137, 189, 27)',
    area: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(137, 189, 27, 0.3)'}, {
      offset: 0.8,
      color: 'rgba(137, 189, 27, 0)'
    }], false)
  }]
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
            top: '12%',
            left: '2%',
            right: '2%',
            bottom: '2%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: []
            }
          ],
          yAxis: [{
            type: 'value',
            name: '(%)',
            axisTick: {
              show: false
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            }
          }],
          series: []
        }
      }
    },
    beforeDestroy() {
      this.options = null
    },
    watch: {
      data(val) {
        let _val = JSON.parse(JSON.stringify(val))
        console.log('valcalaall', _val)
        this.loadData(_val)
      }
    },
    created() {
      const datas = this.data
      if(datas.seriesData){
        this.loadData(datas)
      }

    },
    methods: {
      loadData(data) {
        let _data = data
        const {legendData, xAxisData, seriesData} = _data;
        this.options.legend.data = legendData
        this.options.xAxis = []
        xAxisData.map(item => {
          this.options.xAxis.push({
            type: 'category',
            boundaryGap: false,
            data: item
          })
        })
        this.options.series = []
        seriesData.map((item, idx) => {
          this.options.series.push({
            name: legendData[idx],
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
            areaStyle: {
              normal: {
                color: colorAry[idx].area,
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: colorAry[idx].item,
                borderWidth: 12
              }
            },
            data: item,
            animationDuration
          })
        })
      }
    }
  }
</script>
