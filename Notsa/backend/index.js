const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/notes', require('./routes/notes'));

app.listen(PORT, () => console.log(`Notsa server is running on port: ${PORT}`));