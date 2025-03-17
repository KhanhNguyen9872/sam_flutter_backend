require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const studentRoutes = require('./routers/studentRoutes');
const db = require('./utils/db');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware to show detail of each request
app.use((req, res, next) => {
  console.log('--- New Request ---');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Query Params: ${JSON.stringify(req.query)}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  console.log('-------------------');
  next();
});

// Use the student routes under the "/students" path
app.use('/students', studentRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Student API backend!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
