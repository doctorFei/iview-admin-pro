<template>
  <g>
    <ellipse
      v-if="svgData.type === 'ellipse'"
      id="ellipse"
      class="ellipse"
      :class="styles"
      :cx="svgData.cx"
      :cy="svgData.cy"
      :rx="svgData.rx"
      :ry="svgData.ry"
      fill="rgba(94, 158, 224, 1)"
      stroke="#6da1ff"
      stroke-width="1"
      :style="{ opacity: svgData.opacity }"
      @mouseenter="handleRegionMetaMouseIn(index)"
      @mouseleave="handleRegionMetaMouseLeave(index)"
      @mousedown="handleRegionClick(svgData.id, $event)"
      @click="handleStopPropagation($event)"
    />
    <circle
      v-if="svgData.type === 'circle'"
      id="circle"
      class="circle"
      :class="styles"
      :cx="svgData.cx"
      :cy="svgData.cy"
      :r="svgData.r"
      fill="rgba(94, 158, 224, 1)"
      :style="{ opacity: svgData.opacity }"
      stroke="#6da1ff"
      @mouseenter="handleRegionMetaMouseIn(index)"
      @mouseleave="handleRegionMetaMouseLeave(index)"
      @mousedown="handleRegionClick(svgData.id, $event)"
      @click="handleStopPropagation($event)"
      stroke-width="1"
    />
  </g>
</template>
<script>
const circlePointDirections = ["tm", "mr", "bm", "ml"];
export default {
  props: {
    svgData: {
      type: Object,
      default: () => {},
    },
    hover: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: -1,
    },
  },
  computed: {
    styles() {
      return {
        hover: this.hover,
        active: this.active,
      };
    },
  },
  data() {
    return {
      circlePointDirections: circlePointDirections,
    };
  },
  methods: {
    handleRegionClick(id, event) {
      this.$emit("on-mouse-down", id, event);
    },
    handleStopPropagation(e) {
      this.$emit("on-handle-stop-propagation", e);
    },
    handleRegionMetaMouseIn(index) {
      this.$emit("handleRegionMetaMouseIn", index);
    },
    handleRegionMetaMouseLeave(index) {
      this.$emit("handleRegionMetaMouseLeave", index);
    },
  },
};
</script>