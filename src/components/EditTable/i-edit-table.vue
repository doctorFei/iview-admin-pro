<template>
  <Table :columns="insideColumns" :data="value"></Table>
</template>
<script>
export default {
  name: 'i-edit-table',
  props: {
    columns: {
      type: Array,
      default: () => [],
      require: true
    },
    value: {
      type: Array,
      require: true,
      default: () => []
    }
  },
  data () {
    return {
      insideColumns: [],
      inputValue: '',
      edittingId: ''
    }
  },
  mounted () {
    this.handleColumns()
  },
  watch: {
    columns () {
      this.handleColumns()
    }
  },
  methods: {
    handleColumns () {
      this.insideColumns = this.columns.map(item => {
        if (!item.render && item.editable) {
          item.render = (h, { row, index, column }) => {
            const isEditing = `${row._index}_${column.key}` === this.edittingId
            return (
              <div class="editCell" style="display:flex;align-items: center;">
                {isEditing ? (
                  <i-input
                    style="width:70%"
                    on-input={this.handleInput}
                    value={row[column.key]}
                  />
                ) : (
                  <p
                    class="clamp"
                    title={row[column.key]}
                    style="-webkit-box-orient: vertical"
                  >
                    {row[column.key]}
                  </p>
                )}
                <i-button
                  style="margin-left:10px"
                  size="small"
                  on-click={this.handleClick.bind(this, {
                    row,
                    index,
                    column
                  })}
                >
                  {isEditing ? '保存' : '修改'}
                </i-button>
              </div>
            )
          }
        }
        return item
      })
    },
    handleClick ({ row, index, column }) {
      if (this.edittingId === `${row._index}_${column.key}`) {
        const { rule } = column
        if (!!rule && !rule.reg.test(this.inputValue)) {
          this.$Message.error(rule.info)
          return
        }
        const dataCopy = this.value
        if (dataCopy[index][column.key] !== this.inputValue) {
          dataCopy[index][column.key] = this.inputValue
          this.$emit('on-edit', {
            row,
            index,
            column,
            newValue: this.inputValue
          })
        }
        this.inputValue = ''
        this.edittingId = ''
      } else {
        this.edittingId = `${row._index}_${column.key}`
        this.inputValue = row[column.key]
      }
    },
    handleInput (newValue) {
      this.inputValue = newValue
    }
  }
}
</script>

<style>
.clamp {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
