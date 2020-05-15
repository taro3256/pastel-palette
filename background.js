chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "get"){
        sendResponse({url: localStorage["url"]});
        sendResponse({colors: localStorage["colors"]});
    } else {
        localStorage["url"] = request.url;
        localStorage["colors"] = request.colors;
        sendResponse({responce: "set finish!"});
    }
});