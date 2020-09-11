<template>
  <div class="component-drawer">
    <Button class="open-botton" icon="md-settings" @click="drawerShow = true" type="primary"></Button>
    <Drawer title="定制化" :closable="false" v-model="drawerShow">
      <div>
        <p>菜单风格定制</p>
        <RadioGroup
          :value="$route.query.navTheme||'light'"
          @on-change="(value)=>handleSettingChange('navTheme',value)"
        >
          <Radio label="dark">黑色</Radio>
          <Radio label="light">白色</Radio>
        </RadioGroup>
      </div>
    </Drawer>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      drawerShow: false
    }
  },
  methods: {
    handleSettingChange (type, value) {
      this.$router.push({
        query: {
          ...this.$route.query,
          [type]: value
        }
      })
    }
  }
}
</script>

<style scoped>
.open-botton {
  position: fixed;
  right: -4px;
  top: 45%;
}
</style>
