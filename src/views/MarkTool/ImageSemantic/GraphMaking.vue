<template>
  <g>
    <g
      v-if="
        currentDraw &&
        currentDraw.type === 'ellipse' &&
        currentDraw.start.x !== currentDraw.drag.x
      "
    >
      <ellipse
        class="ellipse"
        :cx="currentDraw.start.x"
        :cy="currentDraw.start.y"
        :rx="currentDraw.drag.dx"
        :ry="currentDraw.drag.dy"
        fill="rgba(94, 158, 224, 1)"
        stroke="#6da1ff"
        stroke-width="1"
        :style="{ opacity: 0.8 }"
      />
    </g>
    <g
      v-if="
        currentDraw &&
        currentDraw.type === 'circle' &&
        currentDraw.start.x !== currentDraw.drag.x
      "
    >
      <circle
        class="circle"
        :cx="currentDraw.start.x"
        :cy="currentDraw.start.y"
        :r="Math.hypot(currentDraw.drag.dx, currentDraw.drag.dy)"
        fill="rgba(94, 158, 224, 1)"
        stroke="#6da1ff"
        stroke-width="1"
        :style="{ opacity: 0.8 }"
      />
    </g>
    <g
      v-if="
        currentDraw &&
        currentDraw.type === 'rect' &&
        currentDraw.start.x !== currentDraw.drag.x
      "
    >
      <rect
        :x="Math.min(currentDraw.start.x, currentDraw.drag.x)"
        :y="Math.min(currentDraw.start.y, currentDraw.drag.y)"
        :height="Math.abs(currentDraw.drag.y - currentDraw.start.y)"
        :width="Math.abs(currentDraw.drag.x - currentDraw.start.x)"
        fill="rgba(94, 158, 224, 1)"
        stroke="#6da1ff"
        :style="{ opacity: 0.8 }"
        stroke-width="1"
      />
    </g>
    <g v-if="currentDraw && currentDraw.type === 'polygon'">
      <polygon
        class="making-polygon"
        stroke="#6da1ff"
        stroke-width="1"
        fill="rgba(94, 158, 224, 1)"
        :points="getCurrentPolygonPoints()"
        :style="{ opacity: 0.8 }"
      />
      <circle
        v-for="(point, pIndex) in currentDraw.points"
        :key="pIndex"
        class="point point-control"
        data-point-action-type="polygon"
        :r="circleRadius"
        :cx="point.x"
        :cy="point.y"
        @click="handleMarkAreaContextMenu($event, true)"
      />
    </g>
  </g>
</template>
<script>
export default {
  props: ["currentDraw", "pointMove"],
  data() {
    return {
      circleRadius: 4, //操作点半径
    };
  },
  methods: {
    getCurrentPolygonPoints() {
      return `${this.currentDraw.points.reduce(
        (v, point) => `${v ? `${v},` : ""} ${point.x} ${point.y}`,
        ""
      )}${this.pointMove ? `, ${this.pointMove.x} ${this.pointMove.y}` : ""}`;
    },
    handleMarkAreaContextMenu($event, status) {
      this.$emit("handleMarkAreaContextMenu", $event, status);
    },
  },
};
</script>
<style lang="less">
</style>