'use strict';

var selected = [];

var SVG = {
  leaf:     '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  arrow:    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  alert:    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F57F17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  sparkles: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
  rotate:   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
};

function updateUI() {
  var count = selected.length;
  document.getElementById('selected-count').textContent = count;
  document.querySelectorAll('.symptom-btn').forEach(function(btn) {
    var active = selected.indexOf(btn.dataset.key) !== -1;
    btn.style.background  = active ? 'var(--earth)' : 'white';
    btn.style.borderColor = active ? 'var(--earth)' : 'var(--cream-dark)';
    btn.style.color       = active ? 'var(--cream)' : 'var(--earth-mid)';
  });
  var recBtn = document.getElementById('recommend-btn');
  recBtn.disabled        = count === 0;
  recBtn.style.opacity   = count ? '1'                  : '0.6';
  recBtn.style.background= count ? 'var(--gold)'        : 'var(--cream-dark)';
  recBtn.style.color     = count ? 'var(--earth)'       : 'var(--earth-light)';
  recBtn.style.cursor    = count ? 'pointer'            : 'not-allowed';
}

function toggle(key) {
  var idx = selected.indexOf(key);
  if (idx !== -1) { selected.splice(idx, 1); } else { selected.push(key); }
  updateUI();
}

function recommend() {
  if (!selected.length) return;
  var primary = selected[0];
  var base    = window.RECOMMENDATIONS[primary] || window.RECOMMENDATIONS['Fatigue'];
  var extra   = selected.slice(1).reduce(function(acc, s) {
    var h = (window.RECOMMENDATIONS[s] || {}).herbs || [];
    return acc.concat(h.slice(0, 1));
  }, []);
  var herbs = Array.from(new Set(base.herbs.concat(extra))).slice(0, 5);

  var t    = window.I18N_RECOMMENDER;
  var lang = window.LANG;
  var symptomsDisplay = selected.map(function(s) { return window.SYMPTOM_LABELS[s]; }).join(', ');

  var herbTags = herbs.map(function(h) {
    return '<span style="padding:6px 14px;border-radius:20px;background:var(--cream);border:1px solid var(--cream-dark);color:var(--sage);font-size:0.9rem;display:inline-flex;align-items:center;gap:6px;">' + SVG.leaf + ' ' + h + '</span>';
  }).join('');

  document.getElementById('result-section').innerHTML =
    '<div style="background:white;border:1px solid var(--cream-dark);border-radius:16px;padding:40px;margin-bottom:24px;">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
        SVG.sparkles +
        '<span style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--gold);font-weight:500;">' + t.resultLabel + '</span>' +
      '</div>' +
      '<h2 style="font-family:\'Cormorant Garamond\',serif;font-size:2rem;color:var(--earth);margin-bottom:6px;">' + t.basedOn + ' ' + symptomsDisplay + '</h2>' +
      '<div style="margin-top:28px;">' +
        '<h3 style="font-family:\'Cormorant Garamond\',serif;font-size:1.2rem;color:var(--earth);margin-bottom:12px;">' + t.suggestedHerbs + '</h3>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;">' + herbTags + '</div>' +
      '</div>' +
      '<div style="margin-top:24px;padding:20px;background:var(--cream);border-radius:8px;">' +
        '<h3 style="font-family:\'Cormorant Garamond\',serif;font-size:1.2rem;color:var(--earth);margin-bottom:10px;">' + t.howToPrepare + '</h3>' +
        '<p style="color:var(--earth-mid);line-height:1.7;font-size:0.95rem;">' + base.recipe + '</p>' +
      '</div>' +
      '<div style="margin-top:16px;padding:14px 16px;background:#FFF8E1;border-radius:6px;display:flex;gap:10px;align-items:flex-start;">' +
        SVG.alert +
        '<p style="font-size:0.85rem;color:#5D4037;line-height:1.5;"><strong>' + t.important + '</strong> ' + base.caution + ' ' + t.disclaimer + '</p>' +
      '</div>' +
      '<div style="margin-top:28px;padding:20px;background:var(--earth);border-radius:8px;">' +
        '<p style="color:var(--cream-dark);font-size:0.9rem;margin-bottom:12px;">' + t.deeperConsult + '</p>' +
        '<a href="/' + lang + '/sangomas" style="display:inline-flex;align-items:center;gap:8px;background:var(--gold);color:var(--earth);padding:10px 20px;border-radius:4px;font-size:0.9rem;font-weight:500;text-decoration:none;">' +
          t.findSangoma + ' ' + SVG.arrow +
        '</a>' +
      '</div>' +
    '</div>' +
    '<button onclick="startOver()" style="display:flex;align-items:center;gap:6px;color:var(--earth-mid);background:none;border:none;cursor:pointer;font-size:0.9rem;font-family:inherit;">' +
      SVG.rotate + ' ' + t.startOver +
    '</button>';

  document.getElementById('selector-section').style.display = 'none';
  document.getElementById('result-section').style.display   = 'block';
}

function startOver() {
  selected = [];
  updateUI();
  document.getElementById('selector-section').style.display = 'block';
  document.getElementById('result-section').style.display   = 'none';
}

document.querySelectorAll('.symptom-btn').forEach(function(btn) {
  btn.addEventListener('click', function() { toggle(btn.dataset.key); });
});
