//菜单区域
(function(){
    var expand=$(".menu .expand");
    var menuList=$(".menu .menu-list");
    var isExpand=false;//判断是否为展开状态
    expand.onclick=function(){
        var txt=this.querySelector('.txt');
        var spr=this.querySelector('.spr');
        if(isExpand){
            //当前是展开状态
            txt.innerText="折叠";
            spr.classList.remove("spr_expand");
            spr.classList.add("spr_collapse");
            menuList.style.flexWrap="wrap";
        }else{
            //当前是折叠
            txt.innerText="展开"; 
            spr.classList.remove("spr_collapse");
            spr.classList.add("spr_expand");
            menuList.style.flexWrap="nowrap";
        }
        isExpand=!isExpand;//改变当前状态
    }
  })()