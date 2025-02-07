import { ConfirmDialog, CPDialog } from "./module/CPM.js";
import * as CD from "./module/XML/ConfirmDialog.js";
import * as API from "./utils/api.min.js";
import * as config from "./config.js";
import { iterLC, iterDC } from "./module/SSS.min.js";
var fs = null;
if (window.theme.OS == "windows" || window.theme.OS == "darwin") {
  fs = require("fs");
}
var apitoken = window.siyuan.config.api.token;
var localVersion = "0.0.0";

// 声明计时器
var t = null;
var t_SelfProtector = null;

if (localStorage.getItem("SC_winsay_cp_search__about_checkAPI") == "Bazaar") {
  localVersion = window.siyuan.config.appearance.themeVer; // 简单省事,但是本地覆盖版本号不会生效
} else {
  new Promise(function (response) {
    var url = `http://127.0.0.1:6806/api/file/getFile`;
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", url, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    var obj = {
      path: `/conf/appearance/themes/${config.ThemeName}/theme.json`,
    };
    httpRequest.send(JSON.stringify(obj));
    // 响应后的回调函数
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        var json = httpRequest.responseText;
        // console.log(json);
        response(JSON.parse(json));
      }
    };
  }).then(function (response) {
    localVersion = response.version;
  });
}

if (config.clientMode == "body--mobile") {
  const leftPanel = document.getElementById("sidebar");
  const menu = document.getElementById("menu");
  if (document.getElementById("Sofill-CDUI-1") == null) {
    const CDUI_1 = document.createElement("svg");
    CDUI_1.setAttribute("data-type", "");
    CDUI_1.id = "Sofill-CDUI-1";
    CDUI_1.className = "Sofill-CDUI-btn toolbar__icon";
    CDUI_1.innerHTML = `<svg id="CP_ep1" viewBox="0 0 32 32">
    <path d="M25.143 10.667h-1.524v-3.048c0-4.206-3.413-7.619-7.619-7.619s-7.619 3.413-7.619 7.619v3.048h-1.524c-1.676 0-3.048 1.371-3.048 3.048v15.238c0 1.676 1.371 3.048 3.048 3.048h18.286c1.676 0 3.048-1.371 3.048-3.048v-15.238c0-1.676-1.371-3.048-3.048-3.048zM11.428 7.619c0-2.53 2.042-4.571 4.571-4.571s4.571 2.042 4.571 4.571v3.048h-9.143v-3.048zM25.143 28.952h-18.286v-15.238h18.286v15.238zM16 24.381c1.676 0 3.048-1.371 3.048-3.048s-1.371-3.048-3.048-3.048-3.048 1.371-3.048 3.048 1.371 3.048 3.048 3.048z"></path>
  </svg>`;
    const CDUI_2 = document.createElement("div");
    CDUI_2.id = "Sofill-CDUI-2";
    CDUI_2.className = "Sofill-CDUI-btn b3-list-item b3-list-item--big";
    CDUI_2.innerHTML = `<span class="b3-list-item__icon b3-list-item__graphic">🏳️&zwj;🌈</span><span class="b3-list-item__text">主题设置</span>`;
    leftPanel.children[0].insertAdjacentElement("beforeend", CDUI_1);
    let dialog = new CPDialog({
      isCancel: true,
      dragable: false, //貌似可拖拽会有问题
      maskable: true,
    });
    document
      .querySelector("#Sofill-CDUI-1")
      .addEventListener("click", (event) => {
        dialog.open();
        document.getElementById(
          "sc-custom-container-placehold"
        ).children[0].innerHTML = `${config.ThemeName} v${localVersion} CP`;
        document.getElementById(
          "SC_winsay_cp_version"
        ).innerHTML = `当前版本 v${localVersion}
      <div class="b3-label__text"><a href="https://gitee.com/soltus/Sofill/blob/main/CHANGELOG/winsay.md" target="_blank">浏览更新历史</a></div>`;
        event.stopPropagation();
      });
    document.querySelector("#toolbarMore").addEventListener("click", (e) => {
      setTimeout(() => {
        menu.insertBefore(CDUI_2, menu.children[0]);
        document
          .querySelector("#Sofill-CDUI-2")
          .addEventListener("click", (event) => {
            dialog.open();
            document.getElementById(
              "sc-custom-container-placehold"
            ).children[0].innerHTML = `${config.ThemeName} v${localVersion} CP`;
            document.getElementById(
              "SC_winsay_cp_version"
            ).innerHTML = `当前版本 v${localVersion}
      <div class="b3-label__text"><a href="https://gitee.com/soltus/Sofill/blob/main/CHANGELOG/winsay.md" target="_blank">浏览更新历史</a></div>`;
            // event.stopPropagation();
          });
      }, 100);
    });
  }
} else {
  var barhelp = document.querySelector("#barHelp");
  barhelp.addEventListener(
    "click",
    (event) => {
      if (
        event.target.parentNode.parentNode.id == "toolbarVIP" ||
        event.target.parentNode.parentNode.parentNode.id == "toolbarVIP"
      ) {
        document.querySelector("#toolbar #barSetting").click();
        document
          .querySelector(
            '.b3-tab-bar:not(.sc-custom-nav) [data-name="account"]'
          )
          .click();
        event.stopPropagation();
      } else if (
        event.target.parentNode.id == "barMode" ||
        event.target.parentNode.parentNode.id == "barMode"
      ) {
        document.querySelector("#toolbar #barMode").click();
        event.stopPropagation();
      } else if (
        event.target.parentNode.classList.contains("b3-menu__item") ||
        event.target.parentNode.parentNode.classList.contains("b3-menu__item")
      ) {
        console.log(event.target.innerHTML);
      } else if (
        event.target.id == "barTopHelp" ||
        event.target.parentNode.id == "barTopHelp"
      ) {
        event.target.id = "barHelp";
      } else {
        event.stopPropagation();
      }
    },
    true
  );
  barhelp.setAttribute("class", "toolbar__item");
  barhelp.children[0].innerHTML = `<use xlink:href="#iconMore"></use>`;
  var drawer = document.createElement("div");
  drawer.id = "sc_drawer";
  drawer.style.display = "flex";
  drawer.style.flexDirection = "row-reverse";
  drawer.style.borderBottom = "2px dashed var(--b3-theme-surface-lighter)";
  drawer.style.minHeight = "2rem";
  setTimeout(() => {
    drawer.setAttribute(
      "data-themeInfo",
      `${config.AliaName}`
    );
  }, 1000);

  barhelp.children[1].insertAdjacentElement("afterbegin", drawer);
  if (document.getElementById("Sofill-CDUI-1") == null) {
    const CDUI_1 = document.createElement("button");
    CDUI_1.id = "Sofill-CDUI-1";
    CDUI_1.className = "Sofill-CDUI-btn b3-menu__item";
    CDUI_1.ariaLabel = "主题设置（实验性）";
    CDUI_1.style.paddingRight = "0";
    CDUI_1.innerHTML = `<svg class="b3-menu__icon Sofill-CDUI-btn__icon" "=""><use xlink:href="#iconSettings"></use></svg><span class="b3-menu__label">主题设置</span>`;
    barhelp.children[1].insertAdjacentElement("beforeend", CDUI_1);
    let dialog = new CPDialog({
      isCancel: true,
      dragable: false, //貌似可拖拽会有问题
      maskable: true,
    });
    document.querySelector("#Sofill-CDUI-1").onclick = function () {
      dialog.open();
      document.getElementById(
        "sc-custom-container-placehold"
      ).children[0].innerHTML = `${config.ThemeName} v${localVersion} CP`;
      document.getElementById(
        "SC_winsay_cp_version"
      ).innerHTML = `当前版本 v${localVersion}
      <div class="b3-label__text"><a href="https://gitee.com/soltus/Sofill/blob/main/CHANGELOG/winsay.md" target="_blank">浏览更新历史</a></div>`;
      document
        .getElementById("sofill_preview")
        .setAttribute("src", `${config.THEME_ROOT}preview.png`);
    };
  }
}

