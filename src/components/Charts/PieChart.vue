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
      default: '250px'
    },
    data: {
      type: Object,
      default() {
        return {
          data: [],
          legendData: [],
          name: '性别'
        }
      }
    }
  },
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: '0%',
          top: 'middle',
          data: []
        },
        color:[ '#00B4D9', '#50E3C2'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [],
            itemStyle: {
              normal:{
                  label:{
                    show: true,
                    formatter: '{b} : {c} ({d}%)'
                  },
                  labelLine :{show:true,length:1}
                },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  watch:{
     data(val){
			 this.options.series[0].data = []
			 this.options.series[0].name = ''
			 this.options.legend.data = []
			 const  _val = JSON.parse(JSON.stringify(val))
       console.log('xingbioe',_val)
			 let datas = _val.data
			 if(_val.data.length !== 0 && _val.data[0].value === 0 && _val.data[1].value === 0){
						datas = []
			 }else if(_val.data.length === 0){
				  datas = []
			 }
			 this.options.series[0].data = datas
			 this.options.series[0].name = _val.name
			 this.options.legend.data = _val.legendData
    }
  },
  beforeDestroy() {
    this.options = null
  },
  created() {
    console.warn(this.data)
    this.options.series[0].data = this.data.data
    this.options.series[0].name = this.data.name
    this.options.legend.data = this.data.legendData
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
