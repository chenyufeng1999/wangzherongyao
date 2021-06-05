function $(selector) {
  return document.querySelector(selector);
}
function $$(selector) {
  return document.querySelectorAll(selector);
}
/**
 * 完成该区域的轮播功能
 * 该函数需要实现手指滑动切换、自动切换
 * @param {HTMLElement} container 轮播容器
 * @param {Number} duration 自动切换的间隔时间，0表示不进行自动切换
 * @param {Function} callback 完成切换后需要调用的函数
 * @return {Function} 返回一个函数，调用函数，可以随意的切换显示的子项
 */
function createSlider(container, duration, callback) {
  var firstItem = container.querySelector(".slider-item");
  var cw = container.clientWidth; //容器宽度
  console.log(cw);
  var count = container.children.length; //轮播项的数量
  var current = 0; //记录当前显示的下标值
  /**
   * 切换到指定的子项
   * @param {Number} index 指定下标
   */
  function switchTo(index) {
    //判断index的取值范围
    if (index < 0) {
      //小于0回到第一个项
      index = 0;
    }
    if (index > count - 1) {
      //大于等于子项长度时回到最后一项
      index = count - 1;
    }
    current = index; //改变当前显示的索引
    //设置css样式过渡时间
    firstItem.style.transition = ".3s";
    //设置它的marginLeft为-xx容器宽度
    firstItem.style.marginLeft = -index * cw + "px";
    //切换后调用callback
    callback && callback(index);
  }
  //实现自动切换
  var timer=null; //自动切换的计时器
  //开始自动切换
  function startAuto() {
    if (timer || duration === 0) {
      //timer存在则已经有计时器了，防止重复启用
      //判断有无切换时间间隔，0则不自动切换
      return;
    }
    timer = setInterval(function () {
      switchTo((current + 1) % count); //切换到下一个项
      //console.log(1);
    }, duration);
  }
  //停止自动切换
  function stopAuto() {
    clearInterval(timer);
    timer=null;
  }
  startAuto(); //开始自动切换

  //手指滑动切换
  container.ontouchstart = function (e) {
    var x = e.touches[0].clientX; //记录按下的横坐标
    var mL = parseFloat(firstItem.style.marginLeft) || 0; //记录元素的当前marginLeft
    //console.log(x,mL);
    //停止自动切换
    stopAuto();
    firstItem.style.transition = "none";
    //手指移动
    container.ontouchmove = function (e) {
      var disX = e.touches[0].clientX - x; //记录手指移动的距离
      //console.log(disX);
      var newML = mL + disX;
      var minML = -(count - 1) * cw;
      if (newML < minML) {
        newML = minML;
      }
      if (newML > 0) {
        newML = 0;
      }
      //去掉游览器的默认行为
      e.preventDefault();
      firstItem.style.marginLeft = newML + "px";
    };
    //手指放开
    container.ontouchend = function (e) {
      var disX = e.changedTouches[0].clientX - x;
      //判断滑动方向
      if (disX < 0) {
        //向左滑动
        switchTo(current + 1);
      } else if (disX > 0) {
        switchTo(current - 1);
      }
      startAuto(); //开始自动切换
    };
  };

  return switchTo;
}

var dom1 = $(".banner .slider-container");
var goto = createSlider(dom1, 2000, function (index) {
  //将index个原点变为激活状态
  //console.log("任务完成", index);
});
