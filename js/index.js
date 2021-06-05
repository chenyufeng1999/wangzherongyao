/**
 * 完成该区域的轮播功能
 * 该函数需要实现手指滑动切换、自动切换
 * @param {HTMLElement} container 轮播容器
 * @param {Number} duration 自动切换的间隔时间，0表示不进行自动切换
 * @param {Function} callback 完成切换后需要调用的函数
 * @return {Function} 返回一个函数，调用函数，可以随意的切换显示的子项
 */
function $(selector) {
  return document.querySelector(selector);
}
function $$(selector) {
  return document.querySelectorAll(selector);
}
function createSlider(container, duration, callback) {
  var firstItem = container.querySelector(".slider-item");
  var cw = container.clientWidth; //容器宽度
  //console.log(cw);
  var count = container.children.length; //轮播项的数量
  var current = 0; //记录当前显示的下标值
  /**
   * 设置容器高度当前显示子元素高度
   */
  function setHeight() {
    var h = container.children[current].offsetHeight;
    container.style.height = h + "px";
  }
  setHeight();
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
    setHeight(); //重置高度
    //切换后调用callback
    callback && callback(index);
  }
  //实现自动切换
  var timer = null; //自动切换的计时器
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
    timer = null;
  }
  startAuto(); //开始自动切换

  //手指滑动切换
  container.ontouchstart = function (e) {
    var x = e.touches[0].clientX; //记录按下的横坐标
    var y = e.touches[0].clientY;
    var mL = parseFloat(firstItem.style.marginLeft) || 0; //记录元素的当前marginLeft
    //console.log(x,mL);
    //停止自动切换
    stopAuto();
    firstItem.style.transition = "none";
    //手指移动
    container.ontouchmove = function (e) {
      var disX = e.touches[0].clientX - x; //记录手指移动的距离
      var disY = e.touches[0].clientX - y;
      //console.log(disX);
       //只有横向的移动距离大于纵向的移动距离则去掉默认行为
       if(Math.abs(disX)<Math.abs(disY)){
        return;
      }
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
/**
 * 进一步封装板块功能
 * @param {HTMLElement} blockContainer
 */
function createBlock(blockContainer) {
  var sliderContainer = blockContainer.querySelector(".slider-container");
  //菜单容器
  var blockMenu = blockContainer.querySelector(".block-menu");
  // 创建滚动区域
  //定义一个变量goto接收该函数的返回值
  var goto = createSlider(sliderContainer, 0, function (index) {
    //干掉之前的状态
    var ac = blockMenu.querySelector(".active");
    ac && ac.classList.remove("active");
    //给新的索引对应的子元素加上类样式
    blockMenu.children[index].classList.add("active");
  });
  // 给菜单注册点击事件
  for (let i = 0; i < blockMenu.children.length; i++) {
    blockMenu.children[i].onclick = function () {
      goto(i);
    };
  }
}

(function () {
  //导航栏区域
  var nav=$(".nav");
  //console.log(nav);
  for(let i=0;i<nav.children.length;i++){
    nav.children[i].onclick=function(){
      var navCurrent=nav.querySelector(".active");
      navCurrent&&navCurrent.classList.remove("active");
      nav.children[i].classList.add("active");
    }
  }
  var sliderContainer = $(".banner .slider-container");
  var dots = $(".banner .dots");
  createSlider(sliderContainer, 3000, function (index) {
    //得到之前的active
    var ac = dots.querySelector(".active");
    //存在且移除
    ac && ac.classList.remove("active");
    dots.children[index].classList.add("active");
  });

  var newSliderContainer = $(".news-list .slider-container");
  (async function () {
    // 此代码运行后，变量resp中就保存了获取到的数据
    //通过网络去拿文件的数据，把拿到的数据放到变量中
    var resp = await fetch("./data/news.json").then(function (resp) {
      return resp.json();
    });
    //console.log(resp);
    //生成新闻的元素
    for (var key in resp) {
      var news = resp[key];
      //console.log(news);
      //生成一个slider-item
      var div = document.createElement("div");
      div.classList.add("slider-item");
      var html = news
        .map(function (item) {
          //item 每一个新闻对象
          // return `<div class="news-item ${item.type}">
          //             <a href="${item.link}">${item.title}</a>
          //             <span>${item.pubDate}</span>
          //         </div>`;
          return `<div class="news-item ${item.type}">
             <a href="${item.link}">${item.title}</a>
             <span>${item.pubDate}</span>        
        </div>`;
        })
        .join("");
      //console.log(html);
      div.innerHTML = html;
      newSliderContainer.appendChild(div);
    }
    //新闻区域
    createBlock($(".news-list"));
  })();
  //英雄区域
  var heroSliderContainer = $(".hero-list .slider-container");
  (async function () {
    var resp = await fetch("./data/hero.json").then(function (resp) {
      return resp.json();
    });
    //console.log(resp);
    //创建热门英雄
    createSliderItem(
      resp.filter(function (item) {
        return item.hot === 1;
      })
    );
    for (var i = 1; i <= 6; i++) {
      createSliderItem(
        resp.filter(function (item) {
          return item.hero_type === i || item.hero_type === i;
        })
      );
    }
    function createSliderItem(heros) {
      //console.log(heros);
      var div = document.createElement("div");
      div.className = "slider-item";
      var html = heros
        .map(function (item) {
          return `<a>
         <img src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${item.ename}/${item.ename}.jpg" />
         <span>${item.cname}</span>
        </a>`;
        })
        .join("");
      div.innerHTML = html;
      heroSliderContainer.appendChild(div);
    }
    createBlock($(".hero-list"));
  })();
  //视频区域
  var videoSliderContainer = $(".video-list .slider-container");
  //console.log(videoSliderContainer);
  (async function () {
    var resp = await fetch("./data/video.json").then(function (resp) {
      return resp.json();
    });
    for (var key in resp) {
      var videos = resp[key];
      //生成一个slider-item
      var div = document.createElement("div");
      div.classList.add("slider-item");
      var html = videos
        .map(function (item) {
          //item 每一个新闻对象
          return `<a href="${item.link}">
        <img src="${item.cover}" alt="">
        <div class="title">
          ${item.title}
        </div>
        <div class="aside">
          <div class="play">
            <span class="spr spr_videonum"></span>
            <span>${item.playNumber}</span>
          </div>
          <div class="time">${item.pubDate}</div>
        </div>
      </a>`;
        })
        .join("");
      //console.log(html);
      div.innerHTML = html;
      videoSliderContainer.appendChild(div);
    }
    //console.log(resp);
    createBlock($(".video-list"));
  })();
})();
