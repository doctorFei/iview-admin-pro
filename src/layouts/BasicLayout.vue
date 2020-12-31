<template>
  <Layout
    :class="[`nav-theme-${navTheme}`, `nav-layout-${navLayout}`]"
    style="height: 100%"
  >
    <Sider
      ref="side"
      class="side-wrap"
      v-if="navLayout === 'left'"
      hide-trigger
      :width="256"
      :collapsed-width="64"
      collapsible
      v-model="isCollapsed"
    >
      <side-menu
        :theme="navTheme"
        :menuData="menuData"
        :collapsed="isCollapsed"
        :activeName="$route.name"
      >
        <p class="slider-title">iview-admin-pro</p>
      </side-menu>
    </Sider>
    <Layout>
      <Header
        class="layout-header-bar flex items-center"
        style="padding-left: 0; display: flex"
      >
        <Icon
          @click.native="collapsedSider"
          style="cursor: pointer"
          v-if="navLayout === 'left'"
          :class="rotateIcon"
          :style="{ margin: '0 20px' }"
          type="md-menu"
          size="24"
        />
        <MyHeader />
      </Header>
      <Content class="content-con">
        <Tabs
          @on-click="handleClickTab"
          type="card"
          :value="getTabNameByRoute($route)"
        >
          <TabPane
            :label="labelRender(item)"
            :name="getTabNameByRoute(item)"
            v-for="(item, index) in tabList"
            :key="`tabNav${index}`"
          ></TabPane>
        </Tabs>
        <router-view style="background: #ffffff; padding: 20px"></router-view>
      </Content>
    </Layout>
    <SettingDrawer />
  </Layout>
</template>

<script>
import MyHeader from '@/layouts/Header'
import SideMenu from '@/layouts/SideMenu/SideMenu'
import SettingDrawer from '_c/SettingDrawer'
import { mapState, mapMutations, mapActions } from 'vuex'
import { getTabNameByRoute, getRouteById } from '@/libs/utils'

export default {
  name: 'BasicLayout',
  components: {
    MyHeader,
    SideMenu,
    SettingDrawer
  },
  mounted () {
    this.$nextTick(() => {
      const _this = this
      if (document.documentElement.clientWidth <= 1366) {
        // html标签
        _this.isCollapsed = true
      }
    })
  },
  data () {
    return {
      isCollapsed: false, // 收缩属性
      menuData: null,
      getTabNameByRoute
    }
  },
  computed: {
    ...mapState({
      routes: (state) => state.permission.routes,
      tabList: (state) => state.tabNav.tabList
    }),
    rotateIcon () {
      return ['menu-icon', this.isCollapsed ? 'rotate-icon' : '']
    },
    navTheme () {
      return this.$route.query.navTheme || 'dark'
    },
    navLayout () {
      return this.$route.query.navLayout || 'left'
    }
  },
  watch: {
    routes: {
      handler (v) {
        this.menuData = this.getMenuData(v)
      },
      deep: true,
      immediate: true
    },
    $route: {
      handler (v) {
        this.UPDATE_ROUTER(v)
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations(['UPDATE_ROUTER']),
    ...mapActions(['handleRemove']),
    collapsedSider () {
      this.$refs.side.toggleCollapse()
    },
    getMenuData (routes) {
      const menuData = []
      !!routes &&
        routes.forEach((item) => {
          // 有name
          if (item.name && !item.hideInMenu) {
            const newItem = { ...item }
            delete newItem.children
            if (!item.hideChildrenMenu) {
              newItem.children = this.getMenuData(item.children)
            }
            menuData.push(newItem)
          } else if (
            !item.hideInMenu &&
            !item.hideChildrenMenu &&
            item.children
          ) {
            menuData.push(...this.getMenuData(item.children))
          }
        })
      return menuData
    },
    handleClickTab (id) {
      const route = getRouteById(id)
      this.$router.push(route)
    },
    handleTabRemove (id, event) {
      event.stopPropagation()
      this.handleRemove({
        id,
        $route: this.$route
      }).then((nextRoute) => {
        this.$router.push(nextRoute)
      })
    },
    labelRender (item) {
      return (h) => {
        return (
          <div>
            <span>{item.meta.title}</span>
            <icon
              nativeOn-click={this.handleTabRemove.bind(
                this,
                getTabNameByRoute(item)
              )}
              type="md-close-circle"
              style="line-height:10px;"
            ></icon>
          </div>
        )
      }
    }
  }
}
</script>

<style scoped lang="less">
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.menu-icon {
  transition: all 0.3s;
}

.rotate-icon {
  transform: rotate(-90deg);
}

.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}

.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}

.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}

.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}

.slider-title {
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-size: 24px;
  color: #2d8cf0 !important;
}

.nav-theme-light {
  .side-wrap {
    background: #ffffff;
  }
}

.nav-theme-dark {
  .slider-title {
    color: #ffffff;
  }
}
</style>
<style lang="less">
.nav-theme-light {
  .side-wrap {
    background: #ffffff;
    .slider-title {
      color: #000;
    }
  }
}

.nav-theme-dark {
  .side-wrap {
    background: #515a6e;
    .slider-title {
      color: #ffffff;
    }
  }
}
.content-con {
  padding: 0;
  .ivu-tabs-bar {
    margin-bottom: 0;
  }
  .view-box {
    padding: 0;
  }
}
</style>
