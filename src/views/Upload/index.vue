<template>
  <div>
    <resumable
      resumableId="upload"
      :target="uploadTarget"
      :maxFiles="1"
      :fileAdded="fileAdded"
      :fileSuccess="fileUploadSuccess"
    >
      <div
        class="uploadBox flex flex-column justify-center items-center"
        style="height:332px;max-height: 332px;width: 486px"
      >
        <i
          style="color: rgb(51, 153, 255); font-size: 52px;"
          class="ivu-icon ivu-icon-ios-cloud-upload"
        ></i>
        <p>点击这里上传</p>
      </div>
    </resumable>
    <div style="padding-top:50px">
      <p>该组件是基于resumable的封装（http://github.com/23/resumable.js）</p>
      <p>默认支持以下prop参数配置，若需要新增配置则参考resumable.js说明文档</p>
      <Table :columns="columns" :data="propData"></Table>
    </div>
  </div>
</template>

<script>
import Resumable from '@/components/upload/resumable.vue'
export default {
  components: {
    Resumable
  },
  data () {
    return {
      uploadTarget: '/video/upload',
      columns: [
        {
          title: '属性名',
          key: 'name'
        },
        {
          title: '类型',
          key: 'type'
        },
        {
          title: '默认值',
          key: 'default'
        },
        {
          title: '说明',
          key: 'desc'
        }
      ],
      propData: [
        {
          name: 'showProgress',
          type: 'Boolean',
          default: 'false',
          desc: '是否展示进度条'
        },
        {
          name: 'target',
          type: 'String',
          default: 'undefined',
          desc: '上传路径'
        },
        {
          name: 'resumableId',
          type: 'String',
          default: 'undefined',
          desc: '组件标识'
        },
        {
          name: 'fileSuccess',
          type: 'Function',
          default: 'undefined',
          desc: '上传成功的回调'
        },
        {
          name: 'fileAdded',
          type: 'Function',
          default: 'undefined',
          desc: '选中文件，上传前的钩子函数'
        },
        {
          name: 'simultaneousUploads',
          type: 'Number',
          default: '4',
          desc: '可支持同时上传的文件数'
        },
        {
          name: 'maxFiles',
          type: 'Number',
          default: 'undefined',
          desc: '批量上传数量'
        },
        {
          name: 'fileType',
          type: 'Array',
          default: '[]',
          desc: '支持的上传文件类型如[".txt"]，默认支持所有类型'
        }
      ]
    }
  },
  methods: {
    async fileAdded (resumableFileObj) {
      // const { size, fileName } = resumableFileObj
      // 你可以在这里做一些上传之前的判断和添加上传的附加参数
      resumableFileObj.customQuery = {
        videoId: this.formItem.id,
        type: 'videos'
      }
      // 如果取消本次上传则 return Promise.reject()
    },
    fileUploadSuccess (resumableFileObj) {
      console.log(resumableFileObj)
    }
  }
}
</script>

<style scoped lang="less">
.uploadBox {
  width: 100%;
  border: 1px dashed #d7dde4;
  text-align: center;
  cursor: pointer;
  position: relative;
  height: 70%;
  .upload-btn {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 20;
  }
  .foot {
    display: flex;
  }
}
</style>
