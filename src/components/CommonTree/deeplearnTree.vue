<!--
 * @Descripttion: 
 * @version: 
 * @Author: pfwang2
 * @Date: 2019-09-12 15:49:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-10-21 17:19:24
 -->
<template>
  <div class="page-common-select" v-show="show">
    <div class="dir-tree-wrap" style="max-height: 280px">
      <DirTree
        ref="dirTree"
        :data="treeData"
        :multiple="isMultiple"
        :selectMode="selectMode"
        @input-node-blur="inputNodeBlur"
        @on-select-change="selectChange"
        @on-load-more="loadMore"
        @on-toggle-expand="toggleNodeExpand"
      />
    </div>
    <div class="task-path-f clearfix">
      <Button
        v-show="displayNew"
        :disabled="disableNew||disableNewLocal"
        class="btn-new-dir fl"
        @click="createNewDir"
      >新建文件夹</Button>
      <div class="fr">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import DirTree from "./dirTree";
import Message from "./tree/components/message";
export default {
  name:'VueCommonTree',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 10
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    /*
     * fileOnly
     * dirOnly
     * all
     */
    selectMode: {
      type: String,
      default: "all"
    },
    //自定义根目录，需按照一定结构传入
    //必要字段：title  path  type（folder or file）
    //配置字段  isLoading（是否已完成根目录加载）  disableSelect（是否可选）
    customRootData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    //非自定义根目录，首次请求路径  注意：customRootData和rootPath只能设置一个
    rootPath: {
      type: String,
      default: ""
    },
    //是否允许新建
    disableNew: {
      type: Boolean,
      default: true
    },
    //是否显示新建
    displayNew: {
      type: Boolean,
      default: false
    },
    //新建文件夹APi封装函数
    //@param path 创建的路径
    //@callBack   回调函数
    creatNewFileFn: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      treeData: [],
      nodeChildren: [],
      totalNumbers: 0,
      disableNewLocal: true //默认
    };
  },
  methods: {
    //构造根数据
    setRootData(customRootData) {
      const customRootDataCopy = this.deepClone(customRootData);
      customRootDataCopy.forEach(item => {
        item.page = 1;
        item.type == "folder" ? (item.dir = true) : (item.dir = false);
        if (item.children && item.children.length > 0) {
          item.children = this.setRootData(item.children);
        } else {
          item.children = [
            {
              title: "加载",
              type: "loading",
              path: item.path,
              page: 1
            }
          ];
        }
      });
      return customRootDataCopy;
    },
    /**
     * @name:获取子目录
     * @msg: 供外部调用  主要负责数据正确格式拼接
     */

    async getChildrenPath(resData, nodeData, isRoot) {
      this.nodeChildren = [];
      this.totalNumbers = 0;

      const currentPage = nodeData.page;
      const resp = resData;
      if (!resp.content || resp.content.length === 0) {
        Message.info("该文件夹下已无更多数据");
      } else {
        this.totalNumbers = resp.totalNumbers;
        this.nodeChildren = resp.content.map(item => {
          var defaultChildren = {
            title: item.title,
            path: item.path,
            disableSelect: item.disableSelect ? item.disableSelect : false,
            projectId: item.projectId,
            type: item.type,
            dir: item.type == "1" || item.type == "folder" ? true : false,
            expand: false, //文件夹是否打开
            page: 1,
            children: []
          };
          if (item.type == "1" || item.type == "folder") {
            //文件夹
            defaultChildren.children = [
              {
                title: "加载",
                type: "loading",
                page: 1
              }
            ];
          }
          return defaultChildren;
        });
        //根目录非定制
        if (!!isRoot && this.customRootData.length == 0&&this.pageSize * currentPage < this.totalNumbers) {
          this.nodeChildren = [
            ...this.nodeChildren,
            {
              title: "更多",
              type: "more",
              root: true,
              path: nodeData.path,
              page: nodeData.page
            }
          ];
        }
        if(!isRoot && this.customRootData.length == 0&&this.pageSize * currentPage < this.totalNumbers){
          this.nodeChildren = [
            ...this.nodeChildren,
            {
              title: "更多",
              type: "more",
              root: false,
              path: nodeData.path,
              page: nodeData.page
            }
          ];
        }
      }
      return;
    },
    /**
     * @name: 获取子目录
     * nodeData    需获取子目录的节点
     * callback    数据处理完毕后的回掉函数
     * isRoot      是否为根目录加载  （customRootData为空时使用）
     */
    getSubPaths(nodeData, callBack, isRoot = false) {
      this.$emit("getSubPaths", nodeData, async resData => {
        await this.getChildrenPath(resData, nodeData, isRoot);
        callBack();
      });
    },
    //展开或收起目录时触发
    toggleNodeExpand(nodeData) {
      const dirTree = this.$refs.dirTree;
      return new Promise((resolve, reject) => {
        if (nodeData.isLoading) {
          //加载完后不用再次查询
          resolve();
          return
        }
        if (nodeData.expand) {
          console.log('展开数据',nodeData)
          console.log(this.pageSize,nodeData.page,this.totalNumbers)
          this.getSubPaths(nodeData, () => {
            this.$set(nodeData, "isLoading", true); // 该目录已经被展开，并且获取数据，不需要再次获取
            //判断是否需要“更多”
            if (this.pageSize * nodeData.page >= this.totalNumbers) {
              this.$refs.dirTree.setLoadingData(
                nodeData,
                this.nodeChildren,
                true, // 展开
                false
              );
            } else {
              this.$refs.dirTree.setLoadingData(
                nodeData,
                this.nodeChildren,
                true,  // 展开
                true
              );
            }
            resolve();
          });
        }
      });
    },
    //输入框失焦判断
    inputNodeBlur(root, node, data) {
      if (data.title) {
        //判断名称是否合法
        if (!/^[0-9a-zA-Z_(\u4e00-\u9fa5)]{1,20}$/.test(data.title)) {
          Message.warning(
            "名称只能包含中文、字母、数字、下划线，且不能超过20位！"
          );
          this.$refs.dirTree.remove(root, node, data);
        } else {
          this.createDir(root, node, data);
        }
      } else {
        this.$refs.dirTree.remove(root, node, data);
      }
    },
    remove(root, node, data) {
      this.$refs.dirTree.remove(root, node, data);
    },
    //创建
    async createDir(root, node, data) {
      var path = data.path + data.title;
      try {
        const resp = await this.creatNewFileFn(path);
        Message.success("创建成功");
        this.$set(data, "path", `${path}/`);
        this.$set(data, "type", 'folder');
        this.disableNewLocal = false;
      } catch (error) {
        Message.error("该目录下存在同名文件！");
        this.$refs.dirTree.remove(root, node, data);
      }
    },
    //新建文件夹按钮
    async createNewDir() {
      const dirTree = this.$refs.dirTree;
      const selectedNodes = dirTree.getSelectedNodes();
      //不支持多选
      if (selectedNodes.length !== 1) {
        return;
      }
      //打开
      this.$set(selectedNodes[0], "expand", true);
      
      //数据已加载
      if (selectedNodes[0].isLoading) {
        dirTree.append(selectedNodes[0]);
      } else {
        await this.toggleNodeExpand(selectedNodes[0])
        dirTree.append(selectedNodes[0]);
      }
    },
    //选择事件判断
    selectChange(selectedNodes, node, root) {
      this.disableNewLocal = true;
      if (selectedNodes.length == 1) {
        const { dir } = selectedNodes[0];
        if (dir) {
          this.disableNewLocal = false;
        }
      }
      this.$emit("selectChange", node, selectedNodes);
    },
    getSelectNodes() {
      return this.$refs.dirTree.getSelectedNodes();
    },
    //加载更多时触发
    loadMore(node, data) {
      data.page += 1;
      data.type = "loading";
      data.title = "加载";
      console.log('加载更多',data.path, "页数", data.page,data);
      // 异步获取列表
      this.getSubPaths(data, () => {
        if (data.root) {// 是否为根目录
          this.treeData.splice(
            this.treeData.length - 1,
            1,
            ...this.nodeChildren
          );
        } else {
          //判断是否需要“更多”
          if (this.pageSize * data.page >= this.totalNumbers) {
            this.$refs.dirTree.setLoadingData(
              data,
              this.nodeChildren,
              false, // 加载
              false
            );
          } else {
            this.$refs.dirTree.setLoadingData(
              data,
              this.nodeChildren,
              false, // 加载
              true
            );
          }
        }
      },data.root?true:false);
    },
    deepClone(obj) {
      if (typeof obj == "object") {
        var result = obj.constructor == Array ? [] : {};
        for (let i in obj) {
          result[i] =
            typeof obj[i] == "object" ? this.deepClone(obj[i]) : obj[i];
        }
      } else {
        var result = obj;
      }
      return result;
    }
  },
  components: {
    DirTree
  },
  watch: {
    show(value) {
      if (value) {
        if(this.customRootData.length > 0&&this.rootPath){
          Message.error("customRootData和rootPath只能设置一个！");
          return
        }
        if (this.customRootData.length > 0) {
          let customRootDataCopy = this.deepClone(this.customRootData);
          this.treeData = this.setRootData(customRootDataCopy);
        } else {
          this.getSubPaths({ path: this.rootPath, page: 1,root:true}, ()=>{
            this.treeData=this.nodeChildren
          }, true);
        }
      } else {
        this.treeData = [];
      }
    }
  }
};
</script>
<style lang="less" scoped>
.page-common-select {
  .dir-tree-wrap {
    max-height: 350px;
    overflow-y: auto;
  }

  .btn-new-dir {
    float: left;
  }

  .ivu-icon-folder {
    color: #ffb12e;
  }

  .ivu-modal-footer .task-path-f button {
    padding-left: 0px;
    padding-right: 0px;
  }

  .task-path-f {
    padding-top: 20px;
  }

  .tree-modal {
    .ivu-tree-empty {
      display: flex;
      flex-direction: column;
      align-items: center;

      &:before {
        content: "";
        display: block;
        width: 32px;
        height: 32px;
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTY2ODAyNjc1MjIzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM4NDk2IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik0zOC40IDI2OC44djUzNy42YzAgMzUuODQgMjguMTYgNjQgNjQgNjRoNzA0YzIxLjc2IDAgMzguNC0xNi42NCAzOC40LTM4LjRWMzQ1LjZjMC0yMS43Ni0xNi42NC0zOC40LTM4LjQtMzguNEgzOTIuOTZjLTE0LjA4IDAtMjYuODgtNS4xMi0zNS44NC0xNS4zNmwtNDcuMzYtNDcuMzZjLTEwLjI0LTguOTYtMjMuMDQtMTQuMDgtMzcuMTItMTQuMDhINzYuOGMtMjEuNzYgMC0zOC40IDE2LjY0LTM4LjQgMzguNHoiIGZpbGw9IiNGNEY0RjQiIHAtaWQ9IjM4NDk3Ij48L3BhdGg+PHBhdGggZD0iTTM4LjQgMjY4Ljh2NTM3LjZjMCAzNS44NCAyOC4xNiA2NCA2NCA2NGg3MDRjMjEuNzYgMCAzOC40LTE2LjY0IDM4LjQtMzguNFYzNDUuNmMwLTIxLjc2LTE2LjY0LTM4LjQtMzguNC0zOC40SDM5Mi45NmMtMTQuMDggMC0yNi44OC01LjEyLTM1Ljg0LTE1LjM2bC00Ny4zNi00Ny4zNmMtMTAuMjQtOC45Ni0yMy4wNC0xNC4wOC0zNy4xMi0xNC4wOEg3Ni44Yy0yMS43NiAwLTM4LjQgMTYuNjQtMzguNCAzOC40eiBtMjUuNiAwYzAtNy42OCA1LjEyLTEyLjggMTIuOC0xMi44aDE5NS44NGM2LjQgMCAxMi44IDIuNTYgMTcuOTIgNy42OGw0Ny4zNiA0Ny4zNmMxNC4wOCAxNC4wOCAzNC41NiAyMy4wNCA1My43NiAyMy4wNEg4MDYuNGM3LjY4IDAgMTIuOCA1LjEyIDEyLjggMTIuOHY0ODYuNGMwIDcuNjgtNS4xMiAxMi44LTEyLjggMTIuOEgxMDIuNGMtMjEuNzYgMC0zOC40LTE2LjY0LTM4LjQtMzguNFYyNjguOHoiIGZpbGw9IiNDRUNFQ0UiIHAtaWQ9IjM4NDk4Ij48L3BhdGg+PHBhdGggZD0iTTI4Mi44OCA0NjAuOGg2MzcuNDRjMjEuNzYgMCAzOC40IDE2LjY0IDM4LjQgMzguNCAwIDMuODQgMCA3LjY4LTEuMjggMTEuNTJsLTEwMS4xMiAzMjMuODRjLTYuNCAyMS43Ni0yNi44OCAzNS44NC00OC42NCAzNS44NEgxMjIuODhsLTEwLjI0LTI1LjZjMTYuNjQgMCAzMi0xMS41MiAzNS44NC0yOC4xNkwyMzIuOTYgNDk5LjJjNi40LTIzLjA0IDI2Ljg4LTM4LjQgNDkuOTItMzguNHoiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjM4NDk5Ij48L3BhdGg+PHBhdGggZD0iTTkwOC44IDMwNy4yaDc2LjhjNy42OCAwIDEyLjggNS4xMiAxMi44IDEyLjhzLTUuMTIgMTIuOC0xMi44IDEyLjhoLTc2LjhjLTcuNjggMC0xMi44LTUuMTItMTIuOC0xMi44czUuMTItMTIuOCAxMi44LTEyLjh6IG0tNS4xMi03OC4wOGw1My43Ni01My43NmM1LjEyLTUuMTIgMTIuOC01LjEyIDE3LjkyIDBzNS4xMiAxMi44IDAgMTcuOTJMOTIxLjYgMjQ3LjA0Yy01LjEyIDUuMTItMTIuOCA1LjEyLTE3LjkyIDAtNS4xMi0zLjg0LTUuMTItMTIuOCAwLTE3Ljkyek04MzIgMTUzLjZjNy42OCAwIDEyLjggNS4xMiAxMi44IDEyLjh2NzYuOGMwIDcuNjgtNS4xMiAxMi44LTEyLjggMTIuOHMtMTIuOC01LjEyLTEyLjgtMTIuOHYtNzYuOGMwLTcuNjggNS4xMi0xMi44IDEyLjgtMTIuOHoiIGZpbGw9IiNDRUNFQ0UiIHAtaWQ9IjM4NTAwIj48L3BhdGg+PHBhdGggZD0iTTE1My42IDgzMmg2NzguNHYxMi44SDE1My42eiIgZmlsbD0iI0NFQ0VDRSIgb3BhY2l0eT0iLjQwMiIgcC1pZD0iMzg1MDEiPjwvcGF0aD48cGF0aCBkPSJNODA3LjY4IDg3MC40SDEyMi44OGwtMjUuNi0yMC40OCAyMS43Ni03LjY4YzEyLjgtNS4xMiAyNC4zMi0xNC4wOCAyOS40NC0yNi44OEwyMzIuOTYgNDk5LjJjNi40LTIxLjc2IDI2Ljg4LTM4LjQgNDkuOTItMzguNGg2MzcuNDRjMjEuNzYgMCAzOC40IDE2LjY0IDM4LjQgMzguNCAwIDMuODQgMCA3LjY4LTEuMjggMTEuNTJsLTEwMS4xMiAzMjMuODRjLTYuNCAyMS43Ni0yNi44OCAzNS44NC00OC42NCAzNS44NHpNMTY2LjQgODQ0LjhoNjQxLjI4YzExLjUyIDAgMjAuNDgtNy42OCAyNC4zMi0xNy45MmwxMDEuMTItMzIzLjg0VjQ5OS4yYzAtNy42OC01LjEyLTEyLjgtMTIuOC0xMi44SDI4Mi44OGMtMTEuNTIgMC0yMS43NiA3LjY4LTI0LjMyIDE5LjJsLTgxLjkyIDMwOC40OGMtMS4yOCAzLjg0LTIuNTYgNy42OC0zLjg0IDEwLjI0TDE2Ni40IDg0NC44eiIgZmlsbD0iI0NFQ0VDRSIgcC1pZD0iMzg1MDIiPjwvcGF0aD48L3N2Zz4=);
        background-size: 32px 32px;
      }
    }
  }
}
</style>