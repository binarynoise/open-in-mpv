/**
 * @name open in mpv
 * @author binarynoise
 * @description Use the context menu to open a video in mpv.
 * @version 1.0.2
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

function buildSetting(text, key, type, value, callback = () => {
}) {
    const setting = Object.assign(document.createElement("div"), { className: "setting" });
    const label = Object.assign(document.createElement("span"), { textContent: text, className: "title-2yADjX" });
    const input = Object.assign(document.createElement("input"), { type: type, name: key, value: value });
    if (type === "checkbox") {
        input.classList.add("bd-switch");
        if (value) input.checked = true;
    }
    input.addEventListener("change", () => {
        const newValue = type === "checkbox" ? input.checked : input.value;
        settings[key] = newValue;
        BdApi.Data.save("open-in-mpv", "settings", settings);
        callback(newValue);
    });
    setting.append(label, input);
    return setting;
}

// noinspection JSUnusedGlobalSymbols
module.exports = () => ({
    start() {
        console.log("Open in mpv plugin enabled");
        
        Object.assign(settings, BdApi.Data.load("open-in-mpv", "settings"));
        BdApi.ContextMenu.patch("message", contextMenuPatch);
    }, stop() {
        BdApi.ContextMenu.unpatch("message", contextMenuPatch);
    }, getSettingsPanel: () => {
        const mySettingsPanel = document.createElement("div", { className: "bd-addon-settings-wrap" });
        mySettingsPanel.id = "my-settings";
        
        const showAgain = buildSetting("Show Dialog", "showAgain", "checkbox", settings.showAgain);
        
        mySettingsPanel.append(showAgain);
        return mySettingsPanel;
    }
});
