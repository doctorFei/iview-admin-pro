/**
 * hideInMenu:不显示当前路由到menu上
 * hideChildrenMenu:不显示当前子路由到menu上
 *
 * 建议：sider menu 请不要超过三级菜单，若超过三级菜单，则应该设计为顶部主菜单 配合左侧次级菜单
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    hideInMenu: true,
    component: () => import('../layouts/UserLayout')
  }
]

export const asyncRoutes = [
  {
    path: '/',
    component: () => import('../layouts/BasicLayout'),
    children: [
      {
        path: '/',
        redirect: '/table/drag-table'
      },
      {
        path: '/table',
        name: 'table',
        meta: {
          title: '表格',
          icon: 'md-grid'
        },
        component: { render: h => h('router-view') },
        children: [
          {
            path: '/table/drag-table',
            name: 'dragTable',
            meta: {
              title: '可拖拽表格'
            },
            component: () => import('../views/Table/DragTable')
          },
          {
            path: '/table/echo-table',
            name: 'echoTable',
            meta: {
              title: '多选回显表格'
            },
            component: () => import('../views/Table/EchoTable')
          },
          {
            path: '/table/single-select-table',
            name: 'singleSelectTable',
            meta: {
              title: '单选表格'
            },
            component: () => import('../views/Table/SingleSelectTable')
          },
          {
            path: '/table/row-edit-table',
            name: 'rowEditTable',
            meta: {
              title: '行编辑表格'
            },
            component: () => import('../views/Table/RowEditTable')
          },
          {
            path: '/table/edit-table',
            name: 'editTable',
            meta: {
              title: '单单元格编辑表格'
            },
            component: () => import('../views/Table/EditTable')
          },
          {
            path: '/table/edit-table-muti',
            name: 'editTableMuti',
            meta: {
              title: '多单元格编辑表格'
            },
            component: () => import('../views/Table/EditTableMuti')
          }
        ]
      },
      {
        path: '/upload',
        name: 'upload',
        meta: {
          title: '文件上传',
          icon: 'md-list'
        },
        component: { render: h => h('router-view') },
        children: [
          {
            path: '/upload/burst',
            name: 'uploadBurst',
            meta: {
              title: '分片上传'
            },
            component: () => import('../views/Upload/index')
          }
        ]
      },
      {
        path: '/tree',
        name: 'tree',
        meta: {
          title: '目录树',
          icon: 'ios-git-branch'
        },
        component: { render: h => h('router-view') },
        children: [
          {
            path: '/tree/common',
            name: 'common',
            meta: {
              title: '通用目录树'
            },
            component: () => import('../views/Tree/common-tree')
          }, {
            path: '/tree/folder',
            name: 'folderTree',
            meta: {
              title: '可操作目录树'
            },
            component: () => import('../views/Tree/folder-tree')
          },
          {
            path: '/tree/doc',
            name: 'docTree',
            meta: {
              title: '文档目录树'
            },
            component: () => import('../views/Tree/doc-tree')
          }
        ]
      },
      {
        path: '/form',
        name: 'form',
        meta: {
          title: '表单',
          icon: 'ios-paper-outline',
          roles: ['admin', 'editor']
        },
        component: {
          render: (h) => h('router-view')
        },
        children: [
          {
            path: '/form/index',
            name: 'form-index',
            meta: {
              title: '表单验证',
              roles: ['admin', 'editor']
            },
            component: () => import('../views/Form/form-index')
          },
          {
            path: '/form/group',
            name: 'form-group',
            meta: {
              title: '动态表单',
              roles: ['admin', 'editor']
            },
            component: () => import('../views/Form/form-group')
          }
        ]
      },
      {
        path: '/editor',
        name: 'editor',
        meta: {
          title: '图形编辑',
          icon: 'ios-git-merge',
          roles: ['admin', 'editor']
        },
        component: { render: h => h('router-view') },
        children: [
          {
            path: '/editor/tinymce',
            name: 'tinymce',
            meta: {
              title: '富文本',
              roles: ['admin', 'editor']
            },
            component: () => import('../views/Editor/tinymce')
          },
          // {
          //   path: '/editor/atlas',
          //   name: 'atlas',
          //   meta: {
          //     title: '知识图谱',
          //     roles: ['admin', 'editor']
          //   },
          //   component: () => import('../views/Editor/Atlas')
          // },
          {
            path: '/editor/flow',
            name: 'flow',
            meta: {
              title: '流程图',
              roles: ['admin']
            },
            component: () => import('../views/Editor/Flow')
          },
          {
            path: '/editor/identification',
            name: 'identification',
            meta: {
              title: '物品识别',
              roles: ['admin']
            },
            component: () => import('../views/Editor/identification')
          }
        ]
      }
    ]
  }
]
