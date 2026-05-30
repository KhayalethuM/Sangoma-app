'use strict';

function toggleMenu() {
  var menu      = document.getElementById('mobile-menu');
  var iconMenu  = document.getElementById('icon-menu');
  var iconClose = document.getElementById('icon-close');
  var isOpen    = menu.style.display !== 'none';
  menu.style.display      = isOpen ? 'none' : 'flex';
  iconMenu.style.display  = isOpen ? ''     : 'none';
  iconClose.style.display = isOpen ? 'none' : '';
}
