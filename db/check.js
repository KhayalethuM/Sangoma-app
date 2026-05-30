'use strict';
const db = require('./index');

const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='sangomas'").get();
console.log('=== SCHEMA ===');
console.log(schema.sql);

console.log('\n=== PRAGMAS ===');
console.log('integrity_check :', db.pragma('integrity_check'));
console.log('foreign_keys    :', db.pragma('foreign_keys'));
console.log('journal_mode    :', db.pragma('journal_mode'));

console.log('\n=== DATA ===');
console.log('Total rows  :', db.prepare('SELECT COUNT(*) AS c FROM sangomas').get());
console.log('Approved    :', db.prepare("SELECT COUNT(*) AS c FROM sangomas WHERE status='approved'").get());
console.log('Pending     :', db.prepare("SELECT COUNT(*) AS c FROM sangomas WHERE status='pending'").get());

console.log('\n=== CONSTRAINT CHECKS ===');
console.log('NULL fields :', db.prepare("SELECT COUNT(*) AS c FROM sangomas WHERE name IS NULL OR email IS NULL OR speciality IS NULL OR languages IS NULL").get());
console.log('Bad status  :', db.prepare("SELECT COUNT(*) AS c FROM sangomas WHERE status NOT IN ('pending','approved','rejected')").get());
console.log('Bad years   :', db.prepare("SELECT COUNT(*) AS c FROM sangomas WHERE years < 1 OR years > 80").get());
console.log('Empty langs :', db.prepare("SELECT COUNT(*) AS c FROM sangomas WHERE languages = ''").get());
