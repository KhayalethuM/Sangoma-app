'use strict';

require('dotenv').config();

const db     = require('./index');
const seeded = require('../data/sangomas');

async function seed() {
  const col      = db.collection('sangomas');
  const existing = await col.limit(1).get();

  if (!existing.empty) {
    console.log('Sangomas collection already has data — skipping seed.');
    return;
  }

  const batch = db.batch();
  for (const s of seeded) {
    const ref = col.doc(String(s.id));
    batch.set(ref, {
      name:       s.name,
      location:   s.location,
      speciality: s.speciality,
      languages:  s.languages,
      phone:      s.phone,
      email:      'heritage@sangoma.app',
      years:      s.years,
      bio:        '',
      available:  s.available,
      rating:     s.rating,
      reviews:    s.reviews,
      status:     'approved',
      createdAt:  new Date().toISOString(),
    });
  }

  await batch.commit();
  console.log(`Seeded ${seeded.length} sangomas to Firestore.`);
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