async function checkUpdateViaGithub(v, q) {
  let themes = await getBazaarTheme(window.location.host, "", {});
  console.log(themes.data);
  let localThemes = await getInstalledTheme(window.location.host, "", {});
  console.log(localThemes.data);
  new Promise(function (response) {
    var url = `https://api.github.com/repos/Hi-Windom/winsay/releases/latest`;
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send(null);
    // 响应后的回调函数
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        var json = httpRequest.responseText;
        response(JSON.parse(json));
      }
    };
  }).then(async function (response) {
    console.log(response);
    let version = response["tag_name"];
    if (API.compareVersion(version, v) == 1) {
      console.warn("Github 有新版本发布");
      let updating = new ConfirmDialog({
        isCancel: true,
        dragable: false,
        XML: CD.ConfirmDialog4,
        success() {
          console.log("点击了确定");
          window.open(
            `https://github.com/Hi-Windom/winsay/releases/download/${version}/Sofill-__${version}.zip`,
            "_blank"
          );
          window.open(
            `https://github.com/Hi-Windom/winsay/releases/tag/${version}`,
            "_blank"
          );
        },
        cancel() {
          console.log("点击了取消");
        },
        maskable: true,
      });
      await updating.open(() => {
        document.getElementById(
          "UpdateInfo"
        ).innerHTML = `${v} => ${version}<br><span class="fn__space"></span><pre class="b3-typography" style="max-height: 288px;">${response["body"]}</pre>`;
        document.getElementById(
          "CoverWarming"
        ).innerHTML = `下载链接能否访问取决于你的网络`;
      });
      localStorage.setItem("SC_winsay_latest_checked_version", version);
    } else {
      if (q == false) {
        API.通知(`真棒👍，主题已是最新版本`, 800);
      }
    }
  });
}
async function checkUpdateViaBazaar(v, q) {
  let themes = await getBazaarTheme(window.location.host, "", {});
  console.log(themes.data);
  // let localThemes = await getInstalledTheme(window.location.host, "", {});
  // console.log(localThemes.data);

  let mytheme = {};
  themes.data.packages.forEach((p) => {
    p.name == "Sofill-" ? (mytheme = p) : null;
  });
  if (API.compareVersion(mytheme.version, v) == 1) {
    console.warn("集市有新版本发布");
    localStorage.setItem("SC_winsay_latest_checked_version", mytheme.version);
    API.通知(`集市有新版本发布：<br>${v} => ${mytheme.version}<br> `);
    await updateTheme("Sofill-");
  } else {
    if (q == false) {
      API.通知(`真棒👍，主题已是最新版本`, 800);
    }
  }
}
async function getBazaarTheme(ip, apitoken, data) {
  let url = "http://" + ip + "/api/bazaar/getBazaarTheme";
  return API.request(url, apitoken, data);
}
async function getInstalledTheme(ip, apitoken, data) {
  let url = "http://" + ip + "/api/bazaar/getInstalledTheme";
  return API.request(url, apitoken, data);
}
async function updateTheme(themeName) {
  document.querySelector("#toolbar #barSetting").click();
  document
    .querySelector('.b3-tab-bar:not(.sc-custom-nav) [data-name="bazaar"]')
    .click();
  setTimeout(() => {
    document
      .querySelector(
        `#configBazaarTheme [class="b3-card__actions"][data-name="${themeName}"]>[data-type="install-t"]`
      )
      .click();
  }, 1000);
}

async function checkUpdate(q = false) {
  let mode = localStorage.getItem("SC_winsay_cp_search__about_checkAPI");
  switch (mode) {
    case "Github":
      await checkUpdateViaGithub(localVersion, q);
      break;
    default:
      await checkUpdateViaBazaar(localVersion, q);
      break;
  }
}

var obj = {};

async function bindDomWithObject(options) {
  var dom = document.getElementById(options.id); // 获取dom id
  var obj = options.obj; // 需要绑定的obj
  var prop = options.prop; // 需要绑定的obj 的属性
  var callback = options.callback; // 绑定成功后调用
  var type = options.type; // 绑定的事件类型
  var updated = options.updated; // 更新成功后调用

  Object.defineProperty(obj, prop, {
    get: function () {
      return dom.value;
    },
    set: function (value) {
      dom.value = value;
      localStorage.setItem(prop, value);
    },
    configurable: true,
  });

  dom.addEventListener(type, function () {
    obj[prop] = obj[prop];
    if (typeof updated === "function") {
      updated(obj, prop, dom); // 传入对象， 修改的属性， 以及dom节点
    }
  });

  if (typeof callback === "function") {
    callback(options, obj, dom);
  }
}

async function propInit(id, type) {
  bindDomWithObject({
    id: id,
    obj: obj,
    prop: id,
    type: type,
    callback: function (options, obj, dom) {
      if (!API.isEmpty(localStorage.getItem(id))) {
        obj[options.prop] = localStorage.getItem(id);
      }
    },
  });
  console.log(`${id} binded successfully`);
}

async function propChange(id, changeFn) {
  bindDomWithObject({
    id: id,
    obj: obj,
    prop: id,
    type: "change",
    updated: changeFn,
  });
  changeFn();
}

async function checkedInit(obj) {
  if (localStorage.getItem(obj.id) === "true") {
    obj.checked = true;
  } else {
    obj.checked = false;
  }
  console.log(`${obj.id} binded successfully`);
}

async function checkedChange(obj, YesFn, NoFn) {
  if (obj.checked && obj.checked === true) {
    localStorage.setItem(obj.id, "true");
    YesFn();
  } else {
    localStorage.setItem(obj.id, "false");
    NoFn();
  }
  obj.addEventListener("click", function () {
    if (obj.checked === true) {
      localStorage.setItem(obj.id, "true");
      YesFn();
    } else {
      localStorage.setItem(obj.id, "false");
      NoFn();
    }
  });
}

// 初始化选项的值
let selectList = document.querySelectorAll("select[id^='SC_winsay_cp']");
// console.log(selectList);
selectList.forEach(function (value) {
  propInit(value.id, "change");
});
let rangeSliderList = document.querySelectorAll(
  "input[id^='SC_winsay_cp'][type='range']"
);
// console.log(rangeSliderList);
rangeSliderList.forEach(function (value) {
  propInit(value.id, "change");
});
let checkboxList = document.querySelectorAll(
  "input[id^='SC_winsay_cp'][type='checkbox']"
);
// console.log(checkboxList);
checkboxList.forEach(function (value) {
  checkedInit(value);
});
// 支持记忆主题设置界面 #499
let navLatest = localStorage.getItem("SC_winsay_cp_custom-nav-bind-id");
if (!API.isEmpty(navLatest)) {
  document.getElementById(navLatest).checked = "true";
}
let navList = document.querySelectorAll(
  "input[id^='sc-custom-nav-bind-id'][type='radio']"
);
navList.forEach(function (value) {
  checkedChange(
    value,
    () => {
      localStorage.setItem("SC_winsay_cp_custom-nav-bind-id", value.id);
    },
    () => {}
  );
});

// 按钮监听事件
document
  .getElementById("SC_winsay_cp_system__ClearlocalStorage")
  .addEventListener("click", function () {
    let clearAll = new ConfirmDialog({
      isCancel: true,
      dragable: false,
      XML: CD.ConfirmDialog1,
      success() {
        console.log("点击了确定");
        var counter = 0;
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (key.startsWith("winsay_") || key.startsWith("SC_winsay_")) {
            localStorage.removeItem(key);
            console.log(`${key} removed`);
            counter++;
          }
        }
        // 简单粗暴的执行两次
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (key.startsWith("winsay_") || key.startsWith("SC_winsay_")) {
            localStorage.removeItem(key);
            console.log(`${key} removed`);
            counter++;
          }
        }
        API.通知(`已清理 ${counter} 项<br>页面即将刷新`);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
      cancel() {
        console.log("点击了取消");
      },
      maskable: true,
    });

    clearAll.open();
  });

document
  .getElementById("SC_winsay_cp_system__ResetAllSettings")
  .addEventListener("click", function () {
    let clearAll = new ConfirmDialog({
      isCancel: true,
      dragable: false,
      XML: CD.ConfirmDialog2,
      success() {
        console.log("点击了确定");
        var counter = 0;
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (key.startsWith("SC_winsay_cp")) {
            localStorage.removeItem(key);
            console.log(`${key} removed`);
            counter++;
          }
        }
        // 简单粗暴的执行两次
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (key.startsWith("SC_winsay_cp")) {
            localStorage.removeItem(key);
            console.log(`${key} removed`);
            counter++;
          }
        }
        API.通知(`已重置 ${counter} 项<br>页面即将刷新`);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
      cancel() {
        console.log("点击了取消");
      },
      maskable: true,
    });

    clearAll.open();
  });

document
  .getElementById("SC_winsay_cp_system__Refresh")
  .addEventListener("click", function () {
    setTimeout(() => {
      window.location.reload();
    }, 300);
  });

document
  .getElementById("SC_winsay_cp_system__ShowDebugInfo")
  .addEventListener("click", function () {
    setTimeout(() => {
      let info = new ConfirmDialog({
        isCancel: true,
        dragable: false,
        XML: CD.ConfirmDialog5,
        success() {
          console.log("点击了确定");
        },
        cancel() {
          console.log("点击了取消");
        },
        maskable: false,
      });

      info.open(() => {
        document.getElementById("UpdateInfo").innerHTML = `
<div style="max-height: 58vh;overflow: auto;white-space: nowrap;">
localIPs  <br><code class="fn__code">${window.siyuan.config.localIPs}</code><br><br>
api.token  <br><code class="fn__code">${window.siyuan.config.api.token}</code><br><br>
system.homeDir  <br><code class="fn__code">${window.siyuan.config.system.homeDir}</code><br><br>
system.workspaceDir  <br><code class="fn__code">${window.siyuan.config.system.workspaceDir}</code><br><br>
system.confDir  <br><code class="fn__code">${window.siyuan.config.system.confDir}</code><br><br>
system.dataDir  <br><code class="fn__code">${window.siyuan.config.system.dataDir}</code><br><br>
appearance.darkThemes  <br><code class="fn__code">${window.siyuan.config.appearance.darkThemes}</code><br><br>
appearance.lightThemes  <br><code class="fn__code">${window.siyuan.config.appearance.lightThemes}</code><br><br>
appearance.mode  <br><code class="fn__code">${window.siyuan.config.appearance.mode}</code><br><br>
appearance.themeDark  <br><code class="fn__code">${window.siyuan.config.appearance.themeDark}</code><br><br>
appearance.themeLight  <br><code class="fn__code">${window.siyuan.config.appearance.themeLight}</code><br><br>
appearance.themeVer  <br><code class="fn__code">${window.siyuan.config.appearance.themeVer}</code><br><br>
appearance.blockRefTextLeft  <br><code class="fn__code">${window.siyuan.config.export.blockRefTextLeft}</code><br><br>
appearance.blockRefTextRight  <br><code class="fn__code">${window.siyuan.config.export.blockRefTextRight}</code><br><br>
fileTree.maxOpenTabCount（页签打开最大数量）  <br><code class="fn__code">${window.siyuan.config.fileTree.maxOpenTabCount}</code><br><br>
system.fixedPort（是否固定端口）  <br><code class="fn__code">${window.siyuan.config.system.fixedPort}</code><br><br>
appearance.hideStatusBar（修改没有效果，仅用于判断是否隐藏底部状态栏）  <br><code class="fn__code">${window.siyuan.config.appearance.hideStatusBar}</code><br><br>
appearance.customCSS（是否开启自定义主题）  <br><code class="fn__code">${window.siyuan.config.appearance.customCSS}</code>
</div>
`;
      });
    }, 300);
  });

