import { randomString } from '@/libs/tool'
import * as d3 from 'd3'
// 操作类型
const enumActionType = {
  move: 0,
  select: 1,
  drawRect: 2,
  drawPolygon: 3,
  drawCircle: 4,
  drawEllipse: 5
}

const getOffset = (e, ele) => {
  const evt = e || window.event

  const srcObj = ele || evt.target || evt.srcElement

  return {
    offsetX: evt.clientX - srcObj.getBoundingClientRect().left, // 返回元素的大小及其相对于视口的位置
    offsetY: evt.clientY - srcObj.getBoundingClientRect().top // 点击位置距离当前body可视区域的x，y坐标
  }
}

export default {
  data() {
    return {
      enumActionType,
      transform: {
        x: 0,
        y: 0,
        k: 1
      },
      svg: null,
      shiftKeyDown: false,
      zoom: null,
      width: 0, // 图片原始大小
      height: 0,
      actionType: enumActionType.move // 默认为拖动
    }
  },
  methods: {
    /**
     *  初始化缩放
     */
    initZoom() {
      const $this = this

      this.zoom = d3
        .zoom()
        .on('start', () => {
          // 切换鼠标显示
          $this.svg.classed('active', false)
        })
        .on('zoom', function (data) {
          // 获取当前变换信息
          const { x, y, k } = d3.event.transform
          // 对画布进行缩放变换
          d3.select('.J_mark').attr(
            'transform',
            d3.zoomIdentity.translate(x, y).scale(k) // return node.__zoom,返回一个转换，
          )
        })
        .on('end', () => {
          $this.svg.classed('active', false)
        })
        .filter(
          (e) =>
            this.actionType === enumActionType.move || this.shiftKeyDown
        )

      // 禁用双击放大
      this.svg.call(this.zoom.transform, d3.zoomIdentity)
      this.svg.call(this.zoom).on('dblclick.zoom', null)
    },
    /*
     * @desc 适应屏幕
     * 转换必须在缩放之前应用
     */
    adjustScreen() {
      // 当前 transform 偏移量与缩放
      const svgNode = this.svg
      const graphEle = document.getElementsByClassName('J_mark')[0]
      const svgBox = this.svg.node().getBoundingClientRect()
      const graphBox = graphEle.getBoundingClientRect()

      this.zoom.translateTo(svgNode, this.width / 2, this.height / 2)

      // 偏移向量
      const wRatio = svgBox.width / this.width
      const hRatio = svgBox.height / this.height
      const kRatio = wRatio < hRatio ? wRatio : hRatio // 计算缩放系数
      const k = kRatio > 1 ? 1 : kRatio // 不管缩小还是放大，最终的放大系数都不会超过1

      // 缩放到指定大小
      this.zoom.scaleTo(svgNode, k)

      this.transform = d3.zoomTransform(graphEle) // 返回指定节点的当前转换注意，节点通常应该是一个 DOM 元素，而不是一个选择
    },
    resetAdjustScreen() {
      const { x, y, k } = this.transform
      console.log(d3.zoomIdentity.translate(x, y).scale(k))
      this.svg
        .transition()
        .duration(300)
        .call(this.zoom.transform, d3.zoomIdentity.translate(x, y).scale(k))
    },
    /**
     * 初始化传入的图片
     * @param {*} mark_result
     */
    initImage(mark_result = { regions: [] }) {
      const image = new Image()
      image.src = this.resource_url
      image.onload = () => {
        const { naturalWidth, naturalHeight } = image
        this.width = naturalWidth
        this.height = naturalHeight
        this.ready = true
        // 预标注数据
        const regions = mark_result
          ? mark_result.regions
            ? mark_result.regions
            : []
          : []
        this.regionList = regions.map((region) => ({
          id: randomString(8),
          ...region
        }))

        this.$nextTick(() => {
          this.adjustScreen()
          this.initDragEvent()
          this.initRectDragEvent()
        })
      }
    },
    /**
     * @desc svgZoom 操作，对应放大和缩小操作, 若指定了 k 值，则会忽略 status，缩放系数指定为 k
     * @param status  status 为 true 则是放大操作，为 false 则是缩小操作
     * @param k 指定缩放系数
     */
    svgZoom(status, k) {
      // 获取画布元素缩放后的缩放信息
      if (k) {
        // this.zoom.scaleTo(this.svg, k);
        this.svg
          .transition()
          .duration(300)
          .call(this.zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1))
        return
      }
      const ratio = status ? 1.1 : 0.9
      // 对画布进行缩放变换
      this.zoom.scaleBy(this.svg, ratio)
    },

    handleRegionContextMenu(e) {
      e.preventDefault()
      e.stopPropagation()

      const { offsetX, offsetY } = getOffset(e, this.svg.node())

      this.menuData = {
        show: true,
        x: offsetX,
        y: offsetY
      }
    },
    /**
     *  @desc svg 右键点击事件，禁止弹出浏览器菜单
    */
    svgContextMenu(e) {
      e.preventDefault()
      return false
    }
  }
}
