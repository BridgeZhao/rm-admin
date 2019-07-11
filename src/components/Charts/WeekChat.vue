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
      default: '500px'
    },
    data: {
      type: Object,
      default() {

      }
    }
  },
    data() {
    return {
      weekData:[],
      options: {
         tooltip: {
          position: 'top'
        },
        animation: false,
        grid: {
					top: '10%',
					bottom:'10%',
					left: '8%',
					right:'5%'
        },
        xAxis: {
            type: 'category',
            position:'top',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
            splitArea: {
                show: true
            }
        },
        yAxis: {
            type: 'category',
            data: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00', '10:00', '11:00','12:00', '13:00', '14:00', '15:00','16:00', '17:00','18:00','19:00', '20:00', '21:00', '22:00','23:00'],
            inverse: true,
            splitArea: {
                show: true
            }
        },
        visualMap: {
            min: 0,
            max: 100,
					  itemHeight:300,
					  textColor:'#fff',
            calculable: true,
            orient: 'horizontal',
            left: 'center',
					  inRange: {
							color: ['#3398DB','yellow']

						},
					textStyle:{
            	color:'#fff'
					},
					bottom: '0%'
        },
        series: [{
            name: '周分时段客流',
            type: 'heatmap',
            data: [],
            label: {
                normal: {
                    show: true,
									color:'#fff'
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(1, 1, 1, 0.8)',
									  textStyle:{
											color:'#fff'
										}
                }
            }
        }]
      }
    }
  },
  watch:{
    data(val){
      const _val = JSON.parse(JSON.stringify(val))
      console.log('接受到的数据',_val)
      this.options.series[0].data = _val.data
    }
  },
  created() {
    this.options.series[0].data = this.weekData
    // this.options = option;
  },
  methods: {
    base64ToBlob(code) {
      const parts = code.split(';base64,')
      const contentType = parts[0].split(':')[1]
      const raw = window.atob(parts[1])
      const rawLength = raw.length
      const uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], {
        type: contentType
      })
    },
    saveImage(fileName) {
      const aLink = document.createElement('a')
      const base64 = this.$refs.chart.getDataURL()
      const blob = this.base64ToBlob(base64) // new Blob([content]);

      const evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)
      aLink.click()
    }
  }
}
</script>
