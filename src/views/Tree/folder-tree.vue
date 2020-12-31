<template>
  <div class="folder-wrapper">
    <!-- <Tree :data="folderTree" :render="renderFunc"></Tree> -->
    <folder-tree
      :folder-list.sync="folderList"
      :file-list.sync="fileList"
      :folder-drop="folderDrop"
      :file-drop="fileDrop"
      :beforeDelete="beforeDelete"
    />
  </div>
</template>

<script>
import { getFolderList, getFileList } from '@/api/tree'
import FolderTree from '_c/FolderTree'
export default {
  components: {
    FolderTree
  },
  data () {
    return {
      folderList: [],
      fileList: [],
      folderDrop: [
        {
          name: 'rename',
          title: '重命名'
        },
        {
          name: 'delete',
          title: '删除文件夹'
        }
      ],
      fileDrop: [
        {
          name: 'rename',
          title: '重命名'
        },
        {
          name: 'delete',
          title: '删除文件'
        }
      ]
    }
  },
  methods: {
    beforeDelete () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const error = null
          if (!error) {
            resolve()
          } else reject(error)
        }, 2000)
      })
    }
  },
  mounted () {
    Promise.all([getFolderList(), getFileList()]).then((res) => {
      this.folderList = res[0].data
      this.fileList = res[1].data
    })
  }
}
</script>

<style lang="less">
.folder-wrapper {
  width: 300px;
}
</style>
