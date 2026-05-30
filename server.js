'use strict';

require('dotenv').config();

const express      = require('express');
const cookieParser = require('cookie-parser');
const path         = require('path');

const db              = require('./db/index');
const recipes         = require('./data/recipes');
const recommendations = require('./data/recommendations');
const registerRouter  = require('./routes/register');

const LOCALES = ['en', 'zu'];
const DEFAULT_LOCALE = 'en';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

function loadLocale(lang) {
  return require(`./locales/${lang}.json`);
}

// Root → redirect to default locale
app.get('/', (req, res) => res.redirect(`/${DEFAULT_LOCALE}`));

// Locale router
const localeRouter = express.Router({ mergeParams: true });

localeRouter.use((req, res, next) => {
  const { lang } = req.params;
  if (!LOCALES.includes(lang)) {
    return res.redirect(`/${DEFAULT_LOCALE}`);
  }
  const otherLang = lang === 'en' ? 'zu' : 'en';
  const subPath = req.path === '/' ? '' : req.path;
  res.locals.lang = lang;
  res.locals.t = loadLocale(lang);
  res.locals.switchUrl = `/${otherLang}${subPath}`;
  res.locals.currentPath = req.path;
  next();
});

localeRouter.get('/', (req, res) => res.render('index'));
localeRouter.get('/sangomas', async (req, res) => {
  try {
    const snap = await db.collection('sangomas')
      .where('status', '==', 'approved')
      .orderBy('rating', 'desc')
      .get();
    const sangomas = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.render('sangomas', { sangomas });
  } catch (err) {
    console.error('Firestore error:', err);
    res.status(500).send('Unable to load sangomas.');
  }
});
localeRouter.get('/recipes', (req, res) => res.render('recipes', { recipes }));
localeRouter.get('/recommender', (req, res) => res.render('recommender', { recommendations }));
localeRouter.use(registerRouter);

app.use('/:lang', localeRouter);

// Export for Vercel serverless; also listen directly when run with `node server.js`
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Sangoma app running at http://localhost:${PORT}`);
  });
}

module.exports = app;

