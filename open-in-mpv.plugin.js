/**
 * @name open in mpv
 * @author binarynoise
 * @description Use the context menu to open a video in mpv.
 * @version 1.1.0
 */


const settings = { showAgain: true };

const contextMenuPatch = (tree, context) => {
    const href = context.target.href || context.target.parentNode.href
    
    if (href !== undefined) {
        tree.props.children.push(BdApi.ContextMenu.buildItem({
            type: "separator",
        }))
        tree.props.children.push(BdApi.ContextMenu.buildItem({
            type: "text", label: "open in mpv", action: () => {
                console.log("link is " + href);
                const electron = require('electron');
                
                electron.shell.openExternal('mpv://' + href).then(() => {
                    if (settings.showAgain !== false) {
                        BdApi.UI.showConfirmationModal("Open in mpv",
                            "Successfully opened " + href + " in mpv. Did nothing happen? Download and run setup.sh",
                            {
                                confirmText: "Download setup.sh", onConfirm: () => {
                                    electron.shell.openExternal('https://raw.githubusercontent.com/binarynoise/open-in-mpv/main/setup.sh');
                                },
                                
                                cancelText: "Ok, don't show again", onCancel: () => {
                                    settings.showAgain = false;
                                    BdApi.Data.save("open-in-mpv", "settings", settings);
                                },
                            })
                    } else {
                        BdApi.UI.showToast("" + href + " opened in mpv.", { type: "success" });
                    }
                    console.log("success");
                }, (error) => {
                    console.log("failed to open mpv://" + href);
                    console.log(error);
                }).catch((error) => {
                    console.log("failed to open mpv://" + href);
                    console.log(error);
                })
            },
        }))
    }
};

document.createSvgElement = (name) => { return document.createElementNS("http://www.w3.org/2000/svg", name) };

function buildCheckboxSetting(text, key, callback = () => {}) {
    const setting = document.createElement("div");
    setting.className = "flex_f5fbb7 vertical__1e37a justifyStart__42744 alignStretch_e239ef noWrap__5c413";
    setting.style.flex = "1 1 auto";
    
    const rowWrapper = document.createElement("div");
    rowWrapper.className = "flex_f5fbb7 horizontal__992f6 justifyStart__42744 alignStart__4fe1e noWrap__5c413";
    rowWrapper.style.flex = "1 1 auto";
    
    const titleWrapper = document.createElement("div");
    titleWrapper.className = "flexChild__6e093";
    titleWrapper.style.flex = "1 1 auto";
    
    const title = document.createElement("div");
    title.className = "title__28a65";
    title.textContent = text;
    
    const switchWrapper = document.createElement("div");
    switchWrapper.className = "bd-switch";
    if (settings[key]) switchWrapper.classList.add("bd-switch-checked");
    
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = settings[key];
    
    input.addEventListener("change", () => {
        const newValue = input.checked;
        if (newValue) switchWrapper.classList.add("bd-switch-checked"); else switchWrapper.classList.remove("bd-switch-checked");
        settings[key] = newValue;
        BdApi.Data.save("open-in-mpv", "settings", settings);
        callback(newValue);
    });
    
    const switchBody = document.createElement("div");
    switchBody.className = "bd-switch-body";
    
    const switchSlider = document.createSvgElement("svg");
    switchSlider.setAttribute("class", "bd-switch-slider");
    switchSlider.setAttribute("viewBox", "0 0 28 20");
    switchSlider.setAttribute("preserveAspectRatio", "xMinYMid meet");
    
    const handle = document.createSvgElement("rect");
    handle.setAttribute("class", "bd-switch-handle");
    handle.setAttribute("fill", "white");
    handle.setAttribute("x", "4");
    handle.setAttribute("y", "0");
    handle.setAttribute("height", "20");
    handle.setAttribute("width", "20");
    handle.setAttribute("rx", "10");
    
    const symbol = document.createSvgElement("svg");
    symbol.setAttribute("class", "bd-switch-symbol");
    symbol.setAttribute("viewBox", "0 0 20 20");
    symbol.setAttribute("fill", "none");
    
    symbol.append(document.createSvgElement("path"), document.createSvgElement("path"));
    switchSlider.append(handle, symbol);
    switchBody.append(switchSlider);
    switchWrapper.append(input, switchBody);
    titleWrapper.append(title);
    rowWrapper.append(titleWrapper, switchWrapper);
    setting.append(rowWrapper);
    
    return setting;
}

// noinspection JSUnusedGlobalSymbols
module.exports = () => ({
    start() {
        const saved = BdApi.Data.load("open-in-mpv", "settings");
        if (saved && !isEmpty(saved)) Object.assign(settings, saved);
        BdApi.ContextMenu.patch("message", contextMenuPatch);
    }, stop() {
        BdApi.ContextMenu.unpatch("message", contextMenuPatch);
    }, getSettingsPanel: () => {
        const mySettingsPanel = Object.assign(document.createElement("div"));
        
        mySettingsPanel.append(buildCheckboxSetting("Show Dialog", "showAgain"));
        
        return mySettingsPanel;
    },
});

function isEmpty(obj) {
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    
    return true
}
