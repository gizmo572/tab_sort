
document.addEventListener('DOMContentLoaded', () => {
  const sortTabsBTN = document.querySelector('button#sort_tabs');
  const arrangeWindowsBTN = document.querySelector('button#arrange_windows');
  const cycleWindowsBTN = document.querySelector('button#cycle_windows')

  sortTabsBTN.addEventListener('click', () => {
    chrome.runtime.sendMessage('sortTabs');
  });

  arrangeWindowsBTN.addEventListener('click', () => {
    chrome.runtime.sendMessage('arrangeWindows');
  });

  cycleWindowsBTN.addEventListener('click', () => {
    chrome.runtime.sendMessage('cycleWindows');
  })
});
