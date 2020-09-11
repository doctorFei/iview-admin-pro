<template>
  <div class="dir-tree-container new">
    <ITree
      ref="dirTree"
      :data="treeData"
      :render="renderContent"
      @on-toggle-expand="toggleNodeExpand"
    ></ITree>
  </div>
</template>
<script>
import ITree from "./tree/index";
if (!Array.prototype.find) {
  Array.prototype.find = function (callback) {
    const len = this.length;

    let item = null;

    for (let i = 0; i < len; i++) {
      if (callback(this[i], i, this)) {
        item = this[i];
        break;
      }
    }

    return item;
  };

  Array.prototype.findIndex = function (callback) {
    const len = this.length;

    let index = -1;

    for (let i = 0; i < len; i++) {
      if (callback(this[i], i, this)) {
        index = i;

        break;
      }
    }

    return index;
  };
}

export default {
  components: {
    ITree,
  },
  props: {
    // 目录树数据
    data: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    /*
     * fileOnly
     * dirOnly
     * all
     */
    selectMode: {
      type: String,
      default: "all",
    },
  },
  data() {
    return {
      // active loading 项索引
      loadingNodeKey: -1,
      // 渲染数据
      treeData: this.data,
      //
      buttonProps: {
        type: "default",
        size: "small",
      },
      iconFolder: "ios-folder",
      iconFolderOpen: "ios-folder-open",
      iconFile: "ios-paper",
    };
  },
  mounted() {},
  watch: {
    // 当data数据发生变化后，更新视图
    data(v) {
      this.treeData = v;
    },
  },

  methods: {
    resetLoadingKey() {
      this.loadingNodeKey = -1;
    },

    setLoadingKey(key) {
      this.loadingNodeKey = key;
    },

    renderContent(h, { root, node, data }) {
      // node 节点自定义渲染方法
      const {
        type,
        selected, // 是否选中
        dir,
        expand, // 是否展开
        title,
        nodeKey,
      } = data;

      let iconType = this.iconFile;

      if (dir) {
        // 是否是文件夹
        if (expand) {
          iconType = this.iconFolderOpen;
        } else {
          iconType = this.iconFolder;
        }
      }
      switch (type) {
        case "loading":
          iconType = "ios-loop";
          break;
        case "more":
          iconType = "ios-more";
          break;
        default:
          break;
      }

      return h(
        "div",
        {
          class: "dir-tree-node",
        },
        [
          // title
          h(
            "div",
            {
              class: `dir-tree-node-main${selected ? " selected" : ""}`,
              on: {
                click: () => {
                  this.toggleNodeSelect(node, data, root);
                  if (type === "more" && !type !== "loading") {
                    this.loadingNodeKey = data.nodeKey;
                    // 触发点击事件
                    !selected && this.$emit("on-load-more", node, data);
                  }
                },
              },
            },
            [
              h("Icon", {
                props: {
                  type: iconType,
                },
                style: {
                  marginRight: "8px",
                },
              }),
              type === "input"
                ? h("input", {
                    class: "dir-tree-input",
                    props: {
                      size: "small",
                      autofocus: true,
                    },
                    on: {
                      blur: () => {
                        this.handleInputBlur(root, node, data);
                      },
                      keyup: (e) => {
                        if (e.keyCode != 13) {
                          this.handleInputTextChange(data, e);
                        }
                      },
                      keydown: (e) => {
                        if (e.keyCode == 13) {
                          e.target.blur();
                        }
                      },
                    },
                  })
                : h("span", title),
            ]
          ),
        ]
      );
    },

    append(data) {
      const dirTree = this.$refs.dirTree;

      const { flatState } = dirTree;

      const currentInput = flatState.find((item) => item.node.input);
      currentInput && this.remove(flatState, currentInput, currentInput.node);

      const children = data.children || [];

      let offset = 1;

      if (children.length && children[children.length - 1].type === "more") {
        children.splice(children.length - 1, 0, {
          title: "",
          type: "input",
          expand: false,
          dir: true,
          selected: false,
          path: data.path,
        });

        offset = 2;
      } else {
        children.push({
          title: "",
          type: "input",
          expand: false,
          dir: true,
          selected: false,
          path: data.path,
        });
      }

      this.$set(data, "children", children);

      const nodeData = data.children[data.children.length - offset];

      this.$nextTick(() => {
        document.querySelector(".dir-tree-input") &&
          document.querySelector(".dir-tree-input").focus();
      });
    },

    remove(root, node, data) {
      const dirTree = this.$refs.dirTree;

      const parentKey = root.find((el) => el === node).parent;
      const parent = root.find((el) => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);

      dirTree.$emit("on-select-change", dirTree.getSelectedNodes(), node);
      this.$emit("on-select-change", dirTree.getSelectedNodes(), node);
    },

    loopDirChildren(node, dirArr) {
      // 开始遍历子节点文件夹
      if (!node.input && !node.more) {
        dirArr.push(node.nodeKey);
        if (node.children && node.children.length) {
          node.children.forEach((item) => this.loopDirChildren(item, dirArr));
        }
      }
    },

    // 获取某个文件夹的继承链，即祖先节点和子孙节点
    loopDirParents(node, root, dirArr) {
      const parentKey = root[node.nodeKey].parent;
      if (parentKey === 0) {
        // 当遍历到根节点时，表示结束
        dirArr.push(0);
      } else if (!parentKey) {
      } else {
        dirArr.push(parentKey);
        this.loopDirParents(root[parentKey].node, root, dirArr);
      }
    },

    toggleNodeSelect(node, data, root) {
      if (
        data.disableSelect ||
        (this.selectMode === "fileOnly" && data.dir === true) ||
        (this.selectMode === "dirOnly" && data.dir === false) ||
        data.type === "loading" ||
        data.type === "input" ||
        data.type === "more"
      ) {
        return;
      }

      const dirTree = this.$refs.dirTree;

      const currentSelectedNodes = dirTree.getSelectedNodes() || [];
      // 如果是单选，则清空之前选中的项
      if (!this.multiple) {
        // 点击更多或者输入框
        currentSelectedNodes.forEach((item) => {
          if (item.nodeKey !== data.nodeKey) {
            this.$set(item, "selected", false);
          }
        });
        this.$set(data, "selected", true);
      } else {
        // 选择文件夹
        if (data.dir) {
          // 获取所有在继承链上的文件夹
          const parentDirs = [];
          const childrenDirs = [];
          this.loopDirParents(data, root, parentDirs);
          this.loopDirChildren(data, childrenDirs);
          const extendsDirs = [...parentDirs, ...childrenDirs];

          // 如果已选中的节点中有在当前选择的节点的继承链

          currentSelectedNodes.forEach((item) => {
            // 相同文件夹、加载更多或输入框算通过校验
            if (
              item.nodeKey !== data.nodeKey &&
              extendsDirs.includes(item.nodeKey)
            ) {
              // 当前选中的项有其祖先文件夹或后代文件夹，则清空他们，只保留非直接关系文件夹
              this.$set(item, "selected", false);
            }
          });
        } else {
          const parentDirs = [];
          this.loopDirParents(data, root, parentDirs);
          currentSelectedNodes.forEach((item) => {
            if (parentDirs.includes(item.nodeKey)) {
              this.$set(item, "selected", false);
            }
          });
        }

        this.$set(data, "selected", !data.selected);
      }
      dirTree.$emit("on-select-change", dirTree.getSelectedNodes(), node);
      this.$emit("on-select-change", dirTree.getSelectedNodes(), node, root);
    },

    handleInputBlur(root, node, data) {
      this.$emit("input-node-blur", root, node, data);
    },

    handleInputTextChange(data, e) {
      this.$set(data, "title", e.target.value);
    },

    getSelectedNodes() {
      return this.$refs.dirTree.getSelectedNodes();
    },

    getTreeData() {
      return this.$refs.dirTree.data;
    },

    /*
     * 设置加载更多数据
     * @param node       点击的更多节点信息
     * @param moreData   拉取到的节点数组
     * @param expand     为 true 表示展开时的数据加载
     * @param hasMore    加载完数据后是否继续显示更多按钮
     */
    setLoadingData(node, moreData, expand, hasMore = true) {
      const dirTree = this.$refs.dirTree;
      const { flatState: root } = dirTree;

      if (expand) {
        if (!node.children) {
          this.$set(node, "children", moreData);
        } else {
          const len = node.children.length;
          node.children.splice(len - 1, 1, ...moreData);
        }
      } else {
        const parentKey = root.find((el) => el.nodeKey === node.nodeKey).parent;
        const parent = root.find((el) => el.nodeKey === parentKey).node;
        parent.children.splice(parent.children.length - 1, 1, ...moreData);
      }
    },
    toggleNodeExpand(node) {
      this.$emit("on-toggle-expand", node);
    },
  },
};
</script>

