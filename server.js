// server.js — This is the main entry point of your backend

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // loads your .env file

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware — allows requests from frontend and parses JSON
app.use(cors());
app.use(express.json());

// Routes — each file handles a different task
const registerRoute = require('./routes/register');
const contactsRoute = require('./routes/contacts');
const alertRoute = require('./routes/alert');

app.use('/register', registerRoute);
app.use('/contacts', contactsRoute);
app.use('/send-alert', alertRoute);

// Health check — open this in browser to confirm server is running
app.get('/', (req, res) => {
  res.send('✅ Bhoomi Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});