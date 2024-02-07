
document.addEventListener('DOMContentLoaded', () => {
  const sortTabsBTN = document.querySelector('button#sort_tabs');
  sortTabsBTN.addEventListener('click', () => {
    chrome.runtime.sendMessage('sortTabs')
  })
});
