<template>
  <div class="upload" style="display: inline-block;">
    <div class="resumable-error" v-show="resumable_error">
      Your browser, unfortunately, is not supported by Resumable.js. The library requires support for
      <a
        href="http://www.w3.org/TR/FileAPI/"
      >the HTML5 File API</a> along with
      <a href="http://www.w3.org/TR/FileAPI/#normalization-of-params">file slicing</a>.
    </div>

    <div :class="resumableBrowse">
      <slot></slot>
    </div>
    <Progress v-if="showProgress" :showProgress.sync="progressModalShow" :fileList="fileList"></Progress>
  </div>
</template>

<script>
import Resumable from './resumable.js'
import Progress from './progress'
export default {
  data () {
    return {
      resumable_error: false,
      resumable_drop: false,
      resumable_list: false,
      resumableDrag: false,
      r: null,
      resumableBrowse: 'resumable-browse-' + this.resumableId + this._uid,
      progressModalShow: false,
      fileList: []
    }
  },
  components: {
    Progress
  },
  props: {
    showProgress: {
      type: Boolean,
      required: false
    },
    target: {
      type: String,
      required: true
    },
    resumableId: {
      type: String
    },
    fileSuccess: {
      type: Function
    },
    fileAdded: {
      type: Function
    },
    // 可支持同时上传的文件数
    simultaneousUploads: {
      type: Number,
      default: 4
    },
    // 单选多选
    maxFiles: {
      type: Number,
      default: undefined
    },
    fileType: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    initResumable () {
      const r = new Resumable({
        promiseAll: [],
        maxFiles: this.maxFiles,
        target: this.target,
        query: {},
        fileType: this.fileType,
        withCredentials: true,
        chunkSize: 5 * 1024 * 1024,
        simultaneousUploads: this.simultaneousUploads,
        method: 'octet',
        testChunks: false,
        generateUniqueIdentifier: (file, event) => {
          var relativePath =
            file.webkitRelativePath || file.fileName || file.name
          var size = file.size
          const prefix = relativePath.substring(
            0,
            relativePath.lastIndexOf('.')
          )
          const suffix = relativePath.substring(
            relativePath.lastIndexOf('.') + 1
          )
          return (
            new Date().getTime() +
            size +
            '-' +
            prefix.replace(/[^0-9a-zA-Z_-]/gim, '') +
            '.' +
            suffix
          )
        }
      })
      this.r = r
      if (!r.support) {
        this.resumable_error = true
      } else {
        this.resumable_drop = true
        r.assignDrop(document.getElementsByClassName('resumable-drop'))
        // 设置点击目标
        r.assignBrowse(document.getElementsByClassName(this.resumableBrowse))
        this.resumable_list = true

        let filesAddedNum = 0

        r.on('fileAdded', async (resumableFileObj, event, ...args) => {
          const [files1, files2] = args

          fileAdd(this, resumableFileObj, files1, files2)

          function fileAdd (_this, resumableFileObj, files1, files2) {
            _this.fileAdded &&
              _this
                .fileAdded(resumableFileObj)
                .then(() => {
                  filesAddedNum = filesAddedNum + 1
                })
                .catch(() => {
                  let index = files1.indexOf(resumableFileObj)
                  files1.splice(index, 1)
                  index = files2.indexOf(resumableFileObj)
                  files2.splice(index, 1)
                })
                .finally(() => {
                  // files1不包含上传失败的文件，files2包含上传失败的文件
                  if (filesAddedNum >= files1.length && filesAddedNum > 0) {
                    filesAddedNum = 0
                    _this.r.upload()
                    this.fileList.push(resumableFileObj)
                    if (!this.progressModalShow) this.progressModalShow = true
                  }
                })
          }
        })

        r.on('fileSuccess', file => {
          file.progressNum = 100
          file.progress_text = '上传成功'
          this.fileSuccess && this.fileSuccess(file)
        })
        r.on('fileError', file => {
          file.failed = true
          file.progress_text = '上传失败'
        })
        r.on('fileProgress', file => {
          window.onbeforeunload = function (e) {
            const event = window.event || e
            event.returnValue = '确定离开当前页面吗？'
          }
          file.progressNum = Math.floor(file.progress() * 100)
        })
      }
    }
  },
  filters: {
    size: function (value) {
      if (!value) {
        return 0
      }
      const s = value / (1024 * 1024)
      if (parseInt(s, 10) > 0) {
        return s.toFixed(1) + 'M'
      } else {
        return (value / 1024).toFixed(1) + 'Kb'
      }
    }
  },
  mounted () {
    this.initResumable()
  }
}
</script>

<style scoped lang="less">
.resumable-error {
  font-size: 16px;
  font-style: italic;
}
</style>
