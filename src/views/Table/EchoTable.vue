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
          <div style="text-align: end; padding-top: 10px">
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
          <template v-for="(itemArr, index) in selectedCaches">
            <span :key="index">
              <Tag
                v-for="(item, index) in itemArr"
                :key="index"
                closable
                @on-close="handleClose(item, index)"
                >{{ item.userName }}</Tag
              >
            </span>
          </template>
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
      selectedCaches: []
    }
  },
  methods: {
    async search (page = this.pageInfo.page) {
      this.tableData = await this.getTableData(page)
      this.tableData = this.setCheckedData()
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
      this.$set(this.selectedCaches, this.pageInfo.page - 1, selections)
    },
    handleClose (row, index) {
      const cacheData = this.selectedCaches[this.pageInfo.page - 1]
      cacheData.splice(index, 1)
      this.tableData = this.setCheckedData()
    },
    resetDataItem (id) {
      this.tableData = this.tableData.map((tabeItem) => {
        if (tabeItem.id === id) {
          tabeItem._checked = false
        }
        return tabeItem
      })
    },
    /**
     * 回显
     */
    setCheckedData () {
      const cacheData = this.selectedCaches[this.pageInfo.page - 1]
      if (cacheData && cacheData.length > 0) {
        this.tableData = this.tableData.map((tabeItem) => {
          tabeItem._checked = false
          cacheData.some((originItem) => {
            if (tabeItem.id === originItem.id) {
              tabeItem._checked = true
              return true
            }
          })
          return tabeItem
        })
      }
      return this.tableData
    }
  }
}
</script>

<style scoped>
</style>
