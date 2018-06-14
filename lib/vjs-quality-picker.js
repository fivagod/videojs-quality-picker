import QualityPickerButton from './quality-picker-button';

function qualityPickerPlugin() {
    var player = this;

    let SUPPORTED_TRACKS = ["video", "audio", "subtitle"];
    var TRACK_CLASS = {
        video: 'vjs-menu-button-levels',
        audio: 'vjs-icon-cog',
        subtitle: 'vjs-icon-subtitles'
    };

    // On later versions `player.tech` is undefined before this...
    if (player.tech_) {
      player.tech_.on('loadedqualitydata', onQualityData);
    } else {
      player.ready(function () {
        player.tech_.on('loadedqualitydata', onQualityData);
      }, true);
    }

    function onQualityData(event, {qualityData, qualitySwitchCallback}) {
        var fullscreenToggle = player.controlBar.getChild('fullscreenToggle');
        player.controlBar.removeChild(fullscreenToggle);

        for (var i=0; i < SUPPORTED_TRACKS.length; i++) {
            var track = SUPPORTED_TRACKS[i];
            var name = track + "PickerButton";
            // videojs.utils.toTitleCase
            name = name.charAt(0).toUpperCase() + name.slice(1);

            var qualityPickerButton = player.controlBar.getChild(name);
            if (qualityPickerButton) {
                qualityPickerButton.dispose();
                player.controlBar.removeChild(qualityPickerButton);
            }

            if (qualityData[track] && qualityData[track].length > 1) {
                qualityPickerButton = new QualityPickerButton(player, {name, qualityList: qualityData[track], qualitySwitchCallback, trackType: track});
                qualityPickerButton.addClass(TRACK_CLASS[track]);
                qualityPickerButton.on('touchstart', function(){
                  var menu = this.el_.getElementsByClassName('vjs-menu')[0];
                  menu.style.display = (menu.style.display == 'block') ? 'none' : 'block';
                })

                player.controlBar.addChild(qualityPickerButton);
            }
        }
        player.tech_.on('hlslevelloaded', function(e, data){
          if(!player.controlBar.getChild('videoPickerButton')) {
            return;
          }
          var menuItems = player.controlBar.getChild('videoPickerButton').menu.children_;
          for(var i in menuItems){
            if(menuItems[i].options_.id == data.level) {
              menuItems[i].addClass('vjs-hls-active');
            } else {
              menuItems[i].removeClass('vjs-hls-active');
            }
          }
        })

        if (fullscreenToggle) {
            player.controlBar.addChild(fullscreenToggle);
        }
    }
}

var registerPlugin = videojs.registerPlugin || videojs.plugin;

registerPlugin('qualityPickerPlugin', qualityPickerPlugin);
