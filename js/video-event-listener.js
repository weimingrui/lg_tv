/**
 * Created by mingruiwei on 2016/8/9.
 */
var videoPlayer=function(){

    var _videoTimeUpdate_Timer=null;
    var _current_time=0;
    var _stable_indicator_count = 0;
    var _isBuffering=false;
    var _pageName='live';
    var _videoTitle='';
    var logM=function(str){
        console.log(str);
    }
    this.setVieoTitle=function(title){
        _videoTitle=title;
    };
    this.setCurrentPage=function(name){
        _pageName=name;
    };
    var getVideoTitle = function(){
        return _videoTitle;
    };
    this.setVideoSrc=function(src){
        videoObj.src=src;
    };
    this.reSetVideo=function(){
        if(_videoTimeUpdate_Timer){
            window.clearTimeout(_videoTimeUpdate_Timer);
            _videoTimeUpdate_Timer=null;
        }
        var _current_time=0;
        var _stable_indicator_count = 0;
    }
    this.addVideoEventListener=function(){
        videoObj.addEventListener('ended', function(){
            if(_pageName=='vod'){
                if (mediaObj.meta == 1 || mediaObj.meta == 6 || urlPos == mediaObj.urls.length - 1) {
                    savePlayRecord();
                    window.history.go(-1);
                } else if (urlPos < mediaObj.urls.length - 1) {
                    urlPos++;
                    showLoadBox();
                    videoLoad();
                }
            }
            logM("--listening video ended--");
        });
        videoObj.addEventListener('playing', function(){
            logM("--listening video playing--");
        });
        videoObj.addEventListener('error', function(e){
            logM("--listening video error--");
            PostMessageToServer.completeEventTracking("Video","error",50, getVideoTitle());
            if (Boolean(videoObj.error)) {
                switch (videoObj.error.code) {
                    case 1:
//							DialogUtil.showToast("媒体资源获取异常");
                        break;
                    case 2:
                        DialogUtil.showToast("网络错误");
                        break;
                    case 3:
                        DialogUtil.showToast("媒体解码错误");
                        break;
                    case 4:
                        DialogUtil.showToast("视频格式不支持");
                        break;
                }
            }
            switch (videoObj.networkState) {
                case videoObj.NETWORK_EMPTY:
                    DialogUtil.showToast("尚未初始化");
                    break;
                case videoObj.NETWORK_IDLE:
                    console.log("加载完成，网络空闲");
                    break;
                case videoObj.NETWORK_LOADING:
                    console.log("视频加载中");
                    break;
                case videoObj.NETWORK_NO_SOURCE:
                    //DialogUtil.showToast("加载失败");
                    break;
            }
        });
        videoObj.addEventListener('pause', function(){
            //draw a play button
            logM("--listening video pause--");
        });
        videoObj.addEventListener('play', function(){
            logM("--listening video play--");
        });
        videoObj.addEventListener('canplaythrough', function(){
            logM("--listening video canplaythrough--");
            $(".loadBox").hide();
            if(_pageName=='vod'){
                if (watchDuration != -1) {
                    window.setTimeout(function() {
                        subscribeBoxObj.show();
                    }, watchDuration * 1e3);
                } else if (playTime > 0) videoObj.currentTime = playTime;
            }
            PostMessageToServer.videoBufferTime(PlayrecordUtil.getVideoBufferTime(),getVideoTitle());
        });
        videoObj.addEventListener('loadstart', function(){
            logM("--video start loading-- ")
            $(".loadBox").show();
            PlayrecordUtil.setVideoStartBufferTime();
            PostMessageToServer.completeEventTracking("Video","play",50, getVideoTitle());
        });
        videoObj.addEventListener('seeked', function(){
            logM("--listening video seeked--");
            $(".loadBox").hide();
            PostMessageToServer.videoBufferTime(PlayrecordUtil.getVideoBufferTime(),getVideoTitle());
            _current_time = videoObj.currentTime;
        });
        videoObj.addEventListener('seeking', function(){
            logM("--listening video seeking--");
            if(!videoObj.paused){
                PlayrecordUtil.setVideoStartBufferTime();
                $(".loadBox").show();
            }
        });
        videoObj.addEventListener('stalled', function(){
            logM("--listening video stalled--");
            PlayrecordUtil.setVideoStartBufferTime();
            $(".loadBox").show();
            PostMessageToServer.completeEventTracking("Video","stalled",30, getVideoTitle());
        });
        videoObj.addEventListener('timeupdate', function(){
            //logM("--listening video timeupdate--");
            if(_videoTimeUpdate_Timer){
                window.clearTimeout(_videoTimeUpdate_Timer);
                _videoTimeUpdate_Timer = null;
            }
            _videoTimeUpdate_Timer = window.setTimeout(function(){
                if(!videoObj.paused){
                    PlayrecordUtil.setVideoStartBufferTime();
                    $(".loadBox").show();
                }
            }, 2700);
            if(videoObj.currentTime <= _current_time){
                _current_time = videoObj.currentTime;
                _stable_indicator_count = 0;
                if(!_isBuffering){
                    _isBuffering = true;
                    if(!videoObj.paused){
                        PlayrecordUtil.setVideoStartBufferTime();
                        $(".loadBox").show();
                        logM('start spin because currenttime stops');
                    }
                }
            }else{
                _current_time = videoObj.currentTime;
                if(_isBuffering){
                    if(_stable_indicator_count > 2){
                        _stable_indicator_count = 0;
                        _isBuffering = false;
                        $(".loadBox").hide();
                        PostMessageToServer.videoBufferTime(PlayrecordUtil.getVideoBufferTime(),getVideoTitle());
                    }else{
                        _stable_indicator_count++;
                    }
                }else{
                    $(".loadBox").hide();
                    PostMessageToServer.videoBufferTime(PlayrecordUtil.getVideoBufferTime(),getVideoTitle());
                }
            }
            if(_pageName=='vod'){
                $(".currentTimeAndDuration").text(ToolsUtil.formatTime(videoObj.currentTime) + " / " + ToolsUtil.formatTime(videoObj.duration));
            }
        });
        videoObj.addEventListener('waiting', function(){
            logM("--listening video waiting--");
            PlayrecordUtil.setVideoStartBufferTime();
            $(".loadBox").show();
        });
    };
}
