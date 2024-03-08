// import optionsStorage from './options-storage.js';

console.log('💈 Content script loaded for', chrome.runtime.getManifest().name);

// async function init() {
// 	const options = await optionsStorage.getAll();
// 	const color = `rgb(${options.colorRed}, ${options.colorGreen},${options.colorBlue})`;
// 	const text = options.text;
// 	const notice = document.createElement('div');
// 	notice.innerHTML = text;
// 	document.body.prepend(notice);
// 	notice.id = 'text-notice';
// 	notice.style.border = '2px solid ' + color;
// 	notice.style.color = color;
// }

// init();

(new MutationObserver(check)).observe(document, { childList: true, subtree: true });

function trim (str) {
  const result = str.trim();
  return result;
}
function sortMenuItems (section) {
  // for (const section of openSections) {
  const ulElement = section.querySelector('ul');

  if (!ulElement) {
    return; // Skip to the next section if no ul is found
  }

  const listItems = ulElement.querySelectorAll('li');
  const itemsArray = Array.from(listItems);
  itemsArray.sort((a, b) => trim(a.textContent).localeCompare(trim(b.textContent), undefined, { sensitivity: 'base' }));
  ulElement.innerHTML = '';
  itemsArray.forEach(item => ulElement.appendChild(item));
  // }
}

function check (_changes, observer) {
  try {
    const finder = elm => {
      const textContent = elm.querySelector('div.navSection,h5').textContent;
      return ['manage', ''].includes(textContent.toLowerCase().trim());
    };
    const navigationDivs = [
      ...document.querySelectorAll('#digitalocean-shell-container div[role="navigation"] .open-section'),
      ...document.querySelectorAll('.side-nav-section')
    ];

    if (navigationDivs.length === 0) {
      return;
    }
    const menus = navigationDivs.filter(finder);
    if (menus.length !== 0) {
      observer.disconnect();
      menus.forEach(menu => sortMenuItems(menu));
    }
  } catch (e) {
    console.error('sorter extension error', e);
  }
}
