<template>
  <v-chart theme="dark" :class="className" :style="{height:height,width:width}" :options="options"/>
</template>

<script>
  import echarts from 'echarts'
  const animationDuration = 1000
  const colorAry = [{
    item: 'rgba(113,220,255,1)',
    area: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(113,220,255,.1)'}, {
      offset: 0.8,
      color: 'rgba(0, 136, 212, 0)'
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
			grid:{
				type:Object,
				default(){
					return {
						top: '10%',
						left: '2%',
						right: '5%',
						bottom: '5%',
						containLabel: true
					}
				}
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
					grid: this.grid,
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: []
            }
          ],
          yAxis: {
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
          },
          series: []
        }
      }
    },
    beforeDestroy() {
      this.options = null
    },
    watch: {
      data(val) {
      	console.log('line-chart',val)
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
        const {legendData, xAxisData,yAxisName, seriesData} = data;
        this.options.legend.data = legendData||[]
        this.options.xAxis = []
        this.options.yAxis.name =  yAxisName || '%'
        xAxisData.map(item => {
          this.options.xAxis.push({
            type: 'category',
            boundaryGap: false,
						splitLine: {
							show: true,
							lineStyle: {
								color: ['rgba(113,220,255,.2)']
							}
						},
            data: item
          })
        })
        this.options.series = []
        seriesData.map((item, idx) => {
          this.options.series.push({
            name: legendData?legendData[idx]:'',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
						areaStyle:{
							normal:{
								//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
									offset: 0,
									color: 'rgba(113,220,255,.8)'
								},{
									offset: 1,
									color: 'rgba(113,220,255,0)'
								}])
							}
						},
            itemStyle: {
              normal: {
								color: 'rgba(113,220,255,.9)',
                borderWidth: 12
              }
            },
            data: item,
            animationDuration
          })
        })
				this.options=Object.assign({},this.options)
      }
    }
  }
</script>
