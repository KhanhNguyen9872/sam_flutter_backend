// index.js
const API_VERSION = "v1";
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log('--- New Request ---');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Query Params: ${JSON.stringify(req.query)}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  console.log('-------------------');
  next();
});

// Mount existing routes.
app.use(`/api/${API_VERSION}/students`, require(`./${API_VERSION}/routers/studentRoutes`));
app.use(`/api/${API_VERSION}/chatbot`, require(`./${API_VERSION}/routers/chatbotRoutes`));

// Mount the new timetable routes.
app.use(`/api/${API_VERSION}/timetables`, require(`./${API_VERSION}/routers/timetableRoutes`));

app.get('/', (req, res) => {
  res.send('Welcome to the Student API backend!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
