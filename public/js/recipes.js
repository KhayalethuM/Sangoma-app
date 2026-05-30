'use strict';

var currentCat    = 'All';
var currentSearch = '';

function applyFilters() {
  var q = currentSearch.toLowerCase();
  var anyVisible = false;
  document.querySelectorAll('.recipe-card').forEach(function(card) {
    var matchCat    = currentCat === 'All' || card.dataset.category === currentCat;
    var matchSearch = card.dataset.name.indexOf(q) !== -1 || card.dataset.ailments.indexOf(q) !== -1;
    var visible = matchCat && matchSearch;
    card.style.display = visible ? '' : 'none';
    if (visible) anyVisible = true;
  });
  document.getElementById('no-results').style.display = anyVisible ? 'none' : 'block';
}

function toggleRecipe(id) {
  var body     = document.getElementById('recipe-body-' + id);
  var chevron  = document.getElementById('chevron-' + id);
  var isOpen   = body.style.display !== 'none';

  // Close all
  document.querySelectorAll('[id^="recipe-body-"]').forEach(function(el) {
    el.style.display = 'none';
  });
  document.querySelectorAll('[id^="chevron-"]').forEach(function(el) {
    el.style.transform = '';
  });

  if (!isOpen) {
    body.style.display = 'block';
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  }
}

document.querySelectorAll('.cat-filter').forEach(function(btn) {
  btn.addEventListener('click', function() {
    currentCat = btn.dataset.value;
    document.querySelectorAll('.cat-filter').forEach(function(b) {
      var active = b.dataset.value === currentCat;
      b.style.background   = active ? 'var(--sage)' : 'white';
      b.style.borderColor  = active ? 'var(--sage)' : 'var(--cream-dark)';
      b.style.color        = active ? 'white'       : 'var(--earth-mid)';
    });
    applyFilters();
  });
});

document.getElementById('search-input').addEventListener('input', function(e) {
  currentSearch = e.target.value.toLowerCase();
  applyFilters();
});
