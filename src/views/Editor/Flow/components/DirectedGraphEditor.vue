<template>
  <div
    class="graph-container h100"
    :class="{'full-screen': fullScreen}"
  >
    <div class="operation-panel">
      <div class="relative">
        <svg
          class="icon icon-enlarge"
          viewBox="0 0 1024 1024"
          @click="svgZoom(true)"
        >
          <path d="M696.32 732.16C634.88 788.48 552.96 819.2 460.8 819.2c-199.68 0-358.4-158.72-358.4-358.4s158.72-358.4 358.4-358.4 358.4 158.72 358.4 358.4c0 92.16-30.72 174.08-87.04 235.52l5.12 5.12 204.8 204.8c10.24 10.24 10.24 25.6 0 35.84-10.24 10.24-25.6 10.24-35.84 0l-209.92-209.92zM460.8 768c168.96 0 307.2-138.24 307.2-307.2s-138.24-307.2-307.2-307.2-307.2 138.24-307.2 307.2 138.24 307.2 307.2 307.2z m-25.6-332.8V307.2c0-15.36 10.24-25.6 25.6-25.6s25.6 10.24 25.6 25.6v128H614.4c15.36 0 25.6 10.24 25.6 25.6s-10.24 25.6-25.6 25.6H486.4V614.4c0 15.36-10.24 25.6-25.6 25.6s-25.6-10.24-25.6-25.6V486.4H307.2c-15.36 0-25.6-10.24-25.6-25.6s10.24-25.6 25.6-25.6h128z" p-id="2853"></path>
        </svg>
        <p class="tips">
          放大
        </p>
      </div>
      <div class="relative">
        <svg
          class="icon icon-shrink"
          viewBox="0 0 1024 1024"
          @click="svgZoom(false)"
        >
          <path d="M696.32 732.16C634.88 788.48 552.96 819.2 460.8 819.2c-199.68 0-358.4-158.72-358.4-358.4s158.72-358.4 358.4-358.4 358.4 158.72 358.4 358.4c0 92.16-30.72 174.08-87.04 235.52l5.12 5.12 204.8 204.8c10.24 10.24 10.24 25.6 0 35.84-10.24 10.24-25.6 10.24-35.84 0l-209.92-209.92zM460.8 768c168.96 0 307.2-138.24 307.2-307.2s-138.24-307.2-307.2-307.2-307.2 138.24-307.2 307.2 138.24 307.2 307.2 307.2zM307.2 435.2h307.2c15.36 0 25.6 10.24 25.6 25.6s-10.24 25.6-25.6 25.6H307.2c-15.36 0-25.6-10.24-25.6-25.6s10.24-25.6 25.6-25.6z" p-id="2853"></path>
        </svg>

        <p class="tips">
          缩小
        </p>
      </div>
      <div class="relative">
        <svg
          class="icon icon-reset"
          viewBox="0 0 1024 1024"
          @click="svgZoom(true, 1)"
        >
          <path d="M256 102.4h512c87.04 0 153.6 66.56 153.6 153.6v512c0 87.04-66.56 153.6-153.6 153.6H256c-87.04 0-153.6-66.56-153.6-153.6V256c0-87.04 66.56-153.6 153.6-153.6z m0 51.2c-56.32 0-102.4 46.08-102.4 102.4v512c0 56.32 46.08 102.4 102.4 102.4h512c56.32 0 102.4-46.08 102.4-102.4V256c0-56.32-46.08-102.4-102.4-102.4H256z m25.6 307.2h204.8c40.96 0 76.8 35.84 76.8 76.8v204.8c0 40.96-35.84 76.8-76.8 76.8h-204.8c-40.96 0-76.8-35.84-76.8-76.8v-204.8C204.8 496.64 240.64 460.8 281.6 460.8z m0 51.2c-15.36 0-25.6 10.24-25.6 25.6v204.8c0 15.36 10.24 25.6 25.6 25.6h204.8c15.36 0 25.6-10.24 25.6-25.6v-204.8c0-15.36-10.24-25.6-25.6-25.6h-204.8z" p-id="2853"></path>
        </svg>
        <p class="tips">
          实际尺寸
        </p>
      </div>
      <div class="relative">
        <svg
          class="icon icon-adjust-screen"
          viewBox="0 0 1024 1024"
          @click="adjustScreen"
        >
          <path d="M353.28 721.92c0-30.72-20.48-51.2-51.2-51.2H128c-15.36 0-25.6-10.24-25.6-25.6 0-20.48 10.24-30.72 25.6-30.72H307.2c56.32 0 102.4 46.08 102.4 102.4v179.2c0 15.36-10.24 25.6-25.6 25.6s-25.6-10.24-25.6-25.6v-174.08z m317.44 0v174.08c0 15.36-10.24 25.6-25.6 25.6s-25.6-10.24-25.6-25.6V716.8c0-56.32 46.08-102.4 102.4-102.4h179.2c15.36 0 25.6 10.24 25.6 25.6s-10.24 25.6-25.6 25.6h-174.08c-35.84 5.12-56.32 25.6-56.32 56.32zM353.28 302.08V128c0-15.36 15.36-25.6 30.72-25.6s25.6 10.24 25.6 25.6V307.2c0 56.32-46.08 102.4-102.4 102.4H128c-15.36 0-25.6-10.24-25.6-25.6s10.24-25.6 25.6-25.6h174.08c30.72-5.12 51.2-25.6 51.2-56.32z m317.44 0c0 30.72 20.48 51.2 51.2 51.2h174.08c15.36 0 25.6 10.24 25.6 25.6s-10.24 30.72-25.6 30.72H716.8c-56.32 0-102.4-46.08-102.4-102.4V128c0-15.36 10.24-25.6 25.6-25.6s25.6 10.24 25.6 25.6v174.08z" p-id="2853"></path>
        </svg>
        <p class="tips">
          适应屏幕
        </p>
      </div>
      <div class="relative" v-show="!fullScreen">
        <svg
          class="icon icon-full-screen"
          viewBox="0 0 1024 1024"
          @click="setFullScreen(true)"
        ><path d="M834.56 153.6h-194.56c-15.36 0-25.6-10.24-25.6-25.6s10.24-25.6 25.6-25.6H819.2c56.32 0 102.4 46.08 102.4 102.4v179.2c0 15.36-10.24 25.6-25.6 25.6s-25.6-10.24-25.6-25.6V204.8v-15.36l-235.52 235.52c-10.24 10.24-25.6 10.24-35.84 0-10.24-10.24-10.24-25.6 0-35.84L834.56 153.6z m-5.12 711.68l-230.4-230.4c-10.24-10.24-10.24-25.6 0-35.84 10.24-10.24 25.6-10.24 35.84 0l230.4 230.4V640c0-15.36 10.24-25.6 25.6-25.6s25.6 10.24 25.6 25.6V819.2c0 56.32-46.08 102.4-102.4 102.4h-179.2c-15.36 0-25.6-10.24-25.6-25.6s10.24-25.6 25.6-25.6h174.08c10.24-5.12 15.36-5.12 20.48-5.12zM194.56 158.72l230.4 230.4c10.24 10.24 10.24 25.6 0 35.84-10.24 10.24-25.6 10.24-35.84 0L158.72 194.56V384c0 15.36-15.36 25.6-30.72 25.6S102.4 399.36 102.4 384V204.8c0-56.32 46.08-102.4 102.4-102.4h179.2c15.36 0 25.6 10.24 25.6 25.6s-10.24 30.72-25.6 30.72H194.56z m0 706.56H384c15.36 0 25.6 10.24 25.6 25.6 0 20.48-10.24 30.72-25.6 30.72H204.8c-56.32 0-102.4-46.08-102.4-102.4v-179.2c0-15.36 10.24-25.6 25.6-25.6s25.6 10.24 25.6 25.6V829.44l230.4-230.4c10.24-10.24 25.6-10.24 35.84 0 10.24 10.24 10.24 25.6 0 35.84l-225.28 230.4z" p-id="2964"></path>
        </svg>
        <p class="tips">
          全屏
        </p>
      </div>
      <div class="relative" v-show="fullScreen">
        <svg
          class="icon icon-full-screen"
          viewBox="0 0 1024 1024"
          @click="setFullScreen(false)"
        ><path d="M834.56 153.6h-194.56c-15.36 0-25.6-10.24-25.6-25.6s10.24-25.6 25.6-25.6H819.2c56.32 0 102.4 46.08 102.4 102.4v179.2c0 15.36-10.24 25.6-25.6 25.6s-25.6-10.24-25.6-25.6V204.8v-15.36l-235.52 235.52c-10.24 10.24-25.6 10.24-35.84 0-10.24-10.24-10.24-25.6 0-35.84L834.56 153.6z m-5.12 711.68l-230.4-230.4c-10.24-10.24-10.24-25.6 0-35.84 10.24-10.24 25.6-10.24 35.84 0l230.4 230.4V640c0-15.36 10.24-25.6 25.6-25.6s25.6 10.24 25.6 25.6V819.2c0 56.32-46.08 102.4-102.4 102.4h-179.2c-15.36 0-25.6-10.24-25.6-25.6s10.24-25.6 25.6-25.6h174.08c10.24-5.12 15.36-5.12 20.48-5.12zM194.56 158.72l230.4 230.4c10.24 10.24 10.24 25.6 0 35.84-10.24 10.24-25.6 10.24-35.84 0L158.72 194.56V384c0 15.36-15.36 25.6-30.72 25.6S102.4 399.36 102.4 384V204.8c0-56.32 46.08-102.4 102.4-102.4h179.2c15.36 0 25.6 10.24 25.6 25.6s-10.24 30.72-25.6 30.72H194.56z m0 706.56H384c15.36 0 25.6 10.24 25.6 25.6 0 20.48-10.24 30.72-25.6 30.72H204.8c-56.32 0-102.4-46.08-102.4-102.4v-179.2c0-15.36 10.24-25.6 25.6-25.6s25.6 10.24 25.6 25.6V829.44l230.4-230.4c10.24-10.24 25.6-10.24 35.84 0 10.24 10.24 10.24 25.6 0 35.84l-225.28 230.4z" p-id="2964"></path>
        </svg>
        <p class="tips">
          退出全屏
        </p>
      </div>
    </div>

    <svg
      class="direct-graph-svg J_graph_svg"
      :class="{'active': svgActive}"
      @contextmenu="svgContextMenu"
      @mousedown="svgMouseDown"
      @mouseup="svgMouseUp"
      @mousemove="svgMouseMove"
      @drop="svgDrop"
      @dragover="allowDrop"
      @mouseleave="svgMouseLeave"

      ref="graphSvg"
      >
      <defs>
        <linearGradient id="linear-rect-bg">
          <stop offset="0%" style="stop-color:#99fffc;"></stop>
          <stop offset="100%" style="stop-color:#adffe5;"></stop>
        </linearGradient>
        <linearGradient id="linear-link-stroke">
          <stop offset="0%" style="stop-color:#0C8CFA;"></stop>
          <stop offset="50%" style="stop-color:#81C3FC;"></stop>
          <stop offset="100%" style="stop-color:#0C8CFA;"></stop>
        </linearGradient>
        <marker
          id="end-arrow"
          viewBox="0 -5 10 10"
          refX="6"
          markerWidth="9"
          markerHeight="9"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M3,-5L10,0L3,5" fill="#0C8CFA" />
        </marker>
        <!--<marker-->
          <!--id="start-arrow"-->
          <!--viewBox="0 -5 10 10"-->
          <!--refX="4"-->
          <!--markerWidth="6"-->
          <!--markerHeight="6"-->
          <!--orient="auto"-->
          <!--markerUnits="userSpaceOnUse"-->
        <!--&gt;-->
          <!--<path d="M7,-5L0,0L7,5" fill="#777" />-->
        <!--</marker>-->

        <filter x="-0.1" y="-0.1" width="1.2" height="1.2" id="link-text-bg">
          <feFlood flood-color="#fff"/>
          <feComposite in="SourceGraphic"/>
        </filter>
      </defs>
      <g
        class="graph J_graph"
        transform="translate(0,0) scale(1)"
      >
        <path
          v-show="showDragLine"
          class="link dragline"
          style="marker-end: url(#end-arrow)"
          :d="dragLinePath"
        />
        <g v-for="(link, index) in links">
          <path
            :key="`link-bg-${index}`"
            class="link-bg"
            :d="pathLink(link)"
            @click="pathLinkClick(index)"
            @contextmenu="pathLinkContextMenu(link, index, $event)"
          />
          <path
            :key="index"
            class="link"
            :class="{'selected': index == activeLinkIndex}"
            style="marker-start: none;marker-end: url(#end-arrow);"
            :d="pathLink(link)"
            @click="pathLinkClick(index)"
            @contextmenu="pathLinkContextMenu(link, index, $event)"
          />
          <circle
            v-show="!!link.text"
            r="4"
            class="link-desc-circle"
            fill="#0c8cfa"
            :cx="linkTextPos(link).x"
            :cy="linkTextPos(link).y"
            stroke="#D2EAFF"
            stroke-width="2"
            @contextmenu="pathLinkContextMenu(link, index, $event)"
          >
          </circle>
          <text
            v-show="!!link.text"
            class="link-text"
            :x="linkTextPos(link).x + 30"
            :y="linkTextPos(link).y"
            filter="url(#link-text-bg)"
          >
            {{link.text ? ellipse(link.text, 40) : ''}}
          </text>
        </g>
        <g>
          <g
            v-for="(node, index) in nodes"
            :key="index"
            :transform="`translate(${node.x},${node.y})`"
            class="J_g_node"
            :data-key="index"
          >
            <g>
              <rect
                class="node-rect"
                :class="{'active': activeRectIndex == index, 'selected': activeNode && activeNode.id === node.id}"
                x="-115"
                :y="-IOCircleOffset"
                width="230"
                :height="IOCircleOffset * 2"
                :rx="IOCircleOffset"
                :data-key="index"
                @contextmenu="nodeRectContextMenu(node, $event)"
                @click="nodeRectClick(node)"
              >
              </rect>
              <text
                class="node-text"
                x="-13"
                y="4"
                :data-key="index"
              >
                {{node.text ? ellipse(node.text, 18) : `节点${node.id}`}}
              </text>

              <!-- 输出节点(下) -->
              <circle
                class="node-circle"
                r="5"
                :cy="IOCircleOffset"
                :data-key="index"
                @mousedown="outputCircleMouseDown(node, $event)"
              />

              <!-- 输入节点(上) -->
              <circle
                class="node-circle-lg"
                :class="{'normal': !mousedownCircleNode}"
                r="10"
                :cy="-IOCircleOffset"
                :data-key="index"
                @mouseup="inputCircleMouseUp(node, $event)"
              />

              <circle
                class="node-circle spec"
                r="5"
                :cy="-IOCircleOffset"
              />
            </g>

            <g
              v-if="node.leftIcon"
              transform="translate(-105, -12)"
              :class="`svg-left-icon svg-${node.leftIcon}`"
              v-html="iconData[node.leftIcon]"
            >
            </g>

            <g
              v-if="node.rightIcon"
              transform="translate(59, -12)"
              :class="`svg-right-icon svg-${node.rightIcon}`"
              v-html="iconData[node.rightIcon]"
            >
            </g>

            <g
              transform="translate(91, 0)"
            >
              <circle
                class="node-context-menu-circle"
                fill="#fff"
                r="12"
                transform="translate(4, 0)"
                @click="nodeRectContextMenu(node, $event)"
              ></circle>
              <circle class="context-menu-point" r="1" fill="#333" />
              <circle class="context-menu-point" r="1" cx="4" fill="#333" />
              <circle class="context-menu-point" r="1" cx="8" fill="#333" />
            </g>
          </g>
        </g>
      </g>
    </svg>

    <slot></slot>
  </div>
