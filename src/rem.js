export default (function (doc, win, undefined) {
  return function (rem_base) {
    var docEl = doc.documentElement
      var resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize'
      var recalc = function () {
        var clientWidth = docEl.clientWidth
        if (clientWidth === undefined) return
        docEl.style.fontSize = 20 * (clientWidth / rem_base) + 'px'
      }
    if (doc.addEventListener === undefined) return
    win.addEventListener(resizeEvt, recalc, false)
    doc.addEventListener('DOMContentLoaded', recalc, false)
  }
})(document, window)
