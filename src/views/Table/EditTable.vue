<template>
  <div class="page-edit-table">
    <i-edit-table :columns="columns" v-model="tableData" @on-edit="editHandle"/>
  </div>
</template>

<script>
  import IEditTable from '@/components/EditTable'

  export default {
    name: 'editTable',
    components: { IEditTable },
    data () {
      return {
        columns: [
          {
            title: 'Name',
            key: 'name',
            editable: true
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
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park',
            date: '2016-10-03'
          },
          {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park',
            date: '2016-10-01'
          },
          {
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park',
            date: '2016-10-02'
          }
        ]
      }
    },
    methods: {
      editHandle (v) {
        console.log(v)
      }
    }
  }
</script>

<style scoped>

</style>
