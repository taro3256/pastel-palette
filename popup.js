let page_url = localStorage.getItem('url');
$("#browse-page-url").append("http://stylifyme.com/?stylify=" + page_url);
$("#browse-page-url").attr("href", "http://stylifyme.com/?stylify=" + page_url);

let colors = JSON.parse(localStorage.getItem('colors'));
$("#colors").append(colors)[0]["bg"];


// アクティブなタブからリンクへ飛ぶようにする
let anchors = document.body.querySelectorAll('a');
for (let i = 0; i < anchors.length; i++) {
    anchors[i].onclick = () => {
        openAnchor(anchors[i]);
    };
}
function openAnchor(anchor) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabID = tabs[0].id;
        if (tabID === undefined) {
            return;
        }
        chrome.tabs.executeScript(tabID, {
            code: `window.location.href="${anchor.href}";`
        }, console.log);
    });
}