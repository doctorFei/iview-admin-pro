<template>
  <div class="main flex flex-column">
    <p>标注工具</p>

    <div class="relative">
      <div ref="audioMarker" class="audio-marker relative"></div>
      <div ref="timeline" class="audio-time-line"></div>

      <div id="wave-spectrogram"></div>
      <div v-if="ready" class="audio-actions flex items-center justify-space">
        <div class="flex items-center">
          波形缩放：
          <Slider
            show-tip="never"
            @on-change="zoomChange"
            style="width: 200px; margin-left: 20px"
            v-model="zoomValue"
            :min="minZoom"
            :max="maxZoom"
          ></Slider>
        </div>
        <div>
          <Button
            style="margin-right: 20px"
            icon="md-play"
            @click="handleAudioPlayPause"
            >播放/暂停</Button
          >
          <Button
            style="margin-right: 20px"
            icon="md-pause"
            @click="handleAudioStop"
            >停止</Button
          >
          <Button
            icon="md-trash"
            class="btn-clear-all"
            @click="clearAllRegions"
            :disabled="readOnly"
            >清除所有分段</Button
          >
        </div>

        <div class="flex items-center">
          播放速度：
          <Select
            v-model="playRate"
            @on-change="changePlayRate"
            style="width: 200px"
          >
            <Option :value="0.5">0.5</Option>
            <Option :value="0.75">0.75</Option>
            <Option :value="1">1</Option>
            <Option :value="1.25">1.25</Option>
            <Option :value="2">2</Option>
          </Select>
        </div>
        <!--<Button type="warning" @click="handleMarkBad">标为坏数据</Button>-->
        <!--<Button type="success" @click="handleSubmit">提交</Button>-->
        <!--<Button type="success" @click="handleNext">下一条</Button>-->
      </div>

      <div
        v-if="!ready"
        class="absolute absolute-fill flex items-center z-999 justify-center fs-16"
      >
        <div class="progress">
          <div class="one common"></div>
          <div class="two common"></div>
          <div class="three common"></div>
          <div class="four common"></div>
          <div class="five common"></div>
          <div class="six common"></div>
          <div class="seven common"></div>
          <div class="eight common"></div>
        </div>
        <p class="progress-text">音频加载中</p>
      </div>
    </div>

    <div v-if="ready" class="region-list-wrap relative flex-grow-1 h0">
      <div class="region-list h-100 flex flex-column">
        <div class="item flex">
          <p>段落</p>
          <p>开始(s)</p>
          <p>结束(s)</p>
          <p>时长(s)</p>
          <p>角色</p>
          <p>操作</p>
          <p>实际内容</p>
        </div>
        <div v-show="!regionList.length" class="item tc null">
          请在音频波形图上拖拽选择区域进行分段标注
        </div>
        <ul
          ref="regionContainer"
          class="region-list-content flex-grow-1 h0 overflow-auto"
        >
          <li
            v-for="(item, index) in regionList"
            @mouseleave="handleListMouseLeave(item)"
            @mouseover="handleListMouseEnter(item)"
            :key="index"
            class="item flex"
            :class="{ active: isRegionActive(item), [item.id]: true }"
          >
            <p>{{ index + 1 }}</p>
            <p>{{ item.start.toFixed(3) }}</p>
            <p>{{ item.end.toFixed(3) }}</p>
            <p>{{ (item.end - item.start).toFixed(3) }}</p>
            <p>
              <Select
                style="width: 100%"
                v-model="item.type"
                :disabled="readOnly"
              >
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
                <Button type="success" @click="handleRegionPlayPause(item)"
                  ><Icon type="ios-play" />/<Icon type="ios-pause"
                /></Button>
                <!--<Button :icon="item.playing ? 'ios-pause' : 'md-sync'" @click="handleRegionPlayLoop(item)"></Button>-->
                <!--<Button icon="ios-square" @click="handleRegionStop(item)"></Button>-->
                <Button
                  type="error"
                  @click="handleRegionDel(item)"
                  :disabled="readOnly"
                  ><Icon type="ios-trash"
                /></Button>
              </ButtonGroup>
            </p>
            <p>
              <Input
                v-model="item.text"
                :disabled="readOnly"
                type="textarea"
                placeholder="语音文字表达内容"
              />
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import WaveSurfer from 'wavesurfer.js'
import TimeLinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline'
import SpectrogramPlugin from './util/spectrogram.js'
import RegionsPlugin from './util/wavesurfer-regions'
import CursorPlugin from './util/wavesurfer-cursor'

