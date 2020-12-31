// 与项目无关的公共库
/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * 深拷贝
 * @param originData
 * @returns {Object}
 */
export const deepClone = (originData) => {
  if (typeof originData !== 'object' || !originData) {
    return originData
  }
  const result = Object.prototype.toString.call(originData) === '[object Array]' ? [] : {}
  for (const key in originData) {
    if (typeof originData[key] === 'object') {
      result[key] = deepClone(originData[key])
    } else {
      result[key] = originData[key]
    }
  }
  return result
}
/*
  * @desc 生成指定长度的随机字符串
  * @param len
  * @returns {string}
  */
export const randomString = (len = 32) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

  const maxPos = chars.length

  let str = ''

  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos))
  }

  return str
}
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  else return !keysArr1.some(key => obj1[key] !== obj2[key])
}
