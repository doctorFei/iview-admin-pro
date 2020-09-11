<template>
  <div style="height:100%">
    <div class="wrap-tree">
      <Tree
        @on-select-change="selectChangeHandler"
        v-if="show"
        :data="data5"
        :render="renderContent"
        ref="docTree"
        class="demo-tree-render"
      ></Tree>
    </div>
  </div>
</template>
<script>
import docData from './treedoc.json'
const ITEM_TYPE = {
  catalog: 'catalog',
  ability: 'ability',
  doc: 'doc'
}
export default {
  mounted () {
    this.data5 = docData.data
    this.getNeedTreeData(this.data5)
    this.reShowData = [
      '1591585710503ze',
      '1587985096669tq7a',
      '1596781541938',
      '75'
    ]
    this.echoNode(this.data5)
    this.show = true
  },
  data () {
    return { data5: [], menuStack: [], show: false }
  },
  methods: {
    renderContent (h, { root, node, data }) {
      return (
        <div
          class={
            data.type === ITEM_TYPE.catalog ? 'catalog-title' : 'doc-title'
          }
          on-click={(e) => {
            e.stopPropagation() // 阻止事件冒泡，阻碍底层操作
            this.menuClick({ root, node, data })
          }}
        >
          {data.name + (data.label ? '-' + data.label : '')}
        </div>
      )
    },
    menuClick ({ root, node, data }) {
      // if (data.disabled) return
      if (data.type === ITEM_TYPE.doc) {
        const docTree = this.$refs.docTree
        const currentSelectedNodes = docTree.getSelectedNodes() || []
        currentSelectedNodes.forEach((item) => {
          if (item.nodeKey !== data.nodeKey) {
            this.$set(item, 'selected', false)
          }
        })
        this.$set(data, 'selected', true)
        this.getMenuStack(root, node, data)
      } else {
        this.$set(data, 'expand', !data.expand)
      }
    },
    selectChangeHandler (node) {},
    getMenuStack (root, node, data) {
      this.menuStack = [data.id]
      let nodeObj = node
      while (nodeObj && root.find((el) => el === nodeObj).parent) {
        const parentKey = root.find((el) => el === nodeObj).parent
        const parent = root.find((el) => el.nodeKey === parentKey)
        this.menuStack.push(parent.node.id)
        nodeObj = parent
      }
    },
    getNeedTreeData (data) {
      data.forEach((item) => {
        item.children = item.children || []
        if (item.children && item.children.length > 0) {
          for (var index = 0; index < item.children.length; index++) {
            const children = item.children[index]
            if (children.type === 'catalog') {
              const ability = children.children || []
              item.children.splice(index, 1, ...ability)
              if (ability.length === 0) {
                // 解决数据塌陷问题
                index--
              }
            }
          }
        }
      })
    },
    // 设置可选中性disabled
    // setDataDisabled (data) {
    //   return data.map((item) => {
    //     if (item.type !== ITEM_TYPE.doc) {
    //       item.disabled = true
    //     }
    //     if (item.children && item.children.length > 0) {
    //       item.children = this.setDataDisabled(item.children)
    //     }
    //     return item
    //   })
    // },
    // 节点回显
    echoNode (data) {
      data.forEach((item) => {
        if (this.reShowData.includes(item.id)) {
          this.$set(item, 'expand', true)
          if (item.id === this.reShowData[0]) {
            this.$set(item, 'selected', true) // 这个地方注意，要保留其响应式数据结构
          }
        }
        if (item.children && item.children.length > 0) {
          this.echoNode(item.children)
        }
      })
    }
  }
}
</script>
<style lang='less'>
.wrap-tree {
  height: 100%;
  position: relative;
  width: 340px;
  background: #fafafa;
  z-index: 2;
  overflow: auto;
}
.demo-tree-render {
  width: 320px;
  background-color: transparent !important;
  .ivu-tree-arrow i {
    line-height: 34px;
  }
  .doc-title {
    font-size: 14px;
    width: 100%;
    line-height: 34px;
  }
  .catalog-title {
    font-size: 14px;
    width: 100%;
    line-height: 34px;
  }
  .ivu-tree-title-selected {
    color: #1890ff;
    background-color: transparent;
  }
  .ivu-tree-title {
    width: 100%;
  }
}
</style>