</template>

<script>
  import * as d3 from "d3";

  // 计算 offset 数值，如果传入了 ele 参数，则计算基于该 ele 的 offset
  const getOffset = (e, ele) => {
    const evt = e || window.event;

    const srcObj = ele || evt.target || evt.srcElement;

    return {
      offsetX: evt.clientX - srcObj.getBoundingClientRect().left,
      offsetY: evt.clientY - srcObj.getBoundingClientRect().top,
    };
  };

  const isArray = (o) => {
    return Object.prototype.toString.call(o) === '[object Array]';
  };

  export default {
    name: 'DirectedGraphEditor',
    props: {
      defaultWidth: {
        type: Number,
        default: 900
      },
      defaultHeight: {
        type: Number,
        default: 600
      },
      enableCircleLink: {
        type: Boolean,
        default: false
      },
      defaultNodes: {
        type: Array,
        default: () => []
      },
      defaultLinks: {
        type: Array,
        default: () => []
      },
      iconData: {
        type: Object,
        default: () => ({})
      },
      transform: {
        type: Object,
        default: () => ({
          x: 0,
          y: 0,
          k: 1
        })
      },
      IOCircleOffset:{
        type: Number,
        default: 18
      }
    },
    data() {
      return {
        width: this.defaultWidth,

        height: this.defaultHeight,

        // 鼠标事件参数
        // 当前选择的节点
        activeNode: null,

        // 按下的输出圆圈的节点
        mousedownCircleNode: null,

        mouseupCircleNode: null,         // 鼠标放开位置所在的节点

        // svg 画布元素
        svg: null,

        nodes: this.defaultNodes,

        links: this.defaultLinks,

        svgActive: false,

        showDragLine: false,

        dragLinePath: 'M0,0L0,0',

        activeRectIndex: -1,

        activeLinkIndex: -1,

        zoom: null,

        fullScreen: false
      }
    },

    mounted() {

      // 检查数据合法性
      this.checkDataValid();

      // 选中 svg 元素
      this.svg = d3.select('.J_graph_svg');

      // 初始化svg画布缩放事件
      this.initZoom();

      // 初始化 node 框拖拽事件
      this.initNodeRectDrag();

      this.adjustScreen();
    },
    methods: {
      /*
       * @desc 为text添加省略号
       * @param str 字符串
       * @param len 长度限制
       */
      ellipse(str, len) {

        let bytesCount = 0,
            ellipseLength = len;

        for (let i = 0; i < str.length; i++)
        {
          const c = str.charAt(i);

          // 匹配中文字符
          if (/^[\u4e00-\u9fa5]$/.test(c)) {
            bytesCount += 2;
          } else
          {
            bytesCount += 1;
          }

          if (bytesCount > len) {
            ellipseLength = i;

            break;
          }
        }

        return `${str.slice(0, ellipseLength)}${ellipseLength < str.length ? '...' : ''}`;
      },

      /*
       * @desc 获取 svg 元素
       */
      getSvgEle() {
        return this.$refs.graphSvg;
      },

      /*
       * @desc 初始化画布缩放
       */
      initZoom() {
        const $this = this;

        this.zoom = d3.zoom()
          .scaleExtent([0.4, 5])
          .translateExtent([[-5000, -5000], [5000, 5000]])
          .on("start", function() {

            $this.$emit('resetLinkMenu');

            $this.$emit('resetNodeMenu');

            // 如果当前按下了某节点，则不进行缩放操作
            if ($this.mousedownCircleNode) {
              return;
            }

            $this.activeNode = null;

            $this.svgMouseDown();

            // 切换鼠标显示
            $this.svg.classed("active",false);

          })
          .on("zoom", function() {

            // 如果当前按下了某节点，则不进行缩放操作
            if ($this.mousedownCircleNode) {
              return;
            }

            // 获取当前变换信息
            let {x, y, k} = d3.event.transform;

            // console.log('zoom:', x, y, k);

            // 对画布进行缩放变换
            d3.select('.J_graph')
              .attr("transform", d3.zoomIdentity.translate(x, y).scale(k));
              // .attr("transform", `translate(${x}px,${y}px) scale(1)`);

          })
          .on("end", function() {

            $this.svgMouseUp();

            // 如果当前按下了某节点，则不进行缩放操作
            if ($this.mousedownCircleNode) {
              return;
            }

            // 切换鼠标显示
            $this.svg.classed("active",false);

          })
          .filter((e) => {
            // 屏蔽输入输出圈鼠标按下事件对 zoom 的影响
            return !(d3.event.type === 'mousedown' && this.mousedownCircleNode);
          });

        // 全局缩放逻辑, 干掉了滚轮缩放
        $this.svg.call(this.zoom).on("wheel.zoom", null);

        // 根据传入的 transform 参数初始化缩放
        $this.svg.call(this.zoom.transform, d3.zoomIdentity.translate(this.transform.x, this.transform.y).scale(this.transform.k));
      },

      /*
       * @desc 初始化 node 的外框拖拽事件
       */
      initNodeRectDrag() {
        // vue this
        const $this = this;

        let point;

        // 新增 node 节点容器 g 组，并绑定拖拽事件
        d3.selectAll('.J_g_node')
          .call(d3.drag()
            .on('start', (d) => {
              point = {
                x: d3.event.x,
                y: d3.event.y
              };

              d3.event.sourceEvent.stopPropagation();

              // 清除选中的连接
              this.activeLinkIndex = -1;

              this.$emit('resetLinkMenu');

              this.$emit('resetNodeMenu');

            })
            .on('drag', function(d) {

              d3.event.sourceEvent.stopPropagation();

              // 鼠标坐标
              const {dx, dy} = d3.event;

              const index = d3.select(this).attr('data-key');

              $this.activeRectIndex = index;

              $this.nodes[index].x += dx;
              $this.nodes[index].y += dy;

            })
            .on('end', (d) => {
              const {x, y} = d3.event;
              const {x: mouseDownX, mouseDownY} = point;

              if ((Math.abs(mouseDownX - x) > 5) || (Math.abs(mouseDownY - y) > 5)) {
                this.$emit('action', {
                  type: 'nodeDragEnd'
                });
              }

              $this.activeRectIndex = -1;
              d3.event.sourceEvent.stopPropagation();
            })
          );
      },

      /*
       * @desc 校验 nodes links 数据是否合法
       */
      checkDataValid() {
        // 判断是否是数组
        if (!isArray(this.nodes) || !isArray(this.links)) {
          throw new Error('nodes数据和links数据必须为数组');
        }

        // 检查重复 node
        const nodesLength = this.nodes.length;

        const nodesIdSet = new Set(this.nodes.map(item => item.id));

        if (nodesIdSet.size !== nodesLength) {
          throw new Error('提供的nodes数据中有重复id项');
        }

        // 检查重复 links
        let linksValidSet = new Set([]);

        this.links.forEach((item) => {

          linksValidSet.add(`${item.source}@${item.target}`);
          linksValidSet.add(`${item.target}@${item.source}`);

        });

        if (linksValidSet.size < (this.links.length * 2)) {
          throw new Error('提供的links数据中有双向连接或重复项');
        }
      },

      /**
       * @desc svgZoom 操作，对应放大和缩小操作, 若指定了 k 值，则会忽略 status，缩放系数指定为 k
       * @param status  status 为 true 则是放大操作，为 false 则是缩小操作
       * @param k 指定缩放系数
       */
      svgZoom(status, k) {
        // 获取画布元素缩放后的缩放信息

        if (k) {
          this.zoom.scaleTo(d3.select(this.svg.node()), k);
          return;
        }

        const ratio = status ? 1.1 : 0.9;

        // 对画布进行缩放变换
        this.zoom.scaleBy(d3.select(this.svg.node()), ratio);
      },

      /*
       * @desc 切换全屏状态，并触发 fullScreen 事件
       * @param status status 为 true 全屏，为 false 退出全屏
       */
      setFullScreen(status) {

        this.fullScreen = status;

        // 将画布变为 position: fixed 然后将宽度，高度设置为最大

        this.$emit('fullScreen', status);
      },

      /*
       * @desc 适应屏幕
       */
      adjustScreen() {

        // 当前 transform 偏移量与缩放
        const svgNode = d3.select(this.svg.node());

        const graphEle = document.getElementsByClassName('J_graph')[0];

        // const {k: k0} = d3.zoomTransform(svgNode);

        const svgBox = this.svg.node().getBoundingClientRect();

        const graphBox = graphEle.getBoundingClientRect();

        // 偏移向量

        const wRatio = svgBox.width / graphBox.width;
        const hRatio = svgBox.height / graphBox.height;

        // 计算缩放系数
        let kRatio = 1, k = 1;

        kRatio = wRatio < hRatio ? wRatio : hRatio;

        const k1 = /*k0 * */kRatio;

        // 不管缩小还是放大，最终的放大系数都不会超过1
        k = k1 > 1 ? 1 : k1;

        // 缩放到指定大小
        this.zoom.scaleBy(svgNode, k);

        const transData = graphEle.getAttribute('transform').match(/scale\(([.\d]+)\)/);

        const k2 = transData ? transData[1] ? parseFloat(transData[1]) : 1 : 1;

        const graphBox1 = graphEle.getBoundingClientRect();

        let {x: x0, y: y0, width: w0, height: h0, top: top0, left: left0} = svgBox;

        let {x: x1, y: y1, width: w1, height: h1, top: top1, left: left1} = graphBox1;

        const posX0 = x0 || left0 || 0;
        const posX1 = x1 || left1 || 0;

        const posY0 = y0 || top0 || 0;
        const posY1 = y1 || top1 || 0;

        // 计算偏移量
        const deltaTransX = posX0 + (w0/2) - (w1/2) - posX1;
        const deltaTransY = posY0 + (h0/2) - (h1/2) - posY1;

        this.zoom.translateBy(svgNode, deltaTransX / k2, deltaTransY / k2);

      },

      /*
       * @desc svg 右键点击事件，禁止弹出浏览器菜单
       */
      svgContextMenu(e) {
        e.preventDefault();
        return false;
      },

      /*
       * @desc 路径path d 属性计算, 使用 source target 来计算
       * @param link 连接的数据信息
       */
      pathLink(link) {

        // link source 和 target 节点
        const linkSource = this.nodes.find(item => item.id === link.source);
        const linkTarget = this.nodes.find(item => item.id === link.target);

        // 计算起始点与目标点的位移 (deltaX, deltaY)
        const deltaX = linkTarget.x - linkSource.x;
        const deltaY = linkTarget.y - linkSource.y;

        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normX = deltaX / dist;

        // 设置连线的偏移量（起始或结束点并非对应到节点的中心）
        const sourcePaddingY = this.IOCircleOffset + 10;
        const targetPaddingY = -(this.IOCircleOffset + 12);

        const sourcePaddingX = 0;
        const targetPaddingX = -6 * normX;

        // 根据偏移量计算连线的起始点和结束点
        const sourceX = linkSource.x + sourcePaddingX;
        const sourceY = linkSource.y + sourcePaddingY - 2;
        const targetX = linkTarget.x + targetPaddingX;
        const targetY = linkTarget.y + targetPaddingY;

        if (targetY < sourceY) {
          const mY = (sourceY - targetY) / 2;

          return `M${sourceX},${sourceY}C${sourceX},${sourceY + mY},${targetX},${targetY - mY},${targetX},${targetY}`;
        }

        return d3.linkVertical()({
          source: [sourceX, sourceY],
          target: [targetX, targetY]
        });
      },

      /*
       * @desc 计算 link 文字位置
       * @param link
       */
      linkTextPos(link) {

        // link source 和 target 节点
        const linkSource = this.nodes.find(item => item.id === link.source);
        const linkTarget = this.nodes.find(item => item.id === link.target);

        let xOffset = 0;
        let yOffset = 0;

        if (linkTarget.y < linkSource.y) {
          if(Math.abs(linkTarget.x - linkSource.x) < 30) {
            xOffset = (linkTarget.x - linkSource.x) / 10;
          } else if (linkTarget.x > linkSource.x) {
            xOffset = -3;
          } else {
            xOffset = 3;
          }
        }

        return {
          x: (linkSource.x + linkTarget.x) / 2 + xOffset,
          y: (linkSource.y + linkTarget.y) / 2,
        }

      },

      /*
       * @desc  连接点击事件
       * @param index 点击的连接索引
       */
      pathLinkClick(index) {
        this.activeLinkIndex = index;
      },

      /*
       * @desc  连接右击事件
       * @param link  右击的连接数据
       * @param index 右击的连接索引
       * @e 事件参数
       */
      pathLinkContextMenu(link, index, e) {
        this.$emit('linkContextMenu', {
          link,
          index,
          e
        });
      },

      /*
       * @desc 节点框点击事件
       * @param node 对应的节点数据
       */
      nodeRectClick(node) {
        this.activeNode = node;
      },

      /*
       * @desc node框右键点击事件
       * @param node 节点数据
       * @param e 事件信息
       */
      nodeRectContextMenu(node, e) {
        e.preventDefault();
        e.stopPropagation();

        this.activeNode = node;

        this.$emit('nodeContextMenu', {
          node,
          e
        });
      },

      /*
       * @desc 输出节点鼠标按下事件
       * @param node 节点数据
       * @param e 事件信息
       */
      outputCircleMouseDown(node, e) {
        e.stopPropagation();

        this.$emit('resetLinkMenu');

        // 设置按下的节点为此节点
        this.mousedownCircleNode = node;

        // 清除选中的连接
        this.activeLinkIndex = -1;

        this.showDragLine = true;

        this.dragLinePath = `M${this.mousedownCircleNode.x},${this.mousedownCircleNode.y + 16}L${this.mousedownCircleNode.x},${this.mousedownCircleNode.y + 16}`;

      },

      /*
       * @desc 输入节点鼠标抬起事件
       * @param node 节点数据
       * @param e 事件数据
       */
      inputCircleMouseUp(node, e) {
        e.stopPropagation();

        // 鼠标放开事件
        // 如果没有按下的节点，则返回
        if (!this.mousedownCircleNode) return;

        // 隐藏拖拽线
        this.showDragLine = false;

        // 判断是否是连接到了自己
        this.mouseupCircleNode = node;

        const sourceId = this.mousedownCircleNode.id;
        const targetId = this.mouseupCircleNode.id;

        if (targetId === sourceId) {
          // 清空相关变量
          this.resetMouseArgs();
          return;
        }

        // 判断对应的两个节点之间的 link 连线是否存在
        const {exists} = this.containsLink(sourceId, targetId);

        // 如果对应的 link 已经存在，则不处理，不存在则新增项
        if (!exists) {

          if (!this.enableCircleLink && this.circleLinkCheck(node)) {
            throw new Error('不允许有环形关系');
          }

          this.links.splice(this.links.length, 0, { source: sourceId, target: targetId });

          this.$emit('action', {
            type: 'addLink'
          });
        }

        this.mousedownCircleNode = null;
      },

      /*
       * 深度遍历有向环检测
       */
      circleLinkCheck() {

          try {

            this.deepTraversal(this.mouseupCircleNode, []);

          } catch (e) {
            console.log(e);

            return true;
          }

        return false;
      },

      // 深度优先遍历
      deepTraversal(node, depthData) {

        if (node) {

          // 记录当前遍历
          depthData.push(node.id);

          // 找到当前节点的所有children, 即 links 中 source 为 node.id 的 target 的 id 项
          let children = [];

          this.links.forEach(({source, target}) => {

            if (source === node.id) {

              // 检测是否已遍历过
              if (depthData.indexOf(target) !== -1) {
                throw new Error('不允许出现循环连接');
              }

              // 检查是否存在 两个节点之间的循环关系
              if (target === this.mousedownCircleNode.id) {
                throw new Error('不允许出现循环连接');
              }

              children.push(this.nodes.find(item => item.id === target));
            }
          });

          // 如果 children 中存在 depthData 中存在的节点（已在深度遍历树上），则表示出现了环形
          for (let i = 0; i < children.length; i++)

            //每次递归的时候将  需要遍历的节点  和 节点所存储的数组传下去
            this.deepTraversal(children[i], [...depthData]);
        }

        // return depthData;
      },

      /**
       * @desc svg mouse down 事件响应
       */
      svgMouseDown() {
        // 切换鼠标形状
        this.svgActive = true;

        // 清除选中的连接
        this.activeLinkIndex = -1;
      },

      /*
       * @desc svg mouse move 事件响应
       * @param e 事件信息
       */
      svgMouseMove(e) {
        if (!this.mousedownCircleNode) return;

        const {x, y} = this.mousedownCircleNode;

        const {offsetX, offsetY} = getOffset(e, this.$refs.graphSvg);

        // 缩放后，鼠标的坐标拖拽点的变换
        const transform = d3.zoomTransform(this.svg.node());

        // 对路径向量进行变换处理
        const [finalX, finalY] = transform.invert([offsetX, offsetY]);

        // 更新拖拽连接线的参数
        this.dragLinePath = d3.linkVertical()({
          source: [x, y + this.IOCircleOffset + 6],
          target: [finalX, finalY]
        });

      },

      /*
       * @desc svg mouse leave 事件
       * @param e
       */
      svgMouseLeave(e) {

        this.showDragLine = false;

        // 清空相关的鼠标事件对象
        this.resetMouseArgs();
      },

      /*
       * @desc svg mouse up 事件响应
       * @param e 事件信息
       */
      svgMouseUp(e) {

        // 如果按下了节点
        if (this.mousedownCircleNode) {
          this.showDragLine = false;
        }

        // 切换鼠标的形状
        this.svgActive = false;

        // 清空相关的鼠标事件对象
        this.resetMouseArgs();
      },

      /**
       * @desc svg drop 事件(放置拖拽数据时调用)
       * @param e 事件信息
       */
      svgDrop(e) {
        e.preventDefault();

        // emit svg 事件
        this.$emit('svgDrop', e);
      },

      /*
       * @desc 运行拖拽进入该元素
       */
      allowDrop(e) {
        e.preventDefault();
      },

      /***********************************************************************
       * nodes 以及 links 数据操作（增删改查）
       ***********************************************************************/

      /*
       * @desc 获取当前 nodes links 数据
       */
      getGraphData() {
        // 缩放后，鼠标的坐标拖拽点的变换
        const transform = d3.zoomTransform(this.svg.node());

        return {
          nodes: this.nodes || [],
          links: this.links || [],
          svgTransform: transform,
        }
      },

      /*
       * @desc 在 svg 画布 x, y 指定位置新增节点，若未传入 x, y, 则会在 0 0 位置创建
       * @param x  x坐标
       * @param y  y 坐标
       * @param node   节点数据
       */
      addNode(x = 0, y = 0, node) {

        // 获取画布元素缩放后的缩放信息
        const transform = d3.zoomTransform(this.svg.node());

        // 对相对于画布是缩放，做逆变换，获取真实的绘制坐标
        const [finalX, finalY] = transform.invert([x, y]);

        if (node) {

          node = Object.assign(node, {
            x: finalX,
            y: finalY
          });

        } else {
          node = { id: this.randomString(6), x: finalX, y: finalY }
        }

        if (this.containsNode(node.id).exists) {
          throw new Error('当前图中已存在该id的节点');
        }

        this.nodes.splice(this.nodes.length, 0, node);

        this.$emit('action', {
          type: 'addNode'
        });

        this.$nextTick(() => {
          this.initNodeRectDrag();
        });
      },

      /*
       * @desc 从 nodes 中删除对应 id 的 node 项，如果是激活的节点，则要清理对应激活的节点数据
       * @param id
       */
      removeNode(id) {

        const {index, exists} = this.containsNode(id);

        if (exists) {

          if (this.activeNode.id === id) {
            this.activeNode = null;
          }

          // 删除 node 之前需先删除 node 关联的 links
          this.links = this.links.filter((link) => (link.target !== id) && (link.source !== id));

          this.nodes.splice(index, 1);

          this.$emit('action', {
            type: 'removeNode'
          });
        }
      },

      /*
       * @desc 更新指定 id 的节点的数据, 可以传节点数据或回调函数（参数为原节点）
       * @param id
       * @param nodeOrCallBack (node) => newNode;
       */
      setNodeData(id, nodeOrCallBack) {
        const {exists, node, index} = this.containsNode(id);

        if (!exists) return;

        if (typeof nodeOrCallBack === 'function') {

          this.nodes.splice(index, 1, nodeOrCallBack(node));

        } else {

          this.nodes.splice(index, 1, nodeOrCallBack);

        }

        this.$emit('action', {
          type: 'updateNode'
        });

        this.$nextTick(() => {
          this.initNodeRectDrag();
        });
      },

      /*
       * @desc 获取指定 id 的节点数据
       * @param id
       * @returns {*|null}
       */
      getNodeData(id) {
        return this.nodes.find(item => item.id === id) || null;
      },

      /*
       * @desc 更新 nodes 数据，可以传对象数据或回调
       * @param nodesOrCallBack (nodesData) => newNodesData;
       */
      setNodesData(nodesOrCallBack) {
        if (typeof nodesOrCallBack === 'function') {
          this.nodes = nodesOrCallBack(this.nodes);
        } else {
          this.nodes = nodesOrCallBack;
        }

        this.$emit('action', {
          type: 'updateNodes'
        });

        this.$nextTick(() => {
          this.initNodeRectDrag();
        });
      },

      /*
       * @desc 设置 linksData, 可以是对象数据或回调
       * @param linksOrCallBack     (linksData) => newLinksData;
       */
      setLinksData(linksOrCallBack) {
        if (typeof linksOrCallBack === 'function') {
          this.links = linksOrCallBack(this.links);
        } else {
          this.links = linksOrCallBack;
        }

        this.$emit('action', {
          type: 'updateLinks'
        });
      },

      /*
       * @desc 插入一条 link 连接数据
       * @param link
       */
      addLink(link) {

        const {exists} = this.containsLink(link.source, link.target);

        if (exists) {
          throw new Error('添加的连接在连接数据中已存在');
        } else {
          this.links.splice(this.links.length, 0, link);

          this.$emit('action', {
            type: 'addLink'
          });
        }
      },

      /*
       * @desc 设置指定 sourceId, targetId 的 Link 数据, 可以传 Link 数据或回调函数
       * @param sourceId  原节点Id
       * @param targetId  模板节点Id
       * @param linkOrCallBack link => newLink;
       */
      setLinkData(sourceId, targetId, linkOrCallBack) {

        // 在 links 中双向寻找对应的 link
        const {exists, index, link} = this.containsLink(sourceId, targetId);

        if (!exists) return;

        if (typeof linkOrCallBack === 'function') {

          this.links.splice(index, 1, linkOrCallBack(link));

        } else {

          // if (linkOrCallBack.source >= linkOrCallBack.target) {
          //   throw new Error('连接 sourceId 必须小于 targetId');
          // }

          this.links.splice(index, 1, linkOrCallBack);
        }

        this.$emit('action', {
          type: 'updateLink'
        });
      },

      /*
       * @desc 删除一条 link
       * @param sourceId
       * @param targetId
       */
      removeLink(sourceId, targetId) {

        const {index, exists} = this.containsLink(sourceId, targetId);

        if (exists) {
          this.links.splice(index, 1);

          this.activeLinkIndex = -1;

          this.$emit('action', {
            type: 'removeLink'
          });
        }
      },


      /****************************************************************************
       * 公用方法
       ****************************************************************************/

      /*
       * @desc 生成指定长度的随机字符串
       * @param len
       * @returns {string}
       */
      randomString(len = 32) {

        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

        const maxPos = chars.length;

        let str = '';

        for (let i = 0; i < len; i++) {

          str += chars.charAt(Math.floor(Math.random() * maxPos));

        }

        return str;
      },

      /*
       * @desc 判断相应id 的 node 在 nodes 数据中是否存在
       * @param id
       * @returns {{exists: boolean, index: (*|number), node: null}}
       */
      containsNode(id) {
        const index = this.nodes.findIndex(item => item.id === id);

        const exists = (index >= 0);

        return {
          exists,
          index,
          node: exists ? this.nodes[index] : null
        };
      },

      /*
       * @desc 判断相应的 source 和 target 的 link 在 links 中是否存在, 双向判断
       * @param sourceId
       * @param targetId
       * @returns {{exists: boolean, index: (*|number), link: null}}
       */
      containsLink(sourceId, targetId) {
        const index = this.links.findIndex(item => (((item.source == sourceId) && (item.target == targetId)) || ((item.target == sourceId) && (item.source == targetId))));

        const exists = (index >= 0);

        return {
          exists,
          index,
          link: exists ? this.links[index] : null
        };
      },

      /*
       * @desc 重置鼠标事件参数 - 按下的节点 - 鼠标放开位置所在的节点 - 按下的连接索引
       */
      resetMouseArgs() {
        this.mousedownCircleNode = null;
        this.mouseupCircleNode = null;
        this.activeLinkIndex = -1;
      },

      /*
       * @desc 设置当前选中的节点
       * @param id 节点id
       */
      setSelectedNode(id) {
        const node = this.nodes.find(item => item.id === id);

        // 不存在
        if (!node) {
          throw new Error('图中该id节点不存在');
        }

        // 设置 activeNode
        if (!this.activeNode || (this.activeNode && (this.activeNode.id !== node.id))) {
          this.activeNode = node;
        }

        return node;
      }
    },
    watch: {
      /*
       * @desc 暴露 节点选择变化 事件
       * @param node
       */
      activeNode(node) {
        this.$emit('nodeSelectChange', node);
      },

      /*
       * @desc 暴露 连接选择变换  事件
       * @param linkIndex
       */
      activeLinkIndex(linkIndex) {

        this.$emit('linkSelectChange',
          {
            link: linkIndex > 0 ? this.links[linkIndex] : null,
            index: linkIndex
          }
        );
      },
      transform(v) {
        // 根据传入的 transform 参数初始化缩放
        this.svg.call(this.zoom.transform, d3.zoomIdentity.translate(this.transform.x, this.transform.y).scale(this.transform.k));
      }
    }
  }
