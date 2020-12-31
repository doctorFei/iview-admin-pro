import * as d3 from 'd3'
import { randomString } from '@/libs/tool'
// 操作类型
const enumActionType = {
  move: 0,
  select: 1,
  drawRect: 2,
  drawPolygon: 3,
  drawCircle: 4,
  drawEllipse: 5
}

export default {
  methods: {
    /**
     * 初始化键盘事件
     */
    initKeyEvents() {
      window.addEventListener('keydown', (e) => {
        this.shiftKeyDown = e.key === 'Shift'
      })

      // 选择操作快捷键
      window.addEventListener('keyup', (e) => {
        const { key } = e
        const values = ['e', 'r', 't', 'y']
        this.shiftKeyDown = false
        if (this.activeTags.length != 1 && values.includes(key) || this.readOnly) {
          return
        }

        switch (key) {
          case 'e':
            this.actionType = enumActionType.drawPolygon
            break
          case 'r':
            this.actionType = enumActionType.drawRect

            break
          case 't':
            this.actionType = enumActionType.drawCircle
            break
          case 'y':
            this.actionType = enumActionType.drawEllipse
            break
          case 'm':
            this.actionType = enumActionType.move
            break
          case 'w':
            if (this.currentDraw && this.currentDraw.type === 'polygon') {
              this.zoom.translateBy(this.svg, 0, 10)
            }
            break
          case 's':
            if (this.currentDraw && this.currentDraw.type === 'polygon') {
              this.zoom.translateBy(this.svg, 0, -10)
            }
            break
          case 'a':
            if (this.currentDraw && this.currentDraw.type === 'polygon') {
              this.zoom.translateBy(this.svg, -10, 0)
            }
            break
          case 'd':
            if (this.currentDraw && this.currentDraw.type === 'polygon') {
              this.zoom.translateBy(this.svg, 10, 0)
            }
            break
          case 'Backspace':
            this.deleteRegionList()
            break
          case 'Delete':
            this.deleteRegionList()
            break
          default:
            break
        }
      })
    },
    /**
     * 绘制圆形、椭圆形、矩形进行时
     */
    initDragEvent() {
      d3.select('#mark-img').call(
        d3
          .drag()
          .on('start', (d) => {
            if (this.actionType === enumActionType.drawRect) {
              this.currentDraw = {
                type: 'rect',
                start: {
                  x: d3.event.x,
                  y: d3.event.y
                },
                drag: {
                  x: d3.event.x,
                  y: d3.event.y
                }
              }
            }
            if (this.actionType === enumActionType.drawCircle) {
              this.currentDraw = {
                type: 'circle',
                start: {
                  x: d3.event.x,
                  y: d3.event.y
                },
                drag: {
                  x: d3.event.x,
                  y: d3.event.y
                }
              }
            }
            if (this.actionType === enumActionType.drawEllipse) {
              this.currentDraw = {
                type: 'ellipse',
                start: {
                  x: d3.event.x,
                  y: d3.event.y
                },
                drag: {
                  x: d3.event.x,
                  y: d3.event.y
                }
              }
            }
          })
          .on('drag', (d) => {
            // // 鼠标坐标
            const { dx, dy } = d3.event
            console.log(dx, dy)

            this.currentDraw.drag.x += dx
            this.currentDraw.drag.y += dy

            const {
              start: { x: startX, y: startY },
              drag: { x: endX, y: endY }
            } = this.currentDraw

            if (
              this.actionType === enumActionType.drawCircle ||
              this.actionType === enumActionType.drawEllipse
            ) {
              this.currentDraw.drag.dx = Math.abs(endX - startX)
              this.currentDraw.drag.dy = Math.abs(endY - startY)
            }
          })
          .on('end', (d) => {
            const {
              start: { x: startX, y: startY },
              drag: { x: endX, y: endY }
            } = this.currentDraw
            const id = randomString(8)
            const tagValue = this.activeTags[0]

            if (startX === endX || startY === endY) {
              this.currentDraw = null
              return
            }

            const width = Math.abs(endX - startX)
            const height = Math.abs(endY - startY)

            this.currentDraw.drag.dx = width
            this.currentDraw.drag.dy = height

            if (this.actionType === enumActionType.drawRect) {
              this.regionList = [
                ...this.regionList,
                {
                  id,
                  type: 'rect',
                  x: Math.min(startX, endX),
                  y: Math.min(startY, endY),
                  width: width < 10 ? 10 : width,
                  height: height < 10 ? 10 : height,
                  opacity: 0.8,
                  tags: this.isMultiple ? [...this.activeTags] : tagValue
                }
              ]

              this.currentDraw = null
              this.selectedItem = this.regionList[this.regionList.length - 1]
              this.selectedItemIdArr.push(id)
              this.rectLimit()
              this.$nextTick(() => {
                this.initRectDragEvent()
                this.initPointsDragEvent()
              })
            }
            if (this.actionType === enumActionType.drawCircle) {
              this.regionList = [
                ...this.regionList,
                {
                  id,
                  type: 'circle',
                  cx: startX,
                  cy: startY,
                  r: Math.hypot(width, height),
                  opacity: 0.8,
                  tags: this.isMultiple ? [...this.activeTags] : tagValue
                }
              ]
              this.currentDraw = null
              this.selectedItem = this.regionList[this.regionList.length - 1]
              this.selectedItemIdArr.push(id)

              this.circleLimit()
              this.$nextTick(() => {
                this.initCircleDragEvent()
                this.initCirclePointsDragEvent()
              })
            }
            if (this.actionType === enumActionType.drawEllipse) {
              this.regionList = [
                ...this.regionList,
                {
                  id,
                  type: 'ellipse',
                  cx: startX,
                  cy: startY,
                  rx: width,
                  ry: height,
                  opacity: 0.8,
                  tags: this.isMultiple ? [...this.activeTags] : tagValue
                }
              ]
              this.currentDraw = null
              this.selectedItem = this.regionList[this.regionList.length - 1]
              this.selectedItemIdArr.push(id)
              this.ellipseLimit()
              this.$nextTick(() => {
                this.initEllipseDragEvent()
                this.initEllipsePointsDragEvent()
              })
            }
          })
          .filter(
            (e) =>
              (this.actionType === enumActionType.drawRect ||
                this.actionType === enumActionType.drawCircle ||
                this.actionType === enumActionType.drawEllipse) &&
              !this.readOnly &&
              !window.event.ctrlKey &&
              !window.event.metaKey
          )
      )
    },

    initRectDragEvent() {
      d3.selectAll('rect.rect').call(
        d3
          .drag()
          .on('start', (e) => {
            d3.event.sourceEvent.stopPropagation()
            // this.selectedItem = this.regionList.find(item => item.id === d3.event.sourceEvent.target.id)
          })
          .on('drag', (e) => {
            d3.event.sourceEvent.stopPropagation()
            const { dx, dy } = d3.event

            this.selectedItem.x += dx
            this.selectedItem.y += dy

            this.rectLimit()
          })
          .on('end', (e) => {
            d3.event.sourceEvent.stopPropagation()
          })
          .filter((e) => !this.readOnly)
      )
    },
    initCircleDragEvent() {
      d3.selectAll('#circle').call(
        d3
          .drag()
          .on('start', (e) => {
            d3.event.sourceEvent.stopPropagation()
            // this.selectedItem = this.regionList.find(item => item.id === d3.event.sourceEvent.target.id)
          })
          .on('drag', (e) => {
            d3.event.sourceEvent.stopPropagation()
            const { dx, dy } = d3.event

            this.selectedItem.cx += dx
            this.selectedItem.cy += dy

            this.circleLimit()
          })
          .on('end', (e) => {
            d3.event.sourceEvent.stopPropagation()
          })
          .filter((e) => !this.readOnly)
      )
    },
    rectLimit() {
      if (this.selectedItem.x <= 0) {
        this.selectedItem.x = 0
      }

      if (this.selectedItem.y <= 0) {
        this.selectedItem.y = 0
      }

      if (this.selectedItem.width > this.width) {
        this.selectedItem.width = this.width
      }

      if (this.selectedItem.height > this.height) {
        this.selectedItem.height = this.height
      }

      if (this.selectedItem.x + this.selectedItem.width >= this.width) {
        this.selectedItem.x = this.width - this.selectedItem.width
      }

      if (this.selectedItem.y + this.selectedItem.height >= this.height) {
        this.selectedItem.y = this.height - this.selectedItem.height
      }
    },
    circleLimit() {
      const min = this.width < this.height ? this.width / 2 : this.height / 2
      if (this.selectedItem.r > min) {
        this.selectedItem.r = min
        this.selectedItem.cx = min
        this.selectedItem.cy = min
      }
      if (this.selectedItem.cx - this.selectedItem.r < 0) {
        this.selectedItem.cx = this.selectedItem.r
      }
      if (this.selectedItem.cy - this.selectedItem.r < 0) {
        this.selectedItem.cy = this.selectedItem.r
      }
      if (this.selectedItem.cx + this.selectedItem.r > this.width) {
        this.selectedItem.cx = this.width - this.selectedItem.r
      }
      if (this.selectedItem.cy + this.selectedItem.r > this.height) {
        this.selectedItem.cy = this.height - this.selectedItem.r
      }
    },
    ellipseLimit() {
      if (this.selectedItem.rx > this.width / 2) {
        this.selectedItem.rx = this.width / 2
        this.selectedItem.cx = this.width / 2
      }
      if (this.selectedItem.ry > this.height / 2) {
        this.selectedItem.rx = this.height / 2
        this.selectedItem.cx = this.height / 2
      }
      if (this.selectedItem.cx - this.selectedItem.rx < 0) {
        this.selectedItem.cx = this.selectedItem.rx
      }
      if (this.selectedItem.cy - this.selectedItem.ry < 0) {
        this.selectedItem.cy = this.selectedItem.ry
      }
      if (this.selectedItem.cx + this.selectedItem.rx > this.width) {
        this.selectedItem.cx = this.width - this.selectedItem.rx
      }
      if (this.selectedItem.cy + this.selectedItem.ry > this.height) {
        this.selectedItem.cy = this.height - this.selectedItem.ry
      }
    },
    initEllipseDragEvent() {
      d3.selectAll('#ellipse').call(
        d3
          .drag()
          .on('start', (e) => {
            d3.event.sourceEvent.stopPropagation()
            // this.selectedItem = this.regionList.find(item => item.id === d3.event.sourceEvent.target.id)
          })
          .on('drag', (e) => {
            d3.event.sourceEvent.stopPropagation()
            const { dx, dy } = d3.event

            this.selectedItem.cx += dx
            this.selectedItem.cy += dy

            this.ellipseLimit()
          })
          .on('end', (e) => {
            d3.event.sourceEvent.stopPropagation()
          })
          .filter((e) => !this.readOnly)
      )
    },
    initPolygonDragEvent() {
      d3.selectAll('polygon.polygon').call(
        d3
          .drag()
          .on('start', (e) => {
            d3.event.sourceEvent.stopPropagation()
            // this.selectedItem = this.regionList.find(item => item.id === d3.event.sourceEvent.target.id)
          })
          .on('drag', (e) => {
            d3.event.sourceEvent.stopPropagation()
            const { dx, dy } = d3.event

            const length = this.selectedItem.points.length

            let xMove = true
            let yMove = true

            for (let i = 0; i < length; i++) {
              const { x, y } = this.selectedItem.points[i]
              if (x + dx < 0 || x + dx > this.width) {
                xMove = false
              }
              if (y + dy < 0 || y + dy > this.height) {
                yMove = false
              }
            }

            this.selectedItem.points = this.selectedItem.points.map(
              ({ x, y, ...other }) => ({
                x: xMove ? x + dx : x,
                y: yMove ? y + dy : y,
                ...other
              })
            )
          })
          .on('end', (e) => {
            d3.event.sourceEvent.stopPropagation()
          })
          .filter((e) => !this.readOnly)
      )
    },

    initPointsDragEvent() {
      let pointDirection = ''
      let pointIndex = ''
      let pointId = ''
      d3.selectAll('.point-rect').call(
        d3
          .drag()
          .on('start', (d) => {
            pointDirection = d3.event.sourceEvent.target.getAttribute(
              'data-point-action-type'
            )
            pointId = d3.event.sourceEvent.target.getAttribute(
              'data-point-id'
            )
            this.selectedItem = this.regionList.find((item) => item.id === pointId)

            pointIndex = d3.event.sourceEvent.target.getAttribute('data-index')
            d3.event.sourceEvent.stopPropagation()
          })
          .on('drag', (d) => {
            d3.event.sourceEvent.stopPropagation()

            const { dx, dy } = d3.event

            const { x, y, width, height } = this.selectedItem

            switch (pointDirection) {
              case 'tl':
                if (width >= 10 && height >= 10) {
                  this.selectedItem.x += dx
                  this.selectedItem.y += dy

                  this.selectedItem.width -= dx
                  this.selectedItem.height -= dy
                }

                if (width < 10 && dx < 0) {
                  this.selectedItem.x += dx
                  this.selectedItem.width -= dx
                }

                if (height < 10 && dy < 0) {
                  this.selectedItem.y += dy
                  this.selectedItem.height -= dy
                }

                if (width < 5) {
                  this.selectedItem.width = 5
                }

                if (height < 5) {
                  this.selectedItem.height = 5
                }

                break
              case 'tm':
                if (height >= 10 || (height < 10 && dy < 0)) {
                  this.selectedItem.y += dy
                  this.selectedItem.height -= dy
                }

                if (height < 5) {
                  this.selectedItem.height = 5
                }
                break
              case 'tr':
                if (width >= 10 && height >= 10) {
                  this.selectedItem.y += dy
                  this.selectedItem.height -= dy
                  this.selectedItem.width += dx
                }

                if (width < 10) {
                  this.selectedItem.width = 10
                }

                if (height < 10 && dy < 0) {
                  this.selectedItem.y += dy
                  this.selectedItem.height -= dy
                }

                if (height < 5) {
                  this.selectedItem.height = 5
                }
                break
              case 'ml':
                if (width >= 10 || (width < 10 && dx < 0)) {
                  this.selectedItem.x += dx
                  this.selectedItem.width -= dx
                }

                if (width < 5) {
                  this.selectedItem.width = 5
                }
                break
              case 'mr':
                if (width >= 10 || (width < 10 && dx < 0)) {
                  this.selectedItem.width += dx
                }

                if (width < 10) {
                  this.selectedItem.width = 10
                }
                break
              case 'bl':
                if (width >= 10 && height >= 10) {
                  this.selectedItem.x += dx
                  this.selectedItem.height += dy
                  this.selectedItem.width -= dx
                }

                if (height < 10) {
                  this.selectedItem.height = 10
                }

                if (width < 10 && dx < 0) {
                  this.selectedItem.x += dx
                  this.selectedItem.width -= dx
                }

                if (width < 5) {
                  this.selectedItem.width = 5
                }
                break
              case 'bm':
                if (height >= 10 || (height < 10 && dy > 0)) {
                  this.selectedItem.height += dy
                }

                if (height < 5) {
                  this.selectedItem.height = 5
                }
                break
              case 'br':
                if (width >= 10 && height >= 10) {
                  this.selectedItem.width += dx
                  this.selectedItem.height += dy
                }

                if (width < 10) {
                  this.selectedItem.width = 10
                }

                if (height < 10) {
                  this.selectedItem.height = 10
                }
                break
              case 'polygon':
                const point = this.selectedItem.points[pointIndex]
                point.x += dx
                point.y += dy
                console.log(point)

                if (point.x <= 0) {
                  point.x = 0
                }

                if (point.y <= 0) {
                  point.y = 0
                }

                if (point.x >= this.width) {
                  point.x = this.width
                }

                if (point.y >= this.height) {
                  point.y = this.height
                }
                break
              default:
                break
            }
          })
          .on('end', (d) => {
            d3.event.sourceEvent.stopPropagation()
            this.selectedItem.type === 'rect' && this.rectLimit()
          })
          .filter((e) => !this.readOnly)
      )
    },

    initPolygonPointsDragEvent() {
      let pointIndex = ''
      let pointId = ''
      d3.selectAll('.point-polygon').call(
        d3
          .drag()
          .on('start', (d) => {
            pointId = d3.event.sourceEvent.target.getAttribute(
              'data-point-id'
            )
            this.selectedItem = this.regionList.find((item) => item.id === pointId)

            pointIndex = d3.event.sourceEvent.target.getAttribute('data-index')
            d3.event.sourceEvent.stopPropagation()
          })
          .on('drag', (d) => {
            d3.event.sourceEvent.stopPropagation()

            const { dx, dy } = d3.event

            const point = this.selectedItem.points[pointIndex]
            point.x += dx
            point.y += dy

            if (point.x <= 0) {
              point.x = 0
            }

            if (point.y <= 0) {
              point.y = 0
            }

            if (point.x >= this.width) {
              point.x = this.width
            }

            if (point.y >= this.height) {
              point.y = this.height
            }
          })
          .on('end', (d) => {
            d3.event.sourceEvent.stopPropagation()
          })
          .filter((e) => !this.readOnly)
      )
    },

    initCirclePointsDragEvent() {
      let pointDirection = ''
      let pointIndex = ''
      let pointId = ''
      d3.selectAll('.point-circle').call(
        d3
          .drag()
          .on('start', (d) => {
            pointDirection = d3.event.sourceEvent.target.getAttribute(
              'data-point-action-type'
            )
            pointIndex = d3.event.sourceEvent.target.getAttribute('data-index')
            pointId = d3.event.sourceEvent.target.getAttribute(
              'data-point-id'
            )
            this.selectedItem = this.regionList.find((item) => item.id === pointId)

            d3.event.sourceEvent.stopPropagation()
          })
          .on('drag', (d) => {
            d3.event.sourceEvent.stopPropagation()

            const { dx, dy } = d3.event

            switch (pointDirection) {
              case 'tm':
                this.selectedItem.r = this.selectedItem.r - dy >= 0 ? this.selectedItem.r - dy : this.selectedItem.r
                break

              case 'ml':
                this.selectedItem.r = this.selectedItem.r - dx >= 0 ? this.selectedItem.r - dx : this.selectedItem.r
                break
              case 'mr':
                this.selectedItem.r = this.selectedItem.r + dx >= 0 ? this.selectedItem.r + dx : this.selectedItem.r
                break

              case 'bm':
                this.selectedItem.r = this.selectedItem.r + dy >= 0 ? this.selectedItem.r + dy : this.selectedItem.r
                break
              default:
                break
            }
          })
          .on('end', (d) => {
            d3.event.sourceEvent.stopPropagation()
            this.selectedItem.type === 'circle' && this.circleLimit()
          })
          .filter((e) => !this.readOnly)
      )
    },

    initEllipsePointsDragEvent() {
      let pointDirection = ''
      let pointIndex = ''
      let pointId = ''
      d3.selectAll('.point-ellipse').call(
        d3
          .drag()
          .on('start', (d) => {
            pointDirection = d3.event.sourceEvent.target.getAttribute(
              'data-point-action-type'
            )
            pointIndex = d3.event.sourceEvent.target.getAttribute('data-index')
            pointId = d3.event.sourceEvent.target.getAttribute(
              'data-point-id'
            )
            this.selectedItem = this.regionList.find((item) => item.id === pointId)
            console.log(this.selectedItem)
            d3.event.sourceEvent.stopPropagation()
          })
          .on('drag', (d) => {
            d3.event.sourceEvent.stopPropagation()

            const { dx, dy } = d3.event

            switch (pointDirection) {
              case 'tm':
                this.selectedItem.ry = this.selectedItem.ry - dy >= 0 ? this.selectedItem.ry - dy : this.selectedItem.ry
                break

              case 'ml':
                this.selectedItem.rx = this.selectedItem.rx - dx >= 0 ? this.selectedItem.rx - dx : this.selectedItem.rx
                break
              case 'mr':
                this.selectedItem.rx = this.selectedItem.rx + dx >= 0 ? this.selectedItem.rx + dx : this.selectedItem.rx
                break

              case 'bm':
                this.selectedItem.ry = this.selectedItem.ry + dy >= 0 ? this.selectedItem.ry + dy : this.selectedItem.ry
                break
              default:
                break
            }
          })
          .on('end', (d) => {
            d3.event.sourceEvent.stopPropagation()
            this.selectedItem.type === 'ellipse' && this.ellipseLimit()
          })
          .filter((e) => !this.readOnly)
      )
    }
  }
}
