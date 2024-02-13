function onStart() {
  chrome.system.display.getInfo(async (displays) => {
    console.log(displays)
    displaysArray = displays;
    displayWidth = await displays[0].bounds.width;
    displayHeight = await displays[0].bounds.height;
  });

  chrome.storage.local.get(['primaryDisplayNumber'], (result) => {
    if (!Object.hasOwn(result, 'primaryDisplayNumber')) {
      chrome.storage.local.set({ 'primaryDisplayNumber': 1 });
    };
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

    chrome.windows.getAll({ populate: true }, (windows) => {
      console.log('windows', windows)
      let ratio = windows.length / displaysArray.length;
      console.log('ratio', ratio)

        // 1 or 2 windows per monitor
        let displayIdx = -1, left, width;
        for (let i = 0; i < windows.length; i++) {
          
          // if # of windows remaining is equal to # of displays remaining, move to a new monitor, and leave the window as fullscreen.
          if (windows.length - i < displaysArray.length - displayIdx) {
            displayIdx++;
            width = displaysArray[displayIdx].bounds.width;
            left = displaysArray[displayIdx].bounds.left;

          // if i is even, this indicates the previous window is full, so move to a new monitor. There are more windows than monitors, so reduce width to take up only half the screen width.
          } else if (i % 2 === 0) {
            displayIdx++;
            width = displaysArray[displayIdx].bounds.width / 2;
            left = displaysArray[displayIdx].bounds.left;

          // otherwise, current window must be the 2nd window in the current monitor, so reduce width and increment 'left' so the windows dont overlap.
          } else {
            width = displaysArray[displayIdx].bounds.width / 2;
            left = displaysArray[displayIdx].bounds.left + width;
          }
          chrome.windows.update(windows[i].id, {
            left: left,
            top: displaysArray[displayIdx].bounds.top,
            width: width,
            height: displaysArray[displayIdx].bounds.height,
            focused: true,
          });
        };
    });
  };
  if (request === 'cycleWindows') {
    chrome.windows.getLastFocused((window) => {
      const currentWindow = window.id;
      chrome.storage.local.get(['primaryDisplayNumber'], (result) => {
        if (!Object.hasOwn(result, 'primaryDisplayNumber')) throw Error('primaryDisplayNumber not found in local storage.');
        const monitorIndex = result.primaryDisplayNumber - 1;
        const display = displaysArray[monitorIndex];
        chrome.windows.getAll({ populate: true }, (windows) => {
          console.log('windows', windows, cycleIndex, windows[cycleIndex % windows.length].id === currentWindow, windows[cycleIndex % windows.length].id, currentWindow)
          //if the next window in the cycle is the current active window, skip it
          if (windows[cycleIndex % windows.length].id === currentWindow) cycleIndex++;

          chrome.windows.update(windows[cycleIndex % windows.length].id, {
            left: display.bounds.left,
            top: display.bounds.top,
            width: display.bounds.width,
            height: display.bounds.height,
            focused: true,
          });
          chrome.windows.update(currentWindow, { focused: true });
        });
        cycleIndex++;
      });
    })
  };

});