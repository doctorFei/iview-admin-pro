<template>
  <div class="main flex flex-column">
    <div class="slider-wrap">
      <Slider v-model="gap" :min="5" :max="100"></Slider>
    </div>
    <div class="relative video-container flex items-center justify-center">
      <video ref="videoPlayer" class="target-video js-video-player video-js" />
    </div>

    <div
      ref="markBar"
      class="marker-bar js-mark-bar relative overflow-auto"
      @click="handleBarAreaClick"
    >
      <canvas
        ref="videoCanvas"
        class="cap-canvas absolute"
        :width="videoCanvasRect.width"
        height="100"
        :style="`left: ${currentTime * gap}px;`"
      />
      <div
        class="cursor absolute"
        :style="`left: ${currentTime * gap}px`"
      ></div>
      <div ref="timeLine" class="time-line absolute">
        <div
          class="time-line-part"
          v-show="duration - 5 * index >= -1"
          :style="`left:${index * 5 * gap}px;width:${calWidth(index)}px`"
          v-for="(item, index) in timeLineData"
          :key="index"
        >
          <span>
            {{ lineTime(index) }}
          </span>
          <i v-show="calWidth(index) >= gap" :style="`left:${gap}px`"></i>
          <i
            v-show="calWidth(index) >= 2 * gap"
            :style="`left:${gap * 2}px`"
          ></i>
          <i
            v-show="calWidth(index) >= 3 * gap"
            :style="`left:${gap * 3}px`"
          ></i>
          <i
            v-show="calWidth(index) >= 4 * gap"
            :style="`left:${gap * 4}px`"
          ></i>
        </div>
      </div>
      <div class="regions-wrapper">
        <div
          v-if="currentDraw && currentDraw.start.x !== currentDraw.drag.x"
          class="region spec absolute"
          :style="`left: ${Math.min(
            currentDraw.start.x,
            currentDraw.drag.x
          )}px;width: ${Math.abs(currentDraw.drag.x - currentDraw.start.x)}px`"
        ></div>
        <div
          :data-index="index"
          v-for="(region, index) in regions"
          :key="index"
          :class="{ spec: dragging }"
          class="js-region region absolute"
          :style="`left: ${region.start * gap}px;width: ${
            (region.end - region.start) * gap
          }px`"
        >
          <p
            :data-index="index"
            data-direction="left"
            class="region-border left js-region-border"
          ></p>
          <p
            :data-index="index"
            data-direction="right"
            class="region-border right js-region-border"
          ></p>
        </div>
      </div>
    </div>

    <div class="region-list-wrap relative flex-grow-1 h0">
      <div class="region-list h-100 flex flex-column">
        <div class="item flex">
          <p>序号</p>
          <p>开始(s)</p>
          <p>结束(s)</p>
          <p>时长(s)</p>
          <p>类型</p>
          <p>操作</p>
          <p>备注</p>
        </div>
        <div v-show="!regions.length" class="item tc null">
          请在视频轨道区域上拖拽选择区域进行分段标注
        </div>
        <ul
          ref="regionContainer"
          class="region-list-content flex-grow-1 h0 overflow-auto"
        >
          <li v-for="(item, index) in regions" :key="index" class="item flex">
            <p>{{ index + 1 }}</p>
            <p>{{ item.start.toFixed(3) }}</p>
            <p>{{ item.end.toFixed(3) }}</p>
            <p>{{ (item.end - item.start).toFixed(3) }}</p>
            <p>
              <Select style="width: 100%" v-model="item.type">
                <Option
                  v-for="item in typeList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </p>
            <p>
              <ButtonGroup>
                <!--切换状态-->
                <Button type="success" @click="handleRegionPlayPause(index)"
                  ><Icon type="ios-play" />/<Icon type="ios-pause"
                /></Button>
                <Button type="error" @click="handleRegionDel(index)"
                  ><Icon type="ios-trash"
                /></Button>
              </ButtonGroup>
            </p>
            <p>
              <Input v-model="item.info" type="textarea" placeholder="备注" />
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'

import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import testVideo from './test.mp4'

// 计算 offset 数值，如果传入了 ele 参数，则计算基于该 ele 的 offset
const getOffset = (e, ele) => {
  const evt = e || window.event

  const srcObj = ele || evt.target || evt.srcElement

  return {
    offsetX: evt.clientX - srcObj.getBoundingClientRect().left,
    offsetY: evt.clientY - srcObj.getBoundingClientRect().top
  }
}

export default {
  name: 'Main',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      videoPlay: null,
      readOnly: false,
      bad: false,
      ready: false,
      resource_url: '',
      duration: 0,
      timeLineData: [],
      dragging: false,
      currentTime: 0,
      gap: 20,
      videoCanvasRect: {
        width: 0,
        height: 0
      },
      videoEl: null,
      canvasContext: null,
      currentDraw: null,
      regions: [],
      regionPlayEnd: 0,
      typeList: [
        {
          value: 'shot',
          label: '射门'
        },
        {
          value: 'foot',
          label: '点球'
        },
        {
          value: 'celebrate',
          label: '庆祝'
        }
      ]
    }
  },
  mounted () {
    // 初始化外界调用接口
    window.initMarkData = this.initData
    window.markSubmit = this.handleSubmit
    window.markBad = this.handleMarkBad

    // 加载资源
    this.handleNext()

    this.initMarkBarDrag()
  },
  methods: {
    handleNext () {
      window.initMarkData({
        resource_url: testVideo,
        readOnly: false,
        typeList: [
          {
            value: 'shot',
            label: '射门'
          },
          {
            value: 'foot',
            label: '点球'
          },
          {
            value: 'celebrate',
            label: '庆祝'
          }
        ],
        mark_result: {
          bad: false,
          end: 229.44,
          file: testVideo,
          regions: [
            {
              end: 8.049649161037262,
              start: 5.79974722161691,
              type: 'shot',
              info: 'world'
            },
            {
              end: 13.949392024406189,
              start: 11.049518413597733,
              type: 'celebrate',
              info: 'come'
            }
          ]
        }
      })
    },

    lineTime (index) {
      if (index < 12) {
        return index * 5
      }

      const total = index * 5

      const min = Math.floor(total / 60)

      const sec = total % 60

      return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
    },

    handleBarAreaClick (e) {
      const { offsetX } = getOffset(e, this.$refs.markBar)

      const time = offsetX / this.gap

      if (time < this.duration) {
        this.videoPlayer.currentTime(time)
      }
    },

    calWidth (index) {
      if (this.duration > 5 * index && this.duration < 5 * index + 4) {
        return (this.duration - 5 * index) * this.gap
      }

      return this.gap * 5
    },

    initRegionDrag () {
      let regionIndex = ''
      d3.selectAll('.js-region').call(
        d3
          .drag()
          .on('start', (e) => {
            d3.event.sourceEvent.stopPropagation()
            regionIndex = d3.event.sourceEvent.target.getAttribute(
              'data-index'
            )
          })
          .on('drag', (e) => {
            d3.event.sourceEvent.stopPropagation()

            this.dragging = true

            const { dx } = d3.event

            const step = dx / this.gap

            this.regions[regionIndex].start += step
            this.regions[regionIndex].end += step
          })
          .on('end', (e) => {
            d3.event.sourceEvent.stopPropagation()

            const { start, end } = this.regions[regionIndex]
            const regionDuration = end - start

            if (end > this.duration) {
              this.$Message.error({
                content: '分段区域不能超过视频最大时长'
              })
              this.regions[regionIndex].start = this.duration - regionDuration
              this.regions[regionIndex].end = this.duration
              return
            }

            if (start < 0) {
              this.$Message.error({
                content: '分段区域不能起始点不能小于0'
              })
              this.regions[regionIndex].start = 0
              this.regions[regionIndex].end = regionDuration
              return
            }

            // 检查重合
            const len = this.regions.length
            for (let i = 0; i < len; i++) {
              const item = this.regions[i]

              if (
                (start < item.start && end > item.start) ||
                (start < item.end && end > item.end) ||
                (start > item.start && end < item.end)
              ) {
                this.$Message.error({
                  content: '分段区域不能重合'
                })
              }
            }
          })
      )

      let direction = ''

      let stepX = 0
      d3.selectAll('.js-region-border').call(
        d3
          .drag()
          .on('start', (e) => {
            d3.event.sourceEvent.stopPropagation()
            regionIndex = d3.event.sourceEvent.target.getAttribute(
              'data-index'
            )
            direction = d3.event.sourceEvent.target.getAttribute(
              'data-direction'
            )
            stepX = 0
          })
          .on('drag', (e) => {
            d3.event.sourceEvent.stopPropagation()

            this.dragging = true

            const { dx } = d3.event

            const step = dx / this.gap

            const { offsetX } = getOffset(
              d3.event.sourceEvent,
              this.$refs.markBar
            )

            if (direction === 'left') {
              this.regions[regionIndex].start = offsetX / this.gap
            } else {
              this.regions[regionIndex].end += step
            }
          })
          .on('end', (e) => {
            d3.event.sourceEvent.stopPropagation()
            const { start, end } = this.regions[regionIndex]
            const regionDuration = end - start

            if (end > this.duration) {
              this.$Message.error({
                content: '分段区域不能超过视频最大时长'
              })
              this.regions[regionIndex].start = this.duration - regionDuration
              this.regions[regionIndex].end = this.duration
              return
            }

            if (start < 0) {
              this.$Message.error({
                content: '分段区域不能起始点不能小于0'
              })
              this.regions[regionIndex].start = 0
              this.regions[regionIndex].end = regionDuration
              return
            }

            // 检查重合
            const len = this.regions.length
            for (let i = 0; i < len; i++) {
              const item = this.regions[i]

              if (
                (start < item.start && end > item.start) ||
                (start < item.end && end > item.end) ||
                (start > item.start && end < item.end)
              ) {
                this.$Message.error({
                  content: '分段区域不能重合'
                })
              }
            }
          })
      )
    },

    initMarkBarDrag () {
      d3.select('.js-mark-bar').call(
        d3
          .drag()
          .on('start', (e) => {
            d3.event.sourceEvent.stopPropagation()
            this.currentDraw = {
              start: {
                x: d3.event.x - 20
              },
              drag: {
                x: d3.event.x - 20
              }
            }

            // getOffset()
            // this.selectedItem = this.regions.find(item => item.id === d3.event.sourceEvent.target.id)
          })
          .on('drag', (e) => {
            d3.event.sourceEvent.stopPropagation()

            const { dx } = d3.event

            this.currentDraw.drag.x += dx
          })
          .on('end', (e) => {
            d3.event.sourceEvent.stopPropagation()
            const { x: startX } = this.currentDraw.start
            const { x: dragX } = this.currentDraw.drag

            if (Math.abs(dragX - startX) > this.gap) {
              let start
              let end
              if (startX > dragX) {
                start = dragX / this.gap
                end = startX / this.gap
              } else {
                start = startX / this.gap
                end = dragX / this.gap
              }

              console.log(end)

              // TODO 校验是否超过区域
              if (end > this.duration) {
                this.$Message.error({
                  content: '分段区域不能超过视频最大时长'
                })
                this.currentDraw = null
                return
              }

              // 检查重合
              const len = this.regions.length
              let targetIndex = len
              for (let i = 0; i < len; i++) {
                const item = this.regions[i]

                if (
                  (start < item.start && end > item.start) ||
                  (start < item.end && end > item.end) ||
                  (start > item.start && end < item.end)
                ) {
                  this.$Message.error({
                    content: '分段区域不能重合'
                  })
                  this.currentDraw = null
                  return
                }

                if (start < item.start && targetIndex === len) {
                  targetIndex = i
                }
              }

              // 排序插入
              this.regions.splice(targetIndex, 0, {
                start,
                end,
                type: '',
                info: ''
              })

              this.$nextTick(() => {
                this.initRegionDrag()
              })
            }

            this.currentDraw = null
          })
      )
    },

    updateRegionIndex () {
      [...document.getElementsByClassName('wavesurfer-region')]
        .sort(
          (a, b) => a.getAttribute('data-start') - b.getAttribute('data-start')
        )
        .forEach((item, index) => {
          item.getElementsByClassName('region-label')[0].innerText = index + 1
        })
    },

    // region 播放、暂停
    handleRegionPlayPause (index) {
      const { start, end } = this.regions[index]

      const currentTime = this.videoPlayer.currentTime()

      if (currentTime - start > -0.05 && end - currentTime > -0.05) {
        if (this.videoPlayer.paused()) {
          if (Math.abs(end - currentTime) < 0.05) {
            this.videoPlayer.currentTime(start)
          }
          this.videoPlayer.play()
          this.regionPlayEnd = end
        } else {
          this.videoPlayer.pause()
          this.regionPlayEnd = 0
        }
      } else if (start < this.duration) {
        this.videoPlayer.currentTime(start)
        this.regionPlayEnd = end
      }
    },

    // region 删除
    handleRegionDel (index) {
      this.dragging = true
      this.regions.splice(index, 1)
      this.$nextTick(() => {
        this.dragging = false
      })
    },

    // 初始化组件数据
    // data: { resource_url: '', api_url: '', fetch_type: '', fetch_plugin_id: '', mark_result: {} }
    async initData ({ resource_url, typeList, readOnly, mark_result }) {
      // 资源链接
      this.resource_url = resource_url

      this.dragging = false

      this.typeList = typeList

      // 清除 regions
      this.regions = mark_result ? mark_result.regions || [] : []

      // 重新初始化是否为坏数据
      this.bad = false

      // 加载完成状态切换
      this.ready = false

      // 只读
      this.readOnly = readOnly

      // 初始化播放器
      this.initPlayer()
    },
    initPlayer () {
      if (this.videoPlayer) {
        this.videoPlayer.src(this.resource_url)

        this.videoPlayer.player_.one('timeupdate', (e) => {
          const { videoWidth, videoHeight } = this.videoEl
          this.videoCanvasRect = {
            width: (videoWidth / videoHeight) * 100,
            height: 100
          }

          this.duration = this.videoPlayer.duration()
          this.timeLineData = new Array(Math.round(this.duration / 5) + 2)

          const gapCal =
            this.$refs.timeLine.offsetWidth / Math.round(this.duration)

          this.gap = gapCal > 20 ? gapCal : 20
        })
      } else {
        this.videoPlayer = videojs(
          this.$refs.videoPlayer,
          {
            autoplay: true,
            controls: true,
            sources: [
              // {
              //   src: testVideo,
              //   type: 'video/mp4',
              // },
            ]
          },
          () => {
            this.ready = true
            this.videoEl = document.getElementsByTagName('video')[0]
            this.canvasContext = this.$refs.videoCanvas.getContext('2d')
          }
        )

        this.videoPlayer.src(this.resource_url)

        this.videoPlayer.player_.one('timeupdate', (e) => {
          const { videoWidth, videoHeight } = this.videoEl
          this.videoCanvasRect = {
            width: (videoWidth / videoHeight) * 100,
            height: 100
          }

          this.duration = this.videoPlayer.duration()
          this.timeLineData = new Array(Math.round(this.duration / 5) + 2)

          const gapCal =
            this.$refs.timeLine.offsetWidth / Math.round(this.duration)

          this.gap = gapCal > 20 ? gapCal : 20
        })

        this.videoPlayer.player_.on('timeupdate', (e) => {
          const { width, height } = this.videoCanvasRect
          this.currentTime = this.videoPlayer.currentTime()
          this.canvasContext.drawImage(this.videoEl, 0, 0, width, height)

          if (
            this.regionPlayEnd &&
            this.currentTime - this.regionPlayEnd > 0.02
          ) {
            this.videoPlayer.currentTime(this.regionPlayEnd)
            this.videoPlayer.pause()
            this.regionPlayEnd = 0
          }
        })
      }
    },

    // 提交接口
    handleSubmit () {
      if (!this.ready) {
        this.$Message.error({
          content: '视频数据尚未加载完成'
        })
        return {
          valid: false,
          data: null
        }
      }
      // 校验重合数据
      // 非空字段判断
      // 检查重合
      let cascadeValid = true
      let isNullValid = true

      if (!this.regions.length) {
        this.$Message.error({
          content: '标注结果不能为空'
        })
        return {
          valid: false,
          data: null
        }
      }

      this.regions
        .sort((a, b) => a.start - b.start)
        .forEach((item, index, array) => {
          if (
            index < this.regions.length - 1 &&
            item.end > array[index + 1].start
          ) {
            cascadeValid = false
          }

          if (!item.type) {
            isNullValid = false
          }
        })

      if (!cascadeValid) {
        this.$Message.error({
          content: '标注结果提交失败，分段区域不能重合'
        })
        return {
          valid: false,
          data: null
        }
      }

      if (!isNullValid) {
        this.$Message.error({
          content: '标注结果提交失败，分段类型不能为空'
        })
        return {
          valid: false,
          data: null
        }
      }

      this.$Message.success({
        content: '标注结果提交成功'
      })

      return {
        valid: true,
        data: {
          file: this.resource_url,
          start: 0,
          end: this.duration,
          bad: false,
          regions: this.regions.sort((a, b) => a.start - b.start)
        }
      }
    },
    // 标为坏数据接口
    handleMarkBad () {
      if (!this.ready) {
        this.$Message.error({
          content: '视频数据尚未加载完成'
        })
        return {
          valid: false,
          data: null
        }
      }
      this.$Message.success({
        content: '已标注为坏数据'
      })
      return {
        valid: true,
        data: {
          file: this.resource_url,
          start: 0,
          end: this.duration,
          bad: true,
          regions: []
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.main {
  box-sizing: border-box;
  padding: 10px 20px 20px;
  height: 100%;
  min-height: 600px;
}
.slider-wrap {
  position: absolute;
  right: 32px;
  top: 10px;
  z-index: 999;
  width: 120px;
  .ivu-slider-button-wrap {
    top: -7px;
  }
}
.video-container {
  min-height: 200px;
  background: #000;
  .target-video {
    min-width: 600px;
    max-width: 900px;
    min-height: 400px;
    max-height: 600px;
  }
}

.marker-bar {
  height: 140px;
  background: #222;

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 6px;
    height: 16px;
    background-color: transparent;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px #f4f4f4;
    border-radius: 10px;
    background-color: transparent;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    //-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: rgba(0, 0, 0, 0.3);
  }

  .regions-wrap {
  }
  .region {
    background: rgba(61, 222, 168, 0.39);
    height: 104px;
    transition: left 0.2s linear, width 0.2s linear;
    cursor: move;
    &.spec {
      transition: none;
    }
    &:hover {
      /*background: rgba(83, 194, 222, 0.39);*/
      .region-border {
        display: block;
      }
    }
    .region-border {
      /*display: none;*/
      position: absolute;
      width: 1px;
      top: 0;
      height: 104px;
      background: rgba(255, 255, 255, 0.3);
      &.left {
        left: 0;
        border-right: 4px;
        cursor: w-resize;
      }
      &.right {
        border-left: 4px;
        right: 0;
        cursor: e-resize;
      }
    }
  }
  .time-line {
    left: 0;
    right: 0;
    bottom: 0;
    height: 36px;
    background: #f4f4f4;
    color: #333;
  }
  .time-line-part {
    position: absolute;
    font-size: 12px;
    font-weight: bold;
    /*width: 100px;*/
    background: #f4f4f4;
    height: 36px;
    pointer-events: none;
    &:last-child {
      width: 40px;
      i {
        display: none;
      }
    }
    &:before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      height: 22px;
      width: 1px;
      background: #000;
      transform: scaleX(0.5);
    }
    span {
      position: relative;
      display: block;
      top: 10px;
      left: 4px;
      transform: scale(0.7);
      transform-origin: 0;
    }
    i {
      position: absolute;
      top: 0;
      height: 15px;
      width: 1px;
      background: #aaa;
      transform: scaleX(0.5);
    }
  }

  .cursor {
    height: 110px;
    width: 1px;
    background: #3bffba;
    transition: left 0.2s linear;
  }

  .cap-canvas {
    top: 2px;
    max-width: 300px;
    max-height: 100px;
    transform: translateX(-50%);
    pointer-events: none;
    transition: left 0.2s linear;
  }
}

.audio-marker {
  background-color: #000;
  border-radius: 4px;
}

.audio-actions {
  /*padding-bottom: 20px;*/
  .btn {
    margin-right: 6px;
  }
}

.region-list {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-bottom: 20px;
  .item {
    line-height: 60px;
    border-bottom: 1px solid #eee;
    &.active {
      /*box-shadow: inset 1px 1px 5px rgba(0,0,0,0.1);*/
      background-color: #efefef;
    }
    &.null {
      line-height: 120px;
      color: #999;
    }
    p {
      width: 12%;
      box-sizing: border-box;
      padding: 0 10px;
      &:nth-child(6) {
        min-width: 150px;
      }
      &:first-child {
        width: 8%;
      }
      &:last-child {
        text-align: center;
        width: 30%;
      }
    }
  }
}
.region-list-content {
  scroll-behavior: smooth;
  min-height: 300px;
}
.btn-confirm {
  position: fixed;
  right: 50px;
  bottom: 50px;
  width: 60px;
  height: 60px;
  padding: 0;
  text-align: center;
  line-height: 50px;
  /*box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);*/
}

.marker-bar {
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>

<style lang="less">
.region-label {
  position: absolute;
  top: 15px;
  font-size: 16px;
  left: 50%;
  color: #ffffff7a;
  transform: translate(-50%, -50%);
}

.slider-wrap {
  .ivu-slider-button-wrap {
    top: -7px;
  }
}

.video-js .vjs-big-play-button {
  left: 50%;
  top: 50%;
  margin-left: -1.5rem;
  margin-top: -1.8rem;
}
</style>
