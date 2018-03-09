/**
 * 判断是否为空对象
 * @param {Object} obj 
 */
function isEmptyObject(obj) {
  for (let t in obj)
    return !1;
  return !0
}

export default {
  isEmptyObject
}
