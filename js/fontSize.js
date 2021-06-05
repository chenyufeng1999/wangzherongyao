(function () {
  //console.log(1);
  function setFontSize() {
    var designWidth = 750; //移动端设计稿宽度通常为750px
    //设计根元素大小=移动端设备宽度/设计稿宽度*100
    document.documentElement.style.fontSize =
      (document.documentElement.clientWidth / designWidth) * 100 + "px";
  }
  setFontSize();
  window.addEventListener("resize", setFontSize);
})();
