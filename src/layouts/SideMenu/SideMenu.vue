<template>
  <div class="component-side">
    <slot v-if="!collapsed"></slot>
    <Menu v-show="!collapsed" ref="menu" width="auto" :accordion="accordion" :active-name="activeName"
          :open-names="openedNames"
          :theme="theme">
      <template v-for="item in menuData">
        <MenuItem v-if="!item.children||item.children.length===0" :name="item.name" :key="`menu-${item.name}`"
                  @click.native="clickHandler(item.path)">
          <Icon v-if="item.meta.icon" :type="item.meta.icon" :color="textColor"/>
          {{item.meta.title}}
        </MenuItem>
        <SideMenuItem :textColor="textColor" v-else :menu-info="item" :menuClickHandler="clickHandler"
                      :key="`menu-${item.name}`"></SideMenuItem>
      </template>
    </Menu>
    <div class="menu-collapsed" v-show="collapsed">
      <template v-for="item in menuData">
        <collapsed-menu
          v-if="item.children && item.children.length > 0"
          @on-click="handleSelect"
          hide-title
          :textColor="textColor"
          :theme="theme"
          :parent-item="item"
          :key="`drop-menu-${item.name}`">
        </collapsed-menu>
      </template>
    </div>
  </div>
</template>

<script>
  import SideMenuItem from './SideMenuItem'
  import { getUnion } from '@/libs/tool'
  import CollapsedMenu from './CollapsedMenu'

  export default {
    name: 'SliderMenu',
    components: {
      SideMenuItem,
      CollapsedMenu
    },
    props: {
      theme: {
        type: String,
        default: 'dark'
      },
      menuData: {
        type: Array,
        default: () => []
      },
      activeName: {
        type: String,
        default: ''
      },
      accordion: {
        type: Boolean,
        default: true
      },
      openNames: {
        type: Array,
        default: () => []
      },
      collapsed: {
        type: Boolean
      },
      rootIconSize: {
        type: Number,
        default: 20
      },
      iconSize: {
        type: Number,
        default: 16
      }
    },
    data () {
      return {
        openedNames: []
      }
    },
    methods: {

      getOpenedNamesByActiveName (name) {
        return this.$route.matched.map(item => item.name).filter(item => !!item && item !== name)
      },
      handleSelect () {

      },
      clickHandler (path) {
        this.$router.push({
          path: path,
          query: this.$router.query
        })
      }
    },
    computed: {
      textColor () {
        return this.theme === 'dark' ? '#ffffff' : '#495060'
      }
    },
    watch: {
      activeName (name) {
        if (this.accordion) {
          this.openedNames = this.getOpenedNamesByActiveName(name)
        } else {
          this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
        }
      },
      openNames (newNames) {
        this.openedNames = newNames
      },
      openedNames () {
        this.$nextTick(() => {
          this.$refs.menu.updateOpened()
        })
      }
    },
    mounted () {
      this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(this.activeName))
    }
  }
</script>
<style lang="less">
  .component-side {
    .menu-collapsed {
      padding-top: 10px;
      .ivu-dropdown {
        width: 100%;
        .ivu-dropdown-rel a {
          width: 100%;
        }
      }
    }
    .ivu-menu-vertical.ivu-menu-light:after {
      content: '';
      display: block;
      width: 0px;
      height: 100%;
      background: #dcdee2;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      z-index: 1;
    }
  }

</style>
