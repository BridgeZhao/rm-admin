import { Message } from 'element-ui'
/**
 * 图片按宽高比例进行自动缩放
 * @param ImgObj
 *     缩放图片源对象
 * @param maxWidth
 *     允许缩放的最大宽度
 * @param maxHeight
 *     允许缩放的最大高度
 * @usage
 *     调用：<img src="图片" onload="javascript:DrawImage(this,100,100)">
 */
export  function AutoImage(imgsrc,maxWidth){
  return new Promise(resolve => {
    let  Ratio = 1
    let  size = {width: 0, height: 0, scale: Ratio}
    const sourceImg=new Image()
    sourceImg.src=imgsrc
    if(imgsrc) {
      sourceImg.onload = function () {
        const w = sourceImg.width
        const h = sourceImg.height
        console.log(w, h)
        if (maxWidth < w) {
          Ratio = w / maxWidth
          this.width = maxWidth
          this.height = h / Ratio
          size = {width: this.width, height: this.height, scale: Ratio}
        } else {
          size = {width: w, height: h, scale: Ratio}
        }
        resolve(size)
      }
    }else{
      resolve(size)
    }
  })
}
export class DrawImage {
  constructor(canvas, option) {
    this.opt = {
      point: {
        fillStyle: 'rgba(254, 0, 0, 0.5)',
        strokeStyle: 'rgba(254, 0, 0, 0.9)'
      }, line: {
        fillStyle: 'rgba(254, 0, 0, 0.5)',
        strokeStyle: 'rgba(254, 0, 0, 0.8)'
      },active:{
        fillStyle: 'rgba(0, 127, 206, .8)',
        strokeStyle: 'rgba(0, 127, 206, .8)'
      }
    }
    this.aryNum = option.aryNum
    this.event = option.event||false
    this.prointAry = {}
    this.areaText = option.areaText || '未知区域'
    this.scale = option.scale || 1
    this.prointAry[this.aryNum] = {data: [], areaId: this.aryNum, areaText: this.areaText}
    this.canvas = canvas
    this.prointSize = option.prointSize || 5
    this.ctx = canvas.getContext('2d')
  }

