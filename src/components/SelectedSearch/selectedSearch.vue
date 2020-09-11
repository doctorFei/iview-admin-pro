<template>
  <Select
    v-bind="$attrs"
    ref="selectSearch"
    v-model="selectModel"
    label-in-value
    filterable
    clearable
    @on-open-change="openChangeHandler"
    @on-change="changeHandler"
  >
    <slot :options="options">
      <Option
        v-for="item in options"
        :value="item[optionValKey]"
        :key="item[optionValKey]"
      >{{item[optionLableKey]}}</Option>
    </slot>
  </Select>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'selectSearch',
  props: {
    value: [String, Number],
    options: {
      type: Array,
      default: () => []
    },
    optionValKey: {
      type: String,
      default: ''
    },
    optionLableKey: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selectModel: this.value,
      selectName: ''
    }
  },
  mounted () {
    this.clearInputMatch()
  },
  watch: {
    value (val) {
      this.selectModel = val
    }
  },
  methods: {
    changeHandler ({ label, value }) {
      this.selectName = label
      this.$emit('input', value)
      this.$emit('on-change', value)
    },
    openChangeHandler (value) {
      this.$emit('on-open-change', value)
    },
    clearInputMatch () {
      const inputEle = this.$refs.selectSearch.$el.querySelector(
        '.ivu-select-input'
      )
      // 当input重新输入的时候，清空之前的选项
      inputEle.onblur = () => {
        const value = inputEle.value
        const flag = this.options.find(item => {
          return item[this.optionLableKey] === value
        })
        if (!flag) {
          inputEle.value = ''
          this.$refs.selectSearch.clearSingleSelect()
        } else {
          if (value !== this.selectName) {
            inputEle.value = ''
            this.$refs.selectSearch.clearSingleSelect()
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
