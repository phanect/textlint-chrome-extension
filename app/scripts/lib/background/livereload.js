/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */
// Use for page reloads

if (LIVERELOAD) {
  const LIVERELOAD_HOST = "localhost";
  const LIVERELOAD_PORT = 35729;
  const connection = new WebSocket(`ws://${LIVERELOAD_HOST}:${LIVERELOAD_PORT}/livereload`);

  connection.onerror = function (error) {
    console.error("reload connection got error:", error);
  };

  connection.onmessage = function (e) {
    if (e.data) {
      const data = JSON.parse(e.data);
      if (data && data.command === "reload") {
        // chrome.runtime.reload();
        // window.location.reload();

        // Using Extensions Reloader
        // https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid
        const reloadUrl = "http://reload.extensions/";
        chrome.tabs.query({ url: reloadUrl }, (tabs) => {
          if (tabs.length === 0) {
            chrome.tabs.create({ url: reloadUrl, active: false });
          }
        });
      }
    }
  };

  console.log("%cLivereload: enabled", "color: gray");
}
