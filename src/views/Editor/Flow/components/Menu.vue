<template>
  <div class="node-add-menu">
    <div class="btn-add">节点列表</div>
    <ul class="menu-item-list">
      <li
        class="relative menu-item-wrap"
        v-for="item in [1, 2, 3, 4]"
      >
        <p
          class="menu-item"
          @dragstart="dragStart"
          @dragend="dragEnd"
          draggable="true"
        >
          节点{{item}}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
  import { randomString } from '@/libs/utils'

  export default {
    name: 'Menu',
    data () {
      return {
        x: 0,
        y: 0,
      }
    },
    methods: {
      dragStart (e) {

        if (navigator.userAgent.toLocaleLowerCase().indexOf('firefox') > 0) {
          e && e.dataTransfer && e.dataTransfer.setData && e.dataTransfer.setData('default', '')
        }

        const id = randomString(6)

        this.$store.commit('setNodeDrag', {
          id,
          x: 0,
          y: 0,
          text: `节点${id}`,
        })

      },
      dragEnd (e) {

        setTimeout(() => {
          this.$store.commit('setNodeDrag', null)
        }, 500)
      },
    }
  }
</script>

<style lang="less">

  .absolute {
    position: absolute;
  }

  .node-add-menu {
    width: 200px;

    .btn-add {
      background:#fff;
      padding: 15px;
    }
  }

  .menu-item-list {

    .menu-item-wrap {
      height: 50px;
    }

    .menu-item {
      width: 100%;
      box-sizing: border-box;
      padding: 15px;
      /*background: #26cb71;*/
      background: #fff;
      /*color: #fff;*/
      font-size: 13px;

      border-bottom: 1px solid #eee;

      cursor: hand;
      cursor: -webkit-grab;
      &:hover{
        background: lightgray;
      }
    }
  }
</style>
