
document.addEventListener('DOMContentLoaded', () => {
  const sortTabsBTN = document.querySelector('button#sort_tabs');
  const arrangeWindowsBTN = document.querySelector('button#arrange_windows');

  sortTabsBTN.addEventListener('click', () => {
    chrome.runtime.sendMessage('sortTabs');
  });
  arrangeWindowsBTN.addEventListener('click', () => {
    chrome.runtime.sendMessage('arrangeWindows');
  });
});
