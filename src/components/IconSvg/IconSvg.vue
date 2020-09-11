<template>
  <svg class="icon-svg" aria-hidden="true" :style="styles">
    <use :xlink:href="svgType"></use>
  </svg>
</template>

<script>
  export default {
    name: 'IconSvg',
    props: {
      type: String,
      size: {
        type: [Number, String],
        default: 14
      }
    },
    computed: {
      svgType () {
        return `#${this.type}`
      },
      styles () {
        return {
          fontSize: `${this.size}px`
        }
      }
    }
  }
</script>

<style scoped>

</style>
