<template>
  <div class="page-echo-table">
    <Row>
      <Col span="18">
        <Card>
          <p slot="title">表单</p>
          <Table
            class="component-user-list-table"
            ref="table-form"
            border
            :columns="tableColumns"
            :data="tableData"
            @on-selection-change="selectChangeHandle"
          ></Table>
          <div style="text-align: end;padding-top: 10px">
            <Page
              @on-change="pageChange"
              :total="pageInfo.total"
              :current.sync="pageInfo.page"
              show-elevator
            />
          </div>
        </Card>
      </Col>
      <Col span="4" offset="2">
        <Card>
          <p slot="title">选择列表</p>
          <Tag
            v-for="(item,index) in selectedList"
            :key="item.index"
            closable
            @on-close="handleClose(item,index)"
          >{{item.userName}}</Tag>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { getTableData } from '@/api/table'

export default {
  name: 'EchoTable',
  async created () {
    await this.search()
  },
  props: {
    selectedDatas: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '用户账号',
          key: 'account'
        },
        {
          title: '用户名称',
          key: 'userName'
        }
      ],
      tableData: [],
      pageInfo: {
        total: 50,
        pageSize: 10,
        page: 1
      },
      // 用户数据缓存
      selectedList: []
    }
  },
  methods: {
    async search (page = this.pageInfo.page) {
      this.tableData = await this.getTableData(page)
      this.tableData = this.setCheckedData(this.tableData)
    },
    async getTableData (page) {
      const {
        data: { content, totalNumbers, currentPage }
      } = await getTableData({
        pageIndex: page
      })
      this.pageInfo.total = totalNumbers
      this.pageInfo.page = currentPage * 1
      return content
    },
    pageChange (page) {
      this.search(page)
    },
    selectChangeHandle (selections) {
      // 所选对象的深拷贝
      // 先清除当前页的数据，后push
      this.tableData.forEach(tableData => {
        this.selectedList.forEach((item, index) => {
          if (item.id === tableData.id) {
            this.selectedList.splice(index, 1)
          }
        })
      })
      this.selectedList.push(...selections)
    },
    handleClose (row, index) {
      this.resetDataItem(row.id)
      this.selectedList.splice(index, 1)
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
      data.forEach(tabeItem => {
        this.selectedList.forEach(originItem => {
          if (tabeItem.id === originItem.id) {
            tabeItem._checked = true
          }
        })
      })
      return data
    }
  }
}
</script>

<style scoped>
</style>
