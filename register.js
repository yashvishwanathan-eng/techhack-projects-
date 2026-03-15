// register.js — Saves a villager's phone number to Firebase

const express = require('express');
const router = express.Router();

// Temporary in-memory storage (works for hackathon demo without Firebase setup)
let registeredContacts = [];

// POST /register — Frontend sends villager data here
router.post('/', (req, res) => {
  const { name, phone, village, language } = req.body;

  // Basic validation
  if (!name || !phone || !village || !language) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Save to our list
  const newContact = {
    id: Date.now(), // simple unique ID
    name,
    phone,
    village,
    language,
    registeredAt: new Date().toISOString()
  };

  registeredContacts.push(newContact);

  console.log(`✅ Registered: ${name} from ${village} (${phone})`);
  res.status(201).json({ message: 'Registered successfully!', contact: newContact });
});

// Export the list so other files can use it
module.exports = router;
module.exports.getContacts = () => registeredContacts;