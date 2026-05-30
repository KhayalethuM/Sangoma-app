'use strict';

var currentFilter = 'All';
var currentSearch = '';

var ICONS = {
  mapPin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  star:   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" stroke-width="1.5" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  phone:  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.62 6.62 19.79 19.79 0 0 1 1.55 1.55 2 2 0 0 1 3.53 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 7.91a16 16 0 0 0 6 6l.27-.27a2 2 0 0 1 2.11-.45c.907.339 1.85.572 2.81.7A2 2 0 0 1 22 16z"/></svg>',
};

function cardHTML(s) {
  var i18n = window.I18N_SANGOMAS;
  var statusBg    = s.available ? '#E8F5E9' : '#FBE9E7';
  var statusColor = s.available ? '#2E7D32' : '#BF360C';
  var statusLabel = s.available ? i18n.available : i18n.busy;
  var langTags = s.languages.map(function(l) {
    return '<span style="font-size:0.75rem;padding:3px 8px;border-radius:4px;background:var(--cream-dark);color:var(--earth-mid);">' + l + '</span>';
  }).join('');
  return (
    '<div style="background:white;border:1px solid var(--cream-dark);border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:12px;">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;">' +
        '<div>' +
          '<h3 style="font-family:\'Cormorant Garamond\',serif;font-size:1.3rem;color:var(--earth);line-height:1.2;">' + s.name + '</h3>' +
          '<div style="display:flex;align-items:center;gap:4px;margin-top:4px;color:var(--earth-light);font-size:0.85rem;">' + ICONS.mapPin + ' ' + s.location + '</div>' +
        '</div>' +
        '<span style="font-size:0.75rem;padding:4px 10px;border-radius:20px;background:' + statusBg + ';color:' + statusColor + ';font-weight:500;white-space:nowrap;">' + statusLabel + '</span>' +
      '</div>' +
      '<div style="background:var(--cream);border-radius:6px;padding:10px 14px;">' +
        '<span style="font-size:0.8rem;color:var(--earth-mid);text-transform:uppercase;letter-spacing:0.05em;">' + s.speciality + '</span>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
        ICONS.star +
        '<span style="font-weight:500;color:var(--earth);font-size:0.9rem;">' + s.rating + '</span>' +
        '<span style="color:var(--earth-light);font-size:0.85rem;">(' + s.reviews + ' ' + i18n.reviews + ')</span>' +
        '<span style="color:var(--earth-light);font-size:0.85rem;margin-left:auto;">' + s.years + ' ' + i18n.yrsExp + '</span>' +
      '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:4px;">' + langTags + '</div>' +
      '<button style="margin-top:auto;width:100%;padding:11px;border-radius:6px;background:var(--earth);color:var(--cream);border:none;cursor:pointer;font-size:0.9rem;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;">' +
        ICONS.phone + ' ' + i18n.contactButton +
      '</button>' +
    '</div>'
  );
}

function renderSangomas() {
  var grid = document.getElementById('sangomas-grid');
  var noResults = document.getElementById('no-results');
  var q = currentSearch.toLowerCase();
  var filtered = window.SANGOMAS.filter(function(s) {
    var matchFilter = currentFilter === 'All' || s.speciality === currentFilter;
    var matchSearch = s.name.toLowerCase().indexOf(q) !== -1 || s.location.toLowerCase().indexOf(q) !== -1;
    return matchFilter && matchSearch;
  });
  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
    grid.innerHTML = filtered.map(cardHTML).join('');
  }
}

document.querySelectorAll('.spec-filter').forEach(function(btn) {
  btn.addEventListener('click', function() {
    currentFilter = btn.dataset.value;
    document.querySelectorAll('.spec-filter').forEach(function(b) {
      var active = b.dataset.value === currentFilter;
      b.style.background   = active ? 'var(--earth)' : 'white';
      b.style.borderColor  = active ? 'var(--earth)' : 'var(--cream-dark)';
      b.style.color        = active ? 'var(--cream)' : 'var(--earth-mid)';
    });
    renderSangomas();
  });
});

document.getElementById('search-input').addEventListener('input', function(e) {
  currentSearch = e.target.value;
  renderSangomas();
});

renderSangomas();
