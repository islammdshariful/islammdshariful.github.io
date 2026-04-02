(function () {
  var toggle = document.getElementById('darkModeToggle');
  var body = document.body;

  if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
  }

  toggle.addEventListener('click', function () {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
  });
})();
