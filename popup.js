
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['primaryDisplayNumber'], (result) => {
    document.querySelector('input#display_number').value = result.primaryDisplayNumber;
  })
  const sortTabsBTN = document.querySelector('button#sort_tabs');
  const arrangeWindowsBTN = document.querySelector('button#arrange_windows');
  const carouselBTN = document.querySelector('button#carousel');
  const cycleWindowsBTN = document.querySelector('button#cycle_windows');
  const setPrimaryDisplayBTN = document.querySelector('button#set_primary_display');

  sortTabsBTN.addEventListener('click', () => {
    chrome.runtime.sendMessage('sortTabs');
  });

  arrangeWindowsBTN.addEventListener('click', () => {
    chrome.runtime.sendMessage('arrangeWindows');
  });

  carouselBTN.addEventListener('click', () => {
    chrome.runtime.sendMessage('windowCarousel');
  })

  cycleWindowsBTN.addEventListener('click', () => {
    chrome.runtime.sendMessage('cycleWindows');
  });

  setPrimaryDisplayBTN.addEventListener('click', () => {
    const displayNumber = document.querySelector('input#display_number').value;
    chrome.storage.local.set({ 'primaryDisplayNumber': displayNumber });
  });

});
