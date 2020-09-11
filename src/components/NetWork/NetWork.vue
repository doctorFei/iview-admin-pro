<template>
  <div id="network" :style="{width: svgSize.width +'px', height: svgSize.height+'px'}">
    <div
      class="linkText"
      :style="linkTextPosition"
      v-show="linkTextVisible"
    >
      <li>操作</li>
    </div>

    <svg
      class="network-svg"
      xmlns="http://www.w3.org/2000/svg"
      :width="svgSize.width"
      :height="svgSize.height"
      :style="{'background-color': theme.bgcolor}"
      @click="clickEle"
      @contextmenu="contextHandler"
      @mouseover.prevent="svgMouseover"
      @mouseout="svgMouseout"
    >
      <g id="container">
        <!-- links and link-text 注：先绘制边 -->
        <g>
          <g v-for="(link,index) in links" :key="index" :class="['line-wrap',`${link.selected}`]">
            <line
              :class="`${link[linkTypeKey]} ${link.selected} link element`"
              :stroke="theme.linkStroke"
              :stroke-width="linkWidth"
            ></line>
            <!-- dx dy 文字左下角坐标 -->
            <text
              v-show="showLinkText"
              dx="0"
              dy="0"
              class="link-text"
              :fill="theme.textFill"
              :font-size="linkTextFrontSize"
            >{{link[linkTextKey]}}
            </text>
          </g>
        </g>

        <!-- node and node-text -->
        <g id="node-group">
          <g v-for="(node,index) in nodes" :key="index" :class="['node-wrap',`${node.showText?'selected' : ''}`]">
            <circle
              :fill="nodeColor(node.group)"
              :stroke-width="highlightNodes.indexOf(node.id) === -1? 3:10"
              :stroke="theme.nodeStroke"
              :class="`${node[nodeTypeKey]} ${node.showText?'selected' : ''} node element`"
              :r="node.group === -1?centerNodeSize:nodeSize"
            ></circle>
            <text
              :dx="nodeSize + 5"
              dy="0"
              class="node-text"
              :fill="theme.textFill"
              :font-size="nodeTextFontSize"
            >{{node[nodeTextKey]}}
            </text>
          </g>
          <g></g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
  import * as d3 from 'd3'
  import d3SelectionMulti from 'd3-selection-multi' // https://github.com/d3/d3-selection-multi

  export default {
    name: 'network',
    props: {
      nodeList: Array,
      linkList: Array,
      // node
      nodeSize: {
        type: Number,
        default: 20
      },
      centerNodeSize: {
        type: Number,
        default: 60
      },
      nodeTextKey: {
        type: String,
        default: 'id'
      },
      nodeTypeKey: {
        type: String,
        default: 'group'
      },
      nodeTextFontSize: {
        type: Number,
        default: 14
      },
      // link
      linkWidth: {
        type: Number,
        default: 2
      },
      showLinkText: {
        type: Boolean,
        default: true
      },
      linkTextKey: {
        type: String,
        default: 'value'
      },
      linkTypeKey: {
        type: String,
        default: 'type'
      },
      linkTextFrontSize: {
        type: Number,
        default: 10
      },
      linkDistance: {
        type: Number,
        default: 100
      },
      // svg
      svgSize: {
        type: Object,
        default: () => {
          return {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      },
      // 引力
      bodyStrength: {
        type: Number,
        default: -2000
      },
      viewBoxScale: {
        type: Number,
        default: 2
      },
      // others
      highlightNodes: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        selection: {
          links: [],
          nodes: []
        },
        force: null,
        zoom: d3.zoom(),
        nodeColor: d3.scaleOrdinal(d3.schemeCategory10),
        linkTextVisible: false,
        linkTextPosition: {
          top: 0,
          left: 0
        },
        theme: {
          bgcolor: '#081c27',
          nodeStroke: 'white',
          linkStroke: 'lightgray',
          textFill: '#fff'
        }
      }
    },
    computed: {
      nodes () {
        // 去重
        let nodes = this.nodeList.slice()
        const nodeIds = []
        nodes = nodes.filter(node => {
          if (nodeIds.indexOf(node.id) === -1) {
            nodeIds.push(node.id)
            return true
          } else {
            return false
          }
        })
        return nodes
      },
      links () {
        return this.linkList
      }
    },
    watch: {
      bodyStrength: function () {
        this.initData()
        this.$nextTick(function () {
          this.initDragTickZoom()
        })
      },
      linkDistance: function () {
        this.initData()
        this.$nextTick(function () {
          this.initDragTickZoom()
        })
      },
      svgSize: function () {
        this.initData()
        this.$nextTick(function () {
          this.initDragTickZoom()
        })
      },
      nodes: function () {
        this.initData()
        this.$nextTick(function () {
          // 以下这个函数重新在 node 上调用了拖拽
          // 只有在 mounted 后才有用
          // 所以要使用 $nextTick
          this.initDragTickZoom()
        })
      }
    },
    created () {
      this.initData()
    },
    mounted () {
      this.initDragTickZoom()
      document.onclick = () => {
        this.linkTextVisible = false
      }
    },
    methods: {
      initData () {
        this.force = d3
          .forceSimulation(this.nodes)
          .force(
            'link',
            d3
              .forceLink(this.links)
              .id(d => d.id)
              .distance(this.linkDistance)
          )
          .force('charge', d3.forceManyBody().strength(this.bodyStrength)) // The strength of the attraction or repulsion
          .force(
            'center',
            d3.forceCenter(this.svgSize.width, this.svgSize.height)
          )
      },
      initDragTickZoom () {
        this.force.on('tick', () => {
          // 更新连线坐标
          d3.selectAll('#network .link')
            .data(this.links)
            .attrs({
              x1: d => d.source.x,
              y1: d => d.source.y,
              x2: d => d.target.x,
              y2: d => d.target.y
            })
          // 更新节点坐标
          d3.selectAll('#network .node')
            .data(this.nodes)
            .attrs({
              cx: d => d.x,
              cy: d => d.y
            })
          // 更新文字坐标
          d3.selectAll('#network .node-text')
            .data(this.nodes)
            .attrs({
              x: d => d.x,
              y: d => d.y
            })
          d3.selectAll('#network .link-text')
            .data(this.links)
            .attrs({
              x: d => (d.source.x + d.target.x) / 2,
              y: d => (d.source.y + d.target.y) / 2
            })
        })

        d3.selectAll('#network .node').call(this.drag(this.force))

        d3.select('#network .network-svg')
          .attr('viewBox', [0, 0, this.svgSize.width * this.viewBoxScale, this.svgSize.height * this.viewBoxScale])// 缩放及保持中心
          .call(this.zoom.scaleExtent([0.1, 4]).on('zoom', this.zoomed))
          .on('dblclick.zoom', null)
      },
      clickLink (e) {
        this.$emit('clickLink', e, e.target.__data__)
      },
      clickNode (e) {
        // 所有节点透明度恢复
        this.setNodeOpacity(['.node-wrap', '.line-wrap'], 1)
        this.$emit('clickNode', e, e.target.__data__)
      },
      clickEle (e) {
        if (e.target.tagName === 'circle') {
          this.clickNode(e)
        } else if (e.target.tagName === 'line') {
          this.clickLink(e)
        }
      },
      contextHandler (e) {
        e.preventDefault()
        if (e.target.tagName === 'circle') {
          this.linkTextPosition = {
            left: e.offsetX + 'px',
            top: e.offsetY + 'px'
          }
          this.linkTextVisible = true
        } else {
          this.linkTextVisible = false
        }
      },
      svgMouseover (e) {
        if (e.target.nodeName === 'circle') {
          this.selectedState(e)
          // 强制刷新
          this.$forceUpdate()
          this.$emit('hoverNode', e, e.target.__data__)
        }
      },
      svgMouseout (e) {
        if (e.target.nodeName === 'circle') {
          this.noSelectedState(e)
          // 强制刷新
          this.$forceUpdate()
        }
      },
      selectedState (e) {
        // 节点自身显示文字、增加 selected class、添加进 selection
        e.target.__data__.showText = true
        e.target.classList.add('selected')

        this.selection.nodes.push(e.target.__data__)
        // 周围节点显示、边和结点增加 selected class、添加进 selection
        this.lightNeibor(e.target.__data__)
        // 除了 selected 的其余节点透明度减小
        this.setNodeOpacity(['.node-wrap', '.line-wrap'], 0.2)
      },
      noSelectedState (e) {
        // 节点自身不显示文字、移除 selected class
        e.target.__data__.showText = false
        // e.target.classList.remove("selected");
        // 周围节点不显示文字、边和结点移除 selected class
        this.darkenNerbor()
        // 所有节点透明度恢复
        this.setNodeOpacity(['#network .node-wrap', '#network .line-wrap'], 1)
      },
      setNodeOpacity (classList, num) {
        classList.forEach(item => {
          d3.selectAll(item).styles({
            opacity: num
          })
        })
      },
      lightNeibor (node) {
        this.links.forEach(link => {
          if (link.source.index === node.index) {
            link.selected = 'selected'
            this.selection.links.push(link)
            this.selection.nodes.push(link.target)
            this.lightNode(link.target)
          }
          if (link.target.index === node.index) {
            link.selected = 'selected'
            this.selection.links.push(link)
            this.selection.nodes.push(link.source)
            this.lightNode(link.source)
          }
        })
      },
      lightNode (selectedNode) {
        this.nodes.forEach(node => {
          if (node.index === selectedNode.index) {
            node.showText = true
          }
        })
      },
      darkenNerbor () {
        this.links.forEach(link => {
          this.selection.links.forEach(selectedLink => {
            if (selectedLink.id === link.id) {
              link.selected = ''
            }
          })
        })
        this.nodes.forEach(node => {
          this.selection.nodes.forEach(selectednode => {
            if (selectednode.id === node.id) {
              node.showText = false
            }
          })
        })
        // 清空 selection
        this.selection.nodes = []
        this.selection.links = []
      },
      zoomed () {
        // 缩放中：以鼠标所在的位置为中心
        d3.select('#network #container').attr(
          'transform',
          'translate(' +
          d3.event.transform.x +
          ',' +
          d3.event.transform.y +
          ') scale(' +
          d3.event.transform.k +
          ')'
        )
      },
      drag (simulation) {
        function dragstarted (d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        }

        function dragged (d) {
          d.fx = d3.event.x
          d.fy = d3.event.y
        }

        function dragended (d) {
          if (!d3.event.active) simulation.alphaTarget(0)
        }

        return d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      }
    }
  }
</script>

<style scoped lang="less">
  #network {
    background: #081c27;

    svg {
      border-radius: 5px;
    }

    .element {
      transition: opacity 0.5s ease;
    }

    .selected {
      opacity: 1 !important;
    }

    .node,
    .link {
      cursor: pointer;
    }

    .linkText {
      position: absolute;
      z-index: 10;
      background-color: rgba(75, 75, 75, 0.596);
      top: 0;
      left: 0;
      padding: 10px;
      border-radius: 4px;
      background: white;
      cursor: pointer;
    }
  }
</style>
