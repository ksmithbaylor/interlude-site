import { ajax } from 'nanoajax';

const cache = {};

for (let link of document.querySelectorAll('nav li a')) {
  link.addEventListener('click', onClick);
}

window.addEventListener('popstate', () => {
  const newPage =
    window.location.pathname.split('.html')[0].slice(1) || 'index';
  onNavigateTo(targetNameFor(newPage), true);
});

function onClick(event) {
  event.preventDefault();
  onNavigateTo(this.parentNode.classList[0]);
}

function onNavigateTo(target, skipUrlUpdate) {
  if (cache[target]) {
    swapMainContents(target, cache[target], skipUrlUpdate);
  } else {
    const url = htmlNameFor(target) + '-main.html';
    ajax({ url }, (code, response) => {
      if (code === 200) {
        cache[target] = response;
        swapMainContents(target, response, skipUrlUpdate);
      } else {
        manuallyGoTo(target);
      }
    });
  }
}

function swapMainContents(target, contents, skipUrlUpdate) {
  if (document.body.className !== target) {
    const main = document.querySelector('main');

    if (main && window.history && window.history.pushState) {
      main.outerHTML = contents;
      document.body.className = target;
      if (!skipUrlUpdate) {
        window.history.pushState(null, null, urlFor(target));
      }
    } else {
      manuallyGoTo(target);
    }
  }
}

function manuallyGoTo(target) {
  document.location = urlFor(target);
}

function urlFor(target) {
  const htmlName = htmlNameFor(target);

  if (htmlName === 'index') {
    return '/';
  }

  if (document.location.host.indexOf('localhost') !== -1) {
    return '/' + htmlNameFor(target) + '.html';
  }

  return '/' + htmlNameFor(target);
}

function htmlNameFor(target) {
  return { about: 'index' }[target] || target;
}

function targetNameFor(htmlName) {
  return { index: 'about' }[htmlName] || htmlName;
}
