<template>
  <Table
    class="component-user-list-table"
    ref="table-form"
    border
    :columns="tableColumns"
    :data="tableData"
    @on-selection-change="selectChangeHandle"
  ></Table>
</template>

<script>
export default {
  name: 'EchoTable',
  mounted () {
    this.tableData = this.setCheckedData(this.data)
  },
  props: {
    selectedDatas: {
      type: Array,
      default: () => []
    },
    tableColumns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // 用户数据缓存
      selectedList: [],
      tableData: []
    }
  },
  watch: {
    data (data) {
      this.tableData = this.setCheckedData(data)
    }
  },
  methods: {
    async search (page = this.pageInfo.page) {
      this.tableData = await this.getTableData(page)
      this.tableData = this.setCheckedData(this.tableData)
    },
    selectChangeHandle (selections) {
      // 因为on-selection-change事件返回的是当前页面已选中的列表
      // 所以采用先把当前页的所有在selectedList中的数据清空，再将当前页已选中
      // 的数据push到selectedList中
      this.tableData.forEach(tableData => {
        this.selectedList.forEach((item, index) => {
          if (item.id === tableData.id) {
            this.selectedList.splice(index, 1)
          }
        })
      })
      this.selectedList.push(...selections)
      this.$emit('on-selection-change', this.selectedList)
    },
    resetDataItem (id) {
      this.tableData = this.tableData.map(tabeItem => {
        if (tabeItem.id === id) {
          tabeItem._checked = false
        }
        return tabeItem
      })
    },
    /**
     * 回显
     */
    setCheckedData (data) {
      // 将当前页中与selectedList的数据重合的地方置为选中
      return data.map(tabeItem => {
        if (
          this.selectedList.some(originItem => {
            return tabeItem.id === originItem.id
          })
        ) {
          tabeItem._checked = true
        }
      })
    },
    getSelectData () {
      return this.selectedList
    }
  }
}
</script>

<style scoped>
</style>
