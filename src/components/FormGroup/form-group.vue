<template>
  <Form
    ref="form"
    v-if="Object.keys(valueList).length"
    :label-width="labelWidth"
    :model="valueList"
    :rules="rules"
  >
    <FormItem
      v-for="(item, index) in list"
      :label="item.label"
      label-position="left"
      :prop="item.name"
      :error="errorStore[item.name]"
      :key="`${_uid}_${index}`"
      @click.native="handleFocus(item.name)"
    >
      <component :is="item.type" :range="item.range" v-model="valueList[item.name]">
        <template v-if="item.children">
          <component
            v-for="(child, i) in item.children.list"
            :is="item.children.type"
            :key="`${_uid}_${index}_${i}`"
            :label="child.label"
            :value="child.value"
          >{{ child.title }}</component>
        </template>
      </component>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary">提交</Button>
      <Button @click="handleReset">重置</Button>
    </FormItem>
  </Form>
</template>

<script>
import { deepClone } from '@/libs/tool'
export default {
  name: 'FormGroup',
  data () {
    return {
      initValueList: [], // 传入的原始值，初始化的时候使用
      rules: {}, // 各个标签的规则
      valueList: {}, // 各个标签的值
      errorStore: {} // 为每个标签创建错误映射
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: Number,
      default: 100
    },
    url: {
      type: String,
      required: true
    }
  },
  watch: {
    list () {
      this.setInitValue()
    }
  },
  methods: {
    setInitValue () {
      const rules = {}
      const valueList = {}
      const initValueList = {}
      const errorStore = {}
      this.list.forEach(item => {
        rules[item.name] = item.rule
        valueList[item.name] = item.value
        initValueList[item.name] = item.value
        errorStore[item.name] = ''
      })
      this.rules = rules
      this.valueList = valueList
      this.initValueList = initValueList
      this.errorStore = errorStore
      console.log(initValueList)
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          // sentFormData({
          //   url: this.url,
          //   data: this.valueList
          // })
          //   .then(res => {
          //     this.$emit('on-submit-success', res)
          //   })
          //   .catch(err => {
          //     this.$emit('on-submit-error', err)
          //     for (const key in err) {
          //       this.errorStore[key] = err[key]
          //     }
          //   })
        }
      })
    },
    handleReset () {
      this.valueList = deepClone(this.initValueList)
    },
    handleFocus (name) {
      this.errorStore[name] = ''
    }
  },
  mounted () {
    this.setInitValue()
  }
}
</script>

<style>
</style>
