<template>
  <Dropdown
    ref="dropdown"
    stop-propagation
    :class="[`dropdown-${theme}`,'dropdown']"
    :transfer="hideTitle"
    :placement="placement"
    @on-click="handleClick"
   >
    <a class="drop-menu-a"
       href="javascript:void(0)"
       type="text"
       :class="{'root-menu':hideTitle,'child-menu':!hideTitle}"
       :style="{'color':textColor,textAlign:hideTitle?'center':'left'}"
       @mouseover="handleMousemove($event, parentItem.children)">
      <Icon v-if="parentItem.meta.icon&&hideTitle"
            :type="parentItem.meta.icon"
            :size="rootIconSize"/>
      <span class="menu-title" v-if="!hideTitle">{{ parentItem.meta.title }}</span>
      <Icon style="margin-left: 4px" v-if="!hideTitle" type="ios-arrow-forward" :size="16"/>
    </a>
    <DropdownMenu :class="[`dropdown-menu-${theme}`,'dropdown-menu']" ref="dropdown-menu" slot="list">
      <template v-for="child in parentItem.children">
        <collapsed-menu
          v-if="child.children && child.children.length > 0"
          :textColor="textColor"
          :theme="theme"
          :parent-item="child"
          :key="`drop-${child.name}`">
        </collapsed-menu>
        <DropdownItem v-else :key="`drop-${child.name}`" :name="child.name" @click.native="$router.push({path:child.path,query:$router.query})">
          <Icon v-if="child.meta.icon" :type="child.meta.icon" :color="textColor" :size="iconSize"/>
          <span class="menu-title">{{child.meta.title}}</span>
        </DropdownItem>
      </template>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
  import { findNodeUpperByClasses } from '@/libs/utils'

  export default {
    name: 'CollapsedMenu',
    props: {
      hideTitle: {
        type: Boolean,
        default: false
      },
      rootIconSize: {
        type: Number,
        default: 20
      },
      iconSize: {
        type: Number,
        default: 16
      },
      parentItem: {
        type: Object,
        default: () => {
        }
      },
      textColor: String,
      theme: String
    },
    data () {
      return {
        placement: 'right-end'
      }
    },
    methods: {
      handleClick (name) {
        this.$emit('on-click', name)
      },
      handleMousemove (event, children) {
        const { pageY } = event
        const height = children.length * 38
        const isOverflow = pageY + height < window.innerHeight
        this.placement = isOverflow ? 'right-start' : 'right-end'
      }
    },
    watch: {
      theme: {
        handler (value) {
          if (value === 'dark') {
            this.$nextTick(() => {
              this.$refs['dropdown-menu'].$el.parentNode.style.background = '#515a6e'
            })
          } else {
            this.$nextTick(() => {
              this.$refs['dropdown-menu'].$el.parentNode.style.background = '#ffffff'
            })
          }
        },
        immediate: true
      }
    },
    mounted () {
      const dropdown = findNodeUpperByClasses(this.$refs.dropdown.$el, ['ivu-select-dropdown', 'ivu-dropdown-transfer'])
      if (dropdown) dropdown.style.overflow = 'visible'
    }
  }
</script>
<style lang="less">
  .dropdown-menu {
    .ivu-dropdown {
      width: 100%;
    }
  }
  a.drop-menu-a {
    padding: 7px 16px;
    width: 100%;
    display: block;
  }

  .dropdown-menu-dark {
    .ivu-dropdown-item {
      color: #ffffff;
      &:hover {
        background: #2d8cf0 !important;
      }
    }
  }

  .dropdown-dark{
    .child-menu{
      &:hover {
        background: #2d8cf0 !important;
      }
    }
  }
  .dropdown-light{
    .child-menu{
      &:hover {
        background: #f3f3f3 !important;
      }
    }
  }
</style>
