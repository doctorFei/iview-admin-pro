<template>
  <div class="page-flow h100">
    <Menu/>

    <D3Tree
      :enableCircleLink="false"
      :defaultWidth="width"
      :defaultHeight="height"
      :defaultNodes="nodes"
      :defaultLinks="links"
      :iconData="iconData"
      :transform="transform"
      :IOCircleOffset="18"
      ref="graph"
      @svgDrop="svgDrop"
      @nodeContextMenu="nodeContextMenu"
      @fullScreen="fullscreen"
      @linkContextMenu="linkContextMenu"
      @nodeSelectChange="nodeSelectChange"
      @linkSelectChange="linkSelectChange"
      @resetNodeMenu="resetNodeMenu"
      @resetLinkMenu="resetLinkMenu"
      @action="handleActions"
    >
      <div>
        <ul
          v-show="nodeMenuData.show"
          class="graph-node-menu"
          :style="`top: ${nodeMenuData.top}px;left: ${nodeMenuData.left}px`"
        >
          <li @click="nodeEdit">编辑</li>
          <li @click="nodeDelete">删除</li>
        </ul>
        <ul
          v-show="linkMenuData.show"
          class="graph-node-menu"
          :style="`top: ${linkMenuData.top}px;left: ${linkMenuData.left}px`"
        >
          <li @click="linkEdit">编辑备注</li>
          <li @click="linkDelete">删除</li>
        </ul>
      </div>
    </D3Tree>

    <PropertyPanel/>

  </div>
</template>

<script>
  import D3Tree from './components/DirectedGraphEditor'
  import Menu from './components/Menu'
  import PropertyPanel from './components/PropertyPanel'

  import iconData from './utils/svg-icon'

  import { getOffset } from '@/libs/utils'

  const nodeData = {
    nodes: [
      {
        id: 'helloWorld',
        x: 300,
        y: 100,
        text: 'Hello World,Hello World',
        leftIcon: 'iconDatabase',
        rightIcon: 'iconLoading'
      },
      {
        id: 'helloJune',
        x: 200,
        y: 200,
        text: '两只小花狗它们爱吃肉骨头'
      },
      {
        id: 'helloKitty',
        x: 100,
        y: 300,
        text: '两只小花狗Hello Kitty'
      }
    ],
    links: [
      {
        source: 'helloWorld',
        target: 'helloJune',
        text: '这是一条备注哦哦哦哦哦哦哦'
      },
      {
        source: 'helloJune',
        target: 'helloKitty',
        text: 'July'
      }
    ]
  }

  export default {
    name: 'App',
    components: {
      D3Tree,
      Menu,
      PropertyPanel
    },
    data () {
      return {
        // 节点数据
        nodes: nodeData.nodes,

        // 连接数据
        links: nodeData.links,

        iconData: iconData,

        width: 900,

        height: 600,

        transform: {
          x: 0,
          y: 0,
          k: 1
        }
      }
    },
    mounted () {

      // setTimeout(() => {
      //   this.transform = {
      //     x: 100,
      //     y: 100,
      //     k: 0.5
      //   };
      // }, 200);
      // console.log(this.$refs.graph.getGraphData());

    },
    methods: {

      handleActions (e) {
        console.log(e)
      },

      fullscreen () {
        console.log('fullScreen')
      },

      svgDrop (e) {
        const { offsetX, offsetY } = getOffset(e)

        if (this.nodeDrag) {
          this.$refs.graph.addNode(offsetX, offsetY, this.nodeDrag)
        }
      },
      nodeContextMenu (data) {
        const { node, e } = data

        const { offsetX, offsetY } = getOffset(e, this.$refs.graph.getSvgEle())

        this.$store.commit('setNodeMenuData', {
          show: true,
          left: offsetX + 6,
          top: offsetY,
          node
        })
      },

      resetNodeMenu () {
        this.$store.commit('setNodeMenuData', {
          show: false,
          left: 0,
          top: 0,
          node: null
        })
      },

      resetLinkMenu () {
        this.$store.commit('setLinkMenuData', {
          show: false,
          left: 0,
          top: 0,
          link: null
        })
      },

      nodeEdit () {
        const { id } = this.nodeMenuData.node

        this.$refs.graph.setNodeData(id, (node) => ({
          ...node,
          text: 'hello'
        }))

        this.resetNodeMenu()
      },

      nodeDelete () {
        const { id } = this.nodeMenuData.node

        this.$refs.graph.removeNode(id)

        this.resetNodeMenu()
      },

      linkEdit () {
        const { source, target } = this.linkMenuData.link

        this.$refs.graph.setLinkData(source, target, (link) => ({
          ...link,
          text: 'june'
        }))

        this.resetLinkMenu()
      },

      linkDelete () {
        const { source, target } = this.linkMenuData.link

        this.$refs.graph.removeLink(source, target)

        this.resetLinkMenu()
      },

      linkContextMenu (data) {
        const { link, e } = data

        const { offsetX, offsetY } = getOffset(e, this.$refs.graph.getSvgEle())

        this.$store.commit('setLinkMenuData', {
          show: true,
          left: offsetX + 6,
          top: offsetY,
          link
        })
      },
      nodeSelectChange (node) {
        this.$store.commit('setNodeSelected', node)
      },
      linkSelectChange (linkdata) {
        this.$store.commit('setLinkSelected', linkdata)
      }
    },
    computed: {
      nodeSelected () {
        return this.$store.state.flow.nodeSelected
      },
      nodeDrag () {
        return this.$store.state.flow.nodeDrag
      },
      linkMenuData () {
        return this.$store.state.flow.linkMenuData
      },
      nodeMenuData () {
        return this.$store.state.flow.nodeMenuData
      }
    }
  }
</script>

<style lang="less">
  .page-flow {
    display: flex;
    .svg-iconLoading {

      transform-origin: 12px 12px;

      animation: 2.5s anim-loading linear;

      animation-iteration-count: infinite;
    }

    @keyframes anim-loading {
      from {
        transform: translate(57px, -12px) rotate(0);
      }
      to {
        transform: translate(57px, -12px) rotate(360deg);
      }
    }

    .graph-node-menu {
      position: absolute;

      width: 100px;

      color: #333;
      background: rgba(255, 255, 255, 0.8);
      font-size: 13px;
      list-style: none;

      border-radius: 3px;
      box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.1);
      cursor: pointer;

      li {
        padding: 6px 16px;
        user-select: none;

        &:hover {
          background: rgba(133, 215, 143, 0.4);
        }
      }
    }
    .graph-container {
      flex: 1;
    }
  }

</style>