document
  .getElementById("SC__exportData")
  .addEventListener("click", function () {
    var link = document.querySelector("#SC__exportData_a"); //  选择链接
    var counter = 0;
    var ok = 0;
    var jsonData = {};
    jsonData.winsay = {};
    jsonData.sy_editor = {};
    jsonData.sy_keymap = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key.startsWith("winsay_") || key.startsWith("SC_winsay_")) {
        try {
          jsonData.winsay[key] = localStorage.getItem(key);
          ok++;
        } catch (e) {
          console.error(`${key} is not a valid value for ${e}`);
          jsonData.winsay[key] = null;
        } finally {
          counter++;
        }
      }
    }
    let sy_editor = localStorage.getItem(
      "SC_winsay_cp__exportData__EXT_sy_editor"
    );
    sy_editor == "true"
      ? (jsonData.sy_editor = window.siyuan.config.editor)
      : (jsonData.sy_editor = null);
    let sy_keymap = localStorage.getItem(
      "SC_winsay_cp__exportData__EXT_sy_keymap"
    );
    sy_keymap == "true"
      ? (jsonData.sy_keymap = window.siyuan.config.keymap)
      : (jsonData.sy_keymap = null);
    var blob = new Blob([JSON.stringify(jsonData)]);
    link.href = URL.createObjectURL(blob); //  创建一个 URL 对象并传给 a 的 href
    link.download = `Sofill-ConfigData.json`; //  设置下载的默认文件名
    link.click(); //  点击下载链接
    API.通知(`导出成功 ${ok}/${counter}`);
  });

document
  .getElementById("SC__importData")
  .addEventListener("click", function () {
    var fileSelect = document.querySelector("#SC__importData_i"); //  选择链接
    //  文件表单的内容改变，也就是文件选择完成
    fileSelect.onchange = function () {
      if (this.value === "" || this.files.length < 1) {
        console.warn("Oops...");
        return false; //  如果没有选择文件就什么也不做
      }
      var counter = 0;
      var diff = 0;
      var diffDetail = {};
      var ok = 0;
      var reader = new FileReader(); //  创建 FileReader对象
      reader.readAsText(this.files[0]); //  把文件读取为字符串
      //  文件加载完成
      reader.onload = async function (ev) {
        var jsonStr = ev.target.result; //  把字符串传给 jsonStr
        try {
          jsonStr = JSON.parse(jsonStr); //  把 JSON 字符串转换为 JSON 对象
        } catch (e) {
          API.通知(`无效数据 ${e}`, 3000);
          return;
        }
        console.log(jsonStr); //  在控制台输出 JSON
        for (var name in jsonStr) {
          diffDetail[name] = {};
          if (name == "winsay") {
            for (var val in jsonStr[name]) {
              counter = counter + 1;
              if (jsonStr[name][val] != localStorage.getItem(val)) {
                diff = diff + 1;
                diffDetail[name][val] = `${localStorage.getItem(val)} => ${
                  jsonStr[name][val]
                }`;
              }
            }
          }
          // if (name == "sy_editor") {
          //   for (var val in jsonStr[name]) {
          //     counter = counter + 1;
          //     var obj = window.siyuan.config.editor[val];
          //     if (jsonStr[name][val] != obj) {
          //       diff = diff + 1;
          //       diffDetail[name][val] = `${JSON.stringify(
          //         obj
          //       )} => ${JSON.stringify(jsonStr[name][val])}`;
          //     }
          //   }
          // }
          // if (name == "sy_keymap") {
          //   diffDetail[name]["editor"] = {};
          //   diffDetail[name]["general"] = {};
          //   for (var val in jsonStr[name]["editor"]) {
          //     counter = counter + 1;
          //     let obj = JSON.stringify(
          //       window.siyuan.config.keymap["editor"][val]
          //     );
          //     let diff = JSON.stringify(jsonStr[name]["editor"][val]);
          //     if (diff != obj) {
          //       diff = diff + 1;
          //       diffDetail[name]["editor"][val] = `${obj} => ${diff}`;
          //     }
          //   }
          //   for (var val in jsonStr[name]["general"]) {
          //     counter = counter + 1;
          //     let obj = JSON.stringify(
          //       window.siyuan.config.keymap["general"][val]
          //     );
          //     let diff = JSON.stringify(jsonStr[name]["general"][val]);
          //     if (diff != obj) {
          //       diff = diff + 1;
          //       diffDetail[name]["general"][val] = `${obj} => ${diff}`;
          //     }
          //   }
          // }
        }
        console.warn(
          "================================ Changes Preview ================================"
        );
        console.log(diffDetail);
        console.warn(
          "================================================================================"
        );

        let coverAll = new ConfirmDialog({
          isCancel: true,
          dragable: false,
          XML: CD.ConfirmDialog3,
          success() {
            console.log("点击了确定");
            // for (var val in jsonStr) {
            //   try {
            //     localStorage.setItem(val, jsonStr[val]);
            //     ok = ok + 1;
            //     console.warn(`${val} updated`);
            //   } catch (e) {
            //     console.error(e);
            //   }
            // }
            for (var name in jsonStr) {
              diffDetail[name] = {};
              if (name == "winsay") {
                for (var val in jsonStr[name]) {
                  try {
                    localStorage.setItem(val, jsonStr[name][val]);
                    ok = ok + 1;
                    console.warn(`${val} updated`);
                  } catch (e) {
                    console.error(e);
                  }
                }
              }
              if (name == "sy_editor") {
              }
              if (name == "sy_keymap") {
              }
            }
            API.通知(`导入成功 ${ok}/${counter}，覆盖 ${diff} 项`);
            // if (diff > 0) {
            //   setTimeout(() => {
            //     window.location.reload();
            //   }, 1000);
            // }
          },
          cancel() {
            console.log("点击了取消");
          },
          maskable: true,
        });
        await coverAll.open(() => {
          document.getElementById(
            "CoverWarming"
          ).innerHTML = `影响 ${diff}/${counter} 项`;
        });
      };
    };
    fileSelect.value = ""; // 避免重复导入无法取值
  });

document
  .getElementById("SC_winsay_cp__checkUpdateBtn")
  .addEventListener("click", function () {
    checkUpdate();
  });

document
  .getElementById(
    "SC_winsay_cp_editor__Block-Inline-link__block-ref-content_AsyncToSY"
  )
  .addEventListener("click", function () {
    var i = localStorage.getItem(
      "SC_winsay_cp_editor__Block-Inline-link__block-ref-content"
    );
    if (!API.isEmpty(i)) {
      var before = i.split(" ")[0];
      var after = i.split(" ")[1];
      if (document.readyState == "complete") {
        window.siyuan.config.appearance.blockRefTextLeft = ` ${before}`;
        window.siyuan.config.appearance.blockRefTextRight = `${after} `;
        document.querySelector("#toolbar #barSetting").click();
        document
          .querySelector('.b3-tab-bar:not(.sc-custom-nav) [data-name="export"]')
          .click();
        let left = document.querySelector("#blockRefTextLeft");
        let right = document.querySelector("#blockRefTextRight");
        if (!API.isEmpty(left) && !API.isEmpty(right)) {
          left.value = ` ${before}`;
          right.value = `${after} `;
          let e = new Event("change", { bubbles: true });
          let tracker = left._valueTracker;
          if (tracker) {
            tracker.setValue("");
          }
          left.dispatchEvent(e);
          let e2 = new Event("change", { bubbles: true });
          let tracker2 = right._valueTracker;
          if (tracker2) {
            tracker2.setValue("");
          }
          right.dispatchEvent(e2);
          setTimeout(() => {
            document.elementFromPoint(1, 1).click();
          }, 1000);
        }
        API.通知(`同步完成`, 200);
      }
    } else {
      if (document.readyState == "complete") {
        window.siyuan.config.appearance.blockRefTextLeft = ` `;
        window.siyuan.config.appearance.blockRefTextRight = ` `;
        document.querySelector("#toolbar #barSetting").click();
        document
          .querySelector('.b3-tab-bar:not(.sc-custom-nav) [data-name="export"]')
          .click();
        let left = document.querySelector("#blockRefTextLeft");
        let right = document.querySelector("#blockRefTextRight");
        if (!API.isEmpty(left) && !API.isEmpty(right)) {
          left.value = ` `;
          right.value = ` `;
          let e = new Event("change", { bubbles: true });
          let tracker = left._valueTracker;
          if (tracker) {
            tracker.setValue("");
          }
          left.dispatchEvent(e);
          let e2 = new Event("change", { bubbles: true });
          let tracker2 = right._valueTracker;
          if (tracker2) {
            tracker2.setValue("");
          }
          right.dispatchEvent(e2);
          setTimeout(() => {
            document.elementFromPoint(1, 1).click();
          }, 1000);
        }
        API.通知(`同步完成`, 200);
      }
    }
  });

