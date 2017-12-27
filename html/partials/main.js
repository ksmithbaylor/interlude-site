(function(window) {
  document.querySelectorAll('nav li a').forEach(function(link) {
    link.addEventListener('click', function(event) {
      // event.preventDefault();
      onClickNav(this.parentNode.classList[0]);
    });
  });

  function onClickNav(target) {}
})(window);
