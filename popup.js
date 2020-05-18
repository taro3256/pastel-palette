let page_url = localStorage.getItem('url');
$("#browse-page-url").append(page_url);
$("#browse-page-url").attr("href", "http://stylifyme.com/?stylify=" + page_url);

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

// カラーコードをRGBからHEXに変換
function rgb2Hex(rgb){
    if (rgb){
        rgb = rgb.replace("rgb(", "");
        rgb = rgb.replace(")", "");
        rgb = rgb.split(',');
        rgb = rgb.map(str => parseInt(str, 10));

        return "#" + rgb.map(function(value) {
            return ("0" + value.toString(16)).slice(-2) ;
        }).join("");
    } else {
        return "#ffffff";
    }
}

// クリップボードにコピー
function copyTextToClipboard(text_val){
    console.log(text_val+"をコピーしました");
    // テキストエリアを用意する
    let copy_from = document.createElement("textarea");
    // テキストエリアへ値をセット
    copy_from.textContent = text_val;
   
    // bodyタグの要素を取得
    let body_elm = document.getElementsByTagName("body")[0];
    // 子要素にテキストエリアを配置
    body_elm.appendChild(copy_from);

    // テキストエリアの値を選択
    copy_from.select();
    // コピーコマンド発行
    let ret_val = document.execCommand('copy');
    // 追加テキストエリアを削除
    body_elm.removeChild(copy_from);
    // 処理結果を返却
    return ret_val;
}

let palette_templates = JSON.parse(localStorage.getItem('palette_templates'));
if (!palette_templates || !palette_templates.length){
    // テンプレートが存在しない場合はパステルテンプレートを追加
    window.localStorage.setItem('palette_templates', JSON.stringify([
        {
            "0":{
                "bg": "rgb(249, 178, 214)",
                "text": "rgb(69, 69, 69)"
            },
            "1":{
                "bg": "rgb(244, 210, 255)",
                "text": "rgb(69, 69, 69)"
            },
            "2":{
                "bg": "rgb(148, 238, 201)",
                "text": "rgb(69, 69, 69)"
            },
            "3":{
                "bg": "rgb(253, 245, 153)",
                "text": "rgb(69, 69, 69)"
            },
            "4":{
                "bg": "rgb(134, 237, 239)",
                "text": "rgb(69, 69, 69)"
            },
            "5":{
                "bg": "rgb(168,230,207)",
                "text": "rgb(251,211,182)"
            },
            "6":{
                "bg": "rgb(220,237,194)",
                "text": "rgb(249,170,165)"
            },
            "7":{
                "bg": "rgb(236,160,182)",
                "text": "rgb(250,251,164)"
            },
        }
    ]));
    location.reload();
}

// パレットテンプレート表示
let display_template;
let template_colors;
let template_colors_length;
let display_min_color_box;
let select_colors;
for (i=0; i<palette_templates.length; i++) {
    // 枠を作る
    display_templates = "<div class='palette-card palette-card" + String(i) + "'></div>";
    $(".palette-body").append(display_templates);
    // 色を塗る
    template_colors = palette_templates[String(i)];
    template_colors_length = Object.keys(template_colors).length;

    display_min_color_box = "";
    for (j=0; j<template_colors_length; j++) {
        display_min_color_box += "<div class='min-color-box min-color-box" + String(i) + "' style='background-color: " + template_colors[String(j)]['bg'] + ";'></div>";
    }
    for (j=0; j<template_colors_length; j++) {
        display_min_color_box += "<div class='min-color-box min-color-box" + String(i) + "' style='background-color: " + template_colors[String(j)]['text'] + ";'></div>";
    }
    $(".palette-card"+String(i)).append(display_min_color_box);
    // xボタンを追加
    $(".palette-card"+String(i)).append("<div class='x x" + String(i) + "'>x</div>");

    let index = String(i);
    // クリックしたパレットを適用
    $(".min-color-box"+String(i)).on("click", () => {
        select_colors = palette_templates[index];
        delete palette_templates[index];
        window.localStorage.setItem('colors', JSON.stringify(select_colors));
        window.localStorage.setItem('palette_templates', JSON.stringify([select_colors].concat(Object.values(palette_templates))));
        location.reload();
    });

    // xボタンをクリックしたパレットを削除
    $(".x"+String(i)).on("click", () => {
        delete_check = window.confirm("選択したパレットを削除するで");
        if (delete_check) {
            select_colors = palette_templates["0"];
            delete palette_templates[index];
            console.log(select_colors);
            window.localStorage.setItem('colors', JSON.stringify(select_colors));
            window.localStorage.setItem('palette_templates', JSON.stringify([].concat(Object.values(palette_templates))));
            location.reload();
        }
    });
}

$(".palette-card-add").on("click", () => {
    palette_templates = JSON.parse(localStorage.getItem('palette_templates'));
    tmp = [colors];
    window.localStorage.setItem('palette_templates', JSON.stringify(tmp.concat(Object.values(palette_templates))));
    location.reload();
});

// カラーパレットを表示
let colors = JSON.parse(localStorage.getItem('colors'));
// カラーが存在しない場合は1つ目のパレットをセット
if (!colors["length"]) {
    colors = palette_templates["0"];
}
let display_color;
let colors_length = colors.length;
if (!colors_length) {
    colors_length = Object.keys(colors).length;
}
for (i=0; i<colors_length; i++) {
    let hex_bg;
    let hex_text;
    hex_bg = rgb2Hex(colors[String(i)]["bg"]);
    hex_text = rgb2Hex(colors[String(i)]["text"]);
    display_color = "";
    display_color = "<div class='palette'>";
    display_color += "<div class='color-text color" + String(i) + "'>TEXT</div>";
    display_color += "<div class='color-boxs'>";
    display_color += "<div class='color-box bg-color-box" + String(i) + "'></div><br>";
    display_color += "<div class='color-box text-color-box" + String(i) + "'></div>";
    display_color += "</div>";
    display_color += "<div class='copy-btns'>";
    display_color += "<button class=\'copy-btn bgcolor-copy-btn bgcolor-copy-btn" + String(i) + "\'>" + hex_bg + " copy</button><br>";
    display_color += "<button class=\'copy-btn text-copy-btn text-copy-btn" + String(i) + "\'>" + hex_text + " copy</button>";
    display_color += "</div>";

    $("#colors").append(display_color);

    // 背景とテキストを組み合わせて表示
    $(".color"+String(i)).css("color", colors[String(i)]["text"]);
    $(".color"+String(i)).css("background-color", colors[String(i)]["bg"]);

    // コピーする色をボタンの横に表示
    $(".bg-color-box"+String(i)).css("background-color", colors[String(i)]["bg"]);
    $(".text-color-box"+String(i)).css("background-color", colors[String(i)]["text"]);

    // ボタンが押された時カラーコードをクリップボードにコピーする設定
    $(".bgcolor-copy-btn"+String(i)).on("click", () => {
        copyTextToClipboard(hex_bg);
    });
    $(".text-copy-btn"+String(i)).on("click", () => {
        copyTextToClipboard(hex_text);
    });
}