// ------------------ 选项改变时的业务处理 ------------------------
async function CP_EditorMonitor() {
  propChange(
    "SC_winsay_cp_editor__block__popover--open__PinSense",
    function () {
      var i = localStorage.getItem(
        "SC_winsay_cp_editor__block__popover--open__PinSense"
      );
      if (!API.isEmpty(i)) {
        switch (i) {
          case "2":
            document.documentElement.style.setProperty(
              "--SCC-Variables-block__popover--open__PinSense_2",
              "var(--b3-theme-secondary) -2px -2px 5.8px 1px,var(--b3-theme-primary) 0 0 0 1px,var(--b3-theme-primary-light) 0 0 3px 1px,var(--b3-theme-primary-lighter) 0 0 13px 2px,var(--b3-theme-primary-lightest) 0 0 2px 4px"
            );
            document.documentElement.style.setProperty(
              "--SCC-Variables-block__popover--open__PinSense_1",
              "unset"
            );
            break;
          case "1":
            document.documentElement.style.setProperty(
              "--SCC-Variables-block__popover--open__PinSense_2",
              "var(--b3-dialog-shadow)"
            );
            document.documentElement.style.setProperty(
              "--SCC-Variables-block__popover--open__PinSense_1",
              "var(--b3-theme-surface-lighter)"
            );
            break;
        }
      } else {
        document.documentElement.style.setProperty(
          "--SCC-Variables-block__popover--open__PinSense_1",
          "unset"
        );
        document.documentElement.style.setProperty(
          "--SCC-Variables-block__popover--open__PinSense_2",
          "var(--b3-dialog-shadow)"
        );
      }
    }
  );
  propChange("SC_winsay_cp_editor__BlockTable_MinWidth", function () {
    var i = localStorage.getItem("SC_winsay_cp_editor__BlockTable_MinWidth");
    if (!API.isEmpty(i)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-BlockTable-minWidth",
        i
      );
    } else {
      document.documentElement.style.setProperty(
        "--SCC-Variables-BlockTable-minWidth",
        "unset"
      );
    }
  });
  propChange("SC_winsay_cp_editor__BlockTable_MaxWidth", function () {
    var i = localStorage.getItem("SC_winsay_cp_editor__BlockTable_MaxWidth");
    if (!API.isEmpty(i)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-BlockTable-maxWidth",
        i
      );
    } else {
      document.documentElement.style.setProperty(
        "--SCC-Variables-BlockTable-maxWidth",
        "unset"
      );
    }
  });
  propChange("SC_winsay_cp_editor__BlockTable_FontSize", function () {
    var i = localStorage.getItem("SC_winsay_cp_editor__BlockTable_FontSize");
    if (!API.isEmpty(i)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-BlockTable-fontSize",
        i
      );
    } else {
      document.documentElement.style.setProperty(
        "--SCC-Variables-BlockTable-fontSize",
        "unset"
      );
    }
  });
  propChange("SC_winsay_cp_editor__BlockTable_TextAlign", function () {
    var i = localStorage.getItem("SC_winsay_cp_editor__BlockTable_TextAlign");
    if (!API.isEmpty(i)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-BlockTable-text_align",
        i
      );
    } else {
      document.documentElement.style.setProperty(
        "--SCC-Variables-BlockTable-text_align",
        "unset"
      );
    }
  });
  checkedChange(
    document.getElementById("SC_winsay_cp_editor__BlockTable_Margin"),
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-BlockTable-margin",
        "0 auto"
      );
    },
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-BlockTable-margin",
        "inherit"
      );
    }
  );
  propChange("SC_winsay_cp_editor__Block-List-LightUpLineMode", function () {
    var i = localStorage.getItem(
      "SC_winsay_cp_editor__Block-List-LightUpLineMode"
    );
    if (!API.isEmpty(i)) {
      switch (i) {
        case "1":
          document.documentElement.style.setProperty(
            "--SCC-Variables-BlockList__beforeColor",
            "var(--b3-theme-background-light)"
          );
          window.funs.updateStyle("BlockListHoverALL", ``);
          break;
        case "2":
          document.documentElement.style.setProperty(
            "--SCC-Variables-BlockList__beforeColor",
            "var(--b3-theme-background-light)"
          );
          window.funs.updateStyle(
            "BlockListHoverALL",
            `/appearance/themes/Sofill-/style/sweet/sugar/editor/Block-List-HoverALL.css`
          );
          break;
        case "3":
          document.documentElement.style.setProperty(
            "--SCC-Variables-BlockList__beforeColor",
            "var(--b3-scroll-color)"
          );
          break;
        case "4":
        default:
          document.documentElement.style.setProperty(
            "--SCC-Variables-BlockList__beforeColor",
            "var(--b3-theme-surface-lighter)"
          );
          break;
      }
    } else {
      document.documentElement.style.setProperty(
        "--SCC-Variables-BlockList__beforeColor",
        "var(--b3-theme-surface-lighter)"
      );
    }
  });
  propChange(
    "SC_winsay_cp_editor__layout-center_protyle-toolbar_position",
    function () {
      var i = localStorage.getItem(
        "SC_winsay_cp_editor__layout-center_protyle-toolbar_position"
      );
      var j = API.isEmpty(i) ? "" : i;
      window.funs.updateStyle(
        "layout-center_protyle-toolbar_position",
        `/appearance/themes/Sofill-/style/sweet/sugar/editor/${j}`
      );
    }
  );
  propChange("SC_winsay_cp_editor__protyle-attr-scale", function () {
    var h = localStorage.getItem("SC_winsay_cp_editor__protyle-attr-scale");
    if (!API.isEmpty(h)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-protyle-attr-scale",
        h
      );
    }
  });
  var SC_winsay_cp_editor__DocWidthMode__previousValue = "null";
  propChange("SC_winsay_cp_editor__DocWidthMode", function () {
    var w = localStorage.getItem("SC_winsay_cp_editor__DocWidthMode");
    clearInterval(t);
    if (!API.isEmpty(w)) {
      SC_winsay_cp_editor__DocWidthMode__previousValue = w;
      t = setInterval(function () {
        var node1 = document.querySelectorAll(
          "#layouts .layout__center .protyle-wysiwyg.protyle-wysiwyg--attr"
        );
        var node2 = document.querySelectorAll(
          "#layouts .layout__center .protyle-title.protyle-wysiwyg--attr"
        );
        node1.forEach(function (item) {
          item.style.setProperty("padding", w);
          item.style.setProperty("margin", "0 auto");
          if (w == "1in 0.5in") {
            item.style.setProperty("max-width", "800px");
          } else {
            item.style.removeProperty("max-width");
          }
        });
        node2.forEach(function (item) {
          item.style.setProperty("margin", w);
        });
      }, 1000);
    } else if (
      SC_winsay_cp_editor__DocWidthMode__previousValue != w &&
      w != null
    ) {
      window.location.reload();
    }
  });
  var t2 = null; // 声明计时器
  propChange("SC_winsay_cp_editor__Doc_bgColor", function () {
    var w = localStorage.getItem("SC_winsay_cp_editor__Doc_bgColor");
    clearInterval(t2);
    if (!API.isEmpty(w)) {
      t2 = setInterval(function () {
        var node1 = document.querySelectorAll(
          "#layouts .layout__center .protyle-wysiwyg.protyle-wysiwyg--attr"
        );
        node1.forEach(function (item) {
          item.style.setProperty("background-color", w);
        });
      }, 1000);
    } else if (
      SC_winsay_cp_editor__DocWidthMode__previousValue != w &&
      w != null
    ) {
      window.location.reload();
    }
  });
  propChange("SC_winsay_cp_editor__ListAutoIndent_mode", function () {
    var value = localStorage.getItem(
      "SC_winsay_cp_editor__ListAutoIndent_mode"
    );
    if (!API.isEmpty(value) && value == "2") {
      document.documentElement.style.setProperty(
        "--SCC-Variables-List-Item-margin",
        "max(min(18px,0.58em),8px)"
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-List-Item-padding",
        "min(16px,0.31em)"
      );
    } else if (!API.isEmpty(value) && value == "1") {
      document.documentElement.style.setProperty(
        "--SCC-Variables-List-Item-margin",
        "max(min(18px,1cqw),8px)"
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-List-Item-padding",
        "min(16px,0.58cqw)"
      );
    } else {
      document.documentElement.style.setProperty(
        "--SCC-Variables-List-Item-margin",
        "18px"
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-List-Item-padding",
        "16px"
      );
    }
  });
  propChange("SC_winsay_cp_editor__img-bg-color", function () {
    var value = localStorage.getItem("SC_winsay_cp_editor__img-bg-color");
    if (!API.isEmpty(value)) {
      switch (
        localStorage.getItem("SC_winsay_cp_editor__img-bg-color_always")
      ) {
        case "true":
          document.documentElement.style.setProperty(
            "--SCC-Variables-IMG-bg-color_hover",
            value
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-IMG-bg-color",
            value
          );
          break;
        default:
          document.documentElement.style.setProperty(
            "--SCC-Variables-IMG-bg-color_hover",
            value
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-IMG-bg-color",
            "transparent"
          );
      }
    }
  });
  checkedChange(
    document.getElementById("SC_winsay_cp_editor__img-bg-color_always"),
    () => {
      var value = localStorage.getItem("SC_winsay_cp_editor__img-bg-color");
      document.documentElement.style.setProperty(
        "--SCC-Variables-IMG-bg-color_hover",
        value
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-IMG-bg-color",
        value
      );
    },
    () => {
      var value = localStorage.getItem("SC_winsay_cp_editor__img-bg-color");
      document.documentElement.style.setProperty(
        "--SCC-Variables-IMG-bg-color_hover",
        value
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-IMG-bg-color",
        "transparent"
      );
    }
  );
  checkedChange(
    document.getElementById("SC_winsay_cp_editor__HintHint-index"),
    () => {
      window.funs.updateStyle(
        "HintHint-index",
        `/appearance/themes/Sofill-/style/sweet/sugar/editor/HintHint-index.css`
      );
    },
    () => {
      API.removejscssfile(
        `${config.winsay_ROOT}style/sweet/sugar/editor/HintHint-index.css`,
        "css"
      );
    }
  );
  checkedChange(
    document.getElementById("SC_winsay_cp_editor__LH_Adaptive"),
    () => {
      window.funs.updateStyle(
        "LH_Adaptive",
        `/appearance/themes/Sofill-/style/sweet/LH-Adaptive.css`
      );
      document
        .getElementById("BP__SC_winsay_cp_editor__LH_Adaptive")
        .classList.add("fn__none");
    },
    () => {
      API.removejscssfile(
        `${config.winsay_ROOT}style/sweet/LH-Adaptive.css`,
        "css"
      );
      document
        .getElementById("BP__SC_winsay_cp_editor__LH_Adaptive")
        .classList.remove("fn__none");
    }
  );
  checkedChange(
    document.getElementById("SC_winsay_cp_editor__BreadcrumbsMode-Adaptive"),
    () => {
      window.funs.updateStyle(
        "docBreadcrumb_Adaptive",
        `/appearance/themes/Sofill-/style/sweet/MI-Breadcrumb-Adaptive.css`
      );
    },
    () => {
      API.removejscssfile(
        `${config.winsay_ROOT}style/sweet/MI-Breadcrumb-Adaptive.css`,
        "css"
      );
    }
  );
  checkedChange(
    document.getElementById("SC_winsay_cp_editor__AreoBg-Filter"),
    () => {
      window.funs.updateStyle(
        "AreoBg-Filter",
        `/appearance/themes/Sofill-/style/sweet/AreoBg-Filter.css`
      );
    },
    () => {
      API.removejscssfile(
        `${config.winsay_ROOT}style/sweet/AreoBg-Filter.css`,
        "css"
      );
    }
  );
  propChange("SC_winsay_cp_editor__LH_Adaptive__pIndent", function () {
    var i = localStorage.getItem("SC_winsay_cp_editor__LH_Adaptive__pIndent");
    if (!API.isEmpty(i)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-Doc-pIndent",
        `${API.RangeLimitedInt(-2, i, 12)}rem`
      );
      document.getElementById(
        "SC_winsay_cp_editor__LH_Adaptive__pIndent"
      ).value = API.RangeLimitedInt(-2, i, 12);
    }
  });
  propChange("SC_winsay_cp_editor__LH_Adaptive__LH", function () {
    var i = localStorage.getItem("SC_winsay_cp_editor__LH_Adaptive__LH");
    if (!API.isEmpty(i)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-Doc-LH",
        `${i}`
      );
      document
        .getElementById("SC_winsay_cp_editor__LH_Adaptive__LH__label")
        .setAttribute("aria-label", `${i}`);
      localStorage.setItem("SC_winsay_cp_editor__LH_Adaptive__LH__label", i);
      if (
        config.clientMode == "body--mobile" &&
        document.querySelector("#SC-CP").style.display != "none"
      ) {
        API.通知(`新值：${i}`);
      }
    }
  });
  propChange("SC_winsay_cp_editor__LH_Adaptive__marginTop", function () {
    var i = localStorage.getItem("SC_winsay_cp_editor__LH_Adaptive__marginTop");
    if (!API.isEmpty(i)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-Doc-marginTop",
        `${API.RangeLimitedInt(10, i, 500) / 100}rem`
      );
      document.getElementById(
        "SC_winsay_cp_editor__LH_Adaptive__marginTop"
      ).value = API.RangeLimitedInt(10, i, 500);
    }
  });
  propChange("SC_winsay_cp_editor__LH_Adaptive__marginBottom", function () {
    var i = localStorage.getItem(
      "SC_winsay_cp_editor__LH_Adaptive__marginBottom"
    );
    if (!API.isEmpty(i)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-Doc-marginBottom",
        `${API.RangeLimitedInt(10, i, 500) / 100}rem`
      );
      document.getElementById(
        "SC_winsay_cp_editor__LH_Adaptive__marginBottom"
      ).value = API.RangeLimitedInt(10, i, 500);
    }
  });
  propChange("SC_winsay_cp_editor__LH_Adaptive__lSpacing", function () {
    var i = localStorage.getItem("SC_winsay_cp_editor__LH_Adaptive__lSpacing");
    if (!API.isEmpty(i)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-Doc-lSpacing",
        `${i}rem`
      );
      document
        .getElementById("SC_winsay_cp_editor__LH_Adaptive__lSpacing__label")
        .setAttribute("aria-label", `${i}`);
      localStorage.setItem(
        "SC_winsay_cp_editor__LH_Adaptive__lSpacing__label",
        i
      );
      if (
        config.clientMode == "body--mobile" &&
        document.querySelector("#SC-CP").style.display != "none"
      ) {
        API.通知(`新值：${i}`);
      }
    }
  });
  propChange("SC_winsay_cp_editor__BlockScrollBar-opacity", function () {
    var o = localStorage.getItem("SC_winsay_cp_editor__BlockScrollBar-opacity");
    if (!API.isEmpty(o)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-BlockScrollBar-opacity-hover",
        o
      );
      switch (o) {
        case "0.58":
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-opacity",
            "0.58"
          );
          break;
        default:
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-opacity",
            "0"
          );
          break;
      }
    }
  });
  propChange("SC_winsay_cp_editor__BlockScrollBar_Hposition", function () {
    var p = localStorage.getItem(
      "SC_winsay_cp_editor__BlockScrollBar_Hposition"
    );
    if (!API.isEmpty(p)) {
      switch (p) {
        case "L31":
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-right",
            "unset"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-left",
            "31px"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-tooltips-top",
            "-100%"
          );
          break;
        case "L13":
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-right",
            "unset"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-left",
            "13px"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-tooltips-top",
            "-100%"
          );
          break;
        case "R31":
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-right",
            "31px"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-left",
            "unset"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-tooltips-top",
            "100%"
          );
          break;
        case "R13":
        default:
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-right",
            "13px"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-left",
            "unset"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-MI-BlockScrollBar-tooltips-top",
            "100%"
          );
          break;
      }
    }
  });
  propChange(
    "SC_winsay_cp_editor__Block-Inline-link__block-ref-content",
    function () {
      var i = localStorage.getItem(
        "SC_winsay_cp_editor__Block-Inline-link__block-ref-content"
      );
      if (!API.isEmpty(i)) {
        var before = i.split(" ")[0];
        var after = i.split(" ")[1];
        document.documentElement.style.setProperty(
          "--SCC-Variables-Block-Inline-link__block-ref__before",
          `'${before}'`
        );
        document.documentElement.style.setProperty(
          "--SCC-Variables-Block-Inline-link__block-ref__after",
          `'${after}'`
        );
      } else {
        document.documentElement.style.setProperty(
          "--SCC-Variables-Block-Inline-link__block-ref__before",
          "none"
        );
        document.documentElement.style.setProperty(
          "--SCC-Variables-Block-Inline-link__block-ref__after",
          "none"
        );
      }
    }
  );
  propChange(
    "SC_winsay_cp_editor__Block-List-Task__item-done__text-color",
    function () {
      var i = localStorage.getItem(
        "SC_winsay_cp_editor__Block-List-Task__item-done__text-color"
      );
      if (!API.isEmpty(i) && i == "auto") {
        document.documentElement.style.setProperty(
          "--SCC-Variables-Block-List-Task__item-done-color",
          "var(--b3-theme-secondary)"
        );
        document.documentElement.style.setProperty(
          "--SCC-Variables-Block-List-Task__item-done-backdrop-filter",
          "brightness(1.58) blur(13px)"
        );
      } else {
        document.documentElement.style.setProperty(
          "--SCC-Variables-Block-List-Task__item-done-color",
          "var(--b3-theme-on-background)"
        );
        document.documentElement.style.setProperty(
          "--SCC-Variables-Block-List-Task__item-done-backdrop-filter",
          "none"
        );
      }
    }
  );
  checkedChange(
    document.getElementById("SC_winsay_cp_editor__FocusEnhanc_inlineCode"),
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-Block-Inline-span__code__before-content",
        "'<'"
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-Block-Inline-span__code__after-content",
        "'>'"
      );
    },
    () => {
      document.documentElement.style.removeProperty(
        "--SCC-Variables-Block-Inline-span__code__before-content"
      );
      document.documentElement.style.removeProperty(
        "--SCC-Variables-Block-Inline-span__code__after-content"
      );
    }
  );
  checkedChange(
    document.getElementById("SC_winsay_cp_editor__FocusEnhanc_refWave"),
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-span-ref-animation-icon",
        "var(--SCC-baseComponent-span-ref-animation-icon)"
      );
    },
    () => {
      document.documentElement.style.removeProperty(
        "--SCC-Variables-span-ref-animation-icon"
      );
    }
  );
  // checkedChange(
  //   document.getElementById("SC_winsay_cp_editor__FocusEnhanc_docReadOnly"),
  //   () => {
  //     document.documentElement.style.setProperty(
  //       "--SCC-Variables-docReadOnly-hover-bg-color",
  //       "#cccccc13"
  //     );
  //   },
  //   () => {
  //     document.documentElement.style.setProperty(
  //       "--SCC-Variables-docReadOnly-hover-bg-color",
  //       "inherit"
  //     );
  //   }
  // );

  checkedChange(
    document.getElementById("SC_winsay_cp_editor__FocusEnhanc_NodeHeading"),
    () => {
      window.funs.updateStyle(
        "FocusEnhanc_NodeHeading",
        `/appearance/themes/Sofill-/style/sweet/sugar/editor/NodeHeading-FocusEnhanc.css`
      );
    },
    () => {
      API.removejscssfile(
        `${config.winsay_ROOT}style/sweet/sugar/editor/NodeHeading-FocusEnhanc.css`,
        "css"
      );
    }
  );
  checkedChange(
    document.getElementById(
      "SC_winsay_cp_editor__FocusEnhanc_BlockHoverShadow"
    ),
    () => {
      window.funs.updateStyle(
        "FocusEnhanc_BlockHoverShadow",
        `/appearance/themes/Sofill-/style/sweet/sugar/editor/BlockHoverShadow.css`
      );
    },
    () => {
      API.removejscssfile(
        `${config.winsay_ROOT}style/sweet/sugar/editor/BlockHoverShadow.css`,
        "css"
      );
    }
  );
  checkedChange(
    document.getElementById(
      "SC_winsay_cp_editor__FocusEnhanc_SearchInputShadow"
    ),
    () => {
      window.funs.updateStyle(
        "SearchInputShadow",
        `/appearance/themes/Sofill-/style/sweet/sugar/editor/SearchInputShadow.css`
      );
    },
    () => {
      API.removejscssfile(
        `${config.winsay_ROOT}style/sweet/sugar/editor/SearchInputShadow.css`,
        "css"
      );
    }
  );
  checkedChange(
    document.getElementById("SC_winsay_cp_editor__NodeHeadingFoldedShadow"),
    () => {
      window.funs.updateStyle(
        "NodeHeadingFoldedShadow",
        `/appearance/themes/Sofill-/style/sweet/sugar/editor/NodeHeading-foldedShadow.css`
      );
    },
    () => {
      API.removejscssfile(
        `${config.winsay_ROOT}style/sweet/sugar/editor/NodeHeading-foldedShadow.css`,
        "css"
      );
    }
  );
  checkedChange(
    document.getElementById("SC_winsay_cp_editor__ShowBreadcrumbAnytime"),
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-breadcrumb--hide-opacity",
        "1"
      );
    },
    () => {
      document.documentElement.style.removeProperty(
        "--SCC-Variables-breadcrumb--hide-opacity"
      );
    }
  );
  checkedChange(
    document.getElementById("SC_winsay_cp_editor__showDocCreatedDate"),
    () => {
      window.funs.loadScript(
        window.funs.addURLParam(
          "/appearance/themes/Sofill-/script/sweet/sugar/ShowDocCreatedDate.js"
        ),
        undefined,
        true
      );
    },
    () => {
      API.removejscssfile(
        `${config.winsay_ROOT}script/sweet/sugar/ShowDocCreatedDate.js`,
        "js"
      );
    }
  );
  propChange("SC_winsay_cp_editor__HintHintMaxWidth", function () {
    var i = localStorage.getItem("SC_winsay_cp_editor__HintHintMaxWidth");
    if (!API.isEmpty(i)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-HintHint-MaxWidth",
        `${i}`
      );
    }
  });
  propChange("SC_winsay_cp_editor__HintHintMaxHeight", function () {
    var i = localStorage.getItem("SC_winsay_cp_editor__HintHintMaxHeight");
    if (!API.isEmpty(i)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-HintHint-MaxHeight",
        `${i}`
      );
    }
  });
}

