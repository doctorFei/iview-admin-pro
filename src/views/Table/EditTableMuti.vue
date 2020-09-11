<template>
  <div>
    <muti-edit-table :columns="columns" v-model="tableData"/>
  </div>
</template>

<script>
  import MutiEditTable from '@/components/EditTableMuti'

  export default {
    name: 'EditTableMuti',
    components: {
      MutiEditTable
    },
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
            key: 'age',
            editable: true
          },
          {
            title: 'Address',
            key: 'address',
            editable: true
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
    }
  }
</script>

<style scoped>

</style>
