<template>
  <Table :class="[`${tableType}`,'i-table-pro']" :columns="insideColumns" :data="tableData"></Table>
</template>

<script>
  export default {
    name: 'i-table-pro',
    props: {
      columns: {
        type: Array,
        default: () => []
      },
      value: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        tableData: [],
        activeRadioId: null,
        tableType: '',
        insideColumns: []
      }
    },
    mounted () {
      this.checkData()
      this.handleColumns()
    },
    watch: {
      columns () {
        this.handleColumns()
      },
      value () {
        this.checkData()
      }
    },
    methods: {
      handleColumns () {
        this.insideColumns = this.columns.map(item => {
          const { title, width, align, type } = item
          if (type === 'singleSelection') {
            this.tableType = 'singleSelection'
            item = {
              title: title,
              key: 'id',
              width: width || 70,
              align: align || 'center',
              render: (h, { row, index }) => {
                const value = this.activeRadioId === index
                if (value) {
                  this.$set(this.tableData[index], '_checked', true)
                } else {
                  this.$set(this.tableData[index], '_checked', false)
                }
                return (
                  <Checkbox
                    disabled={row._disabled} value={value}
                    nativeOn-click={this.radioClick.bind(this, this.tableData[index], index)}>
                  </Checkbox>
                )
              }
            }
          }
          return item
        })
      },
      checkData () {
        this.tableData = this.deepclone(this.value)
        this.tableData.forEach((item, index) => {
          if (item._checked) {
            this.activeRadioId = index
          }
        })
      },
      radioClick (row, index) {
        if (index === this.activeRadioId) {
          this.activeRadioId = -1
        } else {
          this.activeRadioId = index
        }
        this.$nextTick(() => {
          this.$emit('handleSingleSelect', this.deepclone(row))
        })
      },
      deepclone (originData) {
        if (typeof originData !== 'object' || !originData) {
          return originData
        }
        const result = Object.prototype.toString.call(originData) === '[object Array]' ? [] : {}
        for (const key in originData) {
          if (typeof originData[key] === 'object') {
            result[key] = this.deepclone(originData[key])
          } else {
            result[key] = originData[key]
          }
        }
        return result
      }
    }
  }
</script>

<style>
  .singleSelection.i-table-pro .ivu-checkbox-inner {
    border-radius: 50% !important;
  }
</style>
