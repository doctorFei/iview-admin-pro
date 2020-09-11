<template>
  <div class="page-tree">
    <VueCommonTree
      ref="commonPathSelect"
      :selectMode="selectMode"
      :show="showPathSelect"
      :rootPath="rootPath"
      :pageSize="pageSize"
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
        rootPath: 'test'
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
            pageNum: nodeData.page,//必须
            pageSize: 3,//必须
            totalNumbers: 10,//必须
            content: [//必须
              {
                path: `层级1/temp/`,
                title: "temp",
                type: "folder"
              },
              {
                path: `层级1/data/`,//必须
                title: "data",//必须
                disableSelect: true,//选择
                type: "file"//必须
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
      //node:当前点击
      //allSelect:所有选择
      selectChange(node, allSelect) {
        console.log(node, allSelect);
      }
    }
  };
</script>
<style lang="less">
</style>
