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
