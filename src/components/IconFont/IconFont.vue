<template>
  <i :class="classes" :style="styles"></i>
</template>

<script>
  export default {
    name: 'IconFont',
    props: {
      type: String,
      size: {
        type: [Number, String],
        default: 14
      },
      color: {
        type: String,
        default: '#515a6e'
      }
    },
    computed: {
      classes () {
        return [
          'iconfont',
          this.type
        ]
      },
      styles () {
        return {
          fontSize: `${this.size}px`,
          color: this.color
        }
      }
    }
  }
</script>
