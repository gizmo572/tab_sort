

chrome.runtime.onMessage.addListener((request) => {

  // response to user clicking the 'SORT TABS' button
  if (request === 'sortTabs') {
    // create an array of all chrome browser windows and iterate through it
    chrome.windows.getAll({ populate: true }, (windows) => {
      windows.forEach((window) => {
        // create an array of all tabs in the current window, then sort them alphabetically by title
        let tabs = window.tabs.slice();
        tabs.sort((a, b) => a.title.localeCompare(b.title));
        console.log('tabs', tabs)
        // reassign position of each tab in window to its index in the 'tabs' array created above
        tabs.forEach((tab, idx) => {
          chrome.tabs.move(tab.id, { index: idx });
        });
      })


    });
  };
});