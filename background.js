function onStart() {
  chrome.system.display.getInfo(async (displays) => {
    console.log(displays)
    displaysArray = displays;
    displayWidth = await displays[0].bounds.width;
    displayHeight = await displays[0].bounds.height;
  });  
};

let displayWidth, displayHeight, displaysArray, cycleIndex = 0;

onStart();

chrome.runtime.onMessage.addListener((request) => {

  // response to user clicking the 'SORT TABS' button
  if (request === 'sortTabs') {
    // create an array of all chrome browser windows and iterate through it
    chrome.windows.getAll({ populate: true }, (windows) => {
      windows.forEach((window) => {
        // create an array of all tabs in the current window, then sort them alphabetically by title
        let tabs = window.tabs.slice();

        tabs.sort((a, b) => a.url.localeCompare(b.url));
        console.log('tabs', tabs)
        // reassign position of each tab in window to its index in the 'tabs' array created above
        tabs.forEach((tab, idx) => {
          chrome.tabs.move(tab.id, { index: idx });
        });
      })
    });
  };

  if (request === 'arrangeWindows') {
    console.log(displayHeight, displayWidth)


    chrome.windows.getAll({ populate: true }, (windows) => {
      let currentLeft = 0;
      let windowWidth;

      if (windows.length <= 3) {
        windowWidth = displayWidth / windows.length;

        windows.forEach(window => {
          chrome.windows.update(window.id, {
            left: currentLeft,
            top: 0,
            width: windowWidth,
            height: displayHeight,
          });
          currentLeft += windowWidth;
        });

      } else if (windows.length <= 6) {
        let rowCount = Math.ceil(windows.length / 2);
        let windowTop = 0;

        windowWidth = displayWidth / rowCount;

        windows.forEach((window, idx) => {
          if (idx === rowCount) {
            currentLeft = 0;
            windowWidth = displayWidth / Math.floor(windows.length / 2);
            windowTop = displayHeight / 2 + 10;
          };

          chrome.windows.update(window.id, {
            left: currentLeft,
            top: windowTop,
            width: windowWidth,
            height: displayHeight / 2 - 10,
          });
          currentLeft += windowWidth;
        });
      };
    });
  };
  if (Array.isArray(request) && request[0] === 'cycleWindows') {
    if (request.length < 2) throw Error('cycleWindows request Array should have a length of 2.')
    const monitorIndex = request[1];
    const display = displaysArray[monitorIndex];
    chrome.windows.getAll({ populate: true }, (windows) => {
      chrome.windows.update(windows[cycleIndex % windows.length].id, {
        left: display.bounds.left,
        top: display.bounds.top,
        width: display.bounds.width,
        height: display.bounds.height,
        focused: true,
      });
    });
    cycleIndex++;
  };

});