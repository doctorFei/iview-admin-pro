<template>
  <div>
    <div class="actions">
      <span
        class="iconfont icon_mark_upload fs-18 db pointer"
        :class="disabled ? 'text-black-disable' : ''"
        style="padding: 0 10px"
        @click="handleUpload"
      ></span>

      <input class="file-input" ref="fileInput" type="file" @change="fileChanged" />
    </div>

    <div v-if="path" class="preview flex items-center justify-center" @click="handleDelete(true)">
      <img :src="path" />
    </div>
  </div>
</template>

<script>
import { apiCapResDelete } from '@/api/capability'
export default {
  name: 'singleUpload',
  props: {
    path: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    handleUpload () {
      if (this.disabled) {
        return
      }
      this.$refs.fileInput.click()
    },
    async fileChanged (e) {
      if (!e.target.files.length) {
        this.$refs.fileInput.value = ''
        return
      }

      if (this.path) {
        await this.handleDelete()
      }

      const file = e.target.files[0]

      // console.log(file);

      if (file.size > 2097152) {
        this.$Message.error('文件大小不能超过2M')
        this.$refs.fileInput.value = ''
        return
      }

      if (/\.(png|jpe?g|gif)(\?.*)?$/.test(file.name)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('abilityId', this.$route.params.id)
        formData.append('type', 'ability_pictures')

        try {
          const res = await fetch(
            `${process.env.VUE_APP_BASE_API_URL || ''}/file/upload`,
            {
              method: 'POST',
              body: formData,
              // headers: {
              //   'Content-Type': 'multipart/form-data',
              // },
              credentials: 'include'
            }
          ).then(response => response.json())

          if (res.success && res.data) {
            this.$Message.success('文件上传成功')
            console.log(res.data.url)

            this.$emit('fileSuccess', res.data.url)
          } else {
            this.$Message.error(res.errorMessage || '文件失败成功')
          }
        } catch (e) {
          this.$Message.err(e.message)
        }
      } else {
        this.$Message.error('仅支持上传 png、jpg、gif 图片文件')
      }

      this.$refs.fileInput.value = ''
    },
    async handleDelete (hasTip) {
      if (this.disabled) {
        return
      }

      // 将图片删除
      const res = await apiCapResDelete(this.path)

      console.log(res)

      if (res.success && res.data) {
        hasTip && this.$Message.success(res.errorMessage || '图片删除成功')

        this.$emit('fileSuccess', '')
      } else {
        hasTip && this.$Message.error(res.errorMessage || '图片删除失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.actions {
  display: flex;
}
.file-input {
  width: 0;
  height: 0;
  visibility: hidden;
}
.preview {
  position: relative;
  width: 150px;
  height: 100px;
  background-color: #f4f4f4;
  border-radius: 2px;

  cursor: pointer;

  &:before {
    content: "删除";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(250, 30, 45, 0.3);
    color: #fff;
    text-align: center;
    line-height: 100px;
    transition: opacity 0.3s linear;
    opacity: 0;
  }
  &:hover {
    &:before {
      opacity: 1;
    }
  }

  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