import testAudio from './foxgrape.mp3'
import colorMap from './util/hot-colormap.json'

const waveConfig = {
  regionBaseColor: 'rgba(124, 179, 209, 0.4)',
  regionActiveColor: 'rgba(124, 209, 162, 0.4)'
}

export default {
  name: 'Main',
  data () {
    return {
      readOnly: false,
      cascadeValidConfig: true,
      waveSurfer: null,
      robotRegions: null,
      regionList: [],
      bad: false,
      ready: false,
      markInitData: null,
      resource_url: '',
      zoomValue: 0,
      minZoom: 0,
      maxZoom: 0,
      playRate: 1
    }
  },
  mounted () {
    // 初始化外界调用接口
    window.initMarkData = this.initData
    window.markSubmit = this.handleSubmit
    window.markBad = this.handleMarkBad

    // 初始化播放器
    this.initWaveSurfer()

    // 加载资源
    this.handleNext()
  },
  methods: {
    handleNext () {
      window.initMarkData({
        resource_url: testAudio,
        // readOnly or not
        readOnly: false,
        typeList: [
          {
            value: 'local',
            label: '客服'
          },
          {
            value: 'noise',
            label: '经理'
          },
          {
            value: 'english',
            label: '工程师'
          }
        ],
        regions: [
          {
            end: 8.049649161037262,
            start: 5.79974722161691,
            text: 'hello',
            type: 'local'
          }
        ],
        mark_result: {
          bad: false,
          start: 0,
          end: 229.44,
          file: testAudio
        }
      })
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

    /**
     * 初始化播放器、各类事件
     */
    initWaveSurfer () {
      // 创建播放器
      const waveSurfer = WaveSurfer.create({
        container: this.$refs.audioMarker,
        audioRate: 1,
        barHeight: 0.5,
        waveColor: '#159128',
        progressColor: '#48eb51',
        cursorColor: 'rgba(255, 255, 255, 0.85)',
        scrollParent: true,
        // mediaControls: true,
        plugins: [
          // 区域插件
          RegionsPlugin.create({
            regions: [],
            dragSelection: {
              slop: 5
            }
          }),
          // 光标插件
          CursorPlugin.create({
            color: '#fff',
            opacity: '0.5',
            showTime: true,
            customShowTimeStyle: {
              color: '#fff',
              marginLeft: '8px'
            }
          }),
          TimeLinePlugin.create({
            container: this.$refs.timeline
          }),
          SpectrogramPlugin.create({
            wavesurfer: this.wavesurfer,
            container: '#wave-spectrogram',
            colorMap: colorMap
            // fftSamples: 512,
            // labels: true,
          })
        ]
      })

      // ready 事件
      waveSurfer.on('ready', () => {
        this.ready = true
        this.mapData().forEach((item) => {
          const region = this.waveSurfer.addRegion(item)
          this.$set(region, 'text', item.text)
          this.$set(region, 'type', item.type)
          // this.$set(region, 'transText', item.transText);

          this.regionList = [...this.regionList, region]
        })
      })

      // region 更新事件
      waveSurfer.on('region-update-end', (region) => {
        // console.log('update');

        if (this.readOnly) {
          region.remove()
          return
        }

        if (region.end - region.start < 0.1) {
          this.$Message.error({
            content: '分段区域时长不能小于 0.1'
          })
        }

        // 检查重合
        let valid = true
        !this.cascadeValidConfig &&
          this.regionList.forEach((item) => {
            if (
              (region.start < item.start && region.end > item.start) ||
              (region.start < item.end && region.end > item.end) ||
              (region.start > item.start && region.end < item.end)
            ) {
              valid = false
            }
          })

        this.regionList.sort((a, b) => a.start - b.start)

        // this.$nextTick(() => {
        //   this.updateRegionIndex();
        // });

        setTimeout(() => {
          this.updateRegionIndex()
        }, 200)

        if (!this.regionList.find(({ id }) => id === region.id)) {
          if (!valid) {
            this.$Message.error({
              content: '分段区域不能重合'
            })
            region.remove()
            return
          }
          region.update({
            color: waveConfig.regionBaseColor
          })
          // 排次序插入
          this.regionList = [...this.regionList, region].sort(
            (a, b) => a.start - b.start
          )
        } else {
          // 已经存在, 出现重合的情况
          !valid &&
            this.$Message.error({
              content: '分段区域不能重合'
            })
        }
      })

      // 鼠标进入事件
      waveSurfer.on('region-mouseenter', (region) => {
        if (
          !this.waveSurfer.isPlaying() &&
          region.color !== waveConfig.regionActiveColor
        ) {
          region.update({
            color: waveConfig.regionActiveColor
          })
        }
      })

      // 鼠标远离事件
      waveSurfer.on('region-mouseleave', (region) => {
        if (
          !this.waveSurfer.isPlaying() &&
          region.color !== waveConfig.regionBaseColor
        ) {
          region.update({
            color: waveConfig.regionBaseColor
          })
        }
      })

      // 进入 region 事件
      waveSurfer.on('region-in', (region) => {
        // 颜色更新
        region.update({
          color: waveConfig.regionActiveColor
        })
        // 设置滚动到指定位置
        const ele = document.getElementsByClassName(region.id)[0]
        if (ele) {
          if (ele.offsetTop > 140) {
            this.$refs.regionContainer.scrollTop = ele.offsetTop - 140
          } else {
            this.$refs.regionContainer.scrollTop = 0
          }
        }
      })

      // 出 region 事件
      waveSurfer.on('region-out', (region) => {
        // 颜色更新
        region.update({
          color: waveConfig.regionBaseColor
        })
      })

      // region click 事件
      waveSurfer.on('region-click', (region) => {
        // 点击切换下拉列表位置
        const ele = document.getElementsByClassName(region.id)[0]
        if (ele) {
          if (ele.offsetTop > 140) {
            this.$refs.regionContainer.scrollTop = ele.offsetTop - 140
          }
        } else {
          this.$refs.regionContainer.scrollTop = 0
        }
      })

      // region click 事件
      waveSurfer.on('region-removed', (region) => {
        setTimeout(() => {
          this.updateRegionIndex()
        }, 200)
      })

      this.waveSurfer = waveSurfer
      this.initZoom()
    },

    initZoom () {
      this.zoomValue = this.waveSurfer.params.minPxPerSec
      this.minZoom = this.waveSurfer.params.minPxPerSec
      this.maxZoom = 1000
      this.waveSurfer.zoom(this.zoomValue)
      console.log(this.waveSurfer.params.minPxPerSec)
    },
    zoomChange (value) {
      this.waveSurfer.zoom(value)
    },
    changePlayRate (value) {
      this.waveSurfer.setPlaybackRate(value)
    },
    // 初始化组件数据
    // data: { resource_url: '', api_url: '', fetch_type: '', fetch_plugin_id: '', mark_result: {} }
    async initData ({
      resource_url,
      readOnly = false,
      typeList = [],
      regions,
      mark_result = null
    }) {
      // 清除 regions
      this.clearAllRegions()

      // 重新初始化是否为坏数据
      this.bad = false

      // 加载完成状态切换
      this.ready = false

      // 是否是查看模式或编辑模式
      this.readOnly = readOnly

      // 清除音频文件
      this.waveSurfer.empty()

      // 初始化数据，供mapping函数使用
      this.markInitData = mark_result

      this.resource_url = resource_url

      this.robotRegions = regions

      this.typeList = typeList

      this.waveSurfer.load(resource_url)
    },
    // 判断region 是否处于高亮
    isRegionActive (region) {
      return region.color === waveConfig.regionActiveColor
    },
    // 播放器播放/暂停
    handleAudioPlayPause () {
      this.waveSurfer.playPause()
    },
    // 音频停止并置于开始位置
    handleAudioStop () {
      this.waveSurfer.stop()
      this.$refs.regionContainer.scrollTop = 0
      this.waveSurfer.seekAndCenter(0)
    },
    // region 播放、暂停
    handleRegionPlayPause (item) {
      item.playPause()
    },
    // region 删除
    handleRegionDel (item) {
      this.regionList = this.regionList.filter(({ id }) => id !== item.id)
      item.remove()
    },

    // 列表鼠标移出事件
    handleListMouseLeave (region) {
      if (
        region.color !== waveConfig.regionBaseColor &&
        !this.waveSurfer.isPlaying()
      ) {
        region.update({
          color: waveConfig.regionBaseColor
        })
      }
    },
    // 列表鼠标进入事件
    handleListMouseEnter (region) {
      if (
        region.color !== waveConfig.regionActiveColor &&
        !this.waveSurfer.isPlaying()
      ) {
        region.update({
          color: waveConfig.regionActiveColor
        })
      }
    },
    // 清空regions
    clearAllRegions () {
      this.waveSurfer.clearRegions()
      this.regionList = []
      this.robotRegions = null
    },
    // 提交接口
    handleSubmit () {
      if (!this.ready) {
        this.$Message.error({
          content: '音频数据尚未加载完成'
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
      let isGapValid = true

      if (!this.regionList.length) {
        this.$Message.error({
          content: '标注结果不能为空'
        })
        return {
          valid: false,
          data: null
        }
      }

      this.regionList
        .sort((a, b) => a.start - b.start)
        .forEach((item, index, array) => {
          if (
            !this.cascadeValidConfig &&
            index < this.regionList.length - 1 &&
            item.end > array[index + 1].start
          ) {
            cascadeValid = false
          }

          if (!item.text) {
            isNullValid = false
          }

          if (item.end - item.start < 0.1) {
            isGapValid = false
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
          content: '标注结果提交失败，分段文本不能为空'
        })
        return {
          valid: false,
          data: null
        }
      }

      if (!isGapValid) {
        this.$Message.error({
          content: '分段区域时长不能小于 0.1'
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
          end: this.waveSurfer.getDuration(),
          bad: false,
          regions: this.regionList
            .map(({ start, end, text, type }) => ({
              start,
              end,
              text,
              type
            }))
            .sort((a, b) => a.start - b.start)
        }
      }
    },
    // 标为坏数据接口
    handleMarkBad () {
      if (!this.ready) {
        this.$Message.error({
          content: '音频数据尚未加载完成'
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
          end: this.waveSurfer.getDuration(),
          bad: true,
          regions: []
        }
      }
    },
    // 转换数据
    mapData () {
      this.bad =
        this.markInitData && this.markInitData.bad
          ? this.markInitData.bad
          : false

      if (
        this.markInitData &&
        !this.markInitData.bad &&
        this.markInitData.regions
      ) {
        return this.markInitData.regions
          .map(({ start, end, text, type }) => ({
            start,
            end,
            drag: true,
            resize: true,
            color: waveConfig.regionBaseColor,
            text,
            type
          }))
          .sort((a, b) => a.start - b.start)
      }

      if (this.robotRegions) {
        return this.robotRegions
          .map(({ start, end, text, type }) => ({
            start,
            end,
            drag: !this.readOnly,
            resize: !this.readOnly,
            color: waveConfig.regionBaseColor,
            text,
            type
          }))
          .sort((a, b) => a.start - b.start)
      }

      return []
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
.header {
  padding: 20px 0;
}
.audio-marker {
  // background-color: #000;
  border-radius: 4px;
}
.audio-actions {
  padding: 20px 0;
  justify-content: space-around;
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
      &:first-child {
        width: 10%;
      }
      &:nth-child(5) {
        width: 14%;
      }
      &:nth-child(6) {
        width: 15%;
      }
      &:last-child {
        text-align: center;
        width: 26%;
      }
    }
  }
}
.region-list-content {
  scroll-behavior: smooth;
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

.progress-text {
  color: #51cbd0;
  background-image: -webkit-gradient(
    linear,
    0 0,
    right 0,
    from(#ab3bc1),
    to(#56c4da)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.progress {
  width: 110px;
  height: 40px;
  z-index: 999;

  animation: progress 5s linear infinite;

  .common {
    height: 50px;
    max-height: 100%;
    overflow: auto;
    width: 20px;
    margin: auto;
    max-width: 100%;
    position: absolute;
    border-radius: 0 100px 0 100px;
    box-shadow: inset 0 0 0 1px #e645d0, 0 0 15px 0 #e645d0;
  }

  .one {
    transform: rotate(45deg);
    left: 0;
    right: 0;
    top: 0;
    bottom: 75px;
    animation: one 1s ease infinite;
  }

  .two {
    transform: rotate(90deg);
    left: 55px;
    right: 0;
    top: 0;
    bottom: 55px;
    animation: two 1s 0.125s ease infinite;
  }

  .three {
    transform: rotate(135deg);
    left: 75px;
    right: 0;
    top: 0;
    bottom: 0;

    animation: three 1s 0.25s ease infinite;
  }

  .four {
    transform: rotate(180deg);
    left: 55px;
    right: 0;
    top: 55px;
    bottom: 0;
    animation: four 1s 0.375s ease infinite;
  }

  .five {
    transform: rotate(225deg);
    left: 0;
    right: 0;
    top: 75px;
    bottom: 0;
    animation: five 1s 0.5s ease infinite;
  }

  .six {
    transform: rotate(270deg);
    left: 0;
    right: 55px;
    top: 55px;
    bottom: 0;
    animation: six 1s 0.625s ease infinite;
  }

  .seven {
    transform: rotate(315deg);
    left: 0;
    right: 75px;
    top: 0;
    bottom: 0;
    animation: seven 1s 0.75s ease infinite;
  }

  .eight {
    transform: rotate(360deg);
    left: 0;
    right: 55px;
    top: 0;
    bottom: 55px;
    animation: eight 1s 0.875s ease infinite;
  }

  @keyframes one {
    0%,
    100% {
    }
    50% {
      box-shadow: inset 0 0 0 1px #17e1e6, 0 0 15px 0 #17e1e6;
    }
  }
  @keyframes two {
    0%,
    100% {
    }
    50% {
      box-shadow: inset 0 0 0 1px #17e1e6, 0 0 15px 0 #17e1e6;
    }
  }
  @keyframes three {
    0%,
    100% {
    }
    50% {
      box-shadow: inset 0 0 0 1px #17e1e6, 0 0 15px 0 #17e1e6;
    }
  }
  @keyframes four {
    0%,
    100% {
    }
    50% {
      box-shadow: inset 0 0 0 1px #17e1e6, 0 0 15px 0 #17e1e6;
    }
  }
  @keyframes five {
    0%,
    100% {
    }
    50% {
      box-shadow: inset 0 0 0 1px #17e1e6, 0 0 15px 0 #17e1e6;
    }
  }
  @keyframes six {
    0%,
    100% {
    }
    50% {
      box-shadow: inset 0 0 0 1px #17e1e6, 0 0 15px 0 #17e1e6;
    }
  }

  @keyframes seven {
    0%,
    100% {
    }
    50% {
      box-shadow: inset 0 0 0 1px #17e1e6, 0 0 15px 0 #17e1e6;
    }
  }

  @keyframes eight {
    0%,
    100% {
    }
    50% {
      box-shadow: inset 0 0 0 1px #17e1e6, 0 0 15px 0 #17e1e6;
    }
  }
}

@keyframes progress {
  from {
    transform: scale(0.6) rotate(0deg);
  }
  to {
    transform: scale(0.6) rotate(-360deg);
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
</style>
