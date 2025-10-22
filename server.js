const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
dotenv.config();
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
app.use(cors());
app.use(express.json());
connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get(/^\/(?!api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
