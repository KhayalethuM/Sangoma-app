'use strict';

const express       = require('express');
const router        = express.Router({ mergeParams: true });
const db            = require('../db/index');

const SPECIALITIES  = [
  'Healing & Divination',
  'Spiritual Cleansing',
  'Ancestral Communication',
  'Herbal Medicine',
];

const ALL_LANGUAGES = [
  'Zulu', 'Xhosa', 'Sotho', 'Tswana', 'Venda',
  'Tsonga', 'Swati', 'Ndebele', 'Pedi', 'Afrikaans', 'English',
];

function validate(body) {
  const errors = [];
  const { name, location, speciality, phone, email, years, bio } = body;
  let   languages = body.languages || [];
  if (typeof languages === 'string') languages = [languages];

  if (!name  || name.trim().length  < 2)  errors.push('Full name is required (min 2 characters).');
  if (!location || location.trim().length < 2) errors.push('Location is required.');
  if (!SPECIALITIES.includes(speciality))      errors.push('Please select a valid speciality.');
  if (!phone || phone.trim().length < 5)       errors.push('Phone number is required.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email address is required.');
  const yrs = parseInt(years, 10);
  if (!years || isNaN(yrs) || yrs < 1 || yrs > 80) errors.push('Years of experience must be between 1 and 80.');
  if (!languages.length) errors.push('Please select at least one language.');
  // Prevent XSS — strip leading/trailing whitespace, bio is displayed server-side via EJS (auto-escaped)

  return { errors, languages, yrs };
}

// GET  /:lang/register
router.get('/register', (req, res) => {
  res.render('register', {
    specialities:  SPECIALITIES,
    languagesList: ALL_LANGUAGES,
    errors: [],
    values: {},
  });
});

// POST /:lang/register
router.post('/register', async (req, res) => {
  const { errors, languages, yrs } = validate(req.body);

  if (errors.length) {
    return res.render('register', {
      specialities:  SPECIALITIES,
      languagesList: ALL_LANGUAGES,
      errors,
      values: req.body,
    });
  }

  const { name, location, speciality, phone, email, bio } = req.body;

  await db.collection('sangomas').add({
    name:       name.trim(),
    location:   location.trim(),
    speciality,
    languages,
    phone:      phone.trim(),
    email:      email.trim().toLowerCase(),
    years:      yrs,
    bio:        (bio || '').trim().slice(0, 1000),
    available:  true,
    rating:     0,
    reviews:    0,
    status:     'pending',
    createdAt:  new Date().toISOString(),
  });

  res.render('register-success');
});

module.exports = router;
