<template>
  <div class="set-root-tree">
    <VueCommonTree
      ref="commonPathSelect"
      :selectMode="selectMode"
      :show="showPathSelect"
      :pageSize="pageSize"
      :customRootData="customRootData"
      :isMultiple="isMultiple"
      :displayNew="displayNew"
      :disableNew="disableNewPath"
      :creatNewFileFn="creatNewFileFn"
      @getSubPaths="getSubPaths"
      @selectChange="selectChange"
    ></VueCommonTree>
    <Button @click="showPathSelect=!showPathSelect">切换目录树显示</Button>
  </div>
</template>
<script>
  import {VueCommonTree} from '_c/CommonTree'

  export default {
    data() {
      return {
        showPathSelect: false,
        selectMode: "all",
        isMultiple: true,
        displayNew: true,
        disableNewPath: false,
        pageSize: 3,
        rootPath: 'test',
        customRootData: [
          {
            title: "test",
            type: "folder",
            path: `层级1/`,
            isLoading: true,
            disableSelect: true,
            children: [
              {
                path: `层级1/temp/`,
                title: "temp",
                type: "folder"
              },
              {
                path: `层级1/data/`,
                title: "data",
                type: "folder"
              },
              {
                path: `层级1/model/`,
                title: "model",
                type: "folder"
              }
            ]
          }
        ]
      };
    },
    components: {
      VueCommonTree
    },
    methods: {
      /**
       * desc     当发起目录获取请求时触发
       *
       * nodeData 当前要请求的目录信息,分为两种情况：1、目录树展开，此时为要展开的节点数据；2、获取更多，这时为当前已展开的节点数据
       * callback 回传给内部组件已获取数据的函数
       */
      getSubPaths(nodeData, callback) {
        //若需要定制某层级下的数据，则根据nodeData进行判断
        //模拟接口，返回值必须为如下结构
        setTimeout(() => {
          const res = {
            pageNum: nodeData.page,
            pageSize: 3,
            totalNumbers: 10000,
            content: [
              {
                path: `层级1/temp/`,
                title: "temp",
                type: "folder"
              },
              {
                path: `层级1/data/`,
                title: "data",
                disableSelect: true,
                type: "file"
              },
              {
                path: `层级1/model/`,
                title: "model",
                type: "file"
              }
            ]
          };
          callback(res);
        }, 1000);
      },
      async creatNewFileFn(path) {
        return true;
      },
      //node:当前已点击
      //allSelect:所有已选择节点
      selectChange(node, allSelect) {
        console.log(node, allSelect);
      }
    }
  };
</script>
<style lang="less">
</style>
