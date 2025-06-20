// server/app.js
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use('/api', apiRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