async function CP_AppearanceMonitor() {
  if (config.clientMode != "body--mobile") {
    checkedChange(
      document.getElementById("SC_winsay_cp_appearance__CoolToolBar"),
      () => {
        API.MoveDOM("#barTopHelp", "#sc_drawer");
        API.MoveDOM("#toolbarVIP", "#sc_drawer");
        API.CopyDOM("#barMode", "#sc_drawer");
        document.querySelector("#toolbar #barMode").style.width = "0";
        document.querySelector("#toolbar #barMode").style.padding = "0";
      },
      () => {
        document
          .querySelector("#barSetting")
          .insertAdjacentElement(
            "afterend",
            document.querySelector("#barTopHelp")
          );
        document
          .querySelector("#toolbar")
          .insertAdjacentElement(
            "afterbegin",
            document.querySelector("#toolbarVIP")
          );
        let old = document.querySelector("#sc_drawer #barMode");
        old ? old.remove() : null;
        document.querySelector("#toolbar #barMode").style.width = "auto";
        document.querySelector("#toolbar #barMode").style.padding = "9px";
      }
    );

    checkedChange(
      document.getElementById("SC_winsay_cp_appearance__DockBgColorFilter"),
      () => {
        document
          .querySelector("#dockLeft")
          .style.setProperty(
            "background-image",
            "linear-gradient(to top,#cccccc16,#ffffff06)"
          );
        document
          .querySelector("#dockRight")
          .style.setProperty(
            "background-image",
            "linear-gradient(to top left,#cccccc16,#ffffff06)"
          );
        document
          .querySelector("#status")
          .style.setProperty(
            "background-image",
            "linear-gradient(to top right,#cccccc16,#ffffff06)"
          );
      },
      () => {
        document
          .querySelector("#dockLeft")
          .style.removeProperty("background-image");
        document
          .querySelector("#dockRight")
          .style.removeProperty("background-image");
        document
          .querySelector("#status")
          .style.removeProperty("background-image");
      }
    );
  }
  propChange("SC_winsay_cp_appearance__TabBarSize", function () {
    var i = localStorage.getItem("SC_winsay_cp_appearance__TabBarSize");
    if (!API.isEmpty(i)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-TabBar-FontSize",
        i
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-TabBar-MinHeight",
        parseInt(i) * 3
      );
    }
  });
  propChange("SC_winsay_cp_appearance__TabBarStyleFeel", function () {
    var i = localStorage.getItem("SC_winsay_cp_appearance__TabBarStyleFeel");
    if (!API.isEmpty(i)) {
      switch (i) {
        case "3":
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-item__focus-box-shadow",
            "rgba(131, 131, 131, 0.4) 0px 2px 4px, rgba(131, 131, 131, 0.3) 0px 7px 3px -3px, rgba(131, 131, 131, 0.2) 0px -3px 0px inset"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-item-box-shadow",
            "rgba(131, 131, 131, 0.4) 0px 2px 4px, rgba(131, 131, 131, 0.3) 0px 7px 3px -3px, rgba(131, 131, 131, 0.2) 0px -3px 0px inset"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-V__item-box-shadow",
            "rgb(131 131 131 / 30%) 0px 1px 1px, rgb(131 131 131 / 20%) 0px 2px 2px -2px, rgb(131 131 131 / 20%) 0px -1px 0px inset"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-border-bottom",
            "2px ridge var(--b3-theme-primary-light)"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-margin-bottom",
            "3px"
          );
          break;
        case "2":
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-item__focus-box-shadow",
            "rgba(131, 131, 131, 0.4) 0px 2px 4px, rgba(131, 131, 131, 0.3) 0px 7px 3px -3px, rgba(131, 131, 131, 0.2) 0px -3px 0px inset"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-item-box-shadow",
            "rgba(131, 131, 131, 0.4) 0px 2px 4px, rgba(131, 131, 131, 0.3) 0px 7px 3px -3px, rgba(131, 131, 131, 0.2) 0px -3px 0px inset"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-V__item-box-shadow",
            "rgb(131 131 131 / 30%) 0px 1px 1px, rgb(131 131 131 / 20%) 0px 2px 2px -2px, rgb(131 131 131 / 20%) 0px -1px 0px inset"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-border-bottom",
            "none"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-margin-bottom",
            "3px"
          );
          break;
        case "1":
        default:
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-item__focus-box-shadow",
            "rgb(131 131 131 / 1%) -1px 1px 1px, rgb(131 131 131 / 11%) -1px -2px 13px -1px, rgb(131 131 131 / 3%) 0px -1px 0px inset"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-item-box-shadow",
            "rgb(131 131 131 / 1%) -1px 1px 1px, rgb(131 131 131 / 11%) -1px -2px 13px -1px, rgb(131 131 131 / 3%) 0px -1px 0px inset"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-V__item-box-shadow",
            "none"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-border-bottom",
            "1px solid var(--b3-theme-primary-light)"
          );
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar-margin-bottom",
            "0px"
          );
          break;
      }
    } else {
      document.documentElement.style.setProperty(
        "--SCC-Variables-BlockList__beforeColor",
        "var(--b3-theme-surface-lighter)"
      );
    }
  });
  propChange("SC_winsay_cp_appearance__TabBar_item__textShadow", function () {
    var i = localStorage.getItem(
      "SC_winsay_cp_appearance__TabBar_item__textShadow"
    );
    if (!API.isEmpty(i)) {
      switch (i) {
        case "2":
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar_item__textShadow",
            "-1px 1px 13px var(--SCC-Orange-Windom)"
          );
          break;
        case "1":
        default:
          document.documentElement.style.setProperty(
            "--SCC-Variables-TabBar_item__textShadow",
            "none"
          );
          break;
      }
    }
  });
  propChange("SC_winsay_cp_appearance__TabBarMode", function () {
    var i = localStorage.getItem("SC_winsay_cp_appearance__TabBarMode");
    var j = API.isEmpty(i) ? "MI-TabBar-D.css" : i;
    window.funs.updateStyle(
      "TabBar",
      `/appearance/themes/Sofill-/style/sweet/${j}`
    );
  });
  checkedChange(
    document.getElementById("SC_winsay_cp_appearance__TabBarV_AutoFolded"),
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-TabBarV_Auto-width",
        "2rem"
      );
    },
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-TabBarV_Auto-width",
        "max(186px, 13vw)"
      );
    }
  );
  checkedChange(
    document.getElementById("SC_winsay_cp_appearance__ToolBarMode"),
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-height-max",
        "11px"
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-child-visibility",
        "hidden"
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-svg-height",
        `0px`
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-svg-hover-height",
        `14px`
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-docName-opacity",
        `0`
      );
    },
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-height-max",
        "unset"
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-child-visibility",
        "visible"
      );
      var h = localStorage.getItem(
        "SC_winsay_cp_appearance__ToolBarMode__height"
      );
      if (!API.isEmpty(h)) {
        document.documentElement.style.setProperty(
          "--SCC-Variables-MI-ToolBar-height",
          h
        );
        document.documentElement.style.setProperty(
          "--SCC-Variables-MI-ToolBar-svg-height",
          `${parseInt(h) / 2 + 1}px`
        );
        document.documentElement.style.setProperty(
          "--SCC-Variables-MI-ToolBar-svg-hover-height",
          `${parseInt(h) / 2 + 1}px`
        );
      } else {
        document.documentElement.style.setProperty(
          "--SCC-Variables-MI-ToolBar-height",
          `26px`
        );
        document.documentElement.style.setProperty(
          "--SCC-Variables-MI-ToolBar-svg-height",
          `14px`
        );
        document.documentElement.style.setProperty(
          "--SCC-Variables-MI-ToolBar-svg-hover-height",
          `14px`
        );
      }
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-docName-opacity",
        `0.77`
      );
    }
  );
  propChange("SC_winsay_cp_appearance__ToolBarMode__height", function () {
    var h = localStorage.getItem(
      "SC_winsay_cp_appearance__ToolBarMode__height"
    );
    if (!API.isEmpty(h)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-height",
        h
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-svg-height",
        `${parseInt(h) / 2 + 1}px`
      );
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-svg-hover-height",
        `${parseInt(h) / 2 + 1}px`
      );
    }
  });
  propChange(
    "SC_winsay_cp_appearance__ToolBarMode__NotFocus__bgColor",
    function () {
      var h = localStorage.getItem(
        "SC_winsay_cp_appearance__ToolBarMode__NotFocus__bgColor"
      );
      if (!API.isEmpty(h)) {
        document.documentElement.style.setProperty(
          "--b3-toolbar-background",
          h
        );
      }
    }
  );
  checkedChange(
    document.getElementById(
      "SC_winsay_cp_appearance__ToolBarMode__HideList__docName"
    ),
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-docName-opacity",
        "0"
      );
    },
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-docName-opacity",
        "0.77"
      );
    }
  );
  checkedChange(
    document.getElementById(
      "SC_winsay_cp_appearance__ToolBarMode__HideList__VIP"
    ),
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-VIP-opacity",
        "0"
      );
    },
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-VIP-opacity",
        "0.77"
      );
    }
  );
  checkedChange(
    document.getElementById(
      "SC_winsay_cp_appearance__ToolBarMode__HideList__windowX"
    ),
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-windowX-opacity",
        "0"
      );
    },
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-windowX-opacity",
        "0.77"
      );
    }
  );
  checkedChange(
    document.getElementById(
      "SC_winsay_cp_appearance__ToolBarMode__HideList__Other"
    ),
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-Other-opacity",
        "0"
      );
    },
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-ToolBar-Other-opacity",
        "0.77"
      );
    }
  );
  checkedChange(
    document.getElementById("SC_winsay_cp_appearance__ShowWebIcon"),
    () => {
      window.funs.updateStyle(
        "ShowWebIcon",
        `/appearance/themes/Sofill-/style/link/web.css`
      );
    },
    () => {
      API.removejscssfile(`${config.winsay_ROOT}style/link/web.css`, "css");
    }
  );
  checkedChange(
    document.getElementById("SC_winsay_cp_appearance__ShowFileIcon"),
    () => {
      window.funs.updateStyle(
        "ShowFileIcon",
        `/appearance/themes/Sofill-/style/link/file.css`
      );
    },
    () => {
      API.removejscssfile(`${config.winsay_ROOT}style/link/file.css`, "css");
    }
  );
  propChange("SC_winsay_cp_appearance__status_msg_opacity", function () {
    var i = localStorage.getItem("SC_winsay_cp_appearance__status_msg_opacity");
    if (!API.isEmpty(i)) {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-status__msg_opacity",
        i
      );
    }
  });
  checkedChange(
    document.getElementById(
      "SC_winsay_cp_appearance__strengthen_backlinkList_panel_border"
    ),
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-backlinkList_panel_box-shadow",
        "rgb(6 24 44 / 8%) -31px -13px 131px 12px, rgb(186 186 186 / 22%) 12px -23px 111px -5px inset"
      );
    },
    () => {
      document.documentElement.style.removeProperty(
        "--SCC-Variables-backlinkList_panel_box-shadow"
      );
    }
  );
  checkedChange(
    document.getElementById(
      "SC_winsay_cp_appearance__strengthen_layout-tab-container"
    ),
    () => {
      document.documentElement.style.setProperty(
        "--SCC-Variables-MI-LayoutTabContainer_bgColor",
        "linear-gradient(95deg, transparent, var(--b3-theme-surface-lighter), transparent)"
      );
    },
    () => {
      document.documentElement.style.removeProperty(
        "--SCC-Variables-MI-LayoutTabContainer_bgColor"
      );
    }
  );
}