</script>

<style lang="less" scoped>
  .relative {
    position: relative;
  }
  .graph-container {
    position: relative;
    width: 100%;
    height: 100%;
    &.full-screen {
      position: fixed;
      left: 0;
      top: 0;
      width: 100% !important;
      height: 100% !important;

      z-index: 999;
    }
    background-image: linear-gradient(90deg, #222830 0%, #3d444c 100%);
  }
  .operation-panel {
    display: flex;

    align-items: center;

    position: absolute;
    right: 8px;
    top: 8px;

    padding: 0 14px;

    height: 36px;

    font-size: 0;

    background: rgba(0,0,0,0.30);
    border-radius: 18px;

    .icon-enlarge, .icon-shrink, .icon-reset, .icon-full-screen, .icon-not-full-screen, .icon-adjust-screen {
      width: 20px;
      height: 20px;
      margin: 0 10px;

      fill: #fff;

      cursor: pointer;
      &:hover+.tips {
        position: absolute;
        left: 50%;
        top: -48px;
        padding: 6px 10px;

        font-size: 12px;
        background: rgba(255,255,255,0.9);
        color: #333;
        word-break: keep-all;

        border-radius: 3px;

        transform: translate(-50%, 0);

        &:before {
          content: '';
          display: block;

          position: absolute;

          left: 50%;
          bottom: -6px;

          margin-left: -6px;

          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid rgba(255,255,255,0.9);
        }
      }
    }
  }

  .direct-graph-svg {
    width: 100%;
    height: 100%;

    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTY2NDM3OTczMjY5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMxMzAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTAyNCA0OTkuNTEyMTk1SDUyNC40ODc4MDVWMGgtMTIuNDg3ODA1djQ5OS41MTIxOTVIMHYxMi40ODc4MDVoNTEyVjEwMjRoMTIuNDg3ODA1VjUxMmg0OTkuNTEyMTk1eiIgZmlsbD0iI0U4RUJGMCIgb3BhY2l0eT0iLjI0IiBwLWlkPSIzMTMxIj48L3BhdGg+PC9zdmc+');
    background-repeat: repeat;

    background-size: 30px;


    cursor: hand;
    cursor: -webkit-grab;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;

    overflow: hidden;

    &.active {
      cursor: -webkit-grabbing;
    }

    path.link {
      fill: none;
      stroke: #1d8ff7;
      stroke-width: 1.2px;
      cursor: default;

      &.dragline {
        pointer-events: none;
      }

      &.selected, &:hover {
        stroke: #81C3FC;
        stroke-width: 3px;
      }
    }

    path.link-bg {
      stroke: transparent;
      stroke-width: 14px;
      cursor: default;
      fill: none;

      &:hover+.link {
        stroke: #81C3FC;
        stroke-width: 3px;
      }
    }

    circle.node-circle {
      stroke-width: 0.5px;
      cursor: crosshair;

      fill: #fff;

      stroke: gray;

      &.spec {
        cursor: auto;

        pointer-events: none;
      }

      &:hover {
        fill: gray;
      }
    }

    circle.node-circle-lg {
      fill: rgba(0, 161, 255, 0.45098039215686275);

      opacity: 0;

      &.normal {
        &:hover {
          opacity: 0;
        }
      }

      &:hover {
        opacity: 1;
      }
    }

    .svg-left-icon, .svg-right-icon {
      pointer-events: none;
    }

    .node-text {
      /*width: 140px;*/

      /*text-align: center;*/
      /*font: 12px sans-serif;*/
      pointer-events: none;
      text-anchor: middle;
      fill: #333;

      /*word-break: keep-all;*/
      /*white-space: nowrap;*/

      /*transform: translate(-50%, -50%);*/

      /*text-overflow: ellipsis;*/
      /*overflow: hidden;*/
    }

    .node-rect {
      cursor: hand;
      cursor: -webkit-grab;

      fill: rgba(255, 255, 255, 1);

      /*stroke: #289de9;*/

      &.active {
        cursor: move;
      }

      &.selected, &:hover {
        fill: #C2E2FD;
        /*fill: url(#linear-rect-bg);*/
      }
    }

    .link-desc-circle {
      &:hover {
        stroke: #0c8cfa;
        & + .link-text {
          opacity: 1;
        }
      }
    }

    .link-text {
      opacity: 0;
      color: #333;
      pointer-events: none;

      transition: opacity 0.3s ease-in-out;

      /*text-anchor: middle;*/
    }

    .node-context-menu-circle {
      stroke-width: 1px;
      stroke: transparent;
      &:hover {
        stroke: #eee;
      }
    }

    .context-menu-point {
      pointer-events: none;
    }
  }

  .menu-drag-node {
    position: absolute;
    left: 100px;
    top: 2px;
    width: 100px;
    height: 36px;
    background: #84d68e;
    border-radius: 18px;
    line-height: 36px;
    text-align: center;
    font-size: 13px;
    cursor: pointer;
  }

</style>
