import echarts from 'echarts'
export default {
	series:{
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
		}
	}
}