async function CP_Monitors() {
  await CP_EditorMonitor();
  await CP_AppearanceMonitor();
}

setTimeout(async () => {
  await CP_Monitors();
});

propChange("SC_winsay_cp_search__about_checkTime", function () {
  var i = localStorage.getItem("SC_winsay_cp_search__about_checkTime");
  if (!API.isEmpty(i)) {
    switch (i) {
      case "Once":
        if (
          document.querySelector("#SC-CP").style.display == "none" &&
          localStorage.getItem(
            "SC_winsay_cp_search__about_AutoCheckSilently"
          ) != "true"
        ) {
          setTimeout(() => {
            checkUpdate(false);
          }, 3100);
        } else {
          setTimeout(() => {
            checkUpdate(true);
          }, 3100);
        }
        break;
      default:
        break;
    }
  }
});
propChange("SC_winsay_cp_custom__EXTmaxOpenTabCount", function () {
  var i = localStorage.getItem("SC_winsay_cp_custom__EXTmaxOpenTabCount");
  if (!API.isEmpty(i)) {
    let o = localStorage.getItem(
      "SC_winsay_cp_custom__EXTmaxOpenTabCount__origin"
    );
    if (API.isEmpty(o)) {
      localStorage.setItem(
        "SC_winsay_cp_custom__EXTmaxOpenTabCount__origin",
        window.siyuan.config.fileTree.maxOpenTabCount
      );
    }
    window.siyuan.config.fileTree.maxOpenTabCount = parseInt(i);
  } else {
    let o = localStorage.getItem(
      "SC_winsay_cp_custom__EXTmaxOpenTabCount__origin"
    );
    if (!API.isEmpty(o)) {
      window.siyuan.config.fileTree.maxOpenTabCount = parseInt(o);
      localStorage.removeItem(
        "SC_winsay_cp_custom__EXTmaxOpenTabCount__origin"
      );
    }
  }
});
propChange("SC_winsay_cp_custom__root_filter_light", function () {
  var i = localStorage.getItem("SC_winsay_cp_custom__root_filter_light");
  if (!API.isEmpty(i)) {
    switch (i) {
      case "5":
        document.documentElement.style.setProperty(
          "--SCC-Variables-root-filter-light",
          "brightness(0.6) opacity(0.85) grayscale(0.13) saturate(1.31) contrast(1.31)"
        );
        break;
      case "4":
        document.documentElement.style.setProperty(
          "--SCC-Variables-root-filter-light",
          "brightness(0.7) opacity(0.88) grayscale(0.3) saturate(1.31) contrast(1.86)"
        );
        break;
      case "3":
        document.documentElement.style.setProperty(
          "--SCC-Variables-root-filter-light",
          "brightness(0.9) grayscale(1) contrast(1.1)"
        );
        break;
      case "2":
        document.documentElement.style.setProperty(
          "--SCC-Variables-root-filter-light",
          "saturate(1.3) brightness(0.77) contrast(1.58)"
        );
        break;
      case "1":
        document.documentElement.style.setProperty(
          "--SCC-Variables-root-filter-light",
          "brightness(0.9) saturate(1.31) contrast(1.31)"
        );
        break;
      case "none":
      default:
        document.documentElement.style.setProperty(
          "--SCC-Variables-root-filter-light",
          "none"
        );
        break;
    }
  }
});
propChange("SC_winsay_cp_custom__root_filter_dark", function () {
  var i = localStorage.getItem("SC_winsay_cp_custom__root_filter_dark");
  if (!API.isEmpty(i)) {
    switch (i) {
      case "5":
        document.documentElement.style.setProperty(
          "--SCC-Variables-root-filter-dark",
          "invert(77%) contrast(1.13) brightness(0.99)"
        );
        break;
      case "4":
        document.documentElement.style.setProperty(
          "--SCC-Variables-root-filter-dark",
          "brightness(0.58) opacity(0.98) saturate(1.38) contrast(0.97)"
        );
        break;
      case "3":
        document.documentElement.style.setProperty(
          "--SCC-Variables-root-filter-dark",
          "brightness(0.9) grayscale(1) contrast(1.1)"
        );
        break;
      case "2":
        document.documentElement.style.setProperty(
          "--SCC-Variables-root-filter-dark",
          "saturate(1.58) brightness(1.05) contrast(0.95)"
        );
        break;
      case "1":
        document.documentElement.style.setProperty(
          "--SCC-Variables-root-filter-dark",
          "brightness(1.05) saturate(1.13) contrast(1.03)"
        );
        break;
      case "none":
      default:
        document.documentElement.style.setProperty(
          "--SCC-Variables-root-filter-dark",
          "none"
        );
        break;
    }
  }
});

