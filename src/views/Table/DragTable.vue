<template>
  <div class="page-dargTable">
    <p class="title">本例基于sortable.js实现，新版ivew(4.x)已封装拖拽功能，需开启draggable属性</p>
    <Table row-key ref="dragTable" :columns="columns" :data="tableData"></Table>
  </div>
</template>
<script>
  import Sortable from 'sortablejs'

  export default {
    data () {
      return {
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: 'Name',
            key: 'name'
          },
          {
            title: 'Age',
            key: 'age'
          },
          {
            title: 'Address',
            key: 'address'
          }
        ],
        tableData: [
          {
            id: 1,
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park',
            date: '2016-10-03'
          },
          {
            id: 2,
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park',
            date: '2016-10-01'
          },
          {
            id: 3,
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park',
            date: '2016-10-02'
          },
          {
            id: 4,
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park',
            date: '2016-10-04'
          }
        ]
      }
    },
    created () {
      this.$nextTick(() => {
        this.setDrag()
      })
    },
    methods: {
      setDrag () {
        const dragDom = this.$refs.dragTable.$el.querySelector('.ivu-table-tbody')
        this.sortable = Sortable.create(dragDom, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function (dataTransfer) {
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            dataTransfer.setData('Text', '')
          },
          onEnd: evt => {
            // 获取拖拽的行数据
            const targetRow = this.tableData.splice(evt.oldIndex, 1)[0]
            // 设置拖拽后的行数据位置
            this.tableData.splice(evt.newIndex, 0, targetRow)
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .page-dargTable {
    padding: 10px;
    .title {
      line-height: 60px;
    }
  }
</style>
