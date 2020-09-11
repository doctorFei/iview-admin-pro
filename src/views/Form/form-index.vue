<template>
  <div>
    <Alert class="alert">
      <p>在表单项上的trigger触发验证实际上调用的是组件内部的</p>
      <p>this.$on("on-form-blur", this.onFieldBlur)</p>
      <p>this.$on("on-form-change", this.onFieldChange)</p>
      <p>这些订阅者的发布者实在组件库表单里由开发者自己定义的this.dispatch('FormItem', 'on-form-blur', this.currentValue)</p>
      <p> this.$refs.imageUrlItem.onFieldChange();</p>
    </Alert>

    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <FormItem label="citySearch" prop="citySearch">
        <Select
          v-model="formValidate.citySearch"
          filterable
          clearable
          placeholder="Select your city"
        >
          <Option value="beijing">New York</Option>
          <Option value="shanghai">London</Option>
          <Option value="shenzhen">Sydney</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
      </FormItem>
    </Form>
    <Alert>select封装</Alert>
    <selected-search
      v-model="selectData"
      :options="cityList"
      :optionLableKey="'label'"
      :optionValKey="'value'"
    ></selected-search>
    {{selectData}}
  </div>
</template>
<script>
import SelectedSearch from '_c/SelectedSearch'
import Emitter from '@/libs/emiter'
export default {
  mixins: [Emitter],
  components: {
    SelectedSearch
  },
  data () {
    return {
      formValidate: {
        citySearch: 'beijing'
      },
      selectData: '1',
      cityList: [
        {
          value: '1',
          label: 'New York'
        },
        {
          value: '2',
          label: 'London'
        },
        {
          value: '3',
          label: 'Sydney'
        },
        {
          value: '4',
          label: 'Ottawa'
        },
        {
          value: '5',
          label: 'Paris'
        },
        {
          value: '6',
          label: 'Canberra'
        }
      ],
      ruleValidate: {
        citySearch: [
          {
            required: true,
            message: 'Please select the city',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      // this.broadcast(
      //   'FormItem',
      //   'on-form-change',
      //   this.formValidate.pathse
      // );
    }
  }
}
</script>
<style lang="less" scoped>
.alert {
  p {
    line-height: 30px;
  }
}
</style>