<style lang="less" scoped>
.dir-tree-container * {
  user-select: none;
}
</style>

<style lang="less">
.dir-tree-container.new {
  .dir-tree-input {
    width: 100%;
    padding: 2px 7px;
    font-size: 14px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #515a6e;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
  }
  .ivu-tree li ul {
    padding-left: 24px;
  }

  .ivu-tree-arrow {
    position: relative;
    float: left;
    top: 2px;
  }

  .dir-tree-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 18px;
  }

  .dir-tree-node-main {
    display: flex;
    align-items: center;
    padding: 3px 8px 3px 6px;

    cursor: pointer;

    &.selected {
      border-radius: 2px;
      background: #eee;
    }

    .tree-ivu-icon {
      font-size: 18px;
    }

    .tree-ivu-icon-ios-folder,
    .tree-ivu-icon-ios-folder-open {
      color: #ffb12e;
    }

    .tree-ivu-icon-ios-more {
      color: #21b0fd;
    }

    .tree-ivu-icon-ios-loop {
      color: #21b0fd;
      font-size: 16px;
      animation: ani-spin 1s linear infinite;
    }

    .tree-ivu-icon-ios-paper {
      color: #21b0fd;
    }

    .ivu-input {
      width: auto;
    }
  }

  .tree-ivu-icon-ios-arrow-forward {
    display: inline-block;
    width: 14px;
    height: 14px;
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTY2NDU2NzY1NjY4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI4ODIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMzg0IDY3MnYtMzIwYzAtMTkuMiAxMi44LTMyIDMyLTMyIDYuNCAwIDEyLjggMCAxOS4yIDYuNGwyMzAuNCAxNjBjMTIuOCAxMi44IDE5LjIgMzIgNi40IDQ0LjhsLTYuNCA2LjQtMjMwLjQgMTYwYy0xMi44IDEyLjgtMzIgNi40LTQ0LjgtNi40LTYuNC02LjQtNi40LTEyLjgtNi40LTE5LjJ6IiBwLWlkPSIyODgzIiBmaWxsPSIjNjY2NjY2Ij48L3BhdGg+PC9zdmc+");
    background-size: 16px 16px;
    background-position: -1px -1px;

    &:before {
      display: none;
    }
  }

  .tree-ivu-icon-ios-folder,
  .tree-ivu-icon-ios-folder-open,
  .tree-ivu-icon-ios-paper {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-size: 16px 16px;

    &:before {
      display: none;
    }
  }

  .tree-ivu-icon-ios-folder {
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTY2NDU3MTc5NzY5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ2NDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTYwIDEyOGgyNjguOGMxMi44IDAgMjUuNiA2LjQgMjUuNiAxOS4ybDQ0LjggODkuNmM2LjQgMTIuOCAxOS4yIDE5LjIgMzIgMTkuMmgzMzIuOGMxOS4yIDAgMzIgMTIuOCAzMiAzMnY1NzZjMCAxOS4yLTEyLjggMzItMzIgMzJoLTcwNGMtMTkuMiAwLTMyLTEyLjgtMzItMzJ2LTcwNGMwLTE5LjIgMTIuOC0zMiAzMi0zMnoiIGZpbGw9IiMwQzhDRkEiIHAtaWQ9IjQ2NDEiPjwvcGF0aD48cGF0aCBkPSJNMTYwIDM1Mkg4OTZ2NTEyYzAgMTkuMi0xMi44IDMyLTMyIDMyaC03MDRjLTE5LjIgMC0zMi0xMi44LTMyLTMyVjM4NGMwLTE5LjIgMTIuOC0zMiAzMi0zMnoiIGZpbGw9IiMwQzhDRkEiIHAtaWQ9IjQ2NDIiPjwvcGF0aD48cGF0aCBkPSJNMTYwIDM1Mkg4OTZ2NTEyYzAgMTkuMi0xMi44IDMyLTMyIDMyaC03MDRjLTE5LjIgMC0zMi0xMi44LTMyLTMyVjM4NGMwLTE5LjIgMTIuOC0zMiAzMi0zMnoiIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iLjQ4IiBwLWlkPSI0NjQzIj48L3BhdGg+PHBhdGggZD0iTTE2MCAzNTJoMTUzLjZjNi40IDAgMTIuOCAwIDEyLjgtNi40bDUxLjItMjUuNkg4NjRjMTkuMiAwIDMyIDEyLjggMzIgMzJIMTYweiIgZmlsbD0iI0YzRjhGRiIgcC1pZD0iNDY0NCI+PC9wYXRoPjwvc3ZnPg==");
  }

  .tree-ivu-icon-ios-folder-open {
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTY2NDU3MTcwMTUxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ1MjUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTYwIDEyOGgyNjguOGMxMi44IDAgMjUuNiA2LjQgMjUuNiAxOS4ybDQ0LjggODkuNmM2LjQgMTIuOCAxOS4yIDE5LjIgMzIgMTkuMmgzMzIuOGMxOS4yIDAgMzIgMTIuOCAzMiAzMnY1NzZjMCAxOS4yLTEyLjggMzItMzIgMzJoLTcwNGMtMTkuMiAwLTMyLTEyLjgtMzItMzJ2LTcwNGMwLTE5LjIgMTIuOC0zMiAzMi0zMnoiIGZpbGw9IiMwQzhDRkEiIHAtaWQ9IjQ1MjYiPjwvcGF0aD48cGF0aCBkPSJNMzA3LjIgMzg0aDYzMy42YzM4LjQgMCA2NCAyNS42IDY0IDY0djEyLjhsLTk2IDM5Ni44Yy02LjQgMjUuNi0yNS42IDM4LjQtNTEuMiAzOC40SDE2MGMtMTIuOCAwLTI1LjYtMTIuOC0yNS42LTI1LjZ2LTYuNGwxMDguOC00MjguOGM2LjQtMzIgMzItNTEuMiA2NC01MS4yeiIgZmlsbD0iIzBDOENGQSIgcC1pZD0iNDUyNyI+PC9wYXRoPjxwYXRoIGQ9Ik0zMDcuMiAzODRoNjMzLjZjMzguNCAwIDY0IDI1LjYgNjQgNjR2MTIuOGwtOTYgMzk2LjhjLTYuNCAyNS42LTI1LjYgMzguNC01MS4yIDM4LjRIMTYwYy0xMi44IDAtMjUuNi0xMi44LTI1LjYtMjUuNnYtNi40bDEwOC44LTQyOC44YzYuNC0zMiAzMi01MS4yIDY0LTUxLjJ6IiBmaWxsPSIjRkZGRkZGIiBmaWxsLW9wYWNpdHk9Ii40OCIgcC1pZD0iNDUyOCI+PC9wYXRoPjxwYXRoIGQ9Ik05OTguNCA0MTZIMzIwYy0xOS4yIDAtMzguNCAxMi44LTM4LjQgMzJsLTEyMS42IDQ0OGMtMTIuOCAwLTI1LjYtMTIuOC0yNS42LTI1LjZ2LTYuNGwxMDguOC00MjguOGM2LjQtMzIgMzItNTEuMiA2NC01MS4yaDYzMy42YzI1LjYgMCA0NC44IDEyLjggNTcuNiAzMnoiIGZpbGw9IiNGM0Y4RkYiIHAtaWQ9IjQ1MjkiPjwvcGF0aD48L3N2Zz4=");
  }

  .tree-ivu-icon-ios-paper {
    position: relative;
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTY2NDU3Njk3NDQ3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ3NTUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTUzLjYgMTI4SDY0MHYyMDQuOGMwIDI1LjYgMjUuNiA1MS4yIDUxLjIgNTEuMkg4OTZ2NDg2LjRjMCAxMi44LTEyLjggMjUuNi0yNS42IDI1LjZIMTUzLjZjLTEyLjggMC0yNS42LTEyLjgtMjUuNi0yNS42VjE1My42YzAtMTIuOCAxMi44LTI1LjYgMjUuNi0yNS42eiBtMTI4IDQ0OGMtMTIuOCAwLTI1LjYgMTIuOC0yNS42IDI1LjZ2MTIuOGMwIDEyLjggMTIuOCAyNS42IDI1LjYgMjUuNmgyNjguOGMxMi44IDAgMjUuNi0xMi44IDI1LjYtMjUuNnYtMTIuOGMwLTEyLjgtMTIuOC0yNS42LTI1LjYtMjUuNkgyODEuNnogbTAgMTI4Yy0xMi44IDAtMjUuNiAxMi44LTI1LjYgMjUuNnYxMi44YzAgMTIuOCAxMi44IDI1LjYgMjUuNiAyNS42aDIwNC44YzEyLjggMCAyNS42LTEyLjggMjUuNi0yNS42di0xMi44YzAtMTIuOC0xMi44LTI1LjYtMjUuNi0yNS42SDI4MS42eiIgZmlsbD0iI0ZDREM1MCIgcC1pZD0iNDc1NiI+PC9wYXRoPjxwYXRoIGQ9Ik02NzIgMTI4TDg5NiAzNTJoLTE5OC40Yy0xMi44IDAtMjUuNi0xMi44LTI1LjYtMjUuNlYxMjh6IiBmaWxsPSIjRDJBRTEwIiBwLWlkPSI0NzU3Ij48L3BhdGg+PC9zdmc+");

    &:before {
      display: block;
      content: "";
      position: absolute;
      left: -24px;

      width: 16px;
      height: 16px;

      background-size: 16px 16px;
      background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU2LjMgKDgxNzE2KSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5pY29ucy9pY29uXzE2L2Ryb3Bkb3duL2ljb25fZHJvcGRvd25fbGluZSAjbm9yPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9Imljb25zL2ljb25fMTYvZHJvcGRvd24vaWNvbl9kcm9wZG93bl9saW5lLSNub3IiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYuNzUwMDAwLCAxLjc1MDAwMCkiIGZpbGw9IiM5OTk5OTkiIGlkPSJpYyI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLDAuMjUgTDAsNi44NSBDMCw3LjIwODk4NTA5IDAuMjkxMDE0OTEzLDcuNSAwLjY1LDcuNSBMNi4yNSw3LjUgQzYuMzg4MDcxMTksNy41IDYuNSw3LjM4ODA3MTE5IDYuNSw3LjI1IEM2LjUsNy4xMTE5Mjg4MSA2LjM4ODA3MTE5LDcgNi4yNSw3IEwwLjY1LDcgQzAuNTY3MTU3Mjg4LDcgMC41LDYuOTMyODQyNzEgMC41LDYuODUgTDAuNSwwLjI1IEMwLjUsMC4xMTE5Mjg4MTMgMC4zODgwNzExODcsMCAwLjI1LDAgQzAuMTExOTI4ODEzLDAgMCwwLjExMTkyODgxMyAwLDAuMjUgWiI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgICAgICA8cmVjdCBpZD0iY292ZXIiIG9wYWNpdHk9IjAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDguMDAwMDAwLCA4LjAwMDAwMCkgcm90YXRlKC05MC4wMDAwMDApIHRyYW5zbGF0ZSgtOC4wMDAwMDAsIC04LjAwMDAwMCkgIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjwvcmVjdD4KICAgIDwvZz4KPC9zdmc+");
    }
  }
}

@keyframes ani-spin {
  from {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
