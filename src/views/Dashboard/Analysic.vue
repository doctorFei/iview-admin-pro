<template>
  <div>
    <Card style="width: 940px;height: 500px">
      <p slot="title">simple bar</p>
      <Bar :width="900" :height="400" />
    </Card>
  </div>
</template>

<script>
import Bar from '@/components/chart/Bar2'

export default {
  name: 'Analysic',
  mounted () {},
  components: {
    Bar
  }
}
</script>

<style scoped>
</style>
