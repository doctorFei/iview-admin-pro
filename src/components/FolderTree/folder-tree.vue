<template>
  <Tree :data="treeData" :render="renderFunc"></Tree>
</template>

<script>
export default {
  name: 'FolderTree',
  data () {
    return {
      currentRenamingId: '', // 编辑状态唯一id
      currentRenamingContent: '',
      renderFunc: (h, { root, node, data }) => {
        const dropList =
          data.type === 'folder' ? this.folderDrop : this.fileDrop
        const dropdownRender = dropList.map(item => {
          return <dropdownItem name={item.name}>{item.title}</dropdownItem>
        })
        const isRenaming =
          this.currentRenamingId === `${data.type || 'file'}_${data.nodeKey}`
        return (
          <div
            class="tree-item"
            on-click={this.onNodeSelect.bind(this, { root, node, data })}
          >
            {data.type === 'folder' ? (
              <icon
                type="ios-folder"
                color="#2d8cf0"
                style="margin-right: 10px;"
              />
            ) : (
              <icon
                type="ios-document"
                color="#ffe894"
                style="margin-right: 10px;"
              />
            )}
            {isRenaming ? (
              <span>
                <i-input
                  value={data.title}
                  on-input={this.handleInput}
                  class="tree-rename-input"
                ></i-input>
                <i-button
                  size="small"
                  type="text"
                  on-click={this.saveRename.bind(this, data)}
                >
                  <icon type="md-checkmark" />
                </i-button>
                <i-button size="small" type="text" on-click={this.closeRename}>
                  <icon type="md-close" />
                </i-button>
              </span>
            ) : (
              <span>{data.title}</span>
            )}
            {dropList && !isRenaming ? (
              <dropdown
                placement="right-start"
                on-on-click={this.handleDropdownClick.bind(
                  this,
                  root,
                  node,
                  data
                )}
              >
                <i-button size="small" type="text" class="tree-item-button">
                  <icon type="md-more" size={12} />
                </i-button>
                <dropdownMenu slot="list">{dropdownRender}</dropdownMenu>
              </dropdown>
            ) : (
              ''
            )}
          </div>
        )
      }
    }
  },
  props: {
    folderList: {
      type: Array,
      default: () => []
    },
    fileList: {
      type: Array,
      default: () => []
    },
    treeData: {
      type: Array,
      default: () => []
    },
    folderDrop: Array,
    fileDrop: Array,
    beforeDelete: Function,
    beforeRename: Function
  },
  methods: {
    isFolder (type) {
      return type === 'folder'
    },
    handleDropdownClick (root, node, data, name) {
      if (name === 'rename') {
        this.currentRenamingId = `${data.type || 'file'}_${data.nodeKey}`
      } else if (name === 'delete') {
        this.$Modal.confirm({
          title: '提示',
          content: `您确定要删除${
            this.isFolder(data.type) ? '文件夹' : '文件'
          }《${data.title}》吗？`,
          onOk: () => {
            this.handleDelete(root, node, data)
          }
        })
      }
    },
    onNodeSelect ({ root, node, data }) {
      this.$emit('on-node-select', { root, node, data })
    },
    handleInput (value) {
      this.currentRenamingContent = value
    },
    closeRename () {
      this.currentRenamingId = ''
    },
    saveRename (data) {
      if (this.beforeRename) {
        this.beforeRename(data, this.currentRenamingContent)
          .then(() => {
            // data保持了树的引用关系,所以直接修改可以实现响应式
            data.title = this.currentRenamingContent
            this.$Message.success('重命名成功')
          })
          .catch(() => {
            this.$Message.error('重命名失败')
          })
          .finally(() => {
            this.currentRenamingId = ''
          })
      } else {
        data.title = this.currentRenamingContent
        this.currentRenamingId = ''
      }
    },
    handleDelete (root, node, data, e) {
      if (this.beforeDelete) {
        this.beforeDelete()
          .then(() => {
            this.remove(root, node, data)
          })
          .catch(() => {
            this.$Message.error('删除失败')
          })
      } else {
        this.remove(root, node, data)
      }
    },
    remove (root, node, data) {
      const parentKey = root.find(el => el === node).parent
      const parent = root.find(el => el.nodeKey === parentKey).node
      const index = parent.children.indexOf(data)
      parent.children.splice(index, 1)
    }
  }
}
</script>

<style lang="less">
.tree-item {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  & > .ivu-dropdown {
    float: right;
  }
  ul.ivu-dropdown-menu {
    padding-left: 0;
  }
  li.ivu-dropdown-item {
    margin: 0;
    padding: 7px 16px;
  }
  .tree-rename-input {
    width: ~"calc(100% - 80px)";
  }
}
</style>
