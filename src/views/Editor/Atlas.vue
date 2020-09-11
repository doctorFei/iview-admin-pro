<template>
  <div class="page-atlas">
    <div class="svg-content">
      <Input v-if="nodes&&nodes.length>0" class="search" @on-enter="search" v-model="inputValue" placeholder="请输入查询" style="width: 300px"/>
      <net-work
        :nodeList="nodes"
        :linkList="links"
        :svgSize="svgSize"
        @clickNode="clickNode"
      />
    </div>
  </div>
</template>

<script>
  import { getaltasData } from '@/api/editor'
  import NetWork from '@/components/NetWork'

  export default {
    name: 'Atlas',
    async mounted () {
      await this.search()
      this.$nextTick(() => {
        this.svgSize = {
          width: document.querySelector('.svg-content').clientWidth,
          height: document.querySelector('.svg-content').clientHeight
        }
        window.onresize = () => {
          this.svgSize = {
            width: document.querySelector('.svg-content').clientWidth,
            height: document.querySelector('.svg-content').clientHeight
          }
        }
      })
    },
    components: {
      NetWork
    },
    data () {
      return {
        nodes: [],
        links: [],
        svgSize: {
          width: 0,
          height: 0
        },
        inputValue: '刘德华'
      }
    },
    methods: {
      async clickNode (e) {
        const text = e.target.__data__.id
        const { data: { links: links, nodes: nodes } } = await getaltasData(text)
        this.links = links
        this.nodes = nodes
      },
      async search () {
        const { data: { links: links, nodes: nodes } }  = await getaltasData(this.inputValue)
        if (links && links.length > 0 && nodes && nodes.length > 0) {
          this.links = links
          this.nodes = nodes
        } else {
          this.$Message.info('暂无查找结果')
        }
      }
    }
  }
</script>

<style lang="less">
  .page-atlas {
    position: relative;
    height: 100%;
  }

  .search {
    position: absolute;
    left: 50px;
    top: 50px;
  }

  .svg-content {
    height: 100%;
    width: 100%;

  }
</style>
