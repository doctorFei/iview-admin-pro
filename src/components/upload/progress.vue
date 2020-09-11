<template>
  <Modal :value="showProgress" title="上传进度" @on-visible-change="visibleChange">
    <ul v-for="file in fileList" :key="file.uniqueIdentifier" class="file-progress">
      <span>文件名: {{file.fileName}}</span>
      <span style="margin-left: 10px;">文件大小: {{ fileSize(file.size) }}</span>
      <span style="margin-left: 10px;">{{ file.progress_text }}</span>

      <Progress
        :percent="Math.floor(file.progress() * 100)"
        :status="status(file)"
        :class="{'red-important': status(file) === 'wrong'}"
      ></Progress>

      <div
        v-if="!file.isCanceled && (Math.floor(file.progress() * 100) !== 100)"
        style="text-align:center;"
      >
        <!--<a href="javascript:void(0)"-->
        <!--class="upload-action"-->
        <!--v-if="file.isPaused()"-->
        <!--@click="file.pause();file.upload()">继续-->
        <!--</a>-->
        <!--<a href="javascript:void(0)"-->
        <!--class="upload-action"-->
        <!--v-else-->
        <!--@click="pause(file)">暂停-->
        <!--</a>-->
        <!--<a href="javascript:void(0)"-->
        <!--class="upload-action"-->
        <!--@click="file.cancel(); file.isCanceled = true;">取消-->
        <!--</a>-->
      </div>
    </ul>
    <div slot="footer" style="text-align: right;"></div>
  </Modal>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    showProgress: {
      type: Boolean
    },
    // 需要展示进度的上传文件对象
    fileList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    status (file) {
      return file.failed || file.isCanceled ? 'wrong' : 'active'
    },
    pause (file) {
      file.pause()
    },
    visibleChange (newValue) {
      this.$emit('update:showProgress', newValue)
    },
    fileSize (size) {
      let kb
      const mb = Math.floor(size / 1024 / 1024)
      if (mb > 0) {
        return `${mb}Mb`
      } else if ((kb = Math.floor(size / 1024))) {
        return `${kb}Kb`
      } else {
        return `${size}b`
      }
    }
  }
}
</script>

<style lang="less" scoped>
.file-progress + .file-progress {
  margin-top: 15px;
}

.upload-action {
  margin: 0 10px;
}
</style>

<style lang="less">
.red-important {
  .ivu-progress-bg {
    background-color: #ed3f14 !important;
  }

  .ivu-progress-text {
    color: #ed3f14 !important;
  }
}
</style>