  drawRect(ract) {
    const ctx = this.ctx
    const can = this.canvas
    const prointAll = this.prointAry
    const opt = {
      point: {
        fillStyle: 'rgba(254, 0, 0, 0.5)',
        strokeStyle: 'rgba(254, 0, 0, 0.9)'
      }, line: {
        fillStyle: 'rgba(254, 0, 0, 0.3)',
        strokeStyle: 'rgba(254, 0, 0, 0.5)'
      }, active: {
        fillStyle: 'rgba(0, 127, 206, .8)',
        strokeStyle: 'rgba(0, 127, 206, .8)'
      }
    }
    ctx.clearRect(0, 0, can.width, can.height)
    ctx.beginPath()
    for (const p in prointAll) {
      const prointObj = prointAll[p]
      let isActive = false
      if (this.prointAry[this.aryNum]) {
        isActive = Number(p) === Number(this.prointAry[this.aryNum].areaId)
      }
      const point = prointAll[p].data

      if (isActive) {
        ctx.fillStyle = opt.active.fillStyle
        ctx.strokeStyle = opt.active.strokeStyle
      } else {
        ctx.fillStyle = opt.line.fillStyle
        ctx.strokeStyle = opt.line.strokeStyle
      }
      let edit = false
      if (ract) {
        edit = true
        if (point.length === 4 && isActive) {
          if (ract.index === 0) {
            point[1].y = ract.y
            point[3].x = ract.x
          } else if (ract.index === 1) {
            point[0].y = ract.y
            point[2].x = ract.x
          } else if (ract.index === 2) {
            point[1].x = ract.x
            point[3].y = ract.y
          } else if (ract.index === 3) {
            point[0].x = ract.x
            point[2].y = ract.y
          }
        }
      } else {
        if (point.length >= 4) {
          point.length = 4
          point[1] = {x: point[1].x, y: point[0].y, index: 1}
          point[2] = {x: point[1].x, y: point[2].y, index: 2}
          point[3] = {x: point[0].x, y: point[2].y, index: 3}
        }
      }

      if (point.length > 0) {
        ctx.moveTo(point[0].x, point[0].y)
        for (let i = 1; i < point.length; i++) {
          ctx.lineTo(point[i].x, point[i].y)
        }
        ctx.lineTo(point[0].x, point[0].y)
      }
      ctx.fill()
      ctx.stroke()
      ctx.closePath()
      ctx.fillStyle = opt.point.fillStyle
      ctx.strokeStyle = opt.point.strokeStyle
      // 绘制顶点
      for (let i = 0; i < point.length; i++) {
        ctx.beginPath()
        if (edit) {
          if (point[i].index === ract.index && isActive) {
            ctx.arc(ract.x, ract.y, this.prointSize, 0, Math.PI * 2)
          }
        }
        ctx.arc(point[i].x, point[i].y, this.prointSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
      }
      ctx.font = '18px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillStyle = '#ffffff'
      const polygon = calculateCenterPoint(point)
      ctx.fillText(prointObj.areaText, polygon.x, polygon.y)
    }
  }
  init(point_data) {
    if (point_data) {
      this.prointAry = point_data
      this.drawRect()
    }
    if (this.event) {
      return
    }
    this.canvas.onmousedown = (ev) => {
      let rect = {}
      const x = ev.clientX
      const y = ev.clientY
      const bbox = this.canvas.getBoundingClientRect()
      const startX = (x - bbox.left) * (this.canvas.width / bbox.width)
      const startY = (y - bbox.top) * (this.canvas.height / bbox.height)
      if (!this.prointAry[this.aryNum]) {
        this.prointAry[this.aryNum] = {data: [], areaId: this.aryNum, areaText: this.areaText}
      } else {
        this.prointAry[this.aryNum].areaId = this.aryNum
      }
      const point = this.prointAry[this.aryNum].data
      let isSelect = false

      for (let i = point.length - 1; i >= 0; i--) {
        rect = point[i]
        const widthstart = rect.x - this.prointSize
        const widthend = rect.x + this.prointSize
        const heightstart = rect.y - this.prointSize
        const heightend = rect.y + this.prointSize
        // 判断这个点是否在矩形框中
        if ((startX >= widthstart && startX <= widthend) && (startY >= heightstart) && (startY <= heightend)) {
          isSelect = true
          break
        }
      }
      if (isSelect) {
        this.canvas.style.cursor = 'move'
        document.onmousemove = (ev) => {
          const x = ev.clientX
          const y = ev.clientY
          const m_startX = (x - bbox.left) * (this.canvas.width / bbox.width)
          const m_startY = (y - bbox.top) * (this.canvas.height / bbox.height)
          rect.x = m_startX
          rect.y = m_startY
          this.drawRect(rect)
        }
        document.onmouseup = () => {
          this.canvas.style.cursor = 'crosshair'
          document.onmousemove = null
          this.drawRect()
        }
      } else {
        this.canvas.style.cursor = 'crosshair'
        if (point.length >= 4) {
          Message({
            message: '超出点位限制',
            type: 'warning',
            duration: 2 * 1000
          })
          return
        }
        const _rect = {x: startX, y: startY, index: this.prointAry[this.aryNum].data.length}
        this.prointAry[this.aryNum].data.push(_rect)
        this.drawRect()
      }
    }
  }
  setAllPoint(areaId, areaText, checkType) {
    this.aryNum = areaId
    this.prointAry[this.aryNum] = {
      data: [{x: 0, y: 0, index: 0},
        {x: this.canvas.width, y: 0, index: 1},
        {x: this.canvas.width, y: this.canvas.height, index: 2},
        {x: 0, y: this.canvas.height, index: 3}], checkType: checkType, areaId: areaId, areaText: areaText
    }
    this.drawRect(this.prointAry[this.aryNum])
    return {point: this.prointAry}
  }

  getPoint() {
    for (const itm in this.prointAry) {
      if (this.prointAry[itm].data.length === 0) {
        delete this.prointAry[itm]
      }
    }
    return { point: this.prointAry}
  }
  add(aryNum, areaText, checkType) {
    this.aryNum = aryNum
    this.areaText = areaText
    if (!this.prointAry.hasOwnProperty(aryNum.toString())) {
      this.prointAry[aryNum] = {data: [], checkType: checkType, areaText: areaText}
    } else {
      this.prointAry[aryNum].checkType = checkType
    }
    this.drawRect()
  }

  cancel() {
    if (this.prointAry[this.aryNum] && this.prointAry[this.aryNum].data.length > 0) {
      this.prointAry[this.aryNum].data.length = this.prointAry[this.aryNum].data.length - 1
      this.drawRect()
    }
  }
  clearaAll(){
    this.prointAry={}
    this.drawRect()
  }
  clear(val) {
    delete this.prointAry[val]
    this.drawRect()
  }
}
export function calculateCenterPoint(areas) {
  let maxX = 0
  let minX = Infinity
  let maxY = 0
  let minY = Infinity
  Array.prototype.forEach.call(areas, () => {
    let i = 0
    while (i < areas.length) {
      const {x, y} = areas[i]
      if (x < minX) {
        minX = x
      }
      if (x > maxX) {
        maxX = x
      }
      if (y < minY) {
        minY = y
      }
      if (y > maxY) {
        maxY = y
      }
      i++
    }
  })
  return {
    x: minX + (maxX - minX) / 2,
    y: minY + (maxY - minY) / 2
  }
}
