var needsReload = true;
window.onfocus=function(){
  needsReload = true;
}
window.onblur=function(){
  needsReload = false;
}

let interval = setInterval(function(){
    if(needsReload){
        console.log("run content.js");
        let flag_load_complete = 0;
        let page_url;
        let colors = [];
        let color_sets = [];

        if (location.hostname == "stylifyme.com") {
            colors = $(".swatch-holder");
        } else {
            page_url = location.href;
        }

        let get_interval = setInterval(function() {
            // stylifyme.comを開いている時に色を抽出する
            if (location.hostname == "stylifyme.com") {
                if (!flag_load_complete) {
                    if (colors[0].style.backgroundColor){
                        console.log(colors);
                        for (i=0; i<colors.length; i++){
                            console.log(colors[i].style.backgroundColor);
                        }
                        flag_load_complete = 1
                    }   
                    colors = $(".swatch-holder");
                } else {

                    color_sets = [];
                    for (j=0; j<8; j++){
                        bg = colors[j].style.backgroundColor;
                        text = colors[8+j].style.backgroundColor;
                        color_sets.push({bg: bg, text: text});
                    }

                    chrome.runtime.sendMessage({method: "get"},function(response) {
                        if(response.url){
                            page_url = response.url;
                        } else {
                            console.log(1);
                            page_url = [];
                        }

                        chrome.runtime.sendMessage({url: page_url, colors: JSON.stringify(color_sets)}, function(response) {
                            if(response.responce){
                                console.log("color_sets: ", response.responce);
                            }
                        });
                    });
                }
            // 開いているページのURLを取得する
            } else {
                page_url = location.href;

                chrome.runtime.sendMessage({method: "get"},function(response) {
                    if(response.colors){
                        color_sets = JSON.parse(response.colors);
                    } else {
                        color_sets = [];
                    }

                    if (response.url !== page_url) {
                        chrome.runtime.sendMessage({url: page_url, colors: JSON.stringify(color_sets)}, function(response) {
                            if(response.responce){
                                console.log("page_url: ", response.responce);
                            }
                        });
                    }
                });
                clearInterval(interval);
                clearInterval(get_interval);
            }
        }, 1000);
    }
}, 1000);