propChange("SC_winsay_cp_custom__defaultS", function () {
  var i = localStorage.getItem("SC_winsay_cp_custom__defaultS");
  if (!API.isEmpty(i)) {
    localStorage.removeItem("SC_winsay_cp_custom__defaultS_auto");
    if (window.funs.getThemeMode) {
      let writeData = `@import url("preview-base-light.css"); @import url("${i}");`;
      fs
        ? fs.writeFile(
            `${config.S2_BASE_ABS}defaultS.css`,
            writeData,
            "utf-8",
            function (err) {
              if (err) {
                console.error(err);
              } else {
                console.log("Write successfully~~");
              }
            }
          )
        : console.log("platform not supported");
    }
  } else {
    localStorage.setItem("SC_winsay_cp_custom__defaultS_auto", "true");
    let writeData = `@import url("preview-base-light.css"); @import url("${localStorage
      .getItem("SC_winsay_cp_custom__LS")
      .replace("root", "preview")}");`;
    fs
      ? fs.writeFile(
          `${config.S2_BASE_ABS}defaultS.css`,
          writeData,
          "utf-8",
          function (err) {
            if (err) {
              console.error(err);
            } else {
              console.log("Write successfully~~");
            }
          }
        )
      : console.log("platform not supported");
  }
});
propChange("SC_winsay_cp_custom__LS", function () {
  var i = localStorage.getItem("SC_winsay_cp_custom__LS");
  if (window.funs.getThemeMode == "light" && !API.isEmpty(i)) {
    localStorage.setItem(config.latest_LC_ID, i);
    iterLC();
  }
});
propChange("SC_winsay_cp_custom__DS", function () {
  var i = localStorage.getItem("SC_winsay_cp_custom__DS");
  if (window.funs.getThemeMode == "dark" && !API.isEmpty(i)) {
    localStorage.setItem(config.latest_DC_ID, i);
    iterDC();
  }
});

