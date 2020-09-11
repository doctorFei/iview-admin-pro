<template>
  <span class="c-count-to" :id="wrapId"></span>
</template>
<script>
  import { CountUp } from 'countup.js'

  export default {
    name: 'CountTo',
    computed: {
      wrapId () {
        return `targetId${this._uid}`
      }
    },
    props: {
      endVal: {
        type: Number,
        require: true
      },
      options: {
        type: Object,
        require: true
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.countUp = new CountUp(this.wrapId, 5234, Object.assign({}, this.countOptions, this.options))
        if (!this.countUp.error) {
          this.countUp.start()
        } else {
          console.error(this.countUp.error)
        }
      })
    },
    data () {
      return {
        countOptions: {}
      }
    },
    watch: {
      endVal (val) {
        this.countUp.update(val)
      }
    }
  }
</script>

<style scoped>

</style>
