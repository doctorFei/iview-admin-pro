<template>
  <g>
    <template v-for="(selectedItemPoints, index) in selectedItemPointsArr">
      <g :key="index" v-if="selectedItem && selectedItemPoints.type === 'rect'">
        <circle
          v-for="(point, pIndex) in selectedItemPoints.point"
          :key="pIndex"
          class="point point-rect"
          :data-point-id="selectedItemPoints.id"
          :data-point-action-type="rectPointDirections[pIndex]"
          :class="`point-control-${rectPointDirections[pIndex]}`"
          :r="circleRadius"
          :cx="point.x"
          :cy="point.y"
        />
      </g>

      <g
        :key="index"
        v-if="selectedItem && selectedItemPoints.type === 'circle'"
      >
        <circle
          v-for="(point, pIndex) in selectedItemPoints.point"
          :key="pIndex"
          :data-point-id="selectedItemPoints.id"
          class="point point-circle"
          :data-point-action-type="circlePointDirections[pIndex]"
          :class="`point-control-${circlePointDirections[pIndex]}`"
          :r="circleRadius"
          :cx="point.x"
          :cy="point.y"
        />
      </g>
      <g
        :key="index"
        v-if="selectedItem && selectedItemPoints.type === 'ellipse'"
      >
        <circle
          v-for="(point, pIndex) in selectedItemPoints.point"
          :key="pIndex"
          :data-point-id="selectedItemPoints.id"
          class="point point-ellipse"
          :data-point-action-type="circlePointDirections[pIndex]"
          :class="`point-control-${circlePointDirections[pIndex]}`"
          :r="circleRadius"
          :cx="point.x"
          :cy="point.y"
        />
      </g>
      <!-- 多边形点 -->
      <g
        :key="index"
        v-if="selectedItem && selectedItemPoints.type === 'polygon'"
      >
        <circle
          v-for="(point, pIndex) in selectedItemPoints.point"
          :key="pIndex"
          :data-point-id="selectedItemPoints.id"
          class="point point-polygon"
          data-point-action-type="polygon"
          :data-index="pIndex"
          :r="circleRadius"
          :cx="point.x"
          :cy="point.y"
          @contextmenu="
            handlePolygonPointContextMenu(selectedItem, pIndex, $event)
          "
        />
      </g>
    </template>
  </g>
</template>
<script>
import initEvent from "./initEvent";
const rectPointDirections = ["tl", "tm", "tr", "ml", "mr", "bl", "bm", "br"];
const circlePointDirections = ["tm", "mr", "bm", "ml"];

export default {
  mixins: [initEvent],
  props: {
    selectedItem: {
      type: Object,
      default: () => {},
    },
    selectedItemIdArr: {
      type: Array,
      default: () => [],
    },
    getSelectItemFn: {
      type: Function,
      default: () => {},
    },
    initPointsDrag: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      rectPointDirections,
      circlePointDirections,
      circleRadius: 6, //操作点半径
      selectedItemPointsArr: [],
    };
  },
  watch: {
    selectedItemIdArr(arr) {
      const selectedItems = this.getSelectItemFn(arr);
      this.selectedItemPointsArr = selectedItems.map((selectedItem) =>
        this.setSlectedItemPoint(selectedItem)
      );
      this.initPointsDrag();
    },
    // 还是用一个selectitem去控制对当前形状的操控
    selectedItem: {
      handler(selectedItem) {
        if (selectedItem) {
          const index = this.selectedItemPointsArr.findIndex(
            (item) => item.id === selectedItem.id
          );
          if (index > -1) {
            const newItem = this.setSlectedItemPoint(selectedItem);
            this.selectedItemPointsArr.splice(index, 1, newItem);
            this.initPointsDrag();
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    handlePolygonPointContextMenu(item, pIndex, $event) {
      this.$emit("handlePolygonPointContextMenu", item, pIndex, $event);
    },
    setSlectedItemPoint(selectedItem) {
      if (selectedItem && selectedItem.type === "rect") {
        const { id, x, y, width, height } = selectedItem;
        return {
          id,
          type: "rect",
          point: [
            { x, y },
            { x: x + width / 2, y },
            { x: x + width, y },
            { x, y: y + height / 2 },
            { x: x + width, y: y + height / 2 },
            { x, y: y + height },
            { x: x + width / 2, y: y + height },
            { x: x + width, y: y + height },
          ],
        };
      }
      if (selectedItem && selectedItem.type === "circle") {
        const { id, cx, cy, r } = selectedItem;
        return {
          id,
          type: "circle",
          point: [
            { x: cx, y: cy - r },
            { x: cx + r, y: cy },
            { x: cx, y: cy + r },
            { x: cx - r, y: cy },
          ],
        };
      }
      if (selectedItem && selectedItem.type === "ellipse") {
        const { id, cx, cy, rx, ry } = selectedItem;
        return {
          id,
          type: "ellipse",
          point: [
            { x: cx, y: cy - ry },
            { x: cx + rx, y: cy },
            { x: cx, y: cy + ry },
            { x: cx - rx, y: cy },
          ],
        };
      }
      if (selectedItem && selectedItem.type === "polygon") {
        const { id, points } = selectedItem;
        return {
          id,
          type: "polygon",
          point: points,
        };
      }
      return [];
    },
  },
};
</script>
<style lang="less">
circle.point {
  stroke-width: 6px;
  cursor: crosshair;

  fill: rgba(255, 255, 255, 0.7);

  stroke: transparent;

  &.spec {
    cursor: auto;

    pointer-events: none;
  }
  &.point-control,
  &.point-polygon {
    cursor: default;
    &-tl {
      cursor: se-resize;
    }
    &-tm {
      cursor: n-resize;
    }
    &-tr {
      cursor: ne-resize;
    }
    &-ml {
      cursor: w-resize;
    }
    &-mr {
      cursor: e-resize;
    }
    &-bl {
      cursor: ne-resize;
    }
    &-bm {
      cursor: s-resize;
    }
    &-br {
      cursor: nw-resize;
    }
  }
}
</style>