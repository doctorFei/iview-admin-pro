<template>
  <video-player
    class="vjs-custom-skin"
    ref="videoPlayer"
    :options="playerOptions"
    :playsinline="true"
    @ready="playerReadied"
  ></video-player>
</template>

<script>
// 只设宽度，流式布局
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import { videoPlayer } from 'vue-video-player'

export default {
  props: ['videoPost', 'videoSource'],
  components: {
    videoPlayer
  },
  data () {
    return {
      playerOptions: {
        muted: false,
        language: 'en', // 设置语言
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        fluid: true,
        aspectRatio: '16:9',
        controlBar: {
          volumeControl: true,
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false
        },
        sources: [
          {
            type: 'video/mp4',
            src: this.videoSource
          },
          {
            type: 'video/webm',
            src: this.videoSource
          },
          {
            type: 'video/ogg',
            src: this.videoSource
          }
        ],
        poster: this.videoPost || null,
        notSupportedMessage: '此视频暂无法播放，请稍后再试'
      }
    }
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {
    playerReadied (player) {
      player.volume(0.5)
    }
  },
  watch: {
    videoPost (poster) {
      this.playerOptions.poster = poster
    }
  }
}
</script>
