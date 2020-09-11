<template>
  <Table :columns="insideColumns" :data="value"></Table>
</template>

<script>
import { deepClone } from '@/libs/tool'

export default {
  name: 'edit-table-muti',
  props: ['columns', 'value'],
  data () {
    return {
      insideColumns: [],
      insideData: []
    }
  },
  methods: {
    handleColumns () {
      this.insideData = deepClone(this.value) // 保护数据源，新增响应式数据insideData
      this.insideColumns = this.columns.map(item => {
        if (!item.render && item.editable) {
          item.render = (h, { row, index, column }) => {
            // 以row为单位建立每个编辑状态 edittingKeyArr
            if (!this.insideData[index].edittingKeyArr) {
              this.insideData.splice(index, 1, {
                ...this.insideData[index],
                edittingKeyArr: []
              })
            }
            const keyArr = this.insideData[index].edittingKeyArr
            const isEditing = keyArr.includes(column.key)
            return (
              <div
                className="editCell"
                style="display:flex;align-items: center;"
              >
                {isEditing ? (
                  <i-input
                    style="width:70%"
                    on-input={this.handleInput.bind(this, row, index, column)}
                    value={row[column.key]}
                  />
                ) : (
                  <span>{row[column.key]}</span>
                )}
                <i-button
                  style="margin-left:10px"
                  on-click={this.handleClick.bind(this, {
                    row,
                    index,
                    column,
                    isEditing
                  })}
                >
                  {isEditing ? '保存' : '编辑'}
                </i-button>
              </div>
            )
          }
        }
        return item
      })
    },
    handleInput (row, index, column, newValue) {
      this.insideData[index][column.key] = newValue // 这里不能出发列表刷新
    },
    handleClick ({ row, index, column, isEditing }) {
      if (isEditing) {
        const keyIndex = this.insideData[index].edittingKeyArr.indexOf(
          column.key
        )
        this.insideData[index].edittingKeyArr.splice(keyIndex, 1)
        // 更新

        this.$emit('input', this.insideData)
        this.$emit('on-edit', {
          row,
          index,
          column
        })
      } else {
        this.insideData[index].edittingKeyArr.push(column.key)
      }
    }
  },
  watch: {
    columns: {
      handler () {
        this.handleColumns()
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style scoped>
</style>
