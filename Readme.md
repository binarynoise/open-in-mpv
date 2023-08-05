# open in mpv

A minimalist extension to open the current website or a link in mpv.
You only need to put a .desktop file to `~/.local/share/applications/mpv-scheme-handler.desktop`.

And if you don't have that file installed, you get a shell-script to put it into place.
No more "nothing happens" and no-one knows why!

Inspired by _Open In mpv_ by Leonardo and _ff2mpv_ by yossarian, which require additional binaries installed but don't tell you when they are missing.

## License

Licensed under the EUPL-1.2-or-later

## Installation

### Firefox

Go to !release pending! and install the extension

### Discord

Go to !release pending! and install the extension

## Local (development) installation

### Firefox

1. go to <about:debugging#/runtime/this-firefox>
2. click "load temporary add-on"
3. select the `manifest.json`.

### Chromium:

1. replace `manifest.json` with `manifest-chrome.json`
2. go to <chrome://extensions/>
3. enable developer mode
4. click "load unpacked"
5. select the folder containing this extension.
