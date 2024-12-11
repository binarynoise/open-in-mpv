#!/bin/sh
set -ex

# When the addon is installed or updated, there is one last thing to do.
# To use the extension, run the following commands in your terminal:

if [ -f mpv-scheme-handler.desktop ]; then
    cp -f mpv-scheme-handler.desktop ~/.local/share/applications/mpv-scheme-handler.desktop
else
    curl -sSf "https://raw.githubusercontent.com/binarynoise/open-in-mpv/main/mpv-scheme-handler.desktop" >~/.local/share/applications/mpv-scheme-handler.desktop
fi

xdg-mime default mpv-scheme-handler.desktop x-scheme-handler/mpv

set +ex
