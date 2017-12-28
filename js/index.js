import './nanoajax.min.js';

console.log('js loaded');

const links = document.querySelectorAll('nav li a');

for (let link of links) {
  link.addEventListener('click', onClick);
}

function onClick(event) {
  event.preventDefault();
  onNavigateTo(this.parentNode.classList[0]);
}

function onNavigateTo(target) {
  console.log('clicked', target);
}
