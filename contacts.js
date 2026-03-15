// contacts.js — Returns the list of all registered villagers

const express = require('express');
const router = express.Router();
const { getContacts } = require('./register');

// GET /contacts — Frontend calls this to show the list of villagers
router.get('/', (req, res) => {
  const contacts = getContacts();
  res.json({ count: contacts.length, contacts });
});

module.exports = router;