propChange("SC_winsay_cp_search__layout", function () {
  var i = localStorage.getItem("SC_winsay_cp_search__layout");
  if (API.isEmpty(i) && document.getElementById("search__layout")) {
    document.getElementById("search__layout").remove();
  } else {
    window.funs.updateStyle(
      "search__layout",
      `/appearance/themes/Sofill-/style/sweet/sugar/search/${i}`
    );
  }
});

checkedChange(
  document.getElementById("SC_winsay_cp_filetree__Hide_untitle"),
  () => {
    document.documentElement.style.setProperty(
      "--SCC-Variables-MI-DocTree-Untitle-opacity",
      "0"
    );
  },
  () => {
    document.documentElement.style.setProperty(
      "--SCC-Variables-MI-DocTree-Untitle-opacity",
      "1"
    );
  }
);
checkedChange(
  document.getElementById("SC_winsay_cp_filetree__Hide_item_action_more"),
  () => {
    document.documentElement.style.setProperty(
      "--SCC-Variables-MI-DocTree-item-action-more-display",
      "none"
    );
  },
  () => {
    document.documentElement.style.removeProperty(
      "--SCC-Variables-MI-DocTree-item-action-more-display"
    );
  }
);
checkedChange(
  document.getElementById("SC_winsay_cp_filetree__ChangeIconAvailability"),
  () => {
    document.documentElement.style.setProperty(
      "--SCC-Variables-ChangeIconAvailability",
      "none"
    );
  },
  () => {
    document.documentElement.style.removeProperty(
      "--SCC-Variables-ChangeIconAvailability"
    );
  }
);
checkedChange(
  document.getElementById("SC_winsay_cp_filetree__DyeingNameAvailability"),
  () => {
    document.documentElement.style.removeProperty(
      "--SCC-Variables-DyeingName-Notebook"
    );
    document.documentElement.style.removeProperty(
      "--SCC-Variables-DyeingName-Doc"
    );
  },
  () => {
    document.documentElement.style.setProperty(
      "--SCC-Variables-DyeingName-Notebook",
      "var(--SCC-baseComponent-text-color-2)"
    );
    document.documentElement.style.setProperty(
      "--SCC-Variables-DyeingName-Doc",
      "var(--SCC-baseComponent-text-color-1)"
    );
  }
);
checkedChange(
  document.getElementById("SC_winsay_cp_search__index"),
  () => {
    window.funs.updateStyle(
      "search__index",
      `/appearance/themes/Sofill-/style/sweet/sugar/search/index.css`
    );
  },
  () => {
    API.removejscssfile(
      `${config.winsay_ROOT}style/sweet/sugar/search/index.css`,
      "css"
    );
  }
);

checkedChange(
  document.getElementById("SC_winsay_cp_filetree__Adaptive_display"),
  () => {
    window.funs.updateStyle(
      "MI-DocTree-Adaptive",
      `/appearance/themes/Sofill-/style/sweet/MI-DocTree-Adaptive.css`
    );
    document
      .getElementById("BP__SC_winsay_cp_filetree__Adaptive_display")
      .classList.add("fn__none");
  },
  () => {
    API.removejscssfile(
      `${config.winsay_ROOT}style/sweet/MI-DocTree-Adaptive.css`,
      "css"
    );
    document
      .getElementById("BP__SC_winsay_cp_filetree__Adaptive_display")
      .classList.remove("fn__none");
  }
);

propChange("SC_winsay_cp_filetree__docFontsize", function () {
  var i = localStorage.getItem("SC_winsay_cp_filetree__docFontsize");
  if (!API.isEmpty(i)) {
    document.documentElement.style.setProperty(
      "--SCC-Variables-MI-DocTree-docFontsize",
      `${i}pt`
    );
    document
      .getElementById("SC_winsay_cp_filetree__docFontsize__label")
      .setAttribute("aria-label", `${i}`);
    localStorage.setItem("SC_winsay_cp_filetree__docFontsize__label", i);
  }
});
propChange("SC_winsay_cp_filetree__nbFontsize", function () {
  var i = localStorage.getItem("SC_winsay_cp_filetree__nbFontsize");
  if (!API.isEmpty(i)) {
    document.documentElement.style.setProperty(
      "--SCC-Variables-MI-DocTree-nbFontsize",
      `${i}pt`
    );
    document
      .getElementById("SC_winsay_cp_filetree__nbFontsize__label")
      .setAttribute("aria-label", `${i}`);
    localStorage.setItem("SC_winsay_cp_filetree__nbFontsize__label", i);
  }
});
propChange("SC_winsay_cp_filetree__nbMargin", function () {
  var i = localStorage.getItem("SC_winsay_cp_filetree__nbMargin");
  if (!API.isEmpty(i)) {
    document.documentElement.style.setProperty(
      "--SCC-Variables-MI-DocTree-nbMargin",
      `${i}em`
    );
    document
      .getElementById("SC_winsay_cp_filetree__nbMargin__label")
      .setAttribute("aria-label", `${i}`);
    localStorage.setItem("SC_winsay_cp_filetree__nbMargin__label", i);
  }
});

checkedChange(
  document.getElementById("SC_winsay_cp_system__SelfProtection"),
  () => {
    let SelfProtectionDialog = null;
    t_SelfProtector ? clearInterval(t_SelfProtector) : null;
    t_SelfProtector = setInterval(async () => {
      if (window.siyuan.config.appearance.hideStatusBar) {
        if (document.getElementById("Info") == null) {
          SelfProtectionDialog = new ConfirmDialog({
            isCancel: true,
            dragable: false,
            XML: CD.ConfirmDialog6,
            success() {
              console.log("点击了确定");
              let o = false;
              if (
                document.querySelector(
                  '.b3-tab-bar:not(.sc-custom-nav) [data-name="appearance"]'
                ) == null
              ) {
                o = true;
              }
              o ? document.querySelector("#toolbar #barSetting").click() : null;
              document
                .querySelector(
                  '.b3-tab-bar:not(.sc-custom-nav) [data-name="appearance"]'
                )
                .click();
              setTimeout(() => {
                document.querySelector(`#hideStatusBar`).click();
              }, 200);
              o
                ? setTimeout(() => {
                    document.elementFromPoint(1, 1).click();
                  }, 200)
                : null;
            },
            cancel() {
              console.log("点击了取消");
            },
            maskable: true,
          });
        }
        SelfProtectionDialog
          ? await SelfProtectionDialog.open(() => {
              document.getElementById(
                "Info"
              ).innerHTML = `检测到底部状态栏被隐藏，主题设置入口不可用！是否立即开启？`;
              document.getElementById(
                "CoverWarming"
              ).innerHTML = `若要禁用此提醒，请在主题设置中关闭【主题自我保护】`;
            })
          : null;
      }
    }, 30000);
  },
  () => {
    t_SelfProtector ? clearInterval(t_SelfProtector) : null;
  }
);

checkedChange(
  document.getElementById("SC_winsay_cp__exportData__EXT_sy_editor"),
  () => {},
  () => {}
);
checkedChange(
  document.getElementById("SC_winsay_cp__exportData__EXT_sy_keymap"),
  () => {},
  () => {}
);
checkedChange(
  document.getElementById("SC_winsay_cp_search__about_AutoCheckSilently"),
  () => {},
  () => {}
);
