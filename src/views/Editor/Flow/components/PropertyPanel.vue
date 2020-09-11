<template>
  <div class="property-panel">
    <div class="title">属性面板</div>
    <ul class="property-list" v-if="nodeSelected">
      <li>id: {{nodeSelected.id}}</li>
      <li>x: {{nodeSelected.x}}</li>
      <li>y: {{nodeSelected.y}}</li>
      <li>text: {{nodeSelected.text}}</li>
    </ul>
  </div>
</template>

<script>

  export default {
    name: 'PropertyPanel',
    computed: {
      nodeSelected () {
        return this.$store.state.flow.nodeSelected
      },
      nodeDrag () {
        return this.$store.state.flow.nodeDrag
      }
    }
  }
</script>

<style scoped lang="less">
  .property-panel {
    width: 200px;
    .title {
      background: #fff;
      padding: 15px;
      margin-bottom: 20px;
    }

    .property-list {
      li {
        padding: 6px 15px;
        line-height: 32px;
        background: #fff;
        border-bottom: 1px solid #eee;
      }
    }
  }
</style>
