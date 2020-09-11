<template functional>
  <Submenu :name="props.menuInfo.name">
    <template slot="title">
      <Icon v-if="props.menuInfo.meta.icon" :type="props.menuInfo.meta.icon" :color="props.textColor"
            :size="props.rootIconSize"/>
      {{props.menuInfo.meta.title}}
    </template>
    <template v-for="item in props.menuInfo.children">
      <MenuItem v-if="!item.children||item.children.length===0" :name="item.name" :key="`menu-${item.name}`"
                @click.native="props.menuClickHandler(item.path)">
        <Icon v-if="item.meta.icon" :type="item.meta.icon" :color="textColor"/>
        {{item.meta.title}}
      </MenuItem>
      <SideMenuItem v-else :menu-info="item" :menu-click-handler="props.menuClickHandler" :key="`menu-${item.name}`"></SideMenuItem>
    </template>
  </Submenu>
</template>
<script>
  export default {
    name: 'SideMenuItem',
    props: {
      menuInfo: {
        type: Object,
        default: () => {
        }
      },
      textColor: {
        type: String
      },
      rootIconSize: {
        type: Number,
        default: 16
      },
      iconSize: {
        type: Number,
        default: 14
      },
      menuClickHandler: {
        type: Function,
        default: () => {}
      }
    }
  }
</script>
