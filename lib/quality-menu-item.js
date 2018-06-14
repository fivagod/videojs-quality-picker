const VjsMenuItem = videojs.getComponent('MenuItem');

class QualityMenuItem extends VjsMenuItem {
    handleClick(e) {
        super.handleClick();

        var cur = (this.el_ == e.target) ? e.target : e.target.parentNode;
        var li = cur.parentNode.getElementsByTagName('li');
        for(var i in li){
          if(li[i].classList) {
            li[i].classList.remove('vjs-selected');
            li[i].classList.remove('vjs-hls-active');
          }
        }
        cur.classList.add('vjs-selected');
        if(e.type == 'tap') {
          var menu = cur.parentNode.parentNode;
          menu.classList.remove('vjs-lock-showing');
          menu.style.display='none';
        }

        this.options_.qualitySwitchCallback(this.options_.id, this.options_.trackType);
    }
}

export default QualityMenuItem;
