export default {
  state: {
    nodeSelected: null,

    nodeDrag: null,

    linkSelected: null,

    linkMenuData: {
      show: false,
      left: 0,
      top: 0,
      link: null
    },

    nodeMenuData: {
      show: false,
      left: 0,
      top: 0,
      node: null
    }

  },
  mutations: {
    setNodeSelected (state, node) {
      state.nodeSelected = node
    },

    setNodeDrag (state, node) {
      state.nodeDrag = node
    },

    setLinkSelected (state, link) {
      state.linkSelected = link
    },

    setLinkMenuData (state, menuData) {
      state.linkMenuData = menuData
    },

    setNodeMenuData (state, menuData) {
      state.nodeMenuData = menuData
    }
  }
}
