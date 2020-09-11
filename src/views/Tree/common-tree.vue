<template>
  <div class="page-common-tree">
    <Tabs value="name1">
      <TabPane label="根目录请求显示" name="name1">
        <ApiRootTree />
      </TabPane>
      <TabPane label="根目录定制显示" name="name2">
        <SetRootTree />
      </TabPane>
    </Tabs>
    <Divider />
    <commonTree style="width:70%" />
  </div>
</template>

<script>
import ApiRootTree from './api-root-tree'
import SetRootTree from './set-root-tree'
import commonTree from '@/markdown/common-tree.md'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/dark.css'
const highlightCode = () => {
  const preEl = document.querySelectorAll('pre')

  preEl.forEach((el) => {
    hljs.highlightBlock(el)
  })
}
export default {
  name: 'common-tree',
  async mounted () {
    highlightCode()
  },
  updated () {
    highlightCode()
  },
  components: {
    ApiRootTree,
    SetRootTree,
    commonTree
  }
}
</script>

<style scoped>
</style>
