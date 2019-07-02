<template>
  <v-chart
    theme="dark"
    :class="className"
    :style="{height:height,width:width}"
    :options="options"
    ref="chart"
  />
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "250px"
    },
    data: {
      type: Object,
      default() {
        return {
          data: [],
          legendData: [],
          name: "性别"
        };
      }
    }
  },
  data() {
    return {
      options: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: '1%',
          top: "middle",
          data: []
        },
        color:[ '#00B4D9', '#50E3C2'],
        series: [
          {
            name: "",
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            data: [],
            itemStyle: {
              normal:{
                  label:{
                    show: true,
                    formatter: '{b} : {c} ({d}%)'
                  },
                  labelLine :{show:true}
                },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }
    };
  },
  beforeDestroy() {
    this.options = null;
  },
  watch:{
     data(val){
			 this.options.series[0].data = []
			 this.options.series[0].name = '';
			 this.options.legend.data = []
			 let  _val = JSON.parse(JSON.stringify(val))
       console.log("xingbioe",_val)
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
  created() {
    console.warn(this.data)
    this.options.series[0].data = this.data.data
    this.options.series[0].name = this.data.name
    this.options.legend.data = this.data.legendData
  },
  methods: {
    base64ToBlob(code) {
      let parts = code.split(";base64,")
      let contentType = parts[0].split(":")[1]
      let raw = window.atob(parts[1])
      let rawLength = raw.length
      let uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], {
        type: contentType
      })
    },
    saveImage(fileName) {
      let aLink = document.createElement("a")
      let base64 = this.$refs.chart.getDataURL()
      let blob = this.base64ToBlob(base64); //new Blob([content]);

      let evt = document.createEvent("HTMLEvents")
      evt.initEvent("click", true, true) //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)
      aLink.click()
    }
  }
};
</script>
