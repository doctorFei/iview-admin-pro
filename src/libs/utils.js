import { deepClone } from './tool'

// 与项目有关的公共库
export const findNodeUpperByClasses = (ele, classes) => {
  const parentNode = ele.parentNode
  if (parentNode) {
    const classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

// 随机字符串
export const randomString = (len = 32) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const maxPos = chars.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

// 计算 offset 数值，如果传入了 ele 参数，则计算基于该 ele 的 offset
export const getOffset = (e, ele) => {
  const evt = e || window.event
  const srcObj = ele || evt.target || evt.srcElement
  return {
    offsetX: evt.clientX - srcObj.getBoundingClientRect().left,
    offsetY: evt.clientY - srcObj.getBoundingClientRect().top
  }
}

export const putFileInFolder = (folderList, fileList) => {
  const folderListCloned = deepClone(folderList)
  const fileListCloned = deepClone(fileList)
  return folderListCloned.map(folderItem => {
    const folderId = folderItem.id
    let index = fileListCloned.length
    while (--index >= 0) {
      const fileItem = fileListCloned[index]
      if (fileItem.folder_id === folderId) {
        const file = fileListCloned.splice(index, 1)[0]
        file.title = file.name
        if (folderItem.children) folderItem.children.push(file)
        else folderItem.children = [file]
      }
    }
    folderItem.type = 'folder'
    return folderItem
  })
}

export const transferFolderToTree = folderList => {
  if (!folderList.length) return []
  const folderListCloned = deepClone(folderList)
  const handle = id => {
    const arr = []
    folderListCloned.forEach(folder => {
      if (folder.folder_id === id) {
        const children = handle(folder.id)
        if (folder.children) folder.children = [].concat(folder.children, children)
        else folder.children = children
        folder.title = folder.name
        arr.push(folder)
      }
    })
    return arr
  }
  return handle(0)
}

export const expandSpecifiedFolder = (vm, folderTree, id) => {
  return folderTree.map(item => {
    if (item.type === 'folder') {
      if (item.id === id) {
        vm.$set(item, 'expand', true)
      } else {
        if (item.children && item.children.length) {
          item.children = expandSpecifiedFolder(vm, item.children, id)
          if (item.children.some(child => {
            return child.expand === true
          })) {
            vm.$set(item, 'expand', true)
          } else {
            vm.$set(item, 'expand', false)
          }
        }
      }
    }
    return item
  })
}

export const expandSpecifiedFile = (vm, folderTree, node) => {
  const parentNodeId = node.folder_id
  expandSpecifiedFolder(vm, folderTree, parentNodeId)
}
